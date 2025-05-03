"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
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
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:95", e);
      }
    };
    common_vendor.onLoad((options) => {
      try {
        if (options.info) {
          const decodedInfo = JSON.parse(decodeURIComponent(options.info));
          info.value = decodedInfo;
        } else {
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:104", "没拿到信息");
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:107", e);
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(info.value.pictures, (item, index, i0) => {
          return {
            a: "pic-" + index
          };
        }),
        b: common_assets._imports_0,
        c: common_vendor.f(info.value.videos, (item, index, i0) => {
          return {
            a: "vid-" + index
          };
        }),
        d: common_vendor.t(info.value.title),
        e: common_vendor.o(liked),
        f: common_assets._imports_1,
        g: common_vendor.t(info.value.userName),
        h: common_vendor.t(info.value.content),
        i: common_vendor.t(info.value.location),
        j: common_assets._imports_2,
        k: common_vendor.t(info.value.money),
        l: common_assets._imports_3,
        m: common_vendor.t(info.value.personNum),
        n: common_assets._imports_4,
        o: common_vendor.t(info.value.playTime)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
