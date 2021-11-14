<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class App extends Vue {
}
</script>
<style lang="scss">
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-width: 800px;
    height: 100%;
    overflow-y: auto;
    background: #F6F8FA;
}
.tag-warp_li {
    list-style: none;
    height: 40px;
    line-height: 40px;
    text-align: center;
    @include more-ellipsis;
    padding: 0 30px 0 10px;
    font-size: 12px;
    margin-bottom: 10px;
    border: 1px dashed $color;
    color: $color;
    cursor: pointer;
    position: relative;
    user-select: none;
    .el-icon-close {
        opacity: 0;
    }
}
</style>
