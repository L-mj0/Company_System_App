<template>
  <view class="container">
    <view class="login-box">
      <text class="label">Username</text>
      <input
        v-model="username"
        placeholder="Enter your username"
        type="text"
        class="input"
      />
      <text class="label">Password</text>
      <input
        v-model="password"
        placeholder="Enter your password"
        type="password"
        class="input"
      />
      <button class="login-button" @click="login">Log in</button>
    </view>
    <button class="create-account-button" @click="toRegister">
      Create an account
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
		username: "",
		password: "",
    };
  },
  methods: {
    login() {
		if (!this.username || !this.password) {
			uni.showToast({ title: "Please enter username and password", icon: "none" });
			return;
		}

		const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
		db.transaction((tx) => {
			tx.executeSql(
				"SELECT * FROM users WHERE username = ? AND password = ?",
				[this.username, this.password],
				(tx, result) => {
					console.log(result.rows);
					if (result.rows.length > 0) {
						uni.showToast({ title: "Login successful", icon: "success" });
						uni.navigateTo({
						url: `/pages/index/index?username=${this.username}`,
						});
					} else {
						uni.showToast({ title: "Invalid username or password", icon: "none" });
					}
				},
				(tx, error) => {
					console.error("Login failed:", error.message);
				}
			);
		});
    },
    toRegister() {
		uni.navigateTo({ url: "/pages/register/register" });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  font-family: Consolas, monospace;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #0d1714;
}

.login-box {
  width: 80%;
  max-width: 400px;
  background: rgba(29, 29, 30, 0.5); /* 磨砂灰色 */
  padding: 30px 20px;
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.label {
  font-size: 20px;
  color: white;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
}

.input {
  width: 90%;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid rgba(32, 32, 33, 0.6); /* 浅灰色边框 */
  border-radius: 10px;
  background: rgba(19, 20, 22, 0.9); /* 黑色背景 */
  color: white;
  font-size: 16px;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.6); /* 浅色占位符 */
}

.login-button {
  width: 96%;
  padding: 5px;
  border: none;
  border-radius: 10px;
  background-color: #0acb74;
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.create-account-button {
  margin-top: 20px;
  width: 50%;
  padding: 10px;
  border: 2px solid #0cd27a; /* 绿色边框 */
  border-radius: 10px;
  background-color: #0d1714; /* 暗灰色背景 */
  color: white;
  font-size: 16px;
  text-align: center;
}
</style>
