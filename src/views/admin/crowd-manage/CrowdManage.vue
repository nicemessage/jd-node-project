<template>
    <div class="crowd-manage">
        <div class="header">
            <div class="subject-list">
                <SysSubject @changeId="getCrowdList"> </SysSubject>
            </div>
            <div class="spacer"></div>
            <div class="search-tag-btn">
                <div class="search-item">
                    <el-select class="com-select" v-model="crowdType" clearable placeholder="请选择创建方式" @change="getCrowdList" size="medium">
                        <el-option v-for="item in crowdTypeListMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-select class="com-select" v-model="crowdState" clearable placeholder="请选择更新状态" @change="getCrowdList" size="medium">
                        <el-option v-for="item in crowdStateMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input
                            class="com-input search-ipt"
                            v-model="keyword"
                            placeholder="群体名称/ID/负责人"
                            @change="getCrowdList"
                            size="medium"
                    >

                        <i slot="suffix" class="el-input__icon el-icon-search" @click="getCrowdList"></i>
                    </el-input>
                </div>
                <div class="search-item">
                    <!-- <div class="crowdMode-select" :class="{ active: crowdMode == 'card' }" @click="selectMode('card')">C</div>
          <div class="crowdMode-select" :class="{ active: crowdMode == 'table' }" @click="selectMode('table')">T</div> -->
<!--                    <div class="crowdMode-select" :class="{ active: crowdMode == 'card' }" @click="selectMode('card')">-->
<!--                        <i class="el-icon-bank-card"></i>-->
<!--                    </div>-->
<!--                    <div class="crowdMode-select" :class="{ active: crowdMode == 'table' }" @click="selectMode('table')">-->
<!--                        <i class="el-icon-tickets"></i>-->
<!--                    </div>-->
                    <el-button size="medium" v-if="crowdMode == 'card'" @click="selectMode('table')" style="font-size: 18px;padding: 7px 10px;background: none;">
                        <i class="el-icon-bank-card"></i>
                    </el-button>
                    <el-button size="medium" v-if="crowdMode == 'table'" @click="selectMode('card')" style="font-size: 18px;padding: 7px 10px;background: none;">
                        <i class="el-icon-tickets"></i>
                    </el-button>
                </div>
            </div>
        </div>
        <div class="body self-scroll">
            <div class="crowd-content" v-if="crowdMode == 'card'">
                <el-row :gutter="20" style="width: 100%">
                    <el-col :lg="12" :xl="8" v-for="(item) of dataList" :key="item.id">
                        <CrowdItem :data="item" :key="item.id"></CrowdItem>
                    </el-col>
                </el-row>
                <div class="data-empty center" v-show="!loadingSate" v-if="dataList.length === 0">
                    <img src="@/assets/img/data-empty.png" alt="" style="display: block;margin: 0 auto;"/>
                    <p>暂无数据</p>
                </div>
            </div>
            <div class="crowd-content" v-else-if="crowdMode == 'table'">
                <el-table :data="dataList" size="small" border>
                    <!-- <el-table-column min-width="120">
            <template slot="header">
              <div>群体ID</div>
              <div>群体名称</div>
            </template>
            <template slot-scope="scope">
              <div>{{ scope.row.crowdName }}</div>
              <div>{{ scope.row.crowdCode }}</div>
            </template>
          </el-table-column> -->
                    <el-table-column prop="crowdName" label="群体名称" width="200"></el-table-column>
                    <el-table-column prop="crowdCode" label="群体ID" min-width="200"></el-table-column>
                    <el-table-column prop="crowdRealNum" label="覆盖数量" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.crowdRealNum ? scope.row.crowdRealNum : 0 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建方式" width="120">
                        <template slot-scope="scope">
                            {{ crowdTypeMap[scope.row.crowdType] ? crowdTypeMap[scope.row.crowdType] : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="更新日期" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.crowdDataDt ? formatDate(scope.row.crowdDataDt) : '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.crowdState == 1">加工中</span>
                            <span v-if="scope.row.crowdState == 2">有效</span>
                            <span v-if="scope.row.crowdState == 3">加工失败</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140" fixed="right">
                        <template slot-scope="scope">
                            <a @click="editCrowd(scope.row)">设置</a>
                            <a @click="goToInfo(scope.row)">查看</a>
                            <a @click="showDelCrowd(scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paginationa">
                <el-pagination
                    layout="total,sizes,prev, pager, next, jumper"
                    :total="total"
                    :page-size.sync="pageSize"
                    :current-page.sync="pageNo"
                    :page-sizes="pageSizeList"
                    :hide-on-single-page="false"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" title="删除群体" :visible.sync="showDelDialog" width="500px">
            <div style="padding: 30px;">确认删除该群体</div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDelDialog = false">取 消</el-button>
                <el-button size="small" type="danger" @click="delCrowd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="editDialog" width="500px">
            <div slot="title" class="dialog-title">群体设置</div>
            <el-form :model="setParams" status-icon :rules="setRules" ref="setForm" label-width="100px" class="demo-ruleForm" style="padding: 30px;">
                <el-form-item label="群体名称" prop="crowdName">
                    <el-input class="com-input" type="text" v-model="setParams.crowdName" placeholder="请输入群体名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="群体负责人" prop="crowdManagerList">
                    <el-select
                        class="com-select noSuffix"
                        style="width:100%"
                        v-model="setParams.crowdManagerList"
                        filterable
                        remote
                        multiple
                        reserve-keyword
                        allow-create
                        default-first-option
                        placeholder="请输入用户Id查询"
                        :remote-method="searchErp"
                        :loading="erpLoading"
                    >
                        <el-option v-for="item in erpOptions" :key="item.value" :label="`${item.displayName}(${item.erpName})`" :value="item.erpName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="群体描述" prop="crowdDesc">
                    <el-input
                        class="com-input"
                        type="textarea"
                        placeholder="请输入群体描述"
                        :rows="5"
                        :resize="'none'"
                        v-model="setParams.crowdDesc"
                        maxlength="200"
                        clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="submitForm('setForm')">提交</el-button>
<!--                    <el-button size="mini" @click="resetForm('setForm')">取消</el-button>-->
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/**
 * @name ProtoType
 * @author your name
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import VueSocketIO from 'vue-socket.io';

// mixin引入
import { PageMixin } from '@/mixins/pageMixin';

// 第三方库引入
import moment from 'moment';
// 静态配置引入

// 公共组件引入

// 公共类引入
import SysSubject from '@/components/SysSubject.vue';

// 私有组件引入
import CrowdItem from './CrowdItem.vue';
import { State, Mutation } from 'vuex-class';
import Vue from "vue";

// 私有类引入

// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

@Component({
    components: {
        SysSubject,
        CrowdItem,
        VueSocketIO
    },
    computed: mapGetters(['loadingSate', 'crowdMode'])
})
export default class CrowdManage extends Mixins(PageMixin) {
    @State(state => state.crowdMode) crowdMode?: string;
    @Mutation('changeCrowdMode') changeCrowdMode?: any;
    private type: string = 'me'; // me, all

    private dataList: any[] = [];

    private crowdState: number | null = null;
    private crowdStateMap: any = [
        {
            label: '加工中',
            value: 1
        },
        {
            label: '有效',
            value: 2
        },
        {
            label: '加工失败',
            value: 3
        }
    ];

    private crowdTypeMap: any = {
        1: '标签建群',
        2: '文件建群',
        3: '-',
        4: '库表建群',
        5: '二次筛选',
        6: '地址建群'
    };
    private crowdType: number | null = null;
    private crowdTypeListMap: any = [
        {
            label: '标签圈群',
            value: 1
        },
        {
            label: '文件建群',
            value: 2
        },
        {
            label: '库表建群',
            value: 4
        },
        {
            label: '二次筛选',
            value: 5
        },
        {
            label: '地址建群',
            value: 6
        }
    ];
    private keyword: string = '';
    private showDelDialog: boolean = false;
    private delItem: any | null = null;

    private selectMode(newMode: string) {
        if (this.crowdMode == newMode) {
            return;
        }
        this.changeCrowdMode(newMode);
    }
    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD');
    }
    @Watch('pageNo')
    private pageNoChange() {
        this.getCrowdList();
    }
    @Watch('pageSize')
    private pageSizeChange() {
        this.getCrowdList();
    }

    private mounted() {
        this.addMonitor();
        this.init();
        // this.sockets();
    }

    private sockets() {
        // console.log(3333);
        Vue.use(new VueSocketIO({
            debug: true,
            connection: "url",
            vuex: {}
        }));
    }

    private addMonitor() {
        this.$bus.$on('CrowdDelete', () => {
            this.getCrowdList();
        });
    }
    private async init() {
        this.$store.commit('changeLoadingStatus', true);
        if (!window.sessionStorage.getItem('subjectId')) {
            return setTimeout(this.init, 500);
        }
        await Promise.all([this.getCrowdList()]).finally(() => {
            this.$store.commit('changeLoadingStatus', false);
        });
    }
    private selectType(newType: string) {
        if (this.type == newType) {
            return;
        }
        this.type = newType;
        this.getCrowdList();
    }

    private getCrowdList() {
        const params = this.genQueryParam();
        this.queryList(params).then((res: any) => {
            this.total = res.total;
            this.dataList = res.list;
        });
    }

    private genQueryParam() {
        const query: any = {};
        if (this.crowdState) {
            query['crowdState'] = this.crowdState;
        }
        if (this.crowdType) {
            query['crowdType'] = this.crowdType;
        }
        if (this.keyword && this.keyword != '') {
            query['keyword'] = this.keyword;
        }
        return query;
    }
    private showDelCrowd(crowd: any) {
        this.delItem = crowd;
        this.showDelDialog = true;
    }
    private goToInfo(row: any) {
        if (!row || !row.crowdCode) {
            return;
        }
        const target = {
            name: 'admin/crowd-info',
            params: {
                crowdCode: row.crowdCode
            }
        };
        this.$router.push(target);
    }
    private delCrowd() {
        if (!this.delItem || !this.delItem.crowdCode) {
            return;
        }
        this.del(this.delItem.crowdCode).then(() => {
            this.$message.success('删除成功');

            this.showDelDialog = false;
            this.delItem = null;
            this.getCrowdList();
        });
    }

    private editDialog: boolean = false;
    private setParams: any = {
        crowdCode: '',
        crowdDesc: '',
        crowdManager: '',
        crowdManagerList: [],
        crowdName: ''
    };
    private setRules: any = {
        crowdName: [{ required: true, message: '请填写群体名称', trigger: 'blur' }],
        crowdManagerList: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        crowdDesc: [{ required: true, message: '请填写群体描述', trigger: 'blur' }]
    };
    private editCrowd(row: any) {
        if (!row) {
            return;
        }
        const { crowdCode, crowdDesc, crowdManager , crowdName } = row;
        this.setParams = {
            crowdCode,
            crowdDesc,
            crowdManager,
            crowdManagerList:crowdManager.split(","),
            crowdName
        };
        this.editDialog = true;
    }
    private submitForm(formName: string = 'setForm') {
        (this.$refs[formName] as any).validate((valid: any) => {
            if (valid) {
                this.setParams.crowdManager = this.setParams.crowdManagerList.join(",");
                this.$api.post('/api/ava/crowd/set', this.setParams).then((res: any) => {
                    this.editDialog = false;
                    this.getCrowdList();
                });
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }
    private resetForm(formName: string = 'setForm') {
        (this.$refs[formName] as any).resetFields();
        this.editDialog = false;
    }

    private erpOptions: any[] = [];

    private erpLoading: boolean = false;

    private searchErp(str: string = '') {
        this.erpLoading = true;
        if (str !== '') {
            this.$api.get('/api/admin/token/getErpUser', { keyword: str }).then((res: any) => {
                this.erpOptions = res.filter((item: any) => {
                    return item.erpName !== '';
                });
                this.erpLoading = false;
            });
        }
    }
    // ========== ajax request  ==========

    private queryList(params?: any) {
        return new Promise((resolve, reject) => {
            const url = `/api/ava/crowd/all`;
            const data = {
                pageNum: this.pageNo,
                pageSize: this.pageSize,
                subjectId: window.sessionStorage.getItem('subjectId')
            };
            if (params) {
                Object.assign(data, params);
            }
            this.$bus.$emit('main-loading', true);
            this.$api
                .post(url, data)
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    resolve(res);
                })
                .catch(err => {
                    this.$bus.$emit('main-loading', false);
                    reject(err);
                });
        });
    }
    private del(crowdCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/del';
            const data: object = {
                crowdCode: crowdCode
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
</script>
<style lang="scss" scoped>
/deep/ .noSuffix {
    .el-input__suffix {
        display: none;
    }
}
/deep/.el-row{
    display: block;
}
a{
    padding-right: 10px;
}
.crowd-manage {
    width: 100%;
    height: 100%;
    background-color: #f9fafd;
    position: relative;
    overflow: hidden;

    .header {
        width: 100%;
        height: 64px;
        display: flex;
        .subject-list {
            width: 30%;
            height: 64px;
            flex: 1 1 auto;
        }
        .spacer {
            flex: 1 1 auto;
        }
        .search-tag-btn {
            height: 64px;
            margin-right: 20px;
            float: right;
            display: flex;
            align-items: center;
            .search-item{
                margin-left: 10px;
            }
        }
        /deep/.el-input__inner{
            background: none;
        }
    }
    .body {
        width: 100%;
        height: calc(100% - 68px);
        margin-top: 4px;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 0 0 0px 20px;
        /*box-sizing: border-box;*/
        /*display: flex;*/
        /*flex-direction: column;*/
        .search-tool {
            width: 100%;
            margin-bottom: 20px;
            /*display: flex;*/
            /*align-items: center;*/

            .search-item {
                flex: 0 0 auto;
                margin-left: 5px;
                display: flex;
                &:first-child {
                    margin-left: 0px;
                }
                .crowdMode-select {
                    width: 30px;
                    height: 30px;
                    display: inline-block;
                    line-height: 30px;
                    text-align: center;
                    margin-right: 10px;
                    color: rgba(57, 107, 246, 1);
                    background: rgba(255, 255, 255, 1);
                    border-radius: 4px;
                    box-shadow: 0px 2px 4px 0px rgba(196, 196, 196, 0.55);
                    cursor: pointer;
                    &.active {
                        color: #fff;
                        background: rgba(57, 107, 246, 1);
                        border-radius: 4px;
                        box-shadow: 0px 2px 4px 0px rgba(57, 107, 246, 0.65);
                    }
                }
                .type-select {
                    width: 90px;
                    height: 30px;
                    line-height: 28px;
                    text-align: center;
                    cursor: pointer;

                    font-size: 0.75rem;
                    border-radius: 4px;

                    margin-right: 20px;

                    color: rgba(57, 107, 246, 1);
                    border: 1px solid rgba(57, 107, 246, 1);
                    background: #fff;
                    &.active {
                        line-height: 30px;
                        background: rgba(57, 107, 246, 1);
                        color: rgba(255, 255, 255, 1);
                        border: 0px;
                    }
                }
            }
            .spacer {
                flex: 1 1 auto;
            }
        }
        .crowd-content {
            width: 100%;
            // margin-bottom: 20px;
            /*display: flex;*/
            flex-wrap: wrap;
        }
        .paginationa {
            width: 100%;
            margin-top: 10px;
            height: 60px;
            text-align: right;
            /*padding: {*/
            /*    top: 0px;*/
            /*    bottom: 18px;*/
            /*    left: 40px;*/
            /*    right: 40px;*/
            /*}*/
            /*display: flex;*/
            /*justify-content: flex-end;*/
        }
    }
}
.center {
    margin: 50px auto;
    p {
        text-align: center;
        color: #999;
    }
}
</style>
