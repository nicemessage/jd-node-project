<template>
  <section class="subject-section">
    <div class="subject-search">
      <div class="subject-search_left">
        <el-input
          class="com-input search-ipt"
          placeholder="请输入主体中文名称/英文名称"
          maxlength="100"
          v-model="subjectParams.keyWord"
          clearable
          @change="getListData"
          @clear="getListData"
          size="medium"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getListData"></i>
        </el-input>
      </div>
      <el-button class="el-icon-plus" type="primary" @click="addSubject" size="medium"> 新增主体</el-button>
    </div>
    <!--
      :defSizes="10"
      :pageSizes="[10, 20, 30]"
      :total="tagTotal"
    -->
    <div id="dragTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <com-table
        :tableData="tagData"
        :columnData="tagColumn"
        :pageSize="subjectParams.pageSize"
        :params="subjectParams"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
        :row-class-name="rowParentId"
        :showPage="false"
        border
      >
        <template slot="opBtns" slot-scope="scope">
          <a @click="editRow(scope.row)">编辑</a>
          <a @click="showRow(scope.row)">查看</a>
          <a @click="deleteRow(scope.row)">删除</a>
        </template>
      </com-table>
    </div>
    <edit-subject ref="subject" :isDetail="isDetail" @update="upDateSubHead"></edit-subject>
    <show-subject ref="showSubject" />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import ComTable from '@/components/ComTable.vue';
import EditSubject from './components/EditSubject.vue';
import ShowSubject from './components/showSub.vue';
import Sortable from 'sortablejs';

@Component({
  components: {
    ComTable,
    EditSubject,
    ShowSubject
  },
  computed: mapGetters(['loadingSate'])
})
export default class SubjectList extends Vue {
  private tbody: any = '';
  private isDetail: boolean = false;
  private loading: boolean = false;
  private visible: boolean = false;
  private startId: string = '';
  private endId: string = '';
  private subjectParams: any = {
    keyWord: null,
    pageSize: 100,
    pageNum: 1
  };
  // private tagTotal: number = 0;
  private tagData: any[] = [];
  private tagColumn: any[] = [
    {
      prop: 'subjectCn',
      label: '主体中文名称',
      minWidth: '100px'
    },
    {
      prop: 'subjectEn',
      label: '主体英文名称',
      minWidth: '100px'
    },
    {
      prop: 'idmappingName',
      label: 'ID池名称'
    },
    {
      prop: 'dsColName',
      label: 'ID类型'
    },
    {
      prop: 'creator',
      label: '创建人',
      minWidth: '100px'
    },
    {
      prop: 'createdTime',
      label: '创建时间',
      minWidth: '120px'
    },
    {
      prop: 'modifier',
      label: '修改人',
      minWidth: '100px'
    },
    {
      prop: 'modifiedTime',
      label: '修改时间',
      minWidth: '120px'
    },
    {
      label: '操作',
      slotName: 'opBtns',
      minWidth: '120px'
    }
  ];
  private mounted(): void {
    this.init();
  }
  private async init(): Promise<void> {
    this.$store.commit('changeLoadingStatus', true);
    await Promise.all([this.getListData(), this.dragTable()]).finally(() => {
      this.$store.commit('changeLoadingStatus', false);
    });
  }
  //这两个方法没用，但是由于引入的是组件，不加的话报错
  private pageChange() {
    console.log(1);
  }
  private sizeChange() {
    console.log(33);
  }
  private getListData(): void {
    this.$bus.$emit('main-loading', true);
    this.$api
      .post('/api/admin/sysSubject/queryList', this.subjectParams)
      .then((res: any) => {
        this.$bus.$emit('main-loading', false);
        this.tagData = res.list;
      })
      .catch((err: any) => {
        this.$bus.$emit('main-loading', false);
        console.log('error', err);
      });
  }
  private addSubject(): void {
    this.isDetail = false;
    (this.$refs['subject'] as EditSubject).open();
  }
  private editRow(row: any): void {
    this.isDetail = false;
    (this.$refs['subject'] as EditSubject).open(row);
  }
  private showRow(row: any): void {
    this.isDetail = true;
    // (this.$refs['showSubject'] as ShowSubject).open(row);
    (this.$refs['subject'] as EditSubject).open(row);
  }
  private upDateSubHead(): void {
    this.$store.state.upDateSubjectList = true;
    this.getListData();
  }
  private deleteRow(row: any): void {
    this.$confirm('此操作将永久删除该主体, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.$api
          .delete('/api/admin/sysSubject/del', { id: row.id })
          .then((res: any) => {
            row.visible = false;
            this.$message.success('恭喜您，删除成功！');
            this.upDateSubHead();
          })
          .catch((err: any) => {
            row.visible = false;
            console.log(err);
          });
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
  }
  private findMoveItem(id: any) {
    let i: any = '';
    let obj: object = {};
    this.tagData.forEach((item: any, index: number) => {
      if (item.id == id) {
        i = index;
        obj = item;
      }
    });
    return {
      data: obj,
      index: i
    };
  }
  makeSortList(arr: Array<any>, startIndex: number, endIndex: number, upOrDown: string) {
    const sortList: any[] = [];
    // console.log(arr, startIndex, endIndex);

    if (upOrDown === 'up') {
      // console.log('startSort:', arr[startIndex].sort)
      for (let i = startIndex + 1; i <= endIndex; i++) {
        sortList.push({
          id: arr[i].id,
          sortId: arr[startIndex].subjectSort++
        });
      }
      sortList.push({
        id: arr[startIndex].id,
        sortId: arr[endIndex].subjectSort
      });
    } else {
      const list = arr.splice(endIndex, startIndex - endIndex + 1);
      // console.log('初始截取list', list)
      const last = list.pop();
      let subjectSort = list[0].subjectSort;
      // console.log('删除末尾项', list, last, sort)
      list.unshift(last);
      // console.log('添加到第一项', list)
      list.map((item: any) => {
        sortList.push({
          id: item.id,
          sortId: subjectSort++
        });
      });
    }
    console.log(sortList);
    return sortList;
  }
  private rowParentId(e: any) {
    return `drag#${e.row.id}`;
  }
  private dragTable() {
    const t = document.getElementById('dragTable');
    if (t) {
      const tbody = t.querySelector('.el-table__body-wrapper tbody');
      Sortable.create(tbody as any, {
        // 拖拽移动的时候
        onMove: function(/** Event */ event: any /** Event */) {
          event.dragged.classList.forEach((className: any) => {
            if (className.indexOf('#') !== -1) {
              // 包含#字，分割，拿到parentId和id
              const idArr = className.split('#');
              // startParentId = idArr[0];
              this.startId = `${idArr[1]}`;
            }
          });
          event.related.classList.forEach((className: any) => {
            if (className.indexOf('#') !== -1) {
              // 包含#字，分割，拿到parentId和id
              const idArr = className.split('#');
              // endParentId = idArr[0];
              this.endId = `${idArr[1]}`;
            }
          });
          // console.log(this.startId, this.endId);
          if (this.startId === this.endId) {
            console.log('不允许拖动');
            return false;
          } else {
            console.log('允许拖动');
            return true;
          }
        }.bind(this),
        onEnd: function() {
          console.log(this.startId, this.endId);
          const sItem: any = this.findMoveItem(this.startId);
          const eItem: any = this.findMoveItem(this.endId);
          let sysSortVOList: any[] = [];
          if (sItem.data.subjectSort < eItem.data.subjectSort) {
            sysSortVOList = this.makeSortList(this.tagData, sItem.index, eItem.index, 'up');
          } else if (sItem.data.subjectSort > eItem.data.subjectSort) {
            sysSortVOList = this.makeSortList(this.tagData, sItem.index, eItem.index, 'down');
          } else if (sItem.data.subjectSort == eItem.data.subjectSort) {
            return false;
          }

          this.orderSysSubject(sysSortVOList);
        }.bind(this)
      });
    }
  }
  private orderSysSubject(arr: any) {
    this.loading = true;
    const param = { sysSortVOList: arr };
    this.$api.post('/api/admin/sysSubject/orderSysSubject', param).then((res: any) => {
      this.$message.success('列表更新成功！');
      this.tagData = [];
      this.startId = '';
      this.endId = '';
      this.upDateSubHead();
      // this.tagData = JSON.parse(JSON.stringify(res.data));
      this.loading = false;
    });
  }
}
</script>
<style scoped lang="scss">
.subject-section {
  padding:10px 20px;
}
a{
  padding-right: 10px;
}
.subject-search {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  .search-ipt {
    width: 350px;
  }
  &_left {
    display: flex;
  }
}
/deep/.el-input__inner{
  background: none;
}
</style>
