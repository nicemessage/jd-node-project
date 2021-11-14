<template>
    <section class="offline-section">
        <div class="offline-filter">
            <div class="offline-filter_left">
                <el-select
                    class="com-select offline-filter_select"
                    placeholder="请选择主体"
                    @change="pageChange(1)"
                    v-model="realParams.subjectId"
                    clearable
                    size="medium"
                >
                    <el-option v-for="(item, index) in subjectIdList" :key="index" :label="item.subjectCn" :value="item.id"></el-option>
                </el-select>
                <!-- <el-select class="com-select offline-filter_select" placeholder="请选择数据源类型" v-model="realParams.dsType" clearable>
          <el-option v-for="(item, index) in dsTypeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
                <el-input
                    class="com-input search-ipt"
                    placeholder="数据源名称/ topic名称//topic负责人"
                    maxlength="100"
                    v-model="realParams.keyWord"
                    clearable
                    @keyup.enter.native="pageChange(1)"
                    @clear="pageChange(1)"
                    size="medium"
                >
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="pageChange(1)"></i>
                </el-input>
            </div>
            <el-button class="el-icon-plus" type="primary" @click="addTable"  size="medium"> 新增实时数据源</el-button>
        </div>
        <com-table
            :tableData="tagData"
            :columnData="tagColumn"
            :total="tagTotal"
            :pageSize="realParams.pageSize"
            :params="realParams"
            :defSizes="10"
            :pageSizes="[10, 20, 30]"
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
        <el-dialog
            :close-on-click-modal="false"
            :title="dialogTitle"
            :visible.sync="editDialog"
            custom-class="com-dialog"
            top="0"
            width="1200px"
            :lock-scroll="true"
        >
            <EditRealTime v-if="editDialog" @update="closeDialog" :dialogData="dialogData" :dialogTitle="dialogTitle" />
        </el-dialog>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ComTable from '@/components/ComTable.vue';
import EditRealTime from './EditRealTime.vue';
@Component({
    components: {
        ComTable,
        EditRealTime
    }
})
export default class RealTime extends Vue {
    private editDialog: boolean = false;
    private dialogTitle: string = '';
    private title: string = '实时数据源';
    private dialogData: object = {};
    private dsTypeOptions: any[] = [
        // 数据源类型
        {
            label: '离线标准',
            value: 1
        },
        {
            label: '离线组合',
            value: 2
        },
        {
            label: '实时标准',
            value: 3
        }
    ];
    private subjectIdList: any[] = [];
    private filterData: any[] = [
        {
            label: '用户',
            value: 1
        }
    ];
    private realParams: any = {
        dsType: '3',
        idmappingColumnId: '',
        keyWord: '',
        pageNum: 1,
        pageSize: 5,
        sourceFlag: 'online',
        subjectId: ''
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
            label: 'topic名称'
        },
        {
            prop: 'sourceTbManager',
            label: 'topic负责人'
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
    private pageChange(): void {
        this.getListData();
    }
    private addTable(): void {
        this.dialogTitle = `新增${this.title}`;
        this.editDialog = true;
        this.dialogData = {};
    }
    public async init(): Promise<void> {
        this.$store.commit('changeLoadingStatus', true);
        await Promise.all([this.getSubjectIdList(), this.getListData()]).finally(() => {
            this.$store.commit('changeLoadingStatus', false);
        });
    }
    private closeDialog() {
        this.editDialog = false;
        this.getListData();
    }
    private async getSubjectIdList() {
        await this.$api.get('/api/admin/sysSubject/querySysSubject?subjectStatus=1').then((res: any) => {
            this.subjectIdList = res;
        });
    }
    private getListData() {
        this.$bus.$emit('main-loading', true);
        this.$api.post('/api/admin/sysDs/queryList', this.realParams).then((res: any) => {
            this.$bus.$emit('main-loading', false);
            this.tagData = res.list;
            this.tagTotal = res.total;
        })
        .catch((err: any) => {
            this.$bus.$emit('main-loading', false);
            console.log(err);
        });
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
    private async getTable(row: any) {
        // 详情
        Object.assign(this.dialogData, row);
        this.dialogTitle = `查看${this.title}`;
        this.editDialog = true;
    }
    private editTable(row: any) {
        // 修改
        Object.assign(this.dialogData, row);
        this.dialogTitle = `修改${this.title}`;
        this.editDialog = true;
    }
    private detail(id: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/admin/sysDs/get';
            const data = { id: id };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
</script>
<style scoped lang="scss">
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
