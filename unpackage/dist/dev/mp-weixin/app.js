"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
if (!Math) {
  "./pages/detail/detail.js";
  "./pages/dev/dev.js";
  "./pages/index/index.js";
  "./pages/My/My.js";
  "./pages/Release/Release.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/collection/collection.js";
  "./pages/notes/notes.js";
  "./pages/notes/note-edit.js";
  "./pages/follow/list.js";
  "./pages/follow/works.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    setTimeout(() => {
      common_vendor.index.reLaunch({
        url: "/pages/dev/dev"
      });
    }, 800);
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:16", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:19", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(uni_modules_uviewPlus_index.uviewPlus);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
