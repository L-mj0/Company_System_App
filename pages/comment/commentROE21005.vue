<template>
	<view class="container">
		<view class="input-section">
			<textarea class="comment-input" placeholder="请输入评论内容" v-model="comment"></textarea>
			<button @click="postComment" class="post-btn">发布</button>
		</view>

    <view class="comments-section">
		<h2>评论区</h2>
		<view v-if="comments.length > 0" class="comments-list">
			<view v-for="(item, index) in comments" :key="index" class="comment-item">
				<image :src="item.avatarUrl" class="avatar" />
				<view class="comment-content">
					<text class="author">{{ item.author }}:</text>
					<text>{{ item.comment }}</text>
					<!-- 删除按钮，仅显示当前用户发布的评论的删除按钮 -->
					<text v-if="item.author === username" @click="deleteComment(item.id)" class="delete-btn">删除</text>
			  </view>
			</view>
		</view>
		<text v-else class="no-comments">暂无评论，快来发布吧！</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			db: null, // 数据库实例
			comment: "", // 输入的评论内容
			comments: [], // 评论列表
			username: "", // 当前用户的用户名
			avatarUrl: "/static/1.png" // 默认头像路径
		};
	},
	methods: {
		// 初始化数据库并创建评论表
		initDB() {
			this.db = openDatabase("commentsDB", "1.0", "Comments Database", 204800);
		  
			if (!this.db) {
				console.error("数据库初始化失败");
				return;
			}
		
			// 如果数据库存在，直接加载数据；如果数据库不存在，创建数据库并表
			this.db.transaction((tx) => {
				tx.executeSql(
					"SELECT COUNT(*) FROM comments",
					[],
					() => {
						console.log("数据库已存在，直接加载数据");
					},
					(tx, error) => {
						// 如果查询失败，表示comments表不存在，需要创建
						console.log("评论表不存在，开始创建表");
						tx.executeSql(
						  "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, author TEXT, comment TEXT)",
						  [],
						  () => console.log("评论表已创建成功"),
						  (tx, error) => console.error("创建评论表失败", error)
						);
					}
				);
			});
		},

		// 发布评论
		postComment() {
			if (!this.comment) {
				uni.showToast({ title: "请填写评论内容！", icon: "none" });
				return;
			}

			this.db.transaction((tx) => {
				tx.executeSql(
				  "INSERT INTO comments (author, comment) VALUES (?, ?)",
				  [this.username, this.comment], // 直接使用 username 作为 author
				  () => {
					console.log("评论发布成功！");
					this.comment = ""; // 清空评论输入框
					this.loadComments(); // 更新评论列表
				  },
				  (tx, error) => console.error("发布评论失败", error)
				);
		  });
		},

		// 加载所有评论
		loadComments() {
			this.db.transaction((tx) => {
				tx.executeSql(
					"SELECT * FROM comments",
					[],
					(tx, result) => {
					const rows = result.rows;
					this.comments = [];
					for (let i = 0; i < rows.length; i++) {
					  const commentItem = rows.item(i);
					  this.comments.push({
						...commentItem,
						avatarUrl: this.avatarUrl || "/static/1.png" // 默认头像路径
					  });
					}
				  },
				  (tx, error) => console.error("加载评论失败", error)
				);
			});
		},

		// 删除评论
		deleteComment(commentId) {
			this.db.transaction((tx) => {
				tx.executeSql(
					"DELETE FROM comments WHERE id = ?",
					[commentId],
					() => {
						console.log("评论删除成功！");
						this.loadComments(); // 删除后重新加载评论
					},
					(tx, error) => console.error("删除评论失败", error)
				);
			});
		},
	},

	// 页面加载时初始化数据库并加载评论
	onLoad(options) {
		if (!options.username) {
		  uni.showToast({ title: "请先登录", icon: "none" });
		  setTimeout(() => {
			uni.redirectTo({ url: "/pages/login/login" }); // 未登录，跳转回登录页
		  }, 1000);
		} else {
		  this.username = options.username; // 接收传递的用户名
		  this.initDB(); // 初始化数据库
		  this.loadComments(); // 加载评论
		}
	},
};
</script>

<style>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.input-section {
  margin-bottom: 20px;
}

.comment-input {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  height: 100px;
  resize: none;
}

.post-btn {
  width: 100%;
  padding: 10px;
  background-color: #0acb74;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}

.comments-section {
  margin-top: 20px;
}

h2 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}

.comments-list {
  border-top: 1px solid #ddd;
}

.comment-item {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-content {
  flex: 1;
  color: #333;
}

.author {
  font-weight: bold;
  margin-right: 10px;
  color: #007aff;
}

.delete-btn {
  margin-left: 10px;
  color: blue;
  cursor: pointer;
  font-size: 14px;
}

.no-comments {
  text-align: center;
  color: #aaa;
}
</style>
