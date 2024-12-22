<template>
	<view class="container">
		<view v-if="userFound" class="profile">
			<image class="avatar" :src="avatarUrl" />
			<view class="info">
				<text class="info-item">用户名: {{ username }}</text>
				<text class="info-item">密码: {{ password }}</text>
				<text class="info-item">签到状态: {{ dingStatus }}</text>
			</view>

			<!-- 修改密码功能 -->
			<view class="change-password">
				<button class="btn" @click="showPasswordModal">修改密码</button>
			</view>
		</view>

		<!-- 查询结果不存在 -->
		<view v-else>
			<text class="not-found">未查找到用户信息</text>
		</view>

		<!-- 弹出框 -->
		<view v-if="showModal" class="modal">
			<view class="modal-content">
				<text class="modal-title">修改密码</text>
				<input class="password-input" placeholder="当前密码" v-model="currentPassword" password />
				<input class="password-input" placeholder="新密码" v-model="newPassword" password />
				<view class="modal-buttons">
					<button class="btn" @click="changePassword">确认修改</button>
					<button class="btn-cancel" @click="hidePasswordModal">取消</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			username: "", // 当前用户名
			avatarUrl: "/static/1.png", // 默认头像
			password: "", // 查询到的密码
			userFound: false, // 是否找到用户信息
			dingStatus: "_", // 签到状态文本
			currentPassword: "", // 当前输入的密码
			newPassword: "", // 输入的新密码
			showModal: false, // 弹出框显示状态
		};
	},
	methods: {
		
		loadUserInfo() {
			const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
			console.log("username: ", this.username);
			db.transaction((tx) => {
				tx.executeSql(
					"SELECT * FROM users WHERE username = ?",
					[this.username],
					(tx, result) => {
						if (result.rows.length > 0) {
							const user = result.rows.item(0);
							this.userFound = true;
							this.password = user.password;
							this.avatarUrl = user.avatar_path || "/static/1.png";
							this.dingStatus = user.ding ? "已签到" : "未签到";
						} else {
							this.userFound = false;
							console.warn("未找到用户信息");
						}
					},
					(tx, error) => {
						console.error("查询用户信息失败：", error.message);
						this.userFound = false;
					}
				);
			});
		},
		// 显示修改密码弹出框
		showPasswordModal() {
			this.showModal = true;
		},
		// 隐藏修改密码弹出框
		hidePasswordModal() {
			this.showModal = false;
			this.currentPassword = "";
			this.newPassword = "";
		},
		// 修改密码功能
		changePassword() {
			if (this.currentPassword !== this.password) {
				uni.showToast({ title: "当前密码错误", icon: "none" });
				return;
			}
			if (!this.newPassword) {
				uni.showToast({ title: "新密码不能为空", icon: "none" });
				return;
			}

			const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
			db.transaction((tx) => {
				tx.executeSql(
					"UPDATE users SET password = ? WHERE username = ?",
					[this.newPassword, this.username],
					() => {
						this.password = this.newPassword;
						this.hidePasswordModal();
						uni.showToast({ title: "密码修改成功", icon: "success" });
					},
					(tx, error) => {
						console.error("修改密码失败：", error.message);
						uni.showToast({ title: "修改密码失败", icon: "none" });
					}
				);
			});
		},
	},

	onLoad(options) {
		if (!options.username) {
			uni.showToast({ title: "请先登录", icon: "none" });
			setTimeout(() => {
				uni.redirectTo({ url: "/pages/login/login" });
			}, 1000);
		} else {
			this.username = options.username;
			this.loadUserInfo();
		}
	},
};
</script>

<style scoped>
/* 容器样式 */
.container {
	background-color: #0d1714;
	padding: 20px;
	color: white;
	font-family: Consolas, monospace;
	height: 100vh;
}

.profile {
	text-align: center;
	margin-top: 20px;
}

.avatar {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	margin-bottom: 20px;
	border: 2px solid #ffffff44;
}

.info {
	font-size: 16px;
	line-height: 2;
	color: white;
}

.info-item {
	display: block;
	margin-bottom: 10px;
}

.change-password {
	margin-top: 20px;
}

/* 按钮样式 */
.btn {
  margin-top: 20px;
  width: 50%;
  padding: 10px;
  border: 2px solid #0cd27a; 
  border-radius: 10px;
  background-color: #0d1714; 
  color: white;
  font-size: 16px;
  text-align: center;
}

.btn:active {
	background-color: #005bb5;
}

.btn-cancel {
  background-color: #0d1714;
  margin-top: 20px;
  width: 30%;
  padding: 10px;
  border: 2px solid #ff4d4f; 
  border-radius: 10px;
  color: white;
  font-size: 16px;
  text-align: center;
}

.btn-cancel:active {
	background-color: #d32f2f;
}

/* 弹出框样式 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	background-color: #1c1c1e;
	padding: 20px;
	border-radius: 8px;
	width: 80%;
	text-align: center;
}

.modal-title {
	font-size: 20px;
	color: white;
	margin-bottom: 20px;
}

.password-input {
	width: 100%;
	margin-bottom: 10px;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 14px;
	background-color: #2c2c2e;
	color: white;
}

.modal-buttons {
	display: flex;
	justify-content: center;
	margin-top: 20px;
}
</style>