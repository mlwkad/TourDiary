"use strict";
const common_vendor = require("../common/vendor.js");
let baseUrl = "";
{
  baseUrl = "https://vkxvigkepssq.sealosbja.site";
}
function http(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: baseUrl + url,
      data,
      method,
      header: {
        "token": common_vendor.index.getStorageSync("token") || ""
      },
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          if (res.data.success === true) {
            resolve(res.data.data || res.data);
          } else {
            common_vendor.index.showToast({
              title: res.data.message,
              icon: "none"
            });
            reject(res.data.message);
          }
        } else {
          common_vendor.index.showToast({
            title: res.data.message || "请求失败",
            icon: "none"
          });
          reject(res.data.message);
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("log", "at api/http.js:60", err);
        common_vendor.index.showToast({
          title: "服务请求异常",
          icon: "none"
        });
        reject(err);
      }
    });
  });
}
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/http.js.map
