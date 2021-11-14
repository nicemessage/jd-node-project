<template>
    <section class="data-source-section">
        <el-tabs v-model="activeName" class="com-tabs" @tab-click="changeAN">
            <el-tab-pane label="离线数据源" name="offLine">
                <offline-data ref="offLine"></offline-data>
            </el-tab-pane>
<!--            <el-tab-pane label="实时数据源" name="realTime">-->
<!--                <real-time ref="realTime"></real-time>-->
<!--            </el-tab-pane>-->
        </el-tabs>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OfflineData from './components/OfflineData.vue';
import RealTime from './components/RealTime.vue';
@Component({
    components: {
        OfflineData,
        RealTime
    }
})
export default class DataSource extends Vue {
    private activeName: string = 'offLine';
    private changeAN(val: any) {
        console.log(val.name);
        this.activeName = val.name;
        if (val.name === 'offLine') {
            (this.$refs['offLine'] as OfflineData).init();
        } else {
            (this.$refs['realTime'] as RealTime).init();
        }
    }
    private mounted() {
        (this.$refs['offLine'] as OfflineData).init();
    }
}
</script>
<style scoped lang="scss">
.data-source-section {
    padding: 10px 20px;
}
/deep/ .el-tabs__header{
    margin-bottom: 0;
}
/deep/ .el-tabs__item {
    width: 150px;
    height: 50px;
    text-align: center;
    box-sizing: content-box;
    line-height: 50px;
}
</style>
