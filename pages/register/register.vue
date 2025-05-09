<template>
    <view class="register-container">
        <view class="register-form">
            <view class="avatar-container">
                <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
                <view class="avatar-upload">
                    <text @click="changeAvatar">点击更换头像</text>
                </view>
            </view>
            <view class="input-group">
                <view class="input-item">
                    <text class="input-label">用户名</text>
                    <input class="input-field" type="text" v-model="username" placeholder="请输入用户名"
                        @input="errors.username = ''" />
                    <view class="error-text" v-if="errors.username">{{ errors.username }}</view>
                </view>
                <view class="input-item">
                    <text class="input-label">确认用户名</text>
                    <input class="input-field" type="text" v-model="confirmUsername" placeholder="请再次输入用户名"
                        @input="errors.confirmUsername = ''" />
                    <view class="error-text" v-if="errors.confirmUsername">{{ errors.confirmUsername }}</view>
                </view>
                <view class="input-item">
                    <text class="input-label">密码</text>
                    <input class="input-field" type="password" v-model="password" placeholder="请输入密码"
                        @input="errors.password = ''" />
                    <view class="error-text" v-if="errors.password">{{ errors.password }}</view>
                </view>
                <view class="input-item">
                    <text class="input-label">确认密码</text>
                    <input class="input-field" type="password" v-model="confirmPassword" placeholder="请再次输入密码"
                        @input="errors.confirmPassword = ''" />
                    <view class="error-text" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</view>
                </view>
            </view>
            <view class="register-options">
                <text class="login-link" @click="goToLogin">已有账号? 去登录</text>
            </view>
            <button class="register-button" @click="handleRegister">注册</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { signUp } from '../../api/api'
import { validateUsername, validatePassword } from '../../utils/filter'
import { onShow } from '@dcloudio/uni-app'

const username = ref<string>('')
const confirmUsername = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const avatarUrl = ref<string>('/static/public/defaultAvatar.png')

// 错误信息
const errors = reactive({
    username: '',
    confirmUsername: '',
    password: '',
    confirmPassword: ''
})

// 验证表单
const validateForm = () => {
    let isValid = true
    for (let key in errors) {
        errors[key] = ''
    }
    // 验证用户名
    const usernameVal = validateUsername(username.value)
    if (!usernameVal.isValid) {
        errors.username = usernameVal.message
        isValid = false
    } else {
        username.value = usernameVal.filteredText
    }
    // 验证确认用户名
    const confirmUsernameVal = validateUsername(confirmUsername.value)
    if (!confirmUsernameVal.isValid) {
        errors.confirmUsername = confirmUsernameVal.message
        isValid = false
    } else {
        confirmUsername.value = confirmUsernameVal.filteredText
    }
    // 验证密码
    const passwordVal = validatePassword(password.value)
    if (!passwordVal.isValid) {
        errors.password = passwordVal.message
        isValid = false
    }
    // 验证确认密码
    const confirmPasswordVal = validatePassword(confirmPassword.value)
    if (!confirmPasswordVal.isValid) {
        errors.confirmPassword = confirmPasswordVal.message
        isValid = false
    } else if (password.value !== confirmPassword.value) {
        errors.confirmPassword = '两次输入的密码不一致'
        isValid = false
    }
    return isValid
}

// 注册处理
const handleRegister = () => {
    // 验证表单
    if (!validateForm()) {
        return
    }

    uni.showLoading({
        title: '注册中...'
    })

    const userInfo = {
        nickName: username.value,
        avatarUrl: '',
        userId: ''
    };

    try {
        signUp({
            userName: username.value,
            passWord: password.value,
            avatar: avatarUrl.value
        }).then(async res => {

            userInfo.nickName = username.value
            userInfo.avatarUrl = avatarUrl.value
            userInfo.userId = res.userID

            uni.setStorageSync('token', res.userID)
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
        }).catch(err => {
            console.log(err)
            uni.hideLoading()
            uni.showToast({
                title: '注册失败，请稍后重试',
                icon: 'none'
            })
        })
    } catch (error) {
        console.log(error)
        uni.hideLoading()
        uni.showToast({
            title: '注册失败，请稍后重试',
            icon: 'none'
        })
    }
}

const changeAvatar = () => {
    uni.chooseImage({
        count: 1,
        success: (res) => {
            avatarUrl.value = res.tempFilePaths
        }
    })
}

// 跳转到登录页
const goToLogin = () => {
    uni.navigateBack()
}

onShow(() => {
    avatarUrl.value = '/static/public/defaultAvatar.png'
})

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
                border: 8rpx solid #4bb0ff;
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
                    width: 92%;
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
            background: linear-gradient(to right, #3494E6, #EC6EAD);
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