<template>
  <div class="tag-shop-car">
    <div class="subject-content">
      <SysSubject size="small"></SysSubject>
    </div>
    <div class="tag-list">
      <template v-if="tagList.length > 0">
        <div class="tag-list-item" v-for="item of tagList" :key="item.tagCode">
          {{ item.tagName }} （{{ item.coverNum ? item.coverNum.toLocaleString() : 0 }}）
          <i class="icon el-icon-close" @click="delItem(item)"></i>
        </div>
      </template>
      <template v-else>
        空空如也
      </template>
    </div>
    <div class="action">
      <div class="tag-count">
        已选<span>{{ tagList.length }}</span>
      </div>
      <div class="btns">
        <div class="action-btn go-to-crowd" :class="{ disable: tagList.length < 1 }" @click="goToCrowd">去建群</div>
        <div class="action-btn clean-all" @click="cleanAll">清空</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @name TagShopCar
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 购物车组件
 */
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入
import SysSubject from '@/components/SysSubject.vue';

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明
interface Subject {
  id: number;
  subjectCn: string;
  subjectEn: string;
  subjectDesc: string;
  subjectSort: number;
}

interface Tag {
  tagName: string;
  tagCode: string;
  subjectId: number;
  coverNum: number;
}

@Component({
  components: {
    SysSubject
  }
})
export default class TagShopCar extends Vue {
  @State(state => state.curSubject) curSubject!: Subject | null;
  @Watch('curSubject')
  private subjectChange() {
    this.init();
  }

  private msg: any = null;

  private MAX_LEN: number = 20;

  private tagList: Tag[] = [];

  private eventId: Array<any> = [];

  private mounted() {
    this.addMonitor();
    this.init();
  }
  private beforedestroy() {
    this.eventId.forEach((event: any) => {
      this.$bus.$off(event.event, event.id);
    });
  }

  private addMonitor() {
    const id = this.$bus.$on('addTagToShopCar', (payload: Tag) => {
      // console.log('addTagToShopCar');
      this.addItem(payload);
    });
    this.eventId.push({
      id: id,
      event: 'addTagToShopCar'
    });
  }

  private init() {
    if (!this.curSubject) {
      return setTimeout(this.init, 500);
    }
    this.getSelectTagBySubject().then((res: any) => {
      this.tagList = res;
    });
  }

  private addItem(item: Tag) {
    // 空目标检查
    if (!item || !item.tagCode) {
      return;
    }
    // 空余位置检查
    if (this.tagList.length >= this.MAX_LEN) {
      this.$message.warning('添加标签已达数量上限');
      return;
    }
    // 已添加检查
    const idx = this.tagList.findIndex((tag: Tag) => {
      return tag.tagCode == item.tagCode;
    });
    // console.log(idx);
    if (idx >= 0) {
      if (this.msg) {
        this.msg.close();
      }
      this.msg = this.$message.warning('该标签已被添加');
      return;
    }
    this.addSelectTag(item.tagCode).then(() => {
      this.$message.success('标签添加成功');
      this.init();
    });
  }

  private delItem(item: Tag) {
    if (!item || !item.tagCode) {
      return;
    }
    this.delSelectTag(item.tagCode).then(() => {
      this.init();
      this.$message.success('标签删除成功');
    });
  }

  private cleanAll() {
    if (this.tagList.length < 1) {
      this.$message.warning('已无可清除内容');
      return;
    }
    this.delAll().then(() => {
      this.init();
      this.$message.success('全部清除成功');
    });
  }

  private goToCrowd() {
    if (this.tagList.length < 1) {
      return;
    }
    this.$router.push({
      name: 'tag-to-crowd'
    });
  }

  // ========== ajax request  ==========

  private getSelectTagBySubject() {
    return new Promise((resolve, reject) => {
      const url = '/api/admin/tagSelected/getAll';
      const data: object = {
        subjectId: this.curSubject?.id
      };
      this.$api
        .get(url, data)
        .then((res: any) => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private delSelectTag(tagCode: string) {
    return new Promise((resolve, reject) => {
      const url = '/api/admin/tagSelected/del';
      const data: object = {
        subjectId: this.curSubject?.id,
        tagCode: tagCode
      };
      this.$api
        .get(url, data)
        .then((res: any) => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private delAll() {
    return new Promise((resolve, reject) => {
      const url = '/api/admin/tagSelected/delAll';
      const data: object = {
        subjectId: this.curSubject?.id
      };
      this.$api
        .get(url, data)
        .then((res: any) => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private addSelectTag(tagCode: string) {
    return new Promise((resolve, reject) => {
      const url = '/api/admin/tagSelected/add';
      const data: object = {
        subjectId: this.curSubject?.id,
        tagCode: tagCode
      };
      this.$api
        .post(url, data)
        .then((res: any) => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
</script>
<style lang="scss" scoped>
.tag-shop-car {
  width: 350px;
  height: auto;
  .subject-content {
    width: 100%;
    height: 44px;
    border-bottom: 1px solid rgba(216, 216, 216, 1);
    overflow-x: auto;
  }
  .tag-list {
    width: 100%;
    min-height: 60px;
    max-height: 500px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: {
      top: 12px;
      bottom: 2px;
    }
    &-item {
      position: relative;
      width: 300px;
      height: 36px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      box-shadow: 0px 2px 6px 0px rgba(189, 189, 189, 1);
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0px;
      }

      display: flex;
      align-items: center;

      font-size: 0.75rem;
      color: rgba(102, 102, 102, 1);
      padding-left: 30px;

      cursor: default;

      .icon {
        width: 14px;
        height: 14px;
        position: absolute;
        top: 11px;
        right: 11px;
        bottom: 11px;
        background: rgba(239, 239, 239, 1);
        line-height: 14px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .action {
    width: 300px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    margin: {
      top: 14px;
      left: 25px;
      right: 25px;
    }

    .tag-count {
      color: rgba(153, 153, 153, 1);
      span {
        margin-left: 5px;
        color: rgba(57, 107, 246, 1);
      }
    }

    .btns {
      display: flex;
    }

    .action-btn {
      width: 56px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 4px;
      margin-left: 14px;
      font-size: 0.75rem;
      cursor: pointer;

      &.go-to-crowd {
        background: rgba(57, 107, 246, 1);
        color: rgba(255, 255, 255, 1);
        &.disable {
          cursor: not-allowed;
          background: rgba(219, 219, 219, 1);
        }
      }
      &.clean-all {
        background: rgba(239, 239, 239, 1);
        color: rgba(102, 102, 102, 1);
      }
    }
  }
}
</style>
