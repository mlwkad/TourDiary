// * 基于websocket
// * 1.流式接收消息
// * 2.模拟打字机效果,打字速度会越来越快
// * 3.ws连接 超时处理
// * 4.连接复用

// WebSocket
let socketTask = null
let isConnecting = false
let messageCallback = null
let connectionTimeout = null

// 创建或获取WebSocket连接
const getWebSocketConnection = () => {
    return new Promise((resolve, reject) => {
        if (socketTask) {
            resolve(socketTask)
            return
        }
        if (isConnecting) {
            const checkConnection = setInterval(() => {
                if (socketTask) {
                    clearInterval(checkConnection)
                    resolve(socketTask)
                }
            }, 100)
            setTimeout(() => {
                if (!socketTask) {
                    clearInterval(checkConnection)
                    isConnecting = false
                    reject(new Error('连接超时'))
                }
            }, 5000)
            return
        }

        // 创建新连接
        isConnecting = true
        const wsUrl = `wss://ovmmqfovxbil.sealosbja.site`
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
            // 超时
            connectionTimeout = setTimeout(() => {
                if (!socketTask) {
                    isConnecting = false
                    reject(new Error('连接超时'))
                }
            }, 5000)
            socketTask.onOpen(() => {
                if (connectionTimeout) clearTimeout(connectionTimeout)
                isConnecting = false
                resolve(socketTask)
            })
            socketTask.onMessage((res) => {
                try {
                    const data = JSON.parse(res.data)
                    if (messageCallback) {
                        switch (data.type) {
                            case 'chat':
                                messageCallback({  // 触发回调
                                    type: 'update',
                                    content: data.content
                                })
                                break
                            case 'done':
                                messageCallback({
                                    type: 'complete',
                                    content: data.content
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
            socketTask.onError((err) => {
                console.log('socketTask发生错误:', err)
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout)
                }
                socketTask = null
                isConnecting = false
                reject(err)
            })
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

export const streamChat = (message, onUpdate) => {
    // 保存回调
    messageCallback = onUpdate
    getWebSocketConnection()
        .then((task) => {
            task.send({
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
            })
        })
}

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