<template>
    <section class="erp-select-section">
        <el-select
            class="com-select erp-select"
            size="small"
            v-model="adminUserName"
            filterable
            remote
            clearable
            placeholder="请输入群体负责人"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="changeSelect"
        >
            <el-option v-for="item in userList" :key="item.erpName" :label="item.erpName" :value="item.erpName">
            </el-option>
        </el-select>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class SetCrowd extends Vue {
    @Prop({ type: String }) private adminUser?: any;
    private loading: boolean = false;
    private userList: any[] = [];

    private adminUserName: string = '';

    private remoteMethod(query: string): void {
        if (query !== '') {
            this.loading = true;
            setTimeout(() => {
                const params: any = {
                    keyword: query
                };
                this.$api
                    .get('/api/ava/token/getErpUser', params)
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
    private changeSelect(erp:any) {
        if (erp || this.adminUser) {
            this.$api
                .get('/api/ava/token/getErpUserDetail', {'erp': erp || this.adminUser})
                .then((res: any) => {
                    console.log(res.organizationFullName);
                    if(res.organizationFullName){
                        this.adminUserName = res.organizationFullName.concat("-").concat(res.displayName);
                    }else{
                        this.adminUserName = '';
                    }
                    this.$emit('checkAdmin',this.adminUserName,res.erpName);
                })
                .finally(() => {
                    this.loading = false;
                });
        }else{
            this.$emit('checkAdmin','','');

        }
    }

}
</script>

<style scoped lang="scss">
.erp-select {
    width: 100%;
}
</style>
