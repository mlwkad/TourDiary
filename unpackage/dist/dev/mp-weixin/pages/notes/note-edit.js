"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const utils_filter = require("../../utils/filter.js");
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
    const errors = common_vendor.reactive({
      title: "",
      content: "",
      location: "",
      playTime: "",
      money: "",
      personNum: "",
      pictures: ""
    });
    const clearErrors = () => {
      for (let key in errors) {
        errors[key] = "";
      }
    };
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
    const validateForm = () => {
      let isValid = true;
      clearErrors();
      const titleVal = utils_filter.validateTitle(note.title);
      if (!titleVal.isValid) {
        errors.title = titleVal.message;
        isValid = false;
      } else {
        note.title = titleVal.filteredText;
      }
      const contentVal = utils_filter.validateContent(note.content);
      if (!contentVal.isValid) {
        errors.content = contentVal.message;
        isValid = false;
      } else {
        note.content = contentVal.filteredText;
      }
      if (note.location) {
        const locationVal = utils_filter.validateLocation(note.location);
        if (!locationVal.isValid) {
          errors.location = locationVal.message;
          isValid = false;
        } else {
          note.location = locationVal.filteredText;
        }
      }
      if (note.playTime && (isNaN(Number(note.playTime)) || Number(note.playTime) <= 0)) {
        errors.playTime = "请输入有效的游玩时间";
        isValid = false;
      }
      if (note.money && (isNaN(Number(note.money)) || Number(note.money) < 0)) {
        errors.money = "请输入有效的费用金额";
        isValid = false;
      }
      if (note.personNum && (isNaN(Number(note.personNum)) || Number(note.personNum) <= 0 || !Number.isInteger(Number(note.personNum)))) {
        errors.personNum = "请输入有效的人数";
        isValid = false;
      }
      if (!note.pictures || note.pictures.length === 0) {
        errors.pictures = "至少上传一张图片";
        isValid = false;
      }
      return isValid;
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
    const saveNote = async () => {
      if (!validateForm()) {
        return;
      }
      try {
        await api_api.updateRelease(note.id, note);
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/notes/note-edit.vue:232", e);
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "error"
        });
      }
    };
    const chooseLocation = () => {
      common_vendor.index.chooseLocation({
        success: (res) => {
          note.location = res.name || res.address;
          errors.location = "";
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/notes/note-edit.vue:250", "选择位置失败", err);
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
          errors.pictures = "";
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
        a: common_vendor.o([($event) => note.title = $event.detail.value, ($event) => errors.title = ""]),
        b: note.title,
        c: errors.title
      }, errors.title ? {
        d: common_vendor.t(errors.title)
      } : {}, {
        e: common_assets._imports_3,
        f: note.location
      }, note.location ? {
        g: common_vendor.t(note.location)
      } : {}, {
        h: common_vendor.o(chooseLocation),
        i: errors.location
      }, errors.location ? {
        j: common_vendor.t(errors.location)
      } : {}, {
        k: common_assets._imports_1,
        l: common_vendor.o([($event) => note.money = $event.detail.value, ($event) => errors.money = ""]),
        m: note.money,
        n: common_assets._imports_2$2,
        o: common_vendor.o([($event) => note.personNum = $event.detail.value, ($event) => errors.personNum = ""]),
        p: note.personNum,
        q: common_assets._imports_1$1,
        r: common_vendor.o([($event) => note.playTime = $event.detail.value, ($event) => errors.playTime = ""]),
        s: note.playTime,
        t: errors.money
      }, errors.money ? {
        v: common_vendor.t(errors.money)
      } : {}, {
        w: errors.personNum
      }, errors.personNum ? {
        x: common_vendor.t(errors.personNum)
      } : {}, {
        y: errors.playTime
      }, errors.playTime ? {
        z: common_vendor.t(errors.playTime)
      } : {}, {
        A: common_vendor.o([($event) => note.content = $event.detail.value, ($event) => errors.content = ""]),
        B: note.content,
        C: errors.content
      }, errors.content ? {
        D: common_vendor.t(errors.content)
      } : {}, {
        E: common_vendor.f(note.pictures, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index
          };
        }),
        F: note.pictures.length < 9
      }, note.pictures.length < 9 ? {
        G: common_vendor.o(chooseImage)
      } : {}, {
        H: errors.pictures
      }, errors.pictures ? {
        I: common_vendor.t(errors.pictures)
      } : {}, {
        J: note.videos && note.videos.length > 0
      }, note.videos && note.videos.length > 0 ? common_vendor.e({
        K: note.videos[0],
        L: common_assets._imports_4,
        M: common_vendor.o(removeVideo),
        N: note.cover
      }, note.cover ? {
        O: note.cover,
        P: common_assets._imports_4,
        Q: common_vendor.o(removeCover)
      } : {}, {
        R: !note.cover
      }, !note.cover ? {
        S: common_vendor.o(chooseVideoCover)
      } : {}) : {}, {
        T: !note.videos || note.videos.length === 0
      }, !note.videos || note.videos.length === 0 ? {
        U: common_vendor.o(chooseVideo)
      } : {}, {
        V: common_vendor.o(saveNote)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aecc2c28"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/note-edit.js.map
