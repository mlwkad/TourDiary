<template>
    <view class="detail-container">
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
                <video class="swiper-video" :src="item" :poster="info.cover" controls direction :id="'video-' + index"
                    show-fullscreen-btn show-center-play-btn @fullscreenchange="fullScreen" @error="videoError">
                </video>
            </swiper-item>
            <swiper-item v-for="(item, index) in info.pictures" :key="'pic-' + index">
                <image class="swiper-image" :src="item" @click="previewImage(info.pictures, index)" mode="aspectFill">
                </image>
            </swiper-item>
        </swiper>
        <view class="detail-top">
            <view class="detail-title">
                <text class="animated-text">{{ info.title }}</text>
                <view class="action-buttons">
                    <view class="detail-liked" @click="liked">
                        <text class="like-text">收藏</text>
                        <text class="like-icon" :style="{ color: isLiked ? 'red' : 'white' }">♥</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="publisher-container">
            <view class="publisher-info">
                <image class="user-avatar" :src="info.avatar" mode="aspectFill" @click="goUserPages"></image>
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
        <view class="detail-content">
            <view class="section-heading">旅行详情</view>
            <view class="detail-item content-box">
                <text class="item-value0">{{ info.content }}</text>
            </view>
            <view class="detail-item location-box">
                <text class="item-label">旅游地点</text>
                <view class="location-wrapper">
                    <view class="location-wrapper-title">
                        <image src="/static/public/location.png" class="mini-icon"></image>
                        <text class="item-value1">{{ info.location }}</text>
                    </view>
                    <view class="wantGo" @click="isShowWantLocation = true">
                        想去
                        <image src="/static/public/wantGo.png"></image>
                    </view>
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
    </view>
    <view class="detail-float" v-if="isShowWantLocation">
        <view class="detail-float-item">
            <view class="detail-float-item-option" style="font-weight: 600;font-size: 30rpx;">
                旅游规划
                <image src="/static/public/copy.png" v-if="XunFeiRes.length > 0" @click="copyRes"></image>
                <image src="/static/public/delete.png" v-if="XunFeiRes.length > 0" @click="delRes"></image>
            </view>
            <image src="/static/public/close.png" @click="isShowWantLocation = false">
            </image>
        </view>
        <view class="detail-float-choose" v-if="XunFeiRes.length === 0">
            <view class="detail-float-choose-item" v-for="item in chatChoose" :key="item.id" :style="{
                background: selectedChoose.find((ele: number) => ele === item.id) ? '#FFA07A' : '#b6b6b635',
                color: selectedChoose.find((ele: number) => ele === item.id) ? 'white' : '#999'
            }" @click="chooseSelect(item.id)">
                <image :src='selectedChoose.find((ele: number) => ele === item.id) ? item.selectedImage : item.image'>
                </image>
                {{ item.title }}
            </view>
        </view>
        <view class="detail-float-input" v-if="XunFeiRes.length === 0">
            我也想去
            <input v-model="wantGoInput">
            <view class="detail-float-input-go" @click="getRes">{{ interval ? '加载中' : 'GO' }}</view>
        </view>
        <view v-else class="detail-float-res">
            <view class="detail-float-res-content">{{ daziji }}</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { addLiked, getUserInfo, follow, unfollow, removeLiked } from '../../api/api';
import { streamChat } from '../../api/ws';

const isLiked = ref<boolean>(false)
const isFollow = ref<boolean>(false)

const isShowWantLocation = ref<boolean>(false)
const wantGoInput = ref<any>('')  // onLoad里赋值
const XunFeiRes = ref<string>('')
const daziji = ref<string>('')
const interval = ref<any>(null)
const isDone = ref<boolean>(true)

const selectedChoose = ref([])

// 初始化info对象
const info = ref({
    avatar: "",
    content: "",
    createdAt: "0000-00-00",
    id: 0,
    location: "",
    money: "",
    personNum: 0,
    pictures: [""],
    playTime: 0,
    releaseID: "release0",
    title: "",
    updatedAt: "0000-00-00",
    userID: "",
    userName: "testuser0",
    videos: []
})

const chatChoose = ref([
    { id: 1, title: '附近景点', image: '/static/public/build.png', selectedImage: '/static/public/build-white.png' },
    { id: 2, title: '附近美食', image: '/static/public/food.png', selectedImage: '/static/public/food-white.png' },
    { id: 3, title: '经济旅游', image: '/static/public/sale.png', selectedImage: '/static/public/sale-white.png' },
    { id: 4, title: '自驾旅游', image: '/static/public/jeepCar.png', selectedImage: '/static/public/jeepCar-white.png' },
    { id: 5, title: '特色住宿', image: '/static/public/hotal.png', selectedImage: '/static/public/hotal-white.png' },
    { id: 6, title: '购物攻略', image: '/static/public/shopping.png', selectedImage: '/static/public/shopping-white.png' }
])

const chooseSelect = (id: number) => {
    let storedId = selectedChoose.value.indexOf(id)
    if (storedId !== -1) {
        selectedChoose.value.splice(storedId, 1)
    } else {
        selectedChoose.value.push(id)
    }
}

const getRes = () => {
    const allChoose = chatChoose.value.filter(item => selectedChoose.value.includes(item.id))
    let allChooseTitle = ''
    allChoose.forEach((item) => {
        allChooseTitle += (item.title + ',')
    })
    const finalContent = `我想去${wantGoInput.value}游玩,并为我提供${allChooseTitle}的建议,分点明确(一级标题:一,二 二级标题:1,2),不要出现*#等特殊符号`
    isDone.value = false
    turnDaziji()
    streamChat(finalContent, (update) => {
        if (update.type === 'update') {
            XunFeiRes.value += update.content
        } else if (update.type === 'error') {
            console.log(update.error)
        } else if (update.type === 'done' || 'end') {
            isDone.value = true
        }
    })
}

const turnDaziji = () => {
    let index = 0
    const typeNextChar = () => {
        if (XunFeiRes.value.length >= index) {
            daziji.value = XunFeiRes.value.slice(0, index)
            index++
            const delay = Math.max(5, 50 - Math.floor(index / 20))
            interval.value = setTimeout(typeNextChar, delay)
        } else {
            if (isDone.value && interval.value) {
                clearTimeout(interval.value)
                interval.value = null
            } else {
                interval.value = setTimeout(typeNextChar, 100)
            }
        }
    }
    typeNextChar()
}

const copyRes = () => {
    uni.setClipboardData({
        data: XunFeiRes.value,
        success: () => {
            uni.showToast({
                title: '复制成功',
                icon: 'none'
            })
        }
    })
}

const delRes = () => {
    XunFeiRes.value = ''
}

const liked = async () => {
    try {
        const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
        if (!isLiked.value) {
            await addLiked(userId, info.value.releaseID)
            uni.showToast({
                title: '收藏成功',
                icon: 'none'
            })
        } else {
            await removeLiked(userId, info.value.releaseID)
            uni.showToast({
                title: '取消收藏',
                icon: 'none'
            })
        }
        const userInfoRes = await getUserInfo(userId)
        isLiked.value = JSON.parse(userInfoRes.liked).includes(info.value.releaseID)
    } catch (e) {
        console.log(e)
        uni.showToast({
            title: '操作失败',
            icon: 'none'
        })
    }
}

// 用户详情页
const goUserPages = () => {
    uni.navigateTo({
        url: `/pages/follow/works?userID=${info.value.userID}`
    })
}

// 因为设置了setup
defineExpose({
    onShareAppMessage() {
        return {
            title: '旅游日记分享',
            path: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info.value))}`,
            imageUrl: info.value.pictures[0] || ''
        }
    },
    onShareTimeline() {
        return {
            title: '旅游日记分享',
            // 默认自带本页路径,只需写查询参数
            query: `info=${encodeURIComponent(JSON.stringify(info.value))}`,
            imageUrl: info.value.pictures[0] || ''
        }
    }
})

const followPublisher = () => {
    const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
    if (!isFollow.value) {
        uni.showModal({
            title: '关注提示',
            content: `确定要关注"${info.value.userName}"吗？`,
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await follow(userId, { followUserID: info.value.userID })
                        uni.showToast({
                            title: '关注成功',
                            icon: 'none'
                        })
                        const userInfoRes = await getUserInfo(userId)
                        isFollow.value = userInfoRes.follow.includes(info.value.userID)
                    } catch (e) {
                        console.log(e)
                        uni.showToast({
                            title: e,
                            icon: 'none'
                        })
                    }
                }
            }
        })
    } else {
        uni.showModal({
            title: '取关提示',
            content: `确定要取消关注"${info.value.userName}"吗？`,
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await unfollow(userId, info.value.userID)
                        uni.showToast({
                            title: '已取消关注',
                            icon: 'none'
                        })
                        const userInfoRes = await getUserInfo(userId)
                        isFollow.value = userInfoRes.follow.includes(info.value.userID)
                    } catch (e) {
                        console.log(e)
                        uni.showToast({
                            title: '操作失败',
                            icon: 'none'
                        })
                    }
                }
            }
        })
    }
}

const previewImage = (images: string[], current: number) => {
    const stringUrls = images.map(img => String(img))
    uni.previewImage({
        urls: stringUrls,  // 地址列表
        current: stringUrls[current],  // 显示第几张
        fail: (e) => {
            console.error('预览失败:', e)
        }
    })
}

const fullScreen = (event) => {
    const isFullScreen = event.detail.fullScreen || event.detail.fullscreen
    const direction = event.detail.direction
    if (isFullScreen) {
        uni.showToast({
            title: `已进入${direction === 'vertical' ? '竖向' : '横向'}全屏模式`,
            icon: 'none',
            duration: 1500
        })
    } else {
        uni.showToast({
            title: '已退出全屏模式',
            icon: 'none',
            duration: 1500
        })
    }
}

const videoError = (e) => {
    console.error('视频播放错误:', e.detail)
    uni.showToast({
        title: '视频播放失败',
        icon: 'none'
    })
}

onLoad(async (options) => {
    try {
        if (options.info) {
            const decodedInfo = JSON.parse(decodeURIComponent(options.info))
            info.value = decodedInfo
        }
        wantGoInput.value = info.value.location
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
            justify-content: space-between;
            background: linear-gradient(90deg, rgba(52, 148, 230, 0.1), rgba(236, 110, 173, 0.05));
            padding: 15rpx 20rpx;
            border-radius: 50rpx;

            .location-wrapper-title {
                display: flex;
                align-items: center;

                .mini-icon {
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 10rpx;
                }

                .item-value1 {
                    font-size: 28rpx;
                    color: #333;
                    font-weight: 500;
                }
            }

            .wantGo {
                background: linear-gradient(90deg, #3494E6, #EC6EAD);
                margin-left: 45rpx;
                border-radius: 24rpx;
                padding: 12rpx 16rpx 15rpx;
                color: white;
                white-space: nowrap;

                image {
                    height: 35rpx;
                    width: 35rpx;
                    transform: translateY(10rpx);
                }
            }
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
                background-clip: text;
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

.detail-float {
    overflow-y: auto;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: fit-content;
    min-height: 30%;
    max-height: 85%;
    background-color: #ffffff;
    border-radius: 28rpx 28rpx 0 0;
    z-index: 99999;
    animation: toTop 0.3s ease-in-out forwards;
    padding-bottom: 45rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.15);

    @keyframes toTop {
        0% {
            transform: translateY(50%);
            opacity: 0;
        }

        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .detail-float-item {
        width: 92%;
        height: 110rpx;
        border-radius: 10rpx;
        padding: 0 30rpx;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

        image {
            width: 36rpx;
            height: 36rpx;
            padding: 12rpx;
        }

        .detail-float-item-option {
            display: flex;
            align-items: center;
            gap: 35rpx;
            color: #333;

            image {
                margin-left: 35rpx;
                border-radius: 50%;
                width: 40rpx;
                height: 40rpx;
                background-color: rgba(52, 148, 230, 0.1);
                padding: 8rpx;
            }
        }
    }

    .detail-float-choose {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20rpx 24rpx;
        gap: 15rpx;

        .detail-float-choose-item {
            width: fit-content;
            height: fit-content;
            border-radius: 24rpx;
            color: #999;
            white-space: nowrap;
            padding: 18rpx 25rpx;
            margin-bottom: 25rpx;
            transition: all 0.3s ease-in-out;
            font-weight: 600;
            font-size: 28rpx;
            border: 2rpx solid rgba(128, 128, 128, 0.2);
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

            image {
                width: 32rpx;
                height: 32rpx;
                margin-right: 12rpx;
                transform: translateY(4rpx);
            }
        }
    }

    .detail-float-input {
        padding: 20rpx 30rpx;
        display: flex;
        align-items: center;
        gap: 15rpx;
        font-size: 30rpx;
        font-weight: 600;
        color: #333;

        .detail-float-input-go {
            background: linear-gradient(135deg, #3494E6, #EC6EAD);
            color: #fff;
            font-size: 28rpx;
            padding: 20rpx 30rpx;
            border-radius: 50rpx;
            box-shadow: 0 5rpx 15rpx rgba(52, 148, 230, 0.2);
            font-weight: bold;
        }

        input {
            flex: 1;
            padding: 15rpx;
            border-radius: 10rpx;
            background-color: rgba(0, 0, 0, 0.03);
            border: 1rpx solid rgba(128, 128, 128, 0.2);
        }
    }

    .detail-float-res {
        font-size: 30rpx;
        font-weight: 600;
        padding: 10rpx 30rpx;

        .detail-float-res-content {
            border-top: rgba(128, 128, 128, 0.2) 2rpx solid;
            padding: 25rpx 15rpx;
            margin-top: 12rpx;
            line-height: 1.6;
            font-weight: 400;
            white-space: pre-wrap; // 保留空格 换行 - 自动换行
            color: #333;
            background-color: rgba(52, 148, 230, 0.05);
            border-radius: 12rpx;
        }
    }
}
</style>