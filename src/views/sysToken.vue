<template>
	<div class="audit-content" style="padding-left: 20px;">
		<el-row>
		  <el-col class="elcold" style="width:100px;">申请时间:</el-col>
		  <el-col class="elcold" :span="18">{{newres.applyTime}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">主体ID:</el-col>
		  <el-col class="elcold" :span="18">{{newres.sysManager}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">主体名称:</el-col>
		  <el-col class="elcold" :span="18">{{newres.sysCode}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">标签编码:</el-col>
		  <el-col class="elcold" :span="18">{{newres.sysName}}</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		data() {
			return{
				newres:[],
			}
		},
		// created(){
		// 	console.log(this.$router,'---')
		// },
		mounted() {
			
			
			this.getTag()
		},
		methods:{
			getTag() {
				const url = '/api/ava/token/getTokenGrantFlow'
				const data = {
					procInsId:this.$route.query.procInsId,
					proDefKey:'',
					taskId:'',
					taskKey:'',
					businessId:''
				};
				this.$api
				    .post(url, data)
				    .then((result) => {
				       this.newres = result;
				    })
				    .catch(err => {
				        reject(err);
				    });
			}
		}
	}
</script>

<style scoped lang="scss">
.audit-content {
	background-color: white;
	height: 100%;
	line-height: 30px;
	padding: 0 20px !important;
	box-sizing: border-box;
	margin-bottom: 10px;
	font-size: 14px;
}
</style>
