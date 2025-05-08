"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const utils_filter = require("../../utils/filter.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "register",
  setup(__props) {
    const username = common_vendor.ref("");
    const confirmUsername = common_vendor.ref("");
    const password = common_vendor.ref("");
    const confirmPassword = common_vendor.ref("");
    const errors = common_vendor.reactive({
      username: "",
      confirmUsername: "",
      password: "",
      confirmPassword: ""
    });
    const validateForm = () => {
      let isValid = true;
      for (let key in errors) {
        errors[key] = "";
      }
      const usernameVal = utils_filter.validateUsername(username.value);
      if (!usernameVal.isValid) {
        errors.username = usernameVal.message;
        isValid = false;
      } else {
        username.value = usernameVal.filteredText;
      }
      const confirmUsernameVal = utils_filter.validateUsername(confirmUsername.value);
      if (!confirmUsernameVal.isValid) {
        errors.confirmUsername = confirmUsernameVal.message;
        isValid = false;
      } else {
        confirmUsername.value = confirmUsernameVal.filteredText;
      }
      const passwordVal = utils_filter.validatePassword(password.value);
      if (!passwordVal.isValid) {
        errors.password = passwordVal.message;
        isValid = false;
      }
      const confirmPasswordVal = utils_filter.validatePassword(confirmPassword.value);
      if (!confirmPasswordVal.isValid) {
        errors.confirmPassword = confirmPasswordVal.message;
        isValid = false;
      } else if (password.value !== confirmPassword.value) {
        errors.confirmPassword = "两次输入的密码不一致";
        isValid = false;
      }
      return isValid;
    };
    const handleRegister = () => {
      if (!validateForm()) {
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
          common_vendor.index.__f__("log", "at pages/register/register.vue:128", res);
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
        }).catch((err) => {
          common_vendor.index.__f__("log", "at pages/register/register.vue:147", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "注册失败，请稍后重试",
            icon: "none"
          });
        });
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/register/register.vue:155", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "注册失败，请稍后重试",
          icon: "none"
        });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToLogin = () => {
      common_vendor.index.navigateBack();
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
        h: common_vendor.o([($event) => confirmUsername.value = $event.detail.value, ($event) => errors.confirmUsername = ""]),
        i: confirmUsername.value,
        j: errors.confirmUsername
      }, errors.confirmUsername ? {
        k: common_vendor.t(errors.confirmUsername)
      } : {}, {
        l: common_vendor.o([($event) => password.value = $event.detail.value, ($event) => errors.password = ""]),
        m: password.value,
        n: errors.password
      }, errors.password ? {
        o: common_vendor.t(errors.password)
      } : {}, {
        p: common_vendor.o([($event) => confirmPassword.value = $event.detail.value, ($event) => errors.confirmPassword = ""]),
        q: confirmPassword.value,
        r: errors.confirmPassword
      }, errors.confirmPassword ? {
        s: common_vendor.t(errors.confirmPassword)
      } : {}, {
        t: common_vendor.o(goToLogin),
        v: common_vendor.o(handleRegister)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
