<template>
    <section class="edit-tag-section">
        <!--:rules="rules"-->
        <el-form :model="tagParams"  label-width="110px" class="com-form" ref="form">
            <div class="top-section">
                <div class="top-section_left">
                    <p class="title">基本信息</p>
                    <div class="pl10">
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="标签名称：" prop="tagName">
                                    <el-input class="com-input com-width" placeholder="可输入2-30字符" v-model="tagParams.tagName" maxlength="30" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="标签类型：" prop="tagDataType">
                                    <el-select class="com-select com-width" placeholder="请选择" v-model="tagParams.tagDataType" clearable>
                                        <el-option v-for="(item, index) in tagDataTypeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="标签分类：" prop="fullTagCateIdList">
                                    <el-cascader class="com-cascader" :props="{ expandTrigger: 'hover', children: 'childs', label: 'tagCateName', value: 'id' }" v-model="tagParams.fullTagCateIdList" :options="tagCateIdList" filterable @change="changeCate" clearable style="width: 100%"></el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="标签等级：" prop="tagSecLevel">
                                    <el-select class="com-select com-width" placeholder="请选择" v-model="tagParams.tagSecLevel" clearable :disabled="isOnline">
                                        <el-option v-for="(item, index) in tagSecLevelOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <!-- <el-form-item label="更新频率：" prop="tagUpdate">
                  <el-select class="com-select com-width" placeholder="请选择" v-model="tagParams.tagUpdate" clearable>
                    <el-option v-for="(item, index) in updateOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item> -->
                            </el-col>
                        </el-row>
                        <el-form-item label="标签描述：" prop="tagDesc">
                            <el-input class="com-input" type="textarea" placeholder="可输入3~2000字符" :rows="5" :resize="'none'" v-model="tagParams.tagDesc" maxlength="2000" clearable>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="bottom-section">
                <div class="bottom-section_left">
                    <p class="title">业务信息</p>
                    <div class="pl10">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="业务负责人：" prop="bizManager">
                                    <el-select class="com-select com-width noSuffix" v-model="tagParams.bizManager" filterable remote reserve-keyword placeholder="请输入用户Id" :remote-method="searchErp" @change="checkErp">
                                        <el-option v-for="item in erpOptions" :key="item.value" :label="`${item.displayName}(${item.erpName})`" :value="item.erpName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务部门：" prop="bizManagerDep">
                                    <el-input class="com-input com-width" placeholder="请输入用户Id" v-model="tagParams.bizManagerDep" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所属业务：" prop="bizName">
                                    <el-input class="com-input com-width" v-model="tagParams.bizName" clearable></el-input>
                                    <!-- <el-select class="com-select com-width" placeholder="请选择" v-model="tagParams.bizName" clearable>
                    <el-option v-for="(item, index) in bizNameOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select> -->
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="center-section">
                <p class="title">数据信息</p>
                <el-form ref="table" :model="table" :rules="table.rules">
                    <com-table :tableData="table.tagData" :columnData="tagColumn" :showPage="false">
                        <template slot="tagCompName" slot-scope="scope">
                            <el-form-item :prop="`tagData[${scope.index}].tagCompName`" :render-header="renderHeader" :rules="table.rules.tagCompName">
                                <el-input class="com-input w100" placeholder="同标签名称" v-model="scope.row.tagCompName" disabled></el-input>
                            </el-form-item>
                        </template>
                        <template slot="dsId" slot-scope="scope">
                            <el-form-item :prop="`tagData[${scope.index}].dsId`" :rules="table.rules.dsId">
                                <el-select class="com-select w100" placeholder="请选择数据源" v-model="scope.row.dsId" filterable @change="getDataSource($event, scope.row)" :disabled="isOnline">
                                    <el-option v-for="(item, index) in dsIdOptions" :key="index" :label="item.dsName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                        <template slot="dsCol" slot-scope="scope">
                            <el-form-item :prop="`tagData[${scope.index}].dsCol`" :rules="table.rules.dsCol">
                                <el-select class="com-select w100" placeholder="请选择字段名称" v-model="scope.row.dsCol" clearable filterable :disabled="isOnline">
                                    <el-option v-for="(item, index) in dsColOptions" :key="index" :label="item.name" :value="item.name" :disabled="item.flag == 1"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                        <template slot="useForm" slot-scope="scope">
                            <div class="flex">
                                <div style="flex:1;">
                                    <el-form-item :prop="`tagData[${scope.index}].useForm`" :rules="table.rules.useForm">
                                        <el-select filterable class="com-select w100" placeholder="请选择使用形式" v-model="scope.row.useForm" @change="changeUseForm($event, scope.row)" :disabled="isOnline" clearable>
                                            <el-option v-for="(item, index) in useFormOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div style="flex:1;" v-if="scope.row.useForm == '21' || scope.row.useForm == '22'">
                                    <el-form-item :prop="'tagData.' + scope.index + '.useFormDetail'" :rules="table.rules.useFormDetail">
                                        <el-select class="com-select" placeholder="请选择" filterable v-model="scope.row.useFormDetail" @change="changeUseDetail($event, scope.row)" :disabled="isOnline">
                                            <template v-show="index < 10" v-for="(item, index) in emunListCopy">
                                                <el-option :key="index" :label="item.tagEnumName" :value="item.id + ''"></el-option>
                                            </template>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                        </template>
                        <template slot="tagCompColType" slot-scope="scope">
                            <el-form-item :prop="`tagData[${scope.index}].tagCompColType`" :rules="table.rules.tagCompColType">
                                <el-select class="com-select w100" placeholder="请选择数据类型" v-model="scope.row.tagCompColType" :disabled="isOnline" filterable clearable>
                                    <el-option v-for="(item, index) in dataTypeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </com-table>
                </el-form>
            </div>
            <div class="bottom-section">
                <div class="bottom-section_left">
                    <p class="title">标签加工信息</p>
                    <div class="pl10" style="margin-bottom:30px;">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="技术负责人：" prop="techManager">
                                    <el-select class="com-select com-width noSuffix" v-model="tagParams.techManager" filterable remote reserve-keyword placeholder="请输入用户Id" :remote-method="searchErp">
                                        <el-option v-for="item in erpOptions" :key="item.value" :label="`${item.displayName}(${item.erpName})`" :value="item.erpName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务库：">
                                    <el-input class="com-input com-width" placeholder="请输入" v-model="tagParams.rootSoureDb" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务表：">
                                    <el-input class="com-input com-width" placeholder="请输入" v-model="tagParams.rootSoureTb" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="加工逻辑：" style="margin-bottom:0px;">
                            <el-input class="com-input" type="textarea" placeholder="可输入3~2000字符" :rows="5" :resize="'none'" v-model="tagParams.tagLogicDesc" maxlength="2000" clearable>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
                <!-- <div class="bottom-section_right">
          <el-button class="com-button btn" type="primary" @click="save">提交注册申请</el-button>
        </div> -->
            </div>
        </el-form>
    </section>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ComTable from '@/components/ComTable.vue';
import { State, Mutation } from 'vuex-class';

@Component({
    components: {
        ComTable
    }
})
export default class EditOffline extends Vue {
    @State(state => state.nameAndTime) nameAndTime: any;
    @State(state => state.btnLoading) btnLoading?: boolean;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;

    @Prop({ type: Number }) private tagClassify?: number;
    @Prop({ type: Object }) private tagDetail: any;
    private tagParams: any = {
        bizManager: '',
        bizManagerDep: '',
        bizName: '',
        fullTagCateIdList: [], //全路径标签分类ID
        lastTagCateId: '', // 末级标签分类ID
        fullTagCateId: '',
        subjectId: window.sessionStorage.getItem('subjectId'),
        tagClassify: '',
        tagDataType: '',
        tagDesc: '',
        tagName: '',
        tagSecLevel: '',
        tagStatus: 1, // 标签状态 1:待上线,2:上线中,3:上线失败,4:已上线,5:已下线 (新增为 1 )
        techManager: '',
        rootSoureDb: '',
        rootSoureTb: '',
        tagLogicDesc: '',
        tagUpdate: '',
        tagComponentReqVOList: [
            {
                subjectId: window.sessionStorage.getItem('subjectId'),
                tagCompName: '',
                tagCompSort: 1,
                tagCompStyle: '',
                tagEnumId: '',
                tagComponentColumnReqVOList: [
                    {
                        dsCol: '',
                        dsId: '',
                        subjectId: window.sessionStorage.getItem('subjectId'),
                        tagCompCol: '',
                        tagCompColType: '',
                        tagCompId: '',
                        tagEnumLevelId: ''
                    }
                ]
            }
        ]
    };
    @Watch('tagParams.tagName', { immediate: true, deep: true })
    private handler(val: any): void {
        this.tagParams.tagComponentReqVOList[0].tagCompName = val;
        this.table.tagData[0].tagCompName = val;
    }
    private rules: any = {
        tagUpdate: [{ required: true, message: '请选择更新频率', trigger: 'change' }],
        subjectName: [{ required: true, message: '请输入主体中文名称', trigger: 'blur' }],
        tagName: [
            { required: true, message: '请输入标签名称', trigger: 'blur' },
            { min: 2, max: 30, message: '可输入2~30个字符', trigger: 'blur' }
        ],
        fullTagCateIdList: [{ required: true, message: '请选择标签分类', trigger: 'change' }],
        tagDataType: [{ required: true, message: '请选择标签分类', trigger: 'change' }],
        tagSecLevel: [{ required: true, message: '请选择标签等级', trigger: 'change' }],
        tagDesc: [
            { required: true, message: '请输入标签描述', trigger: 'blur' },
            { min: 3, max: 2000, message: '请输入3-2000个字符', trigger: 'blur' }
        ],
        bizManager: [{ required: true, message: '请输入业务负责人', trigger: 'blur' }],
        bizManagerDep: [{ required: true, message: '请输入业务部门', trigger: 'blur' }],
        bizName: [{ required: true, message: '请输入所属业务', trigger: 'blur' }],
        techManager: [{ required: true, message: '请输入技术负责人', trigger: 'blur' }]
    };
    private dataTypeOptions: any[] = this.$store.state.dataTypeOptions;
    private table: any = {
        tagData: [
            {
                dsCol: '',
                dsId: '',
                subjectId: window.sessionStorage.getItem('subjectId'),
                tagCompCol: '',
                tagCompColType: '',
                tagCompId: '',
                tagEnumLevelId: '',
                tagCompName: '',
                useForm: '',
                useFormDetail: ''
            }
        ],
        rules: {
            tagCompName: [{ required: true, message: ' ', trigger: 'blur' }],
            dsCol: [{ required: true, message: '请选择字段名称', trigger: 'change' }],
            dsId: [{ required: true, message: '请选择数据源名称', trigger: 'blur' }],
            useForm: [{ required: true, message: '请选择使用形式', trigger: 'change' }],
            useFormDetail: [{ required: true, message: '请选择枚举', trigger: 'change' }],
            tagCompColType: [{ required: true, message: '请选择数据类型', trigger: 'change' }]
        }
    };
    private tagColumn: any[] = [
        // {
        //   label: '子标签名称',
        //   slotName: 'tagCompName',
        //   renderHeader: this.renderHeader
        // },
        {
            label: '数据源名称',
            slotName: 'dsId',
            renderHeader: this.renderHeader
        },
        {
            label: '字段名称',
            slotName: 'dsCol',
            renderHeader: this.renderHeader
        },
        {
            label: '使用形式',
            slotName: 'useForm',
            renderHeader: this.renderHeader
        },
        {
            label: '数据类型',
            slotName: 'tagCompColType',
            renderHeader: this.renderHeader
        }
    ];
    private useFormOptions: any[] = [
        { label: '日期/时间型-年月日', value: '11' },
        { label: '日期/时间型-年', value: '12' },
        { label: '日期/时间型-月', value: '13' },
        { label: '日期/时间型-日', value: '14' },
        { label: '日期/时间型-时分秒', value: '15' },
        { label: '日期/时间型-时', value: '16' },
        { label: '日期/时间型-分', value: '17' },
        { label: '日期/时间型-秒', value: '18' },
        { label: '日期/时间型-时间窗口', value: '19' },
        { label: '枚举型-1级', value: '21' },
        // { label: '枚举型-N级', value: '22' },
        { label: '自定义型-数值', value: '31' },
        { label: '自定义型-文本', value: '32' }
    ];
    private updateOptions: any[] = [
        { label: '日更', value: '1' },
        { label: '月更', value: '2' },
        { label: '年更', value: '3' }
    ];
    private useFormDetailOptions: any[] = [];
    private dsIdOptions: any[] = [];
    private dsColOptions: any[] = [];
    private tagSecLevelOptions: any[] = [
        { value: 1, label: 'L1' },
        { value: 2, label: 'L2' }
    ];
    private bizNameOptions: any[] = [];
    private erpOptions: any[] = [];
    private tagCateIdList: any[] = [];
    private tagDataTypeOptions: any[] = [
        { value: 1, label: '事实及统计类' },
        { value: 2, label: '挖掘预测类' }
    ];
    private renderHeader(cerateElement: any, { column }: any) {
        return cerateElement('div', [
            cerateElement('span', {
                domProps: {
                    innerHTML: '*'
                },
                style: {
                    color: 'red'
                }
            }),
            cerateElement('span', column.label)
        ]);
    }
    private emunList: any[] = [];
    private emunListCopy: any[] = []; // 用于搜索
    private getEmunList(type: number | string) {
        return new Promise((resolve, reject) => {
            this.emunList = [];
            this.emunListCopy = [];
            const param = {
                subjectId: window.sessionStorage.getItem('subjectId'),
                tagEnumType: type
            };
            this.$api
                .get('/api/admin/tagEnum/list', param)
                .then((res: any) => {
                    // for(let i=0;i<10;i++){
                    //     this.emunList.push(res[i]);
                    // }
                    this.emunList = res;
                    this.emunListCopy = res;
                    console.log('list赋值完成');
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private changeCate(val: any) {
        this.tagParams.lastTagCateId = val[val.length - 1];
        this.tagParams.fullTagCateId = val.join('-');
        console.log('cate:', val, this.tagParams.fullTagCateId, this.tagParams.lastTagCateId);
    }
    private getDsIdOptions() {
        const params = {
            dsType: this.tagClassify,
            subjectId: window.sessionStorage.getItem('subjectId')
        };
        this.$api.get('/api/admin/sysDs/queryDsName', params).then((result: any) => {
            this.dsIdOptions = result;
        });
    }
    private async getDataSource(id: string, row: any) {
        await this.$api
            .get(`/api/admin/sysDs/get?id=${id}`)
            .then((res: any) => {
                row.dsCol = '';
                if (this.tagClassify == 1) {
                    this.getColumn(res);
                } else {
                    this.makeJson(res);
                }
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
    private getColumn(data: any) {
        this.dsColOptions = [];
        const param = {
            clusterId: 13,
            dbName: data.sourceDb,
            dsColId: data.id,
            pageNum: 1,
            pageSize: 1000,
            table: data.sourceTbOrTopic
        };
        this.$api.post('/api/ava/hive/columnTag', param).then((res: any) => {
            if (res) {
                this.dsColOptions = res.column;
            }
        });
    }
    private makeJson(data: any) {
        const params = {
            dsColList: Object.keys(JSON.parse(data.sourceTopicJson)),
            dsId: data.id
        };
        this.$api.post('/api/admin/tag/tagColumnCheck', params).then((res: any) => {
            const arr: any[] = [];
            const usedMap = new Map();
            res.forEach((element: any) => {
                usedMap.set(element, element);
            });
            console.log(usedMap);
            Object.keys(JSON.parse(data.sourceTopicJson)).forEach(key => {
                const item = { name: key, flag: 0 };
                if (usedMap.has(key)) item.flag = 1;
                if (key !== 'theme' && key !== 'dt' && key !== 'id') arr.push(item);
            });
            this.dsColOptions = arr;
        });
    }
    private checkErp(val: string) {
        this.$api.get('/api/admin/token/getErpUserDetail', { erp: val }).then((res: any) => {
            this.tagParams.bizManagerDep = res.organizationFullName;
        });
    }
    private searchErp(str: string = '') {
        if (str !== '') {
            this.$api.get('/api/admin/token/getErpUser', { keyword: str }).then((res: any) => {
                this.erpOptions = res.filter((item: any) => {
                    return item.erpName !== '';
                });
            });
        }
    }
    private getTagDetail() {
        return new Promise((resolve, reject) => {
            const id = this.$route.params.tagId;
            this.$api.get('/api/admin/tag/get', { id: id }).then((res: any) => {
                this.tagDetail = res;
                resolve(res);
            });
        });
    }
    private isOnline: boolean = false;
    private mounted() {
        // 数据初始化
        this.tagParams = {
            bizManager: '',
            bizManagerDep: '',
            bizName: '',
            fullTagCateIdList: [], //全路径标签分类ID
            lastTagCateId: '', // 末级标签分类ID
            fullTagCateId: '',
            subjectId: window.sessionStorage.getItem('subjectId'),
            tagClassify: this.tagClassify,
            tagDataType: '',
            tagDesc: '',
            tagName: '',
            tagSecLevel: '',
            tagStatus: 1, // 标签状态 1:待上线,2:上线中,3:上线失败,4:已上线,5:已下线 (新增为 1 )
            techManager: '',
            rootSoureDb: '',
            rootSoureTb: '',
            tagLogicDesc: '',
            tagUpdate: '',
            tagComponentReqVOList: [
                {
                    subjectId: window.sessionStorage.getItem('subjectId'),
                    tagCompName: '',
                    tagCompSort: 1,
                    tagCompStyle: '',
                    tagEnumId: '',
                    tagComponentColumnReqVOList: [
                        {
                            dsCol: '',
                            dsId: '',
                            subjectId: window.sessionStorage.getItem('subjectId'),
                            tagCompCol: '',
                            tagCompColType: '',
                            tagCompId: '',
                            tagEnumLevelId: ''
                        }
                    ]
                }
            ]
        };
        Promise.all([this.getDsIdOptions(), this.getTagCategory()]).finally(() => {
            // this.tagDetail = this.$store.state.tagDetail;
            if (JSON.stringify(this.tagDetail) !== '{}') {
                Object.assign(this.tagParams, this.tagDetail);
                if (this.tagDetail.tagStatus == 4) {
                    this.isOnline = true;
                } else {
                    this.isOnline = false;
                }
                const row = this.tagDetail.tagComponentReqVOList[0].tagComponentColumnReqVOList[0];
                Object.assign(this.table.tagData[0], row);
                this.getDataSource(row.dsId, row);
                this.table.tagData[0].useForm = this.tagDetail.tagComponentReqVOList[0].tagCompStyle.toString();
                this.changeUseForm(this.table.tagData[0].useForm, this.table.tagData[0])?.then(() => {
                    this.changeUseDetail(this.tagDetail.tagComponentReqVOList[0].tagEnumId.toString(), this.table.tagData[0]);
                });
                // this.table.tagData[0].tagCompName = this.tagDetail.tagComponentReqVOList[0].tagCompName;
                this.tagParams.fullTagCateIdList = [];
                this.tagDetail.fullTagCateId.split('-').forEach((ele: any) => {
                    this.tagParams.fullTagCateIdList.push(Number(ele));
                });
            }
            this.$store.state.loadingSate = false;
        });
    }
    private getTagCategory() {
        this.$api.post('/api/admin/tagCategory/search', { subjectId: window.sessionStorage.getItem('subjectId') }).then((res: any) => {
            const arr = this.tagCateType(res);
            this.tagCateIdList = this.makeTree(arr);
            this.tagCateIdList.forEach((item: any) => {
                if (!item.childs || item.childs.length === 0) {
                    item.disabled = true;
                }
            });
        });
    }
    private tagCateType(arr: any) {
        return arr.filter((ele: any) => {
            return ele.tagCateType == 1;
        });
    }
    private compare(property: any) {
        return function(a: any, b: any) {
            const value1 = a[property];
            const value2 = b[property];
            return value1 - value2;
        };
    }
    private makeTree(arr: any[]) {
        let pArr = arr.filter((item: any) => {
            return item.tagCateLevel === 0;
        });
        if (pArr.length === 0) {
            pArr = arr.filter((item: any) => {
                return item.tagCateLevel === 1;
            });
            if (pArr.length === 0) {
                pArr = arr.filter((item: any) => {
                    return item.tagCateLevel === 2;
                });
            }
        }
        pArr.map((item: any) => {
            const children: any[] = arr.filter((aItem: any) => {
                return item.id === aItem.pid;
            });
            children.map((cItem: any) => {
                const childs: any[] = arr.filter((aItem: any) => {
                    return cItem.id === aItem.pid;
                });
                childs.sort(this.compare('tagCateSort'));
                Object.assign(cItem, { childs: childs });
                if (childs.length === 0) {
                    // console.log('找到了');
                    cItem.childs = undefined;
                }
            });
            children.sort(this.compare('tagCateSort'));
            Object.assign(item, { childs: children });
            if (children.length === 0) {
                item.childs = undefined;
            }
        });
        pArr.sort(this.compare('tagCateSort'));
        return pArr;
    }
    private changeUseForm(val: string, row: any) {
        this.tagParams.tagComponentReqVOList[0].tagCompStyle = val;
        this.$set(row, 'useFormDetail', '');
        if (val == '21' || val == '22') {
            return new Promise(resolve => {
                this.getEmunList(val.split('')[1]).then((res: any) => {
                    resolve(res);
                });
            });
        } else {
            this.tagParams.tagComponentReqVOList[0].tagEnumId = 0;
            this.$set(row, 'tagEnumLevelId', 0);
        }
    }
    private changeUseDetail(val: string, row: any) {
        this.tagParams.tagComponentReqVOList[0].tagEnumId = val;
        this.$set(row, 'useFormDetail', val);
        // const item: any = this.emunList.filter((t: any) => {
        //   return t.id == val;
        // })[0];
        // console.log(val, this.emunList);
        this.$api.get('/api/admin/tagEnum/listTagEnumVal', { tagEnumId: val }).then(res => {
            const { tagEnumLevelId } = res[0];
            this.$set(row, 'tagEnumLevelId', tagEnumLevelId);
        });
    }
    public save() {
        this.submit();
    }
    public update() {
        Object.assign(this.tagParams.tagComponentReqVOList[0], this.nameAndTime);
        this.table.tagData.forEach((item: any) => {
            Object.assign(item, this.nameAndTime);
        });
        this.submit('update');
    }
    private submit(url: string = 'add') {
        if(this.table.tagData[0].tagCompName == ''){
            this.$message('请输入标签名称');
            this.chagneBtnLoading(false);
            this.$store.state.loadingSate = false;
            return false;
        }
        // if(url == 'add') {
        //
        // }else{
        //     const form = this.$refs.form as any;
        //     const table = this.$refs.table as any;
        //     let formValid: boolean = false;
        //     let tableValid: boolean = false;
        //     form.validate((valid: any) => {
        //         if (valid) {
        //             formValid = true;
        //         }
        //     });
        //     table.validate((valid: any) => {
        //         if (valid) {
        //             tableValid = true;
        //         }
        //     });
        //     if (formValid && tableValid) {
        //         console.log(1);
        //     } else {
        //         this.chagneBtnLoading(false);
        //         this.$store.state.loadingSate = false;
        //         return false;
        //     }
        // }
        Object.assign(this.tagParams, this.nameAndTime);

        const arr = JSON.parse(JSON.stringify(this.table.tagData));
        this.tagParams.tagComponentReqVOList[0].tagComponentColumnReqVOList = arr;
        this.$api
            .post(`/api/admin/tag/${url}`, this.tagParams)
            .then((res: any) => {
                // this.$message.success(`this.tagClassify: ${this.tagClassify}`);
                this.$store.state.loadingSate = false;
                if (this.tagClassify == 1) {
                    if (url === 'add') {
                        this.$message.success('注册离线标签成功');
                    } else {
                        this.$message.success('更新离线标签成功');
                    }
                } else
                if (this.tagClassify == 3) {
                    if (url === 'add') {
                        this.$message.success('注册实时标签成功');
                    } else {
                        this.$message.success('更新实时标签成功');
                    }
                }
                this.$router.push({
                    name: 'admin/tag-market'
                });
            })
            .finally(() => {
                this.chagneBtnLoading(false);
                this.$store.state.loadingSate = false;
            });

    }
    private cancle() {
        window.history.go(-1);
    }
}
</script>
<style scoped lang="scss">
.edit-tag-section {
    padding-right: 50px;
    overflow: auto;
}
/deep/ .noSuffix {
    .el-input__suffix {
        display: none;
    }
}
.title {
    color: #1b1b1b;
    font-size: 16px;
    font-weight: 600;
    position: relative;
    padding-left: 10px;
    margin-bottom: 5px;
    &::before {
        content: '';
        width: 3px;
        height: 16px;
        background: #396bf6;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -8px;
    }
}
.top-section,
.bottom-section {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    &_left {
        flex-basis: 100%;
    }
    // &_right {
    //   flex-basis: 20%;
    // }
}
.pl10 {
    padding-left: 40px;
}

.bottom-section {
    margin: 0;
    &_right {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        margin-bottom: 20px;
    }
}
.center-section {
    margin: 10px 0px;
}
.com-width {
    width: 100%;
}
.top-section_right {
    display: flex;
}
.flex {
    display: flex;
}
.w100 {
    width: 80%;
}
.w100 {
    width: 100%;
}
/deep/ .cell {
    margin-top: 24px;
}
</style>
