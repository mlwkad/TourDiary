"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const utils_filter = require("../../utils/filter.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "register",
  setup(__props) {
    const username = common_vendor.ref("");
    const confirmUsername = common_vendor.ref("");
    const password = common_vendor.ref("");
    const confirmPassword = common_vendor.ref("");
    const avatarUrl = common_vendor.ref("/static/public/defaultAvatar.png");
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
    const handleRegister = async () => {
      if (!validateForm()) {
        return;
      }
      common_vendor.index.showLoading({
        title: "注册中..."
      });
      const userInfo = {
        nickName: username.value,
        avatarUrl: "",
        userId: ""
      };
      try {
        const res = await api_api.signUp({
          userName: username.value,
          passWord: password.value,
          avatar: avatarUrl.value
        });
        userInfo.nickName = username.value;
        userInfo.avatarUrl = avatarUrl.value;
        userInfo.userId = res.userID;
        common_vendor.index.setStorageSync("token", res.userID);
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/register/register.vue:138", e);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "注册失败，请稍后重试",
          icon: "none"
        });
      }
    };
    const changeAvatar = () => {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          avatarUrl.value = res.tempFilePaths;
        }
      });
    };
    const goToLogin = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onShow(() => {
      avatarUrl.value = "/static/public/defaultAvatar.png";
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: avatarUrl.value,
        b: common_vendor.o(changeAvatar),
        c: common_vendor.o([($event) => username.value = $event.detail.value, ($event) => errors.username = ""]),
        d: username.value,
        e: errors.username
      }, errors.username ? {
        f: common_vendor.t(errors.username)
      } : {}, {
        g: common_vendor.o([($event) => confirmUsername.value = $event.detail.value, ($event) => errors.confirmUsername = ""]),
        h: confirmUsername.value,
        i: errors.confirmUsername
      }, errors.confirmUsername ? {
        j: common_vendor.t(errors.confirmUsername)
      } : {}, {
        k: common_vendor.o([($event) => password.value = $event.detail.value, ($event) => errors.password = ""]),
        l: password.value,
        m: errors.password
      }, errors.password ? {
        n: common_vendor.t(errors.password)
      } : {}, {
        o: common_vendor.o([($event) => confirmPassword.value = $event.detail.value, ($event) => errors.confirmPassword = ""]),
        p: confirmPassword.value,
        q: errors.confirmPassword
      }, errors.confirmPassword ? {
        r: common_vendor.t(errors.confirmPassword)
      } : {}, {
        s: common_vendor.o(goToLogin),
        t: common_vendor.o(handleRegister)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
