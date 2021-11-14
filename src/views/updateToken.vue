<template>
	<div class="audit-content" style="padding-left: 20px;">
		<el-row>
		  <el-col class="elcold" style="width:100px;">申请用户:</el-col>
		  <el-col class="elcold" :span="18">{{newres.erp}}</el-col>
		</el-row>
		<el-row>
		  <el-col class="elcold" style="width:100px;">token:</el-col>
		  <el-col class="elcold" :span="18">{{newres.token}}</el-col>
		</el-row>
			申请标签列表:
		<!-- <el-table :data="tagList" stripe border>
		</el-table> -->
		<el-table
		      :data="tagList"
		      style="width: 100%">
			  <el-table-column
			        type="index"
					label="序号"
			        width="50">
			      </el-table-column>
		      <el-table-column
		        prop="P_subject_cn"
		        label="token"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        prop="P_subject_id"
		        label="主体ID"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        prop="P_tag_code"
		        label="标签编码"
				width="180">
		      </el-table-column>
			  <el-table-column
			    prop="P_tag_name"
			    label="标签名称"
				width="180">
			  </el-table-column>
		    </el-table>
	</div>
</template>

<script>
	export default{
		data() {
			return{
				newres:[],
				tagList:[],
				 // tableData: [{
				 //            date: '2016-05-02',
				 //            name: '王小虎',
				 //            address: '上海市普陀区金沙江路 1518 弄'
				 //          }, {
				 //            date: '2016-05-04',
				 //            name: '王小虎',
				 //            address: '上海市普陀区金沙江路 1517 弄'
				 //          }, {
				 //            date: '2016-05-01',
				 //            name: '王小虎',
				 //            address: '上海市普陀区金沙江路 1519 弄'
				 //          }, {
				 //            date: '2016-05-03',
				 //            name: '王小虎',
				 //            address: '上海市普陀区金沙江路 1516 弄'
				 //          }]
			}
		},
		mounted() {
			this.getTag()
		},
		methods:{
			getTag() {
				const url = '/api/ava/token/getSysGrantFlowDetails'
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
					   this.tagList = result.authTags
					   console.log('this.tagList',this.tagList)
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
