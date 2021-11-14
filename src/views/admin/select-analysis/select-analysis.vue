<template>
  <div>
    <AnalysisModel v-if="isPath" ref="AnalysisModel" :portraitCateType="2" />
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
        if (this.$route.path === '/admin/select-analysis') this.isPath = true;
    }
}
</script>

<style lang="scss" scoped></style>
