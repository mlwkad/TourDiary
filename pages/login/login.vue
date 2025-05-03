<template>
    <view class="login-container">
        <view class="login-header">
            <image class="back-icon" src="/static/public/back.png" @click="goBack"></image>
            <text class="header-title">用户登录</text>
        </view>

        <view class="login-form">
            <view class="avatar-container">
                <image class="avatar" src="/static/666.jpg" mode="aspectFill"></image>
            </view>

            <view class="input-group">
                <view class="input-item">
                    <text class="input-label">用户名</text>
                    <input class="input-field" type="text" v-model="username" placeholder="请输入用户名" />
                </view>

                <view class="input-item">
                    <text class="input-label">密码</text>
                    <input class="input-field" type="password" v-model="password" placeholder="请输入密码" />
                </view>
            </view>

            <view class="login-options">
                <text class="forget-password" @click="forgetPassword">忘记密码?</text>
                <text class="register-link" @click="goToRegister">没有账号? 去注册</text>
            </view>

            <button class="login-button" @click="handleLogin">登录</button>

            <view class="wechat-login">
                <text class="wechat-login-text">微信快速登录</text>
                <button class="wechat-login-button" @click="wechatLogin">
                    <text>微信登录</text>
                </button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getSessionKey, getWXUserInfo, checkLogin } from '../../api/api';

const username = ref<string>('')
const password = ref<string>('')

// 登录处理
const handleLogin = () => {
    if (!username.value || !password.value) {
        uni.showToast({
            title: '请输入用户名和密码',
            icon: 'none'
        })
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
            console.log(res)
            userInfo.userId = res.userID
            userInfo.nickName = username.value
            userInfo.avatarUrl = '/static/666.jpg'
            // 随便设置一个token
            await uni.setStorageSync('token', 'sample-token')
            await uni.setStorageSync('userInfo', JSON.stringify(userInfo))
            uni.navigateBack()
        }).catch(err => {
            console.log(err)
        })
    } catch (e) {
        console.log(e)
    }
};

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

// 忘记密码
const forgetPassword = () => {
    uni.showToast({
        title: '忘记密码功能暂未开放',
        icon: 'none'
    })
}

// 返回上一页
const goBack = () => {
    uni.navigateBack()
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
    min-height: 100vh;

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
            background: linear-gradient(to right, #4bb0ff, #61e4ff);
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