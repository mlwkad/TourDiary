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

            <textarea class="note-content-input" placeholder="写下你的旅行记录..." v-model="note.content" maxlength="5000"
                auto-height />

            <view class="image-section">
                <view class="image-list">
                    <view class="image-item" v-for="(img, index) in note.images" :key="index">
                        <image class="preview-image" :src="img" mode="aspectFill"></image>
                        <view class="delete-btn" @click="removeImage(index)">
                            <image src="/static/public/close.png" mode="aspectFit"></image>
                        </view>
                    </view>
                    <view class="add-image-btn" @click="chooseImage" v-if="note.images.length < 9">
                        <text>+</text>
                        <text class="add-text">添加图片</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部保存按钮 -->
        <view class="save-button" @click="saveNote">保存笔记</view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { onLoad, onBackPress } from '@dcloudio/uni-app';

// 状态
const isEdit = ref(false);

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

// 处理后退按钮
onBackPress(() => {
    if (note.title || note.content || note.images.length > 0) {
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

    // 设置当前日期
    if (!note.date) {
        const now = new Date();
        note.date = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
    }

    // 这里应该调用API保存笔记
    uni.showLoading({
        title: '保存中'
    });

    setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
            title: '保存成功',
            icon: 'success'
        });

        setTimeout(() => {
            uni.navigateBack();
        }, 1000);
    }, 1000);
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
        count: 9 - note.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            // 这里应该上传图片到服务器，目前直接使用本地路径
            note.images = [...note.images, ...res.tempFilePaths];
        }
    });
};

// 移除图片
const removeImage = (index: number) => {
    note.images.splice(index, 1);
};

onLoad((options) => {
    if (options.id) {
        isEdit.value = true;
        getNoteDetail(options.id);
        uni.setNavigationBarTitle({
            title: '编辑笔记'
        });
    } else {
        uni.setNavigationBarTitle({
            title: '新建笔记'
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

        .note-content-input {
            width: 100%;
            font-size: 30rpx;
            line-height: 1.8;
            min-height: 300rpx;
            padding: 20rpx 0;
            margin-bottom: 30rpx;
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