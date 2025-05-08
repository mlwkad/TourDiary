<template>
    <view class="works-container">
        <view class="user-profile">
            <image class="user-avatar" src="/static/666.jpg" mode="aspectFill"></image>
            <view class="user-info">
                <view class="user-name">{{ userData.userName }}</view>
                <view class="user-stats">
                    <view class="stat-item">
                        <view class="stat-value">{{ userWorks.length }}</view>
                        <view class="stat-label">作品</view>
                    </view>
                </view>
            </view>
            <view class="follow-action">
                <view class="follow-btn" @click="toggleFollow">
                    {{ isFollowing ? '已关注' : '+ 关注' }}
                </view>
            </view>
        </view>

        <scroll-view scroll-y class="content-area" refresher-enabled @refresherrefresh="onRefresh"
            :refresher-triggered="isRefreshing">
            <template v-if="userWorks.length > 0">
                <view class="works-list">
                    <view class="work-item" v-for="(item, index) in userWorks" :key="index"
                        @click="viewWorkDetail(item.releaseID)">
                        <view class="work-header">
                            <view class="work-title">{{ item.title }}</view>
                        </view>
                        <view class="work-body">
                            <image class="work-image" src="/static/666.jpg" mode="aspectFill"></image>
                            <view class="work-content">
                                <view class="work-desc">{{ item.content }}</view>
                            </view>
                        </view>
                        <view class="work-meta">
                            <view class="meta-item" v-if="item.createdAt">
                                <image class="meta-icon" src="/static/public/time.png"></image>
                                <text>{{ item.createdAt.slice(0, 10) }}</text>
                            </view>
                            <view class="meta-item" v-if="item.location">
                                <image class="meta-icon" src="/static/public/location.png"></image>
                                <text>{{ item.location }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 底部提示 -->
                <view class="list-footer" v-if="userWorks.length > 5">
                    <text>已经到底啦~</text>
                </view>
            </template>
            <template v-else>
                <view class="empty-state">
                    <image class="empty-icon" src="/static/public/search.png" mode="aspectFit"></image>
                    <view class="empty-text">暂无作品</view>
                    <view class="empty-subtext">该用户还没有发布任何作品</view>
                </view>
            </template>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { getReleaseDetail, getUserReleases, getUserInfo, follow, unfollow, getFollowingList } from '../../api/api';

// 用户信息
const userData = reactive({})
let userID = ref<string>('')

// 是否关注
const isFollowing = ref(true)

// 关注状态
const isRefreshing = ref(false)

// 用户作品列表
const userWorks = ref<any[]>([
    {
        releaseID: 'release1',
        title: '北京三日游',
        content: '游览了故宫、长城、颐和园等著名景点，感受了浓厚的历史文化氛围。',
        createdAt: '2023-05-15T10:30:00.000Z',
        location: '北京市',
        pictures: ['/static/666.jpg']
    },
    {
        releaseID: 'release2',
        title: '杭州西湖一日游',
        content: '西湖美景让人心旷神怡，苏堤春晓、断桥残雪都是绝佳的景点。',
        createdAt: '2023-06-20T15:45:00.000Z',
        location: '杭州市',
        pictures: ['/static/666.jpg']
    },
    {
        releaseID: 'release3',
        title: '上海都市风光',
        content: '上海的现代化都市风光令人惊叹，外滩夜景尤为壮观。',
        createdAt: '2023-07-10T09:15:00.000Z',
        location: '上海市',
        pictures: ['/static/666.jpg']
    }
])

// 查看作品详情
const viewWorkDetail = async (releaseID: string) => {
    try {
        const info = await getReleaseDetail(releaseID)
        uni.navigateTo({
            url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
        })
    } catch (error) {
        uni.showToast({
            title: '获取详情失败',
            icon: 'none'
        })
    }
}

// 切换关注状态
const toggleFollow = () => {
    userID.value = JSON.parse(uni.getStorageSync('userInfo')).userId
    if (isFollowing.value) {
        uni.showModal({
            title: '提示',
            content: `确定要取消关注"${userData.userName}"吗？`,
            success: (res) => {
                if (res.confirm) {
                    // 这里应该调用取消关注的API
                    unfollow(userID.value, userData.userID).then(res => {
                        isFollowing.value = false
                        uni.showToast({
                            title: '已取消关注',
                            icon: 'success'
                        })
                    })
                }
            }
        })
    } else {
        // 这里应该调用关注用户的API
        follow(userID.value, { followUserID: userData.userID }).then(res => {
            isFollowing.value = true
            uni.showToast({
                title: '关注成功',
                icon: 'success'
            })
        })
    }
}

// 刷新数据
const onRefresh = async () => {
    isRefreshing.value = true
    // 模拟获取用户作品的API调用
    await new Promise((resolve) => {
        setTimeout(() => {
            isRefreshing.value = false
            resolve(null)
        }, 500);
    })
}

onLoad((options) => {
    if (options.userID) {
        getUserReleases(options.userID).then(res => {
            userWorks.value = res
        })
        getUserInfo(options.userID).then(res => {
            Object.assign(userData, res)
        })
        const userInfo = uni.getStorageSync('userInfo')
        getFollowingList(JSON.parse(userInfo).userId).then(res => {
            isFollowing.value = res.includes(options.userID)
        })
    }
})
</script>

<style lang="scss" scoped>
.works-container {
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
        top: 15%;
        right: 5%;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(236, 110, 173, 0.2), rgba(52, 148, 230, 0.1));
        filter: blur(30rpx);
        z-index: -1;
    }

    .user-profile {
        margin: 30rpx 20rpx 20rpx;
        padding: 30rpx;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 20rpx;
        box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.1);
        backdrop-filter: none;
        border: 1px solid rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;
        position: relative;

        .user-avatar {
            width: 140rpx;
            height: 140rpx;
            border-radius: 50%;
            margin-right: 30rpx;
            box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
            border: 3rpx solid #fff;
        }

        .user-info {
            flex: 1;

            .user-name {
                font-size: 36rpx;
                font-weight: bold;
                margin-bottom: 12rpx;
                background: linear-gradient(90deg, #3494E6, #555);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                margin-left: 8rpx;
                text-shadow: 0 0 1px rgba(52, 148, 230, 0.1);
            }

            .user-stats {
                display: flex;
                margin-top: 15rpx;

                .stat-item {
                    display: flex;
                    align-items: center;
                    background: rgba(52, 148, 230, 0.1);
                    padding: 8rpx 20rpx;
                    border-radius: 30rpx;

                    .stat-value {
                        font-size: 30rpx;
                        font-weight: bold;
                        color: #3494E6;
                        margin-right: 8rpx;
                    }

                    .stat-label {
                        font-size: 24rpx;
                        color: #666;
                    }
                }
            }
        }

        .follow-action {
            .follow-btn {
                padding: 15rpx 30rpx;
                border-radius: 40rpx;
                font-size: 28rpx;
                color: #fff;
                background: linear-gradient(135deg, #3494E6, #EC6EAD);
                box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                white-space: nowrap;

                &:active {
                    transform: scale(0.95);
                }
            }
        }
    }

    .content-area {
        flex: 1;
        padding: 10rpx 20rpx 20rpx;
        min-height: fit-content;
        width: 95%;
        margin: 0 auto;

        .works-list {
            .work-item {
                width: 91%;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 20rpx;
                margin-bottom: 30rpx;
                padding: 25rpx;
                display: flex;
                flex-direction: column;
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

                &:active {
                    transform: translateY(-5rpx);
                    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
                }

                .work-header {
                    margin-bottom: 15rpx;

                    .work-title {
                        font-size: 32rpx;
                        font-weight: bold;
                        background: linear-gradient(90deg, #3494E6, #555);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                        text-shadow: 0 0 1px rgba(52, 148, 230, 0.1);
                        position: relative;
                        padding-bottom: 10rpx;

                        &::after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 60rpx;
                            height: 3rpx;
                            background: linear-gradient(90deg, #3494E6, transparent);
                        }
                    }
                }

                .work-body {
                    display: flex;
                    margin-bottom: 20rpx;

                    .work-image {
                        width: 180rpx;
                        height: 140rpx;
                        border-radius: 15rpx;
                        margin-right: 20rpx;
                        box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
                        flex-shrink: 0;
                    }

                    .work-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;

                        .work-desc {
                            font-size: 26rpx;
                            color: #333;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            line-clamp: 3;
                            -webkit-box-orient: vertical;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            line-height: 1.6;
                            background: linear-gradient(90deg, rgba(52, 148, 230, 0.15), rgba(236, 110, 173, 0.05));
                            padding: 10rpx 15rpx;
                            border-radius: 10rpx;
                            border-left: 3rpx solid rgba(52, 148, 230, 0.6);
                            height: 100%;
                        }
                    }
                }

                .work-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15rpx;
                    justify-content: flex-start;
                    width: 100%;

                    .meta-item {
                        font-size: 24rpx;
                        color: #888;
                        display: flex;
                        align-items: center;
                        background-color: rgba(0, 0, 0, 0.05);
                        padding: 6rpx 16rpx;
                        border-radius: 20rpx;
                        width: fit-content;
                        min-width: 100rpx;

                        .meta-icon {
                            width: 24rpx;
                            height: 24rpx;
                            margin-right: 8rpx;
                            flex-shrink: 0;
                        }

                        text {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
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
                margin-bottom: 15rpx;
                text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.1);
            }

            .empty-subtext {
                font-size: 28rpx;
                color: #aaa;
                margin-bottom: 40rpx;
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