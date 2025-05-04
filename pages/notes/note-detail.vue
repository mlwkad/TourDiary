<template>
    <view class="note-detail-container">
        <!-- 笔记内容 -->
        <scroll-view scroll-y class="content-area">
            <view class="note-main">
                <view class="note-header">
                    <view class="note-title">{{ note.title }}</view>
                    <view class="note-meta">
                        <view class="note-location" v-if="note.location">
                            <image class="location-icon" src="/static/public/search.png"></image>
                            <text>{{ note.location }}</text>
                        </view>
                        <view class="note-date">{{ note.date }}</view>
                    </view>
                </view>

                <view class="note-content">{{ note.content }}</view>

                <view class="note-images" v-if="note.images && note.images.length">
                    <image v-for="(img, index) in note.images" :key="index" :src="img" mode="widthFix"
                        @click="previewImage(note.images, index)" class="note-image"></image>
                </view>
            </view>
        </scroll-view>

        <!-- 底部工具栏 -->
        <view class="bottom-toolbar">
            <view class="toolbar-item" @click="toggleFavorite">
                <image :src="note.isFavorite ? '/static/public/search.png' : '/static/public/search.png'"
                    mode="aspectFit"></image>
                <text>{{ note.isFavorite ? '已收藏' : '收藏' }}</text>
            </view>
            <view class="toolbar-item" @click="shareNote">
                <image src="/static/public/search.png" mode="aspectFit"></image>
                <text>分享</text>
            </view>
            <view class="toolbar-item" @click="deleteNote">
                <image src="/static/public/close.png" mode="aspectFit"></image>
                <text>删除</text>
            </view>
            <view class="toolbar-item" @click="editNote">
                <image src="/static/public/change.png" mode="aspectFit"></image>
                <text>编辑</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 笔记数据
const note = reactive({
    id: '',
    title: '',
    content: '',
    location: '',
    date: '',
    isFavorite: false,
    images: [] as string[]
});

// 获取笔记详情
const getNoteDetail = (id: string) => {
    // 这里应该是从API获取数据，现在用模拟数据
    setTimeout(() => {
        Object.assign(note, {
            id: id,
            title: '桂林游记',
            content: '今天游览了桂林的象鼻山和七星公园，风景如画，令人心旷神怡。象鼻山位于桂林市漓江与桃花江汇流处，因山形酷似一头伸鼻饮水的大象而得名，是桂林山水的标志性景观。\n\n七星公园是桂林最大的综合性公园，因园内有七座山峰，恰似北斗七星而得名。公园内有桂海碑林、七星岩、蛇山、华夏奇石馆、花桥、童子拜观音等景点。尤其是华夏奇石馆内的奇石，形态各异，令人叹为观止。\n\n漓江水清澈见底，两岸的喀斯特地貌景观壮观秀丽，船行其上，恍如画中。整个旅程给人一种身临仙境的感觉，不虚此行。',
            location: '广西桂林',
            date: '2023-10-15',
            isFavorite: true,
            images: ['/static/666.jpg', '/static/666.jpg', '/static/666.jpg']
        });
    }, 500);
};

// 编辑笔记
const editNote = () => {
    uni.navigateTo({
        url: `/pages/notes/note-edit?id=${note.id}`
    });
};

// 切换收藏状态
const toggleFavorite = () => {
    note.isFavorite = !note.isFavorite;
    // 这里应该调用API更新收藏状态
    uni.showToast({
        title: note.isFavorite ? '已收藏' : '已取消收藏',
        icon: 'success'
    });
};

// 分享笔记
const shareNote = () => {
    uni.showActionSheet({
        itemList: ['分享到微信', '分享到朋友圈', '复制链接'],
        success: (res) => {
            uni.showToast({
                title: '分享成功',
                icon: 'success'
            });
        }
    });
};

// 删除笔记
const deleteNote = () => {
    uni.showModal({
        title: '提示',
        content: '确定要删除这个笔记吗？',
        success: (res) => {
            if (res.confirm) {
                // 这里应该调用API删除笔记
                uni.showToast({
                    title: '已删除',
                    icon: 'success'
                });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1000);
            }
        }
    });
};

// 预览图片
const previewImage = (images: string[], current: number) => {
    uni.previewImage({
        urls: images,
        current: images[current]
    });
};

onLoad((options) => {
    if (options.id) {
        getNoteDetail(options.id);
    }
});
</script>

<style lang="scss" scoped>
.note-detail-container {
    width: 100%;
    min-height: 100vh;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;

    .content-area {
        flex: 1;
        padding: 30rpx;

        .note-main {
            background-color: #fff;
            border-radius: 12rpx;
            padding: 30rpx;
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

            .note-header {
                margin-bottom: 30rpx;

                .note-title {
                    font-size: 40rpx;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20rpx;
                }

                .note-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #f0f0f0;
                    padding-bottom: 20rpx;

                    .note-location {
                        display: flex;
                        align-items: center;
                        font-size: 26rpx;
                        color: #999;

                        .location-icon {
                            width: 24rpx;
                            height: 24rpx;
                            margin-right: 6rpx;
                        }
                    }

                    .note-date {
                        font-size: 26rpx;
                        color: #999;
                    }
                }
            }

            .note-content {
                font-size: 30rpx;
                color: #333;
                line-height: 1.8;
                margin-bottom: 30rpx;
                white-space: pre-wrap;
            }

            .note-images {
                display: flex;
                flex-direction: column;
                gap: 20rpx;

                .note-image {
                    width: 100%;
                    border-radius: 8rpx;
                }
            }
        }
    }

    .bottom-toolbar {
        display: flex;
        height: 100rpx;
        background-color: #fff;
        border-top: 1rpx solid #f0f0f0;

        .toolbar-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            image {
                width: 40rpx;
                height: 40rpx;
                margin-bottom: 8rpx;
            }

            text {
                font-size: 24rpx;
                color: #666;
            }
        }
    }
}
</style>