<template>
	<view class="release-container">
		<view class="header">
			<text class="title">发布旅游日记</text>
			<view class="my-notes-btn" @click="goToMyNotes">我的笔记</view>
		</view>

		<view class="form-container">
			<view class="form-item">
				<text class="label required">标题</text>
				<input class="input" v-model="formData.title" placeholder="请输入旅游日记标题" />
				<text v-if="errors.title" class="error-text">{{ errors.title }}</text>
			</view>

			<view class="form-row">
				<view class="form-item-half">
					<text class="label required">游玩时间(分钟)</text>
					<input class="input-short" type="number" v-model="formData.playTime" placeholder="游玩时间" />
					<text v-if="errors.playTime" class="error-text">{{ errors.playTime }}</text>
				</view>

				<view class="form-item-half">
					<text class="label required">费用</text>
					<input class="input-short" type="number" v-model="formData.money" placeholder="花费金额" />
					<text v-if="errors.money" class="error-text">{{ errors.money }}</text>
				</view>

				<view class="form-item-half">
					<text class="label required">人数</text>
					<input class="input-short" type="number" v-model="formData.personNum" placeholder="出行人数" />
					<text v-if="errors.personNum" class="error-text">{{ errors.personNum }}</text>
				</view>
			</view>

			<view class="form-item location-item">
				<text class="label required">位置</text>
				<view class="location-picker" @click="chooseLocation">
					<text>{{ formData.location || '点击选择位置' }}</text>
					<text class="location-icon">📍</text>
				</view>
				<text v-if="errors.location" class="error-text">{{ errors.location }}</text>
			</view>

			<view class="form-item">
				<text class="label required">内容描述</text>
				<textarea class="textarea" v-model="formData.content" placeholder="请描述您的旅游体验..." />
				<text v-if="errors.content" class="error-text">{{ errors.content }}</text>
			</view>

			<view class="form-item">
				<text class="label">图片上传 (可上传多张)</text>
				<view class="upload-area">
					<view class="upload-preview" v-for="(item, index) in formData.pictures" :key="'pic-' + index">
						<image class="preview-image" :src="item" mode="aspectFill"></image>
						<text class="delete-icon" @click="deleteImage(index)">×</text>
					</view>
					<view class="upload-btn" @click="chooseImage" v-if="formData.pictures.length < 9">
						<text class="upload-icon">+</text>
					</view>
				</view>
			</view>

			<view class="form-item">
				<text class="label">视频上传 (最多1个)</text>
				<view class="upload-area">
					<view class="upload-preview" v-for="(item, index) in formData.videos" :key="'vid-' + index">
						<video class="preview-video" :src="item"></video>
						<text class="delete-icon" @click="deleteVideo(index)">×</text>
					</view>
					<view class="upload-btn" @click="chooseVideo" v-if="formData.videos.length === 0">
						<text class="upload-icon">+</text>
					</view>
				</view>
			</view>

			<button class="submit-btn" @click="submitForm">发布日记</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { createRelease } from '../../api/api';

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
	videos: []
});

// 错误信息
const errors = reactive({
	title: '',
	playTime: '',
	money: '',
	personNum: '',
	content: '',
	location: ''
});

// 表单验证
const validateForm = () => {
	let isValid = true;

	// 重置错误信息
	for (let key in errors) {
		errors[key] = '';
	}

	// 标题验证
	if (!formData.title.trim()) {
		errors.title = '标题不能为空';
		isValid = false;
	} else if (formData.title.length > 50) {
		errors.title = '标题不能超过50个字符';
		isValid = false;
	}

	// 游玩时间验证
	if (!formData.playTime) {
		errors.playTime = '游玩时间不能为空';
		isValid = false;
	} else if (isNaN(Number(formData.playTime)) || Number(formData.playTime) <= 0) {
		errors.playTime = '请输入有效的游玩时间';
		isValid = false;
	}

	// 费用验证
	if (!formData.money) {
		errors.money = '费用不能为空';
		isValid = false;
	} else if (isNaN(Number(formData.money)) || Number(formData.money) < 0) {
		errors.money = '请输入有效的费用金额';
		isValid = false;
	}

	// 人数验证
	if (!formData.personNum) {
		errors.personNum = '人数不能为空';
		isValid = false;
	} else if (isNaN(Number(formData.personNum)) || Number(formData.personNum) <= 0 || !Number.isInteger(Number(formData.personNum))) {
		errors.personNum = '请输入有效的人数';
		isValid = false;
	}

	// 位置验证
	if (!formData.location) {
		errors.location = '位置不能为空';
		isValid = false;
	}

	// 内容描述验证
	if (!formData.content.trim()) {
		errors.content = '内容描述不能为空';
		isValid = false;
	} else if (formData.content.length < 10) {
		errors.content = '内容描述不能少于10个字符';
		isValid = false;
	}

	return isValid;
};

// 提交表单
const submitForm = () => {
	if (!validateForm()) {
		uni.showToast({
			title: '请完善表单信息',
			icon: 'none'
		});
		return;
	}

	// 转换数据类型
	const submitData = {
		...formData,

		playTime: Number(formData.playTime),
		money: Number(formData.money),
		personNum: Number(formData.personNum)
	};

	// 提交表单到服务器
	uni.showLoading({
		title: '发布中...'
	});

	createRelease(submitData).then(async res => {
		console.log(res)
		uni.hideLoading()
		await new Promise((resolve) => {
			uni.showToast({
				title: '发布成功',
				icon: 'success'
			})
			setTimeout(() => resolve(), 1000)
		})
		resetForm();
		// setTimeout(() => {
		// 	uni.navigateTo({
		// 		url: '/pages/MyNotes/MyNotes'
		// 	});
		// }, 1500);
	}).catch(e => { console.log(e) })
}

// 重置表单
const resetForm = () => {
	// 保留用户ID，清空其他字段
	const userID = formData.userID;

	// 重置表单数据
	Object.assign(formData, {
		userID,
		title: '',
		playTime: '',
		money: '',
		personNum: '',
		content: '',
		location: '',
		pictures: [],
		videos: []
	});

	// 清空错误信息
	for (let key in errors) {
		errors[key] = '';
	}
};

// 选择图片
const chooseImage = () => {
	uni.chooseImage({
		count: 9 - formData.pictures.length,
		success: (res) => {
			formData.pictures = [...formData.pictures, ...res.tempFilePaths];
		}
	});
};

// 删除图片
const deleteImage = (index) => {
	formData.pictures.splice(index, 1);
};

// 选择视频
const chooseVideo = () => {
	uni.chooseVideo({
		count: 1,
		success: (res) => {
			formData.videos = [res.tempFilePath];
		}
	});
};

// 删除视频
const deleteVideo = (index) => {
	formData.videos.splice(index, 1);
};

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
						openChooseLocation();
					},
					fail: () => {
						uni.showModal({
							title: '提示',
							content: '需要您授权位置信息才能选择位置',
							confirmText: '去设置',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting();
								}
							}
						});
					}
				});
			} else {
				// 已经授权，直接调用
				openChooseLocation();
			}
		},
		fail: (err) => {
			console.log('获取设置失败', err);
			// 使用手动输入作为备选方案
			showManualLocationInput();
		}
	});
};

// 打开位置选择器
const openChooseLocation = () => {
	try {
		uni.chooseLocation({
			success: (res) => {
				formData.location = res.name;
			},
			fail: (err) => {
				console.log('选择位置失败', err);
				if (err.errMsg && err.errMsg.includes('requiredPrivateInfos')) {
					uni.showToast({
						title: '位置服务未配置',
						icon: 'none'
					});
					// 使用手动输入作为备选方案
					showManualLocationInput();
				}
			}
		});
	} catch (e) {
		console.error('调用选择位置接口失败', e);
		showManualLocationInput();
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
				formData.location = res.content;
			}
		}
	});
};

// 跳转到我的笔记
const goToMyNotes = () => {
	uni.navigateTo({
		url: '/pages/MyNotes/MyNotes'
	});
};

// 生命周期钩子 - 组件挂载后
// onLoad(() => {
// 	// 获取当前用户ID
// 	try {
// 		const userInfo = uni.getStorageSync('userInfo');
// 		if (userInfo) {
// 			formData.userID = JSON.parse(userInfo).userId;
// 		} else {
// 			// 未登录，跳转到登录页
// 			uni.navigateTo({
// 				url: '/pages/login/login'
// 			});
// 		}
// 	} catch (e) {
// 		console.error('获取用户信息失败', e);
// 	}
// })

onShow(() => {
	try {
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo) {
			formData.userID = JSON.parse(userInfo).userId;
		} else {
			// 未登录，跳转到登录页
			uni.navigateTo({
				url: '/pages/login/login'
			});
		}
	} catch (e) {
		console.error('获取用户信息失败', e);
	}
})
</script>

<style scoped lang="scss">
.release-container {
	padding: 30rpx;
	background-color: #f8f8f8;
	min-height: 100vh;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}

		.my-notes-btn {
			background-color: #ff9500;
			color: #fff;
			padding: 15rpx 30rpx;
			border-radius: 30rpx;
			font-size: 28rpx;
			box-shadow: 0 5rpx 15rpx rgba(255, 149, 0, 0.3);
		}
	}

	.form-container {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);

		.form-item {
			margin-bottom: 40rpx;
			width: 90%;

			.label {
				display: block;
				font-size: 28rpx;
				color: #666;
				margin-bottom: 15rpx;

				&:nth-child(2) {
					margin-left: 15rpx;
				}

				&.required:after {
					content: '*';
					color: #ff4d4f;
					margin-left: 10rpx;
				}
			}

			.input {
				width: 100%;
				border: 1rpx solid #e0e0e0;
				border-radius: 10rpx;
				padding: 20rpx;
				font-size: 28rpx;
				background-color: #f9f9f9;
			}

			.textarea {
				height: 240rpx;
				width: 100%;
				border: 1rpx solid #e0e0e0;
				border-radius: 10rpx;
				padding: 20rpx;
				font-size: 28rpx;
				background-color: #f9f9f9;
			}

			.error-text {
				color: #ff4d4f;
				font-size: 24rpx;
				margin-top: 10rpx;
			}

			.location-picker {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				border: 1rpx solid #e0e0e0;
				border-radius: 10rpx;
				padding: 20rpx;
				font-size: 28rpx;
				background-color: #f9f9f9;

				.location-icon {
					margin-left: 10rpx;
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
					border-radius: 10rpx;
					overflow: hidden;

					.preview-image,
					.preview-video {
						width: 100%;
						height: 100%;
					}

					.delete-icon {
						position: absolute;
						top: 5rpx;
						right: 5rpx;
						width: 40rpx;
						height: 40rpx;
						background-color: rgba(0, 0, 0, 0.5);
						color: #fff;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 24rpx;
					}
				}

				.upload-btn {
					width: 180rpx;
					height: 180rpx;
					border: 2rpx dashed #ddd;
					border-radius: 10rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #999;

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
			width: 98%;

			.form-item-half {
				flex: 1;
				margin: 0 10rpx 20rpx;

				.label {
					display: block;
					font-size: 28rpx;
					color: #666;
					margin-bottom: 15rpx;
					white-space: nowrap;

					&:nth-child(2) {
						margin-left: 25rpx;
					}

					&.required:after {
						content: '*';
						color: #ff4d4f;
						margin-left: 10rpx;
					}
				}

				.input-short {
					width: 70%;
					border: 1rpx solid #e0e0e0;
					border-radius: 10rpx;
					padding: 20rpx;
					font-size: 28rpx;
					background-color: #f9f9f9;
				}

				.error-text {
					color: #ff4d4f;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
		}

		.submit-btn {
			background: linear-gradient(to right, #ff9500, #ff5e3a);
			color: #fff;
			border: none;
			border-radius: 50rpx;
			padding: 25rpx 0;
			font-size: 32rpx;
			margin-top: 30rpx;
			box-shadow: 0 10rpx 20rpx rgba(255, 94, 58, 0.2);
		}
	}
}
</style>
