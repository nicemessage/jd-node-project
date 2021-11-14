<template>
    <div class="water-mark" :style="{ backgroundImage: `url(${mark})` }"></div>
</template>

<script lang="ts">
/**
 * @name WaterMark
 * @author niuzhiwei
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue } from "vue-property-decorator";

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
export default class WaterMark extends Vue {
    private mark: string = "";

    private markStr:string = "";

    private mounted() {
        this.getErpUserDetail();
    }

    private getErpUserDetail() {
        if (window.sessionStorage.getItem('userErp')) {
            this.markStr = window.sessionStorage.getItem('userErp');
            this.init();
            return false;
        }
        this.$api.get('/api/ava/token/getErpUserDetail').then((res: any) => {
            if(res.erpName){
                this.markStr = res.erpName;
                this.init();
            }
        });
    }

    private init() {
        const ctx = document.createElement("canvas");
        ctx.width = 150;
        ctx.height = 100;
        ctx.style.display = "none";
        const cans = ctx.getContext("2d");
        if (cans) {
            cans.rotate((-20 * Math.PI) / 180);
            cans.font = "12px Microsoft YaHei";
            cans.textAlign = "left";
            cans.textBaseline = "middle";
            cans.strokeStyle = "rgba(255, 255, 255, 0.05)";
            cans.strokeText(this.markStr || "京东科技", 0, 100);
            cans.fillStyle = "rgba(17, 17, 17, 0.05)";
            cans.fillText(this.markStr || "京东科技", 0, 100);
            cans.save();
        }
        this.mark = ctx.toDataURL();
        // return ctx.toDataURL();
    }
}
</script>
<style lang="scss" scoped>
.water-mark {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
}
</style>
