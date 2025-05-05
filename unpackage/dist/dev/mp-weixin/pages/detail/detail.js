"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detail",
  setup(__props) {
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
      userID: "user2",
      userName: "testuser2",
      videos: []
    });
    common_vendor.ref("/static/555.jpg");
    const liked = () => {
      const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      try {
        api_api.addLiked(userId, info.value.releaseID).then((res) => {
          common_vendor.index.showToast({
            title: res.message,
            icon: "none"
          });
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:129", e);
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
    common_vendor.onLoad((options) => {
      try {
        if (options.info) {
          const decodedInfo = JSON.parse(decodeURIComponent(options.info));
          info.value = decodedInfo;
        } else {
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:145", "没拿到信息");
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:148", e);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: info.value.pictures.length === 0 && info.value.videos.length === 0
      }, info.value.pictures.length === 0 && info.value.videos.length === 0 ? {
        b: common_assets._imports_0$2
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
        h: common_assets._imports_1$1
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
        l: common_assets._imports_1$1
      }, {
        c: info.value.pictures.length === 0 && info.value.videos.length > 0,
        f: info.value.pictures.length > 0 && info.value.videos.length === 0,
        m: common_vendor.t(info.value.title),
        n: common_vendor.o(liked),
        o: common_assets._imports_0,
        p: common_vendor.t(info.value.userName),
        q: common_vendor.t(info.value.content),
        r: common_assets._imports_0$1,
        s: common_vendor.t(info.value.location),
        t: common_assets._imports_1,
        v: common_vendor.t(info.value.money),
        w: common_assets._imports_2,
        x: common_vendor.t(info.value.personNum),
        y: common_assets._imports_3,
        z: common_vendor.t(info.value.playTime)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
