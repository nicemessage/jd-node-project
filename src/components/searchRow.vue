<template>
  <section class="searchBox">
    <div class="search_left">
      <el-input
        class="com-input search-ipt"
        :placeholder="placeholder"
        maxlength="100"
        v-model="keyWord"
        clearable
        @input="handlerInput"
        @change="handlerCurrentPage(1)"
        @clear="handlerCurrentPage(1)"
      >
        <el-button slot="append" type="primary" icon="el-icon-search" class="com-button" @click="handlerCurrentPage(1)"></el-button>
      </el-input>
    </div>
    <el-button class="com-button long" type="primary" @click="add">{{ btnTxt }}<i class="el-icon-plus el-icon--right"></i></el-button>
  </section>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ComTable from '@/components/ComTable.vue';

@Component({
  components: {
    ComTable
  }
})
export default class SubjectList extends Vue {
  @Prop({ type: String }) private placeholder?: string;
  @Prop({ type: String }) private btnTxt?: string;

  private keyWord: string = '';
  private handlerInput(): void {
    this.$emit('upDate', this.keyWord);
  }
  private add(): void {
    this.$emit('add');
  }
  private handlerCurrentPage(index: number) {
    this.$emit('pageChange', index);
  }
}
</script>
<style scoped lang="scss">
.searchBox {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .search_left {
    width: 300px;
  }
}
</style>
