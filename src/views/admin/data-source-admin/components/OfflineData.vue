<template>
    <section class="offline-section">
        <div class="offline-filter">
            <div class="offline-filter_left">
                <el-select
                    class="com-select offline-filter_select"
                    placeholder="请选择主体"
                    v-model="offlineParams.subjectId"
                    @change="pageChange(1)"
                    clearable
                    size="medium"
                >
                    <el-option v-for="(item, index) in subjectIdList" :key="index" :label="item.subjectCn" :value="item.id"></el-option>
                </el-select>
                <el-select
                    class="com-select offline-filter_select"
                    placeholder="请选择数据源类型"
                    v-model="offlineParams.dsType"
                    @change="pageChange(1)"
                    clearable
                    size="medium"
                >
                    <el-option v-for="(item, index) in dsTypeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input
                    class="com-input search-ipt"
                    placeholder="数据源名称/表名/表负责人"
                    maxlength="100"
                    v-model="offlineParams.keyWord"
                    clearable
                    @keyup.enter.native="pageChange(1)"
                    @clear="pageChange(1)"
                    size="medium"
                >
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="pageChange(1)"></i>
                </el-input>
            </div>
            <el-button class="el-icon-plus" type="primary" @click="addTable" size="medium"> 新增离线数据源</el-button>
        </div>
        <com-table
            :tableData="tagData"
            :columnData="tagColumn"
            :total="tagTotal"
            :pageSize="offlineParams.pageSize"
            :params="offlineParams"
            :defSizes="10"
            :pageSizes="[10, 20, 30]"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
        >
            <template slot="erp" slot-scope="scope">
                {{ scope.row.creator }}
                <br />
                {{ scope.row.modifier }}
            </template>
            <template slot="time" slot-scope="scope">
                {{ scope.row.createdTime }}
                <br />
                {{ scope.row.modifiedTime }}
            </template>
            <template slot="opBtns" slot-scope="scope">
                <a @click="editTable(scope.row)">编辑</a>
                <a @click="getTable(scope.row)">查看</a>
                <a @click="delTable(scope.row)">删除</a>
            </template>
        </com-table>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialog" custom-class="com-dialog" width="1100px">
            <edit-offline v-if="editDialog" @update="closeDialog" :dialogData="dialogData" :dialogTitle="dialogTitle"></edit-offline>
        </el-dialog>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ComTable from '@/components/ComTable.vue';
import EditOffline from './EditOffline.vue';
@Component({
    components: {
        ComTable,
        EditOffline
    }
})
export default class OfflineData extends Vue {
    private editDialog: boolean = false;
    private dialogTitle: string = '';
    private dialogData: object = {};
    private subjectIdList: any[] = [];
    private idpoolList: any[] = [];
    private dsTypeOptions: any[] = [
        // 数据源类型
        {
            label: '离线标准',
            value: 1
        },
        {
            label: '离线组合',
            value: 2
        }
    ];
    private offlineParams: any = {
        idmappingColumnId: '',
        subjectId: '',
        dsType: '',
        keyWord: '',
        pageSize: 10,
        pageNum: 1,
        sourceFlag: 'offline'
    };
    private tagTotal: number = 17;
    private tagData: any[] = [];
    private tagColumn: any[] = [
        {
            prop: 'dsName',
            label: '数据源名称'
        },
        {
            prop: 'dsType',
            label: '数据源类型',
            template: (row: any) => {
                const { dsType } = row;
                let text = '';
                this.dsTypeOptions.forEach(item => {
                    if (item.value == dsType) {
                        text = `${item.label}`;
                    }
                });
                return text;
            }
        },
        {
            prop: 'subjectCn',
            label: '所属主体'
        },
        {
            prop: 'sourceTbOrTopic',
            label: '表名'
        },
        {
            prop: 'sourceTbManager',
            label: '表负责人'
        },
        {
            prop: 'tagRelationNum',
            label: '标签数量'
        },
        {
            slotName: 'erp',
            label: '创建人\n修改人',
            minWidth: '100px'
        },
        {
            slotName: 'time',
            label: '创建时间\n修改时间',
            minWidth: '100px'
        },
        {
            label: '操作',
            slotName: 'opBtns',
            width: '140px'
        }
    ];
    public async init(): Promise<void> {
        this.$store.commit('changeLoadingStatus', true);
        await Promise.all([this.getSubjectIdList(), this.getListData()]).finally(() => {
            this.$store.commit('changeLoadingStatus', false);
        });
    }
    private getListData() {
        const params = {};
        Object.keys(this.offlineParams).forEach((key: string) => {
            if (this.offlineParams[key] !== '') {
                // params[key] = this.offlineParams[key];
                this.$set(params, key, this.offlineParams[key]);
            }
        });
        console.log(params);
        this.$bus.$emit('main-loading', true);
        this.$api.post('/api/admin/sysDs/queryList', params).then((res: any) => {
            this.$bus.$emit('main-loading', false);
            this.tagData = res.list;
            this.tagTotal = res.total;
        }).catch((err: any) => {
            this.$bus.$emit('main-loading', false);
            console.log(err);
        });
    }

    private async getSubjectIdList() {
        await this.$api.get('/api/admin/sysSubject/querySysSubject?subjectStatus=1').then((res: any) => {
            this.subjectIdList = res;
        });
    }
    private pageChange(val: number): void {
        this.offlineParams.pageNum = val;
        this.getListData();
    }
    private sizeChange(val: number): void {
        this.offlineParams.pageSize = val;
        this.getListData();
    }
    private addTable(): void {
        this.dialogData = {};
        this.dialogTitle = '新增离线数据源';
        this.editDialog = true;
    }
    private deleteRow(row: any): void {
        this.$api
            .delete('/api/admin/sysDs/del', { id: row.id })
            .then((res: any) => {
                this.$message.success('恭喜您，删除成功！');
                this.getListData();
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
    private delTable(row: any): void {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
                this.deleteRow(row);
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
    }
    private closeDialog() {
        this.editDialog = false;
        this.getListData();
    }
    private getTable(row: any) {
        this.dialogData = row;
        this.dialogTitle = '查看离线数据源';
        this.editDialog = true;
    }
    private editTable(row: any) {
        this.dialogData = Object.assign({}, row);
        this.dialogTitle = '修改离线数据源';
        this.editDialog = true;
    }
}
</script>
<style scoped lang="scss">
/deep/ .noHeight {
    max-height: none !important;
}
a{
    padding-right: 10px;
}
.offline-section {
    margin-top: 15px;
}
.offline-filter {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 0px 1px;
    &_left {
        display: flex;
        .search-ipt {
            width: 350px;
        }
    }
    &_select {
        margin-right: 5px;
        // width: 150px;
    }
}
/deep/.el-input__inner{
     background: none;
 }
</style>
