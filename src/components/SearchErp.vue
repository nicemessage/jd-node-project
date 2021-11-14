<template>
    <div class="search-erp">
        <el-select v-model="data" placeholder="请输入用户Id" :size="size" filterable remote clearable :multiple="multiple" :multiple-limit="multipleLimit" prefix-icon="el-icon-search" :remote-method="getErpUser" :loading="selectLoading" @change="update" style="width:100%;">
            <el-option v-for="(item, index) in erpList" :key="`erp-${index}`" :label="`${item.erpName}`" :value="item.erpName">
            </el-option>
        </el-select>
    </div>
</template>

<script lang="ts">
/**
 * @name ProtoType
 * @author your name
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明

@Component({
    components: {}
})
export default class SearchErp extends Vue {
    @Prop() value!: any;

    @Prop()
    size!: any;

    @Watch('value')
    private valueChange() {
        this.init();
    }

    @Prop({
        default: false
    })
    multiple!: boolean;
    @Prop({
        default: 0
    })
    multipleLimit!: number;
    @Prop({
        default: 'medium'
    })
    size!: string;

    private selectLoading: boolean = false;

    private erpList: any = [];

    private data: any = null;

    private mounted() {
        this.init();
    }

    private init() {
        if (!this.value) {
            this.data = this.multiple ? [] : null;
        } else {
            this.data = this.value;
            this.getErpUser(this.value);
        }
    }

    private update(value: any) {
        this.$emit('update:value', value);
    }

    // ========== ajax request  ==========

    private getErpUser(keyword: string) {
        if (typeof keyword == 'object') {
            return;
        }
        if (!keyword || keyword === '') {
            this.erpList = [];
            return;
        }
        const url = '/api/ava/token/getErpUser';
        const data: object = {};
        if (keyword) {
            Object.assign(data, {
                keyword: keyword
            });
        }
        this.selectLoading = true;
        this.$api
            .get(url, data)
            .then((res: any) => {
                this.erpList = res;
                this.selectLoading = false;
            })
            .catch(err => {
                console.log(err);
                this.selectLoading = false;
            });
    }

    private getErpUserDetail(erp: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/token/getErpUserDetail';
            const data: object = {
                erp: erp
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
}
</script>
<style lang="scss" scoped>
.search-erp {
    width: 100%;
    height: 100%;
}
</style>
