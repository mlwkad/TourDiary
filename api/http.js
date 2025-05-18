let baseUrl = ''

// 判断环境
if (process.env.NODE_ENV === 'development') {
    baseUrl = 'https://vkxvigkepssq.sealosbja.site'
} else {
    baseUrl = 'https://ovmmqfovxbil.sealosbja.site'
}

export default function http(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
            data,
            method,
            header: { 
                'token': uni.getStorageSync('token') || ''
            },
            success: (res) => {
                if (res.statusCode === 200 || res.statusCode === 201) {  
                    if (res.data.success === true) {  
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

