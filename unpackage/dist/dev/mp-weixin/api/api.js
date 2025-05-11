"use strict";
const common_vendor = require("../common/vendor.js");
const api_http = require("./http.js");
let baseUrl = "";
{
  baseUrl = "https://vkxvigkepssq.sealosbja.site";
}
const signUp = (data) => {
  return api_http.http("/api/signUp", data, "POST");
};
const checkLogin = (data) => {
  return api_http.http("/api/checkLogin", data, "POST");
};
const getUserInfo = (userID) => {
  return api_http.http(`/api/user/${userID}`);
};
const updateUserInfo = (userID, data) => {
  return api_http.http(`/api/user/${userID}`, data, "PUT");
};
const getUserReleases = (userID) => {
  return api_http.http(`/api/user/${userID}/releases`);
};
const getUserLiked = (userID) => {
  return api_http.http(`/api/user/${userID}/liked`);
};
const addLiked = (userID, releaseID) => {
  return api_http.http(`/api/user/${userID}/liked`, { releaseID }, "POST");
};
const removeLiked = (userID, releaseID) => {
  return api_http.http(`/api/user/${userID}/liked/${releaseID}`, {}, "DELETE");
};
const getAllReleases = (limit = 50, offset = 0) => {
  return api_http.http(`/api/releases`, { limit, offset });
};
const searchReleases = (data) => {
  return api_http.http("/api/releases/search", data, "POST");
};
const getReleaseDetail = (releaseID) => {
  return api_http.http(`/api/release/${releaseID}`);
};
const createRelease = (data) => {
  return api_http.http("/api/release", data, "POST");
};
const updateRelease = (releaseID, data) => {
  return api_http.http(`/api/release/${releaseID}`, data, "PUT");
};
const deleteRelease = (releaseID, userID) => {
  return api_http.http(`/api/release/${releaseID}`, { userID }, "DELETE");
};
const updateState = (releaseID, data) => {
  return api_http.http(`/api/release/${releaseID}/state`, data, "PUT");
};
const getFollowingList = (userID) => {
  return api_http.http(`/api/user/${userID}/following`);
};
const follow = (userID, data) => {
  return api_http.http(`/api/user/${userID}/follow`, data, "POST");
};
const unfollow = (userID, followUserID) => {
  return api_http.http(`/api/user/${userID}/follow/${followUserID}`, {}, "DELETE");
};
const uploadSingleFile = (filePath, url) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
      url,
      filePath,
      name: "file",
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data);
          resolve(data.success ? data.data : null);
        } else {
          reject(`服务器错误(${res.statusCode})`);
        }
      },
      fail: (e) => reject(e)
    });
  });
};
const uploadFiles = async (filePaths, type = "") => {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  if (paths.length === 0 || !paths[0]) {
    return { pictures: [], videos: [], covers: [] };
  }
  let url = baseUrl + "/api/upload";
  if (type) {
    url += `?type=${type}`;
  }
  try {
    common_vendor.index.showLoading({ title: "上传中..." });
    const result = { pictures: [], videos: [], covers: [] };
    for (const path of paths) {
      const res = await uploadSingleFile(path, url);
      if (res) {
        if (res.pictures)
          result.pictures.push(res.pictures);
        if (res.videos)
          result.videos.push(res.videos);
        if (res.covers)
          result.covers.push(res.covers);
      }
    }
    return result;
  } catch (e) {
    common_vendor.index.__f__("log", "at api/api.js:159", e);
    return { pictures: [], videos: [], covers: [] };
  } finally {
    common_vendor.index.hideLoading();
  }
};
exports.addLiked = addLiked;
exports.checkLogin = checkLogin;
exports.createRelease = createRelease;
exports.deleteRelease = deleteRelease;
exports.follow = follow;
exports.getAllReleases = getAllReleases;
exports.getFollowingList = getFollowingList;
exports.getReleaseDetail = getReleaseDetail;
exports.getUserInfo = getUserInfo;
exports.getUserLiked = getUserLiked;
exports.getUserReleases = getUserReleases;
exports.removeLiked = removeLiked;
exports.searchReleases = searchReleases;
exports.signUp = signUp;
exports.unfollow = unfollow;
exports.updateRelease = updateRelease;
exports.updateState = updateState;
exports.updateUserInfo = updateUserInfo;
exports.uploadFiles = uploadFiles;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
