<template>
    <view class="register-container">
        <view class="register-header">
            <image class="back-icon" src="/static/public/back.png" @click="goBack"></image>
            <text class="header-title">用户注册</text>
        </view>

        <view class="register-form">
            <view class="avatar-container">
                <image class="avatar" src="/static/666.jpg" mode="aspectFill"></image>
                <view class="avatar-upload">
                    <text>点击更换头像</text>
                </view>
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

                <view class="input-item">
                    <text class="input-label">确认密码</text>
                    <input class="input-field" type="password" v-model="confirmPassword" placeholder="请再次输入密码" />
                </view>
            </view>

            <view class="register-options">
                <text class="login-link" @click="goToLogin">已有账号? 去登录</text>
            </view>

            <button class="register-button" @click="handleRegister">注册</button>

            <view class="wechat-register">
                <text class="wechat-register-text">微信快速注册</text>
                <button class="wechat-register-button" @click="wechatRegister">
                    <text>微信注册</text>
                </button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signUp } from '../../api/api'
const username = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

// 注册处理
const handleRegister = () => {
    if (!username.value || !password.value || !confirmPassword.value) {
        uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
        })
        return
    }

    if (username.value.length < 3) {
        uni.showToast({
            title: '用户名长度应大于3小于20位',
            icon: 'none'
        })
        return
    }

    if (password.value !== confirmPassword.value) {
        uni.showToast({
            title: '两次密码输入不一致',
            icon: 'none'
        })
        return
    }

    uni.showLoading({
        title: '注册中...'
    })

    const userInfo = {
        nickName: username.value,
        avatarUrl: '/static/666.jpg',
        userId: ''
    };

    try {
        signUp({
            userName: username.value,
            passWord: password.value
        }).then(async res => {
            console.log(res)

            userInfo.nickName = username.value
            userInfo.avatarUrl = '/static/666.jpg'
            userInfo.userId = res.userID
            uni.setStorageSync('token', 'sample-token')
            uni.setStorageSync('userInfo', JSON.stringify(userInfo))
            uni.hideLoading()
            await new Promise(resolve => {
                uni.showToast({
                    title: '注册成功',
                    icon: 'success'
                })
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
            uni.navigateBack()
        })
    } catch (error) {
        console.log(error)
    }
}

// 微信注册
const wechatRegister = () => {
    uni.showLoading({
        title: '注册中...'
    })

    // 模拟微信注册
    setTimeout(() => {
        uni.hideLoading()

        const userInfo = {
            nickName: '微信用户',
            avatarUrl: '/static/666.jpg',
            userId: 'wx' + Date.now()
        }

        uni.setStorageSync('token', 'wx-token');
        uni.setStorageSync('userInfo', JSON.stringify(userInfo))

        uni.showToast({
            title: '注册成功',
            icon: 'success'
        })

        setTimeout(() => {
            uni.navigateBack({
                delta: 2  // 返回两层，跳过登录页回到我的页面
            })
        }, 1500)
    }, 1500)
};

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 跳转到登录页
const goToLogin = () => {
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.register-container {
    background-color: #ffffff;
    min-height: 100vh;

    .register-header {
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

    .register-form {
        padding: 30rpx;

        .avatar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 30rpx 0 50rpx;
            position: relative;

            .avatar {
                width: 180rpx;
                height: 180rpx;
                border-radius: 50%;
                border: 4rpx solid #4bb0ff;
            }

            .avatar-upload {
                margin-top: 15rpx;
                font-size: 24rpx;
                color: #4bb0ff;
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
                }

                .input-field {
                    width: 100%;
                    height: 80rpx;
                    background-color: #f5f5f5;
                    border-radius: 40rpx;
                    padding: 0 30rpx;
                    font-size: 28rpx;
                }
            }
        }

        .register-options {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40rpx;

            .login-link {
                font-size: 26rpx;
                color: #4bb0ff;
            }
        }

        .register-button {
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

        .wechat-register {
            display: flex;
            flex-direction: column;
            align-items: center;

            .wechat-register-text {
                font-size: 28rpx;
                color: #999;
                margin-bottom: 30rpx;
            }

            .wechat-register-button {
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