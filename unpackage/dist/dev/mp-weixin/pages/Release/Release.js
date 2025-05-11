"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const utils_filter = require("../../utils/filter.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Release",
  setup(__props) {
    const formData = common_vendor.reactive({
      userID: "",
      // 将从用户登录信息中获取
      title: "",
      playTime: "",
      money: "",
      personNum: "",
      content: "",
      location: "",
      pictures: [],
      videos: [],
      cover: ""
    });
    const errors = common_vendor.reactive({
      title: "",
      playTime: "",
      money: "",
      personNum: "",
      content: "",
      location: "",
      pictures: ""
    });
    const validateForm = () => {
      let isValid = true;
      for (let key in errors) {
        errors[key] = "";
      }
      const titleVal = utils_filter.validateTitle(formData.title);
      if (!titleVal.isValid) {
        errors.title = titleVal.message;
        isValid = false;
      } else {
        formData.title = titleVal.filteredText;
      }
      if (!formData.playTime) {
        errors.playTime = "游玩时间不能为空";
        isValid = false;
      } else if (isNaN(Number(formData.playTime)) || Number(formData.playTime) <= 0) {
        errors.playTime = "请输入有效的游玩时间";
        isValid = false;
      }
      if (!formData.money) {
        errors.money = "费用不能为空";
        isValid = false;
      } else if (isNaN(Number(formData.money)) || Number(formData.money) < 0) {
        errors.money = "请输入有效的费用金额";
        isValid = false;
      }
      if (!formData.personNum) {
        errors.personNum = "人数不能为空";
        isValid = false;
      } else if (isNaN(Number(formData.personNum)) || Number(formData.personNum) <= 0 || !Number.isInteger(Number(formData.personNum))) {
        errors.personNum = "请输入有效的人数";
        isValid = false;
      }
      const locationVal = utils_filter.validateLocation(formData.location);
      if (!locationVal.isValid) {
        errors.location = locationVal.message;
        isValid = false;
      } else {
        formData.location = locationVal.filteredText;
      }
      const contentVal = utils_filter.validateContent(formData.content);
      if (!contentVal.isValid) {
        errors.content = contentVal.message;
        isValid = false;
      } else {
        formData.content = contentVal.filteredText;
      }
      if (!formData.pictures || formData.pictures.length === 0) {
        errors.pictures = "至少上传一张图片";
        isValid = false;
      }
      return isValid;
    };
    const submitForm = async () => {
      if (!validateForm()) {
        common_vendor.index.showToast({
          title: "请完善表单信息",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "正在处理..."
      });
      try {
        if (formData.pictures.length > 0) {
          const pictureRes = await api_api.uploadFiles(formData.pictures, "image");
          formData.pictures = pictureRes.pictures;
        }
        if (formData.videos.length > 0) {
          const videoRes = await api_api.uploadFiles(formData.videos, "video");
          formData.videos = videoRes.videos;
        }
        if (formData.cover) {
          const coverRes = await api_api.uploadFiles(formData.cover, "cover");
          formData.cover = coverRes.covers[0];
        }
        const submitData = {
          ...formData,
          playTime: Number(formData.playTime),
          money: Number(formData.money),
          personNum: Number(formData.personNum)
        };
        await api_api.createRelease(submitData);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        resetForm();
        common_vendor.index.navigateTo({ url: "/pages/notes/notes" });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/Release/Release.vue:242", "发布过程失败:", e);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发布失败，请重试",
          icon: "none"
        });
      }
    };
    const resetForm = () => {
      const userID = formData.userID;
      Object.assign(formData, {
        userID,
        title: "",
        playTime: "",
        money: "",
        personNum: "",
        content: "",
        location: "",
        pictures: [],
        videos: [],
        cover: ""
      });
      for (let key in errors) {
        errors[key] = "";
      }
    };
    const chooseFile = (type) => {
      if (type === "image") {
        common_vendor.index.chooseImage({
          count: 5 - formData.pictures.length,
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
                  formData.pictures.push(compressRes.tempFilePath);
                  count++;
                  if (count >= totalImages) {
                    common_vendor.index.hideLoading();
                  }
                },
                fail: () => {
                  formData.pictures.push(imagePath);
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
          }
        });
      } else if (type === "video") {
        common_vendor.index.chooseVideo({
          count: 1,
          compressed: true,
          // 开启视频压缩
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
                  formData.videos = [res.tempFilePath];
                }
              },
              fail: () => {
                common_vendor.index.hideLoading();
                formData.videos = [res.tempFilePath];
              }
            });
          }
        });
      } else if (type === "cover") {
        common_vendor.index.chooseImage({
          count: 1,
          success: (res) => {
            common_vendor.index.showLoading({ title: "处理封面中..." });
            common_vendor.index.compressImage({
              src: res.tempFilePaths[0],
              quality: 80,
              success: (compressRes) => {
                common_vendor.index.hideLoading();
                formData.cover = compressRes.tempFilePath;
              },
              fail: () => {
                common_vendor.index.hideLoading();
                formData.cover = res.tempFilePaths[0];
                common_vendor.index.showToast({
                  title: "封面压缩失败",
                  icon: "none",
                  duration: 1e3
                });
              }
            });
          }
        });
      }
    };
    const deleteFile = (type, index) => {
      if (type === "image") {
        formData.pictures.splice(index, 1);
      } else if (type === "video") {
        formData.videos.splice(index, 1);
      } else if (type === "cover") {
        formData.cover = "";
      }
    };
    const chooseLocation = () => {
      common_vendor.index.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.userLocation"]) {
            common_vendor.index.authorize({
              scope: "scope.userLocation",
              success: () => {
                openChooseLocation();
              },
              fail: () => {
                common_vendor.index.showModal({
                  title: "提示",
                  content: "需要您授权位置信息才能选择位置",
                  confirmText: "去设置",
                  success: (res2) => {
                    if (res2.confirm) {
                      common_vendor.index.openSetting();
                    }
                  }
                });
              }
            });
          } else {
            openChooseLocation();
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/Release/Release.vue:407", "获取设置失败", err);
          showManualLocationInput();
        }
      });
    };
    const openChooseLocation = () => {
      try {
        common_vendor.index.chooseLocation({
          success: (res) => {
            formData.location = res.name;
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at pages/Release/Release.vue:423", "选择位置失败", err);
            if (err.errMsg && err.errMsg.includes("requiredPrivateInfos")) {
              common_vendor.index.showToast({
                title: "位置服务未配置",
                icon: "none"
              });
              showManualLocationInput();
            }
          }
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/Release/Release.vue:435", "调用选择位置接口失败", e);
        showManualLocationInput();
      }
    };
    const showManualLocationInput = () => {
      common_vendor.index.showModal({
        title: "手动输入位置",
        editable: true,
        placeholderText: "请输入您的位置",
        success: (res) => {
          if (res.confirm && res.content) {
            const locationValidation = utils_filter.validateLocation(res.content);
            if (locationValidation.isValid) {
              formData.location = locationValidation.filteredText;
            } else {
              common_vendor.index.showToast({
                title: locationValidation.message,
                icon: "none"
              });
            }
          }
        }
      });
    };
    const goToMyNotes = () => {
      common_vendor.index.navigateTo({
        url: "/pages/notes/notes"
      });
    };
    common_vendor.onShow(() => {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          formData.userID = JSON.parse(userInfo).userId;
        } else {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/Release/Release.vue:482", "获取用户信息失败", e);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goToMyNotes),
        b: formData.title,
        c: common_vendor.o(($event) => formData.title = $event.detail.value),
        d: errors.title
      }, errors.title ? {
        e: common_vendor.t(errors.title)
      } : {}, {
        f: formData.playTime,
        g: common_vendor.o(($event) => formData.playTime = $event.detail.value),
        h: errors.playTime
      }, errors.playTime ? {
        i: common_vendor.t(errors.playTime)
      } : {}, {
        j: formData.money,
        k: common_vendor.o(($event) => formData.money = $event.detail.value),
        l: errors.money
      }, errors.money ? {
        m: common_vendor.t(errors.money)
      } : {}, {
        n: formData.personNum,
        o: common_vendor.o(($event) => formData.personNum = $event.detail.value),
        p: errors.personNum
      }, errors.personNum ? {
        q: common_vendor.t(errors.personNum)
      } : {}, {
        r: common_vendor.t(formData.location || "点击选择位置"),
        s: common_vendor.o(chooseLocation),
        t: errors.location
      }, errors.location ? {
        v: common_vendor.t(errors.location)
      } : {}, {
        w: formData.content,
        x: common_vendor.o(($event) => formData.content = $event.detail.value),
        y: errors.content
      }, errors.content ? {
        z: common_vendor.t(errors.content)
      } : {}, {
        A: common_vendor.f(formData.pictures, (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.o(($event) => deleteFile("image", index), "pic-" + index),
            c: "pic-" + index
          };
        }),
        B: formData.pictures.length < 9
      }, formData.pictures.length < 9 ? {
        C: common_vendor.o(($event) => chooseFile("image"))
      } : {}, {
        D: common_vendor.f(formData.videos, (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.o(($event) => deleteFile("video", index), "vid-" + index),
            c: "vid-" + index
          };
        }),
        E: formData.videos.length === 0
      }, formData.videos.length === 0 ? {
        F: common_vendor.o(($event) => chooseFile("video"))
      } : {}, {
        G: formData.videos.length > 0
      }, formData.videos.length > 0 ? common_vendor.e({
        H: formData.cover
      }, formData.cover ? {
        I: formData.cover,
        J: common_vendor.o(($event) => deleteFile("cover"))
      } : {}, {
        K: !formData.cover
      }, !formData.cover ? {
        L: common_vendor.o(($event) => chooseFile("cover"))
      } : {}) : {}, {
        M: common_vendor.o(submitForm)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7481dae8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Release/Release.js.map
