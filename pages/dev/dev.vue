<template>
    <view class="dev-container">
        <view class="header">
            <text class="title">开发调试页面</text>
        </view>

        <view class="page-links">
            <view class="link-group">
                <text class="group-title">主要页面</text>
                <button class="nav-btn" @click="navigateTo('/pages/index/index')">首页</button>
                <button class="nav-btn" @click="navigateTo('/pages/My/My')">我的页面</button>
                <button class="nav-btn" @click="navigateTo('/pages/Release/Release')">发布页面</button>
            </view>

            <view class="link-group">
                <text class="group-title">登录注册</text>
                <button class="nav-btn" @click="navigateTo('/pages/login/login')">登录页面</button>
                <button class="nav-btn" @click="navigateTo('/pages/register/register')">注册页面</button>
            </view>

            <view class="test-controls">
                <text class="group-title">测试控制</text>
                <button class="control-btn" @click="clearStorage">清除存储数据</button>
                <button class="control-btn" @click="simulateLogin">模拟登录状态</button>
            </view>
        </view>
    </view>
</template>

<script setup>
const navigateTo = (url) => {
    // 检查是否是tabBar页面
    const tabBarPages = [
        '/pages/index/index',
        '/pages/My/My',
        '/pages/Release/Release'
    ];

    if (tabBarPages.includes(url)) {
        // 使用switchTab导航到tabBar页面
        uni.switchTab({
            url
        });
    } else {
        // 使用navigateTo导航到非tabBar页面
        uni.navigateTo({
            url
        });
    }
}

const clearStorage = () => {
    uni.clearStorageSync();
    uni.showToast({
        title: '存储已清除',
        icon: 'success'
    });
}

const simulateLogin = () => {
    const userInfo = {
        nickName: '测试用户',
        avatarUrl: '/static/666.jpg',
        userId: 'test-' + Date.now()
    };

    uni.setStorageSync('token', 'test-token');
    uni.setStorageSync('userInfo', JSON.stringify(userInfo));

    uni.showToast({
        title: '已设置登录状态',
        icon: 'success'
    });

    // 提示用户是否要跳转到"我的"页面查看效果
    uni.showModal({
        title: '提示',
        content: '已模拟登录状态，是否跳转到"我的"页面查看效果？',
        success: (res) => {
            if (res.confirm) {
                uni.switchTab({
                    url: '/pages/My/My'
                });
            }
        }
    });
}
</script>

<style lang="scss" scoped>
.dev-container {
    padding: 30rpx;

    .header {
        margin-bottom: 40rpx;

        .title {
            font-size: 40rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .page-links {
        .link-group {
            margin-bottom: 40rpx;

            .group-title {
                font-size: 32rpx;
                font-weight: bold;
                margin-bottom: 20rpx;
                display: block;
            }

            .nav-btn {
                margin-bottom: 20rpx;
                background: linear-gradient(to right, #4bb0ff, #61e4ff);
                color: #fff;
                font-size: 30rpx;
            }
        }

        .test-controls {
            margin-top: 60rpx;

            .group-title {
                font-size: 32rpx;
                font-weight: bold;
                margin-bottom: 20rpx;
                display: block;
            }

            .control-btn {
                margin-bottom: 20rpx;
                background-color: #f5f5f5;
                color: #333;
                font-size: 30rpx;

                &:last-child {
                    background-color: #07c160;
                    color: #fff;
                }
            }
        }
    }
}
</style>