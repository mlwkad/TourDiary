<template>
    <view class="detail-container">
        <!-- 轮播图展示pictures和videos -->
        <swiper class="detail-swiper" v-if="(info.pictures.length === 0) && (info.videos.length === 0)" indicator-dots
            :indicator-active-color="'#3494E6'" :indicator-color="'rgba(255,255,255,0.5)'" :interval="3000"
            :duration="500" circular>
            <swiper-item>
                <image class="swiper-nothing" src="/static/public/nothing.png" mode="aspectFill"></image>
                <view class="swiper-nothing-title">暂无相关内容</view>
            </swiper-item>
        </swiper>
        <swiper class="detail-swiper" v-else-if="(info.pictures.length === 0) && (info.videos.length > 0)"
            indicator-dots :indicator-active-color="'#3494E6'" :indicator-color="'rgba(255,255,255,0.5)'"
            :interval="3000" :duration="500" circular>
            <swiper-item v-for="(item, index) in info.videos" :key="'vid-' + index">
                <video class="swiper-video" :src="item" :poster="info.cover" controls></video>
            </swiper-item>
        </swiper>
        <swiper class="detail-swiper" v-else-if="(info.pictures.length > 0) && (info.videos.length === 0)"
            indicator-dots :indicator-active-color="'#3494E6'" :indicator-color="'rgba(255,255,255,0.5)'"
            :interval="3000" :duration="500" circular>
            <swiper-item v-for="(item, index) in info.pictures" :key="'pic-' + index">
                <image class="swiper-image" src="/static/555.jpg" @click="previewImage(info.pictures, index)"
                    mode="aspectFill"></image>
            </swiper-item>
        </swiper>
        <swiper class="detail-swiper" v-else indicator-dots :indicator-active-color="'#3494E6'"
            :indicator-color="'rgba(255,255,255,0.5)'" :interval="3000" :duration="500" circular>
            <swiper-item v-for="(item, index) in info.videos" :key="'vid-' + index">
                <video class="swiper-video" :src="item" :poster="info.cover" controls></video>
            </swiper-item>
            <swiper-item v-for="(item, index) in info.pictures" :key="'pic-' + index">
                <image class="swiper-image" src="/static/555.jpg" @click="previewImage(info.pictures, index)"
                    mode="aspectFill"></image>
            </swiper-item>
        </swiper>
        <view class="detail-top">
            <!-- 标题部分 -->
            <view class="detail-title">
                <text class="animated-text">{{ info.title }}</text>
                <view class="detail-liked" @click="liked">
                    <text class="like-text">收藏</text>
                    <text class="like-icon">♥</text>
                </view>
            </view>
            <!-- 用户信息部分 -->
            <view class="user-info">
                <image class="user-avatar" src="/static/666.jpg" mode="aspectFill"></image>
                <text class="user-name">{{ info.userName }}</text>
            </view>
        </view>
        <!-- 内容详情部分 -->
        <view class="detail-content">
            <view class="section-heading">旅行详情</view>
            <view class="detail-item content-box">
                <text class="item-value0">{{ info.content }}</text>
            </view>

            <view class="detail-item location-box">
                <text class="item-label">旅游地点</text>
                <view class="location-wrapper">
                    <image src="/static/public/location.png" class="mini-icon"></image>
                    <text class="item-value1">{{ info.location }}</text>
                </view>
            </view>

            <view class="detail-info">
                <view class="info-item price-item">
                    <image src="/static/public/money.png" class="info-icon"></image>
                    <text>{{ info.money }}元</text>
                </view>

                <view class="info-item person-item">
                    <image src="/static/public/person.png" class="info-icon"></image>
                    <text>{{ info.personNum }}人</text>
                </view>

                <view class="info-item time-item">
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

<script setup lang="ts">
import { ref, reactive } from 'vue';
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

// 默认视频封面图
const defaultVideoPoster = ref('/static/555.jpg');

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

const previewImage = (images: string[], current: number) => {
    uni.previewImage({
        urls: images,  // [url1,url2] 图片地址数组  
        current: images[current]  // 当前显示的图片索引
    })
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
    background: linear-gradient(to bottom, #f0f5ff, #ffffff);
    min-height: 100vh;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 800rpx;
        background: linear-gradient(135deg, rgba(52, 148, 230, 0.15), rgba(236, 110, 173, 0.1));
        z-index: -1;
        border-radius: 0 0 30% 30%;
    }

    &::after {
        content: '';
        position: absolute;
        top: 15%;
        right: 5%;
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(236, 110, 173, 0.2), rgba(52, 148, 230, 0.1));
        filter: blur(30rpx);
        z-index: -1;
    }
}

.detail-swiper {
    width: 100%;
    height: 500rpx;
    box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.244);
    overflow: hidden;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100rpx;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
        z-index: 1;
        pointer-events: none;
    }

    .swiper-image,
    .swiper-video {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease;

        &:active {
            transform: scale(1.02);
        }
    }

    .swiper-nothing {
        width: 50%;
        height: 80%;
        transform: translateX(49%);
        opacity: 0.8;
        animation: float 3s ease-in-out infinite;
    }

    .swiper-nothing-title {
        transform: translateX(38%);
        font-size: 32rpx;
        color: #999;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    }
}

@keyframes float {
    0% {
        transform: translateX(49%) translateY(0);
    }

    50% {
        transform: translateX(49%) translateY(-10rpx);
    }

    100% {
        transform: translateX(49%) translateY(0);
    }
}

.detail-top {
    display: flex;
    justify-content: space-between;
    margin: 20rpx;
    padding: 20rpx;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20rpx;
    box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.252);
    backdrop-filter: blur(10rpx);
    border: 1px solid rgba(255, 255, 255, 0.6);
    position: relative;
    overflow: hidden;

    .detail-title {
        display: flex;
        align-items: center;
        gap: 20rpx;
        font-size: 40rpx;
        font-weight: bold;
        padding: 10rpx 0;

        .animated-text {
            position: relative;
            display: inline-block;
            background: linear-gradient(90deg, #3494E6, #EC6EAD);
            -webkit-background-clip: text;
            color: transparent;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                bottom: -6rpx;
                left: 0;
                width: 100%;
                height: 2rpx;
                background: linear-gradient(90deg, #3494E6, #EC6EAD);
            }
        }

        .detail-liked {
            white-space: nowrap;
            background: linear-gradient(135deg, #3494E6, #EC6EAD);
            height: fit-content;
            width: fit-content;
            padding: 10rpx 20rpx;
            font-size: 30rpx;
            font-weight: 500;
            color: white;
            border-radius: 30rpx;
            box-shadow: 0 4rpx 8rpx rgba(236, 110, 173, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8rpx;

            .like-icon {
                font-size: 26rpx;
                transition: transform 0.3s ease;
                color: white;
            }

            &:active .like-icon {
                transform: scale(1.5);
            }
        }

        .detail-liked .like-icon.liked {
            animation: heartBeat 1s ease;
            color: #ff496e;
        }
    }

    .user-info {
        display: flex;
        align-items: center;
        padding: 10rpx;

        .user-avatar {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin-right: 20rpx;
            border: 3rpx solid #fff;
            box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);
        }

        .user-name {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            background: linear-gradient(90deg, #333, #666);
            -webkit-background-clip: text;
            color: transparent;
        }
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-150%) rotate(30deg);
    }

    100% {
        transform: translateX(150%) rotate(30deg);
    }
}

@keyframes heartBeat {
    0% {
        transform: scale(1);
    }

    25% {
        transform: scale(1.4);
    }

    50% {
        transform: scale(1);
    }

    75% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

.detail-content {
    margin: 20rpx;
    padding: 30rpx;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20rpx;
    box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.248);
    backdrop-filter: blur(5rpx);
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.6);

    &::before {
        content: '';
        position: absolute;
        top: 5%;
        left: 5%;
        width: 90%;
        height: 90%;
        border-radius: 20rpx;
        box-shadow: inset 0 0 30rpx rgba(52, 148, 230, 0.05);
        pointer-events: none;
    }

    .section-heading {
        font-size: 36rpx;
        font-weight: 600;
        margin-bottom: 30rpx;
        color: #333;
        position: relative;
        display: inline-block;
        padding-bottom: 10rpx;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60rpx;
            height: 4rpx;
            background: linear-gradient(90deg, #3494E6, #EC6EAD);
            border-radius: 4rpx;
            transition: width 0.3s ease;
        }

        &:active::after {
            width: 100%;
        }
    }

    .detail-item {
        margin-bottom: 30rpx;
        transition: transform 0.3s ease;

        &:active {
            transform: translateX(5rpx);
        }

        .item-label {
            font-size: 30rpx;
            color: #555;
            margin-right: 10rpx;
            position: relative;
            display: inline-block;
            font-weight: 500;
            margin-bottom: 15rpx;

            &::after {
                content: '';
                position: absolute;
                bottom: -5rpx;
                left: 0;
                width: 100%;
                height: 3rpx;
                background: linear-gradient(90deg, #3494E6, transparent);
            }
        }

        .item-value0 {
            font-size: 32rpx;
            color: #333;
            font-weight: 500;
            line-height: 1.6;
            display: block;
            padding: 25rpx;
            border-left: 8rpx solid #3494E6;
            margin: 15rpx 0;
            background-color: rgba(52, 148, 230, 0.05);
            border-radius: 15rpx;
            box-shadow: inset 0 0 10rpx rgba(52, 148, 230, 0.1);
        }

        .location-wrapper {
            display: flex;
            align-items: center;
            background: linear-gradient(90deg, rgba(52, 148, 230, 0.1), rgba(236, 110, 173, 0.05));
            padding: 15rpx 20rpx;
            border-radius: 50rpx;

            .mini-icon {
                width: 32rpx;
                height: 32rpx;
                margin-right: 10rpx;
            }
        }

        .item-value1 {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
        }
    }

    .content-box {
        position: relative;
        border-radius: 15rpx;
        transition: all 0.3s ease;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(52, 148, 230, 0.05), rgba(236, 110, 173, 0.05));
            z-index: -1;
            opacity: 0.5;
        }

        &::after {
            content: '';
            position: absolute;
            top: -10rpx;
            right: -10rpx;
            width: 80rpx;
            height: 80rpx;
            background-size: contain;
            background-repeat: no-repeat;
            opacity: 0.2;
            z-index: 1;
        }
    }

    .location-box {
        margin-top: 40rpx;
    }

    .detail-info {
        display: flex;
        justify-content: space-between;
        padding: 40rpx 0 20rpx;
        border-top: 2rpx dashed rgba(52, 148, 230, 0.3);
        margin-top: 30rpx;
        position: relative;

        .info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 25rpx 20rpx;
            border-radius: 15rpx;
            width: 30%;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(52, 148, 230, 0.1), rgba(236, 110, 173, 0.05));
                z-index: -1;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            &:active {
                transform: translateY(-8rpx);
                box-shadow: 0 8rpx 15rpx rgba(0, 0, 0, 0.1);

                &::before {
                    opacity: 1;
                }
            }

            .info-icon {
                width: 60rpx;
                height: 60rpx;
                margin-bottom: 15rpx;
                transition: transform 0.3s ease;
            }

            &:active .info-icon {
                transform: scale(1.1);
            }

            text {
                font-size: 28rpx;
                color: #444;
                font-weight: 500;
            }
        }

        .price-item {
            background: linear-gradient(135deg, rgba(52, 148, 230, 0.08), rgba(52, 148, 230, 0.15));
            box-shadow: 0 5rpx 15rpx rgba(52, 148, 230, 0.1);
        }

        .person-item {
            background: linear-gradient(135deg, rgba(236, 110, 173, 0.08), rgba(236, 110, 173, 0.15));
            box-shadow: 0 5rpx 15rpx rgba(236, 110, 173, 0.1);
        }

        .time-item {
            background: linear-gradient(135deg, rgba(122, 204, 117, 0.08), rgba(122, 204, 117, 0.15));
            box-shadow: 0 5rpx 15rpx rgba(122, 204, 117, 0.1);
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
    background-color: rgba(255, 255, 255, 0.95);
    border-top: 1rpx solid #eee;
    backdrop-filter: blur(10rpx);

    .action-btn {
        flex: 1;
        margin: 0 10rpx;
        background: linear-gradient(135deg, #3494E6, #EC6EAD);
        color: #fff;
        font-size: 28rpx;
        padding: 15rpx 0;
        border-radius: 50rpx;
        box-shadow: 0 5rpx 15rpx rgba(52, 148, 230, 0.3);
        transition: all 0.3s ease;

        &:active {
            transform: scale(0.98);
            box-shadow: 0 2rpx 8rpx rgba(52, 148, 230, 0.2);
        }
    }
}
</style>