<template>
    <section class="edit-tag-section">
        <!--:rules="rules"-->
        <el-form :model="tagParams" label-width="110px" class="com-form" ref="form">
            <div class="top-section">
                <div class="top-section_left">
                    <p class="title">基本信息</p>
                    <div class="pl10">
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="标签名称：" prop="tagName">
                                    <el-input
                                        class="com-input com-width"
                                        placeholder="可输入2-30字符"
                                        v-model="tagParams.tagName"
                                        maxlength="30"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="标签类型：" prop="tagDataType">
                                    <el-select class="com-select com-width" placeholder="请选择" v-model="tagParams.tagDataType" clearable>
                                        <el-option
                                            v-for="(item, index) in tagDataTypeOptions"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="标签分类：" prop="fullTagCateIdList">
                                    <el-cascader
                                        class="com-cascader"
                                        :props="{ expandTrigger: 'hover', children: 'childs', label: 'tagCateName', value: 'id' }"
                                        v-model="tagParams.fullTagCateIdList"
                                        :options="tagCateIdList"
                                        filterable
                                        @change="changeCate"
                                        clearable
                                        style="width: 100%"
                                    ></el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="标签等级：" prop="tagSecLevel">
                                    <el-select
                                        class="com-select com-width"
                                        placeholder="请选择"
                                        v-model="tagParams.tagSecLevel"
                                        clearable
                                        :disabled="isOnline"
                                    >
                                        <el-option
                                            v-for="(item, index) in tagSecLevelOptions"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <!-- <el-form-item label="更新频率：" prop="tagUpdate">
                  <el-select class="com-select com-width" placeholder="请选择" v-model="tagParams.tagUpdate" clearable>
                    <el-option v-for="(item, index) in updateOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item> -->
                            </el-col>
                        </el-row>
                        <el-form-item label="标签描述：" prop="tagDesc">
                            <el-input
                                class="com-input"
                                type="textarea"
                                placeholder="可输入3~2000字符"
                                :rows="5"
                                :resize="'none'"
                                v-model="tagParams.tagDesc"
                                maxlength="2000"
                                clearable
                            >
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
                                    <el-select
                                        class="com-select com-width noSuffix"
                                        v-model="tagParams.bizManager"
                                        filterable
                                        remote
                                        reserve-keyword
                                        placeholder="请输入用户Id"
                                        :remote-method="searchErp"
                                        @change="checkErp"
                                    >
                                        <el-option
                                            v-for="item in erpOptions"
                                            :key="item.value"
                                            :label="`${item.displayName}(${item.erpName})`"
                                            :value="item.erpName"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务部门：" prop="bizManagerDep">
                                    <el-input
                                        class="com-input com-width"
                                        placeholder="请输入用户Id"
                                        v-model="tagParams.bizManagerDep"
                                        disabled
                                    ></el-input>
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
                <div class="flex" style="position: relative;">
                    <p class="title">数据信息</p>
                    <el-input
                        v-show="table.tagData.length > 15"
                        class="com-input com-width searchStyle"
                        placeholder="请输入子标签名称，按回车搜索"
                        clearable
                        v-model="search"
                    ></el-input>
                </div>
                <el-form ref="table" :model="table" :rules="table.rules">
                    <com-table
                        :tableData="
                            table.tagData
                                .filter(data => !search || data.tagCompName.toLowerCase().includes(search.toLowerCase()))
                                .slice(5 * (pageNo - 1), 5 * pageNo)
                        "
                        :columnData="tagColumn"
                        :spanMethod="spanMethod"
                        :showPage="false"
                    >
                        <template slot="tagCompName" slot-scope="scope">
                            <el-form-item :prop="'tagData.' + scope.index + '.tagCompName'" :rules="table.rules.tagCompName">
                                <el-input
                                    :disabled="isOnline"
                                    class="com-input"
                                    placeholder="请输入子标签名称"
                                    v-model="scope.row.tagCompName"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </template>
                        <template slot="dsId" slot-scope="scope">
                            <el-form-item :prop="'tagData.' + scope.index + '.dsId'" :rules="table.rules.dsId">
                                <el-select
                                    :disabled="isOnline"
                                    class="com-select"
                                    style="width:100%;"
                                    placeholder="请选择数据源"
                                    v-model="scope.row.dsId"
                                    filterable
                                    @change="getDataSource(scope.row)"
                                >
                                    <el-option v-for="(item, index) in dsIdOptions" :key="index" :label="item.dsName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                        <template slot="useForm" slot-scope="scope">
                            <div class="flex">
                                <div style="flex:1;">
                                    <el-form-item :prop="'tagData.' + scope.index + '.useForm'" :rules="table.rules.useForm">
                                        <el-select
                                            :disabled="isOnline"
                                            class="com-select"
                                            placeholder="请选择使用形式"
                                            style="width:100%;"
                                            @change="changeUseForm($event, scope.row)"
                                            v-model="scope.row.useForm"
                                            clearable
                                            filterable
                                        >
                                            <el-option
                                                v-for="(item, index) in useFormOptions"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div style="flex:1;" v-if="scope.row.useForm == '21' || scope.row.useForm == '22'">
                                    <el-form-item :prop="'tagData.' + scope.index + '.useFormDetail'" :rules="table.rules.useFormDetail">
                                        <el-select
                                            class="com-select"
                                            placeholder="请选择枚举"
                                            @change="changeEnumsName($event, scope.row)"
                                            v-model="scope.row.useFormDetail"
                                            filterable
                                            :disabled="isOnline"
                                        >
                                            <el-option
                                                v-for="(item, index) in scope.row.emunList"
                                                :key="index"
                                                :label="item.tagEnumName"
                                                :value="item.id"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                        </template>
                        <!-- 字段名称 -->
                        <template slot="dsCol" slot-scope="scope">
                            <!-- 使用形式：N级枚举 -->
                            <template v-if="scope.row.useForm == '21' || scope.row.useForm == '22'">
                                <div
                                    v-for="(data, active) in scope.row.tagComponentColumnReqVOList"
                                    :key="active"
                                    :class="{ mgt6: active % 2 !== 0 }"
                                >
                                    <div class="use-form">
                                        <!-- <el-tag style="margin-right:5px;" type="info">{{ lvFormat(active) }}</el-tag> -->
                                        <el-tag v-if="data.tagEnumLevelName && scope.row.useForm == '22'" style="margin-right:5px;" type="info">{{
                                            data.tagEnumLevelName
                                        }}</el-tag>
                                        <el-form-item
                                            :prop="`tagData[${scope.index}].tagComponentColumnReqVOList[${active}].dsCol`"
                                            :rules="table.rules.dsCol"
                                        >
                                            <el-select
                                                filterable
                                                class="com-select"
                                                placeholder="请选择字段名称"
                                                v-model="data.dsCol"
                                                @change="checkDsColOptions($event, scope.row, data)"
                                                clearable
                                                :disabled="isOnline"
                                            >
                                                <el-option
                                                    v-for="(item, index) in scope.row.dsColOptions"
                                                    :key="index"
                                                    :disabled="item.disabled"
                                                    :label="item.name"
                                                    :value="item.name"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </div>
                            </template>
                            <!-- 使用形式：其他 -->
                            <template v-else>
                                <div
                                    v-for="(data, active) in scope.row.tagComponentColumnReqVOList"
                                    :key="active"
                                    :class="{ mgt6: active % 2 !== 0 }"
                                >
                                    <el-form-item
                                        :prop="`tagData[${scope.index}].tagComponentColumnReqVOList[${active}].dsCol`"
                                        :rules="table.rules.dsCol"
                                    >
                                        <el-select
                                            :disabled="isOnline"
                                            class="com-select"
                                            placeholder="请选择字段名称"
                                            style="width:100%;"
                                            v-model="data.dsCol"
                                            clearable
                                            filterable
                                            @change="changeDsCol($event, data)"
                                        >
                                            <el-option
                                                v-for="(item, index) in scope.row.dsColOptions"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.name"
                                                :disabled="item.disabled"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </template>
                        </template>
                        <template slot="tagCompColType" slot-scope="scope">
                            <div v-for="(data, i) in scope.row.tagComponentColumnReqVOList" :key="i">
                                <el-form-item
                                    :prop="`tagData[${scope.index}].tagComponentColumnReqVOList[${i}].tagCompColType`"
                                    :rules="table.rules.tagCompColType"
                                >
                                    <el-select
                                        :disabled="isOnline"
                                        class="com-select"
                                        placeholder="请选择数据类型"
                                        v-model="data.tagCompColType"
                                        style="width:100%;"
                                        clearable
                                        :class="{ mgt6: i % 2 !== 0 }"
                                    >
                                        <el-option
                                            v-for="(item, index) in dataTypeOptions"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </template>
                        <template slot="tools" slot-scope="scope">
                            <el-form-item>
                                <el-button type="primary" @click="addRow(scope.index)" :disabled="isOnline" :size="'mini'" class="com-button"
                                    >添加</el-button
                                >
                                <el-button :size="'mini'" @click="removeRow(scope.index)" :disabled="isOnline" class="com-button">删除</el-button>
                            </el-form-item>
                        </template>
                    </com-table>
                    <div class="paginationa">
                        <el-pagination
                            layout="total, prev, pager, next, jumper"
                            :hide-on-sigle-page="true"
                            @current-change="currentChange"
                            :total="table.tagData.length"
                            :page-size="5"
                            :current-page="pageNo"
                        >
                        </el-pagination>
                    </div>
                </el-form>
            </div>
            <div class="bottom-section">
                <div class="bottom-section_left">
                    <p class="title">标签加工信息</p>
                    <div class="pl10">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="技术负责人：" prop="techManager">
                                    <el-select
                                        class="com-select com-width noSuffix"
                                        v-model="tagParams.techManager"
                                        filterable
                                        remote
                                        reserve-keyword
                                        placeholder="请输入用户Id"
                                        :remote-method="searchErp"
                                    >
                                        <el-option
                                            v-for="item in erpOptions"
                                            :key="item.value"
                                            :label="`${item.displayName}(${item.erpName})`"
                                            :value="item.erpName"
                                        >
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
                        <el-form-item label="加工逻辑：">
                            <el-input
                                class="com-input"
                                type="textarea"
                                placeholder="可输入3~2000字符"
                                :rows="5"
                                :resize="'none'"
                                v-model="tagParams.tagLogicDesc"
                                maxlength="2000"
                                clearable
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
                <!-- <div class="bottom-section_right">
          <el-button class="com-button btn">取消</el-button>
          <el-button class="com-button btn" type="primary">提交注册申请</el-button>
        </div> -->
            </div>
        </el-form>
    </section>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
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
    private pageNo: number = 1;
    private search: string = '';
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
        { label: '枚举型-N级', value: '22' },
        { label: '自定义型-数值', value: '31' },
        { label: '自定义型-文本', value: '32' }
    ];
    private updateOptions: any[] = [
        { label: '日更', value: '1' },
        { label: '月更', value: '2' },
        { label: '年更', value: '3' }
    ];
    private useFormDetailOptions: any[] = [
        { label: '一级', value: '1' },
        { label: '二级', value: '2' },
        { label: '三级', value: '3' },
        { label: '四级', value: '4' }
    ];
    private dataTypeOptions: any[] = this.$store.state.dataTypeOptions;
    private tagParams: any = {
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
                tagEnumId: 0,
                tagComponentColumnReqVOList: [
                    {
                        dsCol: '',
                        dsId: '',
                        subjectId: window.sessionStorage.getItem('subjectId'),
                        tagCompColType: '',
                        tagEnumLevelId: 0
                    }
                ]
            }
        ]
    };
    private rules: any = {
        subjectName: [{ required: true, message: '请输入主体中文名称', trigger: 'blur' }],
        tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        tagDataType: [{ required: true, message: '请选择标签类型', trigger: 'change' }],
        fullTagCateIdList: [{ required: true, message: '请选择标签分类', trigger: 'change' }],
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
    private table: any = {
        tagData: [
            {
                subjectId: window.sessionStorage.getItem('subjectId'),
                tagCompName: '',
                tagCompStyle: '',
                tagEnumId: 0,
                dsId: '',
                tagComponentColumnReqVOList: [
                    {
                        dsCol: '',
                        dsId: '',
                        subjectId: window.sessionStorage.getItem('subjectId'),
                        tagCompColType: '',
                        tagEnumLevelId: 0
                    }
                ],
                useForm: '',
                dsColOptions: []
            }
        ],
        selectedDsColOptions: [],
        rules: {
            tagCompName: [
                { required: true, message: '必填', trigger: 'blur' },
                { validator: this.checkName, message: '不可重复', trigger: 'blur' }
            ],
            dsCol: [{ required: true, message: '必填', trigger: 'change' }],
            dsId: [{ required: true, message: '必选', trigger: 'change' }],
            useForm: [{ required: true, message: ' ', trigger: 'change' }],
            useFormDetail: [{ required: true, message: ' ', trigger: 'change' }],
            tagCompColType: [{ required: true, message: '必填', trigger: 'change' }]
        }
    };

    private tagColumn: any[] = [
        {
            label: '子标签名称',
            slotName: 'tagCompName',
            renderHeader: this.renderHeader
        },
        {
            label: '数据源名称',
            slotName: 'dsId',
            renderHeader: this.renderHeader
        },
        {
            label: '使用形式',
            slotName: 'useForm',
            renderHeader: this.renderHeader
        },
        {
            label: '字段名称',
            slotName: 'dsCol',
            renderHeader: this.renderHeader
        },
        {
            label: '数据类型',
            slotName: 'tagCompColType',
            renderHeader: this.renderHeader
        },
        {
            label: '操作',
            slotName: 'tools'
        }
    ];

    private checkName(rule: any, value: any, callback: any) {
        if (!value) {
            return callback(new Error('子标签名称不能为空'));
        } else {
            this.table.tagData.forEach((t1: any, i1: number) => {
                this.table.tagData.forEach((t2: any, i2: number) => {
                    if (t1.tagCompName === t2.tagCompName && i1 !== i2) {
                        return callback(new Error('子标签名称不可重复'));
                    }
                });
            });
            callback();
        }
    }
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
    private tagCateIdList: any[] = [];
    private dsIdOptions: any[] = [];
    private dsColOptions: any[] = [];
    private tagSecLevelOptions: any[] = [
        { value: 1, label: 'L1' },
        { value: 2, label: 'L2' }
    ];
    private bizNameOptions: any[] = [];
    private tagClassifyOptions: any[] = [
        { value: 1, label: '离线标准' },
        { value: 2, label: '离线组合' },
        { value: 3, label: '实时标准' }
    ];
    private tagDataTypeOptions: any[] = [
        { value: 1, label: '事实及统计类' },
        { value: 2, label: '挖掘预测类' }
    ];
    private erpOptions: any[] = [];
    private isOnline: boolean = false;

    private async mounted() {
        console.log('加载');
        this.getDsIdOptions();
        this.getTagCategory();
        if (JSON.stringify(this.tagDetail) !== '{}') {
            if (this.tagDetail.tagStatus == 4) {
                this.isOnline = true;
            } else {
                this.isOnline = false;
            }
            Object.assign(this.tagParams, this.tagDetail);
            // console.log('---:', this.tagDetail.fullTagCateId);
            this.tagParams.fullTagCateIdList = [];
            this.tagDetail.fullTagCateId.split('-').forEach((ele: any) => {
                this.tagParams.fullTagCateIdList.push(Number(ele));
            });
            // console.log('---:', this.tagParams.fullTagCateIdList);
            this.tagDetail.tagComponentReqVOList.forEach((t: any, index: number) => {
                t.index = index;
            });
            this.queryList(0, 5);
        }
    }

    private queryList(findex: number, lindex: number) {
        this.$store.state.loadingSate = true;
        const proList: any[] = [];
        this.table.tagData = JSON.parse(JSON.stringify(this.tagDetail.tagComponentReqVOList));
        console.log(this.table.tagData);
        const tagComponentReqVOList = this.tagDetail.tagComponentReqVOList; // 缓存数据
        // this.table.tagData.slice(findex, lindex).forEach((ele: any) => {
        this.table.tagData.forEach((ele: any) => {
            const p = new Promise((reslove, reject) => {
                ele.dsId = tagComponentReqVOList[0].tagComponentColumnReqVOList[0].dsId;
                this.getDataSource(ele).finally(() => {
                    this.changeUseForm(ele.tagCompStyle, ele).finally(() => {
                        this.changeEnumsName(ele.tagEnumId, ele).finally(() => {
                            ele.tagComponentColumnReqVOList = tagComponentReqVOList[ele.index].tagComponentColumnReqVOList; // 清空后重新赋值
                            reslove(true);
                        });
                    });
                });
            });
            proList.push(p);
        });
        Promise.all(proList).finally(() => {
            this.selectedDsColOptions = this.table.tagData.map(item=> {
                return item.tagComponentColumnReqVOList.map(ele=> {
                    return ele.dsCol;
                });
            });
            this.$store.state.loadingSate = false;
        });
    }

    private currentChange(val: any) {
        this.pageNo = val;
        // if (JSON.stringify(this.tagDetail) !== '{}') this.queryList(5 * (val - 1), 5 * val);
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
            // 筛选出组合分类
            return ele.tagCateType == 2;
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
                    // // console.log('找到了');
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
    private changeCate(val: any) {
        this.tagParams.lastTagCateId = val[val.length - 1];
        this.tagParams.fullTagCateId = val.join('-');
        // console.log('cate:', val);
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
    private getDsIdOptions() {
        const params = {
            dsType: this.tagClassify,
            subjectId: window.sessionStorage.getItem('subjectId')
        };
        this.$api.get(`/api/admin/sysDs/queryDsName`, params).then((result: any) => {
            this.dsIdOptions = result
        });
    }
    private getDataSource(row: any) {
        return new Promise((resolve, reject) => {
            const { dsId } = row;
            this.$api.get(`/api/admin/sysDs/get?id=${dsId}`).then((res: any) => {
                row.tagComponentColumnReqVOList.forEach((element: any) => {
                    element.dsCol = '';
                });
                this.getColumn(res, row)
                    .then(res2 => {
                        resolve(res2);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        });
    }
    private getColumn(data: any, row: any) {
        return new Promise((resolve, reject) => {
            const param = {
                clusterId: 13,
                dbName: data.sourceDb,
                dsColId: data.id,
                pageNum: 1,
                pageSize: 100,
                table: data.sourceTbOrTopic
            };
            this.$api
                .post('/api/ava/hive/columnTag', param)
                .then((res: any) => {
                    if (res) {
                        res.column.forEach((item: any) => {
                            this.$set(item, 'disabled', false);
                        });
                        this.$set(row, 'dsColOptions', res.column);
                        // console.log('写入dsColOptions');
                        resolve(res);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private checkDsColOptions(val: any, row: any, data: any) {
        // 所有tag != 1 和初始选项
        const list = this.selectedDsColOptions[row.index].map(item=>{return item;});
        row.dsColOptions.filter(item => { return item.flag != 1; }).forEach(item => { list.push(item.name); });

        const unSelect = [];
        // 被选了
        const select = row.tagComponentColumnReqVOList.map(item => {
            return item.dsCol;
        });
        list.forEach((name: string) => {
            const vo = select.find(s=> { return s == name; });
            if (!vo) {
                unSelect.push(name);
            }
        });

        // 没选的都是enable
        row.dsColOptions.forEach((item: any) => {
            if (unSelect.indexOf(item.name) == -1) {
                item.disabled = true;
            } else {
                item.disabled = false;
            }
        });
        this.changeDsCol(val, data);
    }
    private spanMethod() {
        // 合并第一列单元格
        // if (row.columnIndex === 0) {
        //   if (row.rowIndex === 0) {
        //     return {
        //       rowspan: this.tagData.length,
        //       colspan: 1
        //     };
        //   } else {
        //     return {
        //       rowspan: 0,
        //       colspan: 0
        //     };
        //   }
        // }
    }
    private lvFormat(val: any) {
        switch (val) {
            case 0:
                return '一级';
            case 1:
                return '二级';
            case 2:
                return '三级';
            case 3:
                return '四级';
        }
    }
    private changeDsCol(val: any, data: any) {
        this.$set(data, 'tagCompCol', val);
    }
    private changeEnumsName(val: any, row: any) {
        return new Promise((resolve, reject) => {
            row.dsColOptions.map((item: any) => {
                // 在这里把flag直接设置为disable，这样在选择其他时，把自己空出
                if (item.flag == 1) {
                    item.disabled = true;
                } else {
                    item.disabled = false;
                }
            });
            if (!val) {
                resolve(val);
                return false;
            }
            row.tagEnumId = val;
            row.useFormDetail = val;
            this.$api.get('/api/admin/tagEnum/listTagEnumLevel', { tagEnumId: val }).then((res: any) => {
                const arr: any[] = [];
                res.forEach((item: any) => {
                    arr.push({
                        dsCol: '',
                        dsId: '',
                        subjectId: item.subjectId,
                        tagCompColType: '',
                        tagEnumLevelId: item.id,
                        tagCompId: row.id ? row.id : '',
                        id: '',
                        tagEnumLevelName: item.tagEnumLevelName
                    });
                });
                this.$set(row, 'tagComponentColumnReqVOList', arr);
                resolve(res);
            });
        });
    }
    private addRow(index: number) {
        const item = {
            dsId: '',
            tagCompName: '',
            useForm: '',
            dsColOptions: [],
            subjectId: window.sessionStorage.getItem('subjectId'),
            tagComponentColumnReqVOList: [
                {
                    dsCol: '',
                    dsId: '',
                    subjectId: window.sessionStorage.getItem('subjectId'),
                    tagCompColType: '',
                    tagEnumLevelId: 0,
                    tagCompId: '',
                    id: ''
                }
            ]
        };
        if (JSON.stringify(this.tagDetail) !== '{}') {
            // 修改时添加tagCode
            Object.assign(item, { tagCode: this.tagDetail.tagCode });
        }
        this.table.tagData.splice(index + 1, 0, item);
    }
    private removeList: any[] = [];
    private removeRow(index: number) {
        const item = this.table.tagData.splice(index, 1)[0];
        const { valid } = item;
        if (valid) {
            item.valid = 0;
            item.tagComponentColumnReqVOList.forEach((element: any) => {
                element.valid = 0;
            });
            this.removeList.push(item);
        }
        // console.log('删除：', item);
    }
    private emunList: any[] = [];
    private async getEmunList(type: number | string, row: any) {
        const param = {
            tagEnumType: type,
            subjectId: window.sessionStorage.getItem('subjectId')
        };
        await this.$api.get('/api/admin/tagEnum/list', param).then((res: any) => {
            this.$set(row, 'emunList', res);
        });
    }
    private changeUseForm(val: string, row: any) {
        return new Promise(resolve => {
            val = `${val}`;
            if (val == '21' || val == '22') {
                this.getEmunList(val.split('')[1], row);
            }
            row.tagCompStyle = val;
            this.$set(row, 'useForm', val);
            this.$set(row, 'useFormDetail', '');
            this.$set(row, 'tagComponentColumnReqVOList', [
                {
                    dsCol: '',
                    dsId: '',
                    subjectId: window.sessionStorage.getItem('subjectId'),
                    tagCompColType: '',
                    tagEnumLevelId: 0,
                    tagCompId: row.id ? row.id : '',
                    id: ''
                }
            ]);
            // console.log('changeUseForm');
            resolve(val);
        });
    }
    public save() {
        this.submit();
    }
    public update() {
        this.submit('update');
    }
    private makeParams() {
        const arr: any[] = this.table.tagData.concat(this.removeList);
        arr.map((t: any, i: number) => {
            // 写入排序
            t.tagCompSort = i + 1;
            t.tagComponentColumnReqVOList.map((t1: any) => {
                Object.assign(t1, this.nameAndTime);
                t1.dsId = t.dsId;
            });
            Object.assign(t, this.nameAndTime);
            delete t.dsColOptions;
            delete t.useForm;
            delete t.useFormDetail;
            delete t.useFormDetailOptions;
            delete t.emunList;
        });
        this.tagParams.tagComponentReqVOList = arr;
        // console.log('arr:', arr);
    }
    private submit(url: string = 'add') {
        if(this.tagParams.tagName == ''){
            this.$message('请输入标签名称');
            this.chagneBtnLoading(false);
            this.$store.state.loadingSate = false;
            return false;
        }
        // if(url == 'add') {
        //
        // }else{
        //     Object.assign(this.tagParams, this.nameAndTime);
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
        //     }else{
        //         this.chagneBtnLoading(false);
        //         this.$store.state.loadingSate = false;
        //         return false;
        //     }
        // }
        this.makeParams();
        // console.log(this.tagParams, JSON.stringify(this.tagParams));
        this.$api
            .post(`/api/admin/tag/${url}`, this.tagParams)
            .then((res: any) => {
                if (url === 'add') {
                    this.$message.success('注册组合标签成功');
                } else {
                    this.$message.success('更新组合标签成功');
                }
                this.$router.push({
                    name: 'admin/tag-market'
                });
            })
            .finally(() => {
                this.chagneBtnLoading(false);
                this.$store.state.loadingSate = false;
            });
        // console.log('调用成功！2');
    }
}
</script>
<style scoped lang="scss">
    .paginationa{
        padding: 10px;
        text-align: right;
    }
.searchStyle {
    position: absolute;
    z-index: 10;
    top: 40px;
    left: 10px;
    width: 500px !important;
}
.edit-tag-section {
    padding-right: 50px;
}
/deep/ .cell {
    margin-top: 24px;
}
/deep/ .noSuffix {
    .el-input__suffix {
        display: none;
    }
}
.flex {
    display: flex;
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
    &_right {
        flex-basis: 30%;
    }
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
.mgt6 {
    margin: 6px 0;
}
.use-form /deep/ {
    display: flex;
    .el-select + .el-select,
    .el-input + .el-select {
        margin-left: 4px;
    }
    .h30 {
        .el-input__inner {
            height: 30px;
            line-height: 30px;
        }
        .el-input__icon {
            line-height: 30px;
        }
    }
}
.pl10 {
    padding-left: 40px;
}
</style>
