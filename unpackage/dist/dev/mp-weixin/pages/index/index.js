"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const utils_filter = require("../../utils/filter.js");
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    let searchContent = common_vendor.ref("");
    let goTop = common_vendor.ref(false);
    let choose = common_vendor.ref(false);
    let isShowChoose = common_vendor.ref(false);
    let curPage = common_vendor.ref(1);
    let offSet = common_vendor.ref(0);
    let isLoading = common_vendor.ref(false);
    let searchError = common_vendor.ref("");
    const allInfo = common_vendor.ref([[], []]);
    const allInfoByUserName = common_vendor.ref([[], []]);
    const allInfoByTitle = common_vendor.ref([[], []]);
    const distributeData = (data, target) => {
      const totalCount = data.length;
      if (totalCount === 0) {
        target[0] = [];
        target[1] = [];
        return;
      }
      if (totalCount < 14 || totalCount > 14) {
        const leftCount = Math.ceil(totalCount / 2);
        target[0] = data.slice(0, leftCount);
        target[1] = data.slice(leftCount);
      } else {
        target[0] = data.slice(0, 7);
        target[1] = data.slice(7, 14);
      }
    };
    common_vendor.watchEffect(async () => {
      if (!searchContent.value) {
        try {
          const res = await api_api.getAllReleases(14, 0);
          distributeData(res.releases || [], allInfo.value);
        } catch (e) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:83", e);
        }
        isShowChoose.value = false;
        curPage.value = 1;
        offSet.value = 0;
      }
    });
    const goSearch = async () => {
      searchError.value = "";
      const searchValidation = utils_filter.validateSearch(searchContent.value);
      if (!searchValidation.isValid) {
        searchError.value = searchValidation.message;
        return;
      }
      searchContent.value = searchValidation.filteredText;
      try {
        const res = await api_api.searchReleases({ userName: searchContent.value, title: searchContent.value });
        isShowChoose.value = true;
        if (res.byUserName && res.byUserName.length > 0) {
          await checkLikedStatus(res.byUserName);
        }
        if (res.byTitle && res.byTitle.length > 0) {
          await checkLikedStatus(res.byTitle);
        }
        distributeData(res.byUserName || [], allInfoByUserName.value);
        distributeData(res.byTitle || [], allInfoByTitle.value);
        if (res.byUserName.length > 0) {
          allInfo.value = allInfoByUserName.value;
          choose.value = false;
        } else if (res.byTitle.length > 0) {
          allInfo.value = allInfoByTitle.value;
          choose.value = true;
        } else {
          searchError.value = "未找到相关内容";
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:121", e);
        searchError.value = "搜索失败，请稍后再试";
      }
    };
    const goDetail = (info) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
      });
    };
    const goTopFunc = () => {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    };
    const toggleLike = async (item) => {
      try {
        const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
        if (!item.isLiked) {
          await api_api.addLiked(userId, item.releaseID);
          common_vendor.index.showToast({
            title: "收藏成功",
            icon: "none"
          });
          item.isLiked = true;
        } else {
          await api_api.removeLiked(userId, item.releaseID);
          common_vendor.index.showToast({
            title: "取消收藏",
            icon: "none"
          });
          item.isLiked = false;
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:159", e);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    };
    const checkLikedStatus = async (data) => {
      try {
        const userId = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
        const userInfoRes = await api_api.getUserInfo(userId);
        const likedReleases = JSON.parse(userInfoRes.liked || "[]");
        data.forEach((item) => {
          item.isLiked = likedReleases.includes(item.releaseID);
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:178", e);
      }
    };
    common_vendor.onShow(async () => {
      try {
        const res = await api_api.getAllReleases(14, 0);
        if (res.releases && res.releases.length > 0) {
          await checkLikedStatus(res.releases);
          distributeData(res.releases || [], allInfo.value);
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:190", e);
      }
      searchContent.value = "";
      offSet.value = 0;
      curPage.value = 1;
    });
    common_vendor.onReachBottom(async () => {
      if (searchContent.value || isShowChoose.value)
        return;
      if (isLoading.value)
        return;
      isLoading.value = true;
      offSet.value += 14;
      curPage.value++;
      try {
        const res = await api_api.getAllReleases(14, offSet.value);
        if (res.releases && res.releases.length > 0) {
          await checkLikedStatus(res.releases);
          const newAllInfo = [[], []];
          distributeData(res.releases, newAllInfo);
          allInfo.value[0] = [...allInfo.value[0], ...newAllInfo[0]];
          allInfo.value[1] = [...allInfo.value[1], ...newAllInfo[1]];
        } else {
          common_vendor.index.showToast({
            title: "没有更多数据了",
            icon: "none"
          });
          offSet.value -= 14;
          curPage.value--;
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:222", e);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
        offSet.value -= 14;
        curPage.value--;
      } finally {
        isLoading.value = false;
      }
    });
    common_vendor.onPageScroll((e) => {
      if (e.scrollTop > 300) {
        goTop.value = true;
      } else {
        goTop.value = false;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_2,
        b: common_vendor.unref(searchContent),
        c: common_vendor.o(($event) => common_vendor.isRef(searchContent) ? searchContent.value = $event.detail.value : searchContent = $event.detail.value),
        d: common_vendor.o(goSearch),
        e: common_vendor.unref(searchError)
      }, common_vendor.unref(searchError) ? {
        f: common_vendor.t(common_vendor.unref(searchError))
      } : {}, {
        g: common_vendor.unref(isShowChoose)
      }, common_vendor.unref(isShowChoose) ? common_vendor.e({
        h: allInfoByUserName.value[0][0]
      }, allInfoByUserName.value[0][0] ? {
        i: !common_vendor.unref(choose) ? 1 : "",
        j: common_vendor.o(($event) => (common_vendor.isRef(choose) ? choose.value = false : choose = false, allInfo.value = allInfoByUserName.value))
      } : {}, {
        k: allInfoByTitle.value[0][0]
      }, allInfoByTitle.value[0][0] ? {
        l: common_vendor.unref(choose) ? 1 : "",
        m: common_vendor.o(($event) => (common_vendor.isRef(choose) ? choose.value = true : choose = true, allInfo.value = allInfoByTitle.value))
      } : {}) : {}, {
        n: common_vendor.f(2, (i, index, i0) => {
          return {
            a: common_vendor.f(allInfo.value[i - 1], (j, k1, i1) => {
              return {
                a: j.pictures[0],
                b: common_vendor.t(j.title),
                c: j.avatar,
                d: common_vendor.t(j.userName),
                e: j.isLiked ? "red" : "#666",
                f: common_vendor.o(($event) => toggleLike(j), j.name),
                g: j.name,
                h: common_vendor.o(($event) => goDetail(j), j.name)
              };
            }),
            b: index
          };
        }),
        o: common_vendor.unref(isLoading)
      }, common_vendor.unref(isLoading) ? {} : {}, {
        p: common_vendor.unref(goTop)
      }, common_vendor.unref(goTop) ? {
        q: common_vendor.o(goTopFunc),
        r: common_assets._imports_1
      } : {});
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
