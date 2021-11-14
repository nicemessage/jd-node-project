<template>
    <div>
        <span
            v-if="legendWidth - frame.fontRight >= maxWidth"
            @click="legendScrollLeft"
            :style="legendIndex <= 0 ? 'opacity: 0.5' : ''"
            :class="'legend-bt' + (legendIndex <= 0 ? ' legend-bt-disabled' : '')"
            ><i class="el-icon-caret-left"></i>
        </span>
        <div
            :style="
                'display: inline-block; overflow: hidden;' + (legendWidth - frame.fontRight >= maxWidth ? 'width: calc(100% - 120px);' : 'width:100%')
            "
        >
            <div
                :style="
                    'width:' +
                        legendWidth +
                        'px; white-space: nowrap; margin: 0 auto;' +
                        (legendWidth - frame.fontRight >= maxWidth ? 'margin-left:-' + legendOffset + 'px;' : 'margin-left: auto;')
                "
            >
                <span @click="legendTypeChange(item)" class="legend-item" v-for="(item, idx) in tempData" :key="idx">
                    <span class="legend-item-color" :style="item.hide ? 'background-color:darkgray' : 'background-color:' + colors[idx % 10]"></span>
                    <span :style="item.hide ? 'color:lightgray' : ''">{{ item.tagValCn }}</span>
                </span>
            </div>
        </div>
        <span
            v-if="legendWidth - frame.fontRight >= maxWidth"
            :class="'legend-bt' + (displayLegendRight ? ' legend-bt-disabled' : '')"
            :style="'margin-left:0;' + (displayLegendRight ? 'opacity: 0.5' : '')"
            @click="legendScrollRight"
        >
            <i class="el-icon-caret-right"></i>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class HorChartLegend extends Vue {
    // **************** 图例逻辑 ******************
    private frame = {
        colorWidth: 12,
        colorHeight: 6,
        colorRight: 4,
        fontSize: 12,
        fontRight: 8,
    };
    @Prop({
        default: '12px sans-serif',
    })
    private font?: string; // 字体，默认14号字

    @Prop() private data: any; // 图表数据
    @Watch('data', { immediate: true })
    changeData(val: any) {
        this.tempData = [].concat(this.data);
        this.calcLegend();
    }

    @Prop({
        default: ['#4775FE', '#56CB80', '#3EACFF', '#8F6DFF', '#F8BB3E', '#ACDA52', '#0DB4AD', '#F8894F', '#EA63B0', '#FF6D7F'],
    })
    private colors?: Array<string>;

    mounted() {
        this.$nextTick(() => {
            this.maxWidth = this.$el.clientWidth - 120;

            window.onresize = () => {
                this.maxWidth = this.$el.clientWidth - 120;
            };
        });
    }

    private tempData: any = []; // 图例数据
    private maxWidth: number = 0; // 最大宽度
    private calcCanvas: any = null; // 宽度计算画布
    private legendWidth: number = 0; // 图例宽度
    // 获取到图例，开始计算宽度
    private calcLegend() {
        this.legendOffset = 0;
        this.legendIndex = 0;
        let width = 0;
        if (this.calcCanvas == null) {
            this.calcCanvas = document.createElement('canvas');
        }
        const context = this.calcCanvas.getContext('2d');
        context.font = this.font;
        this.tempData.forEach((item: any) => {
            item.width = context.measureText(item.tagValCn).width + this.frame.colorWidth + this.frame.colorRight + this.frame.fontRight;
            width += item.width;
        });
        if (width > 0) {
            width -= this.frame.fontRight;
        }
        this.legendWidth = width;
        // console.log('change legend', width);
    }
    private legendOffset: number = 0; // 图例偏移量
    private legendIndex: number = 0; // 图例偏移索引
    // 向左
    private legendScrollLeft() {
        this.scrollLegend(this.legendIndex - 1);
    }
    // 向右
    private legendScrollRight() {
        this.scrollLegend(this.legendIndex + 1);
    }
    // 是否高亮显示右按钮
    private get displayLegendRight(): boolean {
        return this.legendWidth - this.legendOffset - this.frame.fontRight + 1 <= this.maxWidth;
    }
    // 滚动图例具体方法，以索引为基准
    private scrollLegend(idx: number) {
        // console.log(idx);
        if (idx < 0 || idx >= this.tempData.length) {
            return;
        }
        if (idx > this.legendIndex && this.legendWidth - this.legendOffset - this.frame.fontRight + 1 <= this.maxWidth) {
            // 已经到头了
            return;
        }
        this.legendIndex = idx;
        let offset = 0;
        for (let i = 0; i < this.legendIndex; i++) {
            const item = this.tempData[i];
            offset += item.width;
        }
        this.legendOffset = offset;
    }
    // 图例样式更替：点击图例隐藏相对数值
    private legendTypeChange(item: any) {
        item.hide = !item.hide;
        // 隐藏回调
        this.$emit('changeLegend', this.tempData);
    }
    // 是否展示图例
    // private get canShowLegend(): boolean {
    //     return this.showLegend && this.chartType != 'ring' && !(!this.crowd || this.crowd === '') && this.tempData.length > 0;
    // }
    // 重置图例数据
    public resetLegend() {
        this.tempData.forEach((item: any) => {
            item.hide = false;
        });
        // 隐藏回调
        this.$emit('changeLegend', this.tempData);
    }
}
</script>

<style lang="scss">
.legend-item {
    cursor: pointer;
    user-select: none;
    margin-right: 8px;
    font-size: 12px;

    &:last-child {
        margin-right: 0;
    }

    .legend-item-color {
        display: inline-block;
        width: 12px;
        height: 6px;
        border-radius: 1px;
        margin-right: 4px;
        margin-bottom: 1px;
    }

    &:hover {
        .legend-item-color {
            opacity: 0.75;
        }
    }
}
.legend-bt {
    display: inline-block;
    width: 30px;
    overflow: hidden;
    height: 30px;
    margin-left: 30px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    .legend-bt-disabled {
        cursor: inherit;
        pointer-events: none;
    }
}
</style>
