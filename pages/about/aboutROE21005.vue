<template>
	<view class="container">
		<view class="header">
			<text class="company-name">{{ companyName }}</text>
		</view>

    <view class="section">
		<text class="title">公司简介</text>
		<text class="content">
			本公司致力于提供优质的技术解决方案和服务，涵盖软件开发、跨平台应用设计、云服务与大数据分析等领域。我们的团队由经验丰富的工程师和技术专家组成，始终秉持创新和卓越的理念，为客户创造价值。
		</text>
    </view>

    <!-- 业务范围 -->
    <view class="section">
		<text class="title">业务范围</text>
		<view class="list">
			<text>1. 软件开发与技术咨询</text>
			<text>2. 移动端与跨平台应用开发</text>
			<text>3. 企业级云服务解决方案</text>
			<text>4. 大数据分析与人工智能</text>
		</view>
    </view>

    <view class="section">
		<text class="title">联系我们</text>
		<view class="contact">
			<text>电话：400-123-4567</text>
			<text>邮箱：contact@company.com</text>
			<text>地址：北京市某某区某某路123号</text>
		</view>
    </view>

    <view class="section">
		<text class="title">我们的团队</text>

    <view class="team-member">
		<image class="team-image" src="/static/1.png" mode="aspectFill" />
        <image class="team-image" src="/static/2.png" mode="aspectFill" />
		<view class="contact">
          <text class="name">董事长：xxxxxxxx lI</text>
          <text class="hobbies">爱好：xxx,xxx,xxx</text>
        </view>
    </view>

    <view class="team-member">
		<image class="team-image" src="/static/1.png" mode="aspectFill" />
		<image class="team-image" src="/static/2.png" mode="aspectFill" />
        <view class="contact">
			  <text class="name">主设计师：xxxxxxxx L</text>
			  <text class="hobbies">爱好：xx,xx</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      companyName: "xxxxxxx公司",
    };
  },
};
</script>

<style>
.container {
  padding: 20px;
  background-color: #0d1714;
  color: white;
  font-family: Consolas, monospace;
}


.header {
  text-align: center;
  margin-bottom: 20px;
}
.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #0acb74;
}

.section {
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}
.content {
  font-size: 14px;
  line-height: 22px;
  color: #ccc;
}
.list text {
  display: block;
  font-size: 14px;
  line-height: 24px;
  color: #bbb;
}
.contact text {
  display: block;
  font-size: 14px;
  line-height: 22px;
  color: #bbb;
}

.team-member {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #444;
  border-radius: 15px;
  padding: 15px;
  background-color: rgba(29, 29, 30, 0.5); 
}

.name {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.hobbies {
  font-size: 14px;
  color: #ccc; 
}

.team-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
