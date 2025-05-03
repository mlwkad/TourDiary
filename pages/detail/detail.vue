<template>
    <view class="detail-container">
        <!-- 轮播图展示pictures和videos -->
        <swiper class="detail-swiper" indicator-dots autoplay :interval="3000" :duration="500" circular>
            <swiper-item v-for="(item, index) in info.pictures" :key="'pic-' + index">
                <image class="swiper-image" src="/static/555.jpg" mode="aspectFill"></image>
            </swiper-item>
            <swiper-item v-for="(item, index) in info.videos" :key="'vid-' + index">
                <video class="swiper-video" src=""></video>
            </swiper-item>
        </swiper>
        <view class="detail-top">
            <!-- 标题部分 -->
            <view class="detail-title">
                <text>{{ info.title }}</text>
                <view class="detail-liked" @click="liked">收藏</view>
            </view>
            <!-- 用户信息部分 -->
            <view class="user-info">
                <image class="user-avatar" src="/static/666.jpg" mode="aspectFill"></image>
                <text class="user-name">{{ info.userName }}</text>
            </view>
        </view>
        <!-- 内容详情部分 -->
        <view class="detail-content">
            <view class="detail-item">
                <!-- <text class="item-label">内容描述:</text> -->
                <text class="item-value0">{{ info.content }}</text>
            </view>

            <view class="detail-item">
                <text class="item-label">旅游地点:</text>
                <text class="item-value1">{{ info.location }}</text>
            </view>

            <view class="detail-info">
                <view class="info-item">
                    <image src="/static/public/money.png" class="info-icon"></image>
                    <text>{{ info.money }}元</text>
                </view>

                <view class="info-item">
                    <image src="/static/public/person.png" class="info-icon"></image>
                    <text>{{ info.personNum }}人</text>
                </view>

                <view class="info-item">
                    <image src="/static/public/time.png" class="info-icon"></image>
                    <text>{{ info.playTime }}分钟</text>
                </view>
            </view>
        </view>

        <!-- 底部操作按钮 -->
        <!-- <view class="detail-actions">
            <button class="action-btn">联系发布者</button>
            <button class="action-btn">收藏</button>
        </view> -->
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { addLiked } from '../../api/api';

// 初始化info对象
const info = ref({
    avatar: "https://example.com/avatar2.jpg",
    content: "这是一个测试发布内容3",
    createdAt: "2025-05-03T11:28:49.000Z",
    id: 3,
    location: "广州市天河区",
    money: "300.00",
    personNum: 1,
    pictures: ["https://example.com/pic4.jpg", "https://example.com/pic5.jpg"],
    playTime: 90,
    releaseID: "release3",
    title: "广州一日游",
    updatedAt: "2025-05-03T11:28:49.000Z",
    userID: "user2",
    userName: "testuser2",
    videos: []
});

const liked = () => {
    const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
    try {
        addLiked(userId, info.value.releaseID).then(res => {
            uni.showToast({
                title: res.message,
                icon: 'none'
            })
        })
    } catch (e) { console.log(e) }
}

onLoad((options) => {
    try {
        if (options.info) {
            const decodedInfo = JSON.parse(decodeURIComponent(options.info))
            info.value = decodedInfo
        } else {
            console.log('没拿到信息')
        }
    } catch (e) {
        console.log(e)
    }
})
</script>

<style lang="scss" scoped>
.detail-container {
    padding-bottom: 100rpx;
}

.detail-swiper {
    width: 100%;
    height: 500rpx;

    .swiper-image,
    .swiper-video {
        width: 100%;
        height: 100%;
    }
}

.detail-top {
    display: flex;
    justify-content: space-between;

    .detail-title {
        display: flex;
        align-items: center;
        gap: 20rpx;
        font-size: 40rpx;
        font-weight: bold;
        padding: 30rpx 20rpx 20rpx;

        .detail-liked {
            white-space: nowrap;
            background-color: #1296db;
            height: fit-content;
            width: fit-content;
            padding: 10rpx;
            font-size: 30rpx;
            font-weight: 400;
            color: white;
            border-radius: 12rpx;
        }
    }

    .user-info {
        display: flex;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1rpx solid #eee;

        .user-avatar {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin-right: 20rpx;
        }

        .user-name {
            font-size: 28rpx;
            color: #333;
        }
    }
}

.detail-content {
    padding: 20rpx;

    .detail-item {
        margin-bottom: 20rpx;

        .item-label {
            font-size: 28rpx;
            color: #666;
            margin-right: 10rpx;
        }

        .item-value0 {
            font-size: 35rpx;
            color: #333;
            font-weight: 600;
        }

        .item-value1 {
            font-size: 28rpx;
            color: #333;
        }
    }

    .detail-info {
        display: flex;
        justify-content: space-between;
        padding: 30rpx 0;
        border-top: 1rpx solid #eee;

        .info-item {
            display: flex;
            align-items: center;

            .info-icon {
                width: 40rpx;
                height: 40rpx;
                margin-right: 10rpx;
            }
        }
    }
}

.detail-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 20rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;

    .action-btn {
        flex: 1;
        margin: 0 10rpx;
        background-color: #1296db;
        color: #fff;
        font-size: 28rpx;
        padding: 15rpx 0;
    }
}
</style>