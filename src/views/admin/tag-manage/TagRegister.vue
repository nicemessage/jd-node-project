<template>
    <section class="data-source-section" element-loading-spinner="el-icon-loading">
        <el-tabs v-model="activeName" class="com-tabs root">
            <el-tab-pane label="离线标签" name="offLine" :disabled="editShow !== 1 && editShow !== 0" style="overflow: auto;height: 100%">
                <EditTag v-if="activeName === 'offLine'" :tagDetail="tagDetail" :tagClassify="1" ref="EditTag1" />
            </el-tab-pane>
<!--            <el-tab-pane label="实时标签" name="realTime" :disabled="editShow !== 3 && editShow !== 0" style="overflow: auto;height: 100%">-->
<!--                <EditTag v-if="activeName === 'realTime'" :tagDetail="tagDetail" :tagClassify="3" ref="EditTag2" />-->
<!--            </el-tab-pane>-->
            <el-tab-pane label="组合标签" name="connectTag" :disabled="editShow !== 2 && editShow !== 0" style="overflow: auto;height: 100%">
                <EditConnectTag v-if="activeName === 'connectTag'" :tagDetail="tagDetail" :tagClassify="2" ref="EditConnectTag" />
            </el-tab-pane>
            <!-- <el-tab-pane label="自定义sql" name="customSql" :disabled="editShow !== 4 && editShow !== 0" style="overflow: auto;height: 100%">
                <EditSqlTag v-if="activeName === 'customSql'" :tagDetail="tagDetail" :tagClassify="4" ref="EditCustomSqlTag" />
            </el-tab-pane> -->
        </el-tabs>
        <div class="backBtn">
            <el-button @click="back" size="mini">返回</el-button>
            <el-button @click="save" :loading="btnLoading" size="mini" type="primary">{{ editShow === 0 ? '保存标签' : '修改标签' }}</el-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EditTag from './components/EditTag.vue';
import EditConnectTag from './components/EditConnectTag.vue';
// import EditSqlTag from './components/EditSqlTag.vue';
import { State, Mutation } from 'vuex-class';

@Component({
    components: {
        EditTag,
        EditConnectTag,
        // EditSqlTag
    }
})
export default class DataSource extends Vue {
    @State(state => state.btnLoading) btnLoading?: boolean;
    @State(state => state.curSubject) curSubject!: Subject | null;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;
    private activeName: string = '';
    private editShow: number = 0;
    private loading: boolean = false;

    private back() {
        this.$router.push({
            name: 'admin/tag-market'
        });
    }

    public save() {
        this.chagneBtnLoading(true);
        this.$store.state.loadingSate = true;
        if (this.activeName === 'connectTag') {
            if (this.editShow === 0) {
                (this.$refs['EditConnectTag'] as any).save();
            } else {
                (this.$refs['EditConnectTag'] as any).update();
            }
        } else if (this.activeName === 'offLine') {
            if (this.editShow === 0) {
                (this.$refs['EditTag1'] as any).save();
            } else {
                (this.$refs['EditTag1'] as any).update();
            }
        } else if (this.activeName === 'realTime') {
            if (this.editShow === 0) {
                (this.$refs['EditTag2'] as any).save();
            } else {
                (this.$refs['EditTag2'] as any).update();
            }
        // } else if (this.activeName === 'customSql') {
        //     if (this.editShow === 0) {
        //         (this.$refs['customSqlTag'] as any).save();
        //     } else {
        //         (this.$refs['customSqlTag'] as any).update();
        //     }
        }
    }

    private haveSubjectId: boolean = true;
    private created() {
        if (!this.curSubject) {
            this.haveSubjectId = false;
            this.$router.replace({
                name: 'admin/tag-market'
            });
        }
    }

    private getTagDetail(tagId: any) {
        return new Promise((resolve, reject) => {
            this.$api.get('/api/admin/tag/get', { id: tagId }).then((res: any) => {
                resolve(res);
            });
        });
    }

    private tagDetail: any = {};
    private mounted() {
        if (!this.haveSubjectId) {
            return false;
        }
        const tagId = this.$route.params.tagId;
        if (tagId === 'add') {
            this.editShow = 0;
            this.activeName = 'offLine';
        } else {
            this.$store.state.loadingSate = true;
            this.getTagDetail(tagId).then((res: any) => {
                this.editShow = res.tagClassify;
                this.tagDetail = res;
                if (res.tagClassify === 1) {
                    this.activeName = 'offLine';
                } else if (res.tagClassify == 2) {
                    this.activeName = 'connectTag';
                } else if (res.tagClassify == 3) {
                    this.activeName = 'realTime';
                // } else if (res.tagClassify == 4) {
                //     this.activeName = 'customSql';
                }
            });
        }
    }
}
</script>
<style scoped lang="scss">
.data-source-section {
    padding: 10px 20px;
    position: relative;
    height: 100%;
    overflow: auto;
}
.backBtn {
    position: absolute;
    top: 10px;
    right: 20px;
}
/deep/ .is-disabled {
    color: #ccc;
    cursor: not-allowed;
}
.root {
    flex: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    /deep/ .el-tab-pane {
        flex-grow: 1;
        overflow-y: auto;
        &::-webkit-scrollbar,
        & textarea::-webkit-scrollbar {
            width: 6px;
            height: 0px;
        }

        &::-webkit-scrollbar-thumb,
        & textarea::-webkit-scrollbar-thumb {
            background: #d8d8d8;
        }

        &::-webkit-scrollbar-track,
        & textarea::-webkit-scrollbar-track {
            background: #e9e9e9;
        }
    }
}
</style>
