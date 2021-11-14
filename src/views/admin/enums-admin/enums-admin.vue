<template>
    <section class="enmus-admin">
        <div class="header">
            <div class="subject-list">
                <SubHead @changeId="getListData" />
            </div>
            <div class="search-tag-btn">
                <el-select v-model="enumParams.tagEnumType" class="com-select" style="margin-right:5px;" size="medium" clearable @change="getListData">
                    <el-option label="单级枚举" value="1"> </el-option>
                    <el-option label="N级枚举" value="2"> </el-option>
                </el-select>
                <el-input
                        class="com-input search-ipt"
                        placeholder="枚举名称/创建人/修改人"
                        maxlength="100"
                        v-model="enumParams.keyword"
                        clearable
                        @change="pageChange(1)"
                        @clear="pageChange(1)"
                        style="margin-right:5px;"
                        size="medium"
                >
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="pageChange(1)"></i>
                </el-input>
                <el-button type="primary" @click="addenum" size="medium"><i class="el-icon-plus"></i> 新增枚举</el-button>
            </div>
        </div>
        <main class="enmus-section self-scroll">
            <com-table
                :tableData="enumData"
                :columnData="enumColumn"
                :total="total"
                :pageSize="enumParams.pageSize"
                :params="enumParams"
                :pageSizes="[10, 20, 30]"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template slot="opBtns" slot-scope="scope">
                    <a @click="editRow(scope.row)">编辑</a>
                    <a @click="showRow(scope.row)">引用查看</a>
                    <a @click="deleteCon(scope.row)">删除</a>
                </template>
            </com-table>
            <!--加上@close的目的是控制reflesh使每次打开都是新的生命周期，为了解决在校验时的一个bug-->
            <AddEnumDialog @update="getListData" :isDetail="isDetail" :dialogTitle="enumTitle" ref="addEnumDialog"></AddEnumDialog>
            <ShowEnumTag ref="showEnumTag"></ShowEnumTag>
        </main>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ComTable from '@/components/ComTable.vue';
import SubHead from '@/components/SysSubject.vue';
import AddEnumDialog from './components/addEnumDialog.vue';
import ShowEnumTag from './components/showEnumTag.vue';
// 第三方库引入
import moment from 'moment';
import {State} from "vuex-class";
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

@Component({
    components: {
        ComTable,
        SubHead,
        AddEnumDialog,
        ShowEnumTag
    }
})
export default class EnumAdmin extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;
    private isDetail: boolean = false;
    private enumTitle: string = '新增枚举';
    private enumParams: any = {
        keyword: '',
        pageNum: 1,
        pageSize: 10,
        subjectId: 1,
        tagEnumType: ''
    };
    private total: number = 0;
    private enumData: any[] = [];
    private enumColumn: any[] = [
        {
            prop: 'tagEnumName',
            label: '枚举名称',
            minWidth: '120px'
        },
        {
            prop: 'tagEnumType',
            label: '枚举类型',
            template: (row: any) => {
                if (row.tagEnumType == 1) return '单级枚举';
                if (row.tagEnumType == 2) return 'N级枚举';
            }
        },
        {
            prop: 'creator',
            label: '创建人'
        },
        {
            label: '创建时间',
            prop: 'createdTime',
            template: (row: any) => {
                return this.formatDate(row.createdTime);
            }
        },
        {
            label: '修改人',
            prop: 'modifier'
        },
        {
            label: '修改时间',
            prop: 'modifiedTime',
            template: (row: any) => {
                return this.formatDate(row.modifiedTime);
            }
        },
        {
            label: '操作',
            slotName: 'opBtns',
            minWidth: '100px'
        }
    ];
    private mounted(): void {
        this.init();
    }
    private async init(): Promise<void> {
        this.$store.commit('changeLoadingStatus', true);
        await Promise.all([this.getListData()]).finally(() => {
            this.$store.commit('changeLoadingStatus', false);
        });
    }
    private getListData(): void {
        this.enumParams.subjectId = this.curSubject?.id;
        this.$bus.$emit('main-loading', true);
        this.$api
            .post('/api/admin/tagEnum/page', this.enumParams)
            .then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.enumData = res.list;
                this.total = res.total;
            })
            .catch((err: any) => {
                this.$bus.$emit('main-loading', false);
                console.log('error', err);
            });
    }
    private pageChange(val: number): void {
        this.enumParams.pageNum = val;
        this.getListData();
    }
    private sizeChange(val: number): void {
        this.enumParams.pageSize = val;
        this.getListData();
    }
    private addenum(): void {
        this.isDetail = false;
        this.enumTitle = '新增枚举';
        this.$nextTick(() => {
            (this.$refs['addEnumDialog'] as AddEnumDialog).open();
        });
    }
    private formatDate(dateStr: string) {
        return moment(dateStr).format('YYYY-MM-DD HH:mm:ss');
    }
    private editRow(row: any): void {
        this.enumTitle = '修改枚举';
        this.isDetail = false;
        this.$nextTick(() => {
            (this.$refs['addEnumDialog'] as AddEnumDialog).open(row);
        });
    }
    private showRow(row: any): void {
        // this.enumTitle = '查看枚举';
        // this.isDetail = true;
        this.$nextTick(() => {
            (this.$refs['showEnumTag'] as ShowEnumTag).open(row);
        });
    }
    private deleteRow(row: any): void {
        this.$api
            .get(`/api/admin/tagEnum/del?tagEnumId=${row.id}`)
            .then((res: any) => {
                row.visible = false;
                this.$message.success('恭喜您，删除成功！');
                this.getListData();
            })
            .catch((err: any) => {
                row.visible = false;
                console.log(err);
            });
    }
    private deleteCon(row: any): void {
        this.$confirm('此操作将永久删除该枚举, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
                // console.log(row);
                this.deleteRow(row);
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
    }
}
</script>
<style scoped lang="scss">
    a{
        padding-right: 10px;
    }
.enmus-admin {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
.enmus-section {
    width: 100%;
    height: calc(100% - 68px);
    padding: 0 20px;
    box-sizing: border-box;
    overflow-y: auto;
}
.enmus-search {
    display: flex;
    justify-content: space-between;
    margin: 12px 0px;
    .search-ipt {
        width: 350px;
    }
    &_left {
        flex: 1;
        display: flex;
    }
    &_select {
        margin-right: 15px;
        width: 110px;
    }
}
.header {
    width: 100%;
    height: 64px;
    display: flex;
    /deep/.el-input__inner{
        background: none;
    }
    .subject-list {
        width: 30%;
        height: 64px;
        flex: 1 1 auto;
    }

    .search-tag-btn {
        min-width: 300px;
        height: 64px;
        text-align: right;
        align-items: center;
        display: flex;
        flex: 1 1 auto;
        padding-right: 20px;
        .search-input {
            flex: 1 1 auto;
            padding-right: 10px;
            display: inline-block;
        }
    }
}
</style>
