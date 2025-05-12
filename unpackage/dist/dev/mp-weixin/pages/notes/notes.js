"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "notes",
  setup(__props) {
    const notes = common_vendor.ref([]);
    common_vendor.ref(false);
    const userID = JSON.parse(common_vendor.index.getStorageSync("userInfo")).userId;
    const showAllReason = common_vendor.ref(false);
    const allReason = common_vendor.ref("");
    let state = common_vendor.ref("555");
    let reason = common_vendor.ref("555");
    const getRejectReason = (reason2) => {
      allReason.value = reason2;
      showAllReason.value = true;
    };
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
    const viewNote = async (releaseID, state2) => {
      if (state2 !== "resolve") {
        common_vendor.index.showToast({
          title: "笔记未通过,请继续编辑",
          icon: "none"
        });
        return;
      }
      try {
        const info = await api_api.getReleaseDetail(releaseID);
        common_vendor.index.navigateTo({
          url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/notes/notes.vue:137", e);
        common_vendor.index.showToast({
          title: "获取详情失败",
          icon: "none"
        });
      }
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
            try {
              await api_api.deleteRelease(info.releaseID, userID);
              common_vendor.index.showToast({
                title: "已删除",
                icon: "success"
              });
              const res2 = await api_api.getUserReleases(userID);
              notes.value = res2;
            } catch (e) {
              common_vendor.index.__f__("log", "at pages/notes/notes.vue:168", e);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const createNote = () => {
      common_vendor.index.reLaunch({
        url: "/pages/Release/Release"
      });
    };
    const changeState = async (note) => {
      try {
        await api_api.updateState(
          note.releaseID,
          { state: state.value, reason: reason.value }
        );
        common_vendor.index.showToast({
          title: "状态已更新",
          icon: "success"
        });
        const res = await api_api.getUserReleases(userID);
        notes.value = res;
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/notes/notes.vue:201", e);
        common_vendor.index.showToast({
          title: "更新状态失败",
          icon: "none"
        });
      }
    };
    const previewImage = (images, current) => {
      const stringUrls = images.map((img) => String(img));
      common_vendor.index.previewImage({
        urls: stringUrls,
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
            c: note.state !== "resolve"
          }, note.state !== "resolve" ? {
            d: common_vendor.o(($event) => editNote(note), index)
          } : {}, {
            e: common_vendor.t(changeStateName(note.state)),
            f: note.state === "reject"
          }, note.state === "reject" ? {
            g: common_vendor.t(note.reason),
            h: common_vendor.o(($event) => getRejectReason(note.reason), index)
          } : {}, {
            i: getStateColor(note.state),
            j: common_vendor.o(($event) => changeState(note), index),
            k: note.content
          }, note.content ? {
            l: common_vendor.t(note.content)
          } : {}, {
            m: note.location
          }, note.location ? {
            n: common_assets._imports_2,
            o: common_vendor.t(note.location)
          } : {}, {
            p: common_vendor.t(note.createdAt.slice(0, 10)),
            q: note.pictures && note.pictures.length
          }, note.pictures && note.pictures.length ? {
            r: common_vendor.f(note.pictures, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(note.pictures, imgIndex), imgIndex)
              };
            })
          } : {}, {
            s: index,
            t: common_vendor.o(($event) => viewNote(note.releaseID, note.state), index)
          });
        })
      } : {
        g: common_assets._imports_3,
        h: common_vendor.o(createNote)
      }, {
        i: common_assets._imports_2$3,
        j: common_vendor.o(createNote),
        k: showAllReason.value
      }, showAllReason.value ? {
        l: common_vendor.t(allReason.value),
        m: common_vendor.o(($event) => showAllReason.value = false),
        n: common_vendor.o(() => {
        }),
        o: common_vendor.o(($event) => showAllReason.value = false)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cc7fb8d7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/notes.js.map
