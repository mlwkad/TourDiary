"use strict";
require("../common/vendor.js");
const api_http = require("./http.js");
const getSessionKey = (url, data) => {
  return api_http.http("/api/getSessionKey", data);
};
const getWXUserInfo = (url, data, method) => {
  return api_http.http("/api/getUserInfo", data, method);
};
const signUp = (data) => {
  return api_http.http("/api/signUp", data, "POST");
};
const checkLogin = (data) => {
  return api_http.http("/api/checkLogin", data, "POST");
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
exports.addLiked = addLiked;
exports.checkLogin = checkLogin;
exports.createRelease = createRelease;
exports.getAllReleases = getAllReleases;
exports.getReleaseDetail = getReleaseDetail;
exports.getSessionKey = getSessionKey;
exports.getUserLiked = getUserLiked;
exports.getUserReleases = getUserReleases;
exports.getWXUserInfo = getWXUserInfo;
exports.removeLiked = removeLiked;
exports.searchReleases = searchReleases;
exports.signUp = signUp;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
