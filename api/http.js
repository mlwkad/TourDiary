let baseUrl = ''

// 判断环境
if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:3000'
} else {
    // baseUrl: 'http://localhost:3000'
}

export default function http(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
            data,
            method,
            header: { // 注意这里修正了拼写错误 hearder -> header
                'token': uni.getStorageSync('token') || ''
            },
            success: (res) => {
                if (res.statusCode === 200 || res.statusCode === 201) {  // 包含创建成功状态码
                    if (res.data.success === true) {  // 我们的API使用success表示成功
                        resolve(res.data.data || res.data)
                    }
                    else {
                        uni.showToast({
                            title: res.data.message,
                            icon: 'none'
                        })
                        reject(res.data.message)
                    }
                } else {
                    uni.showToast({
                        title: res.data.message || '请求失败',
                        icon: 'none'
                    })
                    reject(res.data.message)
                }
            },
            fail: (err) => {
                console.log(err)
                uni.showToast({
                    title: '服务请求异常',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}
