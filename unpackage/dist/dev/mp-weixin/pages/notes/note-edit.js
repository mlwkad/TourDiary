"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "note-edit",
  setup(__props) {
    const isEdit = common_vendor.ref(false);
    const note = common_vendor.reactive({
      id: "",
      title: "",
      content: "",
      location: "",
      date: "",
      isFavorite: false,
      images: []
    });
    const getNoteDetail = (id) => {
      setTimeout(() => {
        Object.assign(note, {
          id,
          title: "桂林游记",
          content: "今天游览了桂林的象鼻山和七星公园，风景如画，令人心旷神怡。象鼻山位于桂林市漓江与桃花江汇流处，因山形酷似一头伸鼻饮水的大象而得名，是桂林山水的标志性景观。\n\n七星公园是桂林最大的综合性公园，因园内有七座山峰，恰似北斗七星而得名。公园内有桂海碑林、七星岩、蛇山、华夏奇石馆、花桥、童子拜观音等景点。尤其是华夏奇石馆内的奇石，形态各异，令人叹为观止。\n\n漓江水清澈见底，两岸的喀斯特地貌景观壮观秀丽，船行其上，恍如画中。整个旅程给人一种身临仙境的感觉，不虚此行。",
          location: "广西桂林",
          date: "2023-10-15",
          isFavorite: true,
          images: ["/static/666.jpg", "/static/666.jpg", "/static/666.jpg"]
        });
      }, 500);
    };
    common_vendor.onBackPress(() => {
      if (note.title || note.content || note.images.length > 0) {
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
      if (!note.date) {
        const now = /* @__PURE__ */ new Date();
        note.date = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
      }
      common_vendor.index.showLoading({
        title: "保存中"
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      }, 1e3);
    };
    const chooseLocation = () => {
      common_vendor.index.chooseLocation({
        success: (res) => {
          note.location = res.name || res.address;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/notes/note-edit.vue:140", "选择位置失败", err);
        }
      });
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 9 - note.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          note.images = [...note.images, ...res.tempFilePaths];
        }
      });
    };
    const removeImage = (index) => {
      note.images.splice(index, 1);
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        isEdit.value = true;
        getNoteDetail(options.id);
        common_vendor.index.setNavigationBarTitle({
          title: "编辑笔记"
        });
      } else {
        common_vendor.index.setNavigationBarTitle({
          title: "新建笔记"
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: note.title,
        b: common_vendor.o(($event) => note.title = $event.detail.value),
        c: common_assets._imports_0$2,
        d: note.location
      }, note.location ? {
        e: common_vendor.t(note.location)
      } : {}, {
        f: common_vendor.o(chooseLocation),
        g: note.content,
        h: common_vendor.o(($event) => note.content = $event.detail.value),
        i: common_vendor.f(note.images, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index
          };
        }),
        j: common_assets._imports_1$1,
        k: note.images.length < 9
      }, note.images.length < 9 ? {
        l: common_vendor.o(chooseImage)
      } : {}, {
        m: common_vendor.o(saveNote)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aecc2c28"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/note-edit.js.map
