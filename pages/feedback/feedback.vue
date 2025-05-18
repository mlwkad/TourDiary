<template>
    <view class="feedback-container">
        <view class="feedback-title">意见反馈</view>
        <view class="feedback-desc">有问题请联系我</view>
        <view class="feedback-contact gradient-border">
            <image class="feedback-icon" src="/static/public/email.png"></image>
            <text class="feedback-email colorful">邮箱：3502219532@qq.com</text>
        </view>
        <view class="feedback-contact gradient-border">
            <image class="feedback-icon" src="/static/public/wechat.png" style="width: 40rpx; height: 40rpx;"></image>
            <text class="feedback-email colorful">微信：-170170</text>
        </view>
        <view class="feedback-tip">感谢您的支持与反馈！</view>
    </view>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.feedback-container {
    min-height: 100vh;
    // width: 100vw;
    background: linear-gradient(135deg, #f0f5ff 0%, #e6e6fa 50%, #ffffff 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 30rpx 0 30rpx;

    .feedback-title {
        font-size: 48rpx;
        font-weight: bold;
        margin-top: 100rpx;
        margin-bottom: 40rpx;
        letter-spacing: 2rpx;
        background: linear-gradient(90deg, #3494E6, #EC6EAD);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .feedback-desc {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 30rpx;
    }

    .feedback-contact {
        display: flex;
        align-items: center;
        margin-bottom: 25rpx;
        padding: 18rpx 32rpx;
        border-radius: 18rpx;
        background: #fff;
        box-shadow: 0 4rpx 16rpx rgba(52, 148, 230, 0.08);
        min-width: 320rpx;
        max-width: 90vw;
    }

    .gradient-border {
        border-bottom: 5rpx solid;
        border-image: linear-gradient(90deg, transparent, #3494E6, #EC6EAD, transparent) 1;
    }

    .feedback-tip {
        margin-top: 60rpx;
        font-size: 28rpx;
        color: #EC6EAD;
        letter-spacing: 1rpx;
    }
}

.feedback-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 18rpx;
}

.feedback-email.colorful {
    font-size: 30rpx;
    font-weight: 600;
    width: fit-content;
    background: linear-gradient(90deg, #3494E6, #EC6EAD);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
</style>