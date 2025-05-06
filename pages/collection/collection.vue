<template>
    <view class="collection-container">

        <!-- 内容区域 -->
        <scroll-view scroll-y class="content-area" refresher-enabled @refresherrefresh="onRefresh"
            :refresher-triggered="isRefreshing">
            <template v-if="collections.length > 0">
                <view class="collection-list">
                    <view class="collection-item" v-for="(item, index) in collections" :key="index"
                        @click="viewNote(item.releaseID)">
                        <image class="item-image" src="/static/666.jpg" mode="aspectFill"></image>
                        <view class="item-content">
                            <view class="item-title">{{ item.title }}</view>
                            <view class="item-desc">{{ item.content }}</view>
                            <view class="item-meta">
                                <view class="item-date">
                                    <image class="date-icon" src="/static/public/time.png"></image>
                                    {{ item.createdAt.slice(0, 10) }}
                                </view>
                                <view class="item-actions">
                                    <view class="action-icon" @click.stop="removeCollection(item.releaseID)">删除</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 底部提示 -->
                <view class="list-footer" v-if="collections.length > 5">
                    <text>已经到底啦~</text>
                </view>
            </template>
            <template v-else>
                <view class="empty-state">
                    <image class="empty-icon" src="/static/public/search.png" mode="aspectFit"></image>
                    <view class="empty-text">暂无收藏内容</view>
                    <view class="empty-subtext">收藏喜欢的旅游日记，随时查看</view>
                    <view class="empty-action" @click="goToDiscover">去发现更多内容</view>
                </view>
            </template>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getUserLiked, getReleaseDetail, removeLiked } from '../../api/api';
import { onLoad } from '@dcloudio/uni-app'

// 收藏数据
const collections = ref<any[]>([])
const isRefreshing = ref(false)
let userID = ref<string>('')

// 查看详情
const viewNote = async (releaseID: string) => {
    const info = await getReleaseDetail(releaseID)
    uni.navigateTo({
        url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
    })
}

// 移除收藏
const removeCollection = (releaseID) => {
    uni.showModal({
        title: '提示',
        content: '确定要移除这个收藏吗？',
        success: async (res) => {
            if (res.confirm) {
                await removeLiked(userID, releaseID)
                const res = await getUserLiked(userID)
                collections.value = res
                uni.showToast({
                    title: '已移除收藏',
                    icon: 'success'
                })
            }
        }
    });
};

// 刷新数据
const onRefresh = async () => {
    isRefreshing.value = true
    await getUserLiked(userID).then(res => { collections.value = res })
    await new Promise((resolve) => {
        setTimeout(() => {
            isRefreshing.value = false
            resolve()
        }, 500);
    })
}

// 去发现页面
const goToDiscover = () => {
    uni.switchTab({
        url: '/pages/index/index'
    })
}

onLoad(() => {
    userID = JSON.parse(uni.getStorageSync('userInfo')).userId
    getUserLiked(userID).then(res => { collections.value = res })
})

</script>

<style lang="scss" scoped>
.collection-container {
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

        .collection-list {
            .collection-item {
                width: 91%;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 20rpx;
                margin-bottom: 30rpx;
                padding: 25rpx;
                display: flex;
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

                .item-image {
                    width: 200rpx;
                    height: 150rpx;
                    border-radius: 15rpx;
                    margin-right: 25rpx;
                    box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;

                    .item-title {
                        font-size: 32rpx;
                        font-weight: bold;
                        margin-bottom: 12rpx;
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

                    .item-desc {
                        width: 95%;
                        font-size: 26rpx;
                        color: #333;
                        margin-bottom: 20rpx;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        line-height: 1.6;
                        background: linear-gradient(90deg, rgba(52, 148, 230, 0.15), rgba(236, 110, 173, 0.05));
                        padding: 5rpx 15rpx;
                        border-radius: 10rpx;
                        border-left: 3rpx solid rgba(52, 148, 230, 0.6);
                        text-shadow: 0 0 1px rgba(255, 255, 255, 0.8);
                    }

                    .item-meta {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .item-date {
                            font-size: 24rpx;
                            color: #888;
                            display: flex;
                            align-items: center;
                            background-color: rgba(0, 0, 0, 0.05);
                            padding: 6rpx 16rpx;
                            border-radius: 20rpx;

                            .date-icon {
                                width: 24rpx;
                                height: 24rpx;
                                margin-right: 8rpx;
                            }
                        }

                        .item-actions {
                            display: flex;
                            gap: 15rpx;

                            .action-icon {
                                padding: 10rpx 20rpx;
                                border-radius: 30rpx;
                                font-size: 26rpx;
                                color: #fff;
                                background: linear-gradient(135deg, #ff7676, #f54242);
                                box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.1);
                                transition: all 0.3s ease;
                            }
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