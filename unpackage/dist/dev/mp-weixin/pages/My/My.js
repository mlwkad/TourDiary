"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "My",
  setup(__props) {
    let isShow = common_vendor.ref(false);
    const isLoggedIn = common_vendor.ref(false);
    const userInfo = common_vendor.reactive({
      nickName: "",
      avatarUrl: "",
      userId: ""
    });
    const checkLoginStatus = () => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        isLoggedIn.value = true;
        const savedUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (savedUserInfo) {
          Object.assign(userInfo, JSON.parse(savedUserInfo));
        }
      }
    };
    const handleLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
        // 切页动效,默认右侧滑入
        // animationType: 'slide-in-bottom',
        // animationDuration: 300
      });
    };
    const handleRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            isLoggedIn.value = false;
            Object.assign(userInfo, {
              nickName: "",
              avatarUrl: "",
              userId: ""
            });
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    };
    const chooseavatar = () => {
    };
    const navigateTo = (page) => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              handleLogin();
            }
          }
        });
        return;
      }
      const pageMap = {
        collection: "/pages/collection/collection",
        notes: "/pages/notes/notes",
        following: "/pages/following/following",
        settings: "/pages/settings/settings",
        feedback: "/pages/feedback/feedback"
      };
      common_vendor.index.navigateTo({
        url: pageMap[page]
      });
    };
    common_vendor.onLoad(() => {
      checkLoginStatus();
    });
    common_vendor.onShow(() => {
      checkLoginStatus();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoggedIn.value
      }, isLoggedIn.value ? {
        b: userInfo.avatarUrl || "/static/666.jpg",
        c: common_vendor.t(userInfo.nickName || "666"),
        d: common_assets._imports_0$5,
        e: common_vendor.o(($event) => common_vendor.isRef(isShow) ? isShow.value = true : isShow = true)
      } : {
        f: common_assets._imports_0,
        g: common_vendor.o(handleLogin),
        h: common_vendor.o(handleRegister)
      }, {
        i: isLoggedIn.value ? 1 : "",
        j: common_assets._imports_0$3,
        k: common_assets._imports_0$4,
        l: common_vendor.o(($event) => navigateTo("collection")),
        m: common_assets._imports_0$3,
        n: common_assets._imports_0$4,
        o: common_vendor.o(($event) => navigateTo("notes")),
        p: common_assets._imports_0$3,
        q: common_assets._imports_0$4,
        r: common_vendor.o(($event) => navigateTo("following")),
        s: common_assets._imports_0$3,
        t: common_assets._imports_0$4,
        v: common_vendor.o(($event) => navigateTo("settings")),
        w: common_assets._imports_0$3,
        x: common_assets._imports_0$4,
        y: common_vendor.o(($event) => navigateTo("feedback")),
        z: isLoggedIn.value
      }, isLoggedIn.value ? {
        A: common_vendor.o(handleLogout)
      } : {}, {
        B: common_vendor.unref(isShow)
      }, common_vendor.unref(isShow) ? {
        C: common_assets._imports_4,
        D: common_vendor.o(($event) => common_vendor.isRef(isShow) ? isShow.value = false : isShow = false),
        E: userInfo.avatarUrl,
        F: common_vendor.o(chooseavatar),
        G: userInfo.nickName
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8f9a99c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/My/My.js.map
