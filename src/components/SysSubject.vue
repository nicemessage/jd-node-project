<template>
    <section class="sys-subject" :class="size">
        <el-dropdown trigger="click" v-if="subjectList.length > 0 && subjectName">
            <span class="el-dropdown-link">
                <img :src="require(`@/assets/img/${icon}.png`)" class="img">
                <span>{{subjectName}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in subjectList" :key="index" v-show="getSubjectListShow(item.id)" @click.native="switchSubject(item)">{{item.subjectCn}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </section>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';

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

    @Component
    export default class SysSubject extends Vue {
        private subjectList: Array<Subject> = [];

        @State(state => state.curSubject) curSubject!: Subject | null;
        $route: any;

        @Watch('curSubject')
        private curSubjectChange() {
            if (this.curSubject) {
                this.subjectId = this.curSubject.id.toString();
                window.sessionStorage.setItem('subjectId', this.subjectId);
                // console.log('监听改变');
            }
        }

        private canChange: boolean = true;

        @Prop({
            default: 'medium'
        })
        private size!: string;

        private subjectId: string = '';
        private subjectName: string = '';
        private iconMap: any = {
            '用户':'icon_1',
            '店铺':'icon_2',
            '供应商':'icon_3',
            '商户号':'icon_4',
            '企业用户':'icon_5',
            'BPIN':'icon_6',
            '信用卡':'icon_7',
        };

        get icon(){
            if(this.iconMap[this.subjectName]){
                return this.iconMap[this.subjectName]
            }
            return 'icon_1'
        }

        private mounted() {
            this.init();
        }

        private init() {
            if (this.$route.query.code) {
                this.canChange = false;
            }
            if (this.curSubject) {
                this.subjectId = this.curSubject.id.toString();
                this.subjectName = this.curSubject.subjectCn;
                window.sessionStorage.setItem('subjectId', this.subjectId);
                this.getSubjectList();
            } else {
                this.getSubjectList('reload');
                // this.subjectId = '';
                // this.subjectName = '';
            }
            // console.log('init改变');

        }

        private switchSubject(tab: any) {
            const subjId = tab.id;
            this.subjectId = subjId.toString();
            this.subjectName = tab.subjectCn;
            const subject = this.subjectList.find((item: any) => {
                return item.id == subjId;
            });
            // console.log(this.subjectId,this.subjectName);
            if (subject) {
                this.$store.commit('updateCurSubject', subject);
                window.sessionStorage.setItem('subjectId', this.subjectId);
                this.subjectId = subjId;
                this.$emit('changeId', subjId);
            }
        }
        private getSubjectListShow(id:string){
            if(this.$route.query.subjectId){
                const list = this.$route.query.subjectId.split("-");
                // console.log(list,id,list.indexOf(id));
                if(list.indexOf(id.toString()) != -1) {
                    return true;
                }
            } else {
                return true;
            }
        }


        // ========== ajax request  ==========

        private getSubjectList(reload:string) {
            const url = '/api/admin/sysSubject/querySysSubject';
            const data = {
                subjectStatus: 1
            };
            this.$api.get(url, data).then((res: any) => {
                this.subjectList = res;
                window.sessionStorage.setItem('subjectList', JSON.stringify(res));
                if (!this.curSubject && this.subjectList[0]) {
                    let cur: any = this.subjectList[0];
                    if(this.$route.query.subjectId){
                        this.subjectId = this.$route.query.subjectId.split("-")[0];
                        cur = this.subjectList.find((item: any) => {
                            return item.id == this.subjectId;
                        });
                        this.subjectName = cur.subjectCn;
                    } else {
                        this.subjectId = cur.id.toString();
                        this.subjectName = cur.subjectCn;
                    }
                    this.$store.commit('updateCurSubject', cur);
                    this.curSubject = cur;
                }else{
                    if(this.$route.query.subjectId){
                        this.subjectId = this.$route.query.subjectId.split("-")[0];
                        const cur1: any = this.subjectList.find((item: any) => {
                            return item.id == this.subjectId;
                        });
                        this.subjectName = cur1.subjectCn;
                        this.$store.commit('updateCurSubject', cur1);
                    }

                }
                if(reload === 'reload'){
                    if(this.subjectList.length == 0){
                        this.$message('暂时没有查询到主体信息');
                    }else{
                        window.location.reload();
                    }
                }
            });
        }
    }
</script>
<style lang="scss" scoped>
    .el-dropdown-link {
        font-size: 18px;
        cursor: pointer;
        span {
            padding-left: 10px;
            color: #000;
        }
        .el-icon--right{
            color: #C9CED9;
        }
    }
    .sys-subject {
        // width: 100%; background: #fff;
        overflow: hidden;
        width: 100%;
        height: 60px;
        // line-height: 64px;
        /*background-color: #fff;*/
        // box-shadow: 0px 2px 4px 0px rgba(170, 170, 170, 0.5);
        padding: 16px 20px;
        font-size: 1rem;
        font-weight: bold;
        .img {
            width: 30px;
            height: 30px;
            float: left;
        }
        /deep/ .el-dropdown-link{
            span{
                padding-top: 2px;
                float: left;
            }
            i{
                padding-top: 5px;
                float: left;
            }
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
            padding-top: 28px;
            height: 36px;
            line-height: 22px;
            text-align: center;
            box-sizing: content-box;
            cursor: pointer;
            font-family: PingFangSC-Semibold;
            font-size: 1rem;
            color: rgba(27, 27, 27, 1);
            font-weight: bolder;
        }

        /deep/ .el-tabs__nav-next {
            padding-top: 28px;
            height: 36px;
            line-height: 22px !important;
        }

        /deep/ .el-tabs__nav-prev {
            padding-top: 28px;
            height: 36px;
            line-height: 22px !important;
        }

        &.small {
            height: 34px;
            line-height: 32px;
            padding: 0px 20px;

            /deep/ .el-tabs__item {
                width: 60px;
                height: 18px;
                padding-top: 6px;
                line-height: 18px;
                font-size: 0.75rem;
                // flex: 0 0 auto;
            }

            /deep/ .el-tabs__nav-wrap::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 2px;
                background-color: white !important;
                z-index: 1;
            }

            /deep/ .el-tabs__nav-next {
                padding-top: 7px;
                height: 18px;
                line-height: 18px !important;
            }

            /deep/ .el-tabs__nav-prev {
                padding-top: 7px;
                height: 18px;
                line-height: 18px !important;
            }
        }
    }
</style>
