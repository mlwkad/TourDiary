import http from "./http.js";

let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
    baseUrl = 'https://vkxvigkepssq.sealosbja.site'
} else {
    baseUrl = 'https://ovmmqfovxbil.sealosbja.site'
}

// * 请求节流

const map = new Map()
const throttle = (key, delay = 1000) => {
    const date = new Date().getTime()
    if (map.has(key) && (date - map.get(key)) < delay) {
        uni.showToast({
            title: '请求过于频繁',
            icon: 'none'
        })
        return false
    }
    map.set(key, date)
    return true
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
    if (!throttle(`getReleaseDetail`, 100)) return
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
    if (!throttle(`deleteRelease`, 300)) return
    return http(`/api/release/${releaseID}`, { userID }, 'DELETE')
}

// 更新状态
export const updateState = (releaseID, data) => {
    if (!throttle(`updateState`, 300)) return
    return http(`/api/release/${releaseID}/state`, data, "PUT")
}

// 获取关注列表
export const getFollowingList = (userID) => {
    return http(`/api/user/${userID}/following`)
}

// 关注
export const follow = (userID, data) => {
    if (!throttle(`follow`, 300)) return
    return http(`/api/user/${userID}/follow`, data, 'POST')
}

// 取消关注
export const unfollow = (userID, followUserID) => {
    if (!throttle(`unfollow`, 300)) return
    return http(`/api/user/${userID}/follow/${followUserID}`, {}, 'DELETE')
}

// * 云端存储(使用sealos存储桶,结合密钥信息,后端自定义路径,上传成功后即可获得一个可访问的公网url)
// * 1.节省服务器
// * 2.前端直接访问url,无需请求服务器

// 上传文件
export const uploadFiles = async (filePaths, type = '') => {  // image/video/cover
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths]
    if (paths.length === 0 || !paths[0]) return { pictures: [], videos: [], covers: [] }
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

// 文件上传 辅助函数
const uploadSingleFile = (filePath, url) => {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url,
            filePath,
            name: 'file',
            success: (res) => {
                if (res.statusCode === 200) {
                    const data = JSON.parse(res.data)
                    resolve(data.success ? data.data : null)
                } else {
                    reject(`服务器错误(${res.statusCode})`)
                }
            },
            fail: (e) => reject(e)
        })
    })
}