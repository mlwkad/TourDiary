"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const api_ws = require("../../api/ws.js");
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "detail",
  setup(__props, { expose: __expose }) {
    const isLiked = common_vendor.ref(false);
    const isFollow = common_vendor.ref(false);
    const isShowWantLocation = common_vendor.ref(false);
    const wantGoInput = common_vendor.ref("");
    const XunFeiRes = common_vendor.ref("");
    const daziji = common_vendor.ref("");
    const interval = common_vendor.ref(null);
    const isDone = common_vendor.ref(true);
    const selectedChoose = common_vendor.ref([]);
    const info = common_vendor.ref({
      avatar: "",
      content: "",
      createdAt: "0000-00-00",
      id: 0,
      location: "",
      money: "",
      personNum: 0,
      pictures: [""],
      playTime: 0,
      releaseID: "release0",
      title: "",
      updatedAt: "0000-00-00",
      userID: "",
      userName: "testuser0",
      videos: []
    });
    const chatChoose = common_vendor.ref([
      { id: 1, title: "附近景点", image: "/static/public/build.png", selectedImage: "/static/public/build-white.png" },
      { id: 2, title: "附近美食", image: "/static/public/food.png", selectedImage: "/static/public/food-white.png" },
      { id: 3, title: "经济旅游", image: "/static/public/sale.png", selectedImage: "/static/public/sale-white.png" },
      { id: 4, title: "自驾旅游", image: "/static/public/jeepCar.png", selectedImage: "/static/public/jeepCar-white.png" },
      { id: 5, title: "特色住宿", image: "/static/public/hotal.png", selectedImage: "/static/public/hotal-white.png" },
      { id: 6, title: "购物攻略", image: "/static/public/shopping.png", selectedImage: "/static/public/shopping-white.png" }
    ]);
    const chooseSelect = (id) => {
      let storedId = selectedChoose.value.indexOf(id);
      if (storedId !== -1) {
        selectedChoose.value.splice(storedId, 1);
      } else {
        selectedChoose.value.push(id);
      }
    };
    const getRes = () => {
      const allChoose = chatChoose.value.filter((item) => selectedChoose.value.includes(item.id));
      let allChooseTitle = "";
      allChoose.forEach((item) => {
        allChooseTitle += item.title + ",";
      });
      const finalContent = `我想去${wantGoInput.value}游玩,并为我提供${allChooseTitle}的建议,分点明确(一级标题:一,二 二级标题:1,2),不要出现*#等特殊符号`;
      isDone.value = false;
      turnDaziji();
      api_ws.streamChat(finalContent, (update) => {
        if (update.type === "update") {
          XunFeiRes.value += update.content;
        } else if (update.type === "error") {
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:186", update.error);
        } else if (update.type === "done" || "end") {
          isDone.value = true;
        }
      });
    };
    const turnDaziji = () => {
      let index = 0;
      const typeNextChar = () => {
        if (XunFeiRes.value.length >= index) {
          daziji.value = XunFeiRes.value.slice(0, index);
          index++;
          const delay = Math.max(5, 50 - Math.floor(index / 20));
          interval.value = setTimeout(typeNextChar, delay);
        } else {
          if (isDone.value && interval.value) {
            clearTimeout(interval.value);
            interval.value = null;
          } else {
            interval.value = setTimeout(typeNextChar, 100);
          }
        }
      };
      typeNextChar();
    };
    const copyRes = () => {
      common_vendor.index.setClipboardData({
        data: XunFeiRes.value,
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "none"
          });
        }
      });
    };
    const delRes = () => {
      XunFeiRes.value = "";
    };
    const liked = async () => {
      try {
        const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
        if (!isLiked.value) {
          await api_api.addLiked(userId, info.value.releaseID);
          common_vendor.index.showToast({
            title: "收藏成功",
            icon: "none"
          });
        } else {
          await api_api.removeLiked(userId, info.value.releaseID);
          common_vendor.index.showToast({
            title: "取消收藏",
            icon: "none"
          });
        }
        const userInfoRes = await api_api.getUserInfo(userId);
        isLiked.value = JSON.parse(userInfoRes.liked).includes(info.value.releaseID);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:248", e);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    };
    const goUserPages = () => {
      common_vendor.index.navigateTo({
        url: `/pages/follow/works?userID=${info.value.userID}`
      });
    };
    __expose({
      onShareAppMessage() {
        return {
          title: "旅游日记分享",
          path: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info.value))}`,
          imageUrl: info.value.pictures[0] || ""
        };
      },
      onShareTimeline() {
        return {
          title: "旅游日记分享",
          // 默认自带本页路径,只需写查询参数
          query: `info=${encodeURIComponent(JSON.stringify(info.value))}`,
          imageUrl: info.value.pictures[0] || ""
        };
      }
    });
    const followPublisher = () => {
      const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      if (!isFollow.value) {
        common_vendor.index.showModal({
          title: "关注提示",
          content: `确定要关注"${info.value.userName}"吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await api_api.follow(userId, { followUserID: info.value.userID });
                common_vendor.index.showToast({
                  title: "关注成功",
                  icon: "none"
                });
                const userInfoRes = await api_api.getUserInfo(userId);
                isFollow.value = userInfoRes.follow.includes(info.value.userID);
              } catch (e) {
                common_vendor.index.__f__("log", "at pages/detail/detail.vue:299", e);
                common_vendor.index.showToast({
                  title: e,
                  icon: "none"
                });
              }
            }
          }
        });
      } else {
        common_vendor.index.showModal({
          title: "取关提示",
          content: `确定要取消关注"${info.value.userName}"吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await api_api.unfollow(userId, info.value.userID);
                common_vendor.index.showToast({
                  title: "已取消关注",
                  icon: "none"
                });
                const userInfoRes = await api_api.getUserInfo(userId);
                isFollow.value = userInfoRes.follow.includes(info.value.userID);
              } catch (e) {
                common_vendor.index.__f__("log", "at pages/detail/detail.vue:323", e);
                common_vendor.index.showToast({
                  title: "操作失败",
                  icon: "none"
                });
              }
            }
          }
        });
      }
    };
    const previewImage = (images, current) => {
      const stringUrls = images.map((img) => String(img));
      common_vendor.index.previewImage({
        urls: stringUrls,
        // 地址列表
        current: stringUrls[current],
        // 显示第几张
        fail: (e) => {
          common_vendor.index.__f__("error", "at pages/detail/detail.vue:341", "预览失败:", e);
        }
      });
    };
    const fullScreen = (event) => {
      const isFullScreen = event.detail.fullScreen || event.detail.fullscreen;
      const direction = event.detail.direction;
      if (isFullScreen) {
        common_vendor.index.showToast({
          title: `已进入${direction === "vertical" ? "竖向" : "横向"}全屏模式`,
          icon: "none",
          duration: 1500
        });
      } else {
        common_vendor.index.showToast({
          title: "已退出全屏模式",
          icon: "none",
          duration: 1500
        });
      }
    };
    const videoError = (e) => {
      common_vendor.index.__f__("error", "at pages/detail/detail.vue:365", "视频播放错误:", e.detail);
      common_vendor.index.showToast({
        title: "视频播放失败",
        icon: "none"
      });
    };
    common_vendor.onLoad(async (options) => {
      try {
        if (options.info) {
          const decodedInfo = JSON.parse(decodeURIComponent(options.info));
          info.value = decodedInfo;
        }
        wantGoInput.value = info.value.location;
        if (info.value.userID) {
          const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
          api_api.getUserInfo(userId).then((res) => {
            isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID);
            isFollow.value = res.follow.includes(info.value.userID);
          });
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:388", e);
      }
    });
    common_vendor.onShow(() => {
      try {
        if (info.value.userID) {
          const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
          api_api.getUserInfo(userId).then((res) => {
            isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID);
            isFollow.value = res.follow.includes(info.value.userID);
          });
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:403", e);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: info.value.pictures.length > 0 && info.value.videos.length === 0
      }, info.value.pictures.length > 0 && info.value.videos.length === 0 ? {
        b: common_vendor.f(info.value.pictures, (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.o(($event) => previewImage(info.value.pictures, index), "pic-" + index),
            c: "pic-" + index
          };
        })
      } : {
        c: common_vendor.f(info.value.videos, (item, index, i0) => {
          return {
            a: item,
            b: "video-" + index,
            c: common_vendor.o(fullScreen, "vid-" + index),
            d: common_vendor.o(videoError, "vid-" + index),
            e: "vid-" + index
          };
        }),
        d: info.value.cover,
        e: common_vendor.f(info.value.pictures, (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.o(($event) => previewImage(info.value.pictures, index), "pic-" + index),
            c: "pic-" + index
          };
        })
      }, {
        f: common_vendor.t(info.value.title),
        g: isLiked.value ? "red" : "white",
        h: common_vendor.o(liked),
        i: info.value.avatar,
        j: common_vendor.o(goUserPages),
        k: common_vendor.t(info.value.userName),
        l: common_vendor.o(goUserPages),
        m: common_vendor.t(info.value.createdAt.slice(0, 10)),
        n: common_vendor.o(goUserPages),
        o: !isFollow.value
      }, !isFollow.value ? {
        p: common_assets._imports_0$1,
        q: common_vendor.o(followPublisher)
      } : {
        r: common_assets._imports_5,
        s: common_vendor.o(followPublisher)
      }, {
        t: common_vendor.t(info.value.content),
        v: common_assets._imports_1$1,
        w: common_vendor.t(info.value.location),
        x: common_assets._imports_3,
        y: common_vendor.o(($event) => isShowWantLocation.value = true),
        z: common_assets._imports_1$2,
        A: common_vendor.t(info.value.money),
        B: common_assets._imports_2$1,
        C: common_vendor.t(info.value.personNum),
        D: common_assets._imports_0,
        E: common_vendor.t(info.value.playTime),
        F: isShowWantLocation.value
      }, isShowWantLocation.value ? common_vendor.e({
        G: XunFeiRes.value.length > 0
      }, XunFeiRes.value.length > 0 ? {
        H: common_assets._imports_7,
        I: common_vendor.o(copyRes)
      } : {}, {
        J: XunFeiRes.value.length > 0
      }, XunFeiRes.value.length > 0 ? {
        K: common_assets._imports_8,
        L: common_vendor.o(delRes)
      } : {}, {
        M: common_assets._imports_4,
        N: common_vendor.o(($event) => isShowWantLocation.value = false),
        O: XunFeiRes.value.length === 0
      }, XunFeiRes.value.length === 0 ? {
        P: common_vendor.f(chatChoose.value, (item, k0, i0) => {
          return {
            a: selectedChoose.value.find((ele) => ele === item.id) ? item.selectedImage : item.image,
            b: common_vendor.t(item.title),
            c: item.id,
            d: selectedChoose.value.find((ele) => ele === item.id) ? "#FFA07A" : "#b6b6b635",
            e: selectedChoose.value.find((ele) => ele === item.id) ? "white" : "#999",
            f: common_vendor.o(($event) => chooseSelect(item.id), item.id)
          };
        })
      } : {}, {
        Q: XunFeiRes.value.length === 0
      }, XunFeiRes.value.length === 0 ? {
        R: wantGoInput.value,
        S: common_vendor.o(($event) => wantGoInput.value = $event.detail.value),
        T: common_vendor.t(interval.value ? "加载中" : "GO"),
        U: common_vendor.o(getRes)
      } : {
        V: common_vendor.t(daziji.value)
      }) : {});
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 6;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
