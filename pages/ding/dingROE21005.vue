<template>
	<view class="container">
		<h1>{{ username }}，开启快乐一天~</h1>
		<!-- 动态类绑定 通过 :class -->
		<view
		  :class="['sign-button', signedIn ? 'signed' : 'unsigned']"
		  @click="handleSignIn"
		></view>

		<view class="sign-info" v-if="signedIn">
			<text>签到成功！</text>
			<text>{{ signTime }}</text>
			<text>{{ username }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			signedIn: false, // 签到状态
			signTime: "", // 签到时间
			username: "_", // 用户名
		};
	},
	methods: {
		handleSignIn() {
			if (!this.signedIn) {
				// 设置签到状态和时间
				this.signedIn = true;
				const now = new Date();
				this.signTime = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}时${now.getMinutes()}分${now.getSeconds()}秒`;

				// 更新数据库中当前用户的 ding 字段为 true
				this.updateSignInStatus();
			}
		},

		// 更新签到状态到数据库
		updateSignInStatus() {
			console.log(this.username);
			const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
			db.transaction((tx) => {
				tx.executeSql(
					"UPDATE users SET ding = ? WHERE username = ?",
					[true, this.username], // 设置 ding 字段为 true
					() => {
						console.log("用户签到状态已更新为 true");
					},
					(tx, error) => {
						console.error("更新签到状态失败：", error.message);
					}
				);
			});
		},

		// 检查用户是否已签到
		checkSignInStatus() {
			const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
			db.transaction((tx) => {
				tx.executeSql(
					"SELECT ding FROM users WHERE username = ?",
					[this.username],
					(tx, result) => {
						if (result.rows.length > 0) {
							const dingStatus = result.rows.item(0).ding;
							if (dingStatus) {
								this.signedIn = true;
								const now = new Date();
								this.signTime = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}时${now.getMinutes()}分${now.getSeconds()}秒`;
							}
						}
					},
					(tx, error) => {
						console.error("检查签到状态失败：", error.message);
					}
				);
			});
		},
	},


	onLoad(options) {
		if (!options.username) {
			uni.showToast({ title: "请先登录", icon: "none" });
			setTimeout(() => {
			uni.redirectTo({ url: "/pages/login/login" }); // 未登录，跳转回登录页
			}, 1000);
		} else {
			this.username = options.username; // 接收传递的用户名
			this.checkSignInStatus(); // 检查用户是否已经签到
		}
	},
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0d1714;
  font-family: Consolas, monospace;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff; 
  margin-bottom: 20px;
  text-align: center;
}

/* 签到按钮样式 */
.sign-button {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.unsigned {
  background-color: rgba(32, 32, 33, 0.7);
}

.signed {
  background-color: #0acb74;
}

.sign-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.sign-info text {
  font-size: 16px;
  margin: 5px 0;
  color: white;
}
</style>
