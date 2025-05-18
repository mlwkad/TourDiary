"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const utils_filter = require("../../utils/filter.js");
if (!Array) {
  const _easycom_up_waterfall2 = common_vendor.resolveComponent("up-waterfall");
  _easycom_up_waterfall2();
}
const _easycom_up_waterfall = () => "../../uni_modules/uview-plus/components/u-waterfall/u-waterfall.js";
if (!Math) {
  _easycom_up_waterfall();
}
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const searchContent = common_vendor.ref("");
    const goTop = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const searchError = common_vendor.ref("");
    const curPage = common_vendor.ref(1);
    const offSet = common_vendor.ref(0);
    const isShowChoose = common_vendor.ref(false);
    const choose = common_vendor.ref(false);
    const isShowUserName = common_vendor.ref(false);
    const isShowTitle = common_vendor.ref(false);
    const showWaterfall = common_vendor.ref(true);
    const isSearch = common_vendor.ref(false);
    const flowList = common_vendor.ref([]);
    const allInfoByUserName = common_vendor.ref([]);
    const allInfoByTitle = common_vendor.ref([]);
    common_vendor.watch(searchContent, async (newVal) => {
      if (!newVal) {
        isSearch.value = false;
        showWaterfall.value = false;
        await fetchData();
        showWaterfall.value = true;
        isShowChoose.value = false;
        isShowUserName.value = false;
        isShowTitle.value = false;
      } else {
        isSearch.value = true;
      }
    });
    const fetchData = async () => {
      const res = await api_api.getAllReleases(20, 0);
      flowList.value = (res.releases || []).map((item) => ({
        ...item,
        id: item.releaseID,
        imgWidth: 300,
        imgHeight: 200
      }));
    };
    const goSearch = async () => {
      searchError.value = "";
      const searchValidation = utils_filter.validateSearch(searchContent.value);
      if (!searchValidation.isValid) {
        searchError.value = searchValidation.message;
        return;
      }
      searchContent.value = searchValidation.filteredText;
      showWaterfall.value = false;
      try {
        const res = await api_api.searchReleases({ userName: searchContent.value, title: searchContent.value });
        allInfoByUserName.value = res.byUserName.map((item) => ({
          ...item,
          id: item.releaseID,
          imgWidth: 300,
          imgHeight: 200
        }));
        allInfoByTitle.value = res.byTitle.map((item) => ({
          ...item,
          id: item.releaseID,
          imgWidth: 300,
          imgHeight: 200
        }));
        if (allInfoByUserName.value.length === 0 && allInfoByTitle.value.length === 0) {
          searchError.value = "未找到相关内容";
        } else if (allInfoByUserName.value.length > 0 && allInfoByTitle.value.length === 0) {
          showWaterfall.value = true;
          isShowChoose.value = true;
          isShowUserName.value = true;
          choose.value = false;
          flowList.value = allInfoByUserName.value;
        } else if (allInfoByUserName.value.length === 0 && allInfoByTitle.value.length > 0) {
          showWaterfall.value = true;
          isShowChoose.value = true;
          isShowTitle.value = true;
          choose.value = true;
          flowList.value = allInfoByTitle.value;
        } else {
          showWaterfall.value = true;
          isShowChoose.value = true;
          isShowUserName.value = true;
          isShowTitle.value = true;
          choose.value = false;
          flowList.value = allInfoByUserName.value;
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:147", e);
        searchError.value = "搜索失败，请稍后再试";
      }
    };
    const chooseToUser = () => {
      showWaterfall.value = false;
      choose.value = false;
      flowList.value = allInfoByUserName.value;
      setTimeout(() => {
        showWaterfall.value = true;
      }, 10);
    };
    const chooseToRelease = () => {
      showWaterfall.value = false;
      choose.value = true;
      flowList.value = allInfoByTitle.value;
      setTimeout(() => {
        showWaterfall.value = true;
      }, 10);
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
          common_vendor.index.showToast({ title: "收藏成功", icon: "none" });
          item.isLiked = true;
        } else {
          await api_api.removeLiked(userId, item.releaseID);
          common_vendor.index.showToast({ title: "取消收藏", icon: "none" });
          item.isLiked = false;
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:196", e);
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
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
        common_vendor.index.__f__("log", "at pages/index/index.vue:210", e);
      }
    };
    common_vendor.onMounted(() => {
      fetchData();
    });
    common_vendor.onShow(async () => {
      await fetchData();
      searchContent.value = "";
      offSet.value = 0;
      curPage.value = 1;
    });
    common_vendor.onReachBottom(async () => {
      if (isLoading.value)
        return;
      if (isSearch.value)
        return;
      isLoading.value = true;
      offSet.value += 20;
      curPage.value++;
      try {
        const res = await api_api.getAllReleases(20, offSet.value);
        if (res.releases && res.releases.length > 0) {
          await checkLikedStatus(res.releases);
          flowList.value = [...flowList.value, ...res.releases.map((item) => ({
            ...item,
            id: item.releaseID,
            imgWidth: 300,
            imgHeight: 200
          }))];
        } else {
          common_vendor.index.showToast({ title: "没有更多数据了", icon: "none" });
          offSet.value -= 20;
          curPage.value--;
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:247", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        offSet.value -= 20;
        curPage.value--;
      } finally {
        isLoading.value = false;
      }
    });
    common_vendor.onPageScroll((e) => {
      goTop.value = e.scrollTop > 300;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_2,
        b: searchContent.value,
        c: common_vendor.o(($event) => searchContent.value = $event.detail.value),
        d: common_vendor.o(goSearch),
        e: searchError.value
      }, searchError.value ? {
        f: common_vendor.t(searchError.value)
      } : {}, {
        g: isShowChoose.value
      }, isShowChoose.value ? common_vendor.e({
        h: isShowUserName.value
      }, isShowUserName.value ? {
        i: !choose.value ? 1 : "",
        j: common_vendor.o(($event) => chooseToUser())
      } : {}, {
        k: isShowTitle.value
      }, isShowTitle.value ? {
        l: choose.value ? 1 : "",
        m: common_vendor.o(($event) => chooseToRelease())
      } : {}) : {}, {
        n: showWaterfall.value
      }, showWaterfall.value ? {
        o: common_vendor.w(({
          leftList
        }, s0, i0) => {
          return {
            a: common_vendor.f(leftList, (item, k1, i1) => {
              return {
                a: item.pictures[0],
                b: common_vendor.t(item.title),
                c: item.avatar,
                d: common_vendor.t(item.userName),
                e: item.isLiked ? "red" : "#666",
                f: common_vendor.o(($event) => toggleLike(item), item.id),
                g: item.id,
                h: common_vendor.o(($event) => goDetail(item), item.id)
              };
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "left",
          path: "o",
          vueId: "1cf27b2a-0"
        }),
        p: common_vendor.w(({
          rightList
        }, s0, i0) => {
          return {
            a: common_vendor.f(rightList, (item, k1, i1) => {
              return {
                a: item.pictures[0],
                b: common_vendor.t(item.title),
                c: item.avatar,
                d: common_vendor.t(item.userName),
                e: item.isLiked ? "red" : "#666",
                f: common_vendor.o(($event) => toggleLike(item), item.id),
                g: item.id,
                h: common_vendor.o(($event) => goDetail(item), item.id)
              };
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "right",
          path: "p",
          vueId: "1cf27b2a-0"
        }),
        q: common_vendor.o(($event) => flowList.value = $event),
        r: common_vendor.p({
          gap: 8,
          modelValue: flowList.value
        })
      } : {}, {
        s: isLoading.value
      }, isLoading.value ? {} : {}, {
        t: goTop.value
      }, goTop.value ? {
        v: common_vendor.o(goTopFunc),
        w: common_assets._imports_1
      } : {});
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
