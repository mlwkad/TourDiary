<template>
	<view class="home-container">
		<view class="home-content">
			<view class="home-input">
				<image src="/static/public/search.png" class="home-search-icon"></image>
				<input class="home-input-search" placeholder="搜一搜" v-model="searchContent">
				<view class="home-input-go" @click="goSearch">搜索</view>
			</view>
		</view>
		<view class="home-choose" v-if="isShowChoose">
			<view class="home-user" :class="{ 'active': !choose }" @click="choose = false, allInfo = allInfoByUserName">
				用户</view>
			<view class="home-release" :class="{ 'active': choose }" @click="choose = true, allInfo = allInfoByTitle">
				游记</view>
		</view>
		<view class="home-waterfall">
			<view class="home-waterfall-box" v-for="(i, index) in 2" :key="index">
				<view class="home-waterfall-content" v-for="j in allInfo[i - 1]" :key="j.name" @click="goDetail(j)">
					<image class="waterfall-img" src="/static/666.jpg" mode="widthFix"></image>
					<view class="waterfall-title">{{ j.title }}</view>
					<view class="person-info">
						<image class="waterfall-avatar" src="/static/666.jpg" mode="aspectFill"></image>
						<view class="waterfall-name">{{ j.userName }}</view>
					</view>
				</view>
			</view>
		</view>
		<image class="home-gotop" v-if="goTop" @click="goTopFunc" src="/static/public/goTop.png"></image>
	</view>
</template>

<script setup lang="ts">
import { getAllReleases, searchReleases } from '../../api/api'
import { onLoad, onReachBottom, onPageScroll, onShow } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
let searchContent = ref<string>('')
let goTop = ref<boolean>(false)
let choose = ref<boolean>(false)
let isShowChoose = ref<boolean>(false)

const allInfo = ref<any>([[], []])
const allInfoByUserName = ref<any>([[], []])
const allInfoByTitle = ref<any>([[], []])

watch(searchContent, (newVal) => {
	if (!newVal) {
		getAllReleases(50, 0).then(res => {
			allInfo.value[0] = res.releases
		})
		getAllReleases(50, 1).then(res => {
			allInfo.value[1] = res.releases
		})
		isShowChoose.value = false
	} else { }
})

const goSearch = () => {
	if (!searchContent.value) return
	searchReleases(
		{ userName: searchContent.value, title: searchContent.value }
	).then(res => {
		isShowChoose.value = true
		if (res.byUserName.length === 1) {
			allInfoByUserName.value[0] = res.byUserName
		} else {
			allInfoByUserName.value[0] = res.byUserName.slice(0, res.byUserName.length / 2)
			allInfoByUserName.value[1] = res.byUserName.slice(res.byUserName.length / 2, res.byUserName.length)
		}
		allInfo.value = allInfoByUserName.value
		if (res.byTitle.length === 1) {
			allInfoByTitle.value[0] = res.byTitle
		} else {
			allInfoByTitle.value[0] = res.byTitle.slice(0, res.byTitle.length / 2)
			allInfoByTitle.value[1] = res.byTitle.slice(res.byTitle.length / 2, res.byTitle.length)
		}
	})
}

const goDetail = (info) => {
	uni.navigateTo({
		url: `/pages/detail/detail?info=${encodeURIComponent(JSON.stringify(info))}`
	})
}

const goTopFunc = () => {
	uni.pageScrollTo({
		scrollTop: 0,
		duration: 300
	})
}

// onLoad(() => {
// 	getAllReleases(50, 0).then(res => {
// 		allInfo.value[0] = res.releases
// 		console.log(res)
// 	})
// 	getAllReleases(50, 1).then(res => {
// 		allInfo.value[1] = res.releases
// 		console.log(res)
// 	})
// })

onShow(() => {
	getAllReleases(50, 0).then(res => {
		allInfo.value[0] = res.releases
		// console.log(res)
	})
	getAllReleases(50, 1).then(res => {
		allInfo.value[1] = res.releases
		// console.log(res)
	})
})

onReachBottom(() => {

})

onPageScroll((e) => {
	if (e.scrollTop > 400) {
		goTop.value = true
	} else {
		goTop.value = false
	}
})


</script>

<style lang="scss" scoped>
.home-container {
	background: linear-gradient(to bottom, #f0f5ff, #ffffff);
	min-height: 100vh;
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
}

.home-content {
	width: 100%;
	padding: 20rpx 0;

	.home-input {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 15rpx 20rpx;
		position: relative;

		.home-back-icon {
			width: 40rpx;
			height: 38rpx;
			padding: 0 15rpx;
		}

		.home-search-icon {
			width: 40rpx;
			height: 38rpx;
			margin: 0 10rpx;
			position: absolute;
			left: 35rpx;
			color: #3494E6;
		}

		&-search {
			width: 70%;
			background-color: rgba(255, 255, 255, 0.8);
			padding: 12rpx 70rpx;
			border-radius: 30rpx;
			color: #333;
			border: 1rpx solid rgba(52, 148, 230, 0.2);
			box-shadow: inset 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
		}

		&-go {
			white-space: nowrap;
			padding: 10rpx 30rpx;
			margin-left: 20rpx;
			background: linear-gradient(135deg, #3494E6, #EC6EAD);
			color: #fff;
			border-radius: 30rpx;
			font-size: 28rpx;
			box-shadow: 0 5rpx 15rpx rgba(52, 148, 230, 0.3);
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.95);
				box-shadow: 0 2rpx 8rpx rgba(52, 148, 230, 0.2);
			}
		}
	}
}

.home-choose {
	display: flex;
	padding: 12rpx 22rpx;
	gap: 25rpx;
	margin-bottom: 20rpx;

	.home-user,
	.home-release {
		padding: 12rpx 30rpx;
		border-radius: 30rpx;
		background-color: rgba(128, 128, 128, 0.2);
		color: #666;
		font-size: 28rpx;
		transition: all 0.3s ease;
		box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.1);

		&.active {
			background: linear-gradient(135deg, #3494E6, #EC6EAD);
			color: #fff;
			box-shadow: 0 5rpx 15rpx rgba(52, 148, 230, 0.3);
		}

		&:active {
			transform: scale(0.95);
		}
	}
}

.home-waterfall {
	margin: 0 auto;
	width: 95%;
	display: flex;
	height: 100%;
	gap: 25rpx;

	&-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 25rpx;

		.home-waterfall-content {
			width: 100%;
			height: fit-content;
			border-radius: 20rpx;
			padding-bottom: 12rpx;
			background-color: rgba(255, 255, 255, 0.9);
			box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.15);
			overflow: hidden;
			transition: all 0.3s ease;
			border: 1px solid rgba(255, 255, 255, 0.6);
			backdrop-filter: blur(5rpx);

			&:active {
				transform: translateY(-5rpx);
				box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
			}

			.waterfall-img {
				width: 100%;
				border-radius: 20rpx 20rpx 0 0;
			}

			.waterfall-title {
				font-weight: 600;
				white-space: wrap;
				color: #333;
				padding: 15rpx 20rpx;
				font-size: 28rpx;
				background: linear-gradient(90deg, #000000, #000000);
				-webkit-background-clip: text;
				background-clip: text;
				color: transparent;
			}

			.person-info {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				gap: 15rpx;
				padding: 0 20rpx 15rpx;

				.waterfall-avatar {
					border-radius: 50%;
					width: 50rpx;
					height: 50rpx;
					border: 2rpx solid #fff;
					box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);
				}

				.waterfall-name {
					color: #666;
					font-weight: 500;
					font-size: 24rpx;
				}
			}
		}
	}
}

.home-gotop {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #3494E6, #EC6EAD);
	padding: 5rpx;
	border-radius: 50%;
	box-shadow: 0 5rpx 20rpx rgba(52, 148, 230, 0.5);
	transition: all 0.3s ease;
	z-index: 10;

	&:active {
		transform: scale(0.9) rotate(10deg);
	}
}
</style>
