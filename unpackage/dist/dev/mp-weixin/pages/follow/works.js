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
    const isRefreshing = common_vendor.ref(false);
    const userWorks = common_vendor.ref([
      {
        releaseID: "release1",
        title: "北京三日游",
        content: "游览了故宫、长城、颐和园等著名景点，感受了浓厚的历史文化氛围。",
        createdAt: "2023-05-15T10:30:00.000Z",
        location: "北京市",
        pictures: ["/static/666.jpg"]
      },
      {
        releaseID: "release2",
        title: "杭州西湖一日游",
        content: "西湖美景让人心旷神怡，苏堤春晓、断桥残雪都是绝佳的景点。",
        createdAt: "2023-06-20T15:45:00.000Z",
        location: "杭州市",
        pictures: ["/static/666.jpg"]
      },
      {
        releaseID: "release3",
        title: "上海都市风光",
        content: "上海的现代化都市风光令人惊叹，外滩夜景尤为壮观。",
        createdAt: "2023-07-10T09:15:00.000Z",
        location: "上海市",
        pictures: ["/static/666.jpg"]
      }
    ]);
    const viewWorkDetail = async (releaseID) => {
      try {
        const info = await api_api.getReleaseDetail(releaseID);
        common_vendor.index.navigateTo({
          url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取详情失败",
          icon: "none"
        });
      }
    };
    const toggleFollow = () => {
      userID.value = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      if (isFollowing.value) {
        common_vendor.index.showModal({
          title: "提示",
          content: `确定要取消关注"${userData.userName}"吗？`,
          success: (res) => {
            if (res.confirm) {
              api_api.unfollow(userID.value, userData.userID).then((res2) => {
                isFollowing.value = false;
                common_vendor.index.showToast({
                  title: "已取消关注",
                  icon: "success"
                });
              });
            }
          }
        });
      } else {
        api_api.follow(userID.value, { followUserID: userData.userID }).then((res) => {
          isFollowing.value = true;
          common_vendor.index.showToast({
            title: "关注成功",
            icon: "success"
          });
        });
      }
    };
    const onRefresh = async () => {
      isRefreshing.value = true;
      await new Promise((resolve) => {
        setTimeout(() => {
          isRefreshing.value = false;
          resolve(null);
        }, 500);
      });
    };
    common_vendor.onLoad((options) => {
      if (options.userID) {
        api_api.getUserReleases(options.userID).then((res) => {
          userWorks.value = res;
        });
        api_api.getUserInfo(options.userID).then((res) => {
          Object.assign(userData, res);
        });
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        api_api.getFollowingList(JSON.parse(userInfo).userId).then((res) => {
          isFollowing.value = res.includes(options.userID);
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.t(userData.userName),
        c: common_vendor.t(userData.release ? JSON.parse(userData.release).length : 0),
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
            g: common_assets._imports_2,
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
      }, {
        k: common_vendor.o(onRefresh),
        l: isRefreshing.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e236ab95"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/follow/works.js.map
