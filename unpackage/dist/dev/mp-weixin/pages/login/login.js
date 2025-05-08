"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const errors = common_vendor.reactive({
      username: "",
      password: ""
    });
    const validateUsername = (username2) => {
      if (!username2.trim()) {
        return { isValid: false, message: "用户名不能为空" };
      }
      if (username2.length < 3) {
        return { isValid: false, message: "用户名不能少于3个字符" };
      }
      if (username2.length > 20) {
        return { isValid: false, message: "用户名不能超过20个字符" };
      }
      const usernamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      if (!usernamePattern.test(username2)) {
        return { isValid: false, message: "用户名只能包含字母、数字、下划线和中文" };
      }
      return { isValid: true, message: "" };
    };
    const validatePassword = (password2) => {
      if (!password2) {
        return { isValid: false, message: "密码不能为空" };
      }
      if (password2.length < 6) {
        return { isValid: false, message: "密码不能少于6个字符" };
      }
      if (password2.length > 20) {
        return { isValid: false, message: "密码不能超过20个字符" };
      }
      return { isValid: true, message: "" };
    };
    const validateForm = () => {
      let isValid = true;
      const usernameVal = validateUsername(username.value);
      if (!usernameVal.isValid) {
        errors.username = usernameVal.message;
        isValid = false;
      }
      const passwordVal = validatePassword(password.value);
      if (!passwordVal.isValid) {
        errors.password = passwordVal.message;
        isValid = false;
      }
      return isValid;
    };
    const handleLogin = () => {
      if (!validateForm()) {
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
          userInfo.userId = res.userID;
          userInfo.nickName = username.value;
          userInfo.avatarUrl = "/static/666.jpg";
          await common_vendor.index.setStorageSync("token", "sample-token");
          await common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
          common_vendor.index.navigateBack();
        }).catch((err) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:146", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录失败，请检查用户名和密码",
            icon: "none"
          });
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/login/login.vue:154", e);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "登录失败，请稍后重试",
          icon: "none"
        });
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
          common_vendor.index.__f__("log", "at pages/login/login.vue:183", "获取用户信息失败", err);
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
          common_vendor.index.__f__("error", "at pages/login/login.vue:214", "微信登录失败", error);
          common_vendor.index.showToast({ title: "登录失败，请稍后重试", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:218", "微信登录过程异常", error);
      }
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
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: common_vendor.o(goBack),
        c: common_assets._imports_0,
        d: common_vendor.o([($event) => username.value = $event.detail.value, ($event) => errors.username = ""]),
        e: username.value,
        f: errors.username
      }, errors.username ? {
        g: common_vendor.t(errors.username)
      } : {}, {
        h: common_vendor.o([($event) => password.value = $event.detail.value, ($event) => errors.password = ""]),
        i: password.value,
        j: errors.password
      }, errors.password ? {
        k: common_vendor.t(errors.password)
      } : {}, {
        l: common_vendor.o(goToRegister),
        m: common_vendor.o(handleLogin),
        n: common_vendor.o(wechatLogin)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
