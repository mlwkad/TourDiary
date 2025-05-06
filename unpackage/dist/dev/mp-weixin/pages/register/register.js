"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "register",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const confirmPassword = common_vendor.ref("");
    const handleRegister = () => {
      if (!username.value || !password.value || !confirmPassword.value) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      if (username.value.length < 3) {
        common_vendor.index.showToast({
          title: "用户名长度应大于3小于20位",
          icon: "none"
        });
        return;
      }
      if (password.value !== confirmPassword.value) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "注册中..."
      });
      const userInfo = {
        nickName: username.value,
        avatarUrl: "/static/666.jpg",
        userId: ""
      };
      try {
        api_api.signUp({
          userName: username.value,
          passWord: password.value
        }).then(async (res) => {
          common_vendor.index.__f__("log", "at pages/register/register.vue:97", res);
          userInfo.nickName = username.value;
          userInfo.avatarUrl = "/static/666.jpg";
          userInfo.userId = res.userID;
          common_vendor.index.setStorageSync("token", "sample-token");
          common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
          common_vendor.index.hideLoading();
          await new Promise((resolve) => {
            common_vendor.index.showToast({
              title: "注册成功",
              icon: "success"
            });
            setTimeout(() => {
              resolve();
            }, 1e3);
          });
          common_vendor.index.navigateBack();
        });
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/register/register.vue:117", error);
      }
    };
    const wechatRegister = () => {
      common_vendor.index.showLoading({
        title: "注册中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const userInfo = {
          nickName: "微信用户",
          avatarUrl: "/static/666.jpg",
          userId: "wx" + Date.now()
        };
        common_vendor.index.setStorageSync("token", "wx-token");
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack({
            delta: 2
            // 返回两层，跳过登录页回到我的页面
          });
        }, 1500);
      }, 1500);
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToLogin = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$2,
        b: common_vendor.o(goBack),
        c: common_assets._imports_0,
        d: username.value,
        e: common_vendor.o(($event) => username.value = $event.detail.value),
        f: password.value,
        g: common_vendor.o(($event) => password.value = $event.detail.value),
        h: confirmPassword.value,
        i: common_vendor.o(($event) => confirmPassword.value = $event.detail.value),
        j: common_vendor.o(goToLogin),
        k: common_vendor.o(handleRegister),
        l: common_vendor.o(wechatRegister)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
