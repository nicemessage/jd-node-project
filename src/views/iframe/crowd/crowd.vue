<template>
    <div class="box">
        <div v-if="haveToken" class="iframe-subject">
            <el-tabs v-model="activeName">
                <el-tab-pane label="新系统" name="newSys" class="tabPane">
                </el-tab-pane>
                <el-tab-pane label="老系统" name="oldSys" v-if="data.isOld == 1" class="tabPane">
                </el-tab-pane>
            </el-tabs>
            <div class="header" v-if="activeName === 'newSys'" v-show="!subjectHide">
                <SysSubject> </SysSubject>
            </div>
            <CrowdPage :query="data" :tab="activeName"></CrowdPage>
            <!-- <div>
            </div> -->
        </div>
        <div v-else>
            地址栏未解析到token
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入
import { PageMixin } from '@/mixins/pageMixin';

// 第三方库引入
import moment from 'moment';

// 静态配置引入

// 公共组件引入
import NoData from '@/components/NoDataIcon.vue';

// 公共类引入
import SysSubject from '@/components/SysSubject.vue';

// 私有组件引入
import CrowdPage from './components/crowdPage.vue';

// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}
interface BtnObj {
    name: string;
    linke: string;
    openType: string;
}
interface DiyData {
    token: string;
    loginUser: string;
    isOld: number | string;
    listType: number | string;
    clickName: string;
    btnArr: any;
}
@Component({
    components: {
        SysSubject,
        CrowdPage
    }
})
export default class Crowd extends Mixins(PageMixin) {
    @State(state => state.curSubject) curSubject!: Subject | null;
    private activeName: string = 'newSys';
    private subjectHide: any = false;
    private data: DiyData = {
        token: '',
        loginUser: '',
        isOld: 1,
        listType: 1,
        clickName: '',
        btnArr: []
    };
    private haveToken: boolean = true;
    private tabClick(tab: string) {
        console.log(tab);
    }

    private mounted() {
        if(this.$route.query.subjectHide == 'true'){
            this.subjectHide = true;
        }
        this.init();
    }
    private init() {
        const query = this.$route.query;
        Object.assign(this.data, query);
        console.log(this.data);

        if (!this.data.token || this.data.token === '') {
            console.log(this.haveToken);
            this.haveToken = false;
        }
        if (query.btnArr) {
            console.log('btnArr1:');
            const str = this.data.btnArr.toString();
            this.data.btnArr = JSON.parse(str);
            console.log('btnArr2:', this.data.btnArr);
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
}
.box {
    width: 100%;
    height: 100%;
    background-color: #f5f6f9;
    position: relative;
    padding: 0;
    .iframe-subject {
        // width: 100%; background: #fff;
        overflow: hidden;
        height: 100%;
        width: 100%;
        // line-height: 64px;
        // box-shadow: 0px 2px 4px 0px rgba(170, 170, 170, 0.5);
        // padding: 0px 40px;
        font-size: 1rem;
        font-weight: bold;
        /deep/.el-tabs__header {
            box-shadow: 0px 7px 7px -7px #ccc;
            margin-bottom: 0;
            background: #fff;
        }
        /deep/ .el-tabs__nav {
            padding-left: 20px;
        }
        /deep/ .el-tabs__active-bar {
            left: 20px;
        }
        /deep/ .el-tabs__nav-wrap::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 4px;
            background-color: white !important;
            z-index: 1;
        }
        /deep/ .el-tabs__item {
            width: 75px;
            padding-top: 15px;
            height: 36px;
            line-height: 22px;
            text-align: center;
            box-sizing: content-box;
            cursor: pointer;
            font-size: 1rem;
            color: rgba(27, 27, 27, 1);
            font-weight: bolder;
        }
        /deep/ .el-tabs__nav-next {
            line-height: 22px !important;
        }
        /deep/ .el-tabs__nav-prev {
            line-height: 22px !important;
        }
        /deep/ .sys-subject{
            padding-bottom: 0;
            height: 40px;
            overflow: visible;
        }
    }
}
</style>
