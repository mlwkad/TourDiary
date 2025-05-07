<template>
    <view class="detail-container">
        <!-- 轮播图展示pictures和videos -->
        <swiper class="detail-swiper" v-if="(info.pictures.length > 0) && (info.videos.length === 0)" indicator-dots
            :indicator-active-color="'#3494E6'" :indicator-color="'rgba(255,255,255,0.5)'" :interval="3000"
            :duration="500" circular>
            <swiper-item v-for="(item, index) in info.pictures" :key="'pic-' + index">
                <image class="swiper-image" :src="item" @click="previewImage(info.pictures, index)" mode="aspectFill">
                </image>
            </swiper-item>
        </swiper>
        <swiper class="detail-swiper" v-else indicator-dots :indicator-active-color="'#3494E6'"
            :indicator-color="'rgba(255,255,255,0.5)'" :interval="3000" :duration="500" circular>
            <swiper-item v-for="(item, index) in info.videos" :key="'vid-' + index">
                <video class="swiper-video" :src="item" :poster="info.cover" controls show-fullscreen-btn
                    show-center-play-btn picture-in-picture-mode="push" show-picture-in-picture-btn
                    :id="'video-' + index" enable-auto-rotation @error="videoError">
                </video>
            </swiper-item>
            <swiper-item v-for="(item, index) in info.pictures" :key="'pic-' + index">
                <image class="swiper-image" :src="item" @click="previewImage(info.pictures, index)" mode="aspectFill">
                </image>
            </swiper-item>
        </swiper>
        <view class="detail-top">
            <!-- 标题部分 -->
            <view class="detail-title">
                <text class="animated-text">{{ info.title }}</text>
                <view class="action-buttons">
                    <view class="detail-liked" @click="liked">
                        <text class="like-text">收藏</text>
                        <text class="like-icon" :style="{ color: isLiked ? 'red' : 'white' }">♥</text>
                    </view>
                    <!-- <view class="detail-share" @click="shareContent">
                        <text class="share-text">分享</text>
                        <text class="share-icon">↗</text>
                    </view> -->
                </view>
            </view>
        </view>

        <!-- 发布者信息部分 -->
        <view class="publisher-container">
            <view class="publisher-info">
                <image class="user-avatar" src="/static/666.jpg" mode="aspectFill" @click="goUserPages"></image>
                <view class="user-details">
                    <text class="user-name" @click="goUserPages">{{ info.userName }}</text>
                    <text class="publish-time" @click="goUserPages">发布于 {{ info.createdAt.slice(0, 10) }}</text>
                </view>
                <view class="follow-btn" @click="followPublisher" v-if="!isFollow">
                    <text>关注</text>
                    <image src="/static/public/no-follow.png" style="width: 35rpx;height: 35rpx;padding: 13rpx 5rpx;">
                    </image>
                </view>
                <view class="follow-btn" @click="followPublisher" v-else>
                    <text>已关注</text>
                    <image src="/static/public/followed.png" style="width: 35rpx;height: 35rpx;padding: 13rpx 5rpx;">
                    </image>
                </view>
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
                    <text>{{ info.playTime }}天</text>
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
import { ref, reactive, defineExpose } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { addLiked, getUserInfo, follow, unfollow, removeLiked } from '../../api/api';

const isLiked = ref<boolean>(false)
const isFollow = ref<boolean>(false)

// 初始化info对象
const info = ref({
    avatar: "",
    content: "",
    createdAt: "0000-00-00",
    id: 0,
    location: "",
    money: "",
    personNum: 0,
    pictures: ["/static/555.jpg", ".jpg"],
    playTime: 0,
    releaseID: "release0",
    title: "",
    updatedAt: "0000-00-00",
    userID: "",
    userName: "testuser0",
    videos: []
});

const liked = async () => {
    const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
    try {
        if (!isLiked.value) {
            await addLiked(userId, info.value.releaseID).then(res => {
                uni.showToast({
                    title: '收藏成功',
                    icon: 'none'
                })
            })
        } else {
            await removeLiked(userId, info.value.releaseID).then(res => {
                uni.showToast({
                    title: '取消收藏',
                    icon: 'none'
                })
            })
        }
        getUserInfo(userId).then(res => {
            isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID)
            // isFollow.value = res.follow.includes(info.value.userID)
        })
    } catch (e) { console.log(e) }
}

// 用户详情页
const goUserPages = () => {
    uni.navigateTo({
        url: `/pages/follow/works?userID=${info.value.userID}`
    })
}

// 分享功能
const shareContent = () => {
    // #ifdef MP-WEIXIN
    uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    });
    // #endif

    // 显示分享成功的提示
    uni.showToast({
        title: '分享成功',
        icon: 'success',
        duration: 2000
    });
}

// 暴露微信小程序所需的分享方法,因为设置了setup
defineExpose({
    // 分享给好友
    onShareAppMessage() {  // 生命周期,右上角分享时自动触发
        return {
            title: '旅游日记分享',
            path: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info.value))}`,
            imageUrl: info.value.pictures[0] || '/static/public/555.jpg'
        };
    },
    // 分享到朋友圈
    onShareTimeline() {
        return {
            title: '旅游日记分享',
            // 默认自带本页路径,只需写查询参数
            query: `info=${encodeURIComponent(JSON.stringify(info.value))}`,
            imageUrl: info.value.pictures[0] || '/static/public/555.jpg'
        };
    }
});

// 关注发布者功能
const followPublisher = () => {
    const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
    if (!isFollow.value) {
        uni.showModal({
            title: '关注提示',
            content: `确定要关注"${info.value.userName}"吗？`,
            success: async (res) => {
                if (res.confirm) {
                    await follow(userId, { followUserID: info.value.userID }).then(res => {
                        uni.showToast({
                            title: '关注成功',
                            icon: 'none'
                        })
                    })
                    getUserInfo(userId).then(res => {
                        isFollow.value = res.follow.includes(info.value.userID)
                    })
                }
            }
        })
    } else {
        uni.showModal({
            title: '取关提示',
            content: `确定要取消关注"${info.value.userName}"吗？`,
            success: async (res) => {
                if (res.confirm) {
                    await unfollow(userId, info.value.userID).then(res => {
                        uni.showToast({
                            title: '已取消关注',
                            icon: 'none'
                        })
                    })
                    getUserInfo(userId).then(res => {
                        isFollow.value = res.follow.includes(info.value.userID)
                    })
                }
            }
        })
    }
}

const previewImage = (images: string[], current: number) => {
    uni.previewImage({
        urls: images,  // [url1,url2] 图片地址数组  
        current: images[current]  // 当前显示的图片索引
    })
}

// 视频播放错误处理
const videoError = (e) => {
    console.error('视频播放错误:', e.detail)
    uni.showToast({
        title: '视频播放失败',
        icon: 'none'
    })
}

// 进入画中画模式的回调
const onEnterPIP = (e) => {
    // console.log('进入小窗播放模式', e)
    // uni.showToast({
    //     title: '已进入小窗播放',
    //     icon: 'none'
    // })
}

// 退出画中画模式的回调
const onLeavePIP = (e) => {
    console.log('退出小窗播放模式', e)
}

onLoad(async (options) => {
    try {
        if (options.info) {
            const decodedInfo = JSON.parse(decodeURIComponent(options.info))
            info.value = decodedInfo
            console.log(info.value)
        }
        // 获取收藏列表
        if (info.value.userID) {
            const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
            getUserInfo(userId).then(res => {
                isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID)
                isFollow.value = res.follow.includes(info.value.userID)
            })
        }
    } catch (e) {
        console.log(e)
    }
})

onShow(() => {  // 不接收参数
    try {
        // 获取收藏列表
        if (info.value.userID) {
            const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
            getUserInfo(userId).then(res => {
                isLiked.value = JSON.parse(res.liked).includes(info.value.releaseID)
                isFollow.value = res.follow.includes(info.value.userID)
            })
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
        justify-content: space-between;
        width: 100%;

        .animated-text {
            position: relative;
            display: inline-block;
            background: linear-gradient(90deg, #3494E6, #EC6EAD);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 40rpx;
            font-weight: bold;
            max-width: 55%;

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

        .action-buttons {
            display: flex;
            gap: 15rpx;
        }

        .detail-liked,
        .detail-share {
            white-space: nowrap;
            padding: 10rpx 20rpx;
            font-size: 30rpx;
            font-weight: 500;
            color: white;
            border-radius: 30rpx;
            box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8rpx;

            &:active {
                transform: scale(0.95);
            }
        }

        .detail-liked {
            background: linear-gradient(135deg, #3494E6, #EC6EAD);

            .like-icon {
                font-size: 45rpx;
                transition: transform 0.3s ease;
                color: white;
            }

            &:active .like-icon {
                transform: scale(1.5);
            }
        }

        .detail-share {
            background: linear-gradient(135deg, #3CB371, #20B2AA);

            .share-icon {
                font-size: 37rpx;
                transition: transform 0.3s ease;
                color: white;
            }

            &:active .share-icon {
                transform: translateY(-3rpx) translateX(3rpx);
            }
        }

        .detail-liked .like-icon.liked {
            animation: heartBeat 1s ease;
            color: #ff496e;
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
    backdrop-filter: none;
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
        transition: none;

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
            color: #000000;
            font-weight: 400;
            line-height: 1.6;
            display: block;
            padding: 25rpx;
            border-left: 8rpx solid #3494E6;
            margin: 15rpx 0;
            background: linear-gradient(90deg, rgba(52, 148, 230, 0.1), rgba(236, 110, 173, 0.05));
            border-radius: 15rpx;
            box-shadow: none;
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
        transition: none;
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
            opacity: 0.2;
        }

        &:active {
            transform: none;
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

.publisher-container {
    margin: 20rpx;
    padding: 20rpx;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20rpx;
    box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.252);
    backdrop-filter: blur(10rpx);
    border: 1px solid rgba(255, 255, 255, 0.6);
    position: relative;
    overflow: hidden;

    .publisher-info {
        display: flex;
        align-items: center;
        position: relative;

        .user-avatar {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            border: 3rpx solid #fff;
            box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);
        }

        .user-details {
            margin-left: 20rpx;
            flex: 1;

            .user-name {
                font-size: 32rpx;
                font-weight: 500;
                background: linear-gradient(90deg, #333, #666);
                -webkit-background-clip: text;
                color: transparent;
                display: block;
                margin-bottom: 8rpx;
            }

            .publish-time {
                font-size: 24rpx;
                color: #999;
            }
        }

        .follow-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8rpx;
            background: linear-gradient(135deg, #4CAF50, #8BC34A);
            color: white;
            padding: 10rpx 25rpx;
            border-radius: 30rpx;
            font-size: 28rpx;
            box-shadow: 0 4rpx 8rpx rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;

            &:active {
                transform: scale(0.95);
                box-shadow: 0 2rpx 5rpx rgba(76, 175, 80, 0.2);
            }

            .follow-icon {
                font-size: 43rpx;
                font-weight: bold;
                transform: translateY(-2rpx);
            }
        }
    }
}
</style>