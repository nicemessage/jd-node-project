<template>
    <section class="edit-offline-section" style="padding: 30px;height: auto;">
        <el-form :model="offlineParams" :rules="rules" label-width="120px" class="com-form edit-dialog" ref="form">
            <div class="parambox">
                <h3 class="com-title">基本信息</h3>
                <div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="数据源名称" prop="dsName">
                                <el-input
                                    v-if="!(dialogTitle === '查看离线数据源')"
                                    class="com-input"
                                    type="text"
                                    placeholder="可输入2~15字符"
                                    v-model="offlineParams.dsName"
                                    maxlength="15"
                                    clearable
                                >
                                </el-input>
                                <div v-else>{{offlineParams.dsName}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数据源类型" prop="dsType">
                                <el-select
                                    v-if="!((dialogTitle === '查看离线数据源') || haveTag)"
                                    class="com-select offline-width"
                                    placeholder="请选择数据源类型"
                                    v-model="offlineParams.dsType"
                                    @change="changeType"
                                    clearable
                                >
                                    <el-option
                                        v-for="(item, index) in dsTypeOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                                <div v-else>{{findDSType(offlineParams.dsType)}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所属主体" prop="subjectId">
                                <el-select
                                    v-if="!((dialogTitle === '查看离线数据源') || haveTag)"
                                    class="com-select offline-top-width"
                                    placeholder="请选择所属主体"
                                    @change="changeSub"
                                    v-model="offlineParams.subjectId"
                                >
                                    <el-option
                                        v-for="(item, index) in subjectIdList"
                                        :key="index"
                                        :label="item.subjectCn"
                                        :value="item.id"
                                    ></el-option>
                                </el-select>
                                <div v-else>{{findSubCn(offlineParams.subjectId)}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="更新频率" prop="sourceDataCycle">
                                <el-select
                                    v-if="!((dialogTitle === '查看离线数据源') || haveTag)"
                                    class="com-select offline-width"
                                    placeholder="请选择更新频率"
                                    v-model="offlineParams.sourceDataCycle"
                                    clearable
                                >
                                    <el-option
                                        v-for="(item, index) in dataCycleOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                                <div v-else>{{findSourceDataCycle(offlineParams.sourceDataCycle)}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="数据源描述" prop="dsDesc">
                        <el-input
                            v-if="!(dialogTitle === '查看离线数据源')"
                            class="com-input"
                            type="textarea"
                            placeholder="可输入3~200字符"
                            :rows="5"
                            :resize="'none'"
                            v-model="offlineParams.dsDesc"
                            maxlength="200"
                            clearable
                        >
                        </el-input>
                        <div v-else>{{offlineParams.dsDesc}}</div>
                    </el-form-item>
                    <div v-if="(dialogTitle === '查看离线数据源') || haveTag">
                        <el-form-item label="创建人" :required="true">
                            <!-- <el-input class="com-input" v-model="offlineParams.creator" disabled></el-input> -->
                            <div>{{offlineParams.creator}}</div>
                        </el-form-item>
                        <el-form-item label="创建时间" :required="true">
                            <!-- <el-input class="com-input" v-model="offlineParams.createdTime" disabled></el-input> -->
                            <div>{{offlineParams.createdTime}}</div>
                        </el-form-item>
                        <el-form-item label="修改人" :required="true">
                            <!-- <el-input class="com-input" v-model="offlineParams.modifier" disabled></el-input> -->
                            <div>{{offlineParams.modifier}}</div>
                        </el-form-item>
                        <el-form-item label="修改时间" :required="true">
                            <!-- <el-input class="com-input" v-model="offlineParams.modifiedTime" disabled></el-input> -->
                            <div>{{offlineParams.modifiedTime}}</div>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="parambox">
                <h3 class="com-title">数据源配置</h3>
                <div>
                    <table style="width: 100%; margin-left:30px;">
                        <thead>
                            <tr>
                                <th class="sjytable-head" width="33%">Hive数据源</th>
                                <th class="sjytable-head" width="33%">CK数据源</th>
                                <th class="sjytable-head" width="33%">Hbase数据源</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <el-form-item style="margin-top:20px;" label="库名" prop="sourceDb">
                                        <el-select
                                            v-if="!((dialogTitle === '查看离线数据源') || haveTag)"
                                            class="com-select offline-width"
                                            placeholder="请选择"
                                            v-model="offlineParams.sourceDb"
                                            @change="changeKuName"
                                            clearable
                                        >
                                            <el-option v-for="(item, index) in sourceDbOptions" :key="index" :label="item" :value="item"></el-option>
                                        </el-select>
                                        <div v-else>{{offlineParams.sourceDb}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item style="margin-top:20px;" label="源库名" prop="targetDb">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            v-model="offlineParams.targetDb"
                                            :disabled="true"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{offlineParams.targetDb}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item style="margin-top:20px;" label="命名空间" prop="hbaseNs">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            v-model="offlineParams.hbaseNs"
                                            :disabled="true"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{offlineParams.hbaseNs}}</div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="表名" prop="sourceTbOrTopic">
                                        <el-select
                                            v-if="!((dialogTitle === '查看离线数据源') || haveTag)"
                                            class="com-select offline-width"
                                            placeholder="请选择"
                                            filterable
                                            :filter-method="filterBiaoMing"
                                            v-model="offlineParams.sourceTbOrTopic"
                                            @change="changeTB"
                                            clearable
                                        >
                                            <el-option
                                                v-for="(item, index) in biaoOptionsTemp"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.name"
                                                :disabled="item.disabled"
                                            ></el-option>
                                        </el-select>
                                        <div v-else>{{offlineParams.sourceTbOrTopic}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="位图库名" prop="bitmapDb">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            v-model="offlineParams.bitmapDb"
                                            :disabled="true"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{offlineParams.bitmapDb}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="列簇" prop="hbaseColFamily">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            v-model="offlineParams.hbaseColFamily"
                                            :disabled="true"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{offlineParams.hbaseColFamily}}</div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="ID列" prop="sourceColId">
                                        <el-select
                                            v-if="!((dialogTitle === '查看离线数据源') || haveTag)"
                                            class="com-select offline-width"
                                            @change="changeOffset"
                                            placeholder="请选择"
                                            v-model="offlineParams.sourceColId"
                                            clearable
                                        >
                                            <el-option v-for="(item, index) in offsetList" :key="index" :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                        <div v-else>{{offlineParams.sourceColId}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="源表名" prop="targetTb">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            v-model="offlineParams.targetTb"
                                            :disabled="true"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{offlineParams.targetTb}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="表名" prop="hbaseTb">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            v-model="offlineParams.hbaseTb"
                                            :disabled="true"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{offlineParams.hbaseTb}}</div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="DT列" prop="sourceColDt">
                                        <el-select
                                            v-if="!((dialogTitle === '查看离线数据源') || haveTag)"
                                            class="com-select offline-width"
                                            @change="changeOffset"
                                            placeholder="请选择"
                                            v-model="offlineParams.sourceColDt"
                                            clearable
                                        >
                                            <el-option v-for="(item, index) in dtList" :key="index" :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                        <div v-else>{{offlineParams.sourceColDt}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="生命周期" prop="targetTbLife">
                                        <template v-if="!(dialogTitle === '查看离线数据源')">
                                            <el-input-number
                                                class="com-input"
                                                placeholder="可输入数字"
                                                v-model.number="offlineParams.targetTbLife"
                                                :min="1"
                                                :max="7"
                                                clearable
                                                style="width: 80%"
                                            ></el-input-number>&nbsp;
                                            <template v-if="offlineParams.sourceDataCycle=='d'">天</template>
                                            <template v-if="offlineParams.sourceDataCycle=='y'">年</template>
                                            <template v-if="offlineParams.sourceDataCycle=='m'">月</template>
                                        </template>
                                        <div v-else>{{offlineParams.targetTbLife}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="表负责人" prop="sourceTbManager">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            v-model="offlineParams.sourceTbManager"
                                            :disabled="true"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{offlineParams.sourceTbManager}}</div>
                                    </el-form-item>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="parambox" v-if="!(dialogTitle === '查看离线数据源')">
                <div></div>
                <el-button
                        style="float:right;margin-left:20px;"
                        class="com-button"
                        type="primary"
                        :loading="btnLoading"
                        @click="submit"
                >保存</el-button
                >
            </div>
        </el-form>
    </section>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
// import Template from "@/Template.vue";
@Component({})
export default class EditOffline extends Vue {
    @State(state => state.nameAndTime) nameAndTime: any;
    @State(state => state.btnLoading) btnLoading?: boolean;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;
    @Prop({ type: String }) private dialogTitle?: string;
    @Prop({ type: Object }) private dialogData?: any;
    private dsTypeOptions: any[] = [
        // 数据源类型
        {
            label: '离线标准',
            value: '1'
        },
        {
            label: '离线组合',
            value: '2'
        }
    ];
    get subjectIdList (){
        const str: any = window.sessionStorage.getItem('subjectList');
        if(str){
            return JSON.parse(str);
        } else {
            return [];
        }
    };
    private biaoName: any = ''; // 表名
    // 库名List
    private sourceDbOptions: any[] = [];
    private dataCycleOptions: any[] = [
        { label: '日更', value: 'd' },
        { label: '月更', value: 'm' },
        { label: '年更', value: 'y' }
    ];

    //ID列List
    private offsetList: any[] = [];
    // DT列List
    private dtList: any[] = [];
    private biaoOptions: any[] = [];
    private biaoOptionsTemp: any[] = [];
    private rules: any = {
        sourceDataCycle: [{ required: true, message: '请选择更新频率', trigger: 'change' }],
        dsDesc: [{ required: true, min: 3, max: 200, message: '请输入数据源描述', trigger: 'blur' }],
        dsName: [{ required: true, min: 2, max: 15, message: '请输入数据源名称', trigger: 'blur' }],
        dsType: [{ required: true, message: '请选择数据源类型', trigger: 'change' }],
        hbaseColFamily: [{ required: true, message: ' ', trigger: 'change' }],
        hbaseNs: [{ required: true, message: ' ', trigger: 'change' }],
        hbaseTb: [{ required: true, message: ' ', trigger: 'change' }],
        idmappingColumnId: [{ required: true }],
        sourceColDt: [{ required: true, message: '请选择DT列', trigger: 'change' }],
        sourceColId: [{ required: true, message: '请选择ID列', trigger: 'change' }],
        sourceDb: [{ required: true, message: '请选择库名', trigger: 'change' }],
        sourceTbOrTopic: [{ required: true, message: '请选择表名', trigger: 'change' }],
        targetDb: [{ required: true, message: ' ', trigger: 'change' }],
        targetTb: [{ required: true, message: ' ', trigger: 'change' }],
        targetTbLife: [
            { required: true, validator: this.checkLife, message: '请输入生命周期', trigger: 'blur' },
            { type: 'number', min: 1, max: 7, message: '请输入数字，最大值为7' }
        ],
        bitmapDb: [{ required: true, message: ' ', trigger: 'change' }],
        creator: [{ required: true }],
        sourceTbManager: [{ required: true , message: '', trigger: 'change' }],
        subjectId: [{ required: true, message: '请选择所属主体', trigger: 'change' }]
    };
    private checkLife(rule: any, value: any, callback: any) {
        if (!value) {
            return callback(new Error('生命周期不能为空'));
        } else if (value < 1) {
            return callback(new Error('生命周期最小为1'));
        } else {
            return callback();
        }
    }
    private offlineParams: any = {
        sourceDataCycle: '', // 更新频率
        bitmapTb: '',
        bitmapDb: '',
        bitmapTbLife: '',
        dsDesc: '',
        dsName: '',
        dsType: '',
        hbaseColFamily: 't',
        hbaseNs: 'smart_tag',
        hbaseTb: '',
        idmappingColumnId: '',
        idmappingColumnName: '',
        sourceColDt: '',
        sourceColId: '',
        sourceDb: '',
        sourceTbManager: window.sessionStorage.getItem("userErp"),  // window.sessionStorage.getItem("userErp")
        sourceTbOrTopic: '',
        subjectId: '',
        targetDb: '',
        targetTb: '',
        targetTbLife: 3,
        creator: ''
    };
    private haveTag: boolean = false; // 关联有标签时，只能修改数据源名称、数据源描述
    @Watch('offlineParams', { immediate: true, deep: true })
    private handler(val: any): void {
        const { targetTbLife, targetTb } = val;
        this.offlineParams.bitmapTbLife = targetTbLife;
        this.offlineParams.bitmapTb = targetTb;
        // this.offlineParams.bitmapDb = targetDb;
    }
    private getKuNameList() {
        // 库名
        return new Promise((resolve, reject) => {
            const url = '/api/ava/hive/db';
            this.$api
                .get(url)
                .then((res: any) => {
                    resolve(res);
                    this.sourceDbOptions = res;
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private cancel(): void {
        this.$emit('update');
    }
    private changeKuName(val: string) {
        this.getBiaoList(val);
        this.offlineParams.sourceTbOrTopic = '';
        this.offlineParams.sourceColId = '';
        this.offlineParams.sourceColDt = '';
    }
    private filterBiaoMing(val: string) {
        this.biaoOptionsTemp = this.biaoOptions.filter((item: any) => {
            return item.name.indexOf(val) != -1;
        })
    }
    private getBiaoList(val: string) {
        // 表名
        Promise.all([this.getHiveTable(val), this.getHiveAllTable(val)]).then(() => {
            this.biaoOptions.forEach(item => {
                const used = this.usedDbList.some(t2 => {
                    return t2 === item.name;
                });
                item.disabled = used;
            });
            this.biaoOptionsTemp = this.biaoOptions.map(i=>i);
        });
    }
    private getHiveTable(val: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/hive/table';
            const data = {
                clusterId: 13,
                dbName: val,
                pageNum: 1,
                pageSize: 1000
            };
            this.$api
                .post(url, data)
                .then((res: any) => {
                    this.biaoOptions = [];
                    res.tables.forEach((item: any) => {
                        this.biaoOptions.push({
                            name: item,
                            disabled: false
                        });
                    });
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
                pageSize: 1000
            };
            this.$api
                .post(url, data)
                .then((res: any) => {
                    this.usedDbList = res;
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private getColumnList(val: string) {
        this.offlineParams.sourceTbManager = '';
        this.offsetList = [];
        this.dtList = [];
        // 列名
        const url = '/api/ava/hive/column';
        const data = {
            clusterId: 13,
            dbName: this.offlineParams.sourceDb,
            pageNum: 1,
            pageSize: 100,
            table: val
        };
        this.$api.post(url, data).then((res: any) => {
            this.offlineParams.sourceTbManager = res.owner;
            this.offsetList = res.column;
            this.dtList = res.partitions;
        });
    }
    private findDSType(type: number) {
        let name = '';
        for (const i in this.dsTypeOptions) {
            if (Object.prototype.hasOwnProperty.call(this.dsTypeOptions, i)) {
                const element = this.dsTypeOptions[i];
                if (element.value == type) {
                    name = element.label;
                }
            }
        }
        if (name == '') {return type;}
        return name;
    }
    private findSubCn(tid: number) {
        let name = '';
        for (const i in this.subjectIdList) {
            if (Object.prototype.hasOwnProperty.call(this.subjectIdList, i)) {
                const element = this.subjectIdList[i];
                if (element.id == tid) {
                    name = element.subjectCn;
                }
            }
        }
        if (name == '') {return tid;}
        return name;
    }
    private findSourceDataCycle(v: number) {
        let name = '';
        for (const i in this.dataCycleOptions) {
            if (Object.prototype.hasOwnProperty.call(this.dataCycleOptions, i)) {
                const element = this.dataCycleOptions[i];
                if (element.value == v) {
                    name = element.label;
                }
            }
        }
        if (name == '') {return v;}
        return name;
    }
    private async mounted() {
        Promise.all([this.getKuNameList()]).finally(() => {
            if (JSON.stringify(this.dialogData) !== '{}') {
                console.log('123:', this.dialogData);
                // 修改或查看
                this.offlineParams = this.dialogData;
                console.log(this.offlineParams.targetTbLife);
                // transformationNumber
                this.offlineParams.targetTbLife = this.transformationNumber(this.offlineParams,true);
                console.log(this.offlineParams.targetTbLife);
                if (this.dialogData.tagRelationNum > 0) {
                    this.haveTag = true;
                } else {
                    this.haveTag = false;
                }
            }
        });
    }
    private changeOffset() {
        const { sourceColId, sourceColDt } = this.offlineParams;
        this.offsetList.map((item: any) => {
            if (item.label === sourceColId || item.label === sourceColDt) {
                item.disabled = true;
            } else {
                item.disabled = false;
            }
        });
    }
    private getSubDetail(val: any) {
        this.$api.get('/api/admin/sysSubject/get', { id: val }).then((res: any) => {
            this.offlineParams.idmappingColumnId = res.idmappingColumnId;
            this.offlineParams.idmappingColumnName = res.idmappingColumnName;
        });
    }
    private changeSub(val: any) {
        this.getSubDetail(val);
        const rowList: any[] = this.subjectIdList.filter((item: any) => {
            return item.id === val;
        });
        const row = rowList[0];
        console.log(row);
        // 规则：
        // 一、CK数据源
        // 源库名：主体英文名_source
        this.offlineParams.targetDb = `${row.subjectEn}_source`;
        // 位图库名：主体英文名
        this.offlineParams.bitmapDb = row.subjectEn;
        // 二、Hbase数据源
        // 命名空间：smart_tag
        // 列簇：t

        // 表名：jdd_ava_主体英文名_tag
        if (this.offlineParams.dsType === '1') {
            this.offlineParams.hbaseTb = `jdd_ava_${row.subjectEn}_tag`;
        }
        //             jdd_ava_主体英文名_hive表名_tag
        if (this.offlineParams.dsType === '2') {
            this.offlineParams.hbaseTb = `jdd_ava_${row.subjectEn}_${this.offlineParams.sourceTbOrTopic}_tag`;
        }
    }
    private changeTB(val: any) {
        this.offlineParams.sourceColId = '';
        this.offlineParams.sourceColDt = '';
        this.getColumnList(val);
        const rowList: any[] = this.subjectIdList.filter((item: any) => {
            return item.id === this.offlineParams.subjectId;
        });
        const row = rowList[0];
        // 表名：tag_表名(离线标签数据源
        if (this.offlineParams.dsType === '1') {
            this.offlineParams.targetTb = `tag_${val}`;
        }
        //      tag_表名（离线组合数据源)）
        if (this.offlineParams.dsType === '2') {
            this.offlineParams.targetTb = `tag_${val}`;
            this.offlineParams.hbaseTb = `jdd_ava_${row.subjectEn}_${this.offlineParams.sourceTbOrTopic}_tag`;
            if (this.offlineParams.subjectId !== '') {
                this.offlineParams.hbaseTb = `jdd_ava_${row.subjectEn}_${val}_tag`;
            }
        }
    }
    private changeType(val: any) {
        const rowList: any[] = this.subjectIdList.filter((item: any) => {
            return item.id === this.offlineParams.subjectId;
        });
        const row = rowList[0];
        // 表名：tag_表名(离线标签数据源
        if (val === '1' && this.offlineParams.subjectId !== '') {
            this.offlineParams.hbaseTb = `jdd_ava_${row.subjectEn}_tag`;
        }
        //      tag_表名（离线组合数据源)）
        if (val === '2' && this.offlineParams.subjectId !== '') {
            this.offlineParams.hbaseTb = `jdd_ava_${row.subjectEn}_${this.offlineParams.sourceTbOrTopic}_tag`;
        }
        if (val === '1') {
            this.offlineParams.targetTb = `tag_${this.offlineParams.sourceTbOrTopic}`;
        } else {
            this.offlineParams.targetTb = `tag_${this.offlineParams.sourceTbOrTopic}`;
        }
    }
    // private getSubjectIdList(): void {
    //     this.$nextTick(() => {
    //         const str: any = window.sessionStorage.getItem('subjectIdList');
    //         this.subjectIdList = JSON.parse(str);
    //     });
    // }
    // 周期时间转换
    private transformationNumber(offlineParams:any,type?:boolean){
        const dataMap:any = {
            d:1,
            m:30,
            y:365
        };
        if(type){
            return Math.round(offlineParams.targetTbLife/dataMap[offlineParams.sourceDataCycle])
        }else{
            return dataMap[offlineParams.sourceDataCycle]*offlineParams.targetTbLife
        }

    }
    // 保存离线数据源
    private submit(): void {
        this.chagneBtnLoading(true);
        (this.$refs['form'] as any).validate((valid: any) => {
            if (valid) {
                Object.assign(this.offlineParams, this.nameAndTime,{targetTbLife:this.transformationNumber(this.offlineParams)});
                if (this.dialogTitle === '新增离线数据源') {
                    this.$api
                        .post('/api/admin/sysDs/add', this.offlineParams)
                        .then((res: any) => {
                            this.$message.success('修改成功');
                            this.$emit('update');
                        })
                        .finally(() => {
                            this.chagneBtnLoading(false);
                        });
                } else {
                    Object.assign(this.offlineParams,{targetTbLife:this.transformationNumber(this.offlineParams)});
                    this.$api
                        .put('/api/admin/sysDs/update', this.offlineParams)
                        .then((res: any) => {
                            this.$message.success("修改成功");
                            this.$emit('update');
                        })
                        .finally(() => {
                            this.chagneBtnLoading(false);
                        });
                }
            } else {
                this.chagneBtnLoading(false);
                console.log('error submit!!');
                return false;
            }
        });
    }
}
</script>
<style scoped lang="scss">
footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 80px;
}
.offline-width {
    width: 100%;
}
.offline-top-width {
    width: 80%;
}
.sjytable-head {
    text-align: center;
    height: 40px;
    line-height: 40px;
    background: #ccc;
    font-weight: bold;
    font-size: 18px;
}
.sjyBox {
    border: 2px solid #396bf6;
    display: flex;
    width: calc(100% - 120px) !important;
    margin: 0px 0px 20px 120px;
    p {
        flex: 1;
        text-align: center;
        height: 40px;
        line-height: 40px;
        background: #ccc;
        font-weight: bold;
        font-size: 18px;
    }
}
.parambox {
    display: flex;
    padding-right: 80px;
    margin-bottom: 20px;
    h3 {
        // float: left;
        width: 110px;
        height: max-content;
        margin-left: 50px;
    }
    div {
        width: 100%;
    }
}
// /deep/ .myLabelWidth {
//   .el-form-item__label {
//     width: 80px !important;
//   }
//   .el-form-item__content {
//     margin-left: 80px !important;
//   }
// }
</style>
