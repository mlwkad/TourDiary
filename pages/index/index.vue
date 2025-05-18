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
			<view class="home-user" :class="{ 'active': !choose }" @click="chooseToUser()" v-if="isShowUserName">
				用户</view>
			<view class="home-release" :class="{ 'active': choose }" @click="chooseToRelease()" v-if="isShowTitle">
				游记</view>
		</view>
		<view class="home-waterfall">
			<up-waterfall v-model="flowList" :gap="8" style="width: 100%;" v-if="showWaterfall">
				<template v-slot:left="{ leftList }">
					<view v-for="item in leftList" :key="item.id" class="home-waterfall-content"
						@click="goDetail(item)">
						<image class="waterfall-img" :src="item.pictures[0]" mode="widthFix" lazy-load />
						<view class="waterfall-title">{{ item.title }}</view>
						<view class="person-info">
							<image class="waterfall-avatar" :src="item.avatar" mode="aspectFill"></image>
							<view class="waterfall-name">{{ item.userName }}</view>
							<view class="like-btn" @click.stop="toggleLike(item)">
								<text class="like-icon" :style="{ color: item.isLiked ? 'red' : '#666' }">♥</text>
							</view>
						</view>
					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view v-for="item in rightList" :key="item.id" class="home-waterfall-content"
						@click="goDetail(item)">
						<image class="waterfall-img" :src="item.pictures[0]" mode="widthFix" lazy-load />
						<view class="waterfall-title">{{ item.title }}</view>
						<view class="person-info">
							<image class="waterfall-avatar" :src="item.avatar" mode="aspectFill"></image>
							<view class="waterfall-name">{{ item.userName }}</view>
							<view class="like-btn" @click.stop="toggleLike(item)">
								<text class="like-icon" :style="{ color: item.isLiked ? 'red' : '#666' }">♥</text>
							</view>
						</view>
					</view>
				</template>
			</up-waterfall>
		</view>
		<view class="loading-text" v-if="isLoading">加载中...</view>
		<image class="home-gotop" v-if="goTop" @click="goTopFunc" src="/static/public/goTop.png"></image>
	</view>
</template>

<script setup lang="ts">
import { getAllReleases, searchReleases, addLiked, removeLiked, getUserInfo } from '../../api/api'
import { onLoad, onReachBottom, onPageScroll, onShow } from '@dcloudio/uni-app'
import { ref, onMounted, watch } from 'vue'
import { validateSearch } from '../../utils/filter'

const searchContent = ref<string>('')
const goTop = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const searchError = ref<string>('')
const curPage = ref<number>(1)
const offSet = ref<number>(0)
const isShowChoose = ref<boolean>(false)
const choose = ref<boolean>(false)
const isShowUserName = ref<boolean>(false)
const isShowTitle = ref<boolean>(false)
const showWaterfall = ref<boolean>(true)
const isSearch = ref<boolean>(false)

const flowList = ref<any[]>([])
const allInfoByUserName = ref<any[]>([])
const allInfoByTitle = ref<any[]>([])

watch(searchContent, async (newVal) => {
	if (!newVal) {
		isSearch.value = false
		showWaterfall.value = false
		await fetchData()
		showWaterfall.value = true
		isShowChoose.value = false
		isShowUserName.value = false
		isShowTitle.value = false
	} else {
		isSearch.value = true
	}
})

const fetchData = async () => {
	const res = await getAllReleases(20, 0)
	flowList.value = (res.releases || []).map(item => ({
		...item,
		id: item.releaseID,
		imgWidth: 300,
		imgHeight: 200
	}))
}

const goSearch = async () => {
	searchError.value = ''
	const searchValidation = validateSearch(searchContent.value)
	if (!searchValidation.isValid) {
		searchError.value = searchValidation.message
		return
	}
	searchContent.value = searchValidation.filteredText
	showWaterfall.value = false
	try {
		const res = await searchReleases({ userName: searchContent.value, title: searchContent.value })
		allInfoByUserName.value = res.byUserName.map(item => ({
			...item,
			id: item.releaseID,
			imgWidth: 300,
			imgHeight: 200,
		}))
		allInfoByTitle.value = res.byTitle.map(item => ({
			...item,
			id: item.releaseID,
			imgWidth: 300,
			imgHeight: 200,
		}))
		if (allInfoByUserName.value.length === 0 && allInfoByTitle.value.length === 0) {
			searchError.value = '未找到相关内容'
		} else if (allInfoByUserName.value.length > 0 && allInfoByTitle.value.length === 0) {
			showWaterfall.value = true
			isShowChoose.value = true
			isShowUserName.value = true
			choose.value = false
			flowList.value = allInfoByUserName.value
		} else if (allInfoByUserName.value.length === 0 && allInfoByTitle.value.length > 0) {
			showWaterfall.value = true
			isShowChoose.value = true
			isShowTitle.value = true
			choose.value = true
			flowList.value = allInfoByTitle.value
		} else {
			showWaterfall.value = true
			isShowChoose.value = true
			isShowUserName.value = true
			isShowTitle.value = true
			choose.value = false
			flowList.value = allInfoByUserName.value
		}
	} catch (e) {
		console.log(e)
		searchError.value = '搜索失败，请稍后再试'
	}
}

const chooseToUser = () => {
	showWaterfall.value = false
	choose.value = false
	flowList.value = allInfoByUserName.value
	setTimeout(() => {
		showWaterfall.value = true
	}, 10)
}

const chooseToRelease = () => {
	showWaterfall.value = false
	choose.value = true
	flowList.value = allInfoByTitle.value
	setTimeout(() => {
		showWaterfall.value = true
	}, 10)
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

const toggleLike = async (item) => {
	try {
		const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
		if (!item.isLiked) {
			await addLiked(userId, item.releaseID)
			uni.showToast({ title: '收藏成功', icon: 'none' })
			item.isLiked = true
		} else {
			await removeLiked(userId, item.releaseID)
			uni.showToast({ title: '取消收藏', icon: 'none' })
			item.isLiked = false
		}
	} catch (e) {
		console.log(e)
		uni.showToast({ title: '操作失败', icon: 'none' })
	}
}

const checkLikedStatus = async (data) => {
	try {
		const userId = JSON.parse(uni.getStorageSync('userInfo')).userId
		const userInfoRes = await getUserInfo(userId)
		const likedReleases = JSON.parse(userInfoRes.liked || '[]')
		data.forEach(item => {
			item.isLiked = likedReleases.includes(item.releaseID)
		})
	} catch (e) {
		console.log(e)
	}
}

onMounted(() => {
	fetchData()
})

onShow(async () => {
	await fetchData()
	searchContent.value = ''
	offSet.value = 0
	curPage.value = 1
})

onReachBottom(async () => {
	if (isLoading.value) return
	if (isSearch.value) return
	isLoading.value = true
	offSet.value += 20
	curPage.value++
	try {
		const res = await getAllReleases(20, offSet.value)
		if (res.releases && res.releases.length > 0) {
			await checkLikedStatus(res.releases)
			flowList.value = [...flowList.value, ...res.releases.map(item => ({
				...item,
				id: item.releaseID,
				imgWidth: 300,
				imgHeight: 200
			}))]
		} else {
			uni.showToast({ title: '没有更多数据了', icon: 'none' })
			offSet.value -= 20
			curPage.value--
		}
	} catch (e) {
		console.log(e)
		uni.showToast({ title: '加载失败', icon: 'none' })
		offSet.value -= 20
		curPage.value--
	} finally {
		isLoading.value = false
	}
})

onPageScroll((e) => {
	goTop.value = e.scrollTop > 300
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
		width: 100%;
		padding: 0;
		margin: 0;
		gap: 0;
	}

	.home-waterfall-content {
		width: calc(100% - 24rpx);
		margin: 20rpx 12rpx;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 18rpx rgba(146, 146, 146, 0.84);
		padding-bottom: 12rpx;
		overflow: hidden;
		transition: box-shadow 0.2s;
		border: 1px solid rgba(236, 110, 173, 0);

		&:active {
			box-shadow: 0 8rpx 24rpx rgba(52, 148, 230, 0.18);
		}
	}

	.waterfall-img {
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;
		display: block;
		object-fit: cover;
		max-height: 350rpx;
	}

	.waterfall-title {
		font-weight: 600;
		font-size: 28rpx;
		color: #333;
		padding: 15rpx 20rpx 5rpx 20rpx;
		white-space: pre-line;
		line-height: 1.3;
	}

	.person-info {
		display: flex;
		align-items: center;
		gap: 15rpx;
		padding: 0 20rpx 10rpx 20rpx;
		margin-top: 2rpx;
	}

	.waterfall-avatar {
		border-radius: 50%;
		width: 48rpx;
		height: 48rpx;
		border: 2rpx solid #fff;
		box-shadow: 0 2rpx 8rpx rgba(52, 148, 230, 0.10);
		object-fit: cover;
	}

	.waterfall-name {
		color: #666;
		font-weight: 500;
		font-size: 24rpx;
		max-width: 120rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.like-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
		padding: 8rpx 15rpx;
		border-radius: 20rpx;
		background: rgba(236, 110, 173, 0.08);
		box-shadow: 0 2rpx 6rpx rgba(236, 110, 173, 0.08);
		transition: all 0.2s;

		&:active {
			transform: scale(0.9);
		}
	}

	.like-icon {
		font-size: 32rpx;
		font-weight: bold;
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
