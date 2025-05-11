<template>
	<view class="release-container">
		<view class="header">
			<text class="title">发布旅游日记</text>
			<view class="my-notes-btn" @click="goToMyNotes">我的笔记</view>
		</view>

		<view class="form-container">
			<view class="form-item">
				<text class="label required">标题
					<text style="color: rgba(236, 110, 173, 1)">*</text>
				</text>
				<input class="input" v-model="formData.title" placeholder="请输入旅游日记标题" />
				<text v-if="errors.title" class="error-text">{{ errors.title }}</text>
			</view>

			<view class="form-row">
				<view class="form-item-half">
					<text class="label required">游玩时间
						<text style="color: rgba(236, 110, 173, 1)">*</text>
					</text>
					<input class="input-short" type="number" v-model="formData.playTime" placeholder="时间/天" />
					<text v-if="errors.playTime" class="error-text" style="max-width: 140rpx;">{{ errors.playTime
					}}</text>
				</view>

				<view class="form-item-half">
					<text class="label required">费用
						<text style="color: rgba(236, 110, 173, 1)">*</text>
					</text>
					<input class="input-short" type="number" v-model="formData.money" placeholder="花费金额" />
					<text v-if="errors.money" class="error-text" style="max-width: 140rpx;">{{ errors.money }}</text>
				</view>

				<view class="form-item-half">
					<text class="label required">人数
						<text style="color: rgba(236, 110, 173, 1)">*</text>
					</text>
					<input class="input-short" type="number" v-model="formData.personNum" placeholder="出行人数" />
					<text v-if="errors.personNum" class="error-text" style="max-width: 140rpx;">{{ errors.personNum
					}}</text>
				</view>
			</view>

			<view class="form-item location-item">
				<text class="label required">位置
					<text style="color: rgba(236, 110, 173, 1)">*</text>
				</text>
				<view class="location-picker" @click="chooseLocation">
					<text>{{ formData.location || '点击选择位置' }}</text>
				</view>
				<text v-if="errors.location" class="error-text">{{ errors.location }}</text>
			</view>

			<view class="form-item">
				<text class="label required">内容描述
					<text style="color: rgba(236, 110, 173, 1)">*</text>
				</text>
				<textarea class="textarea" v-model="formData.content" placeholder="请描述您的旅游体验..." />
				<text v-if="errors.content" class="error-text">{{ errors.content }}</text>
			</view>

			<view class="form-item">
				<text class="label">图片上传 (最多5张)
					<text style="color: rgba(236, 110, 173, 1)">*</text>
				</text>
				<view class="upload-area">
					<view class="upload-preview" v-for="(item, index) in formData.pictures" :key="'pic-' + index">
						<image class="preview-image" :src="item" mode="aspectFill"></image>
						<text class="delete-icon" @click="deleteFile('image', index)">×</text>
					</view>
					<view class="upload-btn" @click="chooseFile('image')" v-if="formData.pictures.length < 9">
						<text class="upload-icon">+</text>
					</view>
				</view>
			</view>

			<view class="form-item">
				<text class="label">视频上传 (最多1个)</text>
				<view class="upload-area">
					<view class="upload-preview" v-for="(item, index) in formData.videos" :key="'vid-' + index">
						<video class="preview-video" :src="item"></video>
						<text class="delete-icon" @click="deleteFile('video', index)">×</text>
					</view>
					<view class="upload-btn" @click="chooseFile('video')" v-if="formData.videos.length === 0">
						<text class="upload-icon">+</text>
					</view>
				</view>
			</view>

			<view class="form-item" v-if="formData.videos.length > 0">
				<text class="label">视频封面</text>
				<view class="upload-area">
					<view class="upload-preview" v-if="formData.cover">
						<image class="preview-image" :src="formData.cover" mode="aspectFill"></image>
						<text class="delete-icon" @click="deleteFile('cover')">×</text>
					</view>
					<view class="upload-btn" @click="chooseFile('cover')" v-if="!formData.cover">
						<text class="upload-icon">+</text>
					</view>
				</view>
			</view>

			<button class="submit-btn" @click="submitForm">发布日记</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { createRelease, uploadFiles } from '../../api/api';
import { validateTitle, validateContent, validateLocation } from '../../utils/filter';

// 表单数据
const formData = reactive({
	userID: '', // 将从用户登录信息中获取
	title: '',
	playTime: '',
	money: '',
	personNum: '',
	content: '',
	location: '',
	pictures: [],
	videos: [],
	cover: ''
})

// 错误信息
const errors = reactive({
	title: '',
	playTime: '',
	money: '',
	personNum: '',
	content: '',
	location: '',
	pictures: ''
})

// 表单验证
const validateForm = () => {
	let isValid = true
	for (let key in errors) {
		errors[key] = ''
	}
	// 标题验证
	const titleVal = validateTitle(formData.title)  // 检验敏感词,防SQL注入
	if (!titleVal.isValid) {
		errors.title = titleVal.message
		isValid = false
	} else {
		formData.title = titleVal.filteredText
	}
	// 游玩时间验证
	if (!formData.playTime) {
		errors.playTime = '游玩时间不能为空'
		isValid = false
	} else if (isNaN(Number(formData.playTime)) || Number(formData.playTime) <= 0) {
		errors.playTime = '请输入有效的游玩时间'
		isValid = false
	}
	// 费用验证
	if (!formData.money) {
		errors.money = '费用不能为空'
		isValid = false
	} else if (isNaN(Number(formData.money)) || Number(formData.money) < 0) {
		errors.money = '请输入有效的费用金额'
		isValid = false
	}
	// 人数验证
	if (!formData.personNum) {
		errors.personNum = '人数不能为空'
		isValid = false
	} else if (isNaN(Number(formData.personNum)) || Number(formData.personNum) <= 0 || !Number.isInteger(Number(formData.personNum))) {
		errors.personNum = '请输入有效的人数'
		isValid = false
	}
	// 位置验证
	const locationVal = validateLocation(formData.location)  // 不能为空或太长
	if (!locationVal.isValid) {
		errors.location = locationVal.message
		isValid = false
	} else {
		formData.location = locationVal.filteredText
	}
	// 内容验证
	const contentVal = validateContent(formData.content)  // 检验敏感词,防SQL注入
	if (!contentVal.isValid) {
		errors.content = contentVal.message
		isValid = false
	} else {
		formData.content = contentVal.filteredText
	}
	// 图片验证
	if (!formData.pictures || formData.pictures.length === 0) {
		errors.pictures = '至少上传一张图片';
		isValid = false
	}
	return isValid
}

// 提交表单
const submitForm = async () => {
	if (!validateForm()) {
		uni.showToast({
			title: '请完善表单信息',
			icon: 'none'
		})
		return
	}
	uni.showLoading({
		title: '正在处理...'
	})
	try {
		if (formData.pictures.length > 0) {
			const pictureRes = await uploadFiles(formData.pictures, 'image')
			formData.pictures = pictureRes.pictures
		}
		if (formData.videos.length > 0) {
			const videoRes = await uploadFiles(formData.videos, 'video')
			formData.videos = videoRes.videos
		}
		if (formData.cover) {
			const coverRes = await uploadFiles(formData.cover, 'cover')
			formData.cover = coverRes.covers[0]
		}
		const submitData = {
			...formData,
			playTime: Number(formData.playTime),
			money: Number(formData.money),
			personNum: Number(formData.personNum)
		}
		await createRelease(submitData)
		uni.hideLoading()
		uni.showToast({
			title: '发布成功',
			icon: 'success'
		})
		resetForm()
		uni.navigateTo({url:'/pages/notes/notes'})
	} catch (e) {
		console.log('发布过程失败:', e)
		uni.hideLoading()
		uni.showToast({
			title: '发布失败，请重试',
			icon: 'none'
		})
	}
}

// 重置表单
const resetForm = () => {
	// 保留用户ID，清空其他字段
	const userID = formData.userID
	Object.assign(formData, {
		userID,
		title: '',
		playTime: '',
		money: '',
		personNum: '',
		content: '',
		location: '',
		pictures: [],
		videos: [],
		cover: ''
	})
	for (let key in errors) {
		errors[key] = ''
	}
}

// 选择文件
const chooseFile = (type: string) => {
	if (type === 'image') {
		uni.chooseImage({
			count: 5 - formData.pictures.length,
			success: (res) => {
				uni.showLoading({ title: '处理图片中...' })
				let count = 0
				const totalImages = res.tempFilePaths.length
				res.tempFilePaths.forEach(imagePath => {
					uni.compressImage({
						src: imagePath,
						quality: 80,  // 压缩质量(0-100),正比于照片质量,反比于压缩率
						success: (compressRes) => {
							formData.pictures.push(compressRes.tempFilePath)
							count++
							if (count >= totalImages) {
								uni.hideLoading()
							}
						},
						fail: () => {
							// 压缩失败则使用原图
							formData.pictures.push(imagePath);
							uni.showToast({
								title: '部分图片压缩失败',
								icon: 'none',
								duration: 1000
							});
							count++
							if (count >= totalImages) {
								uni.hideLoading()
							}
						}
					})
				})
			}
		})
	} else if (type === 'video') {
		uni.chooseVideo({
			count: 1,
			compressed: true, // 开启视频压缩
			success: (res) => {
				uni.showLoading({ title: '处理视频中...' })
				// 视频大小和时长检查
				uni.getVideoInfo({
					src: res.tempFilePath,
					success: (videoInfo) => {
						uni.hideLoading()
						if (videoInfo.duration > 60) {
							uni.showToast({
								title: '视频时长不能超过1分钟',
								icon: 'none'
							})
						} else {
							formData.videos = [res.tempFilePath]
						}
					},
					fail: () => {
						uni.hideLoading()
						formData.videos = [res.tempFilePath]
					}
				})
			}
		})
	} else if (type === 'cover') {
		uni.chooseImage({
			count: 1,
			success: (res) => {
				uni.showLoading({ title: '处理封面中...' })
				uni.compressImage({
					src: res.tempFilePaths[0],
					quality: 80,
					success: (compressRes) => {
						uni.hideLoading()
						formData.cover = compressRes.tempFilePath
					},
					fail: () => {
						uni.hideLoading()
						// 压缩失败则使用原图
						formData.cover = res.tempFilePaths[0]
						uni.showToast({
							title: '封面压缩失败',
							icon: 'none',
							duration: 1000
						})
					}
				})
			}
		})
	}
}

// 删除文件
const deleteFile = (type: string, index?: number) => {
	if (type === 'image') {
		formData.pictures.splice(index, 1)
	} else if (type === 'video') {
		formData.videos.splice(index, 1)
	} else if (type === 'cover') {
		formData.cover = ''
	}
}

// 选择位置
const chooseLocation = () => {
	// 先检查位置权限
	uni.getSetting({
		success: (res) => {
			if (!res.authSetting['scope.userLocation']) {
				// 未授权，申请权限
				uni.authorize({
					scope: 'scope.userLocation',
					success: () => {
						// 获取权限后调用位置选择器
						openChooseLocation()
					},
					fail: () => {
						uni.showModal({
							title: '提示',
							content: '需要您授权位置信息才能选择位置',
							confirmText: '去设置',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting()
								}
							}
						})
					}
				})
			} else {
				// 已经授权，直接调用
				openChooseLocation()
			}
		},
		fail: (err) => {
			console.log('获取设置失败', err)
			// 使用手动输入作为备选方案
			showManualLocationInput()
		}
	})
}

// 打开位置选择器
const openChooseLocation = () => {
	try {
		uni.chooseLocation({
			success: (res) => {
				// 位置选择成功后直接赋值，地图API返回的位置通常是安全的
				formData.location = res.name
			},
			fail: (err) => {
				console.log('选择位置失败', err)
				if (err.errMsg && err.errMsg.includes('requiredPrivateInfos')) {
					uni.showToast({
						title: '位置服务未配置',
						icon: 'none'
					})
					// 使用手动输入作为备选方案
					showManualLocationInput()
				}
			}
		})
	} catch (e) {
		console.error('调用选择位置接口失败', e)
		showManualLocationInput()
	}
};

// 展示手动输入位置的对话框
const showManualLocationInput = () => {
	uni.showModal({
		title: '手动输入位置',
		editable: true,
		placeholderText: '请输入您的位置',
		success: (res) => {
			if (res.confirm && res.content) {
				// 手动输入需要进行过滤
				const locationValidation = validateLocation(res.content);
				if (locationValidation.isValid) {
					formData.location = locationValidation.filteredText;
				} else {
					uni.showToast({
						title: locationValidation.message,
						icon: 'none'
					});
				}
			}
		}
	})
}

// 跳转到我的笔记
const goToMyNotes = () => {
	uni.navigateTo({
		url: '/pages/notes/notes'
	})
}

onShow(() => {
	try {
		const userInfo = uni.getStorageSync('userInfo')
		if (userInfo) {
			formData.userID = JSON.parse(userInfo).userId
		} else {
			// 未登录，跳转到登录页
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	} catch (e) {
		console.error('获取用户信息失败', e)
	}
})
</script>

<style scoped lang="scss">
.release-container {
	padding: 30rpx;
	background: linear-gradient(to bottom, #f0f5ff, #ffffff);
	min-height: 100vh;
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

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;

		.title {
			font-size: 40rpx;
			font-weight: bold;
			background: linear-gradient(90deg, #3494E6, #EC6EAD);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.1);
		}

		.my-notes-btn {
			background: linear-gradient(135deg, #3494E6, #EC6EAD);
			color: #fff;
			padding: 15rpx 30rpx;
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

	.form-container {
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5rpx);
		border: 1px solid rgba(255, 255, 255, 0.6);
		position: relative;
		overflow: hidden;

		.form-item {
			margin-bottom: 40rpx;
			width: 100%;

			.label {
				display: block;
				font-size: 28rpx;
				color: #555;
				margin-bottom: 15rpx;
				font-weight: 500;
				position: relative;
				display: inline-block;

				&::after {
					content: '';
					position: absolute;
					bottom: -5rpx;
					left: 0;
					width: 30rpx;
					height: 2rpx;
					background: linear-gradient(90deg, #3494E6, transparent);
				}

				&:nth-child(2) {
					margin-left: 25rpx;
				}

				&.required:after {
					content: '';
					color: #EC6EAD;
					margin-left: 10rpx;
					background: none;
					height: auto;
					width: auto;
				}
			}

			.input {
				width: 95%;
				border: 1rpx solid rgba(52, 148, 230, 0.2);
				border-radius: 15rpx;
				padding: 20rpx;
				font-size: 28rpx;
				background-color: rgba(255, 255, 255, 0.8);
				transition: all 0.3s ease;
				box-shadow: inset 0 2rpx 5rpx rgba(0, 0, 0, 0.05);

				&:focus {
					border-color: #3494E6;
					box-shadow: 0 0 10rpx rgba(52, 148, 230, 0.2);
				}
			}

			.textarea {
				height: 240rpx;
				width: 95%;
				border: 1rpx solid rgba(52, 148, 230, 0.2);
				border-radius: 15rpx;
				padding: 20rpx;
				font-size: 28rpx;
				background-color: rgba(255, 255, 255, 0.8);
				transition: all 0.3s ease;
				box-shadow: inset 0 2rpx 5rpx rgba(0, 0, 0, 0.05);

				&:focus {
					border-color: #3494E6;
					box-shadow: 0 0 10rpx rgba(52, 148, 230, 0.2);
				}
			}

			.error-text {
				color: #EC6EAD;
				font-size: 24rpx;
				margin-top: 10rpx;
				background-color: rgba(236, 110, 173, 0.1);
				padding: 6rpx 12rpx;
				border-radius: 10rpx;
				display: inline-block;
			}

			.location-picker {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 95%;
				border: 1rpx solid rgba(52, 148, 230, 0.2);
				border-radius: 15rpx;
				padding: 20rpx;
				font-size: 28rpx;
				background-color: rgba(255, 255, 255, 0.8);
				transition: all 0.3s ease;

				&:active {
					background-color: rgba(52, 148, 230, 0.05);
				}

				.location-icon {
					margin-left: 10rpx;
					font-size: 32rpx;
					color: #3494E6;
				}
			}

			.upload-area {
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;

				.upload-preview {
					width: 180rpx;
					height: 180rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					position: relative;
					border-radius: 15rpx;
					// overflow: hidden;
					box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);
					transition: all 0.3s ease;

					&:active {
						transform: scale(0.98);
					}

					.preview-image,
					.preview-video {
						width: 100%;
						height: 100%;
						border-radius: inherit;
					}

					.delete-icon {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
						width: 40rpx;
						height: 40rpx;
						background: linear-gradient(135deg, #ff7676, #f54242);
						color: #fff;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 24rpx;
						transition: all 0.3s ease;

						&:active {
							transform: scale(0.9);
							background-color: rgba(236, 110, 173, 1);
						}
					}
				}

				.upload-btn {
					width: 180rpx;
					height: 180rpx;
					border: 2rpx dashed rgba(52, 148, 230, 0.4);
					border-radius: 15rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #3494E6;
					background-color: rgba(52, 148, 230, 0.05);
					transition: all 0.3s ease;

					&:active {
						background-color: rgba(52, 148, 230, 0.1);
						transform: scale(0.98);
					}

					.upload-icon {
						font-size: 60rpx;
					}
				}
			}
		}

		.form-row {
			display: flex;
			flex-wrap: wrap;
			margin: 0 -10rpx 20rpx;
			width: 100%;

			.form-item-half {
				flex: 1;
				margin: 0 10rpx 20rpx;

				.label {
					display: block;
					font-size: 28rpx;
					color: #555;
					margin-bottom: 15rpx;
					white-space: nowrap;
					font-weight: 500;
					position: relative;
					display: inline-block;

					&::after {
						content: '';
						position: absolute;
						bottom: -5rpx;
						left: 0;
						width: 30rpx;
						height: 2rpx;
						background: linear-gradient(90deg, #3494E6, transparent);
					}

					&:nth-child(2) {
						margin-left: 25rpx;
					}

					&.required:after {
						content: '';
						color: #EC6EAD;
						margin-left: 100rpx;
						background: none;
						height: auto;
						width: auto;
					}
				}

				.input-short {
					width: 70%;
					border: 1rpx solid rgba(52, 148, 230, 0.2);
					border-radius: 15rpx;
					padding: 20rpx;
					font-size: 28rpx;
					background-color: rgba(255, 255, 255, 0.8);
					transition: all 0.3s ease;
					box-shadow: inset 0 2rpx 5rpx rgba(0, 0, 0, 0.05);

					&:focus {
						border-color: #3494E6;
						box-shadow: 0 0 10rpx rgba(52, 148, 230, 0.2);
					}
				}

				.error-text {
					color: #EC6EAD;
					font-size: 24rpx;
					margin-top: 10rpx;
					background-color: rgba(236, 110, 173, 0.1);
					padding: 6rpx 12rpx;
					border-radius: 10rpx;
					display: inline-block;
				}
			}
		}

		.submit-btn {
			background: linear-gradient(to right, #3494E6, #EC6EAD);
			color: #fff;
			border: none;
			border-radius: 50rpx;
			padding: 0;
			font-size: 32rpx;
			margin-top: 30rpx;
			box-shadow: 0 10rpx 20rpx rgba(52, 148, 230, 0.3);
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
				box-shadow: 0 5rpx 10rpx rgba(52, 148, 230, 0.2);
			}
		}
	}
}
</style>
