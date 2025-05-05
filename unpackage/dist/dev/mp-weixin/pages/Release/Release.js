"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
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
      location: ""
    });
    const validateForm = () => {
      let isValid = true;
      for (let key in errors) {
        errors[key] = "";
      }
      if (!formData.title.trim()) {
        errors.title = "标题不能为空";
        isValid = false;
      } else if (formData.title.length > 50) {
        errors.title = "标题不能超过50个字符";
        isValid = false;
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
      if (!formData.location) {
        errors.location = "位置不能为空";
        isValid = false;
      }
      if (!formData.content.trim()) {
        errors.content = "内容描述不能为空";
        isValid = false;
      } else if (formData.content.length < 10) {
        errors.content = "内容描述不能少于10个字符";
        isValid = false;
      }
      return isValid;
    };
    const submitForm = () => {
      if (!validateForm()) {
        common_vendor.index.showToast({
          title: "请完善表单信息",
          icon: "none"
        });
        return;
      }
      const submitData = {
        ...formData,
        playTime: Number(formData.playTime),
        money: Number(formData.money),
        personNum: Number(formData.personNum)
      };
      common_vendor.index.showLoading({
        title: "发布中..."
      });
      api_api.createRelease(submitData).then(async (res) => {
        common_vendor.index.hideLoading();
        await new Promise((resolve) => {
          common_vendor.index.showToast({
            title: "发布成功",
            icon: "success"
          });
          setTimeout(() => resolve(), 1e3);
        });
        resetForm();
      }).catch((e) => {
        common_vendor.index.__f__("log", "at pages/Release/Release.vue:225", e);
      });
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
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 9 - formData.pictures.length,
        success: (res) => {
          formData.pictures = [...formData.pictures, ...res.tempFilePaths];
        }
      });
    };
    const deleteImage = (index) => {
      formData.pictures.splice(index, 1);
    };
    const chooseVideo = () => {
      common_vendor.index.chooseVideo({
        count: 1,
        success: (res) => {
          formData.videos = [res.tempFilePath];
        }
      });
    };
    const deleteVideo = (index) => {
      formData.videos.splice(index, 1);
    };
    const chooseVideoCover = () => {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          formData.cover = res.tempFilePaths[0];
        }
      });
    };
    const deleteVideoCover = () => {
      formData.cover = "";
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
          common_vendor.index.__f__("log", "at pages/Release/Release.vue:330", "获取设置失败", err);
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
            common_vendor.index.__f__("log", "at pages/Release/Release.vue:345", "选择位置失败", err);
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
        common_vendor.index.__f__("error", "at pages/Release/Release.vue:357", "调用选择位置接口失败", e);
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
            formData.location = res.content;
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
        common_vendor.index.__f__("error", "at pages/Release/Release.vue:413", "获取用户信息失败", e);
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
            b: common_vendor.o(($event) => deleteImage(index), "pic-" + index),
            c: "pic-" + index
          };
        }),
        B: formData.pictures.length < 9
      }, formData.pictures.length < 9 ? {
        C: common_vendor.o(chooseImage)
      } : {}, {
        D: common_vendor.f(formData.videos, (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.o(($event) => deleteVideo(index), "vid-" + index),
            c: "vid-" + index
          };
        }),
        E: formData.videos.length === 0
      }, formData.videos.length === 0 ? {
        F: common_vendor.o(chooseVideo)
      } : {}, {
        G: formData.videos.length > 0
      }, formData.videos.length > 0 ? common_vendor.e({
        H: formData.cover
      }, formData.cover ? {
        I: formData.cover,
        J: common_vendor.o(deleteVideoCover)
      } : {}, {
        K: !formData.cover
      }, !formData.cover ? {
        L: common_vendor.o(chooseVideoCover)
      } : {}) : {}, {
        M: common_vendor.o(submitForm)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7481dae8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Release/Release.js.map
