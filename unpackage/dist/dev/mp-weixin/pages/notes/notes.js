"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "notes",
  setup(__props) {
    const notes = common_vendor.ref([]);
    const isRefreshing = common_vendor.ref(false);
    common_vendor.ref("all");
    const viewNote = async (releaseID) => {
      const info = await api_api.getReleaseDetail(releaseID);
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
      });
    };
    const deleteNote = (id, index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这个笔记吗？",
        success: (res) => {
          if (res.confirm) {
            notes.value.splice(index, 1);
            common_vendor.index.showToast({
              title: "已删除",
              icon: "success"
            });
          }
        }
      });
    };
    const createNote = () => {
      common_vendor.index.reLaunch({
        url: "/pages/Release/Release"
      });
    };
    const onRefresh = async () => {
      isRefreshing.value = true;
      const userID = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      const res = await api_api.getUserReleases(userID);
      notes.value = res;
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({
        urls: images,
        // [url1,url2] 图片地址数组  
        current: images[current]
        // 当前显示的图片索引
      });
    };
    common_vendor.onLoad(async () => {
      const userID = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
      const res = await api_api.getUserReleases(userID);
      notes.value = res;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: notes.value.length > 0
      }, notes.value.length > 0 ? {
        b: common_vendor.f(notes.value, (note, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(note.title),
            b: common_vendor.o(($event) => deleteNote(note.id, index), index),
            c: note.content
          }, note.content ? {
            d: common_vendor.t(note.content)
          } : {}, {
            e: note.location
          }, note.location ? {
            f: common_assets._imports_0$2,
            g: common_vendor.t(note.location)
          } : {}, {
            h: common_vendor.t(note.createdAt.slice(0, 10)),
            i: note.pictures && note.pictures.length
          }, note.pictures && note.pictures.length ? {
            j: common_vendor.f(note.pictures, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(note.pictures, imgIndex), imgIndex)
              };
            })
          } : {}, {
            k: index,
            l: common_vendor.o(($event) => viewNote(note.releaseID), index)
          });
        }),
        c: common_assets._imports_1$1
      } : {
        d: common_assets._imports_0$2,
        e: common_vendor.o(createNote)
      }, {
        f: common_vendor.o(onRefresh),
        g: isRefreshing.value,
        h: common_assets._imports_2$1,
        i: common_vendor.o(createNote)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cc7fb8d7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/notes.js.map
