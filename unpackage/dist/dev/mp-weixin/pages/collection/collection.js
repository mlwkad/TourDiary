"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "collection",
  setup(__props) {
    const collections = common_vendor.ref([]);
    const isRefreshing = common_vendor.ref(false);
    let userID = common_vendor.ref("");
    const viewNote = async (releaseID) => {
      const info = await api_api.getReleaseDetail(releaseID);
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
      });
    };
    const removeCollection = (releaseID) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要移除这个收藏吗？",
        success: async (res) => {
          if (res.confirm) {
            await api_api.removeLiked(userID, releaseID);
            const res2 = await api_api.getUserLiked(userID);
            collections.value = res2;
            common_vendor.index.showToast({
              title: "已移除收藏",
              icon: "success"
            });
          }
        }
      });
    };
    const onRefresh = async () => {
      isRefreshing.value = true;
      await api_api.getUserLiked(userID).then((res) => {
        collections.value = res;
      });
      await new Promise((resolve) => {
        setTimeout(() => {
          isRefreshing.value = false;
          resolve();
        }, 500);
      });
    };
    const goToDiscover = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    common_vendor.onLoad(() => {
      userID = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      api_api.getUserLiked(userID).then((res) => {
        collections.value = res;
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: collections.value.length > 0
      }, collections.value.length > 0 ? {
        b: common_vendor.f(collections.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.content),
            c: common_vendor.t(item.createdAt),
            d: common_vendor.o(($event) => removeCollection(item.releaseID), index),
            e: index,
            f: common_vendor.o(($event) => viewNote(item.releaseID), index)
          };
        }),
        c: common_assets._imports_0,
        d: common_assets._imports_1$1
      } : {
        e: common_assets._imports_0$2,
        f: common_vendor.o(goToDiscover)
      }, {
        g: common_vendor.o(onRefresh),
        h: isRefreshing.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cd17183b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/collection.js.map
