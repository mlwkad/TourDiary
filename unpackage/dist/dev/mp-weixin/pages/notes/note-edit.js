"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "note-edit",
  setup(__props) {
    const note = common_vendor.reactive({
      id: "",
      title: "",
      content: "",
      location: "",
      createdAt: "",
      playTime: "",
      money: "",
      personNum: "",
      pictures: [],
      videos: [],
      cover: ""
    });
    const getNoteDetail = (info) => {
      Object.assign(note, {
        id: info.releaseID,
        title: info.title,
        content: info.content,
        location: info.location,
        createdAt: info.createdAt,
        pictures: info.pictures,
        playTime: info.playTime,
        money: info.money,
        personNum: info.personNum,
        videos: info.videos,
        cover: info.cover || ""
      });
    };
    common_vendor.onBackPress(() => {
      if (note.title || note.content || note.pictures.length > 0) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否放弃此次编辑？",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateBack();
            }
          }
        });
        return true;
      }
      return false;
    });
    const saveNote = () => {
      if (!note.title) {
        common_vendor.index.showToast({
          title: "请输入标题",
          icon: "none"
        });
        return;
      }
      if (!note.content) {
        common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "保存中"
      });
      api_api.updateRelease(note.id, note).then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      }).catch((e) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "error"
        });
      });
    };
    const chooseLocation = () => {
      common_vendor.index.chooseLocation({
        success: (res) => {
          note.location = res.name || res.address;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/notes/note-edit.vue:192", "选择位置失败", err);
        }
      });
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 9 - note.pictures.length,
        // 还能选几张
        sizeType: ["compressed"],
        // 压缩后的图片 或 original:原图
        sourceType: ["album", "camera"],
        // 可以来自相册 相机
        success: (res) => {
          note.pictures = [...note.pictures, ...res.tempFilePaths];
        }
      });
    };
    const removeImage = (index) => {
      note.pictures.splice(index, 1);
    };
    const chooseVideo = () => {
      common_vendor.index.chooseVideo({
        count: 1,
        sourceType: ["album", "camera"],
        success: (res) => {
          note.videos = [res.tempFilePath];
        }
      });
    };
    const removeVideo = () => {
      note.videos = [];
    };
    const chooseVideoCover = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          note.cover = res.tempFilePaths[0];
        }
      });
    };
    const removeCover = () => {
      note.cover = "";
    };
    common_vendor.onLoad((options) => {
      if (options.info) {
        const info = JSON.parse(decodeURIComponent(options.info));
        getNoteDetail(info);
        common_vendor.index.setNavigationBarTitle({
          title: "编辑笔记"
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: note.title,
        b: common_vendor.o(($event) => note.title = $event.detail.value),
        c: common_assets._imports_3,
        d: note.location
      }, note.location ? {
        e: common_vendor.t(note.location)
      } : {}, {
        f: common_vendor.o(chooseLocation),
        g: common_assets._imports_1,
        h: note.money,
        i: common_vendor.o(($event) => note.money = $event.detail.value),
        j: common_assets._imports_2$1,
        k: note.personNum,
        l: common_vendor.o(($event) => note.personNum = $event.detail.value),
        m: common_assets._imports_1$1,
        n: note.playTime,
        o: common_vendor.o(($event) => note.playTime = $event.detail.value),
        p: note.content,
        q: common_vendor.o(($event) => note.content = $event.detail.value),
        r: common_vendor.f(note.pictures, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index
          };
        }),
        s: note.pictures.length < 9
      }, note.pictures.length < 9 ? {
        t: common_vendor.o(chooseImage)
      } : {}, {
        v: note.videos && note.videos.length > 0
      }, note.videos && note.videos.length > 0 ? common_vendor.e({
        w: note.videos[0],
        x: common_assets._imports_4,
        y: common_vendor.o(removeVideo),
        z: note.cover
      }, note.cover ? {
        A: note.cover,
        B: common_assets._imports_4,
        C: common_vendor.o(removeCover)
      } : {}, {
        D: !note.cover
      }, !note.cover ? {
        E: common_vendor.o(chooseVideoCover)
      } : {}) : {}, {
        F: !note.videos || note.videos.length === 0
      }, !note.videos || note.videos.length === 0 ? {
        G: common_vendor.o(chooseVideo)
      } : {}, {
        H: common_vendor.o(saveNote)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aecc2c28"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/note-edit.js.map
