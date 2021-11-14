<template>
    <div class="no-data">
        <img src="@/assets/img/no-data.svg" alt="" />
        <p>{{ label }}</p>
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
import { Component, Vue, Prop } from 'vue-property-decorator';

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
export default class NoData extends Vue {
    @Prop({
        default: '暂无数据'
    })
    private label!: string;
}
</script>
<style lang="scss" scoped>
.no-data {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: default;

    img {
        width: 84px;
        height: 84px;
        margin-bottom: 10px;
    }
    p {
        font-size: 0.75rem;
        color: rgba(189, 189, 189, 1);
    }
}
</style>
