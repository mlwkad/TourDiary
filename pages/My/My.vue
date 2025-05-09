<template>
	<view class="my-container">
		<!-- 用户信息区域 -->
		<view class="user-info-section" :class="{ 'logged-in': isLoggedIn }">
			<view v-if="isLoggedIn" class="user-profile">
				<image class="user-avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
				<view class="user-name">
					{{ userInfo.nickName || '用户' }}
					<image class="changeInfoIcon" src="/static/public/change.png" @click="isShow = true"></image>
				</view>
			</view>
			<view v-else class="login-section">
				<image class="default-avatar" src="/static/public/defaultAvatar.png" mode="aspectFill"></image>
				<view class="login-btns">
					<button class="login-btn" @click="handleLogin">登录</button>
					<button class="register-btn" @click="handleRegister">注册</button>
				</view>
			</view>
		</view>

		<!-- 功能选项区域 -->
		<view class="options-section">
			<view class="option-group">
				<view class="option-item" @click="navigateTo('collection')">
					<image class="option-icon" src="/static/public/like.png"></image>
					<text class="option-text">我的收藏</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>

				<view class="option-item" @click="navigateTo('notes')">
					<image class="option-icon" style="transform: translateX(-4rpx);width: 50rpx;height: 55rpx;"
						src="/static/public/note.png"></image>
					<text class="option-text">我的笔记</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>

				<view class="option-item" @click="navigateTo('follow')">
					<image class="option-icon" style="width: 40rpx;height: 40rpx;" src="/static/public/followed.png">
					</image>
					<text class="option-text">我的关注</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>
			</view>

			<!-- <view class="option-group">
				<view class="option-item" @click="navigateTo('settings')">
					<image class="option-icon" src="/static/public/search.png"></image>
					<text class="option-text">设置</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>

				<view class="option-item" @click="navigateTo('feedback')">
					<image class="option-icon" src="/static/public/search.png"></image>
					<text class="option-text">意见反馈</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>
			</view> -->

			<view v-if="isLoggedIn" class="logout-btn" @click="handleLogout">
				退出登录
			</view>
		</view>
	</view>
	<view class="changeInfo" v-if="isShow">
		<view class="changeInfo-top">
			<view class="changeInfo-top-title">修改您的头像、昵称</view>
			<image class="changeInfo-top-close" src="/static/public/close.png" @click="isShow = false"></image>
		</view>
		<view class="changeInfo-avatar">
			头像:
			<!-- open-type="chooseAvatar" 选择怎么设置头像 -->
			<!-- <button class="changeInfo-avatar-title" open-type="chooseAvatar" @chooseavatar="chooseavatar">
				<image class="changeInfo-avatar-title-image" :src="userInfo.avatarUrl" mode="aspectFill"></image>
			</button> -->
			<button class="changeInfo-avatar-title" @click="chooseavatar">
				<image class="changeInfo-avatar-title-image" :src="userInfo.avatarUrl" mode="aspectFill"></image>
			</button>
		</view>
		<view class="changeInfo-nickname">
			<view class="changeInfo-nickname-title">昵称:</view>
			<!-- type="nickname" 自动获取微信昵称 -->
			<input class="changeInfo-nickname-input" v-model="userInfo.nickName" :placeholder='userInfo.nickName' />
		</view>
		<button class="changeInfo-ensure" @click="changeUserInfo">确定</button>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { updateUserInfo } from '../../api/api';

let isShow = ref<boolean>(false)

// 用户信息
const isLoggedIn = ref<boolean>(false);
const userInfo = reactive({
	nickName: '',
	avatarUrl: '',
	userId: ''
});

// 检查登录状态
const checkLoginStatus = () => {
	const token = uni.getStorageSync('token')
	if (token) {
		isLoggedIn.value = true
		const savedUserInfo = uni.getStorageSync('userInfo')
		if (savedUserInfo) {
			Object.assign(userInfo, JSON.parse(savedUserInfo))
		}
	}
};

// 登录处理
const handleLogin = () => {
	uni.navigateTo({
		url: '/pages/login/login',
		// 切页动效,默认右侧滑入
		// animationType: 'slide-in-bottom',
		// animationDuration: 300
	})
}

// 注册处理
const handleRegister = () => {
	uni.navigateTo({
		url: '/pages/register/register',
	});
};

// 退出登录
const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				// 清除登录信息
				uni.removeStorageSync('token')
				uni.removeStorageSync('userInfo')
				isLoggedIn.value = false
				Object.assign(userInfo, {
					nickName: '',
					avatarUrl: '',
					userId: ''
				});
				uni.showToast({
					title: '已退出登录',
					icon: 'success'
				});
			}
		}
	});
};

// 更改头像
const chooseavatar = () => {
	uni.chooseImage({
		count: 1,  // 还能选几张
		sizeType: ['compressed'],  // 压缩后的图片 或 original:原图
		sourceType: ['album', 'camera'],  // 可以来自相册 相机
		success: (res) => {
			// 这里应该上传图片到服务器，目前直接使用本地路径
			userInfo.avatarUrl = res.tempFilePaths
		}
	})
}

// 提交更改
const changeUserInfo = () => {
	updateUserInfo(userInfo.userId, {
		userID: userInfo.userId,
		userName: userInfo.nickName,
		avatar: userInfo.avatarUrl
	}).then(res => {
		uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		isShow.value = false
		uni.showToast({
			title: '修改成功',
			icon: 'success'
		})
	})
}

// 页面导航
const navigateTo = (page: string) => {
	if (!isLoggedIn.value) {
		uni.showModal({
			title: '提示',
			content: '请先登录',
			success: (res) => {
				if (res.confirm) {
					handleLogin()
				}
			}
		})
		return
	}
	if (page !== 'follow') {
		uni.navigateTo({
			url: `/pages/${page}/${page}`
		})
	} else {
		uni.navigateTo({
			url: `/pages/${page}/list`
		})
	}
}

// 页面加载时检查登录状态
onLoad(() => {
	checkLoginStatus()
})

// 页面显示时检查登录状态，处理从登录页返回的情况
onShow(() => {
	checkLoginStatus()
})

</script>

<style lang="scss" scoped>
.my-container {
	width: 100%;
	min-height: 100vh;
	background: linear-gradient(to bottom, #f0f5ff, #ffffff);
	position: relative;

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

	.user-info-section {
		background: linear-gradient(to right, #3494E6, #EC6EAD);
		padding: 60rpx 30rpx;
		margin-bottom: 30rpx;
		border-radius: 0 0 30rpx 30rpx;
		box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);

		.user-profile {
			display: flex;
			flex-direction: column;
			align-items: center;

			.user-avatar {
				width: 180rpx;
				height: 180rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
				margin-bottom: 20rpx;
				box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2);
				transition: all 0.3s ease;

				&:active {
					transform: scale(1.05);
				}
			}

			.user-name {
				font-size: 36rpx;
				color: #fff;
				font-weight: bold;
				display: flex;
				align-items: center;
				gap: 15rpx;
				text-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.2);

				.changeInfoIcon {
					transform: translateY(3rpx);
					width: 35rpx;
					height: 35rpx;
					transition: all 0.3s ease;

					&:active {
						transform: translateY(3rpx) rotate(15deg);
					}
				}
			}
		}

		.login-section {
			display: flex;
			flex-direction: column;
			align-items: center;

			.default-avatar {
				background-color: white;
				width: 180rpx;
				height: 180rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
				margin-bottom: 20rpx;
				box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2);
			}

			.login-btns {
				display: flex;
				gap: 20rpx;

				.login-btn,
				.register-btn {
					background-color: #fff;
					color: #3494E6;
					font-size: 28rpx;
					font-weight: bold;
					padding: 15rpx 40rpx;
					border-radius: 30rpx;
					border: none;
					box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
					transition: all 0.3s ease;

					&:active {
						transform: scale(0.95);
						box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
					}
				}

				.register-btn {
					background-color: rgba(255, 255, 255, 0.2);
					color: #fff;
					box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
				}
			}
		}
	}

	.options-section {
		padding: 0 20rpx;

		.option-group {
			background-color: rgba(255, 255, 255, 0.9);
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			overflow: hidden;
			box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
			backdrop-filter: blur(5rpx);
			border: 1px solid rgba(255, 255, 255, 0.6);

			.option-item {
				display: flex;
				align-items: center;
				padding: 30rpx 20rpx;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
				transition: all 0.3s ease;

				&:active {
					background-color: rgba(52, 148, 230, 0.05);
				}

				&:last-child {
					border-bottom: none;
				}

				.option-icon {
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}

				.option-text {
					flex: 1;
					font-size: 30rpx;
					color: #333;
					font-weight: 500;
				}

				.arrow-icon {
					width: 30rpx;
					height: 30rpx;
					transform: rotate(180deg);
					opacity: 0.6;
				}
			}
		}

		.logout-btn {
			background: linear-gradient(135deg, #ff7676, #f54242);
			color: #fff;
			text-align: center;
			padding: 30rpx 0;
			border-radius: 20rpx;
			font-size: 32rpx;
			margin-top: 250rpx;
			font-weight: bold;
			box-shadow: 0 5rpx 15rpx rgba(255, 118, 118, 0.3);
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
				box-shadow: 0 2rpx 8rpx rgba(255, 118, 118, 0.2);
			}
		}
	}
}

.changeInfo {
	width: 100%;
	height: fit-content;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: rgba(255, 255, 255, 0.95);
	padding-top: 15rpx;
	border-radius: 30rpx 30rpx 0 0;
	box-shadow: 0 -5rpx 20rpx rgba(0, 0, 0, 0.1);
	animation: hua 0.3s ease-in-out forwards;
	backdrop-filter: blur(10rpx);
	border-top: 1px solid rgba(255, 255, 255, 0.8);
	z-index: 100;

	@keyframes hua {
		0% {
			transform: translateY(50%);
			opacity: 0;
		}

		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	&-top {
		display: flex;
		align-items: center;
		position: relative;
		justify-content: center;
		padding-bottom: 20rpx;

		&-title {
			font-size: 36rpx;
			font-weight: 600;
			background: linear-gradient(90deg, #3494E6, #EC6EAD);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
		}

		&-close {
			position: absolute;
			top: 50%;
			right: 5%;
			transform: translateY(-50%);
			width: 30rpx;
			height: 30rpx;
			padding: 15rpx;
		}
	}

	&-avatar {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-top: solid 1rpx rgba(52, 148, 230, 0.2);
		padding-left: 45rpx;
		font-size: 30rpx;
		color: #555;

		&-title {
			margin: 0;
			margin-left: 45rpx;
			padding: 0;
			height: 70rpx;
			width: 70rpx;
			background: none;

			&::after {
				border: none;
			}

			.changeInfo-avatar-title-image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}

	&-nickname {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-top: solid 1rpx rgba(52, 148, 230, 0.2);
		border-bottom: solid 1rpx rgba(52, 148, 230, 0.2);
		padding-left: 45rpx;
		font-size: 30rpx;
		color: #555;

		&-input {
			padding-left: 45rpx;
			height: 70rpx;
			font-size: 28rpx;
		}
	}

	&-ensure {
		background: linear-gradient(to right, #3494E6, #EC6EAD);
		color: #fff;
		border-radius: 50rpx;
		width: 60%;
		margin: 30rpx auto;
		border: none;
		padding: 0rpx 0;
		font-size: 30rpx;
		box-shadow: 0 5rpx 15rpx rgba(52, 148, 230, 0.3);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 2rpx 8rpx rgba(52, 148, 230, 0.2);
		}
	}
}
</style>
