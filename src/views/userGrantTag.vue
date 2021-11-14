<template>
	<div class="audit-content" style="padding-left: 20px;">
		<el-row>
		  <el-col class="elcold" style="width:100px;">申请用户:</el-col>
		  <el-col class="elcold" :span="18">{{newres.userId}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">申请原因:</el-col>
		  <el-col class="elcold" :span="18">{{newres.reason}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">主体ID:</el-col>
		  <el-col class="elcold" :span="18">{{newres.subjectId}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">主体名称:</el-col>
		  <el-col class="elcold" :span="18">{{newres.subjectCh}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">标签编码:</el-col>
		  <el-col class="elcold" :span="18">{{newres.tagCode}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">标签名称:</el-col>
		  <el-col class="elcold" :span="18">{{newres.tagName}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">业务负责人:</el-col>
		  <el-col class="elcold" :span="18">{{newres.dynamicPerson}}</el-col>
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
				const url = '/api/ava/userGrantTag/getFlowDetails'
				const data = {
					procInsId:this.$route.query.procInsId,
					proDefKey:'',
					taskId:'',
					taskKey:'',
					businessId:''
				};
				   this.$api.post(url, data)
				    .then((result) => {
				       this.newres = result;
				    })
				    .catch(err => {
				          console.log(err)
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
	// margin-top: 10px;
	margin-bottom: 10px;
	font-size: 14px;
}
</style>
