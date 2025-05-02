"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "dev",
  setup(__props) {
    const navigateTo = (url) => {
      const tabBarPages = [
        "/pages/index/index",
        "/pages/My/My",
        "/pages/Release/Release"
      ];
      if (tabBarPages.includes(url)) {
        common_vendor.index.switchTab({
          url
        });
      } else {
        common_vendor.index.navigateTo({
          url
        });
      }
    };
    const clearStorage = () => {
      common_vendor.index.clearStorageSync();
      common_vendor.index.showToast({
        title: "存储已清除",
        icon: "success"
      });
    };
    const simulateLogin = () => {
      const userInfo = {
        nickName: "测试用户",
        avatarUrl: "/static/666.jpg",
        userId: "test-" + Date.now()
      };
      common_vendor.index.setStorageSync("token", "test-token");
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
      common_vendor.index.showToast({
        title: "已设置登录状态",
        icon: "success"
      });
      common_vendor.index.showModal({
        title: "提示",
        content: '已模拟登录状态，是否跳转到"我的"页面查看效果？',
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.switchTab({
              url: "/pages/My/My"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => navigateTo("/pages/index/index")),
        b: common_vendor.o(($event) => navigateTo("/pages/My/My")),
        c: common_vendor.o(($event) => navigateTo("/pages/Release/Release")),
        d: common_vendor.o(($event) => navigateTo("/pages/login/login")),
        e: common_vendor.o(($event) => navigateTo("/pages/register/register")),
        f: common_vendor.o(clearStorage),
        g: common_vendor.o(simulateLogin)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1646091e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dev/dev.js.map
