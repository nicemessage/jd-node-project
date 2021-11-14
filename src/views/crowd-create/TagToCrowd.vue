<template>
    <div class="tag-to-crowd" v-loading="loading">
        <div class="body">
            <div class="half-container">
                <div class="quarter-container col1">
                    <SelectTag ref="select-tag" :crowdData="crowdData"></SelectTag>
                </div>
                <div class="quarter-container col2">
                    <Expression ref="expression" :crowdData="crowdData" :crowdNum.sync="crowdNum"></Expression>
                </div>
                <div class="quarter-container col3">
                    <PortraitPreview ref="portrait-preview" :crowdNum="crowdNum"></PortraitPreview>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="search-tag-btn">
                <el-button size="small" type="primary" @click="showCreateCrowd">保存群体</el-button>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showCreateNewCrowdDialog" width="600px" :append-to-body="true">
            <div slot="title" class="dialog-title">保存群体</div>
            <div style="padding: 30px;">
                <el-form :model="newCrowd" :rules="addNewRules" ref="saveCrowd" label-width="100px">
                    <el-form-item label="群体名称" prop="crowdName">
                        <el-input size="small" v-model="newCrowd.crowdName"></el-input>
                    </el-form-item>
                    <el-form-item label="群体负责人" prop="crowdManagerList">
                        <SearchErp :value.sync="newCrowd.crowdManagerList" multiple></SearchErp>
                    </el-form-item>
                    <el-form-item label="群体数量">
                        <span class="crowd-num">{{ newCrowd.crowdPredNum === null ? '' : newCrowd.crowdPredNum.toLocaleString() }}</span>
                    </el-form-item>
                    <el-form-item label="群体描述" prop="crowdDesc">
                        <el-input size="small" type="textarea" :rows="3" maxlength="200" minlength="3" v-model="newCrowd.crowdDesc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showCreateNewCrowdDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveCrowd">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/**
 * @name TagToCrowd
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import {Component, Prop, Vue} from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共类引入
import SysSubject from '@/components/SysSubject.vue';
import SearchErp from '@/components/SearchErp.vue';

// 私有组件引入

// 私有类引入
import SelectTag from './SelectTag.vue';
import Expression from './Expression.vue';
import PortraitPreview from './PortraitPreview.vue';

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
        SelectTag,
        Expression,
        PortraitPreview,
        SearchErp
    }
})
export default class TagToCrowd extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;

    @Prop()
    private crowdData!: string;

    private btnLoading: boolean = false;

    private crowdNum: number = -1;

    private showCreateNewCrowdDialog: boolean = false;

    private newCrowd: any = {
        crowdDefine: null,
        crowdDefineDesc: null,
        crowdName: null,
        crowdDesc: null,
        crowdManager: '',
        crowdManagerList:[],
        crowdPredNum: -1
    };

    private addNewRules: any = {
        crowdName: [{ required: true, message: '请填写群体名称', trigger: 'blur' }],
        crowdDesc: [
            { required: true, message: '请填写群体描述', trigger: 'blur' },
            { min: 3, max: 200, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        crowdManagerList: [{ required: true, message: '请填写群体负责人', trigger: 'blur' }]
    };

    get crowdCode() {
        if(this.crowdData){
            return this.crowdData.crowdCode
        }
        return null;
    }

    private loading:boolean = false;

    private mounted() {
        this.init();
        if(!this.crowdCode){
            this.newCrowd.crowdManagerList = [window.sessionStorage.getItem("userErp")];
        }
    }

    private init() {
        if (this.crowdCode) {
            this.getCrowdDetail(this.crowdCode as string).then((res: any) => {
                Object.assign(this.newCrowd, res);
                this.newCrowd.crowdManagerList = this.newCrowd.crowdManager.split(",");
                delete this.newCrowd.modifiedTime;
                delete this.newCrowd.createdTime;
                (this.$refs['expression'] as any).setExpression(JSON.parse(res.crowdDefineDesc));
                // (this.$refs['portrait-preview'] as any).reset();
                this.$nextTick(() => {
                    this.crowdNum = res.crowdPredNum;
                });
            });
        }
    }

    private getCrowdDefineDesc() {
        const exp = (this.$refs['expression'] as any).getExpression();
        return exp;
    }

    private getCrowdDefine() {
        if (this.crowdNum < 0) {
            this.$message.warning('请先确认逻辑组合');
            return;
        }
        const exp = (this.$refs['expression'] as any).buildCrowdExp();
        return exp;
    }

    private showCreateCrowd() {
        if (this.crowdNum < 0) {
            this.$message.warning('请先确认逻辑组合');
            return;
        }
        if (this.newCrowd.id) {
            this.resetNewCrowd(true);
        } else {
            this.resetNewCrowd();
        }
        this.showCreateNewCrowdDialog = true;
    }

    private resetNewCrowd(isNew = false) {
        if(!this.getCrowdDefine()){
            return false;
        }
        if (isNew) {
            Object.assign(this.newCrowd, {
                crowdDefine: JSON.stringify(this.getCrowdDefine()),
                crowdDefineDesc: JSON.stringify(this.getCrowdDefineDesc()),
                crowdPredNum: this.crowdNum
            });
        } else {
            Object.assign(this.newCrowd, {
                crowdDefine: JSON.stringify(this.getCrowdDefine()),
                crowdDefineDesc: JSON.stringify(this.getCrowdDefineDesc()),
                crowdName: null,
                crowdDesc: null,
                crowdManager: null,
                crowdPredNum: this.crowdNum
            });
        }
    }

    private resetAll() {
        this.resetNewCrowd();
        this.crowdNum = -1;
        (this.$refs['expression'] as any).setExpression({
            expression: [
                {
                    tag: [],
                    logic: []
                }
            ],
            logic: []
        });
        // (this.$refs['portrait-preview'] as any).reset();
    }

    private saveCrowd() {
        (this.$refs.saveCrowd as any).validate((item: any) => {
            this.$bus.$emit('main-loading',true);
            if (item) {
                this.newCrowd.crowdManager = this.newCrowd.crowdManagerList.join(",");
                if (this.newCrowd.id) {
                    this.crowdUpdateTag(this.newCrowd).then(() => {
                        this.$bus.$emit('main-loading',false);
                        this.showCreateNewCrowdDialog = false;
                        // this.$message.success('更新成功');
                        this.resetAll();
                        this.backToCM();
                    }).catch(err => {
                        this.$bus.$emit('main-loading',false);
                    });
                } else {
                    this.crowdAddTag(this.newCrowd).then(() => {
                        this.$bus.$emit('main-loading',false);
                        this.showCreateNewCrowdDialog = false;
                        // this.$message.success('保存成功');
                        this.resetAll();
                        this.backToCM();
                    }).catch(err => {
                        this.$bus.$emit('main-loading',false);
                    });
                }
            } else {
                this.$bus.$emit('main-loading',false);
            }
        });
    }

    private backToCM(type?:any) {
        if (type == '1') {
            this.$bus.$emit('HideToCrowd');
            return false;
        }
        this.$bus.$emit('HideToCrowd',true);
        this.$message({
            message: '群体保存成功！预计加工时间30s-5min，有效后才能在“群体应用”中选择到该群体~',
            type: 'success'
        });
        // this.$router.push({
        //     name: 'crowd-manage'
        // });
    }

    // ========== ajax request  ==========

    private crowdAddTag(newCrowd: any) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/add/tag';
            const data = {
                subjectId: this.curSubject?.id,
                crowdType: 1,
                crowdDsType: 11
            };
            Object.assign(data, newCrowd);
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
    private crowdUpdateTag(newCrowd: any) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/update/tag';
            const data = newCrowd;
            Object.assign(data, newCrowd);
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

    private getCrowdDetail(crowdCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/detail';
            const data = {
                crowdCode: crowdCode
            };
            this.$api
                .get(url, data)
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
.tag-to-crowd {
    width: 100%;
    height: 100%;
    /*background-color: #f9fafd;*/
    position: relative;
    overflow: hidden;

    .footer {
        width: 100%;
        height: 60px;
        border-top: 1px solid #eee;
        padding:0 15px;
        line-height: 60px;
        .search-tag-btn {
            width: 100%;
            text-align: right;
        }
    }
    .body {
        height: calc(100% - 60px);
        box-sizing: content-box;
        overflow:auto;
        background-color: #fff;
        border-top: 1px solid #eee;
        .half-container{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-bottom: 1px dashed #DEE3EB;
            display: flex;

            &:last-child{
                border-bottom: 0;
            }

            .quarter-container{
                height: 100%;
                box-sizing: border-box;

                &.col1{
                    min-width: 300px;
                    width: 25%;
                    flex: 0 0 auto;;
                    border-right: 1px solid #EAF0F9;
                }
                &.col2{
                    min-width: 420px;
                    width: 48%;
                    flex: 1 1 auto;
                    border-right: 1px solid #EAF0F9;
                }
                &.col3{
                    min-width: 320px;
                    width: 27%;
                    flex: 1 1 auto;
                }
            }
        }

        .spacer {
            width: 20px;
            flex: 0 0 auto;
        }
    }
    .crowd-num{
        color: #396bf6;
        font-weight: bold;
    }
}
</style>
