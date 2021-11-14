<template>
  <div>
    <AnalysisModel v-if="isPath" :portraitCateType="1" ref="AnalysisModel" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AnalysisModel from '@/views/admin/portrait-analysis/PortraitAnalysis.vue';

@Component({
  components: {
    AnalysisModel
  }
})
export default class SelectAnalysis extends Vue {
  private isPath: boolean = false;
  private created() {
    if (this.$route.path === '/admin/portrait-analysis') this.isPath = true;
  }
}
</script>

<style lang="scss" scoped></style>
