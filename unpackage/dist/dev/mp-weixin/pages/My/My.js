"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
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
      common_vendor.index.chooseImage({
        count: 1,
        // 还能选几张
        sizeType: ["compressed"],
        // 压缩后的图片 或 original:原图
        sourceType: ["album", "camera"],
        // 可以来自相册 相机
        success: (res) => {
          userInfo.avatarUrl = res.tempFilePaths;
        }
      });
    };
    const changeUserInfo = () => {
      api_api.updateUserInfo(userInfo.userId, {
        userID: userInfo.userId,
        userName: userInfo.nickName,
        avatar: userInfo.avatarUrl
      }).then((res) => {
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        isShow.value = false;
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "success"
        });
      });
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
        follow: "/pages/follow/list",
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
        d: common_assets._imports_0$2,
        e: common_vendor.o(($event) => common_vendor.isRef(isShow) ? isShow.value = true : isShow = true)
      } : {
        f: common_assets._imports_0,
        g: common_vendor.o(handleLogin),
        h: common_vendor.o(handleRegister)
      }, {
        i: isLoggedIn.value ? 1 : "",
        j: common_assets._imports_2$3,
        k: common_assets._imports_0$1,
        l: common_vendor.o(($event) => navigateTo("collection")),
        m: common_assets._imports_4$1,
        n: common_assets._imports_0$1,
        o: common_vendor.o(($event) => navigateTo("notes")),
        p: common_assets._imports_5,
        q: common_assets._imports_0$1,
        r: common_vendor.o(($event) => navigateTo("follow")),
        s: common_assets._imports_3,
        t: common_assets._imports_0$1,
        v: common_vendor.o(($event) => navigateTo("settings")),
        w: common_assets._imports_3,
        x: common_assets._imports_0$1,
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
        G: userInfo.nickName,
        H: userInfo.nickName,
        I: common_vendor.o(($event) => userInfo.nickName = $event.detail.value),
        J: common_vendor.o(changeUserInfo)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8f9a99c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/My/My.js.map
