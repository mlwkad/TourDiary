<template>
    <view class="note-edit-container">
        <!-- 编辑区域 -->
        <scroll-view scroll-y class="edit-area">
            <input class="note-title-input" placeholder="请输入标题..." v-model="note.title" maxlength="50" />

            <view class="location-selector" @click="chooseLocation">
                <image src="/static/public/search.png" mode="aspectFit"></image>
                <text v-if="note.location">{{ note.location }}</text>
                <text v-else class="placeholder">添加位置</text>
            </view>

            <view class="detail-info">
                <view class="info-item">
                    <image src="/static/public/money.png" class="info-icon"></image>
                    <input class="info-icon-content" v-model="note.money" />元
                </view>

                <view class="info-item">
                    <image src="/static/public/person.png" class="info-icon"></image>
                    <input class="info-icon-content" v-model="note.personNum" />人
                </view>

                <view class="info-item">
                    <image src="/static/public/time.png" class="info-icon"></image>
                    <input class="info-icon-content" v-model="note.playTime" />分钟
                </view>
            </view>

            <view class="note-content-input">
                <textarea class="note-content-input-content" placeholder="写下你的旅行记录..." v-model="note.content"
                    maxlength="5000" auto-height />
            </view>

            <view class="image-section">
                <view class="image-list">
                    <view class="image-item" v-for="(img, index) in note.pictures" :key="index">
                        <image class="preview-image" :src="img" mode="aspectFill"></image>
                        <view class="delete-btn" @click="removeImage(index)">
                            <image src="/static/public/close.png" mode="aspectFit"></image>
                        </view>
                    </view>
                    <view class="add-image-btn" @click="chooseImage" v-if="note.pictures.length < 9">
                        <text>+</text>
                        <text class="add-text">添加图片</text>
                    </view>
                </view>
            </view>

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
import { ref, reactive } from 'vue';
import { onLoad, onBackPress } from '@dcloudio/uni-app';
import { updateRelease } from '../../api/api';

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
});

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

// 处理后退按钮
onBackPress(() => {
    if (note.title || note.content || note.pictures.length > 0) {
        uni.showModal({
            title: '提示',
            content: '是否放弃此次编辑？',
            success: (res) => {
                if (res.confirm) {
                    uni.navigateBack();
                }
            }
        });
        return true;
    }
    return false;
});

// 保存笔记
const saveNote = () => {
    if (!note.title) {
        uni.showToast({
            title: '请输入标题',
            icon: 'none'
        });
        return;
    }

    if (!note.content) {
        uni.showToast({
            title: '请输入内容',
            icon: 'none'
        });
        return;
    }

    // 这里应该调用API保存笔记
    uni.showLoading({
        title: '保存中'
    });

    updateRelease(note.id, note).then(res => {
        uni.hideLoading();
        uni.showToast({
            title: '保存成功',
            icon: 'success'
        });

        setTimeout(() => {
            uni.navigateBack();
        }, 1000);
    }).catch(e => {
        uni.hideLoading();
        uni.showToast({
            title: '保存失败',
            icon: 'error'
        });
    });
};

// 选择位置
const chooseLocation = () => {
    uni.chooseLocation({
        success: (res) => {
            note.location = res.name || res.address;
        },
        fail: (err) => {
            // 用户取消或发生错误
            console.error('选择位置失败', err);
        }
    });
};

// 选择图片
const chooseImage = () => {
    uni.chooseImage({
        count: 9 - note.pictures.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            // 这里应该上传图片到服务器，目前直接使用本地路径
            note.pictures = [...note.pictures, ...res.tempFilePaths];
        }
    });
};

// 移除图片
const removeImage = (index: number) => {
    note.pictures.splice(index, 1);
};

// 选择视频
const chooseVideo = () => {
    uni.chooseVideo({
        count: 1,
        sourceType: ['album', 'camera'],
        success: (res) => {
            // 这里应该上传视频到服务器，目前直接使用本地路径
            note.videos = [res.tempFilePath];
        }
    });
};

// 移除视频
const removeVideo = () => {
    note.videos = [];
};

// 选择视频封面
const chooseVideoCover = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            // 这里应该上传视频封面到服务器，目前直接使用本地路径
            note.cover = res.tempFilePaths[0];
        }
    });
};

// 移除视频封面
const removeCover = () => {
    note.cover = '';
};

onLoad((options) => {
    if (options.info) {
        const info = JSON.parse(decodeURIComponent(options.info));
        getNoteDetail(info);
        uni.setNavigationBarTitle({
            title: '编辑笔记'
        });
    }
});
</script>

<style lang="scss" scoped>
.note-edit-container {
    width: 100%;
    min-height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 120rpx;

    .edit-area {
        flex: 1;
        padding: 30rpx;
        margin-left: 5rpx;
        width: 98%;

        .note-title-input {
            font-size: 36rpx;
            font-weight: bold;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f0f0f0;
            margin-bottom: 20rpx;
        }

        .location-selector {
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f0f0f0;
            margin-bottom: 20rpx;

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
            width: 90%;
            gap: 15rpx;
            border-bottom: 1rpx solid #eee;

            .info-item {
                display: flex;
                align-items: center;
                margin-top: 15rpx;

                .info-icon {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 10rpx;

                    &-content {
                        border-bottom: 1rpx solid grey;
                        width: 150rpx;
                        padding: 0 15rpx;
                    }
                }
            }
        }

        .note-content-input {
            width: 90%;
            font-size: 30rpx;
            line-height: 1.8;
            min-height: 300rpx;
            padding: 20rpx 0;
            margin-bottom: 20rpx;

            &-content {
                width: 100%;
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
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        image {
                            width: 24rpx;
                            height: 24rpx;
                        }
                    }
                }

                .add-image-btn {
                    width: 210rpx;
                    height: 210rpx;
                    border: 1rpx dashed #ddd;
                    border-radius: 8rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    text {
                        font-size: 50rpx;
                        color: #ddd;
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
                position: relative;
                margin-bottom: 20rpx;

                .preview-video {
                    width: 100%;
                    height: 210rpx;
                    border-radius: 8rpx;
                }

                .delete-btn {
                    position: absolute;
                    top: -10rpx;
                    right: -10rpx;
                    width: 40rpx;
                    height: 40rpx;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;

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
                }

                .cover-container {
                    display: flex;
                    align-items: center;
                    gap: 20rpx;

                    .cover-preview-wrapper {
                        position: relative;
                        width: 210rpx;
                        height: 210rpx;
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
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        image {
                            width: 24rpx;
                            height: 24rpx;
                        }
                    }

                    .add-cover-btn {
                        width: 210rpx;
                        height: 210rpx;
                        border: 1rpx dashed #ddd;
                        border-radius: 8rpx;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        text {
                            font-size: 50rpx;
                            color: #ddd;
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
            border: 1rpx dashed #ddd;
            border-radius: 8rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .add-icon {
                font-size: 50rpx;
                color: #ddd;
                line-height: 1;
                margin-bottom: 10rpx;
            }

            .add-text {
                font-size: 28rpx;
            }
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
        background: linear-gradient(to right, #4bb0ff, #61e4ff);
        color: #fff;
        font-size: 32rpx;
        font-weight: bold;
        z-index: 10;
    }
}
</style>