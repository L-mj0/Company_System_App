<template>
  <view class="container">
    <h1>Welcome, {{ username }}</h1>
    <view class="grid-container">
      <view class="grid-item" @click="navigateTo('about')">
        <text>公司介绍</text>
      </view>
      <view class="grid-item" @click="navigateTo('comment')">
        <text>评论区</text>
      </view>
      <view class="grid-item" @click="navigateTo('ding')">
        <text>考勤系统</text>
      </view>
      <view class="grid-item" @click="navigateTo('user')">
        <text>个人信息</text>
      </view>
      <view class="grid-item" @click="navigateTo('login')">
        <text>退出登录</text>
      </view>
      <view class="grid-item">
        <text>待添加...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: "", // 存储用户名
    };
  },
  onLoad(options) {
    // 检查是否登录
    if (!options.username) {
      uni.showToast({ title: "请先登录", icon: "none" });
      setTimeout(() => {
        uni.redirectTo({ url: "/pages/login/login" }); // 未登录，跳转回登录页
      }, 1000);
    } else {
      this.username = options.username; // 接收传递的用户名
    }
  },
  methods: {
    navigateTo(page) {
      console.log(`${page}`);
      uni.navigateTo({ url: `/pages/${page}/${page}?username=${this.username}` });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 50px;
  background-color: #0d1714;
  height: 100vh;
  font-family: Consolas, monospace;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: white;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 10px; /* 网格间隙 */
  width: 90%;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: rgba(29, 29, 30, 0.5);
  border: 1px solid rgba(5, 186, 105, 0.6);
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.grid-item:active {
  background-color: rgba(20, 20, 20, 0.7);
}
</style>
