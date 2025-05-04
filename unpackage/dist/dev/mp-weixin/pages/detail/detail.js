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
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:116", e);
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
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:132", "没拿到信息");
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:135", e);
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
            a: "vid-" + index
          };
        })
      } : info.value.pictures.length > 0 && info.value.videos.length === 0 ? {
        f: common_vendor.f(info.value.pictures, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => previewImage(info.value.pictures, index), "pic-" + index),
            b: "pic-" + index
          };
        }),
        g: common_assets._imports_1
      } : {
        h: common_vendor.f(info.value.videos, (item, index, i0) => {
          return {
            a: "vid-" + index
          };
        }),
        i: common_vendor.f(info.value.pictures, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => previewImage(info.value.pictures, index), "pic-" + index),
            b: "pic-" + index
          };
        }),
        j: common_assets._imports_1
      }, {
        c: info.value.pictures.length === 0 && info.value.videos.length > 0,
        e: info.value.pictures.length > 0 && info.value.videos.length === 0,
        k: common_vendor.t(info.value.title),
        l: common_vendor.o(liked),
        m: common_assets._imports_0,
        n: common_vendor.t(info.value.userName),
        o: common_vendor.t(info.value.content),
        p: common_vendor.t(info.value.location),
        q: common_assets._imports_3,
        r: common_vendor.t(info.value.money),
        s: common_assets._imports_4,
        t: common_vendor.t(info.value.personNum),
        v: common_assets._imports_5,
        w: common_vendor.t(info.value.playTime)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
