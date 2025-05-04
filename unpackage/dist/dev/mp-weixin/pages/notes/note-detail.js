"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "note-detail",
  setup(__props) {
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
    const editNote = () => {
      common_vendor.index.navigateTo({
        url: `/pages/notes/note-edit?id=${note.id}`
      });
    };
    const toggleFavorite = () => {
      note.isFavorite = !note.isFavorite;
      common_vendor.index.showToast({
        title: note.isFavorite ? "已收藏" : "已取消收藏",
        icon: "success"
      });
    };
    const shareNote = () => {
      common_vendor.index.showActionSheet({
        itemList: ["分享到微信", "分享到朋友圈", "复制链接"],
        success: (res) => {
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
        }
      });
    };
    const deleteNote = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这个笔记吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "已删除",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1e3);
          }
        }
      });
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({
        urls: images,
        current: images[current]
      });
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        getNoteDetail(options.id);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(note.title),
        b: note.location
      }, note.location ? {
        c: common_assets._imports_0$2,
        d: common_vendor.t(note.location)
      } : {}, {
        e: common_vendor.t(note.date),
        f: common_vendor.t(note.content),
        g: note.images && note.images.length
      }, note.images && note.images.length ? {
        h: common_vendor.f(note.images, (img, index, i0) => {
          return {
            a: index,
            b: img,
            c: common_vendor.o(($event) => previewImage(note.images, index), index)
          };
        })
      } : {}, {
        i: note.isFavorite ? "/static/public/search.png" : "/static/public/search.png",
        j: common_vendor.t(note.isFavorite ? "已收藏" : "收藏"),
        k: common_vendor.o(toggleFavorite),
        l: common_assets._imports_0$2,
        m: common_vendor.o(shareNote),
        n: common_assets._imports_1$1,
        o: common_vendor.o(deleteNote),
        p: common_assets._imports_2,
        q: common_vendor.o(editNote)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d2ee1004"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notes/note-detail.js.map
