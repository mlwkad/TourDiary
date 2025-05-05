"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    let searchContent = common_vendor.ref("");
    let goTop = common_vendor.ref(false);
    let choose = common_vendor.ref(false);
    let isShowChoose = common_vendor.ref(false);
    const allInfo = common_vendor.ref([[], []]);
    const allInfoByUserName = common_vendor.ref([[], []]);
    const allInfoByTitle = common_vendor.ref([[], []]);
    common_vendor.watch(searchContent, (newVal) => {
      if (!newVal) {
        api_api.getAllReleases(50, 0).then((res) => {
          allInfo.value[0] = res.releases;
        });
        api_api.getAllReleases(50, 1).then((res) => {
          allInfo.value[1] = res.releases;
        });
        isShowChoose.value = false;
      }
    });
    const goSearch = () => {
      if (!searchContent.value)
        return;
      api_api.searchReleases(
        { userName: searchContent.value, title: searchContent.value }
      ).then((res) => {
        isShowChoose.value = true;
        if (res.byUserName.length === 1) {
          allInfoByUserName.value[0] = res.byUserName;
        } else {
          allInfoByUserName.value[0] = res.byUserName.slice(0, res.byUserName.length / 2);
          allInfoByUserName.value[1] = res.byUserName.slice(res.byUserName.length / 2, res.byUserName.length);
        }
        allInfo.value = allInfoByUserName.value;
        if (res.byTitle.length === 1) {
          allInfoByTitle.value[0] = res.byTitle;
        } else {
          allInfoByTitle.value[0] = res.byTitle.slice(0, res.byTitle.length / 2);
          allInfoByTitle.value[1] = res.byTitle.slice(res.byTitle.length / 2, res.byTitle.length);
        }
      });
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
    common_vendor.onShow(() => {
      api_api.getAllReleases(50, 0).then((res) => {
        allInfo.value[0] = res.releases;
      });
      api_api.getAllReleases(50, 1).then((res) => {
        allInfo.value[1] = res.releases;
      });
    });
    common_vendor.onReachBottom(() => {
    });
    common_vendor.onPageScroll((e) => {
      if (e.scrollTop > 400) {
        goTop.value = true;
      } else {
        goTop.value = false;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$3,
        b: common_vendor.unref(searchContent),
        c: common_vendor.o(($event) => common_vendor.isRef(searchContent) ? searchContent.value = $event.detail.value : searchContent = $event.detail.value),
        d: common_vendor.o(goSearch),
        e: common_vendor.unref(isShowChoose)
      }, common_vendor.unref(isShowChoose) ? {
        f: !common_vendor.unref(choose) ? 1 : "",
        g: common_vendor.o(($event) => (common_vendor.isRef(choose) ? choose.value = false : choose = false, allInfo.value = allInfoByUserName.value)),
        h: common_vendor.unref(choose) ? 1 : "",
        i: common_vendor.o(($event) => (common_vendor.isRef(choose) ? choose.value = true : choose = true, allInfo.value = allInfoByTitle.value))
      } : {}, {
        j: common_vendor.f(2, (i, index, i0) => {
          return {
            a: common_vendor.f(allInfo.value[i - 1], (j, k1, i1) => {
              return {
                a: common_vendor.t(j.title),
                b: common_vendor.t(j.userName),
                c: j.name,
                d: common_vendor.o(($event) => goDetail(j), j.name)
              };
            }),
            b: index
          };
        }),
        k: common_assets._imports_0,
        l: common_assets._imports_0,
        m: common_vendor.unref(goTop)
      }, common_vendor.unref(goTop) ? {
        n: common_vendor.o(goTopFunc),
        o: common_assets._imports_2$1
      } : {});
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
