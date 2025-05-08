// WebSocket聊天工具
let socketTask = null;
let isConnecting = false;
let messageCallback = null;
let connectionTimeout = null;

// 创建或获取WebSocket连接
const getWebSocketConnection = () => {
    return new Promise((resolve, reject) => {
        console.log('开始建立WebSocket连接...');

        // 如果已有连接，直接返回
        if (socketTask) {
            console.log('使用现有WebSocket连接');
            resolve(socketTask);
            return;
        }

        // 如果正在连接中，等待连接完成
        if (isConnecting) {
            console.log('WebSocket正在连接中，等待连接完成...');
            const checkConnection = setInterval(() => {
                if (socketTask) {
                    console.log('WebSocket连接等待完成');
                    clearInterval(checkConnection);
                    resolve(socketTask);
                }
            }, 100);

            // 添加超时处理
            setTimeout(() => {
                if (!socketTask) {
                    console.log('WebSocket连接超时');
                    clearInterval(checkConnection);
                    isConnecting = false;
                    reject(new Error('连接超时'));
                }
            }, 5000); // 5秒超时

            return;
        }

        // 创建新连接
        console.log('创建新的WebSocket连接');
        isConnecting = true;
        const wsUrl = `ws://localhost:3000`;
        console.log('WebSocket URL:', wsUrl);

        try {
            // 创建WebSocket连接
            socketTask = uni.connectSocket({
                url: wsUrl,
                success: () => {
                    console.log('WebSocket连接请求已发送');
                },
                fail: (error) => {
                    console.error('WebSocket连接失败:', error);
                    isConnecting = false;
                    reject(error);
                }
            });

            // 设置连接超时
            connectionTimeout = setTimeout(() => {
                if (!socketTask) {
                    console.log('WebSocket连接超时');
                    isConnecting = false;
                    reject(new Error('连接超时'));
                }
            }, 5000); // 5秒超时

            // 监听WebSocket连接打开
            socketTask.onOpen(() => {
                console.log('WebSocket连接已打开');
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }
                isConnecting = false;
                resolve(socketTask);
            });

            // 监听WebSocket消息
            socketTask.onMessage((res) => {
                console.log('收到服务器消息:', res.data);
                try {
                    const data = JSON.parse(res.data);
                    console.log('解析后的消息数据:', data);

                    if (messageCallback) {
                        switch (data.type) {
                            case 'chat':
                                messageCallback({
                                    type: 'update',
                                    content: data.content,
                                    onlineInfo: data.onlineInfo
                                });
                                break;
                            case 'done':
                                messageCallback({
                                    type: 'complete',
                                    content: data.content,
                                    totalTokens: data.totalTokens
                                });
                                break;
                            case 'error':
                                messageCallback({
                                    type: 'error',
                                    error: data.error
                                });
                                break;
                            case 'end':
                                messageCallback({
                                    type: 'end'
                                });
                                break;
                        }
                    }
                } catch (e) {
                    console.error('解析WebSocket消息失败:', e);
                }
            });

            // 监听WebSocket错误
            socketTask.onError((res) => {
                console.error('WebSocket发生错误:', res);
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }
                socketTask = null;
                isConnecting = false;
                reject(res);
            });

            // 监听WebSocket关闭
            socketTask.onClose(() => {
                console.log('WebSocket连接已关闭');
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }
                socketTask = null;
                isConnecting = false;
            });

        } catch (error) {
            console.error('创建WebSocket连接时发生错误:', error);
            isConnecting = false;
            reject(error);
        }
    });
};

// 导出的主函数
export const streamChat = (message, onUpdate) => {
    console.log('开始发送消息:', message);

    // 保存回调函数
    messageCallback = onUpdate;

    // 获取连接并发送消息
    getWebSocketConnection()
        .then((task) => {
            console.log('WebSocket连接成功，准备发送消息');
            // 发送消息
            task.send({
                data: JSON.stringify({
                    type: 'chat',
                    message: message
                }),
                success: () => {
                    console.log('消息发送成功');
                },
                fail: (error) => {
                    console.error('发送消息失败:', error);
                    onUpdate && onUpdate({
                        type: 'error',
                        error: '发送消息失败'
                    });
                }
            });
        })
        .catch((error) => {
            console.error('WebSocket连接失败:', error);
            onUpdate && onUpdate({
                type: 'error',
                error: 'WebSocket连接失败: ' + error.message
            });
        });
};

// 关闭WebSocket连接
export const closeWebSocket = () => {
    console.log('准备关闭WebSocket连接');
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
    }
    if (socketTask) {
        socketTask.close({
            success: () => {
                console.log('WebSocket连接已关闭');
            },
            fail: (error) => {
                console.error('关闭WebSocket连接失败:', error);
            }
        });
        socketTask = null;
        messageCallback = null;
    }
}; 