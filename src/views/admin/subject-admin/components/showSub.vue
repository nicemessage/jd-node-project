<template>
    <el-dialog
        :close-on-click-modal="false"
        title="查看主体"
        :visible.sync="editDialog"
        custom-class="com-dialog"
        width="700px"
        :lock-scroll="true"
    >
        <div style="padding: 30px;">
            <el-form :model="subjectParams" :rules="rules" label-width="150px" class="com-form edit-subject" ref="form">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="主体中文名称" prop="subjectCn">
                            <el-input class="com-input" v-model="subjectParams.subjectCn" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="主体英文名称" prop="subjectEn">
                            <el-input class="com-input" v-model="subjectParams.subjectEn" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="云存储群体桶" prop="jssCrowdBucket">
                            <el-input class="com-input" v-model="subjectParams.jssCrowdBucket" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="云存储标签桶" prop="jssTagBucket">
                            <el-input class="com-input" v-model="subjectParams.jssTagBucket" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="主体描述" prop="subjectDesc">
                            <el-input
                                class="com-input"
                                type="textarea"
                                :rows="5"
                                :resize="'none'"
                                v-model="subjectParams.subjectDesc"
                                maxlength="200"
                                disabled
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="创建人" :required="true">
                            <el-input class="com-input" v-model="subjectParams.creator" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="创建时间" :required="true">
                            <el-input class="com-input" v-model="subjectParams.createdTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="修改人" :required="true">
                            <el-input class="com-input" v-model="subjectParams.modifier" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="修改时间" :required="true">
                            <el-input class="com-input" v-model="subjectParams.modifiedTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
<!--            <footer>-->
<!--                <el-button class="com-button" @click="cancel">取消</el-button>-->
<!--            </footer>-->
        </div>
    </el-dialog>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ShowSub extends Vue {
    // private loading: boolean = false;
    private editDialog: boolean = false;
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
        jssTagBucketPath: ''
    };
    private rules: any = {
        subjectCn: [{ required: true, message: '请输入主体中文名称', trigger: 'blur' }],
        subjectEn: [{ required: true, message: '请输入主体英文名称', trigger: 'blur' }],
        subjectDesc: [{ required: true, message: '请输入主体描述', trigger: 'blur' }],
        idmappingId: [{ required: true, message: '请输入ID池名称', trigger: 'change' }],
        idmappingColumnId: [{ required: true, message: '请输入ID池类型', trigger: 'change' }],
        jssCrowdBucket: [{ required: true, message: '请输入云储存群体桶', trigger: 'blur' }],
        jssCrowdBucketPath: [{ required: true, message: '请输入云储存群体桶路径', trigger: 'blur' }],
        jssTagBucket: [{ required: true, message: '请输入云储存标签桶', trigger: 'blur' }],
        jssTagBucketPath: [{ required: true, message: '请输入云储存标签桶路径', trigger: 'blur' }]
    };
    public open(row?: any): void {
        this.editDialog = true;
        this.$nextTick(() => {
            (this.$refs['form'] as any).resetFields();
            console.log('row1:', row);
            this.subjectParams = JSON.parse(JSON.stringify(row));
        });
    }
    private cancel(): void {
        this.editDialog = false;
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
        display: none;
    }
}
</style>
