<template>
  <div class="db-info">
    <el-form :model="CrowdSourceVO" ref="form">
      <el-row>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="集群" label-width="150px">
            {{ clusterName }}
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="所属库" label-width="150px">
            {{ CrowdSourceVO.dbName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="所属表" label-width="150px">
            {{ CrowdSourceVO.tableName }}
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="ID列" label-width="150px">
            {{ CrowdSourceVO.columnName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="枚举列" label-width="150px">
            {{ CrowdSourceVO.enumColumnName }}
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="枚举值" label-width="150px">
            <div class="tag-list">
              <el-tag class="enum-item" v-for="(tag, index) in CrowdSourceVO.enums" :key="index">{{ tag }}</el-tag>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
/**
 * @name DbCrowdInfo
 * @author shileilei3
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明

// 本地定义和声明
interface Subject {
  id: number;
  subjectCn: string;
  subjectEn: string;
  subjectDesc: string;
  subjectSort: number;
}
@Component({
  components: {}
})
export default class DbDetail extends Vue {
  @State(state => state.curSubject) curSubject!: Subject | null;
  @Prop({ type: String }) private dbInfo?: any;

  private clusterList: any[] = [];
  private clusterName: string = '';
  private enumName: string = '';

  private CrowdSourceVO: any = {
    clusterName: '',
    columnName: '',
    dbName: '',
    dsCol: '',
    enumColumnName: '',
    tableName: '',
    enums: []
  };

  private mounted() {
    this.CrowdSourceVO = JSON.parse(this.dbInfo);
    this.CrowdSourceVO.enums.forEach((item: any) => {
      this.enumName = this.enumName.concat(item).concat(' ');
      console.log('++++++++++++', this.enumName, item);
    });
    this.$api.get('/api/ava/hive/cluster', null).then((res: any) => {
      this.clusterList = res;
      this.init();
    });
  }

  private init() {
    this.clusterList.forEach((item: any) => {
      console.log('+++++', item.id == this.CrowdSourceVO.clusterName);
      if (item.id == this.CrowdSourceVO.clusterName) {
        this.clusterName = item.clusterName;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.db-info {
  width: 100%;
  height: 100%;
  line-height: 40px;
  font-size: 1rem;
  color: #666666;
  margin-top: -10px;
  .enum-ipt {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 20px;
    .add-btn {
      /*position: absolute;*/
      /*left: calc(100% + 10px);*/
      margin-left: 10px;
    }
  }
  .tag-list {
    .enum-item {
      margin: 0 10px 10px 0;
    }
  }
  /deep/.el-tag {
    font-size: 16px;
  }
  /deep/.el-form-item__content {
    color: #666666;
    font-size: 1rem;
  }
  /deep/.el-form-item__label {
    margin-right: 20px;
    padding: 0px;
    font-size: 1rem;
  }
  /deep/.el-form-item {
    margin-bottom: 0px;
  }
  .page-section {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  /deep/.el-form-item__error {
    margin-left: 20px;
  }
}
</style>
