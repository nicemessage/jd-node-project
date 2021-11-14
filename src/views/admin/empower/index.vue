<template>
    <div class="crowd-manage">
        <div class="header">
            <div class="search-tool">
                <div class="search-item">
                    <SysSubject></SysSubject>
                </div>
                <div class="search-item">
                    <div class="type-select" :class="{ active: crowdShowType == 'crowd' }" @click="selectType('crowd')">
                        我的群体
                    </div>
                    <div class="type-select" :class="{ active: crowdShowType == 'tag' }" @click="selectType('tag')">
                        我的标签
                    </div>
                </div>
                <div class="spacer"></div>
                <div class="search-item" style="width: 15%" v-if="crowdShowType == 'crowd'">
                    <el-select style="width: 100%" v-model="crowdType" size="small" clearable placeholder="请选择创建方式"
                               @change="getCrowdList">
                        <el-option v-for="item in crowdTypeListMap" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="search-item" style="width: 15%" v-if="crowdShowType == 'tag'">
                    <el-select style="width: 100%" v-model="manager" size="small" placeholder="请选择"  @change="getCrowdList">
                        <el-option v-for="item in managerList" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="search-item" style="width:28%">
                    <el-input style="width: 100%" size="small" v-model="keyword" clearable
                              :placeholder="crowdShowType == 'crowd'?'请输入群体名称/群体ID':'请输入标签编码/标签名称/标签描述'"
                              @change="getCrowdList">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="getCrowdList"></i>
                    </el-input>
                </div>
                <!--                <div class="search-item">-->
                <!--                    <div class="select-item">-->
                <!--                        <div class="mode-select" v-show="crowdShowMode == 'table'"-->
                <!--                             @click="selectMode('card')">-->
                <!--                            <i class="el-icon-bank-card"></i>-->
                <!--                        </div>-->
                <!--                        <div class="mode-select"  v-show="crowdShowMode == 'card'"-->
                <!--                             @click="selectMode('table')">-->
                <!--                            <i class="el-icon-tickets"></i>-->
                <!--                        </div>-->
                <!--                    </div>-->
                <!--                </div>-->
                <!--                <div class="search-item">-->
                <!--                    <el-button size="small" type="primary" @click="showToCrowd" class="el-icon-plus"> 创建群体</el-button>-->
                <!--                </div>-->
                <div class="search-item">
                    <el-button size="small" type="primary" @click="empowerShow" v-if="crowdShowType == 'crowd'">赋权</el-button>
                    <el-button size="small" type="primary" @click="transferShow">转让</el-button>
                </div>
            </div>
        </div>
        <div class="body">
            <template v-if="dataList.length > 0">
                <div class="crowd-content card" v-if="crowdShowMode == 'card'">
                    <el-table :data="dataList"
                              size="small"
                              border
                              height="100%"
                              @selection-change="handleSelectionChange">
                        <el-table-column
                                :key="1"
                                type="selection"
                                align="center"
                                width="65">
                        </el-table-column>
                        <el-table-column :key="2" label="群体名称" min-width="200px" v-if="crowdShowType == 'crowd'">
                            <template slot-scope="scope">
                                {{scope.row.crowdName}}
                            </template>
                        </el-table-column>
                        <el-table-column :key="3" label="群体ID"  min-width="280px" v-if="crowdShowType == 'crowd'">
                            <template slot-scope="scope">
                                {{scope.row.crowdCode}}
                            </template>
                        </el-table-column>
                        <el-table-column :key="4" label="创建方式" width="100px" v-if="crowdShowType == 'crowd'">
                            <template slot-scope="scope">
                                {{crowdTypeMap[scope.row.crowdType]}}
                            </template>
                        </el-table-column>
                        <el-table-column :key="5" label="更新时间" width="180px" v-if="crowdShowType == 'crowd'">
                            <template slot-scope="scope">
                                {{formatDate(scope.row.modifiedTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column :key="6" label="群体负责人" v-if="crowdShowType == 'crowd'" fixed="right" width="250px">
                            <template slot-scope="scope">
                                <div class="tag-erp" v-if="scope.row.crowdManager">
                                    <template v-if="scope.row.crowdManager.split(',').length > 1">
                                        <b class="bb" v-for="(item, index) in scope.row.crowdManager.split(',')" :key="`${index}${item}`">
                                            {{item}}
                                            <i class="el-icon-error" @click="delCrowdErp(scope.row,item)"></i>
                                        </b>
                                    </template>
                                    <template v-else>
                                        <b>{{scope.row.crowdManager}}</b>
                                    </template>

                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :key="7" label="标签名称" min-width="100px" max-width="220px" v-if="crowdShowType == 'tag'">
                            <template slot-scope="scope">
                                {{scope.row.tagName}}
                            </template>
                        </el-table-column>
                        <el-table-column :key="8" label="标签编码" min-width="100px" max-width="220px" v-if="crowdShowType == 'tag'">
                            <template slot-scope="scope">
                                {{scope.row.tagCode}}
                            </template>
                        </el-table-column>
                        <el-table-column :key="9" label="技术负责人" v-if="crowdShowType == 'tag'" fixed="right" width="200px">
                            <template slot-scope="scope">
                                <div class="tag-erp"><b>{{scope.row.techManager}}</b></div>
                            </template>
                        </el-table-column>
                        <el-table-column :key="10" label="业务负责人" v-if="crowdShowType == 'tag'" fixed="right" width="200px">
                            <template slot-scope="scope">
                                <div class="tag-erp"><b>{{scope.row.bizManager}}</b></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="paginationa">
                    <el-pagination
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                            :page-size.sync="pageSize"
                            :current-page.sync="pageNo"
                            :page-sizes="pageSizeList"
                    >
                    </el-pagination>
                </div>
            </template>
            <template v-else>
                <div class="no-data">
                    <NoData label="暂无可选群体" v-if="crowdShowType == 'crowd'"></NoData>
                    <NoData label="暂无可选标签" v-if="crowdShowType == 'tag'"></NoData>
                </div>
            </template>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="empowerDialog" width="800px">
            <div slot="title" class="dialog-title">群体赋权</div>
            <div style="padding:0 15px 10px;">
                <div class="query-erp">
                    <SearchErp :value.sync="newErp" style="width: 200px;"  size="small"></SearchErp>
                    <el-button size="small" type="primary" @click="newErpAdd" style="margin-left: 10px;">添加</el-button>
                </div>
                <el-table :data="erpList"
                          size="small"
                          height="400px"
                          border>
                    <el-table-column label="ERP" min-width="100px" max-width="260px">
                        <template slot-scope="scope">
                            {{scope.row.erpName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="部门" width="550px">
                        <template slot-scope="scope">
                            {{scope.row.organizationFullName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="50px" align="center">
                        <template slot-scope="scope">
                            <a class="el-icon-delete" style="font-size: 16px;" @click="delErp(scope.$index)"></a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="empowerCrowd">确定赋权</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="transferDialog" width="600px">
            <div slot="title" class="dialog-title">转让</div>
            <div style="padding:0 15px 10px;">
                <div class="query-erp">
                    <SearchErp :value.sync="transferNewErp" size="small"></SearchErp>
                </div>
                <div class="query-erp">
                    <el-input
                            placeholder="组织机构"
                            v-model="organizationFullName"
                            size="small"
                            :disabled="true"
                    ></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="transfer">确定转让</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" :visible.sync="crowdItemsDialog" width="900px" :before-close="handleClose">
            <div slot="title" class="dialog-title">赋权结果</div>
            <div style="padding:15px;">
                <el-table :data="failCrowdItems"
                          size="small"
                          border>
                    <el-table-column label="赋权失败群体" min-width="100px" width="220px">
                        <template slot-scope="scope">
                            {{scope.row.crowdName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="群体ID">
                        <template slot-scope="scope">
                            {{scope.row.crowdCode}}
                        </template>
                    </el-table-column>
                    <el-table-column label="当前负责人" width="150px">
                        <template slot-scope="scope">
                            <div class="tag-erp" v-html="crowdManagerList(scope.row.crowdManager)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="增权失败人员" width="150px">
                        <template slot-scope="scope">
                            <div class="tag-erp" v-html="crowdManagerList3()"></div>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="height: 10px;"></div>
                <el-table :data="successCrowdItems"
                          size="small"
                          border>
                    <el-table-column label="赋权成功群体" min-width="100px" width="220px">
                        <template slot-scope="scope">
                            {{scope.row.crowdName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="群体ID">
                        <template slot-scope="scope">
                            {{scope.row.crowdCode}}
                        </template>
                    </el-table-column>
                    <el-table-column label="赋权前负责人" width="150px">
                        <template slot-scope="scope">
                            <div class="tag-erp" v-html="crowdManagerList(scope.row.crowdManager)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="新增负责人" width="150px">
                        <template slot-scope="scope">
                            <div class="tag-erp" v-html="crowdManagerList2(scope.row.crowdManager)"></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    /**
     * @name empower
     * @author 于涛
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import {Component, Mixins, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';

    // mixin引入
    import {PageMixin} from '@/mixins/pageMixin';

    // 第三方库引入
    import moment from 'moment';

    // 静态配置引入

    // 公共组件引入
    import NoData from '@/components/NoDataIcon.vue';
    import SysSubject from '@/components/SysSubject.vue';
    import SearchErp from '@/components/SearchErp.vue';

    // 公共类引入

    // 私有组件引入
    // import CrowdItem from './CrowdItem.vue';

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
            // CrowdItem,
            NoData,
            SearchErp
        }
    })
    export default class Empower extends Mixins(PageMixin) {
        @State(state => state.curSubject) curSubject!: Subject | null;

        @Watch('curSubject')
        private subjectChange() {
            this.getCrowdList();
        }

        // @State(state => state.crowdShowType) crowdShowType!: string;
        private crowdShowType: string = 'crowd';
        @State(state => state.crowdShowMode) crowdShowMode!: string;

        private loading: boolean = false;
        private toCrowd: boolean = false;
        private showToCrowdDialog: boolean = false;
        private activeName: string = 'crowd';
        private manager: string = 'techManager';

        private dataList: any[] = [];
        private erpList: any[] = [];

        private newErp:string = '';
        private newErpAdd(){
            if(this.erpList.length >= 4){
                this.$message('赋权erp不能超过4个');
                return false;
            }
            this.$bus.$emit('main-loading', true);
            this.$api
                .get('/api/ava/token/getErpUserDetail', {erp: this.newErp})
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    const obj: any = {};
                    this.erpList.push(res);
                    this.erpList = this.erpList.reduce((item, next) => {
                        obj[next.erpName] ? '' : obj[next.erpName] = true && item.push(next);
                        return item;
                    }, []);

                    this.newErp = '';
                }).catch(err => {
                this.$bus.$emit('main-loading', false);
            });

        }
        private delErp(index:number){
            this.erpList.splice(index,1);
        }

        private crowdData: any = null;
        private crowdState: number | null = null;
        private managerList: any = [
            {
                label: '技术负责人',
                value: 'techManager'
            },
            {
                label: '业务负责人',
                value: 'bizManager'
            }
        ];
        private crowdTypeMap: any = {
            1: '标签圈群',
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
        private crowdQuery: any = false;

        private showDelDialog: boolean = false;
        private delItem: any | null = null;

        private showCrowdType: any = '';

        private crowdItemsDialog: boolean = false; // 提示弹窗
        private failCrowdItems: any = []; // 失败列表，文案
        private successCrowdItems: any = []; // 成功列表，文案

        private multipleSelection:any = [];

        @Watch('pageNo')
        private pageNoChange() {
            this.getCrowdList("0");
        }

        @Watch('pageSize')
        private pageSizeChange() {
            this.getCrowdList("0");
        }

        private handleSelectionChange(val:any) {
            this.multipleSelection = val;
        }

        /* 转让 */
        private transferNewErp:string = '';  // 转让用户
        @Watch('transferNewErp')
        private transferNewErpChange() {
            if(this.transferNewErp == ''){
                this.organizationFullName = '';
                return false;
            }
            this.$bus.$emit('main-loading', true);
            this.$api
                .get('/api/ava/token/getErpUserDetail', {erp: this.transferNewErp})
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    this.organizationFullName = res.organizationFullName;
                }).catch(err => {
                this.$bus.$emit('main-loading', false);
            });
        }
        private organizationFullName:string = '';  // 转让用户组织架构
        private transferDialog: boolean = false; // 转让弹窗
        private transferShow(){
            if(this.multipleSelection.length == 0){
                let text:string = '群体';
                if(this.crowdShowType == 'tag'){
                    text = '标签';
                }
                this.$message(`请选择${text}`);
                return false;
            }
            this.transferDialog = true;
        }

        // 确定转让
        private transfer(){
            console.log(this.multipleSelection);
            console.log(this.transferNewErp);
            if(!this.transferNewErp){
                this.$message('请输入rep');
                return false;
            }
            let url:string = '/api/admin/crowdManager/transfer';
            const codeList:any = [];
            const typeMap:any = {
                techManager: 1,
                bizManager: 2
            };
            const data:any = {};
            if (this.crowdShowType == 'tag') {
                url = '/api/admin/tagManager/transfer';
                for (const i in this.multipleSelection) {
                    codeList.push(this.multipleSelection[i].tagCode);
                }
                Object.assign(data, {
                    "receiver": this.transferNewErp,
                    "tagCodeList": codeList,
                    "transType": typeMap[this.manager]
                });
            } else {
                for (const i in this.multipleSelection) {
                    codeList.push(this.multipleSelection[i].crowdCode);
                }
                Object.assign(data, {
                    "receiverList": [this.transferNewErp],
                    "crowdCodeList": codeList
                });
            }
            this.$bus.$emit('main-loading', true);
            this.$api
                .post(url, data)
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    this.$message.success('转让成功');
                    this.getCrowdList();
                    this.transferDialog = false;
                    this.transferNewErp = '';
                })
                .catch(err => {
                    this.$bus.$emit('main-loading', false);
                });
        }

        /* 赋权 */
        private empowerDialog: boolean = false;
        private empowerVal: any = '';
        private empowerShow() {
            if(this.multipleSelection.length == 0){
                this.$message('请选择群体');
                return false;
            }
            this.empowerVal = '';
            this.empowerDialog = true;
        };
        private empowerCrowd() {
            // console.log(this.multipleSelection);
            // console.log(this.erpList);
            const erpLi:any = [];
            for (const i in this.erpList) {
                erpLi.push(this.erpList[i].erpName);
            }
            // console.log(erpLi);
            const codeList:any = [];
            for (const i in this.multipleSelection) {
                codeList.push(this.multipleSelection[i].crowdCode);
            }
            const data:any = {};
            Object.assign(data, {
                "receiverList": erpLi,
                "crowdCodeList": codeList
            });
            this.$api
                .post('/api/admin/crowdManager/grant', data)
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    // this.$message.success('赋权成功');
                    // this.erpList = [];
                    this.getCrowdList();
                    this.empowerDialog = false;
                    this.crowdItemsDialog = true;
                    this.failCrowdItems = res.failCrowdItems;
                    this.successCrowdItems = res.successCrowdItems;
                })
                .catch(err => {
                    this.$bus.$emit('main-loading', false);
                });
        }

        private handleClose(){
            this.failCrowdItems = [];
            this.successCrowdItems = [];
            this.erpList = [];
            this.crowdItemsDialog = false;
        }

        // 确认删除权限
        private delCrowdErp(obj:any, erp:string) {
            this.$confirm(`您确定要减去“${erp}”在【${obj.crowdName}】群体中的权限吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$bus.$emit('main-loading', true);
                this.$api
                    .post('/api/admin/crowdManager/grant', {
                        grantType:2,
                        crowdCodeList: [obj.crowdCode],
                        receiverList: [erp]
                    })
                    .then(res => {
                        this.$bus.$emit('main-loading', false);
                        this.$message.success('减权成功');
                        this.getCrowdList();
                    })
                    .catch(err => {
                        this.$bus.$emit('main-loading', false);
                    });
            });
        }

        private formatDate(dateStr: string, formatStr?: string) {
            return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
        }

        private crowdManagerList(list: string) {
            if(!list){
                return '';
            }
            const array: any = list.split(",");
            let dom: string = '';
            for (const i in array) {
                dom += `<b>${array[i]}</b>`;
            }
            return dom;
        }

        private crowdManagerList2(list: string) {
            if(!list){
                return '';
            }
            const array: any = list.split(",");

            let dom: string = '';
            for (const i in this.erpList) {
                if(array.indexOf(this.erpList[i].erpName) == -1){
                    dom += `<b class="b">${this.erpList[i].erpName}</b>`;
                }else{
                    dom += `<b class="b1">${this.erpList[i].erpName}</b>`;
                }
            }
            return dom;
        }

        private crowdManagerList3() {
            let dom: string = '';
            for (const i in this.erpList) {
                dom += `<b class="b2">${this.erpList[i].erpName}</b>`;
            }
            return dom;
        }

        private mounted() {
            // this.addMonitor();
            this.init();
            if (this.$route.query.new == 'tag') {
                this.showCrowd('1');
            } else if (this.$route.query.code) {
                this.crowdData = {
                    crowdCode: this.$route.query.code
                };
                this.showCrowd(this.$route.query.type);
            }
        }

        // private addMonitor() {
        //     this.$bus.$on('CrowdDelete', () => {
        //         this.getCrowdList();
        //     });
        //     this.$bus.$on('HideToCrowd', (list?: any) => {
        //         this.hideToCrowd(list);
        //     });
        //     this.$bus.$on('editCrowd', (crowd: any) => {
        //         this.crowdData = crowd;
        //         this.showCrowd(this.crowdData.crowdType);
        //     });
        // }

        private showCrowd(type: string) {
            this.showCrowdType = type;
            this.toCrowd = true;
            this.showToCrowdDialog = false;
        }

        private init() {
            if (!this.curSubject) {
                return setTimeout(this.init, 500);
            }
            this.pageNo = this.$route.params.pageNo ? Number(this.$route.params.pageNo) : 1;
            this.crowdState = this.$route.params.crowdState ? this.$route.params.crowdState : '';
            this.crowdType = this.$route.params.crowdType ? this.$route.params.crowdType : '';
            this.keyword = this.$route.params.keyword ? this.$route.params.keyword : '';
            this.crowdShowType = this.$route.params.crowdShowType ? this.$route.params.crowdShowType : 'crowd';
            this.getCrowdList('0');
        }

        private selectType(newType: any) {
            console.log(newType);
            if (this.crowdShowType == newType) {
                return;
            }
            this.keyword = '';
            // this.$store.commit('updateCrowdShowType', newType);
            this.crowdShowType = newType;
            this.getCrowdList();
        }

        private selectMode(newMode: string) {
            if (this.crowdShowMode == newMode) {
                return;
            }
            this.$store.commit('updateCrowdShowMode', newMode);
        }

        private getCrowdList(page?: any) {
            const params = this.genQueryParam();
            this.$bus.$emit('main-loading', true);
            if (page != '0') {
                this.pageNo = 1;
            }
            this.multipleSelection = [];
            this.queryList(params).then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.total = res.total;
                this.dataList = [];
                this.dataList = res.list;
                this.crowdQuery = false;
            }).catch(err => {
                this.$bus.$emit('main-loading', false);
            });
        }

        private genQueryParam() {
            const query: any = {};
            if (this.crowdShowType == 'tag') {
                if (this.manager) {
                    query[this.manager] = window.sessionStorage.getItem('userErp');
                }
                if (this.keyword && this.keyword != '') {
                    query['keyword'] = this.keyword;
                }
            } else {
                if (this.crowdState) {
                    query['crowdState'] = this.crowdState;
                }
                if (this.crowdType) {
                    query['crowdType'] = this.crowdType;
                }
                if (this.keyword && this.keyword != '') {
                    query['keyword'] = this.keyword;
                }
            }

            return query;
        }

        // ========== ajax request  ==========

        private queryList(params?: any) {
            return new Promise((resolve, reject) => {
                let url = `/api/ava/crowd/me`;
                const data = {
                    pageNum: this.pageNo,
                    pageSize: this.pageSize,
                    subjectId: this.curSubject?.id
                };

                if (this.crowdShowType == 'tag') {
                    url = `/api/admin/tag/page`;
                    data.isSuperAdmin = 1;
                }else{
                    data.crowdState = this.crowdState ? this.crowdState : null;
                }
                if (params) {
                    Object.assign(data, params);
                }
                this.$api
                    .post(url, data)
                    .then(res => {
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
    /*/deep/.el-drawer{*/
    /*    z-index: 9999;*/
    /*}*/
    /*/deep/.el-dialog__wrapper{*/
    /*    z-index: 2000!important;*/
    /*}*/
    /deep/ .el-tabs__nav-wrap:after {
        background: none;
    }

    /deep/ .tag-erp {
        b {
            font-weight: normal;
            background: #f3f3f3;
            margin: 3px;
            padding: 0 5px;
            border-radius: 3px;
            display: inline-block;
        }
        .bb{
            padding-right: 20px;
            position: relative;
            i{
                position: absolute;
                right: 4px;
                top:6px;
                cursor: pointer;
                &:hover{
                    color: #f00;
                }
            }
        }
        .b{
            background: #5984fe;
            color: #fff;
        }
        .b1{
            color: #bbb;
        }
        .b2{
            background: #fe596c;
            color: #fff;
        }
    }

    .query-erp{
        display: flex;
        align-items: center;
        padding:10px 0;
    }

    .crowd-manage {
        width: 100%;
        height: 100%;
        background-color: #f9fafd;
        position: relative;
        overflow: hidden;

        .header {
            width: 100%;
            height: 60px;
            padding: 0 20px 0 0;
            border-bottom: 1px solid #EAF0F9;

            .search-tool {
                width: 100%;
                margin-bottom: 20px;
                display: flex;
                align-items: center;

                .search-item {
                    flex: 0 0 auto;
                    margin-left: 10px;
                    display: flex;

                    &:first-child {
                        margin-left: 0px;
                    }

                    &.col150 {
                        width: 150px;
                    }

                    &.col300 {
                        width: 300px;
                    }

                    .type-select {
                        width: 60px;
                        height: 30px;
                        line-height: 28px;
                        text-align: center;
                        cursor: pointer;

                        font-size: 1rem;
                        border-radius: 4px;

                        margin-right: 20px;

                        color: #84919E;

                        position: relative;

                        &.active {
                            color: #3E6AF6;
                            font-weight: bold;

                            &::after {
                                content: '';
                                height: 2px;
                                background-color: #3E6AF6;
                                position: absolute;
                                bottom: 0;
                                left: 10px;
                                right: 10px;
                                border-radius: 2px;
                            }
                        }
                    }

                    .select-item {
                        /*width: 80px;*/
                        height: 30px;

                        .mode-select {
                            width: 30px;
                            height: 30px;
                            display: inline-block;
                            line-height: 30px;
                            text-align: center;
                            /*margin-right: 10px;*/
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
                    }
                }

                .spacer {
                    flex: 1 1 auto;
                }

                /deep/ .el-input__inner {
                    background: none;
                }
            }
        }

        .body {
            width: 100%;
            height: calc(100% - 68px);
            margin-top: 4px;
            padding: 0 20px 18px 20px;
            box-sizing: border-box;

            a {
                padding: 0 15px 0 0;
            }


            .crowd-content {
                width: 100%;
                height: calc(100% - 40px);
                // margin-bottom: 20px;
                display: flex;
                flex-wrap: wrap;

                overflow-y: auto;
                padding-top: 20px;

                &.table {
                    background-color: #fff;
                }
            }

            .paginationa {
                width: 100%;
                height: 32px;
                padding: {
                    top: 18px;
                    // bottom: 18px;
                    right: 20px;
                }
                display: flex;
                justify-content: flex-end;
            }

            .no-data {
                width: 100%;
                height: calc(100% - 52px);
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .crowd-num {
            color: #396bf6;
            font-weight: bold;
        }

        .crowd-li {
            padding: 20px 0 15px 60px;
            border-bottom: 1px solid #eee;
            height: 90px;
            line-height: 25px;
            position: relative;
            cursor: pointer;

            &:last-child {
                border-bottom: 0;
            }

            div {
                font-size: 12px;
                color: #888;
            }

            img {
                position: absolute;
                left: 0;
                top: 18px;
                width: 50px;
                height: 50px;
            }

            &:hover {
                color: #5984fe;

                div {
                    color: #5984fe;
                }
            }
        }

        /deep/ .el-tabs__header {
            margin-bottom: 0;
        }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
            border-bottom: 1px solid #F6F8FA;
        }
    }
</style>
