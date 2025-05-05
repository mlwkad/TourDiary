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
    const userID = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
    let state = common_vendor.ref("555");
    let reason = common_vendor.ref("555");
    const getStateColor = (state2) => {
      if (state2 === "wait")
        return "rgba(255, 204, 0, 0.7)";
      if (state2 === "resolve")
        return "rgba(0, 128, 0, 0.637)";
      if (state2 === "reject")
        return "rgba(219, 6, 6, 0.516)";
      return "rgba(255, 204, 0, 0.7)";
    };
    const changeStateName = (name) => {
      if (name === "resolve")
        return "已通过";
      if (name === "reject")
        return "未通过";
      if (name === "wait")
        return "待审核";
      return "待审核";
    };
    const viewNote = async (releaseID) => {
      const info = await api_api.getReleaseDetail(releaseID);
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
      });
    };
    const editNote = (info, index) => {
      common_vendor.index.navigateTo({
        url: `/pages/notes/note-edit?info=${encodeURIComponent(JSON.stringify(info))}`
      });
    };
    const deleteNote = (info, index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这个笔记吗？",
        success: async (res) => {
          if (res.confirm) {
            await api_api.deleteRelease(info.releaseID, userID);
            common_vendor.index.showToast({
              title: "已删除",
              icon: "success"
            });
            const res2 = await api_api.getUserReleases(userID);
            notes.value = res2;
          }
        }
      });
    };
    const createNote = () => {
      common_vendor.index.reLaunch({
        url: "/pages/Release/Release"
      });
    };
    const changeState = (note) => {
      api_api.updateState(
        note.releaseID,
        { state: state.value, reason: reason.value }
      );
    };
    const onRefresh = async () => {
      isRefreshing.value = true;
      const res = await api_api.getUserReleases(userID);
      notes.value = res;
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      isRefreshing.value = false;
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
      const res = await api_api.getUserReleases(userID);
      notes.value = res;
    });
    common_vendor.onShow(async () => {
      const res = await api_api.getUserReleases(userID);
      notes.value = res;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(state),
        b: common_vendor.o(($event) => common_vendor.isRef(state) ? state.value = $event.detail.value : state = $event.detail.value),
        c: common_vendor.unref(reason),
        d: common_vendor.o(($event) => common_vendor.isRef(reason) ? reason.value = $event.detail.value : reason = $event.detail.value),
        e: notes.value.length > 0
      }, notes.value.length > 0 ? {
        f: common_vendor.f(notes.value, (note, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(note.title),
            b: common_vendor.o(($event) => deleteNote(note), index),
            c: common_vendor.o(($event) => editNote(note), index),
            d: common_vendor.t(changeStateName(note.state)),
            e: note.state === "reject"
          }, note.state === "reject" ? {
            f: common_vendor.t(note.reason)
          } : {}, {
            g: getStateColor(note.state),
            h: common_vendor.o(($event) => changeState(note), index),
            i: note.content
          }, note.content ? {
            j: common_vendor.t(note.content)
          } : {}, {
            k: note.location
          }, note.location ? {
            l: common_assets._imports_0$1,
            m: common_vendor.t(note.location)
          } : {}, {
            n: common_vendor.t(note.createdAt.slice(0, 10)),
            o: note.pictures && note.pictures.length
          }, note.pictures && note.pictures.length ? {
            p: common_vendor.f(note.pictures, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(note.pictures, imgIndex), imgIndex)
              };
            })
          } : {}, {
            q: index,
            r: common_vendor.o(($event) => viewNote(note.releaseID), index)
          });
        })
      } : {
        g: common_assets._imports_0$3,
        h: common_vendor.o(createNote)
      }, {
        i: common_vendor.o(onRefresh),
        j: isRefreshing.value,
        k: common_assets._imports_2$2,
        l: common_vendor.o(createNote)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cc7fb8d7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/notes.js.map
