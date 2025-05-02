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
            hearder: {
                'token': uni.getStorageSync('token') || ''
            },
            success: (res) => {
                if (res.statusCode === 200) {  // 请求成功
                    console.log(666)
                    if (res.data.code === 1) {  // 业务正常
                        resolve(res.data.data)
                    }
                    else if (res.data.code === 0) {
                        uni.showToast({
                            title: res.data.message,
                            icon: 'none'
                        })
                        reject(res.data.message)
                    }
                }
            },
            fail: () => {
                uni.showToast({
                    title: '服务请求异常',
                    icon: 'none'
                })
            }
        })
    })
}
