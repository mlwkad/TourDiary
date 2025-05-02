<template>
	<view class="my-container">
		<!-- 用户信息区域 -->
		<view class="user-info-section" :class="{ 'logged-in': isLoggedIn }">
			<view v-if="isLoggedIn" class="user-profile">
				<image class="user-avatar" :src="userInfo.avatarUrl || '/static/666.jpg'" mode="aspectFill"></image>
				<view class="user-name">{{ userInfo.nickName || '微信用户' }}</view>
			</view>
			<view v-else class="login-section">
				<image class="default-avatar" src="/static/666.jpg" mode="aspectFill"></image>
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
					<image class="option-icon" src="/static/public/search.png"></image>
					<text class="option-text">我的收藏</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>

				<view class="option-item" @click="navigateTo('notes')">
					<image class="option-icon" src="/static/public/search.png"></image>
					<text class="option-text">我的笔记</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>

				<view class="option-item" @click="navigateTo('following')">
					<image class="option-icon" src="/static/public/search.png"></image>
					<text class="option-text">我的关注</text>
					<image class="arrow-icon" src="/static/public/back.png"></image>
				</view>
			</view>

			<view class="option-group">
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
			</view>

			<view v-if="isLoggedIn" class="logout-btn" @click="handleLogout">
				退出登录
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app'

// 用户信息
const isLoggedIn = ref<boolean>(false);
const userInfo = reactive({
	nickName: '',
	avatarUrl: '',
	userId: ''
});

// 检查登录状态
const checkLoginStatus = () => {
	const token = uni.getStorageSync('token');
	if (token) {
		isLoggedIn.value = true;
		// 从本地获取用户信息
		const savedUserInfo = uni.getStorageSync('userInfo');
		if (savedUserInfo) {
			Object.assign(userInfo, JSON.parse(savedUserInfo));
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
	});
};

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
				uni.removeStorageSync('token');
				uni.removeStorageSync('userInfo');
				isLoggedIn.value = false;
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

// 页面导航
const navigateTo = (page: string) => {
	if (!isLoggedIn.value) {
		uni.showModal({
			title: '提示',
			content: '请先登录',
			success: (res) => {
				if (res.confirm) {
					handleLogin();
				}
			}
		});
		return;
	}

	const pageMap: Record<string, string> = {
		collection: '/pages/collection/collection',
		notes: '/pages/notes/notes',
		following: '/pages/following/following',
		settings: '/pages/settings/settings',
		feedback: '/pages/feedback/feedback'
	};

	uni.navigateTo({
		url: pageMap[page]
	});
};

// 页面加载时检查登录状态
onLoad(() => {
	checkLoginStatus();
});
</script>

<style lang="scss" scoped>
.my-container {
	width: 100%;
	min-height: 100vh;
	background-color: #f5f5f5;

	.user-info-section {
		background: linear-gradient(to right, #4bb0ff, #61e4ff);
		padding: 40rpx 30rpx;
		margin-bottom: 20rpx;

		.user-profile {
			display: flex;
			flex-direction: column;
			align-items: center;

			.user-avatar {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
				margin-bottom: 20rpx;
			}

			.user-name {
				font-size: 36rpx;
				color: #fff;
				font-weight: bold;
			}
		}

		.login-section {
			display: flex;
			flex-direction: column;
			align-items: center;

			.default-avatar {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
				margin-bottom: 20rpx;
			}

			.login-btns {
				display: flex;
				gap: 20rpx;

				.login-btn,
				.register-btn {
					background-color: #fff;
					color: #4bb0ff;
					font-size: 28rpx;
					font-weight: bold;
					padding: 15rpx 40rpx;
					border-radius: 30rpx;
					border: none;
				}
			}
		}
	}

	.options-section {
		padding: 0 20rpx;

		.option-group {
			background-color: #fff;
			border-radius: 15rpx;
			margin-bottom: 20rpx;
			overflow: hidden;

			.option-item {
				display: flex;
				align-items: center;
				padding: 30rpx 20rpx;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

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
				}

				.arrow-icon {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}

		.logout-btn {
			background-color: #fff;
			color: #ff4b4b;
			text-align: center;
			padding: 30rpx 0;
			border-radius: 15rpx;
			font-size: 32rpx;
			margin-top: 30rpx;
			font-weight: bold;
		}
	}
}
</style>
