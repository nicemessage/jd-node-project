<template>
  <section class="pool-section">
    <div class="pool-search">
      <div class="pool-search_left">
        <el-input
          class="com-input search-ipt"
          placeholder="请输入ID池名称/所属表"
          maxlength="100"
          v-model="poolParams.keyWord"
          clearable
          @change="pageChange(1)"
          @clear="pageChange(1)"
          size="medium"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="pageChange(1)"></i>
        </el-input>
      </div>
      <el-button class="el-icon-plus" type="primary" @click="addSubject"  size="medium"> 新增ID池</el-button>
    </div>
    <com-table
      :tableData="idData"
      :columnData="idColumn"
      :total="idTotal"
      :pageSize="poolParams.pageSize"
      :params="poolParams"
      :defSizes="10"
      :pageSizes="[10, 20, 30]"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    >
      <template slot="people" slot-scope="scope">
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
        <a @click="editRow(scope.row)">编辑</a>
        <a @click="showRow(scope.row)">查看</a>
        <a @click="deleteCon(scope.row)">删除</a>
      </template>
    </com-table>
    <!--加上@close的目的是控制reflesh使每次打开都是新的生命周期，为了解决在校验时的一个bug-->
    <edit-pool v-if="reflesh" @close="reflesh = false" :isDetail="isDetail" @update="getListData" ref="subject"></edit-pool>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ComTable from '@/components/ComTable.vue';
import EditPool from './components/EditPool.vue';
@Component({
  components: {
    ComTable,
    EditPool
  }
})
export default class SubjectList extends Vue {
  private reflesh: boolean = false;
  private isDetail: boolean = false;

  private filterData: any[] = [
    {
      label: '用户',
      value: 1
    }
  ];
  private poolParams: any = {
    keyWord: null,
    pageSize: 10,
    pageNum: 1
  };
  private idTotal: number = 0;
  private idData: any[] = [];
  private idColumn: any[] = [
    {
      prop: 'idmappingName',
      label: 'ID池名称',
      minWidth: '120px'
    },
    {
      prop: 'sourceDb',
      label: '库名'
    },
    {
      prop: 'sourceTb',
      label: '表名',
      minWidth: '150px'
    },
    {
      label: '创建人\n修改人',
      slotName: 'people',
      minWidth: '120px'
    },
    {
      label: '创建时间\n修改时间',
      slotName: 'time',
      minWidth: '120px'
    },
    {
      label: '操作',
      slotName: 'opBtns',
      width: '140px'
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
    this.$bus.$emit('main-loading', true);
    this.$api
      .post('/api/admin/sysIDMapping/queryList', this.poolParams)
      .then((res: any) => {
        this.$bus.$emit('main-loading', false);
        this.idData = res.list;
        this.idTotal = res.total;
      })
      .catch((err: any) => {
        this.$bus.$emit('main-loading', false);
        console.log('error', err);
      });
  }
  private pageChange(val: number): void {
    this.poolParams.pageNum = val;
    this.getListData();
  }
  private sizeChange(val: number): void {
    this.poolParams.pageSize = val;
    this.getListData();
  }
  private addSubject(): void {
    this.reflesh = true;
    this.isDetail = false;
    this.$nextTick(() => {
      (this.$refs['subject'] as EditPool).open();
    });
  }
  private editRow(row: any): void {
    this.reflesh = true;
    this.isDetail = false;
    this.$nextTick(() => {
      (this.$refs['subject'] as EditPool).open(row);
    });
  }
  private showRow(row: any): void {
    this.reflesh = true;
    this.isDetail = true;
    this.$nextTick(() => {
      (this.$refs['subject'] as EditPool).open(row);
    });
  }
  private deleteRow(row: any): void {
    this.$api
      .delete('/api/admin/sysIDMapping/del', { id: row.id })
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
    this.$confirm('此操作将永久删除该系统, 是否继续?', '提示', {
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
}
</script>
<style scoped lang="scss">
  a{
    padding-right: 10px;
  }
.pool-section {
  padding:10px 20px;
}
.pool-search {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
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
/deep/.el-input__inner{
  background: none;
}
</style>
