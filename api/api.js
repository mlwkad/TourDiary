import http from "./http.js";

let baseUrl = ''

// 判断环境
if (process.env.NODE_ENV === 'development') {
    baseUrl = 'https://vkxvigkepssq.sealosbja.site'
} else {
    baseUrl = 'https://ovmmqfovxbil.sealosbja.site'
}

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

// 搜索相关内容
export const searchReleases = (data) => {
    return http('/api/releases/search', data, 'POST')
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

// 更新状态
export const updateState = (releaseID, data) => {
    return http(`/api/release/${releaseID}/state`, data, "PUT")
}

// 获取关注列表
export const getFollowingList = (userID) => {
    return http(`/api/user/${userID}/following`)
}

// 关注
export const follow = (userID, data) => {
    return http(`/api/user/${userID}/follow`, data, 'POST')
}

// 取消关注
export const unfollow = (userID, followUserID) => {
    return http(`/api/user/${userID}/follow/${followUserID}`, {}, 'DELETE')
}

// 上传单个文件的辅助函数
const uploadSingleFile = (filePath, url) => {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url,
            filePath,
            name: 'file',
            success: (res) => {
                if (res.statusCode === 200) {
                    const data = JSON.parse(res.data);
                    resolve(data.success ? data.data : null);
                } else {
                    reject(`服务器错误(${res.statusCode})`);
                }
            },
            fail: (e) => reject(e)
        })
    })
}

// 上传文件
export const uploadFiles = async (filePaths, type = '') => {  // image/video/cover
    // 如果传入的不是数组，转换为数组
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths]
    // 如果是空数组，直接返回
    if (paths.length === 0 || !paths[0]) {
        return { pictures: [], videos: [], covers: [] }
    }
    let url = baseUrl + '/api/upload'
    if (type) { url += `?type=${type}` }
    try {
        uni.showLoading({ title: '上传中...' })
        const result = { pictures: [], videos: [], covers: [] }
        for (const path of paths) {  // 一张一张的传
            const res = await uploadSingleFile(path, url)
            if (res) {
                if (res.pictures) result.pictures.push(res.pictures)
                if (res.videos) result.videos.push(res.videos)
                if (res.covers) result.covers.push(res.covers)
            }
        }
        return result
    } catch (e) {
        console.log(e)
        return { pictures: [], videos: [], covers: [] }
    } finally {
        uni.hideLoading()
    }
}