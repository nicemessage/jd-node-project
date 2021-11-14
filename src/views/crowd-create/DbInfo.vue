<template>
    <div class="db-info">
        <el-form :model="CrowdSourceVO" :rules="rules" ref="form">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="数据类型" prop="dsCol" label-width="120px">
                        <el-radio-group v-model="CrowdSourceVO.dsCol">
                            <el-radio :label="item.id" v-for="item in idMappingList" :key="item.id">{{ item.dsColName }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="集群" prop="clusterName" label-width="120px">
                        <el-select class="com-select com-width" size="small" v-model="CrowdSourceVO.clusterName" filterable clearable @change="changeCluster">
                            <el-option v-for="item in clusterList" :key="item.clusterName" :label="item.clusterName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="所属库" prop="dbName" label-width="120px">
                        <span slot="label" >
                            <el-tooltip placement="top" >
                             <div slot="content">
                                 无法选择库表时，请移步银河-权限中心申请表权限。
                             </div>
                             <i class="el-icon-question" style="color: #999"></i>
                          </el-tooltip>
                          所属库
                       </span>
                        <el-select
                            class="com-select com-width"
                            size="small"
                            v-model="CrowdSourceVO.dbName"
                            filterable
                            clearable
                            :loading="dbloading"
                            @change="changeDB"
                        >
                            <el-option v-for="item in dbList" :key="item" :label="item" :value="item"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="所属表" prop="tableName" label-width="120px">
                        <el-select
                            v-model="CrowdSourceVO.tableName"
                            size="small"
                            filterable
                            clearable
                            remote
                            class="com-select com-width"
                            @change="changeTable"
                            :remote-method="searchTable"
                        >
                            <template v-for="(item,index) in tableList">
                                <el-option :key="index" :label="item" :value="item" v-if="index<20"> </el-option>
                            </template>
                        </el-select>

                    </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="ID列" prop="columnName" label-width="120px">
                        <el-select v-model="CrowdSourceVO.columnName" filterable class="com-select com-width" size="small" clearable :loading="dbloading">
                            <el-option
                                v-for="item in colList"
                                :key="item.name"
                                :disabled="checkIDFromEnum(item.name)"
                                :label="item.name"
                                :value="item.name"
                            >
                            </el-option>
                            <!-- :disabled="CrowdSourceVO.enumColumnName == item.name" -->
                            <!--                :disabled="CrowdSourceVO.enumColumnName == ${item.name}"-->
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="枚举列" prop="enumColumnName" label-width="120px">
                        <el-select v-model="CrowdSourceVO.enumColumnName" filterable class="com-select com-width" size="small" clearable>
                            <el-option
                                v-for="item in colList"
                                :key="item.name"
                                :disabled="CrowdSourceVO.columnName == item.name"
                                :label="item.name"
                                :value="item.name"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="枚举值" prop="enums" label-width="120px">
                        <div class="enum-ipt">
                            <el-input v-model="enumVal" class="com-input com-width" size="small" clearable placeholder="请输入枚举值">
                                <el-button slot="append" type="primary" @click="addEnum" size="small" style="background: #2d68ff;color: #fff;border-radius: 0 3px 3px 0;">添加</el-button>
                            </el-input>
                        </div>
                        <div class="tag-list">
                            <el-tag class="enum-item" v-for="(tag, index) in CrowdSourceVO.enums" :key="index" @close="delEnums(index)" closable>{{
                                tag
                            }}</el-tag>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row> -->

            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="筛选信息" prop="screen" label-width="120px">
                        <div style="padding-left: 20px;">
                            <el-button type="primary" :disabled="!canFilter" @click="addsScreen" size="small">新增筛选器</el-button>
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="筛选连接关系" prop="logicOp" label-width="120px">
                        <el-radio-group size="small" v-model="CrowdSourceVO.logicOp">
                            <el-radio-button label="AND">且</el-radio-button>
                            <el-radio-button label="OR">或</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <div style="padding: 0 20px 20px 140px;">
                        <el-table
                                :data="filterData"
                                border
                                style="width: 80%">
                            <el-table-column label="序号" type="index" width="50"></el-table-column>
                            <el-table-column
                                    prop="fieldName"
                                    label="字段信息"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="fieldType"
                                    label="字段类型"
                                    width="180">
                                    <template slot-scope="scope">
                                        {{{"STRING":"字符串","NUMBER":"数字","DATETIME":"时间","TIMERANGE":"时间"}[scope.row.fieldType]}}
                                    </template>
                            </el-table-column>
                            <el-table-column
                                    prop="values"
                                    label="筛选条件">
                                <template slot-scope="scope">
                                    {{formatValues(scope.row)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作">
                                <template slot-scope="scope">
                                    <a class="a" @click="edit(scope.$index)">编辑</a>
                                    <a class="a" @click="del(scope.$index)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>

            </el-row>
        </el-form>
        <DBFilterDialog :config="selectConfig!=-1?filterData[selectConfig]:null" :colID="CrowdSourceVO.columnName" :colList="colList" :show="showFilterDialog" @finishFilterEdit="finishEditConfig" @closeDialog="closeFilterDialog"></DBFilterDialog>
    </div>
</template>

<script lang="ts">
/**
 * @name DbCrowdInfo
 * @author shileilei3
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Watch } from 'vue-property-decorator';
import {State} from "vuex-class";
import DBFilterDialog from "./DbFilterDialog.vue";

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明

// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}
@Component({
    components: {DBFilterDialog}
})
export default class DbInfo extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;

    private dbList: Array<string> = [];
    private clusterList: any[] = [{clusterName:'深海测试',id:1}];
    private tableList: any[] = [];
    private dataList: any[] = [];
    private idMappingList: any[] = [];
    private colList: any[] = [];
    private dbloading: boolean = false;
    private tbloading: boolean = false;
    private enumVal: string = '';
    private isGetTable: boolean = true;
    private totalNum: number = 0;
    private timer: any = null;

    private CrowdSourceVO: any = {
        clusterName: '',
        columnName: '',
        dbName: '',
        dsCol: '',
        enumColumnName: '',
        tableName: '',
        logicOp: 'AND',
        enums: [],
        conditions: [],
    };

    private filterData:any = [];
    private showFilterDialog = false;
    private selectConfig: number = -1;

    private canFilter = false;
    @Watch('colList')
    private clearColRelation(val) {
        // 清除colLit相关项
        this.colList = val;
        if (!val || val == null || val == undefined || val.length == 0) {
            this.canFilter = false;
            this.filterData = [];
        } else {
            this.canFilter = true;
        }
    }

    private checkIDFromEnum(name: string) {
        const arr = this.filterData.filter((item) => {
            return item.fieldName == name;
        });
        return arr.length > 0;
    }

    private readFilterData() {
        if (this.CrowdSourceVO.conditions && this.CrowdSourceVO.conditions.length > 0) {
            this.filterData = this.CrowdSourceVO.conditions.map((item: any) => {
                return JSON.parse(item.config);
            });
        }
    }

    private formatValues(item: any) {
        const condition = item;
        if (item.fieldType == "STRING") {
            // 字符串
            if (item.op == "EQ") {
                return `精确匹配(${item.values[0]})`;
            } else if (item.op == "NEQ") {
                return `不匹配(${item.values[0]})`;
            } else if (item.op == "IN") {
                return `枚举筛选(${item.values.join(',')})`;
            } else if (item.op == "LIKE") {
                return `包含(${item.values[0]})`;
            } else if (item.op == "NOT_LIKE") {
                return `不包含(${item.values[0]})`;
            } else if (item.op == "LIKE_LEFT") {
                return `开头是(${item.values[0]})`;
            } else if (item.op == "LIKE_RIGHT") {
                return `结尾是(${item.values[0]})`;
            } else if (item.op == "EMPTY") {
                return `为空`;
            } else if (item.op == "NOT_EMPTY") {
                return `不为空`;
            }
        } else if (item.fieldType == "NUMBER") { // 数字
            if (item.op == "EQ") {
                return `=${item.values[0]}`;
            } else if (item.op == "NEQ") {
                return `!=${item.values[0]}`;
            } else if (item.op == "GT") {
                return `>${item.values[0]}`;
            } else if (item.op == "LT") {
                return `<${item.values[0]}`;
            } else if (item.op == "GE") {
                return `>=${item.values[0]}`;
            } else if (item.op == "LE") {
                return `<=${item.values[0]}`;
            }
        } else if (item.fieldType == "DATETIME") { //单个日期
            if (item.timeCate == "DYNAMIC") {
                if (item.grain == 'DAY') {
                    return `日期(${{'-1':'最新','0':'当','1':'昨','2':'前'}[item.step]}日)`;
                }
                return `日期(${{'0':'当','1':'上','2':'前'}[item.step]}${{'MONTH':'月','YEAR':'年'}[item.grain]})`;
            } else if (item.timeCate == "STATIC") {
                return `日期(${{'DAY':'日','MONTH':'月','YEAR':'年'}[item.grain]})${item.value}`;
            }
        } else if (item.fieldType == "TIMERANGE") { // 日期范围，近一日含当日就是当天
            if (item.timeCate == "DYNAMIC") {
                return `日期(近${item.step}${{'DAY':'日','MONTH':'月','YEAR':'年'}[item.grain]}，${item.offset=="1"?'含当日':'不含当日'})`;
            } else if (item.timeCate == "STATIC") {
                return `日期(${item.begin}至${item.end})`;
            }
        }
        return ""
    }

    private edit(idx:number){
        this.selectConfig = idx;
        this.showFilterDialog = true;
    }

    private del(idx:number){
        this.filterData.splice(idx, 1);
    }

    private addsScreen() {
        this.selectConfig = -1;
        this.showFilterDialog = true;
    }

    private closeFilterDialog() {
        this.selectConfig = -1;
        this.showFilterDialog = false;
    }

    private finishEditConfig(data: any, isCreated: boolean) {
        if (isCreated) {
            this.filterData.push(data);
        } else {
            this.filterData.splice(this.selectConfig, 1, data);
        }
        this.selectConfig = -1;
        this.showFilterDialog = false;
    }

    private rules: any = {
        clusterName: [{ required: true, message: '请选择集群', trigger: 'change' }],
        dbName: [{ required: true, message: '请选择所属库', trigger: 'change' }],
        tableName: [{ required: true, message: '请选择所属表', trigger: 'change' }],
        columnName: [{ required: true, message: '请选择ID列', trigger: 'change' }],
        dsCol: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
        // enumColumnName: [{ required: true, message: '请选择ID列', trigger: 'change' }]
        // enums: [{ required: true, message: '请填写枚举值', trigger: 'change' }]
    };

    private getDbInfo(): any {
        let check = false;
        (this.$refs.form as any).validate((item: any) => {
            check = item;
        });
        if (check) {
            if(this.enumVal){
                this.CrowdSourceVO.enums.push(this.enumVal);
            }
            if (this.filterData.length > 0) {
                const arr = this.filterData.map((item: any) => {
                    return {
                        config:JSON.stringify(item),
                        fieldType:item.fieldType
                    };
                });
                this.CrowdSourceVO.conditions = arr;
            } else {
                this.CrowdSourceVO.conditions = [];
            }
            return this.CrowdSourceVO;
        }
    }

    private checkForm() {
        (this.$refs.form as any).validate((item: any) => {
            console.log('check form');
        });
    }

    private addEnum(): void {
        if (!this.enumVal) {
            this.$message.error('请输入枚举值');
            return;
        }
        if (this.CrowdSourceVO.enums.indexOf(this.enumVal) != -1) {
            this.$message('已存在该枚举值');
            return;
        }
        this.CrowdSourceVO.enums.push(this.enumVal);
        this.enumVal = '';
    }

    private delEnums(index: number) {
        this.CrowdSourceVO.enums.splice(index, 1);
    }

    private tableParams: any = {
        clusterId: '',
        dbName: '',
        key: '',
        pageSize: 20,
        pageNum: 1,
        table: ''
    };

    private changeCluster(type?:any) {
        this.dbloading = true;
        return new Promise((resolve, reject) => {
            this.$api
                .get('/api/ava/hive/db', { clusterID: this.CrowdSourceVO.clusterName })
                .then((res: any) => {
                    this.dbList = [];
                    if(!this.CrowdSourceVO.clusterName){
                        this.CrowdSourceVO.dbName = '';
                        this.CrowdSourceVO.tableName = '';
                        this.CrowdSourceVO.columnName = '';
                        this.CrowdSourceVO.enumColumnName = '';
                        this.dbList = [];
                        this.tableList = [];
                        this.colList = [];
                        this.CrowdSourceVO.enums = [];
                        return false;
                    }
                    for(let i=0;i<res.length;i++){
                        const reg = /(^dm.*)|(.*_dev$)/g;
                        if (reg.test(res[i])) {
                            this.dbList.push(res[i]);
                        }
                    }
                })
                .finally(() => {
                    this.dbloading = false;
                });
        });
    }
    private changeDB(type?:any) {
        this.tbloading = true;
        this.tableParams.clusterId = this.CrowdSourceVO.clusterName;
        this.tableParams.dbName = this.CrowdSourceVO.dbName;
        // this.tableParams.key = query;

        this.$api
            .post('/api/ava/hive/table', this.tableParams)
            .then((res: any) => {
                if(!this.tableParams.dbName){
                    this.CrowdSourceVO.tableName = '';
                    this.CrowdSourceVO.columnName = '';
                    this.CrowdSourceVO.enumColumnName = '';
                    this.tableList = [];
                    this.colList = [];
                    this.CrowdSourceVO.enums = [];
                    return false;
                } else if(this.tableParams.dbName && type!='1'){
                    this.CrowdSourceVO.tableName = '';
                    this.CrowdSourceVO.columnName = '';
                    this.CrowdSourceVO.enumColumnName = '';
                    this.tableList = [];
                    this.colList = [];
                    this.CrowdSourceVO.enums = [];
                }
                this.tableList = res.tables;
                this.totalNum = res.totalPage * this.tableParams.pageSize;
            })
            .finally(() => {
                this.tbloading = false;
            });
    }

    private getTable() {
        this.tbloading = true;
        this.tableParams.clusterId = this.CrowdSourceVO.clusterName;
        this.tableParams.dbName = this.CrowdSourceVO.dbName;

        this.$api
            .post('/api/ava/hive/table', this.tableParams)
            .then((res: any) => {
                this.tableList = res.tables;
                this.totalNum = res.totalPage * this.tableParams.pageSize;
            })
            .finally(() => {
                this.tbloading = false;
            });
    }

    private searchTable(val: string) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.$set(this.tableParams, 'key', val);
            this.$set(this.tableParams, 'pageNum', 1);
            this.getTable();
        }, 500);
    }

    private changeTable(type?:any) {
        this.tbloading = true;
        this.tableParams.clusterId = this.CrowdSourceVO.clusterName;
        this.tableParams.dbName = this.CrowdSourceVO.dbName;
        this.tableParams.table = this.CrowdSourceVO.tableName;

        this.$api
            .post('/api/ava/hive/column', this.tableParams)
            .then((res: any) => {
                this.colList = [];
                if(!this.tableParams.clusterId){
                    this.CrowdSourceVO.columnName = '';
                    this.CrowdSourceVO.enumColumnName = '';
                    this.colList = [];
                    this.CrowdSourceVO.enums = [];
                    return false;
                } else if(this.tableParams.clusterId && type!='1'){
                    this.CrowdSourceVO.columnName = '';
                    this.CrowdSourceVO.enumColumnName = '';
                    this.colList = [];
                    this.CrowdSourceVO.enums = [];
                }
                if (res && res.column) {
                    this.colList = res.column;
                }
                if (type == '1') {
                    // 初始化colList之后，再初始化筛选器
                    this.readFilterData();
                }
            })
            .finally(() => {
                this.tbloading = false;
            });
    }

    private init(code: string) {
        // this.$bus.$emit('main-loading', true);
        // this.$api.get('/api/ava/hive/cluster', null).then((res: any) => {
        //     this.$bus.$emit('main-loading', false);
        //     this.clusterList = res;
        // });
        this.clusterList = [{clusterName:'深海测试',id:1}];
        this.initIDMapping();
        this.dbList = [];
        this.tableList = [];
        this.colList = [];
        this.dbloading = false;
        this.tbloading = false;
        this.enumVal = '';
        this.isGetTable = true;
        this.totalNum = 0;

        if(code){
            this.CrowdSourceVO = JSON.parse(code);
            if (!this.CrowdSourceVO.logicOp || this.CrowdSourceVO.logicOp == null || this.CrowdSourceVO.logicOp == undefined) {
                this.CrowdSourceVO.logicOp = "AND";
                this.CrowdSourceVO.conditions = [];
            }
            // 修复：数据类型和集群回显问题
            this.CrowdSourceVO.clusterName = Number(this.CrowdSourceVO.clusterName);
            this.CrowdSourceVO.dsCol = Number(this.CrowdSourceVO.dsCol);
            this.changeCluster('1');
            this.changeDB('1');
            this.changeTable('1');
        }

    }

    private initIDMapping() {
        this.$api.get('/api/ava/sysIDMappingColumn/queryIdColList', { subjectId: this.curSubject?.id }).then((res: any) => {
            this.idMappingList = res;
            if(!this.CrowdSourceVO.dsCol){
                this.CrowdSourceVO.dsCol = this.idMappingList[0].id;
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.db-info {
    width: 100%;
    height: 100%;
    line-height: 40px;
    padding-top: 18px;
    .enum-ipt {
        display: flex;
        align-items: center;
        position: relative;
        .add-btn {
            /*position: absolute;*/
            /*left: calc(100% + 10px);*/
            margin-left: 10px;
        }
    }
    .tag-list {
        margin-top: 10px;
        .enum-item {
            margin: 0 10px 10px 0;
            /*max-width: 100px;*/
        }
    }
    .com-width {
        width: 72%;
    }
    .el-radio-group {
        padding-left: 20px;
    }
    .tag-list {
        padding-left: 20px;
    }
    .page-section {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
    /deep/.el-form-item__error {
        margin-left: 20px;
    }
    /deep/.el-table th{
        padding: 0px;
    }
    .a{
        padding-right: 15px;
    }
}
</style>
