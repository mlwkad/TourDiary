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
                                <view class="item-date">{{ item.createdAt }}</view>
                                <view class="item-actions">
                                    <image class="action-icon" src="/static/public/close.png"
                                        @click.stop="removeCollection(item.releaseID)"></image>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <view class="empty-state">
                    <image class="empty-icon" src="/static/public/search.png" mode="aspectFit"></image>
                    <view class="empty-text">暂无收藏内容</view>
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
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;

    .content-area {
        flex: 1;
        padding: 20rpx;
        min-height: fit-content;
        width: 93%;

        .collection-list {
            .collection-item {
                background-color: #fff;
                border-radius: 12rpx;
                margin-bottom: 20rpx;
                padding: 20rpx;
                display: flex;
                box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

                .item-image {
                    width: 200rpx;
                    height: 150rpx;
                    border-radius: 8rpx;
                    margin-right: 20rpx;
                }

                .item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;

                    .item-title {
                        font-size: 32rpx;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10rpx;
                    }

                    .item-desc {
                        font-size: 26rpx;
                        color: #666;
                        margin-bottom: 15rpx;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .item-meta {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .item-date {
                            font-size: 24rpx;
                            color: #999;
                        }

                        .item-actions {
                            display: flex;
                            gap: 15rpx;

                            .action-icon {
                                width: 36rpx;
                                height: 36rpx;
                            }
                        }
                    }
                }
            }
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100rpx 0;

            .empty-icon {
                width: 200rpx;
                height: 200rpx;
                margin-bottom: 30rpx;
                opacity: 0.5;
            }

            .empty-text {
                font-size: 32rpx;
                color: #999;
                margin-bottom: 30rpx;
            }

            .empty-action {
                font-size: 28rpx;
                color: #4bb0ff;
                padding: 20rpx 40rpx;
                background-color: rgba(75, 176, 255, 0.1);
                border-radius: 30rpx;
            }
        }
    }
}
</style>