<template>
    <div class="app-touch">
        <div class="header">
            <div class="search-tool">
                <div class="search-item">
                    <SysSubject></SysSubject>
                </div>
            </div>
        </div>
        <div class="body">
            <TouchList></TouchList>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name AppTouch
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Vue, Component } from 'vue-property-decorator';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入
import SysSubject from '@/components/SysSubject.vue';
import NoData from '@/components/NoDataIcon.vue';

// 公共类引入

// 私有组件引入
import TouchList from './Touch-List.vue';

// 私有类引入

// 本地定义和声明

@Component({
    components: {
        SysSubject,
        TouchList,
        NoData
    }
})
export default class AppTouch extends Vue {
    private selectCrowd: any | null = null;
}
</script>
<style lang="scss" scoped>
.app-touch {
    width: 100%;
    height: 100%;
    background-color: #f9fafd;
    position: relative;
    overflow: hidden;

    .header {
        position: absolute;
        left:0;
        top:0;
        z-index: 2;
    }
    .body {
        width: 100%;
        height: 100%;
        margin-top: 4px;
        box-sizing: border-box;
        display: flex;
        padding: 0 20px 18px;
        &.no-data {
            margin-top: 52px;
            height: calc(100% - 52px);
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(189, 189, 189, 1);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
