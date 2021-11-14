<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="标签列表" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <div style="padding: 30px;">
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="tagCode" label="标签编码" align="center"> </el-table-column>
          <el-table-column prop="tagCompName" label="标签名称" align="center"> </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({})
export default class ShowEnumTag extends Vue {
  @Prop({ type: Number || String }) tagEnumId?: number | string;
  private loading: boolean = false;
  private tableData: any[] = [];
  private dialogVisible: boolean = false;
  private handleClose() {
    this.tableData = [];
    this.dialogVisible = false;
  }
  public open(row: any): void {
    this.loading = true;
    this.$api.get('/api/admin/tagEnum/checkForTag', { tagEnumId: row.id }).then((res: any) => {
      this.tableData = res;
      this.loading = false;
    });
    this.dialogVisible = true;
  }
}
</script>
