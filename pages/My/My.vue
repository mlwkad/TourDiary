<template>
	<view class="my-container">
		<!-- 用户信息区域 -->
		<view class="user-info-section" :class="{ 'logged-in': isLoggedIn }">
			<view v-if="isLoggedIn" class="user-profile">
				<image class="user-avatar" :src="userInfo.avatarUrl || '/static/666.jpg'" mode="aspectFill"></image>
				<view class="user-name">
					{{ userInfo.nickName || '666' }}
					<image class="changeInfoIcon" src="/static/public/change.png" @click="isShow = true"></image>
				</view>
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
	<view class="changeInfo" v-if="isShow">
		<view class="changeInfo-top">
			<view class="changeInfo-top-title">修改您的头像、昵称</view>
			<image class="changeInfo-top-close" src="/static/public/close.png" @click="isShow = false"></image>
		</view>
		<view class="changeInfo-avatar">
			头像:
			<!-- open-type="chooseAvatar" 选择怎么设置头像 -->
			<button class="changeInfo-avatar-title" open-type="chooseAvatar" @chooseavatar="chooseavatar">
				<image class="changeInfo-avatar-title-image" :src="userInfo.avatarUrl" mode="widthFix"></image>
			</button>
		</view>
		<view class="changeInfo-nickname">
			<view class="changeInfo-nickname-title">昵称:</view>
			<!-- type="nickname" 自动获取微信昵称 -->
			<input class="changeInfo-nickname-input" type="nickname" :placeholder='userInfo.nickName' />
		</view>
		<button class="changeInfo-ensure">确定</button>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'

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
		// 从本地获取用户信息
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

// 页面显示时检查登录状态，处理从登录页返回的情况
onShow(() => {
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
				width: 180rpx;
				height: 180rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
				margin-bottom: 20rpx;
			}

			.user-name {
				font-size: 36rpx;
				color: #fff;
				font-weight: bold;
				display: flex;
				align-items: center;
				gap: 15rpx;

				.changeInfoIcon {
					transform: translateY(3rpx);
					width: 35rpx;
					height: 35rpx;
				}
			}
		}

		.login-section {
			display: flex;
			flex-direction: column;
			align-items: center;

			.default-avatar {
				width: 180rpx;
				height: 180rpx;
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

.changeInfo {
	width: 100%;
	height: fit-content;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #ffffff;
	padding-top: 15rpx;
	border-radius: 20rpx 20rpx 0 0;
	box-shadow: 0 -5rpx 10px rgba(128, 128, 128, 0.433);
	animation: hua 0.3s ease-in-out forwards;

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
		padding-bottom: 15rpx;

		&-title {
			font-size: 45rpx;
			transform: translateX();
		}

		&-close {
			position: absolute;
			top: 50%;
			right: 5%;
			transform: translateY(-60%);
			width: 20rpx;
			height: 20rpx;
		}
	}

	&-avatar {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-top: solid 1rpx rgba(128, 128, 128, 0.449);
		padding-left: 45rpx;

		&-title {
			margin: 0;
			margin-left: 45rpx;
			padding: 0;
			height: 70rpx;

			&-image {
				width: 70rpx;
				height: 70rpx;
			}
		}


	}

	&-nickname {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-top: solid 1rpx rgba(128, 128, 128, 0.421);
		border-bottom: solid 1rpx rgba(128, 128, 128, 0.421);
		padding-left: 45rpx;

		// &-title {}

		&-input {
			padding-left: 45rpx;
		}
	}

	&-ensure {
		background-color: rgb(52, 179, 52);
		border-radius: 24rpx;
		width: 40%;
		margin: 0 auto;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		border: solid 2px rgba(242, 246, 242, 0.629);
		color: white;
	}

}
</style>
