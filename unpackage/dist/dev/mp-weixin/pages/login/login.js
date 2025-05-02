"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const handleLogin = () => {
      if (!username.value || !password.value) {
        common_vendor.index.showToast({
          title: "请输入用户名和密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const userInfo = {
          nickName: username.value,
          avatarUrl: "/static/666.jpg",
          userId: "12345"
        };
        common_vendor.index.setStorageSync("token", "sample-token");
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1500);
    };
    const wechatLogin = () => {
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      common_vendor.index.getUserInfo({
        success(data) {
          common_vendor.index.__f__("log", "at pages/login/login.vue:101", "data", data);
        }
      });
      common_vendor.index.getUserProfile({
        success(data) {
          common_vendor.index.__f__("log", "at pages/login/login.vue:107", "AAAdata", data);
        }
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const userInfo = {
          nickName: "微信用户",
          avatarUrl: "/static/666.jpg",
          userId: "wx12345"
        };
        common_vendor.index.setStorageSync("token", "wx-token");
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1500);
    };
    const forgetPassword = () => {
      common_vendor.index.showToast({
        title: "忘记密码功能暂未开放",
        icon: "none"
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(goBack),
        c: common_assets._imports_1$1,
        d: username.value,
        e: common_vendor.o(($event) => username.value = $event.detail.value),
        f: password.value,
        g: common_vendor.o(($event) => password.value = $event.detail.value),
        h: common_vendor.o(forgetPassword),
        i: common_vendor.o(goToRegister),
        j: common_vendor.o(handleLogin),
        k: common_vendor.o(wechatLogin)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
