<template>
    <div class="token-apply">
        <div class="header">
            <div class="search-tool">
                <div class="search-item">
                    <SysSubject></SysSubject>
                </div>
                <div class="search-item col300">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="下载数据" name="1"></el-tab-pane>
                        <el-tab-pane label="取值数据" name="2"></el-tab-pane>
                        <el-tab-pane label="命中数据" name="3"></el-tab-pane>
                    </el-tabs>
                </div>
<!--                <div class="spacer" style="text-align: right;">-->
<!--                    <a href="http://bi.jd.com/detail?portalUuid=20190530213918021022455525029658" target="_blank" style="padding: 0 20px;">搜索ID快速查询入口>></a>-->
<!--                </div>-->
            </div>
        </div>
        <div class="query-list" v-if="activeName == '1'">
            <span class="query-list-span">
                群体编码：
                <el-input v-model="group" clearable placeholder="请输入群体编码" size="small" style="width: 200px;">
                </el-input>
            </span>
            <span class="query-list-span">
                token：
                <el-input v-model="token" clearable placeholder="请输入系统token" size="small" style="width: 300px;">
                </el-input>
            </span>
            <el-button size="small" type="primary" @click="queryDownLoad">查询</el-button>
        </div>
        <div class="query-list" v-if="activeName == '2'">
            <span class="query-list-span">
                融合用户唯一id：
                <el-input v-model="anyID" clearable placeholder="请输入融合用户唯一id" size="small" style="width: 200px;">
                </el-input>
            </span>
            <span class="query-list-span">
                标签列表：
                <el-input v-model="tagCodes" clearable placeholder="请输入标签列表,英文逗号分隔" size="small" style="width: 220px;">
                </el-input>
            </span>
            <span class="query-list-span">
                token：
                <el-input v-model="token" clearable placeholder="请输入系统token" size="small" style="width: 280px;">
                </el-input>
            </span>
            <el-button size="small" type="primary" @click="queryGetTagVal">查询</el-button>
        </div>
        <div class="query-list" v-if="activeName == '3'">
            <span class="query-list-span">
                融合用户唯一id：
                <el-input v-model="anyID" clearable placeholder="请输入融合用户唯一id" size="small" style="width: 200px;">
                </el-input>
            </span>
            <span class="query-list-span">
                群体列表：
                <el-input v-model="groups" clearable placeholder="请输入群体列表,英文逗号分隔" size="small" style="width: 220px;">
                </el-input>
            </span>
            <span class="query-list-span">
                token：
                <el-input v-model="token" clearable placeholder="请输入系统token" size="small" style="width: 280px;">
                </el-input>
            </span>
            <el-button size="small" type="primary" @click="queryHit">查询</el-button>
        </div>
        <div class="body self-scroll">
            <div class="token-list" v-if="activeName == '1'">
                <div v-if="downLoadTotal" style="padding: 10px;">总数：{{downLoadTotal}}</div>
                <el-table :data="downLoadList" size="small" border>
                    <el-table-column label="ids">
                        <template slot-scope="scope">
                            <div>{{scope.row}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="token-list" v-if="activeName == '2'" style="padding: 30px;">
<pre>
{{getTagValList}}
</pre>
            </div>
            <div class="token-list" v-if="activeName == '3'">
                <el-table :data="hitList" size="small" border>
                    <el-table-column prop="group" label="group"></el-table-column>
                    <el-table-column prop="hit" label="hit"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /**
     * @name TokenApply
     * @author tokenApply
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import { Mixins, Component, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import SysSubject from '@/components/SysSubject.vue';

    @Component({
        components: {
            SysSubject
        }
    })
    export default class DataQuery extends Mixins() {
        @State(state => state.curSubject) curSubject!: any | null;
        // @Watch('curSubject')
        // private subjectChange() {
        //     console.log(this.activeName);
        // }
        private searchWord: string = '';
        private map:any = {
            1:'PIN',
            4:'VEN',
            5:'SUP',
            3:'CID',
            6:'OWN',
            7:'BPIN',
            2:'CCD',
        }

        private downLoadList: any[] = [];
        private downLoadTotal: any = '';
        private getTagValList: any = {};
        private hitList: any[] = [];
        private activeName: string = '1';

        private group: string = '';
        private token: string = '036ac7e9-9bd3-4e2d-8d1e-ee6eb3a64a75';

        private anyID: string = '';
        private tagCodes: string = '';
        private groups: string = '';

        private handleClick(e:any){
            console.log(e)
            // this.searchWord = '';
            // this.getTokenList();

        }

        private mounted() {
            console.log(this.curSubject);

        }

        // ========== ajax request  ==========

        private queryDownLoad() {
            if(!this.group){
                this.$message('请输入群体编码');
                return false;
            }
            if(!this.token){
                this.$message('系统token');
                return false;
            }
            const data = {
                group: this.group,
                token: this.token,
                num: 100,
                startOffset: 0,
                subjectType: this.map[this.curSubject?.id]


            };
            this.$bus.$emit('main-loading', true);
            this.$api
                .post('/api/admin/inner/downLoad', data)
                .then((res:any) => {
                    this.$bus.$emit('main-loading', false);
                    this.downLoadList = res.ids;
                    this.downLoadTotal = res.total;
                })
                .catch((err: any) => {
                    this.$bus.$emit('main-loading', false);
                });
        }

        private queryGetTagVal() {
            const data = {
                anyID:this.anyID,
                idType:this.map[this.curSubject?.id],
                tagCodes:this.tagCodes.split(","),
                token:this.token
            };
            this.$bus.$emit('main-loading', true);
            this.$api
                .post('/api/admin/inner/getTagVal', data)
                .then((res: any) => {
                    this.$bus.$emit('main-loading', false);
                    this.getTagValList = JSON.stringify(JSON.parse(res),null,2);
                })
                .catch((err: any) => {
                    this.$bus.$emit('main-loading', false);
                });
        }
        private queryHit() {
            const data = {
                anyID:this.anyID,
                subjectType:this.map[this.curSubject?.id],
                groups:this.groups.split(","),
                subjectId:this.curSubject?.id,
                token:this.token
            };
            this.$bus.$emit('main-loading', true);
            this.$api
                .post('/api/admin/inner/hit', data)
                .then((res: any) => {
                    this.$bus.$emit('main-loading', false);
                    this.hitList = res;
                })
                .catch((err: any) => {
                    this.$bus.$emit('main-loading', false);
                });
        }
    }
</script>
<style lang="scss" scoped>
    /*.token-apply {*/
    /*    padding:10px 20px;*/
    /*}*/
    /deep/.el-tabs__nav-wrap:after{
        background: none;
    }
    /deep/.el-input__inner{
        background: none;
    }
    .search-tool {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        .search-item {
            flex: 0 0 auto;
            margin-left: 20px;
            display: flex;

            &:first-child {
                margin-left: 0px;
            }

            &.col150 {
                width: 150px;
            }

            &.col300 {
                width: 300px;
            }
        }

        .select-item {
            height: 30px;
        }

        .spacer {
            flex: 1 1 auto;
        }
    }
    .token-apply {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        min-width: 900px;
        .query-list {
            padding: 10px 20px 0;
            font-size: 12px;
            &-span{
                padding-right: 10px;
            }
        }
        .body {
            width: 100%;
            height: calc(100% - 60px);
            margin-top: 4px;
            box-sizing: border-box;
            padding:10px 20px;
            a {
                padding: 0 15px 0 0;
            }
            .search-tool {
                width: 100%;
                margin-bottom: 20px;
                display: flex;
            }

            .token-list {
                width: 100%;
                /*height: calc(100% - 120px);*/
                height: auto;
                max-height: calc(100% - 60px);
                overflow: auto;
                background-color: #fff;
            }

            .option-item {
                margin-right: 10px;
                // color: rgba(57, 107, 246, 1);
                cursor: pointer;
            }

            .paginationa {
                width: 100%;
                padding: {
                    top: 10px;
                    bottom: 18px;
                }
                display: flex;
                justify-content: flex-end;
            }
        }
    }
    /deep/.el-tabs__header{
        margin-bottom: 0;
    }
    /deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
        border-bottom: 1px solid #F6F8FA;
    }
</style>
