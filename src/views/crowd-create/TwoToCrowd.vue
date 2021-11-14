<template>
    <div class="tag-to-crowd">
        <div class="body">
            <TwoCrowdInfo ref="twoCrowd"></TwoCrowdInfo>
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
     * @name DbToCrowd
     * @author shileilei3
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { State } from 'vuex-class';
    // 公共类引入
    import SysSubject from '@/components/SysSubject.vue';
    import SearchErp from '@/components/SearchErp.vue';
    // 私有类引入
    import TwoCrowdInfo from './TwoCrowdInfo.vue';

    // mixin引入

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入

    // 私有组件引入

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
            TwoCrowdInfo,
            SearchErp
        }
    })
    export default class TwoToCrowd extends Vue {
        @State(state => state.curSubject) curSubject!: Subject | null;
        @Watch('curSubject')
        private subjectChange() {
            // this.init();
        }

        private showCreateNewCrowdDialog: boolean = false;

        private newCrowd: any = {
            crowdDefine: null,
            crowdDefineDesc: null,
            crowdName: null,
            crowdDesc: null,
            crowdManager: null,
            crowdPredNum: -1,
            crowdManagerList:[]
        };

        private addNewRules: any = {
            crowdName: [{ required: true, message: '请填写群体名称', trigger: 'blur' }],
            crowdDesc: [
                { required: true, message: '请填写群体描述', trigger: 'blur' },
                { min: 3, max: 200, message: '长度在 3 到 20 个字符', trigger: 'blur' }
            ],
            crowdManagerList: [{ required: true, message: '请填写群体负责人', trigger: 'blur' }]
        };

        private selectTagList: any[] = [];

        private crowdNum: number = -1;

        private mounted() {
            // return setTimeout(this.init, 500);
            this.newCrowd.crowdManagerList = [window.sessionStorage.getItem("userErp")];
        }

        private init() {
            // (this.$refs['dbCrowd'] as any).init(this.$route.query.code);
        }

        private showCreateCrowd() {
            const obj:any = this.getCrowdDefineDesc();
            if(!obj.crowdCode){
                console.log(obj);
                this.$message.warning('当前群体为空，请选择群体');
                return false;
            }
            if(!this.getCrowdDefine()){
                return false;
            }
            this.showCreateNewCrowdDialog = true;
        }

        private saveCrowd() {
            (this.$refs.saveCrowd as any).validate((item: any) => {
                if (item) {
                    Object.assign(this.newCrowd, {
                        crowdDefine: JSON.stringify(this.getCrowdDefine()),
                        crowdDefineDesc: JSON.stringify(this.getCrowdDefineDesc()),
                        crowdPredNum: 0,
                        crowdManager: this.newCrowd.crowdManagerList.join(","),
                    });
                    const data = {
                        crowdDefine: JSON.stringify(this.getCrowdDefine()),
                        crowdDefineDesc: JSON.stringify(this.getCrowdDefineDesc()),
                        crowdPredNum: 0,
                        subjectId: this.curSubject?.id,
                        crowdType: 5,
                        crowdDsType: 11
                    };
                    Object.assign(data, this.newCrowd);
                    this.$bus.$emit('main-loading',true);
                    this.$api
                        .post('/api/ava/crowd/add/tag', data)
                        .then(res => {
                            this.$bus.$emit('main-loading',false);
                            this.showCreateNewCrowdDialog = false;
                            this.$message({
                                message: '群体保存成功！预计加工时间30s-5min，有效后才能在“群体应用”中选择到该群体~',
                                type: 'success'
                            });
                            const subjectId = this.curSubject?.id;
                            const payload = {
                                subjectId: subjectId,
                                expression: [],
                                logic: [],
                                logicCrowd: "_AND",
                                crowd: {},
                                valueType: '1'
                            };
                            this.$store.commit('setExpressionTwo', payload);
                            this.$bus.$emit('HideToCrowd',true);
                        })
                        .catch(err => {
                            // this.$message('群体保存失败！请联系用户画像进行处理~');
                            this.$bus.$emit('main-loading',false);
                        });
                }
            });
        }

        private getCrowdDefineDesc() {
            const exp = (this.$refs['twoCrowd'] as any).getExpression();
            return exp;
        }

        private getCrowdDefine() {
            const exp = (this.$refs['twoCrowd'] as any).buildCrowdExp();
            return exp;
        }
    }
</script>
<style lang="scss" scoped>
    .tag-to-crowd {
        width: 100%;
        height: 100%;
        position: relative;
        /*overflow: hidden;*/
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
            width: 100%;
            height: calc(100% - 70px);
            padding: 0;
            overflow-y: auto;
            margin-top: 5px;
            border-top: 1px solid #eee;

            .tag-select-list {
                flex: 0 0 auto;
                width: 250px;
                height: 100%;
                background-color: #fff;
            }
            .expression {
                flex: 0 0 auto;
                width: 550px;
                height: 100%;
                background-color: #fff;
            }
            .portrait-preview {
                flex: 0 0 auto;
                width: 500px;
                height: 100%;
                background-color: #fff;
            }
        }
        /deep/ .el-tabs__nav {
            height: 64px;
        }
    }
</style>
