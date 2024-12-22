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
      <text class="label">Confirm Password</text>
      <input
        v-model="confirmPassword"
        placeholder="Confirm your password"
        type="password"
        class="input"
      />
      <button class="login-button" @click="register">Sign up</button>
    </view>
    <button class="create-account-button" @click="toLogin">
     Log in
    </button>
  </view>
</template>

<script>
export default {
	data() {
		return {
			username: "",
			password: "",
			confirmPassword: "",
		};
	},
	methods: {
		initializeDatabase() {
		  const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
		  db.transaction((tx) => {
			tx.executeSql(
			  `CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT UNIQUE,
				password TEXT,
				avatar_path TEXT DEFAULT '/static/1.png',
				ding BOOLEAN DEFAULT false
			  )`
			);
		  });
		},
		checkUsernameExists(callback) {
		  const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
		  db.transaction((tx) => {
			tx.executeSql(
			  "SELECT * FROM users WHERE username = ?",
			  [this.username],
			  (tx, result) => callback(result.rows.length > 0),
			  () => callback(false)
			);
		  });
		},
		
		register() {
		  if (!this.username || !this.password || !this.confirmPassword) {
			uni.showToast({ title: "Please fill out all fields", icon: "none" });
			return;
		  }
		  if (this.password !== this.confirmPassword) {
			uni.showToast({ title: "Passwords do not match", icon: "none" });
			return;
		  }
		  this.checkUsernameExists((exists) => {
			if (exists) {
			  uni.showToast({ title: "Username already exists", icon: "none" });
			  return;
			}
			const db = openDatabase("appdb", "1.0", "App Database", 2 * 1024 * 1024);
			db.transaction((tx) => {
			  tx.executeSql(
				"INSERT INTO users (username, password) VALUES (?, ?)",
				[this.username, this.password],
				() => {
				  uni.showToast({ title: "Registration successful", icon: "success" });
				  setTimeout(() => uni.navigateTo({ url: "/pages/login/login" }), 1000);
				},
				() => uni.showToast({ title: "Registration failed", icon: "none" })
			  );
			});
		  });
		},
		
		toLogin() {
			uni.navigateTo({ url: "/pages/login/login" });
		},
	},
	onLoad() {
		this.initializeDatabase();
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
  background: rgba(29, 29, 30, 0.5);
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
  border: 1px solid rgba(32, 32, 33, 0.6);
  border-radius: 10px;
  background: rgba(19, 20, 22, 0.9);
  color: white;
  font-size: 16px;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.6);
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
  cursor: pointer;
}

.create-account-button {
  margin-top: 20px;
  width: 50%;
  padding: 10px;
  border: 2px solid #0cd27a;
  border-radius: 10px;
  background-color: #0d1714;
  color: white;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}
</style>
