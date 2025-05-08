"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const utils_filter = require("../../utils/filter.js");
const api_ws = require("../../api/ws.js");
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    let wsContent = common_vendor.ref("");
    let messages = common_vendor.ref([]);
    const handleStreamChat = () => {
      if (!wsContent.value.trim())
        return;
      messages.value.push(`我: ${wsContent.value}`);
      api_ws.streamChat(wsContent.value, (update) => {
        if (update.type === "update") {
          if (messages.value.length > 0 && messages.value[messages.value.length - 1].startsWith("AI:")) {
            messages.value[messages.value.length - 1] = `AI: ${update.content}`;
          } else {
            messages.value.push(`AI: ${update.content}`);
          }
        } else if (update.type === "error") {
          common_vendor.index.__f__("error", "at pages/index/index.vue:86", update.error);
        }
      });
      wsContent.value = "";
    };
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
    common_vendor.watchEffect(() => {
      if (!searchContent.value) {
        api_api.getAllReleases(14, 0).then((res) => {
          distributeData(res.releases || [], allInfo.value);
        });
        isShowChoose.value = false;
        isShowChangePage.value = true;
      }
    });
    const goSearch = () => {
      searchError.value = "";
      const searchValidation = utils_filter.validateSearch(searchContent.value);
      if (!searchValidation.isValid) {
        searchError.value = searchValidation.message;
        return;
      }
      searchContent.value = searchValidation.filteredText;
      api_api.searchReleases(
        { userName: searchContent.value, title: searchContent.value }
      ).then((res) => {
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
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/index/index.vue:164", err);
        searchError.value = "搜索失败，请稍后再试";
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
    const changePage = (num) => {
      if (num === 1 && curPage.value !== 1) {
        offSet.value -= 14;
        api_api.getAllReleases(14, offSet.value).then((res) => {
          distributeData(res.releases || [], allInfo.value);
        });
        goTopFunc();
        curPage.value--;
      } else if (num === 2) {
        offSet.value += 14;
        api_api.getAllReleases(14, offSet.value).then((res) => {
          distributeData(res.releases || [], allInfo.value);
        });
        goTopFunc();
        curPage.value++;
      }
    };
    common_vendor.onShow(() => {
      api_api.getAllReleases(14, 0).then((res) => {
        distributeData(res.releases || [], allInfo.value);
      });
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
        a: common_vendor.unref(wsContent),
        b: common_vendor.o(($event) => common_vendor.isRef(wsContent) ? wsContent.value = $event.detail.value : wsContent = $event.detail.value),
        c: common_vendor.o(handleStreamChat),
        d: common_vendor.f(common_vendor.unref(messages), (msg, index, i0) => {
          return {
            a: common_vendor.t(msg),
            b: index
          };
        }),
        e: common_assets._imports_3,
        f: common_vendor.unref(searchContent),
        g: common_vendor.o(($event) => common_vendor.isRef(searchContent) ? searchContent.value = $event.detail.value : searchContent = $event.detail.value),
        h: common_vendor.o(goSearch),
        i: common_vendor.unref(searchError)
      }, common_vendor.unref(searchError) ? {
        j: common_vendor.t(common_vendor.unref(searchError))
      } : {}, {
        k: common_vendor.unref(isShowChoose)
      }, common_vendor.unref(isShowChoose) ? common_vendor.e({
        l: allInfoByUserName.value[0][0]
      }, allInfoByUserName.value[0][0] ? {
        m: !common_vendor.unref(choose) ? 1 : "",
        n: common_vendor.o(($event) => (common_vendor.isRef(choose) ? choose.value = false : choose = false, allInfo.value = allInfoByUserName.value))
      } : {}, {
        o: allInfoByTitle.value[0][0]
      }, allInfoByTitle.value[0][0] ? {
        p: common_vendor.unref(choose) ? 1 : "",
        q: common_vendor.o(($event) => (common_vendor.isRef(choose) ? choose.value = true : choose = true, allInfo.value = allInfoByTitle.value))
      } : {}) : {}, {
        r: common_vendor.f(2, (i, index, i0) => {
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
        s: common_assets._imports_0,
        t: common_vendor.unref(isShowChangePage)
      }, common_vendor.unref(isShowChangePage) ? {
        v: common_vendor.o(($event) => changePage(1)),
        w: common_vendor.t(common_vendor.unref(curPage)),
        x: common_vendor.o(($event) => changePage(2))
      } : {}, {
        y: common_vendor.unref(goTop)
      }, common_vendor.unref(goTop) ? {
        z: common_vendor.o(goTopFunc),
        A: common_assets._imports_2
      } : {});
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
