<template>
    <div class="file-info" v-loading="loading">
        <el-form :model="CrowdSourceVO" :rules="rules" ref="form">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="数据类型" prop="crowdDsType" label-width="120px" class="prop-lable">
                        <el-radio-group v-model="CrowdSourceVO.crowdDsType" :disabled="(updateFlag || uploadOver || fileAnalyse) && isCreated"
                                        @change="changeId">
                            <el-radio :label="item.id" v-for="item in idMappingList" :key="item.id">{{ item.dsColName
                                }}
                            </el-radio>
                        </el-radio-group>
                        <span v-if="!uploadAble" style="padding-left: 30px;color: #ccc;">请先选择数据类型</span>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="!isCreated">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="上传类型" prop="uploadMode" label-width="120px" class="prop-label">
                        <el-radio-group :disabled="fileAnalyse" v-model="CrowdSourceVO.uploadMode">
                            <el-radio label="1">覆盖</el-radio>
                            <el-radio label="2">追加</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="群体文件" prop="uploadFile" label-width="120px" class="prop-lable">
                        <el-tooltip class="item" effect="dark" :manual="!CrowdSourceVO.uploadFile.oldFileName" :content="CrowdSourceVO.uploadFile.oldFileName?CrowdSourceVO.uploadFile.oldFileName:''" placement="bottom">
                            <el-upload
                                    ref="upload"
                                    class="com-upload"
                                    action="/upload/ava/crowd/uploadFile"
                                    :with-credentials="true"
                                    :limit="1"
                                    :disabled="(!uploadAble || updateFlag) && isCreated"
                                    :multiple="false"
                                    accept=".csv,.txt"
                                    :before-upload="beforeUpload"
                                    :on-success="uploadSuccess"
                                    :on-remove="removeList"
                                    :file-list="fileList"
                            >
                                <el-button type="text" style="float: left;" v-if="!CrowdSourceVO.uploadFile.oldFileName" :disabled="(!uploadAble|| updateFlag) && isCreated">上传</el-button>
                            </el-upload>
                        </el-tooltip>
                        <span v-if="fileAnalyse" style="float: left;cursor: initial;">
                            <span style="padding-left: 20px;font-weight:500" v-if="CrowdSourceVO.uploadMode == '1'">文件内有效数量共计{{ activeNum }}个</span>
                            <span style="padding-left: 20px;font-weight:500" v-else>追加后的有效总数量共计{{ activeNum }}个</span>
                        </span>
                        <!--              <el-input v-model="CrowdSourceVO.uploadFile" ></el-input>-->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="" prop="dsCol" label-width="35px" class="prop-lable">
                        <span style="color: #888;font-size: 12px;line-height: 15px;" class="el-icon-info">
                            上传要求：
                            1、支持TXT，CSV格式，小于100M；
                            2、内容拆行分隔，一行一个ID；
                            3、文件编码必须为UTF-8格式；
                            4、文件名不能包含单双引号；
                        </span>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--                </div>-->
            <!--            </div>-->
        </el-form>
        <el-button
                style="position: absolute;right: 20px;top:14px;"
                type="primary"
                size="small"
                :disabled="!fileAnalyse"
                :class="!fileAnalyse?'download-add':''"
                icon="el-icon-download"
                @click="downInactivateData"
        >下载无效数据
        </el-button>
    </div>
</template>

<script lang="ts">
    /**
     * @name DbCrowdInfo
     * @author shileilei3
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {State} from "vuex-class";

    // mixin引入

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入

    // 公共类引入

    // 私有组件引入

    // 私有类引入

    // 本地定义和声明
    interface Subject {
        id: number;
        subjectCn: string;
        subjectEn: string;
        subjectDesc: string;
        subjectSort: number;
    }

    @Component({
        components: {}
    })
    export default class FileInfo extends Vue {
        @State(state => state.curSubject) curSubject!: Subject | null;

        @State(state => state.fileInfo) fileCache: any;
        @Prop() isCreated!:boolean;

        private timer: any = undefined;
        private idMappingList: any[] = [];
        private activeNum: number = 0;
        private uploadAble: boolean = false;
        private fileAnalyse: boolean = false;
        private analyseParam: any = undefined;
        private fileUploadTip: any = '未上传文件！';
        private fileUrl: any = '';
        private fileList: any[] = [];
        private oldFileName: any = '';
        private updateFlag: boolean = false;
        private modify: boolean = false;
        private downloadFile: boolean = true;
        private uploadOver: boolean = false;
        private queryFileName: any = '';
        private loading: boolean = false;
        private originFileUrl: string = "";

        private CrowdSourceVO: any = {
            crowdDsType: '',
            uploadFile: '',
            uploadMode: '1',
        };

        private rules: any = {
            crowdDsType: [{required: true, message: '请选择数据类型', trigger: 'change'}],
            uploadFile: [{required: true, message: '群体文件必须上传完成', trigger: 'change'}],
            uploadMode: [{required: true, message: '必须选择上传类型', trigger: 'change'}],
        };

        @Watch('CrowdSourceVO.crowdDsType')
        private crowdDsTypeChange() {
            if (this.CrowdSourceVO && this.CrowdSourceVO.crowdDsType) {
                this.uploadAble = true;
            } else {
                this.uploadAble = false;
            }
        }

        private fileExpression: any = {
            version: "5.0",
            fileUrl: "",
            fileFormat: "_CSV",
            targetDb: "",
            targetTb: "",
            targetPriCol: "",
            targetCol: "",
            style: "FILE"
        }

        private getFileInfo() {
            let check = false;
            (this.$refs.form as any).validate((item: any) => {
                check = item;
            });

            if (this.activeNum == 0 && !this.modify) {
                check = false;
                this.$message.error('文件内有效数据为0条，请重新上传群体文件!');
            }
            if (check) {
                // this.CrowdSourceVO.uploadFile.name = this.fileList[0].name;
                return this.genFile();
            }
        }

        private genFile() {
            this.$set(this.CrowdSourceVO.uploadFile, 'oldFileName', this.oldFileName);
            this.$set(this.CrowdSourceVO.uploadFile, 'crowdDsType', this.CrowdSourceVO.crowdDsType);
            this.$set(this.CrowdSourceVO.uploadFile, 'expression', this.analyseParam);
            this.$set(this.CrowdSourceVO.uploadFile, 'uploadMode', this.CrowdSourceVO.uploadMode);
            return this.CrowdSourceVO.uploadFile;
        }

        private checkForm() {
            (this.$refs.form as any).validate(() => {
                // console.log('item');
                //
            });
        }

        private init(code: string, crowdDsType: string) {
            this.initParam();
            this.$bus.$emit('main-loading', true);
            this.$api.get('/api/ava/sysIDMappingColumn/queryIdColList', {subjectId: this.curSubject?.id}).then((res: any) => {
                this.idMappingList = res;
                if (!this.CrowdSourceVO.crowdDsType) {
                    this.CrowdSourceVO.crowdDsType = this.idMappingList[0].id;
                }
                if (code && crowdDsType) {
                    this.modify = true;
                    this.updateFlag = true;
                    // console.log('item',this.CrowdSourceVO);
                    this.CrowdSourceVO.uploadFile = JSON.parse(code);
                    this.fileUrl = this.CrowdSourceVO.uploadFile.fileUrl;
                    this.CrowdSourceVO.crowdDsType = crowdDsType;
                    // 获取老文件路径和url
                    this.fileList.push({
                        name: this.CrowdSourceVO.uploadFile.name,
                        url: this.CrowdSourceVO.uploadFile.fileUrl
                    });
                    this.oldFileName = this.CrowdSourceVO.uploadFile.oldFileName;
                    this.originFileUrl = this.CrowdSourceVO.uploadFile.fileUrl;

                    this.fileUploadTip = '文件上传成功!';
                    const tmp = {code: 3000, data: this.CrowdSourceVO.uploadFile};
                    this.changeId(this.CrowdSourceVO.crowdDsType);
                    this.uploadSuccess(tmp);
                    this.updateFileInfo(true);
                } else {
                    // 没有code，说明是新建文件建群，不读取缓存
                    // 21-8-3，与产品樊超确认，文件建群不要缓存
                    // this.getFileCache();
                    this.$bus.$emit('main-loading', false);
                }

            });
        }

        private getFileCache() {
            const subjectId = this.curSubject?.id;
            if (!subjectId) {
                this.$bus.$emit('main-loading', false);
                return;
            }
            if (this.fileCache.hasOwnProperty(subjectId) && this.fileCache[subjectId]) {
                console.log("=================",this.fileCache[subjectId]);
                this.CrowdSourceVO.uploadFile = this.fileCache[subjectId];
                this.CrowdSourceVO.crowdDsType = this.CrowdSourceVO.uploadFile.crowdDsType;
                this.changeId(this.CrowdSourceVO.crowdDsType);
                this.fileList.push({
                    name: this.CrowdSourceVO.uploadFile.oldFileName,
                    url: this.CrowdSourceVO.uploadFile.fileUrl
                });
                this.oldFileName = this.CrowdSourceVO.uploadFile.oldFileName;
                this.fileUrl = this.CrowdSourceVO.uploadFile.fileUrl;
                if (this.fileList.length > 0) {
                    this.fileUploadTip = '文件上传成功!';
                    this.downloadFile = true;
                    this.fileAnalyse = true;
                    this.queryFileName = this.CrowdSourceVO.uploadFile.name;
                    const tmpExp = JSON.parse(JSON.stringify(this.fileExpression));
                    tmpExp.fileUrl = this.fileUrl;
                    this.analyseParam = JSON.stringify(tmpExp);
                    // this.updateFileInfo(false);
                    // this.analyseFile();
                    this.fileAnalyse = true;
                    this.analyseFile();
                    // this.$emit('setImage',this.activeNum)
                } else {
                    this.$bus.$emit('main-loading', false);
                }
                // const tmp  = {code:3000,data:this.CrowdSourceVO.uploadFile};
                // this.uploadSuccess(tmp);
            } else {
                this.$bus.$emit('main-loading', false);
            }
        }

        private updateFileInfo(isEmpty: any) {
            const subjectId = this.curSubject?.id;
            const payload = {
                subjectId: subjectId,
                portraitList: isEmpty ? "" : this.genFile()
            };
            // console.log("---------updateFileInfoupdateFileInfoupdateFileInfo",payload);
            this.$store.commit('setFileInfo', payload);
        }


        private initParam() {
            this.fileList = [];
            this.activeNum = 0;
            this.uploadAble = false;
            this.fileAnalyse = false;
            this.analyseParam = undefined;
            this.fileUploadTip = '未上传文件！';
            this.fileUrl = '';
            this.downloadFile = true;
            this.uploadOver = false;
            this.updateFlag = false;
        }

        private removeList() {
            this.analyseParam = undefined;
            this.CrowdSourceVO.uploadFile = '';
            this.fileAnalyse = false;
            this.fileUploadTip = '未上传文件！';
            this.fileUrl = '';
            this.downloadFile = false;
            this.uploadOver = false;
            this.updateFileInfo(true);
            this.$emit('setImage', -1)
        }

        private beforeUpload(file: any) {
            if (file.name.indexOf('\'') > 0 || file.name.indexOf('"') > 0 ||
                file.name.indexOf('”') > 0 || file.name.indexOf('’') > 0 || file.name.indexOf('“') > 0 || file.name.indexOf('‘') > 0
                || file.name.length > 50
            ) {
                this.$message.warning('文件名不可以包含中英文引号且不可以超过50字符!');
                return false;
            }

            const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
            const size = file.size / 1024 / 1024;
            if (extension != 'csv' && extension != 'txt') {
                this.$message.warning('只能上传后缀是.csv或.txt的文件!');
                return false;
            }
            if (size > 100) {
                this.$message.warning('文件大小不得超过100M!');
                return false;
            }

            if (!this.CrowdSourceVO.crowdDsType) {
                this.$message('请先选择文件ID类型');
                return false;
            }
            this.fileUploadTip = '文件上传中...';
            this.oldFileName = file.name;
        }

        private uploadSuccess(res: any) {
            this.uploadOver = true;
            if (res.code != 3000) {
                this.$message.error(res.msg);
                this.fileUploadTip = '文件上传失败';
                this.$bus.$emit('main-loading', false);
                return false;
            } else {
                this.CrowdSourceVO.uploadFile = res.data;
                this.checkForm();
                this.fileUploadTip = '文件上传成功!';
                this.fileUrl = res.data.fileUrl;
                this.queryFileName = res.data.name;
                // this.expression = JSON.stringify(this.fileExpression);
                this.changeId(this.CrowdSourceVO.crowdDsType);

                const tmpExp = JSON.parse(JSON.stringify(this.fileExpression));
                tmpExp.fileUrl = this.fileUrl;
                tmpExp.uploadMode = this.CrowdSourceVO.uploadMode;
                tmpExp.originFileUrl = this.originFileUrl;
                this.analyseParam = JSON.stringify(tmpExp);
                // console.log("++++++++++++++++",tmpExp)
                // console.log("++++++++++++++++------------------",this.activeNum)
                this.updateFileInfo(false);
                this.analyseFile();

            }
            this.downloadFile = true;
        }

        private changeId(val: any) {
            let idBean: any = '';
            this.idMappingList.forEach((item: any) => {
                if (item.id == val) {
                    idBean = item;
                }
            })
            console.log(idBean);
            this.fileExpression.targetDb = idBean.targetDb;
            this.fileExpression.targetTb = idBean.targetTb;
            this.fileExpression.targetPriCol = idBean.sourceColOffset;
            this.fileExpression.targetCol = idBean.dsCol;
        }

        private analyseFile() {
            this.$bus.$emit('main-loading', true);
            this.$api.post('/api/ava/crowd/file/analyse', {
                expression: this.analyseParam,
                fileName: this.queryFileName
            }).then((res: any) => {
                this.activeNum = res;
                this.fileAnalyse = true;
                this.$emit('setImage', this.activeNum);
                this.$bus.$emit('main-loading', false);
            }).catch(err => {
                this.$bus.$emit('main-loading', false);
            });
        }

        private getCrowdDefineDesc() {
            return JSON.parse(this.analyseParam);
        }

        private downInactivateData() {
            if (!this.downloadFile) {
                return;
            }
            this.$api.post('/api/ava/crowd/file/download', {
                expression: this.analyseParam,
                fileName: this.queryFileName
            }).then((res: any) => {
                if (res || res == null) {
                    if (res && res.indexOf('http:') >= 0) {
                        const a = document.createElement('a');
                        a.href = res;
                        a.click();
                    } else {
                        this.$message.warning("没有无效数据！");
                    }
                } else if (this.downloadFile) {
                    setTimeout(this.downInactivateData, 1000);
                }
            });
        }

        private beforeDestroy() {
            this.downloadFile = false;
        }
    }
</script>

<style lang="scss" scoped>
.file-info {
    width: 100%;
    height: 100%;
    line-height: 40px;
    /deep/.el-form-item__error {
        top: 70%;
    }
    .download-add {
        color: #aaa;
        background: #fff;
        border: 1px solid #aaa;
    }
    .enum-ipt {
        display: flex;
        align-items: center;
        position: relative;

        .add-btn {
            /*position: absolute;*/
            /*left: calc(100% + 10px);*/
            margin-left: 10px;
        }
    }

    .tag-list {
        margin-top: 10px;

        .enum-item {
            margin: 0 10px 10px 0;
            max-width: 100px;
        }
    }

    .com-width {
        width: 60%;
    }

    .prop-lable {
        font-size: 14px;
        font-weight: normal;
        color: #666;
    }

    .com-button {
        /*height: 20px;*/
        /*border-bottom: ;*/
        height: 30px;
        margin-top: 5px;
        border: 1px solid rgba(57, 107, 246, 1);
    }

    .tip-text {
        p {
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;

            &.pdl {
                padding-left: 14px;
            }
        }
    }

    .format-tip {
        padding-top: 0px;
        margin-top: -40px;
        margin-left: 150px;
    }

    .com-upload /deep/ {
        float: left;
        display: flex;
        .el-upload {
            float: left;
        }
    }

    .title {
        height: 100%;
        line-height: 22px;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: rgba(0, 0, 0, 1);
    }

    .title .text {
        display: flex;
        align-items: center;
    }

    .line {
        width: 5px;
        height: 15px;
        background: #396bf6;
        margin-right: 10px;
    }

    /deep/ .el-upload-list__item-name {
        line-height: 17px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        font-weight: 500;
        margin-bottom: -10px;
    }

    /deep/ .el-upload-list__item {
        color: #333;
        background: #f9f9f9;
    }

    /deep/ .el-upload-list__item .el-progress {
        margin-top: -7px;
    }

    /deep/ .el-progress__text {
        line-height: 17px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        font-weight: 500;
    }

    /deep/ .el-upload-list {
        padding-top: 2px;
        margin-left: 0;
        width: 200px;
        float: left;
        &__item-status-label {
            top: -5px;
        }
        .el-icon-close {
            top: 1px;
        }
    }

    /deep/ .el-form-item__label {
        color: rgba(51, 51, 51, 1);
        font-family: PingFangSC-Medium;
    }

    .el-radio-group {
        padding-left: 20px;
    }

    /deep/ .com-upload {
        padding-left: 20px;
    }

    /deep/ .el-form-item__error {
        margin-left: 20px;
    }
    /deep/ .el-form-item {
        margin-bottom: 0;
    }
}
</style>
