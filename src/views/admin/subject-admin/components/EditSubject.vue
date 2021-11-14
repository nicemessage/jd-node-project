<template>
    <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="editDialog"
        custom-class="com-dialog"
        width="1000px"
        :lock-scroll="true"
    >
        <div style="padding: 30px;">
            <el-form :model="subjectParams" :rules="rules" label-width="150px" class="com-form edit-subject" ref="form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="主体中文名称" prop="subjectCn">
                            <el-input
                                v-if="!isDetail"
                                class="com-input"
                                placeholder="主体中文名称仅支持中文汉字、大小写英文字母、数字、下划线"
                                v-model="subjectParams.subjectCn"
                                maxlength="15"
                                clearable
                            ></el-input>
                            <div v-else>{{subjectParams.subjectCn}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="主体英文名称" prop="subjectEn">
                            <el-input
                                v-if="title == '新增主体'"
                                class="com-input"
                                placeholder="主体英文名称仅支持小写英文字母"
                                v-model="subjectParams.subjectEn"
                                maxlength="5"
                                clearable
                                @input="inputEn"
                            ></el-input>
                            <div v-else>{{subjectParams.subjectEn}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="ID池名称" prop="idmappingId">
                            <el-select
                                v-if="!isDetail"
                                v-model="subjectParams.idmappingId"
                                class="com-select"
                                filterable
                                clearable
                                placeholder="请选择id池名称"
                                @change="changeIdName"
                            >
                                <el-option v-for="item in idPodsList" :key="item.id" :label="item.idmappingName" :value="item.id"> </el-option>
                            </el-select>
                            <div v-else>{{subjectParams.idmappingName}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="ID池类型" prop="idmappingColumnId">
                            <el-select
                                v-if="!isDetail"
                                v-model="subjectParams.idmappingColumnId"
                                class="com-select"
                                filterable
                                :clearable="true"
                                placeholder="请选择id池类型"
                            >
                                <el-option v-for="item in idColList" :key="item.id" :label="item.dsColName" :value="item.id"> </el-option>
                            </el-select>
                            <div v-else>{{subjectParams.dsColName}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="云存储群体桶" prop="jssCrowdBucket">
                            <el-input
                                v-if="!isDetail"
                                class="com-input"
                                placeholder="可输入2~15个字符"
                                v-model="subjectParams.jssCrowdBucket"
                                maxlength="15"
                                clearable
                            ></el-input>
                            <div v-else>{{subjectParams.jssCrowdBucket}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="云存储群体桶路径" prop="jssCrowdBucketPath">
                            <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.jssCrowdBucketPath" maxlength="50" disabled></el-input>
                            <div v-else>{{subjectParams.jssCrowdBucketPath}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="云存储标签桶" prop="jssTagBucket">
                            <el-input
                                v-if="!isDetail"
                                class="com-input"
                                placeholder="可输入2~15个字符"
                                v-model="subjectParams.jssTagBucket"
                                maxlength="15"
                                clearable
                            ></el-input>
                            <div v-else>{{subjectParams.jssTagBucket}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="云存储标签桶路径" prop="jssTagBucketPath">
                            <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.jssTagBucketPath" maxlength="50" disabled></el-input>
                            <div v-else>{{subjectParams.jssTagBucketPath}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="群体CK库名" prop="ckCrowdBitmapDb">
                            <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.ckCrowdBitmapDb" disabled></el-input>
                            <div v-else>{{subjectParams.ckCrowdBitmapDb}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="群体CK表名" prop="ckCrowdBitmapTb">
                            <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.ckCrowdBitmapTb" disabled></el-input>
                            <div v-else>{{subjectParams.ckCrowdBitmapTb}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-if="isDetail">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="创建人" :required="true">
                                <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.creator" disabled></el-input>
                                <div v-else>{{subjectParams.creator}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="创建时间" :required="true">
                                <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.createdTime" disabled></el-input>
                                <div v-else>{{subjectParams.createdTime}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="修改人" :required="true">
                                <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.modifier" disabled></el-input>
                                <div v-else>{{subjectParams.modifier}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="修改时间" :required="true">
                                <el-input v-if="!isDetail" class="com-input" v-model="subjectParams.modifiedTime" disabled></el-input>
                                <div v-else>{{subjectParams.modifiedTime}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-form-item label="主体描述" prop="subjectDesc">
                    <el-input
                        v-if="!isDetail"
                        class="com-input"
                        type="textarea"
                        placeholder="主体描述仅支持3-200字符及标准字符"
                        :rows="5"
                        :resize="'none'"
                        v-model="subjectParams.subjectDesc"
                        maxlength="200"
                        clearable
                    >
                    </el-input>
                    <div v-else>{{subjectParams.subjectDesc}}</div>
                </el-form-item>
            </el-form>
            <footer v-if="!isDetail">
<!--                <el-button class="com-button" @click="cancel">取消</el-button>-->
                <el-button class="com-button" type="primary" @click="save" :loading="btnLoading">保存</el-button>
            </footer>
        </div>
    </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class EditSubject extends Vue {
    // private loading: boolean = false;
    @State(state => state.nameAndTime) nameAndTime: any;
    @State(state => state.btnLoading) btnLoading?: boolean;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;
    @Prop({ type: Boolean, default: false }) private isDetail?: boolean;
    private displayList: Array<object> = [];
    private title: string = '新增主体';
    private editDialog: boolean = false;
    private idPodsList: Array<object> = [];
    private idColList: Array<object> = [];
    private subjectParams: any = {
        subjectCn: '',
        subjectEn: '',
        subjectDesc: '',
        idmappingId: '',
        idmappingColumnId: '',
        id: null,
        creator: null,
        modifier: null,
        subjectStatus: 1,
        jssCrowdBucket: '',
        jssCrowdBucketPath: '',
        jssTagBucket: '',
        jssTagBucketPath: '',
        ckCrowdBitmapDb: '',
        ckCrowdBitmapTb: 'crowd',
        ckCrowdBitmapTbLife: 180
    };
    private rules: any = {
        subjectCn: [
            { required: true, message: '请输入主体中文名称', trigger: 'blur' },
            { min: 2, max: 15, message: '可输入2~15个字符', trigger: 'blur' }
        ],
        subjectEn: [
            { required: true, message: '请输入主体英文名称', trigger: 'blur' },
            { min: 2, max: 5, message: '可输入2~5个字符', trigger: 'blur' }
        ],
        subjectDesc: [{ required: true, message: '请输入主体描述', trigger: 'blur' }],
        idmappingId: [{ required: true, message: '请输入ID池名称', trigger: 'change' }],
        idmappingColumnId: [{ required: true, message: '请输入ID池类型', trigger: 'change' }],
        jssCrowdBucket: [
            { required: true, message: '请输入云储存群体桶', trigger: 'blur' },
            { min: 2, max: 15, message: '可输入2~15个字符', trigger: 'blur' }
        ],
        jssCrowdBucketPath: [{ required: true, message: '请输入云储存群体桶路径', trigger: 'blur' }],
        jssTagBucket: [
            { required: true, message: '请输入云储存标签桶', trigger: 'blur' },
            { min: 2, max: 15, message: '可输入2~15个字符', trigger: 'blur' }
        ],
        jssTagBucketPath: [{ required: true, message: '请输入云储存标签桶路径', trigger: 'blur' }],
        ckCrowdBitmapDb: [{ required: true, message: '请输入群体CK库名', trigger: 'blur' }],
        ckCrowdBitmapTb: [{ required: true, message: '请输入群体CK表名', trigger: 'blur' }]
    };
    private inputEn(val: string) {
        console.log(val);
        this.subjectParams.jssCrowdBucketPath = val;
        this.subjectParams.jssTagBucketPath = val;
        this.subjectParams.ckCrowdBitmapDb = `${val}_crowd`;
    }
    public open(row?: any): void {
        this.editDialog = true;
        this.$nextTick(() => {
            (this.$refs['form'] as any).resetFields();
            this.subjectParams.id = null;
            if (row) {
                this.changeIdName(row.idmappingId);
                this.title = '编辑主体';
                this.subjectParams = JSON.parse(JSON.stringify(row));
                if (this.isDetail) {
                    this.title = '查看主体';
                    console.log('row1:', this.subjectParams);
                }
            } else {
                this.title = '新增主体';
            }
        });
    }
    private cancel(): void {
        this.editDialog = false;
    }
    private changeIdName(val: string | number) {
        this.subjectParams.idmappingColumnId = '';
        this.$api.get(`/api/admin/sysIDMapping/get?id=${val}`).then((res: any) => {
            this.idColList = res.sysIDMappingColumnVOList;
        });
    }
    private save(): void {
        this.chagneBtnLoading(true);
        const form = this.$refs.form as any;
        form.validate((valid: any) => {
            if (valid) {
                Object.assign(this.subjectParams, this.nameAndTime);
                if (this.subjectParams.id) {
                    this.$api
                        .put('/api/admin/sysSubject/update', this.subjectParams)
                        .then((res: any) => {
                            this.$message.success('保存成功');
                            this.editDialog = false;
                            this.$emit('update');
                        })
                        .finally(() => {
                            this.chagneBtnLoading(false);
                        });
                } else {
                    this.$api
                        .post('/api/admin/sysSubject/add', this.subjectParams)
                        .then((res: any) => {
                            this.$message.success('添加成功');
                            this.editDialog = false;
                            this.$emit('update');
                        })
                        .finally(() => {
                            this.chagneBtnLoading(false);
                        });
                }
            } else {
                this.chagneBtnLoading(false);
                return false;
            }
        });
    }

    private mounted() {
        this.getIdList();
    }
    private getIdList(){
        this.$api
            .get('/api/admin/sysIDMapping/queryIdMapping')
            .then((res: any) => {
                this.idPodsList = res;
            })
            .catch(() => {
                this.$message.error('获取ID池出错');
            });
    }
}
</script>
<style scoped lang="scss">
footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
}
/deep/ .el-select {
    width: 100%;
    .el-input__suffix {
        // display: none;
    }
}
</style>
