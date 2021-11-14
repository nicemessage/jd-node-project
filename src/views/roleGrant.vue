<template class="audit-content" style="padding-left: 20px;">
	<div>
		<el-row>
		  <el-col class="elcold" style="width:100px;">申请用户:</el-col>
		  <el-col class="elcold" :span="18">{{newres.userId}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">申请原因:</el-col>
		  <el-col class="elcold" :span="18">{{newres.keyword}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">角色编码:</el-col>
		  <el-col class="elcold" :span="18">{{newres.roleCode}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">角色名称:</el-col>
		  <el-col class="elcold" :span="18">{{newres.roleName}}</el-col>
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
		mounted() {
			
			
			this.getTag()
		},
		methods:{
			getTag() {
				const url = '/api/ava/userGrantRole/getFlowDetails'
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
