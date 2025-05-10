<template>
    <view class="login-container">
        <view class="login-branding">
            <image class="app-logo" src="/static/public/logo.png" mode="aspectFit"></image>
            <view class="brand-title">旅游日记</view>
            <view class="brand-slogan">记录旅途，分享精彩</view>
        </view>
        <view class="login-form">
            <view class="input-group">
                <view class="input-item">
                    <text class="input-label">用户名</text>
                    <input class="input-field" type="text" v-model="username" placeholder="请输入用户名"
                        @input="errors.username = ''" />
                    <view class="error-text" v-if="errors.username">{{ errors.username }}</view>
                </view>
                <view class="input-item">
                    <text class="input-label">密码</text>
                    <input class="input-field" type="password" v-model="password" placeholder="请输入密码"
                        @input="errors.password = ''" />
                    <view class="error-text" v-if="errors.password">{{ errors.password }}</view>
                </view>
            </view>
            <view class="login-options">
                <text class="register-link" @click="goToRegister">没有账号? 去注册</text>
            </view>
            <button class="login-button" @click="handleLogin">登录</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getSessionKey, getWXUserInfo, checkLogin, uploadFiles } from '../../api/api';

const username = ref<string>('')
const password = ref<string>('')

// 错误信息
const errors = reactive({
    username: '',
    password: ''
})

// 验证用户名
const validateUsername = (username: string) => {
    if (!username.trim()) {
        return { isValid: false, message: '用户名不能为空' }
    }
    if (username.length < 3) {
        return { isValid: false, message: '用户名不能少于3个字符' }
    }
    if (username.length > 20) {
        return { isValid: false, message: '用户名不能超过20个字符' }
    }
    // 检查用户名是否包含非法字符
    const usernamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
    if (!usernamePattern.test(username)) {
        return { isValid: false, message: '用户名只能包含字母、数字、下划线和中文' }
    }
    return { isValid: true, message: '' }
}

// 验证密码
const validatePassword = (password: string) => {
    if (!password) {
        return { isValid: false, message: '密码不能为空' }
    }
    if (password.length < 6) {
        return { isValid: false, message: '密码不能少于6个字符' }
    }
    if (password.length > 20) {
        return { isValid: false, message: '密码不能超过20个字符' }
    }
    return { isValid: true, message: '' }
}

// 验证表单
const validateForm = () => {
    let isValid = true
    // 验证用户名
    const usernameVal = validateUsername(username.value)
    if (!usernameVal.isValid) {
        errors.username = usernameVal.message
        isValid = false
    }
    // 验证密码
    const passwordVal = validatePassword(password.value)
    if (!passwordVal.isValid) {
        errors.password = passwordVal.message
        isValid = false
    }
    return isValid
}

// 登录处理
const handleLogin = () => {
    // 验证表单
    if (!validateForm()) {
        return
    }
    uni.showLoading({
        title: '登录中...'
    })
    const userInfo = {
        nickName: username.value,
        avatarUrl: '/static/666.jpg',
        userId: '12345'
    }
    try {
        checkLogin({
            userName: username.value,
            passWord: password.value
        }).then(async res => {
            await new Promise(resolve => {
                uni.hideLoading()
                uni.showToast({
                    title: '登录成功',
                    icon: 'success'
                })
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
            userInfo.userId = res.userID
            userInfo.nickName = username.value
            userInfo.avatarUrl = '/static/666.jpg'
            // 随便设置一个token
            await uni.setStorageSync('token', 'sample-token')
            await uni.setStorageSync('userInfo', JSON.stringify(userInfo))
            uni.navigateBack()
        }).catch(err => {
            console.log(err)
            uni.hideLoading()
            uni.showToast({
                title: '登录失败，请检查用户名和密码',
                icon: 'none'
            })
        })
    } catch (e) {
        console.log(e)
        uni.hideLoading()
        uni.showToast({
            title: '登录失败，请稍后重试',
            icon: 'none'
        })
    }
}

// 用户鉴权
const wechatLogin = async () => {
    try {
        const modalRes = await new Promise(resolve => {
            uni.showModal({
                title: '温馨提示',
                content: '需要您授权获取个人信息',
                success: resolve
            })
        })

        if (!modalRes.confirm) return

        const userProfileRes = await new Promise((resolve, reject) => {
            uni.getUserProfile({
                desc: '需要获取您的微信昵称和头像',
                success: resolve,
                fail: reject
            })
        }).catch(err => {
            console.log('获取用户信息失败', err)
            uni.showToast({ title: '获取用户信息失败', icon: 'none' })
            throw new Error('用户拒绝授权')
        })

        const { encryptedData, iv } = userProfileRes

        const loginRes = await new Promise(resolve => {
            uni.login({ success: resolve })
        })

        try {
            const sessionKeyRes = await getSessionKey('', { code: loginRes })
            const userInfoRes = await getWXUserInfo('', {
                encryptedData,
                iv,
                sessionKey: sessionKeyRes.sessionKey
            }, 'POST')

            const userInfo = {
                nickName: userInfoRes.nickName,
                avatarUrl: userInfoRes.avatarUrl,
                userId: ''
            }

            uni.setStorageSync('token', 'wx-token')
            uni.setStorageSync('userInfo', JSON.stringify(userInfo))

            uni.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => uni.navigateBack(), 1000)
        } catch (error) {
            console.error('微信登录失败', error)
            uni.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
        }
    } catch (error) {
        console.error('微信登录过程异常', error)
    }
}

// 跳转到注册页
const goToRegister = () => {
    uni.navigateTo({
        url: '/pages/register/register'
    })
}
</script>

<style lang="scss" scoped>
.login-container {
    background-color: #ffffff;
    // min-height: 100vh;

    .login-branding {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 80rpx 0 40rpx;
        background: linear-gradient(135deg, rgba(52, 148, 230, 0.05), rgba(236, 110, 173, 0.03));
        border-radius: 0 0 30% 30%;
        margin-bottom: 20rpx;
        position: relative;

        &::after {
            z-index: 999999;
            content: '';
            position: absolute;
            bottom: 0;
            left: 25%;
            width: 50%;
            height: 8rpx;
            background: linear-gradient(to right, transparent, rgba(52, 148, 230, 0.3), rgba(236, 110, 173, 0.3), transparent);
        }

        .app-logo {
            width: 180rpx;
            height: 180rpx;
            margin-bottom: 30rpx;
        }

        .brand-title {
            font-size: 48rpx;
            font-weight: bold;
            background: linear-gradient(to right, #3494E6, #EC6EAD);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 16rpx;
        }

        .brand-slogan {
            font-size: 28rpx;
            color: #888;
            letter-spacing: 2rpx;
        }
    }

    .login-header {
        display: flex;
        align-items: center;
        padding: 20rpx;
        position: relative;

        .back-icon {
            width: 40rpx;
            height: 40rpx;
        }

        .header-title {
            flex: 1;
            text-align: center;
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .login-form {
        padding: 30rpx;

        .avatar-container {
            display: flex;
            justify-content: center;
            margin: 30rpx 0 50rpx;

            .avatar {
                width: 180rpx;
                height: 180rpx;
                border-radius: 50%;
                border: 4rpx solid #4bb0ff;
            }
        }

        .input-group {
            margin-bottom: 40rpx;

            .input-item {
                margin-bottom: 30rpx;

                .input-label {
                    font-size: 28rpx;
                    color: #666;
                    margin-bottom: 15rpx;
                    display: block;
                    margin-left: 15rpx;
                }

                .input-field {
                    width: 91%;
                    height: 80rpx;
                    background-color: #f5f5f5;
                    border-radius: 40rpx;
                    padding: 0 30rpx;
                    font-size: 28rpx;
                }

                .error-text {
                    color: #EC6EAD;
                    font-size: 24rpx;
                    margin: 12rpx 0 0 20rpx;
                    background-color: rgba(236, 110, 173, 0.1);
                    padding: 8rpx 16rpx;
                    border-radius: 10rpx;
                    display: block;
                    width: fit-content;
                    max-width: 90%;
                    word-break: break-all;
                }
            }
        }

        .login-options {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40rpx;

            .forget-password,
            .register-link {
                font-size: 26rpx;
                color: #4bb0ff;
            }
        }

        .login-button {
            width: 100%;
            height: 90rpx;
            background: linear-gradient(to right, #3494E6, #EC6EAD);
            color: #fff;
            font-size: 32rpx;
            font-weight: bold;
            border-radius: 45rpx;
            margin-bottom: 50rpx;
            line-height: 90rpx;
        }

        .wechat-login {
            display: flex;
            flex-direction: column;
            align-items: center;

            .wechat-login-text {
                font-size: 28rpx;
                color: #999;
                margin-bottom: 30rpx;
            }

            .wechat-login-button {
                width: 60%;
                height: 90rpx;
                background-color: #07c160;
                color: #fff;
                font-size: 32rpx;
                font-weight: bold;
                border-radius: 45rpx;
                line-height: 90rpx;
            }
        }
    }
}
</style>