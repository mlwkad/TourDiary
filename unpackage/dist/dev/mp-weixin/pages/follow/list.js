"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "list",
  setup(__props) {
    const followList = common_vendor.ref([]);
    common_vendor.ref(false);
    const userID = common_vendor.ref("");
    const viewUserProfile = (userID2) => {
      common_vendor.index.navigateTo({
        url: `/pages/follow/works?userID=${userID2}`
      });
    };
    const unfollowUser = (targetUserID, index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消关注该用户吗？",
        success: (res) => {
          if (res.confirm) {
            api_api.unfollow(userID.value, targetUserID).then((res2) => {
              followList.value.splice(index, 1);
              common_vendor.index.showToast({
                title: "已取消关注",
                icon: "success"
              });
            }).catch((err) => {
              common_vendor.index.__f__("log", "at pages/follow/list.vue:67", err);
            });
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
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      followList.value = [];
      if (userInfo) {
        userID.value = JSON.parse(userInfo).userId;
        api_api.getFollowingList(userID.value).then((res) => {
          res.forEach((item) => {
            api_api.getUserInfo(item).then((res2) => {
              const user = {
                userID: res2.userID,
                userName: res2.userName,
                worksCount: JSON.parse(res2.release).length,
                avatar: res2.avatar
              };
              followList.value.push(user);
            });
          });
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: followList.value.length > 0
      }, followList.value.length > 0 ? common_vendor.e({
        b: common_vendor.f(followList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.userName),
            b: common_vendor.t(item.worksCount || 0),
            c: common_vendor.o(($event) => unfollowUser(item.userID, index), index),
            d: index,
            e: common_vendor.o(($event) => viewUserProfile(item.userID), index)
          };
        }),
        c: common_assets._imports_0,
        d: followList.value.length > 5
      }, followList.value.length > 5 ? {} : {}) : {
        e: common_assets._imports_3,
        f: common_vendor.o(goToDiscover)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-80304710"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/follow/list.js.map
