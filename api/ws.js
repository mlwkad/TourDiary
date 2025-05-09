// WebSocket
let socketTask = null
let isConnecting = false
let messageCallback = null
let connectionTimeout = null

// 创建或获取WebSocket连接
const getWebSocketConnection = () => {
    return new Promise((resolve, reject) => {

        // 如果已有连接，直接返回
        if (socketTask) {
            resolve(socketTask)
            return
        }
        // 正在连接 轮训检查
        if (isConnecting) {
            const checkConnection = setInterval(() => {
                if (socketTask) {
                    clearInterval(checkConnection)
                    resolve(socketTask)
                }
            }, 100)
            // 添加超时处理
            setTimeout(() => {
                if (!socketTask) {
                    clearInterval(checkConnection)
                    isConnecting = false
                    reject(new Error('连接超时'))  // catch里打印err.message
                }
            }, 5000)
            return
        }

        // 创建新连接
        isConnecting = true
        const wsUrl = `ws://localhost:3000`
        try {
            socketTask = uni.connectSocket({
                url: wsUrl,
                success: () => { },
                fail: (error) => {
                    console.log('WebSocket连接失败:', error)
                    isConnecting = false
                    reject(error)
                }
            })
            // 设置连接超时
            connectionTimeout = setTimeout(() => {
                if (!socketTask) {
                    isConnecting = false
                    reject(new Error('连接超时'))
                }
            }, 5000)
            // 监听WebSocket连接打开
            socketTask.onOpen(() => {
                if (connectionTimeout) clearTimeout(connectionTimeout)
                isConnecting = false
                // 成功打开,返回socketTask实例
                resolve(socketTask)
                // resolve()或者reject()不会终止Promise内部代码的继续执行
                // 只是将Promise的状态设置为resolve或者reject
                // 此时可以使用.then()或者.catch()访问到resolve或者reject的值
            })
            // 监听WebSocket消息
            socketTask.onMessage((res) => {
                try {
                    const data = JSON.parse(res.data)
                    if (messageCallback) {
                        switch (data.type) {
                            case 'chat':
                                messageCallback({  // 触发回调函数
                                    type: 'update',
                                    content: data.content,
                                    onlineInfo: data.onlineInfo
                                })
                                break
                            case 'done':
                                messageCallback({
                                    type: 'complete',
                                    content: data.content,
                                    totalTokens: data.totalTokens
                                })
                                break
                            case 'error':
                                messageCallback({
                                    type: 'error',
                                    error: data.error
                                })
                                break
                            case 'end':
                                messageCallback({
                                    type: 'end'
                                })
                                break
                        }
                    }
                } catch (e) {
                    console.log('解析WebSocket消息失败:', e)
                }
            })
            // 监听WebSocket错误
            socketTask.onError((err) => {
                console.log('socketTask发生错误:', err)
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout)
                }
                socketTask = null
                isConnecting = false
                reject(err)
            })
            // 监听WebSocket关闭
            socketTask.onClose(() => {
                console.log('WebSocket连接已关闭')
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout)
                }
                socketTask = null
                isConnecting = false
            })
        } catch (error) {
            console.log('创建WebSocket连接时发生错误:', error)
            isConnecting = false
            reject(error)
        }
    })
}

// 导出的主函数
export const streamChat = (message, onUpdate) => {
    // 保存回调函数
    messageCallback = onUpdate
    // 获取连接并发送消息
    getWebSocketConnection()
        .then((task) => {
            task.send({  // 发送消息
                data: JSON.stringify({
                    type: 'chat',
                    message: message
                }),
                success: () => { },
                fail: (error) => {
                    onUpdate && onUpdate({  // 存在onUpdate回调函数,才触发回调函数
                        type: 'error',
                        error: '发送消息失败' + error.message
                    })
                }
            })
        })
        .catch((error) => {
            onUpdate && onUpdate({
                type: 'error',
                error: 'WebSocket连接失败: ' + error.message
            });
        });
};

// 关闭WebSocket连接
export const closeWebSocket = () => {
    if (connectionTimeout) {
        clearTimeout(connectionTimeout)
    }
    if (socketTask) {
        socketTask.close({
            success: () => {
                console.log('WebSocket连接已关闭')
            },
            fail: (error) => {
                console.log('关闭WebSocket连接失败:', error)
            }
        })
        socketTask = null
        messageCallback = null
    }
}