<script>
export default {
	onLaunch: function () {
		console.log('App Launch')

		// 开发时自动导航到特定页面，方便开发调试
		// 这里改用reLaunch方法，它可以打开任何页面，包括tabBar页面
		// 发布前记得注释掉这段代码
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/dev/dev'
			});
		}, 800);
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/*每个页面公共css */
</style>
