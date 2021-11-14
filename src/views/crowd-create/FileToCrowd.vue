<template>
    <div class="tag-to-crowd">


        <div class="body">
            <FileCrowdInfo ref="fileCrowdInfo" :crowdData="crowdData"></FileCrowdInfo>
        </div>
        <div class="footer">
            <div class="search-tag-btn">
                <el-button size="small" type="primary" @click="showCreateCrowd">保存群体</el-button>
            </div>
        </div>
      <el-dialog :close-on-click-modal="false"  :append-to-body="true" :visible.sync="showCreateNewCrowdDialog" width="800px">
        <div slot="title" class="dialog-title">保存群体</div>
        <div class="save-dia">
          <crowd-info ref="crowdInfo"></crowd-info>
        </div>

        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showCreateNewCrowdDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveCrowd">确 定</el-button>
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
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { State } from 'vuex-class';
// 公共类引入
import SysSubject from '@/components/SysSubject.vue';
// 私有类引入
import FileCrowdInfo from './FileCrowdInfo.vue';
import CrowdInfo from './CrowdInfo.vue';

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
        FileCrowdInfo,
        CrowdInfo
    }
})
export default class FileToCrowd extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;

    private showCreateNewCrowdDialog : boolean = false;

    private showChart : boolean = false;

    @Watch('curSubject')
    private subjectChange() {
        this.init();
    }

    private CrowdCustomVO: any = {};
    private fileParam: any = {};
    private code: any = '';
    @Prop()
    private crowdData!: string;

    private showCreateCrowd(){
        const fileParam = (this.$refs['fileCrowdInfo'] as any).getFileCrowdInfo();
        this.fileParam = fileParam;

        if(fileParam){
            this.showCreateNewCrowdDialog = true;
            setTimeout(this.initCrowdInfo, 500);
        }else{
            // this.$message({
            //     type: 'warning',
            //     message: "请选好群体文件！",
            //     duration: 1000,
            //     onClose: () => {
            //         // this.goToList();
            //     }
            // });
        }
    }

    private goToList(type:any) {
        if(type === '1'){
            this.$bus.$emit('HideToCrowd');
            return false;
        }
        this.$bus.$emit('HideToCrowd',true);
        this.$message({
            message: '群体保存成功！预计加工时间30s-5min，有效后才能在“群体应用”中选择到该群体~',
            type: 'success'
        });
    }

    private initCrowdInfo(){
        if(this.CrowdCustomVO && this.CrowdCustomVO.crowdManager){
            (this.$refs['crowdInfo'] as any).init(this.CrowdCustomVO);
        }
    }

    private saveCrowd() {
        const crowdParam = (this.$refs['crowdInfo'] as any).getCrowdInfo();

        if (crowdParam) {
            crowdParam.crowdManager = crowdParam.crowdManagerList.join(",");
            crowdParam.adminUser = crowdParam.crowdManagerList.join(",");
            Object.assign(this.CrowdCustomVO, crowdParam);

            this.CrowdCustomVO.uploadVO = this.fileParam;
            const str = JSON.stringify(this.fileParam);
            this.CrowdCustomVO.crowdDefineDesc = str;
            this.CrowdCustomVO.crowdDefine = this.fileParam.expression||this.CrowdCustomVO.crowdDefine ;
            this.CrowdCustomVO.crowdDsType = this.fileParam.crowdDsType;
            this.CrowdCustomVO.uploadMode = this.fileParam.uploadMode;
            this.CrowdCustomVO.crowdType = 2;
            this.CrowdCustomVO.subjectId = this.curSubject?.id;


            if(this.code){
                this.CrowdCustomVO.crowdCode = this.code;
            }
            const msg = this.code?"更新成功":"文件建群成功";
            this.$bus.$emit('main-loading',true);
            this.$api.post('/api/ava/crowd/addOrUpdate/file', this.CrowdCustomVO).then(() => {
                this.$bus.$emit('main-loading',false);
                (this.$refs['fileCrowdInfo'] as any).updateFileInfo();
                this.goToList();
            }).catch(err => {
                // this.$message('群体保存失败！请联系用户画像进行处理~');
                this.$bus.$emit('main-loading',false);
            });
        }
    }

    private mounted() {
        this.init();
    }
    // private goToList() {
    //     this.$router.push({
    //         path: '/crowd-manage'
    //     });
    // }
    private init() {
        if(this.crowdData){
            this.code = this.crowdData.crowdCode;
        }else{
            this.code = null;
        }


        // (this.$refs['fileCrowdInfo'] as any).init(this.$route.query.code);
        this.initCrowd();
    }

    private initCrowd() {
        if(this.crowdData){
            this.code = this.crowdData.crowdCode;
        }else{
            this.code = null;
        }
        if(this.code){
            // this.loading = true;
            this.$bus.$emit('main-loading',true);
            this.$api.get('/api/ava/crowd/detail', {"crowdCode":this.code}).then((res: any) => {
                const crowdDefineDesc:any = JSON.parse(res.crowdDefineDesc);
                const name:string = crowdDefineDesc.name;
                this.$api.get('/api/ava/portrait/url', {"fileName":name}).then((res1: any) => {
                    this.$bus.$emit('main-loading',false);
                    crowdDefineDesc.fileUrl = res1;
                    res.crowdDefineDesc = JSON.stringify(crowdDefineDesc);
                    this.CrowdCustomVO = res;
                    this.showChart = true;
                    (this.$refs['fileCrowdInfo'] as any).resetForm(this.CrowdCustomVO.crowdDefineDesc,this.CrowdCustomVO.crowdDsType);

                });
            });
        }else{
            this.showChart = true;
            (this.$refs['fileCrowdInfo'] as any).resetForm(null,null);
        }
        // (this.$refs['crowdInfo'] as any).init(this.CrowdCustomVO);

    }
}
</script>
<style lang="scss" scoped>
.tag-to-crowd {
    width: 100%;
    height: 100%;
    background-color: #f9fafd;
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
    .save-dia{
      width: 90%;
    }
    .body {
        width: 100%;
        height: calc(100% - 70px);
        margin-top: 4px;
        padding:10px 20px;
        overflow: auto;

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
    /deep/ .el-form-item__label {
        color: rgba(51, 51, 51, 1);
    }
    /deep/ .el-tabs__nav {
      height: 64px;
    }
}
</style>
