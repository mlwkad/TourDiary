<template>
    <view class="notes-container">
        <!-- 内容区域 -->
        <scroll-view scroll-y class="content-area" refresher-enabled @refresherrefresh="onRefresh"
            :refresher-triggered="isRefreshing">
            <!-- 笔记列表 -->
            <template v-if="notes.length > 0">
                <view class="notes-list">
                    <view class="note-item" v-for="(note, index) in notes" :key="index"
                        @click="viewNote(note.releaseID)">
                        <view class="note-header">
                            <view class="note-title">{{ note.title }}</view>
                            <view class="note-actions">
                                <image class="action-icon" src="/static/public/close.png"
                                    @click.stop="deleteNote(note.id, index)"></image>
                            </view>
                        </view>
                        <view class="note-content" v-if="note.content">{{ note.content }}</view>
                        <view class="note-meta">
                            <view class="note-location" v-if="note.location">
                                <image class="location-icon" src="/static/public/search.png"></image>
                                <text>{{ note.location }}</text>
                            </view>
                            <view class="note-date">{{ note.createdAt.slice(0,10) }}</view>
                        </view>
                        <view class="note-images" v-if="note.pictures && note.pictures.length">
                            <image v-for="(img, imgIndex) in note.pictures" :key="imgIndex" :src="img" mode="aspectFill"
                                @click.stop="previewImage(note.pictures, imgIndex)"></image>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <view class="empty-state">
                    <image class="empty-icon" src="/static/public/search.png" mode="aspectFit"></image>
                    <view class="empty-text">暂无笔记内容</view>
                    <view class="empty-action" @click="createNote">创建新笔记</view>
                </view>
            </template>
        </scroll-view>

        <!-- 悬浮添加按钮 -->
        <image class="add-button" src="/static/public/add.png" @click="createNote"></image>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { getUserReleases, getReleaseDetail } from '../../api/api';

// 笔记数据
const notes = ref<any[]>([]);
const isRefreshing = ref(false);
const currentFilter = ref('all');

// 查看笔记详情
const viewNote = async (releaseID: string) => {
    const info = await getReleaseDetail(releaseID)
    uni.navigateTo({
        url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
    });
};

// 删除笔记
const deleteNote = (id: string, index: number) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除这个笔记吗？',
        success: (res) => {
            if (res.confirm) {
                // 这里应该调用API删除笔记
                notes.value.splice(index, 1);
                uni.showToast({
                    title: '已删除',
                    icon: 'success'
                });
            }
        }
    });
};

// 创建新笔记
const createNote = () => {
    uni.reLaunch({
        url: '/pages/Release/Release'
    });
};

// 设置筛选条件
const setFilter = (filter: string) => {
    currentFilter.value = filter;
};

// 刷新数据
const onRefresh = async () => {
    isRefreshing.value = true;
    const userID = JSON.parse(uni.getStorageSync('userInfo')).userId
    const res = await getUserReleases(userID)
    notes.value = res
};

// 预览图片
const previewImage = (images: string[], current: number) => {
    uni.previewImage({
        urls: images,  // [url1,url2] 图片地址数组  
        current: images[current]  // 当前显示的图片索引
    });
};

onLoad(async () => {
    const userID = JSON.parse(uni.getStorageSync('userInfo')).userId
    const res = await getUserReleases(userID)
    notes.value = res
})

</script>

<style lang="scss" scoped>
.notes-container {
    width: 100%;
    min-height: 100vh;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    position: relative;

    .content-area {
        flex: 1;

        .filter-menu {
            display: flex;
            background-color: #fff;
            padding: 20rpx;
            margin-bottom: 15rpx;

            .filter-item {
                flex: 1;
                text-align: center;
                font-size: 28rpx;
                color: #666;
                padding: 10rpx 0;
                position: relative;

                &.active {
                    color: #4bb0ff;
                    font-weight: bold;

                    &:after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 30rpx;
                        height: 4rpx;
                        background-color: #4bb0ff;
                        border-radius: 2rpx;
                    }
                }
            }
        }

        .notes-list {
            padding: 0 20rpx;

            .note-item {
                background-color: #fff;
                border-radius: 12rpx;
                margin-bottom: 20rpx;
                padding: 25rpx;
                box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

                .note-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15rpx;

                    .note-title {
                        font-size: 34rpx;
                        font-weight: bold;
                        color: #333;
                    }

                    .note-actions {
                        display: flex;
                        gap: 15rpx;

                        .action-icon {
                            width: 36rpx;
                            height: 36rpx;
                        }
                    }
                }

                .note-content {
                    font-size: 28rpx;
                    color: #666;
                    margin-bottom: 20rpx;
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .note-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15rpx;

                    .note-location {
                        display: flex;
                        align-items: center;
                        font-size: 24rpx;
                        color: #999;

                        .location-icon {
                            width: 24rpx;
                            height: 24rpx;
                            margin-right: 6rpx;
                        }
                    }

                    .note-date {
                        font-size: 24rpx;
                        color: #999;
                    }
                }

                .note-images {
                    display: flex;
                    gap: 10rpx;
                    margin-top: 15rpx;

                    image {
                        width: 150rpx;
                        height: 150rpx;
                        border-radius: 8rpx;
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
                color: #fff;
                padding: 20rpx 40rpx;
                background: linear-gradient(to right, #4bb0ff, #61e4ff);
                border-radius: 30rpx;
            }
        }
    }

    .add-button {
        position: fixed;
        right: 40rpx;
        bottom: 60rpx;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        z-index: 10;
    }
}
</style>