<template>
    <view class="note-edit-container">
        <!-- 编辑区域 -->
        <scroll-view scroll-y class="edit-area">
            <input class="note-title-input" placeholder="请输入标题..." v-model="note.title" maxlength="50"
                @input="errors.title = ''" />
            <view class="error-text" v-if="errors.title">{{ errors.title }}</view>
            <view class="location-selector" @click="chooseLocation">
                <image src="/static/public/search.png" mode="aspectFit"></image>
                <text v-if="note.location">{{ note.location }}</text>
                <text v-else class="placeholder">添加位置</text>
            </view>
            <view class="error-text" v-if="errors.location">{{ errors.location }}</view>
            <view class="detail-info">
                <view class="info-item">
                    <image src="/static/public/money.png" class="info-icon"></image>
                    <input class="info-icon-content" v-model="note.money" @input="errors.money = ''" />元
                </view>
                <view class="info-item">
                    <image src="/static/public/person.png" class="info-icon"></image>
                    <input class="info-icon-content" v-model="note.personNum" @input="errors.personNum = ''" />人
                </view>
                <view class="info-item">
                    <image src="/static/public/time.png" class="info-icon"></image>
                    <input class="info-icon-content" v-model="note.playTime" @input="errors.playTime = ''" />分钟
                </view>
            </view>
            <view class="detail-errors">
                <view class="error-text" v-if="errors.money">费用: {{ errors.money }}</view>
                <view class="error-text" v-if="errors.personNum">人数: {{ errors.personNum }}</view>
                <view class="error-text" v-if="errors.playTime">时间: {{ errors.playTime }}</view>
            </view>
            <view class="note-content-input">
                <textarea class="note-content-input-content" placeholder="写下你的旅行记录..." v-model="note.content"
                    maxlength="5000" auto-height @input="errors.content = ''" />
            </view>
            <view class="error-text" v-if="errors.content">{{ errors.content }}</view>
            <view class="image-section">
                <view class="image-list">
                    <view class="image-item" v-for="(img, index) in note.pictures" :key="index">
                        <image class="preview-image" :src="img" mode="aspectFill"></image>
                        <view class="delete-btn" @click="removeImage(index)">
                            <view style="color: white;">×</view>
                            <!-- <image src="/static/public/close.png" mode="aspectFit"></image> -->
                        </view>
                    </view>
                    <view class="add-image-btn" @click="chooseImage" v-if="note.pictures.length < 9">
                        <text>+</text>
                        <text class="add-text">添加图片</text>
                    </view>
                </view>
            </view>
            <view class="error-text" v-if="errors.pictures">{{ errors.pictures }}</view>
            <view class="video-section" v-if="note.videos && note.videos.length > 0">
                <view class="video-container">
                    <video class="preview-video" :src="note.videos[0]" controls></video>
                    <view class="delete-btn" @click="removeVideo">
                        <image src="/static/public/close.png" mode="aspectFit"></image>
                    </view>
                </view>
                <view class="video-cover-section">
                    <text class="section-title">视频封面</text>
                    <view class="cover-container">
                        <view class="cover-preview-wrapper" v-if="note.cover">
                            <image class="cover-preview" :src="note.cover" mode="aspectFill"></image>
                            <view class="delete-btn" @click="removeCover">
                                <image src="/static/public/close.png" mode="aspectFit"></image>
                            </view>
                        </view>
                        <view class="add-cover-btn" @click="chooseVideoCover" v-if="!note.cover">
                            <text>+</text>
                            <text style="font-size:28rpx;">添加封面</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="add-video-btn" @click="chooseVideo" v-if="!note.videos || note.videos.length === 0">
                <text class="add-icon">+</text>
                <text class="add-text" style="color: grey;">添加视频</text>
            </view>
        </scroll-view>
        <!-- 底部保存按钮 -->
        <view class="save-button" @click="saveNote">保存笔记</view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onBackPress } from '@dcloudio/uni-app'
import { updateRelease } from '../../api/api'
import { validateTitle, validateContent, validateLocation } from '../../utils/filter'

// 笔记数据
const note = reactive({
    id: '',
    title: '',
    content: '',
    location: '',
    createdAt: '',
    playTime: '',
    money: '',
    personNum: '',
    pictures: [] as string[],
    videos: [] as string[],
    cover: ''
})

// 错误信息
const errors = reactive({
    title: '',
    content: '',
    location: '',
    playTime: '',
    money: '',
    personNum: '',
    pictures: ''
})

// 清除所有错误信息
const clearErrors = () => {
    for (let key in errors) {
        errors[key] = ''
    }
}

// 获取笔记详情
const getNoteDetail = (info: any) => {
    // 这里应该是从API获取数据，现在用模拟数据
    Object.assign(note, {
        id: info.releaseID,
        title: info.title,
        content: info.content,
        location: info.location,
        createdAt: info.createdAt,
        pictures: info.pictures,
        playTime: info.playTime,
        money: info.money,
        personNum: info.personNum,
        videos: info.videos,
        cover: info.cover || ''
    })
}

// 验证表单
const validateForm = () => {
    let isValid = true
    // 清除所有错误
    clearErrors()
    // 标题验证
    const titleVal = validateTitle(note.title)
    if (!titleVal.isValid) {
        errors.title = titleVal.message
        isValid = false
    } else {
        // 使用过滤后的文本
        note.title = titleVal.filteredText
    }
    // 内容验证
    const contentVal = validateContent(note.content);
    if (!contentVal.isValid) {
        errors.content = contentVal.message
        isValid = false
    } else {
        note.content = contentVal.filteredText
    }
    // 位置验证
    if (note.location) {
        const locationVal = validateLocation(note.location);
        if (!locationVal.isValid) {
            errors.location = locationVal.message
            isValid = false
        } else {
            note.location = locationVal.filteredText
        }
    }
    // 游玩时间验证
    if (note.playTime && (isNaN(Number(note.playTime)) || Number(note.playTime) <= 0)) {
        errors.playTime = '请输入有效的游玩时间'
        isValid = false
    }
    // 费用验证
    if (note.money && (isNaN(Number(note.money)) || Number(note.money) < 0)) {
        errors.money = '请输入有效的费用金额'
        isValid = false
    }
    // 人数验证
    if (note.personNum && (isNaN(Number(note.personNum)) || Number(note.personNum) <= 0 || !Number.isInteger(Number(note.personNum)))) {
        errors.personNum = '请输入有效的人数'
        isValid = false
    }
    // 图片验证
    if (!note.pictures || note.pictures.length === 0) {
        errors.pictures = '至少上传一张图片'
        isValid = false
    }
    return isValid
}

// 处理后退按钮
onBackPress(() => {
    if (note.title || note.content || note.pictures.length > 0) {
        uni.showModal({
            title: '提示',
            content: '是否放弃此次编辑？',
            success: (res) => {
                if (res.confirm) {
                    uni.navigateBack()
                }
            }
        })
        return true
    }
    return false
})

// 保存笔记
const saveNote = async () => {
    // 使用验证函数验证表单
    if (!validateForm()) {
        return // 如果验证失败，直接返回
    }
    try {
        await updateRelease(note.id, note)
        uni.showToast({
            title: '保存成功',
            icon: 'success'
        })
        setTimeout(() => {
            uni.navigateBack()
        }, 1000)
    } catch (e) {
        console.log(e)
        uni.showToast({
            title: '保存失败',
            icon: 'error'
        })
    }
}

// 选择位置
const chooseLocation = () => {
    uni.chooseLocation({
        success: (res) => {
            note.location = res.name || res.address
            // 清除位置错误信息
            errors.location = ''
        },
        fail: (err) => {
            // 用户取消或发生错误
            console.error('选择位置失败', err)
        }
    })
}

// 选择图片
const chooseImage = () => {
    uni.chooseImage({
        count: 9 - note.pictures.length,  // 还能选几张
        sizeType: ['compressed'],  // 压缩后的图片 或 original:原图
        sourceType: ['album', 'camera'],  // 可以来自相册 相机
        success: (res) => {
            // 这里应该上传图片到服务器，目前直接使用本地路径
            note.pictures = [...note.pictures, ...res.tempFilePaths]
            // 清除图片错误信息
            errors.pictures = ''
        }
    })
}

// 移除图片
const removeImage = (index: number) => {
    note.pictures.splice(index, 1)
}

// 选择视频
const chooseVideo = () => {
    uni.chooseVideo({
        count: 1,
        sourceType: ['album', 'camera'],
        success: (res) => {
            // 这里应该上传视频到服务器，目前直接使用本地路径
            note.videos = [res.tempFilePath]
        }
    })
}

// 移除视频
const removeVideo = () => {
    note.videos = []
}

// 选择视频封面
const chooseVideoCover = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            // 这里应该上传视频封面到服务器，目前直接使用本地路径
            note.cover = res.tempFilePaths[0]
        }
    })
}

// 移除视频封面
const removeCover = () => {
    note.cover = ''
}

onLoad((options) => {
    if (options.info) {
        const info = JSON.parse(decodeURIComponent(options.info))
        getNoteDetail(info)
        uni.setNavigationBarTitle({
            title: '编辑笔记'
        })
    }
})
</script>

<style lang="scss" scoped>
.note-edit-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to bottom, #f0f5ff, #ffffff);
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 120rpx;

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

    .edit-area {
        flex: 1;
        padding: 30rpx;
        margin-left: 5rpx;
        width: 98%;

        .note-title-input {
            font-size: 36rpx;
            font-weight: bold;
            padding: 20rpx 0;
            border-bottom: 1rpx solid rgba(52, 148, 230, 0.2);
            margin-bottom: 20rpx;
            background: linear-gradient(90deg, #3494E6, #555);
            -webkit-background-clip: text;
            background-clip: text;
            color: black;
            text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.1);
        }

        .location-selector {
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid rgba(52, 148, 230, 0.2);
            margin-bottom: 20rpx;
            transition: all 0.3s ease;

            &:active {
                background-color: rgba(52, 148, 230, 0.05);
            }

            image {
                width: 32rpx;
                height: 32rpx;
                margin-right: 10rpx;
            }

            text {
                font-size: 28rpx;
                color: #333;
            }

            .placeholder {
                color: #999;
            }
        }

        .detail-info {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 30rpx 0;
            width: 88%;
            gap: 15rpx;
            border-bottom: 1rpx solid rgba(52, 148, 230, 0.2);
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 15rpx;
            padding: 20rpx;
            margin-bottom: 20rpx;
            box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.05);

            .info-item {
                display: flex;
                align-items: center;
                margin-top: 15rpx;
                background-color: rgba(52, 148, 230, 0.05);
                padding: 10rpx 20rpx;
                border-radius: 30rpx;
                transition: all 0.3s ease;

                &:active {
                    transform: scale(0.95);
                    background-color: rgba(52, 148, 230, 0.1);
                }

                .info-icon {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 10rpx;
                }

                .info-icon-content {
                    border-bottom: 1rpx solid rgba(52, 148, 230, 0.3);
                    width: 150rpx;
                    padding: 0 15rpx;
                    transition: all 0.3s ease;

                    &:focus {
                        border-bottom-color: #3494E6;
                    }
                }
            }
        }

        .note-content-input {
            width: 88%;
            font-size: 30rpx;
            line-height: 1.8;
            min-height: 300rpx;
            padding: 20rpx;
            margin-bottom: 20rpx;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 15rpx;
            box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.05);
            border: 1rpx solid rgba(52, 148, 230, 0.2);

            &-content {
                width: 100%;
                min-height: 200rpx;
            }
        }

        .image-section {
            padding: 20rpx 0;

            .image-list {
                display: flex;
                flex-wrap: wrap;
                gap: 20rpx;

                .image-item {
                    width: 210rpx;
                    height: 210rpx;
                    position: relative;
                    border-radius: 15rpx;
                    // overflow: hidden;
                    box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;

                    &:active {
                        transform: scale(0.95);
                    }

                    .preview-image {
                        width: 100%;
                        height: 100%;
                        border-radius: 8rpx;
                    }

                    .delete-btn {
                        position: absolute;
                        top: -10rpx;
                        right: -10rpx;
                        width: 40rpx;
                        height: 40rpx;
                        background: linear-gradient(135deg, #ff7676, #f54242);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;

                        &:active {
                            transform: scale(0.9);
                        }

                        image {
                            width: 24rpx;
                            height: 24rpx;
                        }
                    }
                }

                .add-image-btn {
                    width: 210rpx;
                    height: 210rpx;
                    border: 2rpx dashed rgba(52, 148, 230, 0.4);
                    border-radius: 15rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(52, 148, 230, 0.05);
                    transition: all 0.3s ease;

                    &:active {
                        background-color: rgba(52, 148, 230, 0.1);
                        transform: scale(0.95);
                    }

                    text {
                        font-size: 50rpx;
                        color: #3494E6;
                        line-height: 1;
                        margin-bottom: 10rpx;
                    }

                    .add-text {
                        font-size: 28rpx;
                    }
                }
            }
        }

        .video-section {
            padding: 20rpx 0;
            width: 210rpx;
            height: 210rpx;

            .video-container {
                height: 100%;
                position: relative;
                margin-bottom: 20rpx;
                border-radius: 15rpx;
                // overflow: hidden;
                box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);

                .preview-video {
                    width: 100%;
                    height: 100%;
                    border-radius: 8rpx;
                }

                .delete-btn {
                    position: absolute;
                    top: -10rpx;
                    right: -10rpx;
                    width: 40rpx;
                    height: 40rpx;
                    background: linear-gradient(135deg, #ff7676, #f54242);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;

                    &:active {
                        transform: scale(0.9);
                    }

                    image {
                        width: 24rpx;
                        height: 24rpx;
                    }
                }
            }

            .video-cover-section {
                padding: 20rpx 0;

                .section-title {
                    font-size: 32rpx;
                    font-weight: bold;
                    margin-bottom: 20rpx;
                    background: linear-gradient(90deg, #3494E6, #3494E6);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .cover-container {
                    display: flex;
                    align-items: center;
                    gap: 20rpx;

                    .cover-preview-wrapper {
                        position: relative;
                        width: 210rpx;
                        height: 210rpx;
                        border-radius: 15rpx;
                        // overflow: hidden;
                        box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);
                    }

                    .cover-preview {
                        width: 210rpx;
                        height: 210rpx;
                        border-radius: 8rpx;
                    }

                    .delete-btn {
                        position: absolute;
                        top: -10rpx;
                        right: -10rpx;
                        width: 40rpx;
                        height: 40rpx;
                        background: linear-gradient(135deg, #ff7676, #f54242);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;

                        &:active {
                            transform: scale(0.9);
                        }

                        image {
                            width: 24rpx;
                            height: 24rpx;
                        }
                    }

                    .add-cover-btn {
                        width: 210rpx;
                        height: 210rpx;
                        border: 2rpx dashed rgba(52, 148, 230, 0.4);
                        border-radius: 15rpx;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background-color: rgba(52, 148, 230, 0.05);
                        transition: all 0.3s ease;

                        &:active {
                            background-color: rgba(52, 148, 230, 0.1);
                            transform: scale(0.95);
                        }

                        text {
                            font-size: 50rpx;
                            color: #3494E6;
                            line-height: 1;
                            margin-bottom: 10rpx;
                        }

                        .add-text {
                            font-size: 28rpx;
                        }
                    }
                }
            }
        }

        .add-video-btn {
            width: 210rpx;
            height: 210rpx;
            border: 2rpx dashed rgba(52, 148, 230, 0.4);
            border-radius: 15rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: rgba(52, 148, 230, 0.05);
            transition: all 0.3s ease;

            &:active {
                background-color: rgba(52, 148, 230, 0.1);
                transform: scale(0.95);
            }

            .add-icon {
                font-size: 50rpx;
                color: #3494E6;
                line-height: 1;
                margin-bottom: 10rpx;
            }

            .add-text {
                font-size: 28rpx;
            }
        }

        .detail-errors {
            display: flex;
            flex-direction: column;
            margin: 0 0 16rpx 0;
            width: 88%;
        }

        .error-text {
            color: #EC6EAD;
            font-size: 24rpx;
            margin: 8rpx 0 8rpx 0;
            background-color: rgba(236, 110, 173, 0.1);
            padding: 8rpx 16rpx;
            border-radius: 10rpx;
            display: block;
            width: fit-content;
            max-width: 90%;
            word-break: break-all;
        }
    }

    .save-button {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(to right, #3494E6, #EC6EAD);
        color: #fff;
        font-size: 32rpx;
        font-weight: bold;
        z-index: 10;
        box-shadow: 0 -5rpx 15rpx rgba(52, 148, 230, 0.2);
        transition: all 0.3s ease;

        &:active {
            transform: scale(0.98);
            box-shadow: 0 -3rpx 10rpx rgba(52, 148, 230, 0.1);
        }
    }
}
</style>