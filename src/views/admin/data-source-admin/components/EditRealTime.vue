<template>
    <section class="edit-real-time-section">
        <el-form :model="realParams" :rules="rules" label-width="120px" class="com-form edit-dialog" ref="form">
            <div class="parambox">
                <h3 class="com-title">基本信息</h3>
                <div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="数据源名称" prop="dsName">
                                <el-input
                                    v-if="!(dialogTitle === '查看实时数据源')"
                                    class="com-input"
                                    type="text"
                                    placeholder="可输入2~15字符"
                                    v-model="realParams.dsName"
                                    maxlength="15"
                                    clearable
                                >
                                </el-input>
                                <div v-else>{{realParams.dsName}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数据源类型" prop="dsType">
                                <el-select v-if="!(dialogTitle === '查看实时数据源')" class="com-select com-width" placeholder="请选择" v-model="realParams.dsType" :disabled="true">
                                    <el-option
                                        v-for="(item, index) in dsTypeOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                                <div v-else>{{findDSType(realParams.dsType)}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所属主体" prop="subjectId">
                                <el-select
                                    v-if="!((dialogTitle === '查看实时数据源') || haveTag)"
                                    class="com-select offline-top-width"
                                    placeholder="请选择"
                                    @change="changeSub"
                                    v-model="realParams.subjectId"
                                >
                                    <el-option
                                        v-for="(item, index) in subjectIdList"
                                        :key="index"
                                        :label="item.subjectCn"
                                        :value="item.id"
                                    ></el-option>
                                </el-select>
                                <div v-else>{{findSubCn(realParams.subjectId)}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="更新频率" prop="sourceDataCycle">
                                <el-select
                                    v-if="!((dialogTitle === '查看实时数据源') || haveTag)"
                                    class="com-select offline-width"
                                    placeholder="请选择更新频率"
                                    v-model="realParams.sourceDataCycle"
                                    clearable
                                >
                                    <el-option
                                        v-for="(item, index) in dataCycleOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                                <div v-else>{{findSourceDataCycle(realParams.sourceDataCycle)}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="数据源描述" prop="dsDesc">
                        <el-input
                            v-if="!(dialogTitle === '查看实时数据源')"
                            class="com-input"
                            type="textarea"
                            placeholder="可输入3~200字符"
                            :rows="5"
                            :resize="'none'"
                            v-model="realParams.dsDesc"
                            maxlength="200"
                            clearable
                        >
                        </el-input>
                        <div v-else>{{realParams.dsDesc}}</div>
                    </el-form-item>
                    <div v-if="(dialogTitle === '查看实时数据源') || haveTag">
                        <el-form-item label="创建人" :required="true">
                            <!-- <el-input class="com-input" v-model="realParams.creator" disabled></el-input> -->
                            <div>{{realParams.creator}}</div>
                        </el-form-item>
                        <el-form-item label="创建时间" :required="true">
                            <!-- <el-input class="com-input" v-model="realParams.createdTime" disabled></el-input> -->
                            <div>{{realParams.createdTime}}</div>
                        </el-form-item>
                        <el-form-item label="修改人" :required="true">
                            <!-- <el-input class="com-input" v-model="realParams.modifier" disabled></el-input> -->
                            <div>{{realParams.modifier}}</div>
                        </el-form-item>
                        <el-form-item label="修改时间" :required="true">
                            <!-- <el-input class="com-input" v-model="realParams.modifiedTime" disabled></el-input> -->
                            <div>{{realParams.modifiedTime}}</div>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="parambox">
                <h3 class="com-title">数据源配置</h3>
                <div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="TOPIC绑定" :required="true" class="item" style="margin-bottom:5px;">
<!--                                <el-input-->
<!--                                    v-if="!(dialogTitle === '查看实时数据源')"-->
<!--                                    v-model="realParams.sourceTopicJson"-->
<!--                                    class="com-input self-scroll"-->
<!--                                    clearable-->
<!--                                    type="textarea"-->
<!--                                    :rows="5"-->
<!--                                    resize="none"-->
<!--                                    placeholder="{theme:实时源名称,id:用户|企业id,dt:10位时间戳,tag1:1,tag2:2,...}"-->
<!--                                >-->
<!--                                </el-input>-->
<!--                                <div v-else>{{realParams.sourceTopicJson}}</div>-->
<!--                                <el-button-->
<!--                                    type="primary"-->
<!--                                    v-show="!(dialogTitle === '查看实时数据源')"-->
<!--                                    class="com-button"-->
<!--                                    @click="makeJson(realParams.sourceTopicJson)"-->
<!--                                    >查看结果</el-button-->
<!--                                >-->
                                <div class="data-configure">
                                    表名：
                                    <el-input v-model="sourceTopicJson.theme" style="width: 200px;" size="mini" :disabled="!!dialogData.id">
                                    </el-input>
                                </div>
                                <div class="data-configure" v-for="(item, index) in sourceTopicList" :key="`a${index}`">
                                    字段：
                                    <el-input v-model="item.key" :disabled="item.disabled" style="width: 200px;margin-right: 10px;" size="mini">
                                    </el-input>
                                    <el-button
                                            v-if="!item.disabled && index!=0"
                                            class="el-icon-close"
                                            @click="delJson(index)"
                                            size="mini"
                                            type="danger"
                                    ></el-button
                                    >
                                    <el-button
                                            v-if="index == sourceTopicList.length-1"
                                            class="el-icon-plus"
                                            @click="addJson"
                                            size="mini"
                                            type="primary"
                                    ></el-button
                                    >
                                </div>
                                <el-button
                                        type="primary"
                                        v-show="!(dialogTitle === '查看实时数据源')"
                                        class="com-button"
                                        @click="makeJsonTo"
                                >查看结果</el-button
                                >
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="查看结果"
                                :required="true"
                                class="item jieguoBox self-scroll"
                                :class="{ active: (dialogTitle === '查看实时数据源') }"
                                style="margin-bottom:5px;"
                            >
                                <div class="edit-word">
                                    <div v-if="totpicList.length > 0" class="word-list">
                                        <el-tag
                                            class="tag-item"
                                            :type="item.disabled === true ? 'info' : ''"
                                            size="small"
                                            v-for="(item, index) in totpicList"
                                            :key="index"
                                            v-show="item.key!='dt' && item.key!='id'"
                                            >
                                            <span v-if="item.key=='theme'">表名：{{ item.value }}</span>
                                            <span v-else>字段：{{ item.key }}</span>
                                        </el-tag
                                        >
                                    </div>
                                    <div class="data-empty" v-else>
                                        <span style="padding: 0 10px;">请编辑表名和字段，在此查看结果</span>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <table style="width: calc(100% - 120px); margin-left:120px;">
                        <thead>
                            <tr>
                                <th class="sjytable-head" width="33%">TOPIC数据源</th>
                                <th class="sjytable-head" width="33%">CK数据源</th>
                                <th class="sjytable-head" width="33%">Hbase数据源</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <el-form-item style="margin-top:20px;" label="TOPIC名称" prop="sourceTbOrTopic">
                                        <el-select
                                            v-if="!((dialogTitle === '查看实时数据源') || haveTag)"
                                            class="com-select offline-width"
                                            placeholder="请选择"
                                            v-model="realParams.sourceTbOrTopic"
                                            clearable
                                            @change="changeTopicName"
                                        >
                                            <el-option
                                                v-for="(item, index) in totpicNameList"
                                                :key="index"
                                                :label="item.value"
                                                :value="item.value"
                                            ></el-option>
                                            <!-- <el-option v-for="(item, index) in totpicList" :key="index" :label="item.value" :value="item.value"></el-option> -->
                                        </el-select>
                                        <div v-else>{{realParams.sourceTbOrTopic}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item style="margin-top:20px;" label="源库名" prop="targetDb">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            :disabled="true"
                                            v-model="realParams.targetDb"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{realParams.targetDb}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item style="margin-top:20px;" label="命名空间" prop="hbaseNs">
                                        <!-- <el-input class="com-input" v-model="realParams.hbaseNs" :disabled="true"></el-input> -->
                                        <div>{{realParams.hbaseNs}}</div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="ID列" prop="sourceColId">
                                        <el-select
                                            v-if="!((dialogTitle === '查看实时数据源') || haveTag)"
                                            class="com-select offline-width"
                                            placeholder="请选择"
                                            v-model="realParams.sourceColId"
                                            clearable
                                        >
                                            <el-option v-for="(item, index) in totpicList" :key="index" :label="item.key" :value="item.key"></el-option>
                                        </el-select>
                                        <div v-else>{{realParams.sourceColId}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="位图库名" prop="bitmapDb">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            :disabled="true"
                                            v-model="realParams.bitmapDb"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{realParams.bitmapDb}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="列簇" prop="hbaseColFamily">
                                        <!-- <el-input class="com-input" v-model="realParams.hbaseColFamily" :disabled="true"></el-input> -->
                                        <div>{{realParams.hbaseColFamily}}</div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="DT列" prop="sourceColDt">
                                        <el-select
                                            v-if="!((dialogTitle === '查看实时数据源') || haveTag)"
                                            class="com-select offline-width"
                                            placeholder="请选择"
                                            v-model="realParams.sourceColDt"
                                            clearable
                                        >
                                            <el-option v-for="(item, index) in totpicList" :key="index" :label="item.key" :value="item.key"></el-option>
                                        </el-select>
                                        <div v-else>{{realParams.sourceColDt}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="源表名" prop="bitmapTb">
                                        <!-- <el-input
                                            class="com-input"
                                            placeholder="可输入2~15字符"
                                            :disabled="true"
                                            v-model="realParams.bitmapTb"
                                            maxlength="50"
                                            clearable
                                        ></el-input> -->
                                        <div>{{realParams.bitmapTb}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="表名" prop="hbaseTb">
                                        <!-- <el-input class="com-input" v-model="realParams.hbaseTb" :disabled="true"></el-input> -->
                                        <div>{{realParams.hbaseTb}}</div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="TOPIC负责人" prop="sourceTbManager">
                                        <el-select
                                            v-if="!((dialogTitle === '查看实时数据源') || haveTag)"
                                            class="com-select com-width noSuffix"
                                            v-model="realParams.sourceTbManager"
                                            filterable
                                            remote
                                            reserve-keyword
                                            placeholder="请输入用户Id查询"
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
                                        <div v-else>{{realParams.sourceTbManager}}</div>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item label="生命周期" prop="targetTbLife">

                                        <template v-if="!(dialogTitle === '查看实时数据源')">
                                            <el-input-number
                                                    v-if="!(dialogTitle === '查看实时数据源')"
                                                    class="com-input"
                                                    placeholder="可输入数字"
                                                    v-model.number="realParams.targetTbLife"
                                                    :min="1"
                                                    :max="7"
                                                    clearable
                                                    @change="lifeCopy"
                                                    style="width: 80%"
                                            ></el-input-number>&nbsp;天
                                        </template>
                                        <div v-else>{{realParams.targetTbLife}}</div>
                                        <!-- <el-input v-model="realParams.targetTbLife" @change="lifeCopy"></el-input> -->
                                    </el-form-item>
                                </td>
                                <td>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="parambox" style="text-align: right;display: block;" v-if="!(dialogTitle === '查看实时数据源')">

<!--                <el-button class="com-button" style="margin-left:20px;" @click="cancel">取消</el-button>-->
                <el-button
                        style="margin-left:20px;"
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class EditRealTime extends Vue {
    @State(state => state.nameAndTime) nameAndTime: any;
    @State(state => state.btnLoading) btnLoading?: boolean;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;

    @Prop({ type: String }) private dialogTitle?: string;
    @Prop({ type: Object }) private dialogData?: any;
    private haveTag: boolean = false;
    private dsTypeOptions: any[] = [
        // 数据源类型
        {
            label: '实时标准',
            value: '3'
        }
    ];
    private totpicList: any[] = [];
    private totpicNameList: any[] = [];
    get subjectIdList (){
        const str: any = window.sessionStorage.getItem('subjectList');
        if(str){
            return JSON.parse(str);
        } else {
            return [];
        }
    };

    private sourceTopicJson:any = {
        theme:'',
        dt:'1',
        id:'1'
    };
    private sourceTopicList:any = [{
        key:'',
        disabled:false
    }];

    private idpoolList: any[] = [];
    private dataCycleOptions: any[] = [{ label: '时更', value: 'h' }];
    private rules: any = {
        sourceDataCycle: [{ required: true, message: '请选择更新频率', trigger: 'change' }],
        dsDesc: [{ required: true, min: 3, max: 200, message: '请输入数据源描述', trigger: 'blur' }],
        dsName: [{ required: true, min: 2, max: 15, message: '请输入数据源名称', trigger: 'blur' }],
        dsType: [{ required: true, message: '请选择数据源类型', trigger: 'change' }],
        hbaseColFamily: [{ required: true, message: ' ', trigger: 'change' }],
        hbaseNs: [{ required: true, message: ' ', trigger: 'change' }],
        hbaseTb: [{ required: true, message: ' ', trigger: 'change' }],
        dsColName: [{ required: true, message: '请选择对应ID池/ID列', trigger: 'change' }],
        sourceColDt: [{ required: true, message: '请选择DT列', trigger: 'change' }],
        sourceColId: [{ required: true, message: '请选择ID列', trigger: 'change' }],
        sourceDb: [{ required: true, message: '请选择库名', trigger: 'change' }],
        sourceTbOrTopic: [{ required: true, message: '请选择TOPIC表名', trigger: 'change' }],
        targetDb: [{ required: true, message: ' ', trigger: 'change' }],
        targetTb: [{ required: true }],
        targetTbLife: [
            { required: true, validator: this.checkLife, message: '请输入生命周期', trigger: 'blur' },
            { type: 'number', min: 1, max: 365, message: '请输入数字，最大值为365' }
        ],
        bitmapDb: [{ required: true, message: ' ', trigger: 'change' }],
        creator: [{ required: true }],
        bitmapTb: [{ required: true, message: ' ', trigger: 'change' }],
        sourceTbManager: [{ required: true, message: '请选择TOPIC负责人', trigger: 'blur' }],
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
    private erpOptions: any[] = [];
    private searchErp(str: string = '') {
        if (str !== '') {
            this.$api.get('/api/admin/token/getErpUser', { keyword: str }).then((res: any) => {
                this.erpOptions = res;
            });
        }
    }
    private realParams: any = {
        sourceDataCycle: 'h',
        bitmapTb: '',
        bitmapDb: '',
        bitmapTbLife: '',
        dsDesc: '',
        dsName: '',
        dsType: '3',
        hbaseColFamily: 't',
        hbaseNs: 'smart_tag',
        hbaseTb: '',
        dsColName: '',
        sourceColDt: '',
        sourceColId: '',
        sourceDb: '',
        sourceTbManager: window.sessionStorage.getItem("userErp"),
        sourceTbOrTopic: '',
        subjectId: '',
        targetDb: '',
        targetTb: '',
        targetTbLife: '',
        creator: '',
        sourceTopicJson: ''
    };

    @Watch('realParams.bitmapTb', { immediate: true, deep: true })
    private handler(val: string) {
        this.realParams.targetTb = val;
    }
    private cancel(): void {
        this.$emit('update');
    }
    private getSubjectIdList(): void {
        this.$nextTick(() => {
            // const str: any = window.sessionStorage.getItem('subjectIdList');
            // this.subjectIdList = JSON.parse(str);
        });
    }
    private getIdpoolList() {
        this.$api.get('/api/admin/sysIDMapping/queryIdMapping').then((res: any) => {
            this.idpoolList = res;
        });
    }
    private findDSType(type: number) {
        let name = '';
        for (const i in this.dsTypeOptions) {
            if (this.dsTypeOptions.hasOwnProperty(i)) {
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
            if (this.subjectIdList.hasOwnProperty(i)) {
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
            if (this.dataCycleOptions.hasOwnProperty(i)) {
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
        Promise.all([this.getSubjectIdList()]).finally(() => {
            if (this.dialogTitle !== '新增实时数据源') {
                Object.assign(this.realParams, this.dialogData);
                console.log(this.realParams);
                if (this.realParams.hbaseColFamily === '' || this.realParams.hbaseNs === '' || this.realParams.hbaseTb === '') {
                    this.realParams.hbaseColFamily = 't';
                    this.realParams.hbaseNs = 'smart_tag';
                    this.realParams.hbaseTb = `jdd_ava_${this.realParams.bitmapDb}_tag`;
                }
                this.sourceTopicJson = JSON.parse(this.realParams.sourceTopicJson);
                this.makeJson(this.realParams.sourceTopicJson);
                const params = {
                    dsColList: Object.keys(this.sourceTopicJson),
                    dsId: this.dialogData.id
                };
                this.$api.post('/api/admin/tag/tagColumnCheck', params).then((res: any) => {
                    this.sourceTopicListAdd(res);
                });
                if (this.dialogData.tagRelationNum > 0) {
                    this.haveTag = true;
                } else {
                    this.haveTag = false;
                }
            }
        });
    }
    private sourceTopicListAdd(arr:any){
        this.sourceTopicList = [];
        for(const i in this.sourceTopicJson){
            if(i != 'theme' && i != 'dt' && i != 'id'){
                let type:boolean = true;
                if(arr.indexOf(i) == -1){
                    type = false
                }
                this.sourceTopicList.push(
                    {
                        key:i,
                        disabled:type
                    }
                )
            }
        }
    }
    private addJson(){
        this.sourceTopicList.push(
            {
                key:'',
                disabled:false
            }
        )
    }
    private delJson(i:number){
        this.sourceTopicList.splice(i, 1);
        console.log(this.sourceTopicList);
    }
    private lifeCopy(val: string) {
        this.realParams.bitmapTbLife = val;
        // console.log(val);
    }
    private changeTopicName(val: any) {
        this.totpicList.forEach((item: any) => {
            if (item.value === val) {
                this.realParams.sourceDb = item.key;
                this.realParams.bitmapTb = `tag_${val}`;
            }
        });
    }
    private changeSub(val: any) {
        const rowList: any[] = this.subjectIdList.filter((item: any) => {
            return item.id === val;
        });
        const row = rowList[0];
        this.realParams.targetDb = `${row.subjectEn}_source`;
        this.realParams.bitmapDb = row.subjectEn;

        // 表名：jdd_ava_主体英文名_tag
        this.realParams.hbaseTb = `jdd_ava_${row.subjectEn}_tag`;
    }
    private makeJsonTo(){
        const val:any = {
            theme:this.sourceTopicJson.theme,
            dt:this.sourceTopicJson.dt,
            id:this.sourceTopicJson.id
        };
        if(val.theme == ''){
            this.$message.warning('请输入表名');
            return false;
        }
        for(const i in this.sourceTopicList){
            if(this.sourceTopicList[i].key == ''){
                this.$message.warning('请输入字段名');
                return false;
            }
            val[this.sourceTopicList[i].key] = '1';
        }
        this.makeJson(JSON.stringify(val));
    }
    private async makeJson(val?: string) {
        const data = JSON.parse(val);
        if (!data.theme || !data.id || !data.dt) {
            this.$message.warning('json中缺少必要键值（theme、id、dt）');
            return false;
        }
        const arr: any[] = [];
        Object.keys(data).forEach((KEY: string) => {
            const key: any = KEY.toLowerCase();
            arr.push({
                key: key,
                value: data[key] ? data[key] : key,
                disabled: false
            });
        });
        if (this.dialogTitle === '新增实时数据源') {
            this.$api.get('/api/admin/tag/realThemeCheck', { themeName: data.theme }).then((res: any) => {
                if (res === true) {
                    this.$message.warning('theme值重复，请重新填写');
                    return false;
                } else {
                    this.totpicList = JSON.parse(JSON.stringify(arr));
                    this.totpicNameList = [{ value: data.theme }];
                }
            });
        } else {
            if (this.dialogData.sourceTopicJson !== this.realParams.sourceTopicJson) {
                const params = {
                    dsColList: Object.keys(JSON.parse(this.dialogData.sourceTopicJson)),
                    dsId: this.dialogData.id
                };
                await this.$api.post('/api/admin/tag/tagColumnCheck', params).then((res: any) => {
                    let errKey: string = '';
                    try {
                        res.forEach((item: string) => {
                            if (!data[item]) {
                                errKey = item;
                                throw new Error('unDefind');
                            }
                        });
                    } catch (e) {
                        if (e.message === 'unDefind') {
                            return this.$message.warning(`字段${errKey}已被标签绑定，不可删除`);
                            // return false;
                        }
                    }
                    const params = {
                        dsColList: Object.keys(data),
                        dsId: this.dialogData.id
                    };
                    this.$api.post('/api/admin/tag/tagColumnCheck', params).then((res: any) => {
                        const checkList = JSON.parse(JSON.stringify(res));
                        arr.map((item: any) => {
                            const x = checkList.some((element: any) => {
                                return item.key === element;
                            });
                            if (x) {
                                item.disabled = true;
                            }
                        });

                        this.totpicList = JSON.parse(JSON.stringify(arr));
                        this.totpicNameList = [{ value: data.theme }];
                    });
                });
            } else {
                const params = {
                    dsColList: Object.keys(data),
                    dsId: this.dialogData.id
                };
                this.$api.post('/api/admin/tag/tagColumnCheck', params).then((res: any) => {
                    const checkList = JSON.parse(JSON.stringify(res));
                    arr.map((item: any) => {
                        const x = checkList.some((element: any) => {
                            return item.key === element;
                        });
                        if (x) {
                            item.disabled = true;
                        }
                    });
                    this.totpicList = JSON.parse(JSON.stringify(arr));
                    this.totpicNameList = [{ value: data.theme }];
                });
            }
        }
    }

    private submit(): void {
        this.chagneBtnLoading(true);
        (this.$refs['form'] as any).validate((valid: any) => {
            if (valid) {
                Object.assign(this.realParams, this.nameAndTime);
                const sourceTopicJson:any = {};
                for(const i:any in this.totpicList){
                    sourceTopicJson[this.totpicList[i].key] = this.totpicList[i].value;
                }
                this.realParams.sourceTopicJson = JSON.stringify(sourceTopicJson);

                if (this.dialogTitle === '新增实时数据源') {
                    this.$api
                        .post('/api/admin/sysDs/add', this.realParams)
                        .then((res: any) => {
                            this.$message.success(res.msg);
                            this.$emit('update');
                        })
                        .finally(() => {
                            this.chagneBtnLoading(false);
                        });
                } else {
                    const data = JSON.parse(this.realParams.sourceTopicJson);
                    const params = {
                        dsColList: Object.keys(JSON.parse(this.dialogData.sourceTopicJson)),
                        dsId: this.dialogData.id
                    };
                    this.$api.post('/api/admin/tag/tagColumnCheck', params).then((res: any) => {
                        let errKey: string = '';
                        try {
                            res.forEach((item: string) => {
                                if (!data[item]) {
                                    errKey = item;
                                    throw new Error('unDefind');
                                }
                            });
                        } catch (e) {
                            if (e.message === 'unDefind') {
                                this.$message.warning(`字段${errKey}已被标签绑定，不可删除`);
                                this.chagneBtnLoading(false);
                                return false;
                            }
                        }
                        console.log('通过');
                        this.$api
                            .put('/api/admin/sysDs/update', this.realParams)
                            .then((res: any) => {
                                this.$message.success('成功');
                                this.$emit('update');
                            })
                            .finally(() => {
                                this.chagneBtnLoading(false);
                            });
                    });
                }
            } else {
                console.log('error submit!!');
                this.chagneBtnLoading(false);
                return false;
            }
        });
    }
}
</script>
<style scoped lang="scss">
    .data-configure{
        padding: 0 0 10px;
    }
    .edit-real-time-section{
        height: auto;
        padding: 30px;
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
/deep/ .noSuffix {
    .el-input__suffix {
        display: none;
    }
}
.sjytable-head {
    text-align: center;
    height: 40px;
    line-height: 40px;
    background: #ccc;
    font-weight: bold;
    font-size: 18px;
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
footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 80px;
}
.edit-word {
    display: flex;
    align-items: flex-start;
}
.word-list {
    line-height: 30px;
    margin-left: 10px;
    .tag-item {
        margin-right: 10px;
        margin-bottom: 10px;
        &.disabled {
            background: #f4f4f5;
            color: #bcbec2;
            border-color: #e9e9eb;
        }
    }
}
.com-width {
    width: 100%;
}
.title3 {
    padding-left: 120px;
    text-align: center;
    margin-bottom: 10px;
}
/deep/ .jieguoBox .el-form-item__content {
    height: 102px;
    border: 1px solid #396bf6;
    overflow: auto;
    border-radius: 3px;
}
/deep/ .active {
    .el-form-item__content {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        color: #c0c4cc;
        cursor: not-allowed;
    }
}
</style>
