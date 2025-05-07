<template>
    <view class="status-inputs">
        状态:<input v-model="state" style="border: 1rpx solid;width:50%" />
        原因:<input v-model="reason" style="border: 1rpx solid;width:50%" />
    </view>
    <view class="notes-container">
        <!-- 内容区域 -->
        <scroll-view scroll-y class="content-area" refresher-enabled @refresherrefresh="onRefresh"
            :refresher-triggered="isRefreshing">
            <!-- 笔记列表 -->
            <template v-if="notes.length > 0">
                <view class="notes-list">
                    <view class="note-item" v-for="(note, index) in notes" :key="index"
                        @click="viewNote(note.releaseID, note.state)">
                        <view class="note-header">
                            <view class="note-title">{{ note.title }}</view>
                            <view class="note-actions">
                                <view class="action-icon delete-btn" @click.stop="deleteNote(note, index)">
                                    <text>删除</text>
                                </view>
                                <view class="action-icon edit-btn" @click.stop="editNote(note, index)"
                                    v-if="note.state !== 'resolve'">
                                    <text>编辑</text>
                                </view>
                                <view class="action-icon state-btn"
                                    :style="{ backgroundColor: getStateColor(note.state) }"
                                    @click.stop="changeState(note)">
                                    <text>{{ changeStateName(note.state) }}</text>
                                    <text class="reason" v-if="note.state === 'reject'"
                                        @click.stop="getRejectReason(note.reason)">
                                        :{{ note.reason }}
                                    </text>
                                </view>
                            </view>
                        </view>
                        <view class="note-content" v-if="note.content">{{ note.content }}</view>
                        <view class="note-meta">
                            <view class="note-location" v-if="note.location">
                                <image class="location-icon" src="/static/public/location.png"></image>
                                <text>{{ note.location }}</text>
                            </view>
                            <view class="note-date">{{ note.createdAt.slice(0, 10) }}</view>
                        </view>
                        <view class="note-images" v-if="note.pictures && note.pictures.length">
                            <image v-for="(img, imgIndex) in note.pictures" :key="imgIndex" :src="img" mode="aspectFill"
                                @click.stop="previewImage(note.pictures, imgIndex)"></image>
                        </view>

                        <!-- 提示点击查看详情 -->
                        <view class="view-more">
                            <text>点击查看详情</text>
                        </view>
                    </view>
                </view>

                <!-- 底部提示 -->
                <view class="list-footer">
                    <text>已经到底啦~</text>
                </view>
            </template>
            <template v-else>
                <view class="empty-state">
                    <image class="empty-icon" src="/static/public/search.png" mode="aspectFit"></image>
                    <view class="empty-text">暂无笔记内容</view>
                    <view class="empty-subtext">分享您的旅游体验</view>
                    <view class="empty-action" @click="createNote">创建新笔记</view>
                </view>
            </template>
        </scroll-view>

        <!-- 悬浮添加按钮 -->
        <view class="add-button-wrapper" @click="createNote">
            <image class="add-button" src="/static/public/add.png"></image>
            <view class="add-label">添加笔记</view>
        </view>
    </view>
    <view v-if="showAllReason" class="reason-popup" @click.stop="showAllReason = false">
        <view class="reason-popup-content" @click.stop>
            <view class="reason-popup-title">拒绝原因</view>
            <view class="reason-popup-text">{{ allReason }}</view>
            <view class="reason-popup-close" @click="showAllReason = false">关闭</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getUserReleases, getReleaseDetail, deleteRelease, updateState } from '../../api/api';

// 笔记数据
const notes = ref<any[]>([]);
const isRefreshing = ref(false);
const userID = JSON.parse(uni.getStorageSync('userInfo')).userId
const showAllReason = ref<boolean>(false)
const allReason = ref<string>('')

let state = ref<string>('555')
let reason = ref<string>('555')

// 获取拒绝原因
const getRejectReason = (reason: string) => {
    allReason.value = reason
    showAllReason.value = true
}

// 获取状态颜色
const getStateColor = (state: string) => {
    if (state === 'wait') return 'rgba(255, 204, 0, 0.7)'
    if (state === 'resolve') return 'rgba(0, 128, 0, 0.637)'
    if (state === 'reject') return 'rgba(219, 6, 6, 0.516)'
    return 'rgba(255, 204, 0, 0.7)'
}

const changeStateName = (name: string) => {
    if (name === 'resolve') return '已通过'
    if (name === 'reject') return '未通过'
    if (name === 'wait') return '待审核'
    return '待审核'
}

// 查看笔记详情
const viewNote = async (releaseID: string, state: string) => {
    if (state !== 'resolve') {
        uni.showToast({
            title: '笔记未通过,请继续编辑',
            icon: 'none'
        })
        return
    }
    const info = await getReleaseDetail(releaseID)
    uni.navigateTo({
        url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
    });
};

// 编辑笔记
const editNote = (info: any, index: number) => {
    uni.navigateTo({
        url: `/pages/notes/note-edit?info=${encodeURIComponent(JSON.stringify(info))}`
    });
};

// 删除笔记
const deleteNote = (info: any, index: number) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除这个笔记吗？',
        success: async (res) => {
            if (res.confirm) {
                // 这里应该调用API删除笔记
                await deleteRelease(info.releaseID, userID)
                uni.showToast({
                    title: '已删除',
                    icon: 'success'
                });
                const res = await getUserReleases(userID)
                notes.value = res
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

// 改变状态
const changeState = (note) => {
    updateState(
        note.releaseID,
        { state: state.value, reason: reason.value }
    )
}

// 刷新数据
const onRefresh = async () => {
    isRefreshing.value = true;
    const res = await getUserReleases(userID)
    notes.value = res
    await new Promise(resolve => setTimeout(resolve, 1000))
    isRefreshing.value = false;
};

// 预览图片
const previewImage = (images: string[], current: number) => {
    uni.previewImage({
        urls: images,  // [url1,url2] 图片地址数组  
        current: images[current]  // 当前显示的图片索引
    });
};

onLoad(async () => {
    const res = await getUserReleases(userID)
    notes.value = res
})

onShow(async () => {
    const res = await getUserReleases(userID)
    notes.value = res
})
</script>

<style lang="scss" scoped>
.status-inputs {
    padding: 10rpx;
    background-color: rgba(242, 245, 250, 0.8);
    border-bottom: 1rpx solid rgba(52, 148, 230, 0.2);
}

.notes-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to bottom, #f0f5ff, #ffffff);
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 150rpx;

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

    .page-header {
        padding: 30rpx;
        margin-bottom: 10rpx;
        display: flex;
        flex-direction: column;

        .page-title {
            font-size: 44rpx;
            font-weight: bold;
            background: linear-gradient(90deg, #3494E6, #EC6EAD);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.1);
            margin-bottom: 6rpx;
        }

        .page-subtitle {
            font-size: 24rpx;
            color: #888;
        }
    }

    .refresh-tip {
        text-align: center;
        padding: 10rpx 0;
        font-size: 24rpx;
        color: #3494E6;
        background-color: rgba(52, 148, 230, 0.05);
    }

    .content-area {
        width: 95%;
        flex: 1;
        padding: 10rpx 20rpx 20rpx;

        .notes-list {
            padding: 10rpx 0;

            .note-item {
                width: 90%;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 20rpx;
                margin-bottom: 30rpx;
                padding: 30rpx;
                box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.252);
                backdrop-filter: blur(5rpx);
                border: 1px solid rgba(255, 255, 255, 0.6);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 6rpx;
                    height: 100%;
                    background: linear-gradient(to bottom, #3494E6, #EC6EAD);
                    opacity: 0.7;
                }

                &:active {
                    transform: translateY(-5rpx);
                    box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
                    background-color: rgba(255, 255, 255, 0.95);
                }

                .note-header {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20rpx;
                    flex-wrap: wrap;
                    gap: 15rpx;

                    .note-title {
                        font-size: 36rpx;
                        font-weight: bold;
                        color: #333;
                        flex: 1;
                        min-width: 200rpx;
                        background: linear-gradient(90deg, #3494E6, #555);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                        position: relative;
                        padding-bottom: 10rpx;
                        padding-left: 10rpx;

                        &::after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: 10rpx;
                            width: 60rpx;
                            height: 3rpx;
                            background: linear-gradient(90deg, #3494E6, transparent);
                            transition: width 0.3s ease;
                        }
                    }

                    .note-actions {
                        width: 100%;
                        display: flex;
                        gap: 15rpx;
                        flex-wrap: wrap;

                        .action-icon {
                            padding: 10rpx 20rpx;
                            border-radius: 30rpx;
                            font-size: 26rpx;
                            color: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.1);

                            &:active {
                                transform: scale(0.9);
                                box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
                            }

                            .reason {
                                width: fit-content;
                                max-width: 290rpx;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }

                        .delete-btn {
                            background: linear-gradient(135deg, #ff7676, #f54242);
                        }

                        .edit-btn {
                            background: linear-gradient(135deg, #3cb371, #2e8b57);
                        }

                        .state-btn {
                            width: fit-content;
                            max-width: 500rpx;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }

                .note-content {
                    font-size: 28rpx;
                    color: #555;
                    margin-bottom: 25rpx;
                    line-height: 40rpx;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    padding: 0 20rpx;
                    background-color: rgba(52, 148, 230, 0.05);
                    border-radius: 15rpx;
                    border-left: 6rpx solid #3494E6;
                }

                .note-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20rpx;
                    flex-wrap: wrap;
                    gap: 15rpx;

                    .note-location {
                        display: flex;
                        align-items: center;
                        font-size: 24rpx;
                        color: #666;
                        background: linear-gradient(90deg, rgba(52, 148, 230, 0.1), rgba(236, 110, 173, 0.05));
                        padding: 8rpx 20rpx;
                        border-radius: 50rpx;

                        .location-icon {
                            width: 24rpx;
                            height: 24rpx;
                            margin-right: 8rpx;
                        }
                    }

                    .note-date {
                        font-size: 24rpx;
                        color: #888;
                        background-color: rgba(0, 0, 0, 0.05);
                        padding: 6rpx 16rpx;
                        border-radius: 20rpx;
                    }
                }

                .note-images {
                    display: flex;
                    gap: 15rpx;
                    margin-top: 10rpx;
                    margin-bottom: 20rpx;
                    flex-wrap: wrap;

                    image {
                        width: 180rpx;
                        height: 180rpx;
                        border-radius: 12rpx;
                        transition: all 0.3s ease;
                        box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);

                        &:active {
                            transform: scale(0.95);
                        }
                    }
                }

                .view-more {
                    text-align: center;
                    font-size: 24rpx;
                    color: #999;
                    margin-top: 10rpx;
                    position: relative;

                    &::before,
                    &::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        width: 60rpx;
                        height: 1px;
                        background: linear-gradient(90deg, transparent, #ccc);
                    }

                    &::before {
                        left: 30%;
                        transform: translateX(-100%);
                    }

                    &::after {
                        right: 30%;
                        transform: translateX(100%);
                        background: linear-gradient(90deg, #ccc, transparent);
                    }
                }
            }
        }

        .list-footer {
            text-align: center;
            padding: 30rpx 0;
            color: #999;
            font-size: 24rpx;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 150rpx 0;

            .empty-icon {
                width: 250rpx;
                height: 250rpx;
                margin-bottom: 40rpx;
                opacity: 0.6;
                animation: float 3s ease-in-out infinite;
            }

            .empty-text {
                font-size: 36rpx;
                color: #999;
                margin-bottom: 15rpx;
                text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.1);
            }

            .empty-subtext {
                font-size: 28rpx;
                color: #aaa;
                margin-bottom: 40rpx;
            }

            .empty-action {
                font-size: 30rpx;
                color: #fff;
                padding: 25rpx 50rpx;
                background: linear-gradient(to right, #3494E6, #EC6EAD);
                border-radius: 50rpx;
                box-shadow: 0 8rpx 15rpx rgba(52, 148, 230, 0.3);
                transition: all 0.3s ease;

                &:active {
                    transform: scale(0.95);
                    box-shadow: 0 5rpx 10rpx rgba(52, 148, 230, 0.2);
                }
            }
        }
    }

    .add-button-wrapper {
        position: fixed;
        right: 40rpx;
        bottom: 60rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 10;

        .add-button {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            box-shadow: 0 5rpx 20rpx rgba(108, 181, 245, 0.279);
            background: linear-gradient(135deg, #c0fabf, #7adbfe);
            padding: 5rpx;
            transition: all 0.3s ease;
            margin-bottom: 10rpx;

            &:active {
                transform: scale(0.9) rotate(15deg);
            }
        }

        .add-label {
            font-size: 24rpx;
            color: #666;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 6rpx 16rpx;
            border-radius: 20rpx;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        }
    }
}

@keyframes float {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10rpx);
    }

    100% {
        transform: translateY(0);
    }
}

.reason-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    animation: fadeIn 0.3s ease;
}

.reason-popup-content {
    width: 85%;
    background: linear-gradient(to bottom, #ffffff, #f8f9ff);
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 5rpx 25rpx rgba(0, 0, 0, 0.25);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    position: relative;
    animation: slideUp 0.3s ease;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 8rpx;
        border-radius: 20rpx 20rpx 0 0;
    }
}

.reason-popup-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    text-align: center;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -10rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 3rpx;
        background: linear-gradient(90deg, #3494E6, #EC6EAD);
    }
}

.reason-popup-text {
    font-size: 30rpx;
    color: #555;
    line-height: 1.6;
    padding: 20rpx;
    background-color: rgba(52, 148, 230, 0.05);
    border-radius: 15rpx;
    border-left: 6rpx solid #3494E6;
    margin: 20rpx 0;
    max-height: 60vh;
    overflow-y: auto;
}

.reason-popup-close {
    text-align: center;
    margin-top: 30rpx;
    padding: 18rpx 0;
    background: linear-gradient(135deg, #3494E6, #EC6EAD);
    color: white;
    border-radius: 50rpx;
    font-size: 30rpx;
    font-weight: 500;
    box-shadow: 0 5rpx 15rpx rgba(52, 148, 230, 0.3);
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.98);
        box-shadow: 0 3rpx 10rpx rgba(52, 148, 230, 0.2);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(50rpx);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>