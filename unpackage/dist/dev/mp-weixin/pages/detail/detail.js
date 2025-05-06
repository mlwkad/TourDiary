"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detail",
  setup(__props) {
    const isLiked = common_vendor.ref(false);
    const isFollow = common_vendor.ref(false);
    const info = common_vendor.ref({
      avatar: "https://example.com/avatar2.jpg",
      content: "这是一个测试发布内容3",
      createdAt: "2025-05-03T11:28:49.000Z",
      id: 3,
      location: "广州市天河区",
      money: "300.00",
      personNum: 1,
      pictures: ["https://example.com/pic4.jpg", "https://example.com/pic5.jpg"],
      playTime: 90,
      releaseID: "release3",
      title: "广州一日游",
      updatedAt: "2025-05-03T11:28:49.000Z",
      userID: "",
      userName: "testuser2",
      videos: []
    });
    const liked = async () => {
      const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      try {
        await api_api.addLiked(userId, info.value.releaseID).then((res) => {
          common_vendor.index.showToast({
            title: res.message,
            icon: "none"
          });
        });
        api_api.getUserInfo(userId).then((res) => {
          isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID);
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:151", e);
      }
    };
    const goUserPages = () => {
      common_vendor.index.navigateTo({
        url: `/pages/follow/works?userID=${info.value.userID}`
      });
    };
    const shareContent = () => {
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
      common_vendor.index.showToast({
        title: "分享成功",
        icon: "success",
        duration: 2e3
      });
    };
    const followPublisher = () => {
      const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      common_vendor.index.showModal({
        title: "关注提示",
        content: `确定要关注"${info.value.userName}"吗？`,
        success: (res) => {
          if (res.confirm) {
            api_api.follow(userId, { followUserID: info.value.userID }).then((res2) => {
              common_vendor.index.showToast({
                title: "关注成功",
                icon: "success"
              });
            });
          }
        }
      });
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({
        urls: images,
        // [url1,url2] 图片地址数组  
        current: images[current]
        // 当前显示的图片索引
      });
    };
    common_vendor.onLoad(async (options) => {
      try {
        if (options.info) {
          const decodedInfo = await JSON.parse(decodeURIComponent(options.info));
          info.value = await decodedInfo;
        }
        if (info.value.userID) {
          const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
          api_api.getUserInfo(userId).then((res) => {
            isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID);
            isFollow.value = res.follow.includes(info.value.userID);
          });
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:217", e);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: info.value.pictures.length === 0 && info.value.videos.length === 0
      }, info.value.pictures.length === 0 && info.value.videos.length === 0 ? {
        b: common_assets._imports_0$1
      } : info.value.pictures.length === 0 && info.value.videos.length > 0 ? {
        d: common_vendor.f(info.value.videos, (item, index, i0) => {
          return {
            a: item,
            b: "vid-" + index
          };
        }),
        e: info.value.cover
      } : info.value.pictures.length > 0 && info.value.videos.length === 0 ? {
        g: common_vendor.f(info.value.pictures, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => previewImage(info.value.pictures, index), "pic-" + index),
            b: "pic-" + index
          };
        }),
        h: common_assets._imports_1$2
      } : {
        i: common_vendor.f(info.value.videos, (item, index, i0) => {
          return {
            a: item,
            b: "vid-" + index
          };
        }),
        j: info.value.cover,
        k: common_vendor.f(info.value.pictures, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => previewImage(info.value.pictures, index), "pic-" + index),
            b: "pic-" + index
          };
        }),
        l: common_assets._imports_1$2
      }, {
        c: info.value.pictures.length === 0 && info.value.videos.length > 0,
        f: info.value.pictures.length > 0 && info.value.videos.length === 0,
        m: common_vendor.t(info.value.title),
        n: isLiked.value ? "red" : "white",
        o: common_vendor.o(liked),
        p: common_vendor.o(shareContent),
        q: common_assets._imports_0,
        r: common_vendor.o(goUserPages),
        s: common_vendor.t(info.value.userName),
        t: common_vendor.o(goUserPages),
        v: common_vendor.t(info.value.createdAt.slice(0, 10)),
        w: common_vendor.o(goUserPages),
        x: common_vendor.o(followPublisher),
        y: common_vendor.t(info.value.content),
        z: common_assets._imports_2,
        A: common_vendor.t(info.value.location),
        B: common_assets._imports_1,
        C: common_vendor.t(info.value.money),
        D: common_assets._imports_2$1,
        E: common_vendor.t(info.value.personNum),
        F: common_assets._imports_1$1,
        G: common_vendor.t(info.value.playTime)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
