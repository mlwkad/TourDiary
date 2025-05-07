"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "detail",
  setup(__props, { expose: __expose }) {
    const isLiked = common_vendor.ref(false);
    const isFollow = common_vendor.ref(false);
    const info = common_vendor.ref({
      avatar: "",
      content: "",
      createdAt: "0000-00-00",
      id: 0,
      location: "",
      money: "",
      personNum: 0,
      pictures: ["/static/555.jpg", ".jpg"],
      playTime: 0,
      releaseID: "release0",
      title: "",
      updatedAt: "0000-00-00",
      userID: "",
      userName: "testuser0",
      videos: []
    });
    const liked = async () => {
      const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      try {
        if (!isLiked.value) {
          await api_api.addLiked(userId, info.value.releaseID).then((res) => {
            common_vendor.index.showToast({
              title: "收藏成功",
              icon: "none"
            });
          });
        } else {
          await api_api.removeLiked(userId, info.value.releaseID).then((res) => {
            common_vendor.index.showToast({
              title: "取消收藏",
              icon: "none"
            });
          });
        }
        api_api.getUserInfo(userId).then((res) => {
          isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID);
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:153", e);
      }
    };
    const goUserPages = () => {
      common_vendor.index.navigateTo({
        url: `/pages/follow/works?userID=${info.value.userID}`
      });
    };
    __expose({
      // 分享给好友
      onShareAppMessage() {
        return {
          title: "旅游日记分享",
          path: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info.value))}`,
          imageUrl: info.value.pictures[0] || "/static/public/555.jpg"
        };
      },
      // 分享到朋友圈
      onShareTimeline() {
        return {
          title: "旅游日记分享",
          // 默认自带本页路径,只需写查询参数
          query: `info=${encodeURIComponent(JSON.stringify(info.value))}`,
          imageUrl: info.value.pictures[0] || "/static/public/555.jpg"
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
              await api_api.follow(userId, { followUserID: info.value.userID }).then((res2) => {
                common_vendor.index.showToast({
                  title: "关注成功",
                  icon: "none"
                });
              });
              api_api.getUserInfo(userId).then((res2) => {
                isFollow.value = res2.follow.includes(info.value.userID);
              });
            }
          }
        });
      } else {
        common_vendor.index.showModal({
          title: "取关提示",
          content: `确定要取消关注"${info.value.userName}"吗？`,
          success: async (res) => {
            if (res.confirm) {
              await api_api.unfollow(userId, info.value.userID).then((res2) => {
                common_vendor.index.showToast({
                  title: "已取消关注",
                  icon: "none"
                });
              });
              api_api.getUserInfo(userId).then((res2) => {
                isFollow.value = res2.follow.includes(info.value.userID);
              });
            }
          }
        });
      }
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({
        urls: images,
        // [url1,url2] 图片地址数组  
        current: images[current]
        // 当前显示的图片索引
      });
    };
    const videoError = (e) => {
      common_vendor.index.__f__("error", "at pages/detail/detail.vue:252", "视频播放错误:", e.detail);
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
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:278", info.value);
        }
        if (info.value.userID) {
          const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
          api_api.getUserInfo(userId).then((res) => {
            isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID);
            isFollow.value = res.follow.includes(info.value.userID);
          });
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:289", e);
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
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:304", e);
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
            c: common_vendor.o(videoError, "vid-" + index),
            d: "vid-" + index
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
        i: common_assets._imports_0,
        j: common_vendor.o(goUserPages),
        k: common_vendor.t(info.value.userName),
        l: common_vendor.o(goUserPages),
        m: common_vendor.t(info.value.createdAt.slice(0, 10)),
        n: common_vendor.o(goUserPages),
        o: !isFollow.value
      }, !isFollow.value ? {
        p: common_assets._imports_1$2,
        q: common_vendor.o(followPublisher)
      } : {
        r: common_assets._imports_5,
        s: common_vendor.o(followPublisher)
      }, {
        t: common_vendor.t(info.value.content),
        v: common_assets._imports_2,
        w: common_vendor.t(info.value.location),
        x: common_assets._imports_1,
        y: common_vendor.t(info.value.money),
        z: common_assets._imports_2$1,
        A: common_vendor.t(info.value.personNum),
        B: common_assets._imports_1$1,
        C: common_vendor.t(info.value.playTime)
      });
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 6;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
