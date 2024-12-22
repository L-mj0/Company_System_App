<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化 WebSQL 数据库
			this.initDatabase();
		},
		methods:{
			initDatabase(){
				const db = openDatabase("appdb","1.0","App Database",2*1024*1024);
				if(!db){
					console.error("数据库初始化失败");
					return;
				}
				db.transaction((tx)=>{
					tx.executeSql(
						"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)",
						[],
						() => {
							console.log("用户表初始化成功");
						},
						(tx, error) => {
							console.error("用户表初始化失败: ",error.message);
						}
					);
				});
				// 数据库实例挂载到全局
				this.$db = db;
			},
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
