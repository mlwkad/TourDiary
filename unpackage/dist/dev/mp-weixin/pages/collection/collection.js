"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "collection",
  setup(__props) {
    const collections = common_vendor.ref([]);
    common_vendor.ref(false);
    let userID = common_vendor.ref("");
    const viewNote = async (releaseID) => {
      try {
        const info = await api_api.getReleaseDetail(releaseID);
        common_vendor.index.navigateTo({
          url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/collection/collection.vue:63", e);
        common_vendor.index.showToast({
          title: "获取详情失败",
          icon: "none"
        });
      }
    };
    const removeCollection = (releaseID) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要移除这个收藏吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_api.removeLiked(userID, releaseID);
              const res2 = await api_api.getUserLiked(userID);
              collections.value = res2;
              common_vendor.index.showToast({
                title: "已移除收藏",
                icon: "success"
              });
            } catch (e) {
              common_vendor.index.__f__("log", "at pages/collection/collection.vue:87", e);
              common_vendor.index.showToast({
                title: "操作失败",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const goToDiscover = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    common_vendor.onShow(() => {
      userID = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      api_api.getUserLiked(userID).then((res) => {
        collections.value = res;
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: collections.value.length > 0
      }, collections.value.length > 0 ? common_vendor.e({
        b: common_vendor.f(collections.value, (item, index, i0) => {
          return {
            a: item.pictures[0],
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.content),
            d: common_vendor.t(item.createdAt.slice(0, 10)),
            e: common_vendor.o(($event) => removeCollection(item.releaseID), index),
            f: index,
            g: common_vendor.o(($event) => viewNote(item.releaseID), index)
          };
        }),
        c: common_assets._imports_0,
        d: collections.value.length > 5
      }, collections.value.length > 5 ? {} : {}) : {
        e: common_assets._imports_2,
        f: common_vendor.o(goToDiscover)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cd17183b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/collection.js.map
