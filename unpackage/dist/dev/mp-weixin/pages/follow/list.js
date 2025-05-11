"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "list",
  setup(__props) {
    const followList = common_vendor.ref([]);
    const userID = common_vendor.ref("");
    const viewUserProfile = (userID2) => {
      common_vendor.index.navigateTo({
        url: `/pages/follow/works?userID=${userID2}`
      });
    };
    const unfollowUser = async (targetUserID, index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消关注该用户吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_api.unfollow(userID.value, targetUserID);
              followList.value.splice(index, 1);
              common_vendor.index.showToast({
                title: "已取消关注",
                icon: "success"
              });
            } catch (e) {
              common_vendor.index.__f__("log", "at pages/follow/list.vue:66", e);
              common_vendor.index.showToast({
                title: "操作失败，请稍后重试",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const fetchFollowingData = async () => {
      try {
        const followingIds = await api_api.getFollowingList(userID.value);
        followList.value = [];
        for (const item of followingIds) {
          const res = await api_api.getUserInfo(item);
          const user = {
            userID: res.userID,
            userName: res.userName,
            worksCount: JSON.parse(res.release).length,
            avatar: res.avatar
          };
          followList.value.push(user);
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/follow/list.vue:93", e);
      }
    };
    const goToDiscover = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    common_vendor.onShow(async () => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      followList.value = [];
      if (userInfo) {
        userID.value = JSON.parse(userInfo).userId;
        await fetchFollowingData();
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
