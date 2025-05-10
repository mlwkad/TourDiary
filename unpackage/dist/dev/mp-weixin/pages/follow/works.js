"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "works",
  setup(__props) {
    const userData = common_vendor.reactive({});
    let userID = common_vendor.ref("");
    const isFollowing = common_vendor.ref(true);
    const userWorks = common_vendor.ref([]);
    const viewWorkDetail = async (releaseID) => {
      try {
        const info = await api_api.getReleaseDetail(releaseID);
        common_vendor.index.navigateTo({
          url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/follow/works.vue:85", e);
        common_vendor.index.showToast({
          title: "获取详情失败",
          icon: "none"
        });
      }
    };
    const toggleFollow = async () => {
      userID.value = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      if (isFollowing.value) {
        common_vendor.index.showModal({
          title: "提示",
          content: `确定要取消关注"${userData.userName}"吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await api_api.unfollow(userID.value, userData.userID);
                isFollowing.value = false;
                common_vendor.index.showToast({
                  title: "已取消关注",
                  icon: "success"
                });
              } catch (e) {
                common_vendor.index.__f__("log", "at pages/follow/works.vue:110", e);
                common_vendor.index.showToast({
                  title: "操作失败",
                  icon: "none"
                });
              }
            }
          }
        });
      } else {
        try {
          await api_api.follow(userID.value, { followUserID: userData.userID });
          isFollowing.value = true;
          common_vendor.index.showToast({
            title: "关注成功",
            icon: "success"
          });
        } catch (e) {
          common_vendor.index.__f__("log", "at pages/follow/works.vue:128", e);
          common_vendor.index.showToast({
            title: "关注失败",
            icon: "none"
          });
        }
      }
    };
    common_vendor.onLoad(async (options) => {
      if (options.userID) {
        try {
          const [worksRes, userRes] = await Promise.all([
            api_api.getUserReleases(options.userID),
            api_api.getUserInfo(options.userID)
          ]);
          userWorks.value = worksRes;
          Object.assign(userData, userRes);
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          if (userInfo) {
            const followingList = await api_api.getFollowingList(JSON.parse(userInfo).userId);
            isFollowing.value = followingList.includes(options.userID);
          }
        } catch (e) {
          common_vendor.index.__f__("log", "at pages/follow/works.vue:152", e);
          common_vendor.index.showToast({
            title: "获取数据失败",
            icon: "none"
          });
        }
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.t(userData.userName),
        c: common_vendor.t(userWorks.value.length),
        d: common_vendor.t(isFollowing.value ? "已关注" : "+ 关注"),
        e: common_vendor.o(toggleFollow),
        f: userWorks.value.length > 0
      }, userWorks.value.length > 0 ? common_vendor.e({
        g: common_vendor.f(userWorks.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.content),
            c: item.createdAt
          }, item.createdAt ? {
            d: common_assets._imports_1$1,
            e: common_vendor.t(item.createdAt.slice(0, 10))
          } : {}, {
            f: item.location
          }, item.location ? {
            g: common_assets._imports_2$1,
            h: common_vendor.t(item.location)
          } : {}, {
            i: index,
            j: common_vendor.o(($event) => viewWorkDetail(item.releaseID), index)
          });
        }),
        h: common_assets._imports_0,
        i: userWorks.value.length > 5
      }, userWorks.value.length > 5 ? {} : {}) : {
        j: common_assets._imports_3
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e236ab95"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/follow/works.js.map
