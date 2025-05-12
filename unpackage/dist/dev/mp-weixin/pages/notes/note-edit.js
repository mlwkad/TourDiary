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
    const saveNote = async () => {
      if (!validateForm()) {
        return;
      }
      common_vendor.index.showLoading({
        title: "正在处理..."
      });
      try {
        if (note.pictures.length > 0) {
          const newPictures = note.pictures.filter((pic) => !String(pic).startsWith("https://objectstorageapi"));
          const existingPictures = note.pictures.filter((pic) => String(pic).startsWith("https://objectstorageapi"));
          if (newPictures.length > 0) {
            const pictureRes = await api_api.uploadFiles(newPictures, "image");
            note.pictures = [...existingPictures, ...pictureRes.pictures];
          } else {
            note.pictures = [...existingPictures];
          }
        }
        if (note.videos.length > 0) {
          const newVideos = note.videos.filter((video) => !String(video).startsWith("https://objectstorageapi"));
          const existingVideos = note.videos.filter((video) => String(video).startsWith("https://objectstorageapi"));
          if (newVideos.length > 0) {
            const videoRes = await api_api.uploadFiles(newVideos, "video");
            note.videos = [...existingVideos, ...videoRes.videos];
          } else {
            note.videos = [...existingVideos];
          }
        } else {
          note.videos = [];
        }
        if (note.cover) {
          if (!String(note.cover).startsWith("https://objectstorageapi")) {
            const coverRes = await api_api.uploadFiles(note.cover, "cover");
            note.cover = coverRes.covers[0];
          }
        } else {
          note.cover = "";
        }
        await api_api.updateRelease(note.id, note);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/notes/note-edit.vue:250", e);
        common_vendor.index.hideLoading();
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
          common_vendor.index.__f__("error", "at pages/notes/note-edit.vue:269", "选择位置失败", err);
        }
      });
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 5 - note.pictures.length,
        // 限制最多5张图片
        sizeType: ["compressed"],
        // 压缩后的图片
        sourceType: ["album", "camera"],
        // 可以来自相册或相机
        success: (res) => {
          common_vendor.index.showLoading({ title: "处理图片中..." });
          let count = 0;
          const totalImages = res.tempFilePaths.length;
          res.tempFilePaths.forEach((imagePath) => {
            common_vendor.index.compressImage({
              src: imagePath,
              quality: 80,
              // 压缩质量(0-100),正比于照片质量,反比于压缩率
              success: (compressRes) => {
                note.pictures.push(compressRes.tempFilePath);
                count++;
                if (count >= totalImages) {
                  common_vendor.index.hideLoading();
                }
              },
              fail: () => {
                note.pictures.push(imagePath);
                common_vendor.index.showToast({
                  title: "部分图片压缩失败",
                  icon: "none",
                  duration: 1e3
                });
                count++;
                if (count >= totalImages) {
                  common_vendor.index.hideLoading();
                }
              }
            });
          });
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
        compressed: true,
        // 开启视频压缩
        sourceType: ["album", "camera"],
        success: (res) => {
          common_vendor.index.showLoading({ title: "处理视频中..." });
          common_vendor.index.getVideoInfo({
            src: res.tempFilePath,
            success: (videoInfo) => {
              common_vendor.index.hideLoading();
              if (videoInfo.duration > 60) {
                common_vendor.index.showToast({
                  title: "视频时长不能超过1分钟",
                  icon: "none"
                });
              } else {
                note.videos = [res.tempFilePath];
              }
            },
            fail: () => {
              common_vendor.index.hideLoading();
              note.videos = [res.tempFilePath];
            }
          });
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
          common_vendor.index.showLoading({ title: "处理封面中..." });
          common_vendor.index.compressImage({
            src: res.tempFilePaths[0],
            quality: 80,
            success: (compressRes) => {
              common_vendor.index.hideLoading();
              note.cover = compressRes.tempFilePath;
            },
            fail: () => {
              common_vendor.index.hideLoading();
              note.cover = res.tempFilePaths[0];
              common_vendor.index.showToast({
                title: "封面压缩失败",
                icon: "none",
                duration: 1e3
              });
            }
          });
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
