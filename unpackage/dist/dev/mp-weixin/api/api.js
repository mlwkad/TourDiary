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
exports.addLiked = addLiked;
exports.checkLogin = checkLogin;
exports.createRelease = createRelease;
exports.deleteRelease = deleteRelease;
exports.follow = follow;
exports.getAllReleases = getAllReleases;
exports.getFollowingList = getFollowingList;
exports.getReleaseDetail = getReleaseDetail;
exports.getSessionKey = getSessionKey;
exports.getUserInfo = getUserInfo;
exports.getUserLiked = getUserLiked;
exports.getUserReleases = getUserReleases;
exports.getWXUserInfo = getWXUserInfo;
exports.removeLiked = removeLiked;
exports.searchReleases = searchReleases;
exports.signUp = signUp;
exports.unfollow = unfollow;
exports.updateRelease = updateRelease;
exports.updateState = updateState;
exports.updateUserInfo = updateUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
