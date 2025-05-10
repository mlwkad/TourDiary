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
    let isShowChangePage = common_vendor.ref(true);
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
          common_vendor.index.__f__("log", "at pages/index/index.vue:84", e);
        }
        isShowChoose.value = false;
        isShowChangePage.value = true;
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
        isShowChangePage.value = false;
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
        common_vendor.index.__f__("log", "at pages/index/index.vue:115", e);
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
    const changePage = async (num) => {
      if (num === 1 && curPage.value !== 1) {
        offSet.value -= 14;
        try {
          const res = await api_api.getAllReleases(14, offSet.value);
          distributeData(res.releases || [], allInfo.value);
          goTopFunc();
          curPage.value--;
        } catch (e) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:142", e);
          common_vendor.index.showToast({
            title: "获取数据失败",
            icon: "none"
          });
        }
      } else if (num === 2) {
        offSet.value += 14;
        try {
          const res = await api_api.getAllReleases(14, offSet.value);
          distributeData(res.releases || [], allInfo.value);
          goTopFunc();
          curPage.value++;
        } catch (e) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:157", e);
          common_vendor.index.showToast({
            title: "获取数据失败",
            icon: "none"
          });
        }
      }
    };
    common_vendor.onShow(async () => {
      try {
        const res = await api_api.getAllReleases(14, 0);
        distributeData(res.releases || [], allInfo.value);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:171", e);
      }
      searchContent.value = "";
    });
    common_vendor.onReachBottom(() => {
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
        a: common_assets._imports_3,
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
                c: common_vendor.t(j.userName),
                d: j.name,
                e: common_vendor.o(($event) => goDetail(j), j.name)
              };
            }),
            b: index
          };
        }),
        o: common_assets._imports_0,
        p: common_vendor.unref(isShowChangePage)
      }, common_vendor.unref(isShowChangePage) ? {
        q: common_vendor.o(($event) => changePage(1)),
        r: common_vendor.t(common_vendor.unref(curPage)),
        s: common_vendor.o(($event) => changePage(2))
      } : {}, {
        t: common_vendor.unref(goTop)
      }, common_vendor.unref(goTop) ? {
        v: common_vendor.o(goTopFunc),
        w: common_assets._imports_2
      } : {});
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
