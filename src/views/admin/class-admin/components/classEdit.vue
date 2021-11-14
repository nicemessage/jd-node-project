<template>
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialog" custom-class="com-dialog" width="550px" :lock-scroll="true">
        <div style="padding: 30px;">
            <el-form :model="classParams" :rules="rules" label-width="110px" class="com-form edit-subject" ref="form">
                <el-form-item label="分类名称" prop="tagCateName">
                    <el-input
                        v-if="!isDetail"
                        class="com-input"
                        placeholder="可输入2~15个字符"
                        v-model="classParams.tagCateName"
                        maxlength="15"
                        show-word-limit
                        clearable
                    ></el-input>
                    <div v-else>{{classParams.tagCateName}}</div>
                </el-form-item>
                <el-form-item label="分类级别" prop="tagCateLevel">
                    <el-select v-if="!isDetail" v-model="classParams.tagCateLevel" class="com-select noSuffix" :disabled="true">
                        <el-option label="一级" :value="0"></el-option>
                        <el-option label="二级" :value="1"></el-option>
                        <el-option label="三级" :value="2"></el-option>
                    </el-select>
                    <div v-else>{{{0:'一级',1:'二级',2:'三级'}[classParams.tagCateLevel]}}</div>
                </el-form-item>
                <el-form-item label="分类类型" prop="tagCateType">
                    <!-- <el-select v-model="classParams.tagCateType" :disabled="isDetail || isChild" class="com-select" placeholder="请选择分类类型"> -->
                    <el-select
                        v-if="!isDetail"
                        v-model="classParams.tagCateType"
                        :disabled="dialogTitle !== '新增一级分类'"
                        class="com-select"
                        placeholder="请选择分类类型"
                    >
                        <el-option label="标签分类" :value="1"></el-option>
                        <el-option label="组合分类" :value="2"></el-option>
                    </el-select>
                    <div v-else>{{{1:'标签分类',2:'组合分类'}[classParams.tagCateType]}}</div>
                </el-form-item>
                <el-form-item label="父类名称" v-show="showP">
                    <el-input v-if="!isDetail" class="com-input" v-model="pName" disabled></el-input>
                    <div v-else>{{pName}}</div>
                </el-form-item>
                <el-form-item label="父类级别" v-show="showP">
                    <el-select v-if="!isDetail" v-model="pLevel" class="com-select noSuffix" :disabled="true">
                        <el-option label="一级" :value="0"></el-option>
                        <el-option label="二级" :value="1"></el-option>
                        <el-option label="三级" :value="2"></el-option>
                    </el-select>
                    <div v-else>{{{0:'一级',1:'二级',2:'三级'}[pLevel]}}</div>
                </el-form-item>
                <div v-if="isDetail">
                    <el-form-item label="创建人" :required="true">
                        <!-- <el-input class="com-input" v-model="classParams.creator" disabled></el-input> -->
                        <div>{{classParams.creator}}</div>
                    </el-form-item>
                    <el-form-item label="创建时间" :required="true">
                        <!-- <el-input class="com-input" v-model="classParams.createdTime" disabled></el-input> -->
                        <div>{{classParams.createdTime}}</div>
                    </el-form-item>
                    <el-form-item label="修改人" :required="true">
                        <!-- <el-input class="com-input" v-model="classParams.modifier" disabled></el-input> -->
                        <div>{{classParams.modifier}}</div>
                    </el-form-item>
                    <el-form-item label="修改时间" :required="true">
                        <!-- <el-input class="com-input" v-model="classParams.modifiedTime" disabled></el-input> -->
                        <div>{{classParams.modifiedTime}}</div>
                    </el-form-item>
                </div>
            </el-form>
            <footer v-if="!isDetail">
<!--                <el-button class="com-button" @click="cancel">取消</el-button>-->
                <el-button class="com-button" type="primary" @click="save" :loading="btnLoading">保存</el-button>
            </footer>
        </div>
    </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component({})
export default class EditSubject extends Vue {
    // private loading: boolean = false;
    @State(state => state.nameAndTime) nameAndTime: any;
    @State(state => state.btnLoading) btnLoading?: boolean;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;

    @Prop({ type: Boolean, default: false }) private isDetail?: boolean;
    @Prop({ type: String, default: '新增' }) private dialogTitle?: string;
    private editDialog: boolean = false;
    private showP: boolean = false;
    private isChild: boolean = false;
    private pName: string = '';
    private pLevel: string = '';
    private classParams: any = {
        id: '',
        pid: 0,
        subjectId: 0,
        tagCateIsLeaf: 1,
        tagCateLevel: 0,
        tagCateName: '',
        tagCateType: ''
    };
    @Watch('classParams.tagCateIsLeaf', { immediate: true, deep: true })
    private handler(val: any) {
        console.log('IsLeaf：', val);
    }
    private rules: any = {
        tagCateName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 15, message: '请输入2~15个字符', trigger: 'blur' }
        ],
        tagCateType: [{ required: true, message: '请选择分类类型', trigger: 'change' }],
        tagCateLevel: [{ required: true }]
    };
    public open(row: any): void {
        this.editDialog = true;
        this.isChild = false;
        this.$nextTick(() => {
            (this.$refs['form'] as any).resetFields();
            Object.assign(this.classParams, row);
            if ((this.dialogTitle as any).includes('一级')) {
                this.showP = false;
            } else {
                this.showP = true;
            }
            if (this.classParams.tagCateLevel !== 0) {
                this.isChild = true;
            }
            if ((this.dialogTitle as any).includes('新增')) {
                this.isChild = false;
                this.classParams.tagCateName = '';
                this.classParams.tagCateLevel = row.tagCateLevel + 1;
                if (this.classParams.tagCateLevel !== 0) {
                    // 为新增子级
                    this.classParams.pid = row.id;
                    this.classParams.id = '';
                    this.pName = row.tagCateName;
                    this.pLevel = row.tagCateLevel;
                    this.isChild = true;
                }
            }
        });
    }
    private cancel(): void {
        this.editDialog = false;
    }
    private save(): void {
        this.chagneBtnLoading(true);
        const form = this.$refs.form as any;
        this.classParams.subjectId = window.sessionStorage.getItem('subjectId');

        form.validate((valid: any) => {
            // console.log(this.classParams.pid);
            // return false;
            if (valid) {
                Object.assign(this.classParams, this.nameAndTime);
                console.log(this.classParams);
                if (this.classParams.id !== '') {
                    // id存在为修改
                    this.$api
                        .post('/api/admin/tagCategory/update', this.classParams)
                        .then((res: any) => {
                            this.editDialog = false;
                            this.$emit('closeDialog');
                            this.$message.success('修改成功');
                        })
                        .finally(() => {
                            this.chagneBtnLoading(false);
                        });
                } else {
                    // id不存在为新增
                    this.classParams.tagCateIsLeaf = 1;
                    this.$api
                        .post('/api/admin/tagCategory/add', this.classParams)
                        .then((res: any) => {
                            this.editDialog = false;
                            this.$emit('closeDialog');
                            this.$message.success('新增成功');
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
}
</script>
<style scoped lang="scss">
footer {
    text-align: center;
    margin-top: 36px;
}
/deep/ .el-select {
    width: 100%;
}
/deep/ .noSuffix {
    .el-input__suffix {
        display: none;
    }
}
</style>
