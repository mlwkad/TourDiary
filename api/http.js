let baseUrl = ''

// 判断环境
if (process.env.NODE_ENV === 'development') {
    // 开发环境(最新),后端开启,sealos的关联DevBox开机,功能稳定后迭代到生产环境(直接生成新版本)
    baseUrl = 'https://vkxvigkepssq.sealosbja.site'
} else {
    // 生产环境
    baseUrl = 'https://ovmmqfovxbil.sealosbja.site'
}

const throttleMap = new Map()

export default function http(url, data = {}, method = 'GET') {
    // // 节流处理
    // const key = `${url}-${method}`
    // const now = Date.now() // 毫秒级时间戳
    // if (throttleMap.has(key)) {
    //     if (now - throttleMap.get(key) < 1000) {
    //         console.log(now, throttleMap.get(key))
    //         console.log(now - throttleMap.get(key))
    //         uni.showToast({
    //             title: '请求过于频繁',
    //             icon: 'none'
    //         })
    //         return
    //     }
    // }
    // throttleMap.set(key, now)

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

