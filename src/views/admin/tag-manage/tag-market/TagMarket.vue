<template>
    <div class="tag-market">
        <div class="header">
            <div class="subject-list">
                <SysSubject></SysSubject>
            </div>
            <div class="search-tag-btn">
                <div style="flex: 1"></div>
                <el-button style="margin-left:20px" @click="addLabel" class="addBtn" type="primary" size="medium">注册标签</el-button>
            </div>
        </div>
        <div class="body self-scroll">
            <TagTypeComp :search.sync="searchFilter" :admin="true"></TagTypeComp>
            <div class="input-list" style="min-width: 847px;">
                <el-input
                        placeholder="标签编码/标签名称/标签描述"
                        v-model="searchWord"
                        clstag="9Q75|28472"
                        size="medium"
                        clearable
                        style="width:18%;margin-right: 8px;"
                >
                </el-input>
                <el-input
                        placeholder="标签数据源表名称"
                        v-model="sourceTbOrTopic"
                        size="medium"
                        clearable
                        style="width:18%;margin-right: 8px;"
                >
                </el-input>

                <el-input
                        placeholder="技术负责人erp"
                        v-model="techManager"
                        size="medium"
                        clearable
                        style="width:18%;margin-right: 8px;"
                >
                </el-input>
                <el-input
                        placeholder="业务负责人erp"
                        v-model="bizManager"
                        size="medium"
                        clearable
                        style="width:18%;margin-right: 8px;"
                >
                </el-input>
                <el-select
                        v-model="push2R2M"
                        placeholder="请选择"
                        size="medium"
                        v-if="userInfo.roleCode == 'admin'"
                        style="width:15%;margin-right: 8px;"
                >
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已缓存" value="1"></el-option>
                    <el-option label="未缓存" value="0"></el-option>
                </el-select>
                <el-button type="primary" size="medium" @click="searchTag">筛选</el-button>
            </div>
            <div class="tag-list">
                <div class="tag-list-count-and-order">
                    <div class="tag-count">
                        筛选结果总数<span>{{ total }}</span>
                    </div>
                </div>
                <div class="tag-list-content">
                    <el-table :data="tagList" @sort-change="sortChange" size="small" border :header-cell-style="{ fontWeight: 'bold', color: '#000' }">
                        <el-table-column prop="tagName" label="标签名称" min-width="150px"></el-table-column>
                        <el-table-column prop="tagCode" label="标签编码" width="120px" sortable="custom"></el-table-column>
                        <el-table-column :label="'创建时间'" prop="createdTime" sortable="custom" min-width="150">
                            <template slot-scope="scope">
                                {{ formatDate(scope.row.createdTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="'修改时间'" prop="modifiedTime" sortable="custom" min-width="150">
                            <template slot-scope="scope">
                                {{ formatDate(scope.row.modifiedTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="tagClassify" label="数据更新" width="100px">
                            <template slot-scope="scope">
                                {{ tagClassifyMap[scope.row.tagClassify] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="sourceDataCycle" label="更新频率">
                            <template slot-scope="scope">
                                {{ sourceDataCycle[scope.row.sourceDataCycle] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="tagDataType" label="标签类型" width="120px">
                            <template slot-scope="scope">
                                {{ tagDataTypeMap[scope.row.tagDataType] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="coverNum" label="覆盖人群" sortable="custom" width="110px" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ scope.row.coverNum ? scope.row.coverNum : 0 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="tagSecLevel" label="等级" sortable="custom" width="80px">
                            <template slot-scope="scope">
                                {{ tagSecLevelMap[scope.row.tagSecLevel] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="tagStatus" label="状态" sortable="custom">
                            <template slot-scope="scope">
                                {{ tagStatusMap[scope.row.tagStatus] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="techManager" label="技术负责人" width="120px" sortable="custom"></el-table-column>
                        <el-table-column prop="dataDt" label="更新日期" sortable="custom" min-width="110px">
                            <template slot-scope="scope">
                                {{ scope.row.dataDt ? formatDateDD(parseFloat(scope.row.dataDt + '000')) : '未知' }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="'创建人'" prop="creator" sortable="custom" width="120">
                            <template slot-scope="scope">
                                {{ scope.row.creator }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="'修改人'" prop="modifier" sortable="custom" width="120">
                            <template slot-scope="scope">
                                {{ scope.row.modifier }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="160" fixed="right">
                            <template slot-scope="scope">
                                <div v-if="scope.row.tagStatus == 1">
                                    <el-button size="mini" type="text" @click="online(scope.row)">上线</el-button>
                                    <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                                    <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
                                    <el-button size="mini" type="text" @click="openDelete(scope.row)">删除</el-button>
                                </div>
                                <div slot-scope="scope" v-else-if="scope.row.tagStatus == 2">
                                    <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
                                </div>
                                <div slot-scope="scope" v-else-if="scope.row.tagStatus == 3">
                                    <el-button size="mini" type="text" @click="online(scope.row)">上线</el-button>
                                    <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                                    <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
                                    <el-button size="mini" type="text" @click="openDelete(scope.row)">删除</el-button>
                                </div>
                                <div slot-scope="scope" v-else-if="scope.row.tagStatus == 4">
                                    <el-button size="mini" type="text" @click="offline(scope.row)">下线</el-button>
                                    <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                                    <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
                                </div>
                                <div slot-scope="scope" v-else-if="scope.row.tagStatus == 5">
                                    <el-button size="mini" type="text" @click="online(scope.row)">上线</el-button>
                                    <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                                    <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
                                    <el-button size="mini" type="text" @click="openDelete(scope.row)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="userInfo.roleCode == 'admin'" label="缓存开关" width="110" fixed="right">
                            <template slot-scope="scope">
                                <el-switch
                                        v-model="scope.row.push2R2M"
                                        active-text="开"
                                        inactive-text="关"
                                        :active-value="1"
                                        :inactive-value="0"
                                        :disabled="scope.row.superAdminDisabled"
                                        @change="changeSuperAdminControl(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <TagItemComp v-for="item of tagList" :key="item.id" :data="item"></TagItemComp> -->
                </div>
            </div>
            <div class="paginationa">
                <el-pagination
                        layout="total,sizes,prev, pager, next, jumper"
                        :total="total"
                        :page-size.sync="pageSize"
                        :current-page.sync="pageNo"
                        :page-sizes="pageSizeList"
                >
                </el-pagination>
            </div>
        </div>
        <!-- <el-popover key="shop-car" trigger="click">
      <div class="shop-car-content">
        <TagShopCar></TagShopCar>
      </div>
      <div slot="reference" class="shop-car">
        <i class="el-icon-shopping-cart-full"></i>
        <div class="shop-car-count"></div>
      </div>
    </el-popover> -->
        <el-drawer
                title="标签详情"
                :visible.sync="tableDialog"
                direction="rtl"
                size="80%">
            <TagInfo :tagId="tagId" :tagCode="tagCode" v-if="tableDialog"></TagInfo>
        </el-drawer>
    </div>
</template>

<script lang="ts">
    import { Component, Mixins, Watch } from 'vue-property-decorator';
    import { State } from 'vuex-class';
    // mixin引入
    import { PageMixin } from '@/mixins/pageMixin';

    // 第三方库引入
    import moment from 'moment';
    // 静态配置引入

    // 公共组件引入
    import SysSubject from '@/components/SysSubject.vue';
    import TagTypeComp from '@/components/TagType.vue';

    // 公共类引入

    // 私有组件引入
    import TagItemComp from './TagItem.vue';
    import TagShopCar from './TagShopCar.vue';
    import TagInfo from './TagInfo.vue';

    // 私有类引入

    // 本地定义和声明
    interface TagType {
        label: string;
        tagCateType: number;
        children: Tag[];
    }

    interface Tag {
        id: number; // 主键ID
        tagCode: string; // 标签编码
        tagName: string; // 标签名称
        subjectId: number; // 主体ID
        tagClassify: number; // 标签类型
        tagDesc: string; //标签描述
        tagLogicDesc: string; //标签逻辑描述
        tagSecLevel: number; // 标签安全级
        tagStatus: number; // 标签状态
        modifiedTime: string; // 修改时间
        createdTime: string; // 创建时间
        coverNum: number; // 覆盖数
        [propName: string]: any;
    }

    interface TagFilter {
        [propName: string]: any;
    }

    interface Subject {
        id: number;
        subjectCn: string;
        subjectEn: string;
        subjectDesc: string;
        subjectSort: number;
    }

    interface SearchFilter {
        lastTagCateIdList?: Array<string>;
        isGrant?: number;
        tagClassify?: number;
        tagDataType?: number;
    }

    // 路由勾子
    Component.registerHooks(['beforeRouteLeave']);

    @Component({
        components: {
            SysSubject,
            TagTypeComp,
            TagItemComp,
            TagShopCar,
            TagInfo
        }
    })
    export default class TagMarket extends Mixins(PageMixin) {
        private tagFilter: TagFilter[] = [];
        private tableData: any[] = [];
        private tableDialog: boolean = false;
        private tagId: any = false;
        private tagCode: string = "";
        private tableColumn: any[] = [
            {
                label: '标签名称',
                prop: 'tagName'
            },
            {
                label: '标签编码',
                prop: 'dsId'
            },
            {
                label: '数据更新',
                prop: 'dsCol'
            },
            {
                label: '更新频率',
                prop: 'useForm'
            },
            {
                label: '标签类型',
                prop: 'tagCompColType'
            },

            {
                label: '覆盖人群',
                prop: 'tagName'
            },
            {
                label: '等级',
                prop: 'dsId'
            },
            {
                label: '状态',
                prop: 'dsCol'
            },
            {
                label: '负责人',
                prop: 'useForm'
            },
            {
                label: '更新日期',
                prop: 'tagCompColType'
            },
            {
                label: '创建人\n修改人',
                slotName: 'people',
                minWidth: '120px'
            },
            {
                label: '创建时间\n修改时间',
                slotName: 'time',
                minWidth: '120px'
            },
            {
                label: '操作',
                slotName: 'opBtns',
                minWidth: '200px'
            }
        ];
        private tagList: Tag[] = [];
        private searchFilter: SearchFilter = {};
        private lastTagCateIdList: any[] = [];
        private searchWord: string = '';
        private sourceTbOrTopic: string = '';  //源数据表名
        private bizManager: string = '';   //业务负责人
        private techManager: string = '';  //技术负责人
        private push2R2M:string = '';
        private initType:boolean = false;

        private shopcarCount: number = 0;

        private grantStateMap: object = {
            0: '未授权',
            1: '已授权',
            2: '已申请',
            3: '已驳回'
        };
        private tagClassifyMap: object = {
            1: '离线更新',
            2: '离线更新',
            3: '实时更新'
        };
        private sourceDataCycle: object = {
            y: '年更',
            m: '月更',
            d: '日更',
            h: '时更'
        };
        private tagDataTypeMap: object = {
            1: '事实及统计类',
            2: '挖掘预测类'
        };
        private tagSecLevelMap: object = {
            1: '一级',
            2: '二级'
        };
        private tagStatusMap: object = {
            1: '待上线',
            2: '上线中',
            3: '上线失败',
            4: '已上线',
            5: '已下线'
        };
        @Watch('pageNo')
        private pageNoChange() {
            this.searchTag();
        }
        @Watch('pageSize')
        private pageSizeChange() {
            this.searchTag();
        }

        private mounted() {
            this.techManager = window.sessionStorage.getItem('userErp');
            this.init();
            // this.qidian();
        }
        @State(state => state.curSubject) curSubject!: Subject | null;
        @State(state => state.userInfo) userInfo?: any;
        @Watch('curSubject')
        private subjectChange() {
            this.searchTag();
        }
        private addMonitor() {
            this.$bus.$on('applyTagGrant', () => {
                this.searchTag();
            });
            this.$bus.$on('checkTagInfoA', (id: number) => {
                this.$router.push({
                    name: 'admin/tag-info',
                    params: {
                        tagCode: id.toString()
                    }
                });
            });
        }
        private orderMap: any = {
            ascending: 1,
            descending: 2
        };
        private sortMap: object = {
            sortBy: 11,
            sortOrder: 2
        };
        private sortPropMap: any = {
            coverNum: 3,
            tagCode: 4,
            tagSecLevel: 5,
            tagStatus: 6,
            techManager: 7,
            dataDt: 8,
            creator: 9,
            modifier: 10,
            createdTime: 11,
            modifiedTime: 12
        };
        private sortChange(sortData: any) {
            const { prop, order } = sortData;
            console.log('prop:', prop);
            this.sortMap = {
                sortBy: this.sortPropMap[prop],
                sortOrder: this.orderMap[order]
            };
            this.searchTag();
        }
        private formatDate(dateStr: any) {
            return moment(dateStr).format('YYYY-MM-DD HH:mm:ss');
        }
        private formatDateDD(dateStr: any) {
            return moment(dateStr).format('YYYY-MM-DD');
        }
        private init() {
            if (!this.curSubject?.id) {
                return setTimeout(this.init, 500);
            }
            this.$api.get('/api/ava/menu/getUserRole').then((res: any) => {
                if (res.length > 0) {
                    const item = res[0];
                    this.$store.commit('saveUserInfo', item);
                }
            });
            this.$store.state.tagClassify = 0;
            this.initType = true;
            this.addMonitor();
            this.searchTag();
        }

        private searchTag() {
            if (!this.curSubject?.id || !this.initType) {
                return false;
            }
            const params = {
                isSuperAdmin: 1,
                subjectId: this.curSubject?.id,
                pageNum: this.pageNo,
                pageSize: this.pageSize
            };
            if (this.push2R2M != '') {
                Object.assign(params, {
                    push2R2M: this.push2R2M
                });
            }
            // if (this.lastTagCateIdList.length > 0) {
            //   Object.assign(params, { lastTagCateIdList: this.lastTagCateIdList });
            // }
            if (this.sourceTbOrTopic != '') {
                Object.assign(params, {
                    sourceTbOrTopic: this.sourceTbOrTopic
                });
            }
            if (this.bizManager != '') {
                Object.assign(params, {
                    bizManager: this.bizManager
                });
            }
            if (this.techManager != '') {
                Object.assign(params, {
                    techManager: this.techManager
                });
            }
            Object.assign(params, this.searchFilter);
            if (this.searchWord && this.searchWord != '') {
                Object.assign(params, {
                    keyword: this.searchWord.trim()
                });
            }
            Object.assign(params, this.sortMap);
            this.tagPage(params).then((res: any) => {
                this.tagList = res.list.slice(0);
                this.total = res.total;
            });
        }
        private addLabel() {
            this.$router.push({
                path: '/admin/tag-market/add'
            });
        }
        private online(row: any) {
            this.$api.get('/api/admin/tag/toOnline', { tagCode: row.tagCode }).then((res: any) => {
                this.$message.success('申请上线成功');
                this.searchTag();
            });
        }
        private offline(row: any) {
            this.$api.get('/api/admin/tag/toOffline', { tagCode: row.tagCode }).then((res: any) => {
                this.$message.success('下线成功');
                this.searchTag();
            });
        }
        private edit(row: any) {
            this.$store.state.tagClassify = row.tagClassify;
            this.$router.push({
                path: `/admin/tag-market/${row.id}`
            });
        }
        private show(row: any) {
            this.tableDialog = true;
            this.tagId = row.id;
            for (const i in this.tagList) {
                if (this.tagList.hasOwnProperty(i)) {
                    const tag = this.tagList[i];
                    if (tag.id == this.tagId) {
                        this.tagCode = tag.tagCode;
                    }
                }
            }
            // this.$router.push({
            //     name: 'tag-info',
            //     params: {
            //         tagCode: row.id.toString()
            //     }
            // });
        }
        private openDelete(row: any) {
            this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.deleteRow(row);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }
        private deleteRow(row: any) {
            this.$api.get('/api/admin/tag/del', { id: row.id }).then((res: any) => {
                this.searchTag();
            });
        }
        private changeSuperAdminControl(row: any) {
            this.$bus.$emit('main-loading', true);
            this.$api.get('/api/admin/tag/valPush2R2M', { tagCode: row.tagCode, dataDt: row.dataDt }).then((res: any) => {
                // row.superAdminDisabled = true;
                this.$bus.$emit('main-loading', false);
                // 成功之后重新请求列表
                // this.searchTag();
            });
        }
        // ========== ajax request  ==========

        private tagPage(params?: any) {
            // console.log(JSON.stringify(params));
            return new Promise((resolve, reject) => {
                const url = '/api/admin/tag/page';
                const data = {};
                this.$bus.$emit('main-loading', true);
                Object.assign(data, params);
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

        private qidian(w: any = window, d: any = document, s: any = '//qdsdk.jd.com/2.0.0/qd.js', c: any = { sid: '3VD0H' }) {
            (w.__qd__ = w.__qd__ || {}), (w.__qd__.config = w.__qd__.config || c);
            const o = d.createElement('script');
            (o.async = !0), (o.src = s), o.setAttribute('name', 'qidian-sdk'), (o.crossOrigin = 'anonymous'), d.head.appendChild(o);
        }
    }
</script>

<style lang="scss" scoped>
    .tag-market {
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

            .search-tag-btn {
                min-width: 100px;
                height: 64px;
                margin-right: 20px;
                text-align: right;
                float: right;
                display: flex;
                align-items: center;
                flex: 1 1 auto;
                /deep/.el-input__inner{
                    background: none;
                }
            }
        }
        .input-list{
            padding: 20px 0 0;
        }
        .body {
            width: 100%;
            height: calc(100% - 68px);
            margin-top: 4px;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0 20px 50px 20px;
            /*box-sizing: border-box;*/
            /*display: flex;*/
            /*flex-direction: column;*/

            .tag-list {
                /*flex: 1 1 auto;*/
                width: 100%;
                margin-top: 12px;
                /*display: flex;*/
                flex-direction: column;

                .tag-list-count-and-order {
                    width: 100%;
                    height: 22px;
                    flex: 0 0 auto;
                    display: flex;
                    justify-content: space-between;

                    .tag-count {
                        font-size: 0.75rem;
                        color: rgba(153, 153, 153, 1);
                        span {
                            margin-left: 5px;
                            color: rgba(57, 107, 246, 1);
                        }
                    }
                }

                .tag-list-content {
                    flex: 1 1 auto;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    /deep/ .cell {
                        white-space: pre-wrap !important;
                    }
                }
            }
        }
        .paginationa {
            margin-top: 20px;
            width: 100%;
            padding: {
                top: 0px;
                bottom: 18px;
                left: 40px;
                right: 40px;
            }
            display: flex;
            justify-content: flex-end;
        }
        .shop-car {
            position: fixed;
            bottom: 40px;
            right: 40px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(67, 111, 233, 1);
            border: 1px solid rgba(17, 57, 160, 1);
            box-shadow: 0px 0px 5px 1px rgba(105, 105, 105, 0.5), 0px 4px 1px 0px rgba(255, 255, 255, 0.5), 0px -3px 3px 0px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            text-align: center;
            i {
                line-height: 56px;
                font-size: 2rem;
                color: #fff;
            }
        }

        .tag-info-container {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
        }
    }
</style>
