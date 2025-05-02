"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    let searchContent = common_vendor.ref("");
    let goTop = common_vendor.ref(false);
    const allInfo = common_vendor.ref([
      [
        { img: "#", title: "阿爸四阿萨德阿萨德阿萨德阿萨德阿萨德", avatar: "#", name: 1 },
        { img: "#", title: "as dasasc avevva sdcva scasc asc", avatar: "#", name: 2 },
        { img: "#", title: 123, avatar: "#", name: 3 },
        { img: "#", title: 123, avatar: "#", name: 4 },
        { img: "#", title: 123, avatar: "#", name: 5 },
        { img: "#", title: 123, avatar: "#", name: 6 },
        { img: "#", title: 123, avatar: "#", name: 7 }
      ],
      [
        { img: "#", title: 123, avatar: "#", name: 8 },
        { img: "#", title: 123, avatar: "#", name: 9 }
      ]
    ]);
    const goSearch = () => {
    };
    const goTopFunc = () => {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    };
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
        a: common_assets._imports_1,
        b: common_assets._imports_0,
        c: common_vendor.unref(searchContent),
        d: common_vendor.o(($event) => common_vendor.isRef(searchContent) ? searchContent.value = $event.detail.value : searchContent = $event.detail.value),
        e: common_vendor.o(goSearch),
        f: common_vendor.f(2, (i, index, i0) => {
          return {
            a: common_vendor.f(allInfo.value[i - 1], (j, k1, i1) => {
              return {
                a: common_vendor.t(j.title),
                b: common_vendor.t(j.name),
                c: j.name
              };
            }),
            b: index
          };
        }),
        g: common_assets._imports_1$1,
        h: common_assets._imports_1$1,
        i: common_vendor.unref(goTop)
      }, common_vendor.unref(goTop) ? {
        j: common_vendor.o(goTopFunc),
        k: common_assets._imports_3
      } : {});
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
