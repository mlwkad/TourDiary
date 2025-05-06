<template>
    <view class="follow-container">
        <!-- 内容区域 -->
        <scroll-view scroll-y class="content-area" refresher-enabled @refresherrefresh="onRefresh"
            :refresher-triggered="isRefreshing">
            <template v-if="followList.length > 0">
                <view class="follow-list">
                    <view class="follow-item" v-for="(item, index) in followList" :key="index"
                        @click="viewUserProfile(item.userID)">
                        <image class="user-avatar" src="/static/666.jpg" mode="aspectFill"></image>
                        <view class="user-info">
                            <view class="user-name">{{ item.userName }}</view>
                            <view class="works-count">作品数: {{ item.worksCount || 0 }}</view>
                        </view>
                        <view class="follow-action">
                            <view class="follow-btn" @click.stop="unfollowUser(item.userID, index)">取消关注</view>
                        </view>
                    </view>
                </view>

                <!-- 底部提示 -->
                <view class="list-footer" v-if="followList.length > 5">
                    <text>已经到底啦~</text>
                </view>
            </template>
            <template v-else>
                <view class="empty-state">
                    <image class="empty-icon" src="/static/public/search.png" mode="aspectFit"></image>
                    <view class="empty-text">暂无关注用户</view>
                    <view class="empty-action" @click="goToDiscover">去发现更多创作者</view>
                </view>
            </template>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getFollowingList, getUserInfo, unfollow } from '@/api/api'
// 关注列表数据
const followList = ref<any[]>([])
const isRefreshing = ref(false)
const userID = ref<string>('')

// 查看用户主页
const viewUserProfile = (userID: string) => {
    uni.navigateTo({
        url: `/pages/follow/works?userID=${userID}`
    })
}

// 取消关注
const unfollowUser = (targetUserID: string, index: number) => {
    uni.showModal({
        title: '提示',
        content: '确定要取消关注该用户吗？',
        success: (res) => {
            if (res.confirm) {
                unfollow(userID.value, targetUserID).then(res => {
                    followList.value.splice(index, 1)
                    uni.showToast({
                        title: '已取消关注',
                        icon: 'success'
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    });
};

// 刷新数据
const onRefresh = async () => {
    isRefreshing.value = true
    // 模拟获取关注列表的API调用
    await new Promise((resolve) => {
        setTimeout(() => {
            isRefreshing.value = false
            resolve(null)
        }, 500);
    })
}

// 去发现页面
const goToDiscover = () => {
    uni.switchTab({
        url: '/pages/index/index'
    })
}

onShow(() => {
    const userInfo = uni.getStorageSync('userInfo')
    followList.value = []
    if (userInfo) {
        userID.value = JSON.parse(userInfo).userId
        // 这里应该获取关注列表
        getFollowingList(userID.value).then(res => {
            res.forEach(item => {
                getUserInfo(item).then(res => {
                    const user = {
                        userID: res.userID,
                        userName: res.userName,
                        worksCount: JSON.parse(res.release).length,
                        avatar: res.avatar
                    }
                    followList.value.push(user)
                })
            })
        })
    }
})
</script>

<style lang="scss" scoped>
.follow-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to bottom, #f0f5ff, #ffffff);
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 30rpx;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 400rpx;
        background: linear-gradient(135deg, rgba(52, 148, 230, 0.15), rgba(236, 110, 173, 0.1));
        z-index: -1;
        border-radius: 0 0 30% 30%;
    }

    &::after {
        content: '';
        position: absolute;
        top: 20%;
        right: 10%;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(236, 110, 173, 0.2), rgba(52, 148, 230, 0.1));
        filter: blur(30rpx);
        z-index: -1;
    }

    .page-header {
        padding: 30rpx;
        margin-bottom: 10rpx;

        .page-title {
            font-size: 44rpx;
            font-weight: bold;
            background: linear-gradient(90deg, #3494E6, #EC6EAD);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.1);
        }
    }

    .content-area {
        flex: 1;
        padding: 10rpx 20rpx 20rpx;
        min-height: fit-content;
        width: 95%;
        margin: 0 auto;

        .follow-list {
            .follow-item {
                width: 91%;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 20rpx;
                margin-bottom: 30rpx;
                padding: 25rpx;
                display: flex;
                align-items: center;
                box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.1);
                backdrop-filter: none;
                border: 1px solid rgba(255, 255, 255, 0.6);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 6rpx;
                    height: 100%;
                    background: linear-gradient(to bottom, #3494E6, #EC6EAD);
                    opacity: 0.7;
                }

                .user-avatar {
                    width: 100rpx;
                    height: 100rpx;
                    border-radius: 50%;
                    margin-right: 25rpx;
                    box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
                    border: 3rpx solid #fff;
                }

                .user-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;

                    .user-name {
                        font-size: 32rpx;
                        font-weight: bold;
                        margin-bottom: 8rpx;
                        background: linear-gradient(90deg, #3494E6, #555);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                    }

                    .works-count {
                        font-size: 26rpx;
                        color: #666;
                        background-color: rgba(52, 148, 230, 0.1);
                        padding: 4rpx 16rpx;
                        border-radius: 20rpx;
                        display: inline-block;
                        width: fit-content;
                    }
                }

                .follow-action {
                    .follow-btn {
                        padding: 10rpx 20rpx;
                        border-radius: 30rpx;
                        font-size: 26rpx;
                        color: #fff;
                        background: linear-gradient(135deg, #ff7676, #f54242);
                        box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.1);
                        transition: all 0.3s ease;

                        &:active {
                            transform: scale(0.95);
                        }
                    }
                }
            }
        }

        .list-footer {
            text-align: center;
            padding: 30rpx 0;
            color: #999;
            font-size: 24rpx;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 150rpx 0;

            .empty-icon {
                width: 250rpx;
                height: 250rpx;
                margin-bottom: 40rpx;
                opacity: 0.6;
                animation: float 3s ease-in-out infinite;
            }

            .empty-text {
                font-size: 36rpx;
                color: #999;
                margin-bottom: 40rpx;
                text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.1);
            }

            .empty-action {
                font-size: 30rpx;
                color: #fff;
                padding: 25rpx 50rpx;
                background: linear-gradient(to right, #3494E6, #EC6EAD);
                border-radius: 50rpx;
                box-shadow: 0 8rpx 15rpx rgba(52, 148, 230, 0.3);
                transition: all 0.3s ease;
            }
        }
    }
}

@keyframes float {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10rpx);
    }

    100% {
        transform: translateY(0);
    }
}
</style>