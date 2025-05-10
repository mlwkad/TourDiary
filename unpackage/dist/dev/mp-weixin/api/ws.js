"use strict";
const common_vendor = require("../common/vendor.js");
let socketTask = null;
let isConnecting = false;
let messageCallback = null;
let connectionTimeout = null;
const getWebSocketConnection = () => {
  return new Promise((resolve, reject) => {
    if (socketTask) {
      resolve(socketTask);
      return;
    }
    if (isConnecting) {
      const checkConnection = setInterval(() => {
        if (socketTask) {
          clearInterval(checkConnection);
          resolve(socketTask);
        }
      }, 100);
      setTimeout(() => {
        if (!socketTask) {
          clearInterval(checkConnection);
          isConnecting = false;
          reject(new Error("连接超时"));
        }
      }, 5e3);
      return;
    }
    isConnecting = true;
    const wsUrl = `wss://ovmmqfovxbil.sealosbja.site`;
    try {
      socketTask = common_vendor.index.connectSocket({
        url: wsUrl,
        success: () => {
        },
        fail: (error) => {
          common_vendor.index.__f__("log", "at api/ws.js:43", "WebSocket连接失败:", error);
          isConnecting = false;
          reject(error);
        }
      });
      connectionTimeout = setTimeout(() => {
        if (!socketTask) {
          isConnecting = false;
          reject(new Error("连接超时"));
        }
      }, 5e3);
      socketTask.onOpen(() => {
        if (connectionTimeout)
          clearTimeout(connectionTimeout);
        isConnecting = false;
        resolve(socketTask);
      });
      socketTask.onMessage((res) => {
        try {
          const data = JSON.parse(res.data);
          if (messageCallback) {
            switch (data.type) {
              case "chat":
                messageCallback({
                  // 触发回调函数
                  type: "update",
                  content: data.content,
                  onlineInfo: data.onlineInfo
                });
                break;
              case "done":
                messageCallback({
                  type: "complete",
                  content: data.content,
                  totalTokens: data.totalTokens
                });
                break;
              case "error":
                messageCallback({
                  type: "error",
                  error: data.error
                });
                break;
              case "end":
                messageCallback({
                  type: "end"
                });
                break;
            }
          }
        } catch (e) {
          common_vendor.index.__f__("log", "at api/ws.js:99", "解析WebSocket消息失败:", e);
        }
      });
      socketTask.onError((err) => {
        common_vendor.index.__f__("log", "at api/ws.js:104", "socketTask发生错误:", err);
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
        socketTask = null;
        isConnecting = false;
        reject(err);
      });
      socketTask.onClose(() => {
        common_vendor.index.__f__("log", "at api/ws.js:114", "WebSocket连接已关闭");
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
        socketTask = null;
        isConnecting = false;
      });
    } catch (error) {
      common_vendor.index.__f__("log", "at api/ws.js:122", "创建WebSocket连接时发生错误:", error);
      isConnecting = false;
      reject(error);
    }
  });
};
const streamChat = (message, onUpdate) => {
  messageCallback = onUpdate;
  getWebSocketConnection().then((task) => {
    task.send({
      // 发送消息
      data: JSON.stringify({
        type: "chat",
        message
      }),
      success: () => {
      },
      fail: (error) => {
        onUpdate && onUpdate({
          // 存在onUpdate回调函数,才触发回调函数
          type: "error",
          error: "发送消息失败" + error.message
        });
      }
    });
  }).catch((error) => {
    onUpdate && onUpdate({
      type: "error",
      error: "WebSocket连接失败: " + error.message
    });
  });
};
exports.streamChat = streamChat;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/ws.js.map
