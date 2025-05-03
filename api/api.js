import http from "./http.js";

// 首页
export const getBanner = () => {
    return http('/api/getBanner')
}

// 换取sessionKey
export const getSessionKey = (url, data) => {
    return http('/api/getSessionKey', data)
}

// 获取真实数据
export const getWXUserInfo = (url, data, method) => {
    return http('/api/getUserInfo', data, method)
}

// 用户注册
export const signUp = (data) => {
    return http('/api/signUp', data, 'POST')
}

// 用户登录
export const checkLogin = (data) => {
    return http('/api/checkLogin', data, 'POST')
}

// 获取用户信息
export const getUserInfo = (userID) => {
    return http(`/api/user/${userID}`)
}

// 更新用户信息
export const updateUserInfo = (userID, data) => {
    return http(`/api/user/${userID}`, data, 'PUT')
}

// 获取用户发布的内容
export const getUserReleases = (userID) => {
    return http(`/api/user/${userID}/releases`)
}

// 获取用户喜欢的内容
export const getUserLiked = (userID) => {
    return http(`/api/user/${userID}/liked`)
}

// 添加喜欢的内容
export const addLiked = (userID, releaseID) => {
    return http(`/api/user/${userID}/liked`, { releaseID }, 'POST')
}

// 取消喜欢的内容
export const removeLiked = (userID, releaseID) => {
    return http(`/api/user/${userID}/liked/${releaseID}`, {}, 'DELETE')
}

// 获取所有发布内容
export const getAllReleases = (limit = 50, offset = 0) => {
    return http(`/api/releases`, { limit, offset })
}

// 获取发布内容详情
export const getReleaseDetail = (releaseID) => {
    return http(`/api/release/${releaseID}`)
}

// 创建发布内容
export const createRelease = (data) => {
    return http('/api/release', data, 'POST')
}

// 更新发布内容
export const updateRelease = (releaseID, data) => {
    return http(`/api/release/${releaseID}`, data, 'PUT')
}

// 删除发布内容
export const deleteRelease = (releaseID, userID) => {
    return http(`/api/release/${releaseID}`, { userID }, 'DELETE')
}

// 上传文件
export const uploadFiles = (filePaths) => {
    return new Promise((resolve, reject) => {
        const uploadTask = uni.uploadFile({
            url: baseUrl + '/api/upload',
            files: filePaths.map(path => ({
                name: 'files',
                uri: path
            })),
            name: 'files',
            success: (res) => {
                if (res.statusCode === 200) {
                    const data = JSON.parse(res.data);
                    if (data.success) {
                        resolve(data.data);
                    } else {
                        uni.showToast({
                            title: data.message,
                            icon: 'none'
                        });
                        reject(data.message);
                    }
                } else {
                    uni.showToast({
                        title: '上传失败',
                        icon: 'none'
                    });
                    reject('上传失败');
                }
            },
            fail: (err) => {
                console.log(err);
                uni.showToast({
                    title: '上传请求异常',
                    icon: 'none'
                });
                reject(err);
            }
        });
    });
}