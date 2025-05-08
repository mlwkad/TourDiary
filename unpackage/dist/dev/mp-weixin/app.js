"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/detail/detail.js";
  "./pages/dev/dev.js";
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
  // onLaunch: function () {
  // 	uni.__f__('log','at App.vue:4','App Launch')
  // 	// 导航页
  // 	// 发布前注释掉
  // 	setTimeout(() => {
  // 		uni.reLaunch({
  // 			url: '/pages/dev/dev'
  // 		});
  // 	}, 800);
  // },
  // onShow: function () {
  // 	uni.__f__('log','at App.vue:15','App Show')
  // },
  // onHide: function () {
  // 	uni.__f__('log','at App.vue:18','App Hide')
  // }
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
