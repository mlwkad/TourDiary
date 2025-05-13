<template>
	<view class="home-container">
		<view class="home-content">
			<view class="home-input">
				<image src="/static/public/search.png" class="home-search-icon"></image>
				<input class="home-input-search" placeholder="搜一搜" v-model="searchContent">
				<view class="home-input-go" @click="goSearch">搜索</view>
			</view>
			<view class="search-error" v-if="searchError">{{ searchError }}</view>
		</view>
		<view class="home-choose" v-if="isShowChoose">
			<view class="home-user" :class="{ 'active': !choose }" @click="choose = false, allInfo = allInfoByUserName"
				v-if="allInfoByUserName[0][0]">
				用户</view>
			<view class="home-release" :class="{ 'active': choose }" @click="choose = true, allInfo = allInfoByTitle"
				v-if="allInfoByTitle[0][0]">
				游记</view>
		</view>
		<view class="home-waterfall">
			<view class="home-waterfall-box" v-for="(i, index) in 2" :key="index">
				<view class="home-waterfall-content" v-for="j in allInfo[i - 1]" :key="j.name" @click="goDetail(j)">
					<image class="waterfall-img" :src="j.pictures[0]" mode="widthFix" lazy-load="true"></image>
					<view class="waterfall-title">{{ j.title }}</view>
					<view class="person-info">
						<image class="waterfall-avatar" :src="j.avatar" mode="aspectFill"></image>
						<view class="waterfall-name">{{ j.userName }}</view>
						<view class="like-btn" @click.stop="toggleLike(j)">
							<text class="like-icon" :style="{ color: j.isLiked ? 'red' : '#666' }">♥</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loading-text" v-if="isLoading">加载中...</view>
		<image class="home-gotop" v-if="goTop" @click="goTopFunc" src="/static/public/goTop.png"></image>
	</view>
</template>

<script setup lang="ts">
import { getAllReleases, searchReleases, addLiked, removeLiked, getUserInfo } from '../../api/api'
import { onLoad, onReachBottom, onPageScroll, onShow } from '@dcloudio/uni-app'
import { ref, watchEffect } from 'vue'
import { validateSearch } from '../../utils/filter'

let searchContent = ref<string>('')
let goTop = ref<boolean>(false)
let choose = ref<boolean>(false)
let isShowChoose = ref<boolean>(false)
let curPage = ref<number>(1)
let offSet = ref<number>(0)
let isLoading = ref<boolean>(false)
let searchError = ref<string>('')

const allInfo = ref<any>([[], []])
const allInfoByUserName = ref<any>([[], []])
const allInfoByTitle = ref<any>([[], []])

// 将数据平均分配到左右两栏，多余的一个分给左边
const distributeData = (data: any[], target: any[][]) => {
	const totalCount = data.length
	if (totalCount === 0) {
		target[0] = []
		target[1] = []
		return
	}
	// 如果数据不足14个，平均分配，多出的给左边
	if (totalCount < 14 || totalCount > 14) {
		const leftCount = Math.ceil(totalCount / 2) // 向上取整，确保左边获得多余的一个
		target[0] = data.slice(0, leftCount)
		target[1] = data.slice(leftCount)
	} else {
		target[0] = data.slice(0, 7)
		target[1] = data.slice(7, 14)
	}
}

watchEffect(async () => {
	if (!searchContent.value) {
		try {
			const res = await getAllReleases(14, 0)
			distributeData(res.releases || [], allInfo.value)
		} catch (e) {
			console.log(e)
		}
		isShowChoose.value = false
		curPage.value = 1
		offSet.value = 0
	}
})

const goSearch = async () => {
	searchError.value = ''
	const searchValidation = validateSearch(searchContent.value)
	if (!searchValidation.isValid) {
		searchError.value = searchValidation.message
		return
	}
	searchContent.value = searchValidation.filteredText
	try {
		const res = await searchReleases({ userName: searchContent.value, title: searchContent.value })
		isShowChoose.value = true
		// 检查收藏状态
		if (res.byUserName && res.byUserName.length > 0) {
			await checkLikedStatus(res.byUserName)
		}
		if (res.byTitle && res.byTitle.length > 0) {
			await checkLikedStatus(res.byTitle)
		}
		distributeData(res.byUserName || [], allInfoByUserName.value)
		distributeData(res.byTitle || [], allInfoByTitle.value)
		if (res.byUserName.length > 0) {
			allInfo.value = allInfoByUserName.value
			choose.value = false
		} else if (res.byTitle.length > 0) {
			allInfo.value = allInfoByTitle.value
			choose.value = true
		} else {
			searchError.value = '未找到相关内容'
		}
	} catch (e) {
		console.log(e)
		searchError.value = '搜索失败，请稍后再试'
	}
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

// 收藏
const toggleLike = async (item) => {
	try {
		const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
		if (!item.isLiked) {
			await addLiked(userId, item.releaseID)
			uni.showToast({
				title: '收藏成功',
				icon: 'none'
			})
			item.isLiked = true
		} else {
			await removeLiked(userId, item.releaseID)
			uni.showToast({
				title: '取消收藏',
				icon: 'none'
			})
			item.isLiked = false
		}
	} catch (e) {
		console.log(e)
		uni.showToast({
			title: '操作失败',
			icon: 'none'
		})
	}
}

// 检查是否已收藏
const checkLikedStatus = async (data) => {
	try {
		const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
		const userInfoRes = await getUserInfo(userId)
		const likedReleases = JSON.parse(userInfoRes.liked || '[]')
		// 更新数据中的收藏状态
		data.forEach(item => {
			item.isLiked = likedReleases.includes(item.releaseID)
		})
	} catch (e) {
		console.log(e)
	}
}

onShow(async () => {
	try {
		const res = await getAllReleases(14, 0)
		if (res.releases && res.releases.length > 0) {
			await checkLikedStatus(res.releases)
			distributeData(res.releases || [], allInfo.value)
		}
	} catch (e) {
		console.log(e)
	}
	searchContent.value = ''
	offSet.value = 0
	curPage.value = 1
})

// 滑动到底部加载更多数据
onReachBottom(async () => {
	if (searchContent.value || isShowChoose.value) return // 搜索状态不触发加载更多
	if (isLoading.value) return
	isLoading.value = true
	offSet.value += 14
	curPage.value++
	try {
		const res = await getAllReleases(14, offSet.value)
		if (res.releases && res.releases.length > 0) {
			await checkLikedStatus(res.releases)
			const newAllInfo = [[], []]
			distributeData(res.releases, newAllInfo)
			// 将新数据添加到现有数据中
			allInfo.value[0] = [...allInfo.value[0], ...newAllInfo[0]]
			allInfo.value[1] = [...allInfo.value[1], ...newAllInfo[1]]
		} else {
			uni.showToast({
				title: '没有更多数据了',
				icon: 'none'
			})
			offSet.value -= 14
			curPage.value--
		}
	} catch (e) {
		console.log(e)
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
		offSet.value -= 14
		curPage.value--
	} finally {
		isLoading.value = false
	}
})

onPageScroll((e) => {
	if (e.scrollTop > 300) {
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

		.search-error {
			color: #EC6EAD;
			font-size: 24rpx;
			margin-top: 10rpx;
			background-color: rgba(236, 110, 173, 0.1);
			padding: 6rpx 20rpx;
			border-radius: 10rpx;
			width: fit-content;
			margin: 10rpx auto;
			text-align: center;
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
					max-height: 350rpx;
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

					.like-btn {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-left: auto;
						padding: 8rpx 15rpx;
						border-radius: 20rpx;
						background: rgba(255, 255, 255, 0.8);
						box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
						transition: all 0.3s ease;

						&:active {
							transform: scale(0.9);
						}
					}

					.like-icon {
						font-size: 32rpx;
						font-weight: bold;
					}
				}
			}
		}
	}

	.loading-text {
		text-align: center;
		color: #666;
		padding: 20rpx 0;
		font-size: 28rpx;
	}

	.home-gotop {
		position: fixed;
		bottom: 40rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(135deg, #06ff01, #7adbfe);
		padding: 5rpx;
		border-radius: 50%;
		box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;
		z-index: 10;

		&:active {
			transform: scale(0.9) rotate(10deg);
		}
	}
}
</style>
