<template>
    <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="editDialog"
        custom-class="com-dialog"
        top="0"
        width="1200px"
        :lock-scroll="true"
        @close="cancel"
    >
        <main style="padding: 30px;">
            <section class="basicInfo">
                <div class="title">基本信息</div>
                <div style="padding:0px 10%;">
                    <el-form :model="poolParams" :rules="rules" label-width="110px" class="com-form" ref="form">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="ID池名称" prop="idmappingName">
                                    <el-input
                                        v-if="!isDetail"
                                        class="com-input"
                                        placeholder="可输入2~15字符"
                                        v-model="poolParams.idmappingName"
                                        maxlength="50"
                                        clearable
                                    ></el-input>
                                    <div v-else>{{poolParams.idmappingName}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="库名" prop="sourceDb">
                                    <el-select
                                        v-if="!isDetail"
                                        class="com-select com-width"
                                        placeholder="请选择"
                                        v-model="poolParams.sourceDb"
                                        @change="getBiaoList"
                                        clearable
                                    >
                                        <el-option v-for="(item, index) in kuData" :key="index" :label="item" :value="item"></el-option>
                                    </el-select>
                                    <div v-else>{{poolParams.sourceDb}}</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="表名" prop="sourceTb">
                                    <el-select
                                        v-if="!isDetail"
                                        class="com-select com-width"
                                        @change="getColumnList"
                                        placeholder="请选择"
                                        v-model="poolParams.sourceTb"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(item, index) in biaoData"
                                            :key="index"
                                            :label="item.name"
                                            :value="item.name"
                                            :disabled="item.disabled"
                                        ></el-option>
                                    </el-select>
                                    <div v-else>{{poolParams.sourceTb}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="offset列" prop="sourceColOffset">
                                    <el-select
                                        v-if="!isDetail"
                                        class="com-select com-width"
                                        placeholder="请选择"
                                        v-model="poolParams.sourceColOffset"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(item, index) in offsetList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.label"
                                            :disabled="testOption(item)"
                                        ></el-option>
                                    </el-select>
                                    <div v-else>{{poolParams.sourceColOffset}}</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="目标库" prop="targetDb">
                                    <el-input
                                        v-if="!isDetail"
                                        class="com-input"
                                        type="text"
                                        placeholder="可输入2~15字符"
                                        v-model="poolParams.targetDb"
                                        maxlength="15"
                                        clearable
                                    >
                                    </el-input>
                                    <div v-else>{{poolParams.targetDb}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="目标表" prop="targetTb">
                                    <el-input
                                        v-if="!isDetail"
                                        class="com-input"
                                        type="text"
                                        placeholder="可输入10~100字符"
                                        v-model="poolParams.targetTb"
                                        maxlength="100"
                                        clearable
                                    >
                                    </el-input>
                                    <div v-else>{{poolParams.targetTb}}</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="ID池描述" prop="idmappingDesc">
                            <el-input
                                v-if="!isDetail"
                                class="com-input"
                                type="textarea"
                                placeholder="可输入3~200字符"
                                :rows="5"
                                :resize="'none'"
                                v-model="poolParams.idmappingDesc"
                                maxlength="200"
                                clearable
                            >
                            </el-input>
                            <div v-else>{{poolParams.idmappingDesc}}</div>
                        </el-form-item>
                        <div v-if="isDetail">
                            <el-form-item label="创建人" prop="creator" :required="true">
                                <!-- <el-input class="com-input" v-model="poolParams.creator" disabled></el-input> -->
                                <div>{{poolParams.creator}}</div>
                            </el-form-item>
                            <el-form-item label="创建时间" prop="createdTime" :required="true">
                                <!-- <el-input class="com-input" v-model="poolParams.createdTime" disabled></el-input> -->
                                <div>{{poolParams.createdTime}}</div>
                            </el-form-item>
                            <el-form-item label="修改人" prop="modifier" :required="true">
                                <!-- <el-input class="com-input" v-model="poolParams.modifier" disabled></el-input> -->
                                <div>{{poolParams.modifier}}</div>
                            </el-form-item>
                            <el-form-item label="修改时间" prop="modifiedTime" :required="true">
                                <!-- <el-input class="com-input" v-model="poolParams.modifiedTime" disabled></el-input> -->
                                <div>{{poolParams.modifiedTime}}</div>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </section>
            <section class="idInfo">
                <span class="title">ID配置</span>
                <el-form ref="table" :model="model" :rules="model.rules">
                    <el-table
                        :data="model.tableData"
                        ref="idTable"
                        :header-cell-style="{
                            color: '#1B1B1B',
                            'font-size': '14px',
                            'font-weight': '600'
                        }"
                        :cell-style="{
                            color: '#666',
                            'font-size': '12px'
                        }"
                    >
                        <el-table-column label="字段名称" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.dsCol'" :rules="model.rules.dsCol">
                                    <el-select
                                        class="com-select com-width"
                                        v-if="!isDetail"
                                        placeholder="请选择"
                                        v-model="scope.row.dsCol"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(item, index) in offsetList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.label"
                                            :disabled="testOption(item)"
                                        ></el-option>
                                    </el-select>
                                    <div style="line-height:20px;" v-else>{{scope.row.dsCol}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="ID类型" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.dsColName'" :rules="model.rules.dsColName">
                                    <el-input
                                        class="com-input com-width"
                                        v-if="!isDetail"
                                        placeholder="2-15个字符"
                                        v-model="scope.row.dsColName"
                                        clearable
                                    >
                                    </el-input>
                                    <div style="line-height:20px;" v-else>{{scope.row.dsColName}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="IdToOffset" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.r2mIdToOffset'" :rules="model.rules.r2mIdToOffset">
                                    <el-input
                                        class="com-input com-width"
                                        v-if="!isDetail"
                                        placeholder="2-25个字符"
                                        v-model="scope.row.r2mIdToOffset"
                                        clearable
                                    >
                                    </el-input>
                                    <div style="line-height:20px;" v-else>{{scope.row.r2mIdToOffset}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="ITOtoken" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.r2mIdToOffsetToken'" :rules="model.rules.r2mIdToOffsetToken">
                                    <el-input
                                        class="com-input com-width"
                                        v-if="!isDetail"
                                        placeholder="2-25个字符"
                                        v-model="scope.row.r2mIdToOffsetToken"
                                        clearable
                                    >
                                    </el-input>
                                    <div style="line-height:20px;" v-else>{{scope.row.r2mIdToOffsetToken}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="ITOpassword" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.r2mIdToOffsetPasswd'" :rules="model.rules.r2mIdToOffsetPasswd">
                                    <el-input
                                        class="com-input com-width"
                                        v-if="!isDetail"
                                        placeholder="2-25个字符"
                                        v-model="scope.row.r2mIdToOffsetPasswd"
                                        clearable
                                    >
                                    </el-input>
                                    <div style="line-height:20px;" v-else>{{scope.row.r2mIdToOffsetPasswd}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="OffsetToId" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.r2mOffsetToId'" :rules="model.rules.r2mOffsetToId">
                                    <el-input
                                        class="com-input com-width"
                                        v-if="!isDetail"
                                        placeholder="2-25个字符"
                                        v-model="scope.row.r2mOffsetToId"
                                        clearable
                                    >
                                    </el-input>
                                    <div style="line-height:20px;" v-else>{{scope.row.r2mOffsetToId}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="OTItoken" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.r2mOffsetToIdToken'" :rules="model.rules.r2mOffsetToIdToken">
                                    <el-input
                                        class="com-input com-width"
                                        v-if="!isDetail"
                                        placeholder="2-25个字符"
                                        v-model="scope.row.r2mOffsetToIdToken"
                                        clearable
                                    >
                                    </el-input>
                                    <div style="line-height:20px;" v-else>{{scope.row.r2mOffsetToIdToken}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="OTIpassword" align="center" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-form-item :prop="'tableData.' + scope.$index + '.r2mOffsetToIdPasswd'" :rules="model.rules.r2mOffsetToIdPasswd">
                                    <el-input
                                        class="com-input com-width"
                                        v-if="!isDetail"
                                        placeholder="2-25个字符"
                                        v-model="scope.row.r2mOffsetToIdPasswd"
                                        clearable
                                    >
                                    </el-input>
                                    <div style="line-height:20px;" v-else>{{scope.row.r2mOffsetToIdPasswd}}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center" width="100" v-if="!isDetail">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="addRow(scope.$index, poolParams.sysIDMappingColumnVOList)"
                                    type="text"
                                    class="btn-main-class"
                                >
                                    <i class="el-icon-circle-plus" style="color:  #2C68FF; font-size: x-large;"></i>
                                </el-button>
                                <el-button
                                    @click.native.prevent="deleteRow(scope.row, scope.$index, model.tableData, poolParams.sysIDMappingColumnVOList)"
                                    type="text"
                                    class="btn-main-class"
                                >
                                    <i class="el-icon-remove-outline" style="color:  #2C68FF; font-size: x-large; "></i>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </section>
            <footer v-if="!isDetail">
<!--                <el-button class="com-button" @click="cancel">取消</el-button>-->
                <el-button class="com-button" type="primary" @click="save" :loading="btnLoading">保存</el-button>
            </footer>
        </main>
    </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
@Component
export default class EditSubject extends Vue {
    @State(state => state.nameAndTime) nameAndTime: any;
    @State(state => state.btnLoading) btnLoading?: boolean;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;
    @Prop({ type: Boolean }) private isDetail?: boolean;
    private editDialog: boolean = false;
    private title: string = '新增ID池';
    private parentId: null | number = null;
    private model: any = {
        tableData: [
            {
                dsCol: '', //字段名称
                id: null,
                dsColName: '', //id类型
                idmappingId: this.parentId, //当外层有id即为编辑时，对其统一赋值
                r2mIdToOffset: '', //toOffset
                r2mOffsetToId: '', //toId
                valid: 1,
                r2mIdToOffsetPasswd: '',
                r2mIdToOffsetToken: '',
                r2mOffsetToIdPasswd: '',
                r2mOffsetToIdToken: ''
            }
        ],
        rules: {
            dsCol: [{ required: true, message: '必选', trigger: 'change' }],
            dsColName: [
                { required: true, message: '必填', trigger: 'blur' },
                { min: 2, max: 15, message: '可输入2~15个字符', trigger: 'blur' },
                { validator: this.checkName, message: '不可重复', trigger: 'blur' }
            ],
            r2mIdToOffset: [
                { required: true, message: '必填', trigger: 'blur' },
                { min: 2, max: 25, message: '可输入2~25个字符', trigger: 'blur' }
            ],
            r2mIdToOffsetToken: [
                { required: true, message: '必填', trigger: 'blur' },
                { min: 2, max: 25, message: '可输入2~25个字符', trigger: 'blur' }
            ],
            r2mIdToOffsetPasswd: [
                { required: true, message: '必填', trigger: 'blur' },
                { min: 2, max: 25, message: '可输入2~25个字符', trigger: 'blur' }
            ],
            r2mOffsetToId: [
                { required: true, message: '必填', trigger: 'blur' },
                { min: 2, max: 25, message: '可输入2~25个字符', trigger: 'blur' }
            ],
            r2mOffsetToIdToken: [
                { required: true, message: '必填', trigger: 'blur' },
                { min: 2, max: 25, message: '可输入2~25个字符', trigger: 'blur' }
            ],
            r2mOffsetToIdPasswd: [
                { required: true, message: '必填', trigger: 'blur' },
                { min: 2, max: 25, message: '可输入2~25个字符', trigger: 'blur' }
            ]
        }
    };
    private checkName(rule: any, value: any, callback: any) {
        if (!value) {
            return callback(new Error('ID类型不能为空'));
        } else {
            this.model.tableData.forEach((t1: any, i1: number) => {
                this.model.tableData.forEach((t2: any, i2: number) => {
                    if (t1.dsColName === t2.dsColName && i1 !== i2) {
                        return callback(new Error('ID类型不可重复'));
                    }
                });
            });
            callback();
        }
    }
    private offsetList: any[] = [];
    private kuData: any[] = [];
    private biaoData: any[] = [];
    private oldTable: any[] = [];
    private poolParams: any = {
        sysIDMappingColumnVOList: []
    };
    private sameName: boolean = false;
    private rules: any = {
        idmappingName: [{ required: true, message: '请输入ID池名称', trigger: 'blur' }],
        sourceDb: [{ required: true, message: '请选择库名', trigger: 'change' }],
        sourceTb: [{ required: true, message: '请选择表名', trigger: 'change' }],
        sourceColOffset: [{ required: true, message: '请选择offset列', trigger: 'change' }],
        idmappingDesc: [
            { required: true, message: '请输入ID池描述', trigger: 'blur' },
            { min: 3, max: 200, message: '可输入3~200字符', trigger: 'blur' }
        ],
        targetTb: [
            { required: true, message: '请输入目标表', trigger: 'blur' },
            { min: 10, max: 100, message: '可输入10~100字符', trigger: 'blur' }
        ],
        targetDb: [
            { required: true, message: '请输入目标库', trigger: 'blur' },
            { min: 2, max: 15, message: '可输入2~15字符', trigger: 'blur' }
        ]
    };

    // private getDb(): void {
    //   this.$api
    //     .post(
    //       '/local/ava/hive/db',
    //       { clusterId: 13, dbName: null, key: '', pageNum: 1, pageSize: 20, table: '' },
    //       {
    //         headers: { 'Content-Type': 'application/json;charset=utf-8' }
    //       }
    //     )
    //     .then((res: any) => {
    //       console.log(res);
    //     });
    // }

    public testOption(item: any) {
        const list: Array<object> = this.poolParams.sysIDMappingColumnVOList
            .filter((v: any) => v.valid == 1 && v.dsCol != '')
            .map((v: any) => v.dsCol);
        return list.includes(item.label) || item.label == this.poolParams.sourceColOffset ? true : false;
    }
    private getKuNameList() {
        // 库名
        return new Promise((resolve, reject) => {
            const url = '/api/ava/hive/db';
            this.$api
                .get(url)
                .then(res => {
                    resolve(res);
                    this.kuData = res;
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private getBiaoList(val: string) {
        // 表名
        this.poolParams.sourceTb = '';
        Promise.all([this.getHiveTable(val), this.getHiveAllTable(val)]).then(() => {
            this.biaoData.forEach(item => {
                const used = this.usedDbList.some(t2 => {
                    return t2 === item.name;
                });
                item.disabled = used;
            });
            console.log(this.biaoData);
        });
    }
    private getHiveTable(val: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/hive/table';
            const data = {
                clusterId: 13,
                dbName: val,
                pageNum: 1,
                pageSize: 100
            };
            this.$api
                .post(url, data)
                .then(res => {
                    this.biaoData = [];
                    res.tables.forEach((item: any) => {
                        this.biaoData.push({
                            name: item,
                            disabled: false
                        });
                    });
                    console.log('yici :', this.biaoData);
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private usedDbList: any[] = [];
    private getHiveAllTable(val: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/hive/allTable';
            const data = {
                clusterId: 13,
                dbName: val,
                pageNum: 1,
                pageSize: 100
            };
            this.$api
                .post(url, data)
                .then(res => {
                    this.usedDbList = res;
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private getColumnList(val: string) {
        this.offsetList = [];
        this.poolParams.sourceColOffset = '';
        if (this.poolParams.id) {
            // 修改时
            this.poolParams.sysIDMappingColumnVOList.map((item: any) => {
                // 保存将要删除的数据，valid为0
                item.valid = 0;
            });
            this.poolParams.sysIDMappingColumnVOList.push({
                dsCol: '', //字段名称
                id: null,
                dsColName: '', //id类型
                idmappingId: null, //当外层有id即为编辑时，对其统一赋值
                r2mIdToOffset: '', //toOffset
                r2mOffsetToId: '',
                valid: 1, //toId
                r2mIdToOffsetPasswd: '',
                r2mIdToOffsetToken: '',
                r2mOffsetToIdPasswd: '',
                r2mOffsetToIdToken: ''
            });
        } else {
            // 新增时
            this.poolParams.sysIDMappingColumnVOList = [
                {
                    dsCol: '', //字段名称
                    id: null,
                    dsColName: '', //id类型
                    idmappingId: null, //当外层有id即为编辑时，对其统一赋值
                    r2mIdToOffset: '', //toOffset
                    r2mOffsetToId: '',
                    valid: 1, //toId
                    r2mIdToOffsetPasswd: '',
                    r2mIdToOffsetToken: '',
                    r2mOffsetToIdPasswd: '',
                    r2mOffsetToIdToken: ''
                }
            ];
        }

        // 表名
        const url = '/api/ava/hive/column';
        const data = {
            clusterId: 13,
            dbName: this.poolParams.sourceDb,
            pageNum: 1,
            pageSize: 100,
            table: val
        };
        this.$api.post(url, data).then((res: any) => {
            res.column.forEach((ele: any) => {
                this.offsetList.push({
                    label: ele.name,
                    value: ele.type,
                    disabled: false
                });
            });
        });
    }
    public async open(row?: any) {
        this.editDialog = true;
        await this.getKuNameList();
        this.$nextTick(() => {
            this.parentId = null;
            if (row) {
                console.log(row);
                this.title = '编辑ID池';
                this.parentId = row.id;
                this.poolParams = JSON.parse(JSON.stringify(row));
                if (this.isDetail) {
                    this.title = '查看ID池';
                } else {
                    Promise.all([this.getBiaoList(row.sourceDb), this.getColumnList(row.sourceTb)]).finally(() => {
                        this.poolParams = JSON.parse(JSON.stringify(row));
                    });
                }
            } else {
                this.poolParams = {
                    createdTime: null,
                    creator: null,
                    sourceColOffset: '',
                    sourceDb: '',
                    sourceTb: '',
                    id: null,
                    idmappingDesc: '',
                    targetTb: '',
                    targetDb: '',
                    idmappingName: '',
                    modifiedTime: '',
                    modifier: null,
                    sysIDMappingColumnVOList: [
                        {
                            dsCol: '', //字段名称
                            id: null,
                            dsColName: '', //id类型
                            idmappingId: null, //当外层有id即为编辑时，对其统一赋值
                            r2mIdToOffset: '', //toOffset
                            r2mOffsetToId: '',
                            valid: 1, //toId
                            r2mIdToOffsetPasswd: '',
                            r2mIdToOffsetToken: '',
                            r2mOffsetToIdPasswd: '',
                            r2mOffsetToIdToken: ''
                        }
                    ]
                };
                (this.$refs['form'] as any).resetFields();
            }
        });
    }
    private cancel(): void {
        this.$emit('close');
    }

    private addRow(index: number, tableData: Array<any>): void {
        tableData.push({
            dsCol: '', //字段名称
            id: null,
            dsColName: '', //id类型
            idmappingId: this.parentId, //当外层有id即为编辑时，对其统一赋值
            r2mIdToOffset: '', //toOffset
            r2mOffsetToId: '', //toId
            valid: 1,
            r2mIdToOffsetPasswd: '',
            r2mIdToOffsetToken: '',
            r2mOffsetToIdPasswd: '',
            r2mOffsetToIdToken: ''
        });
        // setTimeout(() => {
        //   console.log(this.model.tableData, tableData);
        // }, 100);
    }
    private deleteRow(row: any, index: number, displayData: Array<object>, tableData: Array<any>): void {
        if (displayData.length == 1) {
            this.$message.error('不可删除第一行！');
            return;
        } else {
            if (row.id != null) {
                let index: number | null = null;
                tableData.some((v: any, ind: number) => {
                    if (v.id === row.id) {
                        index = ind;
                        return true;
                    }
                    return false;
                });
                if (index) {
                    tableData[index].valid = 0;
                }
            } else {
                tableData.splice(index, 1);
            }
        }
    }
    //可能有更好的点
    @Watch('poolParams', { deep: true, immediate: true })
    onPoolParamsChanged(val: any) {
        this.model.tableData = val.sysIDMappingColumnVOList.filter((v: any) => v.valid == 1);
    }

    private nameSame() {
        this.sameName = false;
        this.model.tableData.forEach((t1: any, i1: number) => {
            this.model.tableData.forEach((t2: any, i2: number) => {
                if (t1.dsColName === t2.dsColName && i1 !== i2) {
                    this.sameName = true;
                }
            });
        });
        if (!this.sameName) {
            this.$message.warning('ID类型不可重复！');
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

    private save(): void {
        this.chagneBtnLoading(true);
        const form = this.$refs.form as any;
        const table = this.$refs.table as any;
        let formValid: boolean = false;
        let tableValid: boolean = false;
        form.validate((valid: any) => {
            if (valid) {
                formValid = true;
            }
        });
        table.validate((valid: any) => {
            if (valid) {
                tableValid = true;
            }
        });

        if (formValid && tableValid && !this.sameName) {
            Object.assign(this.poolParams, this.nameAndTime);
            // console.log(this.poolParams);
            if (this.poolParams.id) {
                //这里时修改
                this.poolParams.sysIDMappingColumnVOList.map((item: any) => {
                    item.idmappingId = this.poolParams.id;
                });
                this.$api
                    .post('/api/admin/sysIDMapping/update', this.poolParams)
                    .then((res: any) => {
                        this.$message.success("修改成功");
                        this.editDialog = false;
                        this.$emit('update');
                        this.$emit('close');
                    })
                    .finally(() => {
                        this.chagneBtnLoading(false);
                    });
            } else {
                //这里是新建
                this.$api
                    .post('/api/admin/sysIDMapping/add', this.poolParams)
                    .then((res: any) => {
                        this.$message.success('新建成功');
                        this.editDialog = false;
                        this.$emit('update');
                        this.$emit('close');
                    })
                    .finally(() => {
                        this.chagneBtnLoading(false);
                    });
            }
        } else {
            this.chagneBtnLoading(false);
        }
    }
}
</script>
<style scoped lang="scss">
/deep/tbody .cell {
    margin-top: 16px;
    height: 60px;
}
main {
    width: 100%;
}
footer {
    display: flex;
    justify-content: flex-end;
    position: relative;
    bottom: 10px;
    margin-top: 40px;
    /*padding: 50px;*/
}
.com-width {
    width: 100%;
}
.title {
    position: relative;
    height: 22px;
    line-height: 22px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    left: 10px;
    color: rgba(27, 27, 27, 1);
    margin-bottom: 10px;
    &::before {
        content: '';
        position: absolute;
        left: -8px;
        width: 3px;
        height: 17px;
        background: rgba(57, 107, 246, 1);
        margin-top: 3px;
    }
}
/deep/ .el-select {
    width: 100%;
}
/deep/ .idInfo .el-form-item {
    // display: flex;
    // align-items: center;
    // justify-content: center;
    margin-bottom: 0px;
}
/deep/ .el-input__suffix > i:first-of-type {
    display: none;
}
</style>
