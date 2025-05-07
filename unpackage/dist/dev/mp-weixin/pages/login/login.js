"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
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
      const userInfo = {
        nickName: username.value,
        avatarUrl: "/static/666.jpg",
        userId: "12345"
      };
      try {
        api_api.checkLogin({
          userName: username.value,
          passWord: password.value
        }).then(async (res) => {
          await new Promise((resolve) => {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              resolve();
            }, 1e3);
          });
          common_vendor.index.__f__("log", "at pages/login/login.vue:84", res);
          userInfo.userId = res.userID;
          userInfo.nickName = username.value;
          userInfo.avatarUrl = "/static/666.jpg";
          await common_vendor.index.setStorageSync("token", "sample-token");
          await common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
          common_vendor.index.navigateBack();
        }).catch((err) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:93", err);
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/login/login.vue:96", e);
      }
    };
    const wechatLogin = async () => {
      try {
        const modalRes = await new Promise((resolve) => {
          common_vendor.index.showModal({
            title: "温馨提示",
            content: "需要您授权获取个人信息",
            success: resolve
          });
        });
        if (!modalRes.confirm)
          return;
        const userProfileRes = await new Promise((resolve, reject) => {
          common_vendor.index.getUserProfile({
            desc: "需要获取您的微信昵称和头像",
            success: resolve,
            fail: reject
          });
        }).catch((err) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:120", "获取用户信息失败", err);
          common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
          throw new Error("用户拒绝授权");
        });
        const { encryptedData, iv } = userProfileRes;
        const loginRes = await new Promise((resolve) => {
          common_vendor.index.login({ success: resolve });
        });
        try {
          const sessionKeyRes = await api_api.getSessionKey("", { code: loginRes });
          const userInfoRes = await api_api.getWXUserInfo("", {
            encryptedData,
            iv,
            sessionKey: sessionKeyRes.sessionKey
          }, "POST");
          const userInfo = {
            nickName: userInfoRes.nickName,
            avatarUrl: userInfoRes.avatarUrl,
            userId: ""
          };
          common_vendor.index.setStorageSync("token", "wx-token");
          common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => common_vendor.index.navigateBack(), 1e3);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/login/login.vue:151", "微信登录失败", error);
          common_vendor.index.showToast({ title: "登录失败，请稍后重试", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:155", "微信登录过程异常", error);
      }
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
        a: common_assets._imports_0$1,
        b: common_vendor.o(goBack),
        c: common_assets._imports_0,
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
