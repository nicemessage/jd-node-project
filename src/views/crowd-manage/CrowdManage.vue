<template>
    <div class="crowd-manage">
        <div class="header">
            <div class="search-tool">
                <div class="search-item">
                    <SysSubject></SysSubject>
                </div>
               <div class="search-item">
                   <div class="type-select" :class="{ active: crowdShowType == 'me' }" @click="selectType('me')">
                       我的群体
                   </div>
                   <div class="type-select" :class="{ active: crowdShowType == 'all' }" @click="selectType('all')">
                       全部群体
                   </div>
               </div>
                <!-- <div class="search-item">
                    <el-tabs v-model="activeName" @tab-click="selectType">
                        <el-tab-pane label="我的群体" name="me"></el-tab-pane>
                        <el-tab-pane label="全部群体" name="all"></el-tab-pane>
                    </el-tabs>
                </div> -->
                <div class="spacer"></div>
                <div class="search-item" style="width: 15%">
                    <el-select style="width: 100%" v-model="crowdType" size="small" clearable placeholder="请选择创建方式" @change="getCrowdList">
                        <el-option v-for="item in crowdTypeListMap" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="search-item" style="width: 15%">
                    <el-select style="width: 100%" v-model="crowdState" size="small" clearable placeholder="请选择更新状态" @change="getCrowdList">
                        <el-option v-for="item in crowdStateMap" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="search-item" style="width:22%">
                    <el-input style="width: 100%" size="small" v-model="keyword" clearable :placeholder="crowdShowType == 'me'?'请输入群体名称/群体ID':'请输入群体名称/群体ID/群体负责人ERP'"
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
                <div class="search-item">
                    <el-button size="small" type="primary" @click="showToCrowd" class="el-icon-plus"> 创建群体</el-button>
                </div>
            </div>
        </div>
        <div class="body">
            <template v-if="dataList.length > 0">
                <div class="crowd-content card" v-if="crowdShowMode == 'card'" v-loading="loading">
                    <el-row :gutter="20" style="width: 100%">
                        <el-col :lg="12" :xl="8" v-for="(item, index) of dataList" :key="item.id">
                            <CrowdItem :data="item" :dataIdx="index" :type="crowdShowType" :key="item.id" :pageNo="pageNo" :crowdState="crowdState" :crowdType="crowdType" :keyword="keyword" :crowdShowType="crowdShowType"></CrowdItem>
                        </el-col>
                    </el-row>
                </div>
                <!--<div class="crowd-content table" v-else-if="crowdShowMode == 'table'" v-loading="loading">
                    <el-table :data="dataList" border size="small" style="width: 100%"
                              :header-cell-style="{ fontWeight: 'bold', color: '#000' }">
                        <el-table-column min-width="265">
                            <template slot="header">
                                <div>群体编码</div>
                                <div>群体名称</div>
                            </template>
                            <template slot-scope="scope">
                                <a @click="goToInfo(scope.row)">
                                    {{ scope.row.crowdCode }}<br>
                                    {{ scope.row.crowdName }}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="crowdRealNum" label="覆盖数量" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.crowdRealNum === null ? '' : scope.row.crowdRealNum.toLocaleString() }}
                            </template>
                        </el-table-column>
                        <el-table-column label="创建方式" min-width="120">
                            <template slot-scope="scope">
                                {{ crowdTypeMap[scope.row.crowdType] ? crowdTypeMap[scope.row.crowdType] : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="更新日期" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.crowdDataDt ? formatDate(scope.row.crowdDataDt, 'YYYY-MM-DD') : '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="群体状态" min-width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.crowdState == 1">加工中</span>
                                <span v-if="scope.row.crowdState == 2">有效</span>
                                <span v-if="scope.row.crowdState == 3">加工失败</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="240" fixed="right" v-if="crowdShowType == 'me'">
                            <template slot-scope="scope">
                                <a v-if="scope.row.crowdState != 1"
                                   @click="toTouch(scope.row)">创建应用任务
                                </a>
                                <a v-if="scope.row.crowdState != 1"
                                   @click="setCrowd(scope.row)">设置
                                </a>
                                <a v-if="scope.row.crowdState != 1"
                                   @click="editItem(scope.row)">编辑
                                </a>
                                <a @click="showDelCrowd(scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>-->
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
                    <NoData label="暂无可用群体"></NoData>
                </div>
            </template>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDelDialog" width="500px">
            <div slot="title" class="dialog-title">删除群体</div>
            <div style="padding: 30px;">确认删除该群体</div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDelDialog = false">取 消</el-button>
                <el-button size="small" type="danger" @click="delCrowd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showCreateNewCrowdDialog" width="600px"
                   :before-close="cancelSetCrowd">
            <div slot="title" class="dialog-title">设置群体</div>
            <div class="el-body" v-if="newCrowd">
                <el-form :model="newCrowd" :rules="addNewRules" ref="saveCrowd" label-width="100px">
                    <el-form-item label="群体名称" prop="crowdName">
                        <el-input size="small" v-model="newCrowd.crowdName" maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="群体负责人" prop="crowdManager">
                        <SearchErp :value.sync="newCrowd.crowdManager"></SearchErp>
                    </el-form-item>
                    <!--                    <el-form-item label="群体数量">-->
                    <!--                        <span class="crowd-num">{{ newCrowd.crowdPredNum === null ? '' : newCrowd.crowdPredNum.toLocaleString() }}</span>-->
                    <!--                    </el-form-item>-->
                    <el-form-item label="群体描述" prop="crowdDesc">
                        <el-input size="small" type="textarea" :rows="3" maxlength="200" minlength="3"
                                  v-model="newCrowd.crowdDesc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelSetCrowd">取 消</el-button>
                <el-button size="small" type="primary" @click="saveCrowd">保 存</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showToCrowdDialog" width="600px">
            <div slot="title" class="dialog-title">选择群体创建类型</div>
            <div style="padding:0 15px 10px;">
                <div class="crowd-li" @click="showCrowd('1')">
                    <img :src="require(`@/assets/img/add_1.png`)" class="img">
                    <strong>标签圈群</strong>
                    <div>通过选择标签，筛选出符合条件的群体，将结果群体保存</div>
                </div>
                <div class="crowd-li" @click="showCrowd('2')">
                    <img :src="require(`@/assets/img/add_2.png`)" class="img">
                    <strong>文件建群</strong>
                    <div>上传本地txt、csv文件，与系统群体进行匹配，将结果保存为群体</div>
                </div>
                <div class="crowd-li" @click="showCrowd('4')">
                    <img :src="require(`@/assets/img/add_3.png`)" class="img">
                    <strong>库表建群</strong>
                    <div>直连5K集群数据表，选择对应群体ID，设置筛选条件，将结果保存为群体</div>
                </div>
                <div class="crowd-li" @click="showCrowd('5')">
                    <img :src="require(`@/assets/img/add_4.png`)" class="img">
                    <strong>二次筛选</strong>
                    <div>对文件建群和库表建群类型的群体与选择的标签进行匹配，将结果保存为群体</div>
                </div>
<!--                <div class="crowd-li" @click="showCrowd('6')" v-if="curSubject && curSubject.id =='1'">-->
<!--                    <img :src="require(`@/assets/img/add_5.png`)" class="img">-->
<!--                    <strong>地址建群</strong>-->
<!--                    <div>通过地图区域圈选完成指定地理范围内群体，将结果保存为群体</div>-->
<!--                </div>-->
            </div>
        </el-dialog>
        <el-drawer
                title="群体创建"
                :visible.sync="toCrowd"
                :before-close="hideToCrowd"
                :wrapperClosable="false"
                size="90%">
            <div style="position: absolute;top:60px;left:0;right:0;bottom:0;" v-if="toCrowd">
                <TagToCrowd v-if="showCrowdType == '1'" :crowdData="crowdData"></TagToCrowd>
                <FileToCrowd v-if="showCrowdType == '2'" :crowdData="crowdData"></FileToCrowd>
                <DbToCrowd v-if="showCrowdType == '4'" :crowdData="crowdData"></DbToCrowd>
                <TwoToCrowd v-if="showCrowdType == '5'" :crowdData="crowdData"></TwoToCrowd>
                <MapToCrowd v-if="showCrowdType == '6'" :crowdData="crowdData"></MapToCrowd>
            </div>
        </el-drawer>
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
    import { State } from 'vuex-class';

    // mixin引入
    import { PageMixin } from '@/mixins/pageMixin';

    // 第三方库引入
    import moment from 'moment';

    // 静态配置引入

    // 公共组件引入
    import NoData from '@/components/NoDataIcon.vue';
    import SysSubject from '@/components/SysSubject.vue';
    import SearchErp from '@/components/SearchErp.vue';

    import TagToCrowd from '@/views/crowd-create/TagToCrowd.vue';
    import FileToCrowd from '@/views/crowd-create/FileToCrowd.vue';
    import DbToCrowd from '@/views/crowd-create/DbToCrowd.vue';
    import TwoToCrowd from '@/views/crowd-create/TwoToCrowd.vue';
    import MapToCrowd from '@/views/crowd-create/MapToCrowd.vue';

    // 公共类引入

    // 私有组件引入
    import CrowdItem from './CrowdItem.vue';

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
            NoData,
            SearchErp,
            TagToCrowd,
            FileToCrowd,
            DbToCrowd,
            TwoToCrowd,
            MapToCrowd,
        }
    })
    export default class CrowdManage extends Mixins(PageMixin) {
        @State(state => state.curSubject) curSubject!: Subject | null;

        @Watch('curSubject')
        private subjectChange() {
            this.getCrowdList();
        }

        // @State(state => state.crowdShowType) crowdShowType!: string;
        private crowdShowType: string = 'me';
        @State(state => state.crowdShowMode) crowdShowMode!: string;

        private loading:boolean = false;
        private toCrowd:boolean = false;
        private showToCrowdDialog:boolean = false;
        private activeName:string = 'me';

        private routerFor: string = 'tag-to-crowd'; // tag, card

        private dataList: any[] = [];

        private crowdData: any = null;
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

        @Watch('pageNo')
        private pageNoChange() {
            this.getCrowdList("0");
        }

        @Watch('pageSize')
        private pageSizeChange() {
            this.getCrowdList("0");
        }

        private showCreateNewCrowdDialog: boolean = false;
        private newCrowd: any = null;
        private cacheCrowd: any = null;
        private addNewRules: any = {
            crowdName: [{ required: true, message: '请填写群体名称', trigger: 'blur' }],
            crowdDesc: [
                { required: true, message: '请填写群体描述', trigger: 'blur' },
                { min: 3, max: 200, message: '长度在 3 到 20 个字符', trigger: 'blur' }
            ],
            crowdManagerList: [{ required: true, message: '请填写群体负责人', trigger: 'blur' }]
        };

        private formatDate(dateStr: string, formatStr?: string) {
            return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
        }

        private mounted() {
            this.addMonitor();
            this.init();
            if(this.$route.query.new == 'tag'){
                this.showCrowd('1');
            } else if (this.$route.query.code) {
                this.crowdData = {
                    crowdCode:this.$route.query.code
                };
                this.showCrowd(this.$route.query.type);
            }
        }

        private addMonitor() {
            this.$bus.$on('CrowdDelete', () => {
                this.getCrowdList();
            });
            this.$bus.$on('HideToCrowd', (list?:any) => {
                this.hideToCrowd(list);
            });
            this.$bus.$on('editCrowd', (crowd:any) => {
                this.crowdData = crowd;
                this.showCrowd(this.crowdData.crowdType);
            });
        }

        private showCrowd(type:string){
            this.showCrowdType = type;
            this.toCrowd = true;
            this.showToCrowdDialog = false;
        }

        private hideToCrowd(list?:any){
            this.toCrowd = false;
            this.showCrowdType = '';
            this.crowdData = null;
            this.showCrowdType = null;
            if(list === true){
                this.getCrowdList();
            }
        }

        private showToCrowd(){
            this.showToCrowdDialog = true;
        }

        private init() {
            if (!this.curSubject) {
                return setTimeout(this.init, 500);
            }
            // this.pageNo = window.sessionStorage.getItem('CrowdPageNo')?Number(window.sessionStorage.getItem('CrowdPageNo')):1;
            // this.crowdQuery = window.sessionStorage.getItem('CrowdQuery');
            // console.log('页码和参数：', this.pageNo, this.crowdQuery);
            // if (this.crowdQuery) {
            //     const crowdQuery = JSON.parse(this.crowdQuery);
            //     this.crowdState = crowdQuery.crowdState;
            //     this.crowdType = crowdQuery.crowdType;
            //     this.keyword = crowdQuery.keyword;
            //     if (crowdQuery.crowdShowType && crowdQuery.crowdShowType.length > 0) {
            //         // this.$store.commit('updateCrowdShowType', crowdQuery.crowdShowType);
            //         this.crowdShowType = crowdQuery.crowdShowType;
            //     }
            // }
            this.pageNo = this.$route.params.pageNo?Number(this.$route.params.pageNo):1;
            this.crowdState = this.$route.params.crowdState?this.$route.params.crowdState:'';
            this.crowdType = this.$route.params.crowdType?this.$route.params.crowdType:'';
            this.keyword = this.$route.params.keyword?this.$route.params.keyword:'';
            this.crowdShowType = this.$route.params.crowdShowType?this.$route.params.crowdShowType:'me';
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

        private getCrowdList(page?:any) {
            const params = this.genQueryParam();
            this.$bus.$emit('main-loading', true);
            if(page != '0'){
                this.pageNo = 1;
            }
            this.loading = true;
            console.log('页码和参数1：', this.pageNo, this.crowdQuery);
            this.queryList(params).then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.total = res.total;
                this.dataList = [];
                this.dataList = res.list;
                // window.sessionStorage.setItem('CrowdPageNo', '1');
                this.crowdQuery = false;
                // window.sessionStorage.setItem('CrowdQuery', JSON.stringify({
                //     crowdState: '',
                //     crowdType: '',
                //     keyword: '',
                //     crowdShowType: ''
                // }));
            }).catch(err => {
                this.$bus.$emit('main-loading', false);
            }).finally( () => {
                this.loading = false;
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
            this.$confirm('确认删除该群体?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delCrowd();
            });
            // this.showDelDialog = true;
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

        private toTouch(data:any) {
            const target = {
                name: 'app-touch',
                query: {
                    crowdCode: data.crowdCode
                }
            };
            this.$router.push(target);
        }

        private goToInfo(crowd: any) {
            if (!crowd || !crowd.crowdCode) {
                return;
            }
            this.crowdQuery = {
                crowdState: this.crowdState,
                crowdType: this.crowdType,
                keyword: this.keyword,
                crowdShowType: this.crowdShowType,
            };
            // window.sessionStorage.setItem('CrowdPageNo', this.pageNo);
            // window.sessionStorage.setItem('CrowdQuery', JSON.stringify(this.crowdQuery));
            console.log('页码和参数2：', this.pageNo, this.crowdQuery);

            const target = {
                name: 'crowd-info',
                params: {
                    crowdCode: crowd.crowdCode
                }
            };
            this.$router.push(target);
        }

        private editItem(crowd: any) {
            if (!crowd || !crowd.crowdCode) {
                return;
            }
            const crowdCode: string = crowd.crowdCode;
            const crowdType: number = crowd.crowdType;

            switch (crowdType) {
                case 2:
                    this.routerFor = 'file-to-crowd';
                    break;
                case 4:
                    this.routerFor = 'db-to-crowd';
                    break;
                default:
                    this.routerFor = 'tag-to-crowd';
            }
            this.$router.push({
                name: this.routerFor,
                query: {
                    code: crowdCode
                }
            });
        }

        private setCrowd(crowd: any) {
            this.newCrowd = crowd;
            this.cacheCrowd = JSON.parse(JSON.stringify(crowd));
            this.showCreateNewCrowdDialog = true;
        }

        private saveCrowd() {
            (this.$refs.saveCrowd as any).validate((valid: boolean) => {
                if (valid) {
                    this.crowdUpdateTag(this.data).then(() => {
                        this.showCreateNewCrowdDialog = false;
                        this.$message.success('更新成功');
                        this.newCrowd = null;
                        this.cacheCrowd = null;
                    });
                }
            });
        }

        private cancelSetCrowd() {
            // console.log('cancel');
            Object.assign(this.newCrowd, this.cacheCrowd);
            this.newCrowd = null;
            this.cacheCrowd = null;
            this.showCreateNewCrowdDialog = false;
        }

        // ========== ajax request  ==========

        private queryList(params?: any) {
            return new Promise((resolve, reject) => {
                const url = `/api/ava/crowd/${this.crowdShowType}`;
                const data = {
                    pageNum: this.pageNo,
                    pageSize: this.pageSize,
                    subjectId: this.curSubject?.id,
                    crowdState: this.crowdState ? this.crowdState : null
                };
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

        private crowdUpdateTag(newCrowd: any) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/crowd/update/tag';
                const data = newCrowd;
                Object.assign(data, newCrowd);

                delete data.createdTime;
                delete data.modifiedTime;
                delete data.valid;

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
    /deep/.el-tabs__nav-wrap:after{
        background: none;
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

                            &::after{
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
                /deep/.el-input__inner{
                    background: none;
                }
            }
        }

        .body {
            width: 100%;
            height: calc(100% - 68px);
            margin-top: 4px;
            padding: 0 0 18px 20px;
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
                    right:20px;
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
        .crowd-li{
            padding: 20px 0 15px 60px;
            border-bottom: 1px solid #eee;
            height: 90px;
            line-height: 25px;
            position: relative;
            cursor: pointer;
            &:last-child{
                border-bottom: 0;
            }
            div{
                font-size: 12px;
                color: #888;
            }
            img{
                position: absolute;
                left:0;
                top:18px;
                width: 50px;
                height: 50px;
            }
            &:hover{
                color: #5984fe;
                div{
                    color: #5984fe;
                }
            }
        }
        /deep/.el-tabs__header{
            margin-bottom: 0;
        }
        /deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
            border-bottom: 1px solid #F6F8FA;
        }
    }
</style>
