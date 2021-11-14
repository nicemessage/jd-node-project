<template>
    <div class="db-info">
        <el-form :model="CrowdSourceVO" ref="form" label-position="left">

            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="集群"  label-width="150px" style="text-align: right;padding-right: 40px;">
                      {{clusterName}}
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="所属库"  label-width="150px" style="text-align: right;padding-right: 40px;">
                      {{CrowdSourceVO.dbName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="所属表"  label-width="150px" style="text-align: right;padding-right: 40px;">
                      {{CrowdSourceVO.tableName}}
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="ID列"  label-width="150px" style="text-align: right;padding-right: 40px;">
                      {{CrowdSourceVO.columnName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="枚举列"  label-width="150px" style="text-align: right;padding-right: 40px;">
                      {{CrowdSourceVO.enumColumnName}}
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="枚举值"  label-width="150px" style="text-align: right;padding-right: 30px;">
                      <div class="tag-list">
                        <el-tag class="enum-item" v-for="(tag, index) in CrowdSourceVO.enums" :key="index" >{{
                          tag
                          }}</el-tag>
                      </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="CrowdSourceVO.tableUpdateTime">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="数据更新时间"  label-width="150px" style="text-align: right;padding-right: 40px;">
                        {{CrowdSourceVO.tableUpdateTime}}
                    </el-form-item>
                </el-col>
            </el-row> -->

            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="筛选信息" prop="screen" label-width="120px">
                        <!-- <div style="padding-left: 20px;">
                            <el-button type="primary" :disabled="!canFilter" @click="addsScreen" size="small">新增筛选器</el-button>
                        </div> -->
                    </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="筛选连接关系" prop="logicOp" label-width="120px">
                        <el-radio-group size="small" disabled v-model="CrowdSourceVO.logicOp">
                            <el-radio-button label="AND">且</el-radio-button>
                            <el-radio-button label="OR">或</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <div>
                        <el-table
                                :data="filterData"
                                border>
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
                        </el-table>
                    </div>
                </el-col>

            </el-row>

        </el-form>
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
import {Component, Prop, Vue} from 'vue-property-decorator';
import {State} from "vuex-class";

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
    components: {}
})
export default class DbDetail extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;
    @Prop({ type: String }) private dbInfo?: any;

    private clusterList: any[] = [];
    private clusterName : string = '';
    private enumName : string = '';
    private filterData:any = [];

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

    private CrowdSourceVO: any = {
        clusterName: '',
        columnName: '',
        dbName: '',
        dsCol: '',
        enumColumnName: '',
        tableName: '',
        enums: []
    };

    private mounted() {
        this.CrowdSourceVO = JSON.parse(this.dbInfo);
        this.readFilterData();
        console.log(this.CrowdSourceVO);
        this.CrowdSourceVO.enums.forEach((item: any) => {
            this.enumName = this.enumName.concat(item).concat(' ');
            console.log("++++++++++++",this.enumName,item);
        });
        // this.$api.get('/api/ava/hive/cluster', null).then((res: any) => {
        //     this.clusterList = res;
        // });
        this.clusterList = [{clusterName:'5K集群',id:13}];
        this.init();
    }

    private init() {
        this.clusterList.forEach((item: any) => {
            console.log("+++++",item.id == this.CrowdSourceVO.clusterName)
            if(item.id == this.CrowdSourceVO.clusterName){
                this.clusterName = item.clusterName;
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
    font-size: 1rem;
    color: #666666;
    margin-top: -10px;
    clear: both;
    .enum-ipt {
        display: flex;
        align-items: center;
        position: relative;
        padding-left: 20px;
        .add-btn {
            /*position: absolute;*/
            /*left: calc(100% + 10px);*/
            margin-left: 10px;
        }
    }
    .tag-list {
        padding-top: 5px;
        .enum-item {
            margin: 0 10px 10px 0;
        }
    }
    /deep/.el-tag{
        font-size: 12px;
        padding: 0 5px;
        line-height: 22px;
        height: 25px;
    }
    /deep/.el-form-item__content{
      color: #666666;
      font-size: 1rem;
    }
    /deep/.el-form-item__label{
      margin-right: 20px;
      padding: 0px;
      font-size: 1rem;
    }
    /deep/.el-form-item{
      margin-bottom: 0px;
    }
    .page-section {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
    /deep/.el-form-item__error {
        margin-left: 20px;
    }
}
</style>
