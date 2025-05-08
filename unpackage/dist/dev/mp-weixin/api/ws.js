"use strict";
const common_vendor = require("../common/vendor.js");
let socketTask = null;
let isConnecting = false;
let messageCallback = null;
let connectionTimeout = null;
const getWebSocketConnection = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.__f__("log", "at api/ws.js:10", "开始建立WebSocket连接...");
    if (socketTask) {
      common_vendor.index.__f__("log", "at api/ws.js:14", "使用现有WebSocket连接");
      resolve(socketTask);
      return;
    }
    if (isConnecting) {
      common_vendor.index.__f__("log", "at api/ws.js:21", "WebSocket正在连接中，等待连接完成...");
      const checkConnection = setInterval(() => {
        if (socketTask) {
          common_vendor.index.__f__("log", "at api/ws.js:24", "WebSocket连接等待完成");
          clearInterval(checkConnection);
          resolve(socketTask);
        }
      }, 100);
      setTimeout(() => {
        if (!socketTask) {
          common_vendor.index.__f__("log", "at api/ws.js:33", "WebSocket连接超时");
          clearInterval(checkConnection);
          isConnecting = false;
          reject(new Error("连接超时"));
        }
      }, 5e3);
      return;
    }
    common_vendor.index.__f__("log", "at api/ws.js:44", "创建新的WebSocket连接");
    isConnecting = true;
    const wsUrl = `ws://localhost:3000`;
    common_vendor.index.__f__("log", "at api/ws.js:47", "WebSocket URL:", wsUrl);
    try {
      socketTask = common_vendor.index.connectSocket({
        url: wsUrl,
        success: () => {
          common_vendor.index.__f__("log", "at api/ws.js:54", "WebSocket连接请求已发送");
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at api/ws.js:57", "WebSocket连接失败:", error);
          isConnecting = false;
          reject(error);
        }
      });
      connectionTimeout = setTimeout(() => {
        if (!socketTask) {
          common_vendor.index.__f__("log", "at api/ws.js:66", "WebSocket连接超时");
          isConnecting = false;
          reject(new Error("连接超时"));
        }
      }, 5e3);
      socketTask.onOpen(() => {
        common_vendor.index.__f__("log", "at api/ws.js:74", "WebSocket连接已打开");
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
        isConnecting = false;
        resolve(socketTask);
      });
      socketTask.onMessage((res) => {
        common_vendor.index.__f__("log", "at api/ws.js:84", "收到服务器消息:", res.data);
        try {
          const data = JSON.parse(res.data);
          common_vendor.index.__f__("log", "at api/ws.js:87", "解析后的消息数据:", data);
          if (messageCallback) {
            switch (data.type) {
              case "chat":
                messageCallback({
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
          common_vendor.index.__f__("error", "at api/ws.js:119", "解析WebSocket消息失败:", e);
        }
      });
      socketTask.onError((res) => {
        common_vendor.index.__f__("error", "at api/ws.js:125", "WebSocket发生错误:", res);
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
        socketTask = null;
        isConnecting = false;
        reject(res);
      });
      socketTask.onClose(() => {
        common_vendor.index.__f__("log", "at api/ws.js:136", "WebSocket连接已关闭");
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
        socketTask = null;
        isConnecting = false;
      });
    } catch (error) {
      common_vendor.index.__f__("error", "at api/ws.js:145", "创建WebSocket连接时发生错误:", error);
      isConnecting = false;
      reject(error);
    }
  });
};
const streamChat = (message, onUpdate) => {
  common_vendor.index.__f__("log", "at api/ws.js:154", "开始发送消息:", message);
  messageCallback = onUpdate;
  getWebSocketConnection().then((task) => {
    common_vendor.index.__f__("log", "at api/ws.js:162", "WebSocket连接成功，准备发送消息");
    task.send({
      data: JSON.stringify({
        type: "chat",
        message
      }),
      success: () => {
        common_vendor.index.__f__("log", "at api/ws.js:170", "消息发送成功");
      },
      fail: (error) => {
        common_vendor.index.__f__("error", "at api/ws.js:173", "发送消息失败:", error);
        onUpdate && onUpdate({
          type: "error",
          error: "发送消息失败"
        });
      }
    });
  }).catch((error) => {
    common_vendor.index.__f__("error", "at api/ws.js:182", "WebSocket连接失败:", error);
    onUpdate && onUpdate({
      type: "error",
      error: "WebSocket连接失败: " + error.message
    });
  });
};
exports.streamChat = streamChat;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/ws.js.map
