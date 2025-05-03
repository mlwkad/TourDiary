<template>
	<view class="home-content">
		<view class="home-input">
			<image src="/static/public/search.png" class="home-search-icon"></image>
			<image src="/static/public/back.png" class="home-back-icon"></image>
			<input class="home-input-search" placeholder="搜一搜" v-model="searchContent">
			<view class="home-input-go" @click="goSearch">搜索</view>
		</view>
	</view>
	<view class="home-waterfall">
		<view class="home-waterfall-box" v-for="(i, index) in 2" :key="index">
			<view class="home-waterfall-content" v-for="j in allInfo[i - 1]" :key="j.name" @click="goDetail(j)">
				<!--优先填满宽度,同时保证高宽比例,高度>容器高度=溢出,可设置overflow隐藏,反之填不满-->
				<image class="waterfall-img" src="/static/666.jpg" mode="widthFix"></image>
				<view class="waterfall-title">{{ j.title }}</view>
				<view class="person-info">
					<!--裁剪图片以保证图片完全填满容器,同时保证高宽比例,溢出就裁剪,填不满就放大-->
					<image class="waterfall-avatar" src="/static/666.jpg" mode="aspectFill"></image>
					<view class="waterfall-name">{{ j.userName }}</view>
				</view>
			</view>
		</view>
	</view>
	<image class="home-gotop" v-if="goTop" @click="goTopFunc" src="/static/public/goTop.png">回到顶部</image>
</template>

<script setup lang="ts">
import { getAllReleases } from '../../api/api'
import { onLoad, onReachBottom, onPageScroll, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
let searchContent = ref<string>('')
let goTop = ref<boolean>(false)
const allInfo = ref<any>([[], []])

const goSearch = () => {

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
.home-content {
	// background: linear-gradient(to right, #4bb0ff, #61e4ff);
	width: 100vw;

	.home-input {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 15rpx 0;
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
			left: 72rpx;
		}


		&-search {
			width: 60%;
			background-color: rgba(128, 128, 128, 0.266);
			padding: 10rpx;
			border-radius: 24rpx;
			padding: 8rpx 70rpx;
			color: black;
		}

		&-go {
			white-space: nowrap;
			padding: 0 20rpx
		}
	}
}

.home-waterfall {
	margin: 0 auto;
	width: 95%;
	display: flex;
	height: 100%;
	gap: 17rpx;

	&-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 15rpx;

		.home-waterfall-content {
			width: 100%;
			height: fit-content;
			border: solid 1px black;
			border-radius: 12rpx;
			padding-bottom: 12rpx;

			.waterfall-img {
				width: 100%;
				border-radius: 12rpx 12rpx 0 0;
			}

			.waterfall-title {
				font-weight: 550;
				white-space: wrap;
				color: rgb(62, 62, 62);
				padding: 1rpx 15rpx 20rpx;
			}

			.person-info {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				gap: 25rpx;
				padding-left: 15rpx;
				padding-bottom: 5rpx;

				.waterfall-avatar {
					border-radius: 50%;
					width: 50rpx;
					height: 50rpx;
				}

				.waterfall-name {
					color: rgba(83, 83, 83, 0.718);
					font-weight: 600;
					font-size: 25rpx;
				}
			}
		}
	}
}

.home-gotop {
	position: fixed;
	bottom: 20rpx;
	right: 25rpx;
	width: 100rpx;
	height: 100rpx;
}
</style>
