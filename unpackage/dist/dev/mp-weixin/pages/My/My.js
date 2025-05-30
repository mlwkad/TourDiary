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
    const noteCount = common_vendor.ref(0);
    const followCount = common_vendor.ref(0);
    const collectionCount = common_vendor.ref(0);
    const checkLoginStatus = async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        isLoggedIn.value = true;
        const savedUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (savedUserInfo) {
          Object.assign(userInfo, JSON.parse(savedUserInfo));
        }
        const res = await api_api.getUserInfo(userInfo.userId);
        noteCount.value = JSON.parse(res.release).length;
        followCount.value = JSON.parse(res.follow).length;
        collectionCount.value = JSON.parse(res.liked).length;
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
        success: async (res) => {
          try {
            const result = await api_api.uploadFiles(res.tempFilePaths, "image");
            userInfo.avatarUrl = result.pictures[0];
          } catch (e) {
            common_vendor.index.__f__("log", "at pages/My/My.vue:168", e);
          }
        }
      });
    };
    const changeUserInfo = async () => {
      try {
        await api_api.updateUserInfo(userInfo.userId, {
          userID: userInfo.userId,
          userName: userInfo.nickName,
          avatar: userInfo.avatarUrl
        });
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        isShow.value = false;
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "success"
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/My/My.vue:188", e);
        common_vendor.index.showToast({
          title: "修改失败",
          icon: "none"
        });
      }
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
      if (page !== "follow") {
        common_vendor.index.navigateTo({
          url: `/pages/${page}/${page}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/${page}/list`
        });
      }
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
        b: userInfo.avatarUrl,
        c: common_vendor.t(userInfo.nickName || "用户"),
        d: common_assets._imports_0$2,
        e: common_vendor.o(($event) => common_vendor.isRef(isShow) ? isShow.value = true : isShow = true)
      } : {
        f: common_assets._imports_1$3,
        g: common_vendor.o(handleLogin),
        h: common_vendor.o(handleRegister)
      }, {
        i: isLoggedIn.value ? 1 : "",
        j: common_assets._imports_2$2,
        k: common_vendor.t(collectionCount.value),
        l: common_vendor.o(($event) => navigateTo("collection")),
        m: common_assets._imports_3$1,
        n: common_vendor.t(noteCount.value),
        o: common_vendor.o(($event) => navigateTo("notes")),
        p: common_assets._imports_4$1,
        q: common_vendor.t(followCount.value),
        r: common_vendor.o(($event) => navigateTo("follow")),
        s: common_assets._imports_5,
        t: common_assets._imports_6,
        v: common_vendor.o(($event) => navigateTo("feedback")),
        w: isLoggedIn.value
      }, isLoggedIn.value ? {
        x: common_vendor.o(handleLogout)
      } : {}, {
        y: common_vendor.unref(isShow)
      }, common_vendor.unref(isShow) ? {
        z: common_assets._imports_4,
        A: common_vendor.o(($event) => common_vendor.isRef(isShow) ? isShow.value = false : isShow = false),
        B: userInfo.avatarUrl,
        C: common_vendor.o(chooseavatar),
        D: userInfo.nickName,
        E: userInfo.nickName,
        F: common_vendor.o(($event) => userInfo.nickName = $event.detail.value),
        G: common_vendor.o(changeUserInfo)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8f9a99c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/My/My.js.map
