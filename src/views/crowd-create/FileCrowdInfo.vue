<template>
    <div clase="parent-div">
        <div class="db-crowd-info">
            <el-form :model="CrowdCustomVO">
                <div class="pargraph">
                    <div class="title">
                        <div class="text"><span class="line"></span><span>导入文件</span></div>
                        <div>
                            <file-info ref="fileInfo" :isCreated="isCreated" @setImage="setImage"></file-info>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>

        <div class="image-info">
            <PortraitPreview ref="portrait-preview" :crowdNum="crowdNum"></PortraitPreview>
        </div>
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
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    // 私有类引入
    import FileInfo from './FileInfo.vue';
    import PortraitPreview from './PortraitPreviewForFile.vue';


    // mixin引入

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入

    // 公共类引入

    // 私有组件引入

    // 本地定义和声明
    interface CrowdCustomVO {
        crowdDesc: string;
        crowdDsType: string;
        crowdManager: string;
        crowdName: string;
        crowdType: number;
        subjectId: number;
        crowdCode: string;
        crowdDefineDesc: string;
        uploadVO: {
            bucket: string;
            fileUrl: string;
            md5: string;
            name: string;
            type: string;
        };
    }

    interface Subject {
        id: number;
        subjectCn: string;
        subjectEn: string;
        subjectDesc: string;
        subjectSort: number;
    }

    @Component({
        components: {
            FileInfo,
            PortraitPreview
        }
    })
    export default class FileCrowdInfo extends Vue {
        @State(state => state.curSubject) curSubject!: Subject | null;

        private code: string = '';
        private crowdNum: number = -1;
        @Prop()
        private crowdData!: string;

        private CrowdCustomVO: any = {};
        private isCreated: boolean = true;

        private init(code: string) {
            // this.code = code;
            // if(this.code){
            //     this.$api.
            //     get('/api/ava/crowd/detail', {"crowdCode":this.code}).
            //     then((res: any) => {
            //         this.CrowdCustomVO = res;
            //         this.resetForm();
            //         (this.$refs['crowdInfo'] as any).init(this.CrowdCustomVO);
            //         (this.$refs['portrait-preview'] as any).reset();
            //     });
            // }else{
            //     this.resetForm();
            // }
        }

        private updateFileInfo() {
            (this.$refs['fileInfo'] as any).updateFileInfo(true);
        }

        private resetForm(crowdDefineDesc: any, crowdDsType: any) {
            // (this.$refs['crowdInfo'] as any).$refs.form.resetFields();
            (this.$refs['fileInfo'] as any).$refs.form.resetFields();
            (this.$refs['fileInfo'] as any).init(crowdDefineDesc, crowdDsType);
            //修改的额时候，重置画像模板
            // console.log(crowdDefineDesc,crowdDsType);
            // if (crowdDefineDesc && crowdDsType) {
            //     (this.$refs['portrait-preview'] as any).searchTemplate();
            // } else {
            //     this.crowdNum = -1;
            // }

        }

        created() {
            this.isCreated = this.crowdData == null?true:false;
        }

        private getFileCrowdInfo() {
            const crowdParam = (this.$refs['fileInfo'] as any).getFileInfo();
            return crowdParam;
        }

        // private saveCrowd() {
        //     const crowdParam = (this.$refs['crowdInfo'] as any).getCrowdInfo();
        //     const fileParam = (this.$refs['fileInfo'] as any).getFileInfo();
        //     if (fileParam && crowdParam) {
        //
        //         Object.assign(this.CrowdCustomVO, crowdParam);
        //
        //         this.CrowdCustomVO.uploadVO = fileParam;
        //         const str = JSON.stringify(fileParam);
        //         this.CrowdCustomVO.crowdDefineDesc = str;
        //         this.CrowdCustomVO.crowdDefine = fileParam.expression||this.CrowdCustomVO.crowdDefine ;
        //         this.CrowdCustomVO.crowdDsType = fileParam.crowdDsType;
        //         this.CrowdCustomVO.crowdType = 2;
        //         this.CrowdCustomVO.subjectId = this.curSubject?.id;
        //
        //         if(this.code){
        //             this.CrowdCustomVO.crowdCode = this.code;
        //         }
        //         const msg = this.code?"更新成功":"文件建群成功";
        //
        //         this.$api.post('/api/ava/crowd/addOrUpdate/file', this.CrowdCustomVO).then(() => {
        //             this.goToList();
        //             this.$message({
        //                 type: 'success',
        //                 message: msg,
        //                 duration: 1000,
        //                 onClose: () => {
        //                     // this.goToList();
        //                 }
        //             });
        //         });
        //     }
        // }

        private cancel() {
            this.goToList();
        }

        private getCrowdDefine() {
            const crowdDefine = (this.$refs['fileInfo'] as any).getCrowdDefineDesc();
            // console.log("---------------",crowdDefine)
            return crowdDefine;
        }

        private setImage(activeNum: number) {
            this.crowdNum = activeNum;
        }

        private goToList() {
            this.$router.push({
                path: '/crowd-manage'
            });
        }
    }
</script>
<style lang="scss" scoped>
    .parent-div {
        width: 100%;
        background: #fff;
        overflow: auto;
    }

    .db-crowd-info {
        background: #ffffff;
        position: relative;
        .pargraph{
            padding-bottom: 10px;
        }
        .pargraph > .title {
            height: 100%;
            line-height: 22px;
            font-size: 14px;
            color: #333;
        }

        .pargraph .title .text {
            display: flex;
            align-items: center;
            padding: 20px 30px;
        }

        .line {
            width: 3px;
            height: 13px;
            background: #396bf6;
            margin-right: 10px;
        }
    }

    .image-info {
        border-top: 1px dashed #E5E9EC;
        background: #ffffff;
        position: relative;
        padding: 0 15px;
    }

    .footer {
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }
</style>
