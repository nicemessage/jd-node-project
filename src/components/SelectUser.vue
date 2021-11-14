<template>
    <section class="erp-select-section">
        <el-select
            class="com-select erp-select"
            v-model="crowdInfo.adminUser"
            multiple
            filterable
            remote
            clearable
            placeholder="请输入群体负责人，可多个"
            :multiple-limit="3"
            :remote-method="remoteMethod"
            :loading="loading"
            value-key="erp"
            @change="changeSelect"
        >
            <el-option v-for="item in userList" :key="item.erp" :label="`${item.organizationFullName}-${item.realName}`" :value="item.erp">
            </el-option>
        </el-select>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class SetCrowd extends Vue {
    @Prop({ type: Object }) private crowdInfo?: any;
    private loading: boolean = false;
    private userList: any[] = [];
    private remoteMethod(query: string): void {
        if (query !== '') {
            this.loading = true;
            setTimeout(() => {
                const params: any = {
                    keyWord: query
                };
                this.$api
                    .get('/api/business/tool/erpFuzzyQuery', params)
                    .then((res: any) => {
                        this.userList = res;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }, 200);
        } else {
            this.userList = [];
        }
    }
    private changeSelect() {
        this.$emit('checkAdmin');
    }
}
</script>

<style scoped lang="scss">
.erp-select {
    width: 100%;
}
</style>
