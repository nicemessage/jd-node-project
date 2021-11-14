<template>
    <div class="portrait-item">
        <div class="header">
            <div class="label">
                {{ template.tagVal }}
            </div>
            <div class="actions">
                <div class="chart-type-select">
                    <el-select v-model="chartType" placeholder="请选择" size="mini" @change="chartTypeChange">
                        <el-option v-for="item in chartTypeMap" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </div>
                <div class="chart-action">
                    <el-dropdown @command="handleCommand" size="small">
                        <el-button size="mini">展开</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(action, index) of chartAction" :key="`action-idx-${index}`" :command="action.value">{{
                                action.label
                            }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <HorChartLegend ref="legend" v-if="canShowLegend" :colors="colors" :data="tempData" @changeLegend="changeLegend" class="legend-box">
        </HorChartLegend>
        <div class="content" v-if="!crowd || crowd === ''">
            <div class="no-data">
                <NoData label="暂无数据"></NoData>
            </div>
        </div>
        <div class="content" v-else :id="template.id"></div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDataDetailDialog" width="600px">
            <div slot="title" class="dialog-title">原始数据</div>
            <el-table :data="data" size="small" style="width: 100%" max-height="500">
                <el-table-column :label="template.tagVal">
                    <el-table-column prop="tagValCn" label="枚举" min-width="120"> </el-table-column>
                    <el-table-column prop="count" label="数值" min-width="120"> </el-table-column>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/**
 * @name PortraitItem
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
import echarts from 'echarts';

// 静态配置引入

// 公共组件引入
import NoData from '@/components/NoDataIcon.vue';
import HorChartLegend from '@/components/HorChartLegend.vue';

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明

@Component({
    components: {
        NoData,
        HorChartLegend,
    },
})
export default class PortraitItem extends Vue {
    @Prop({
        required: true,
    })
    template!: any;
    @Watch('template')
    private templateChange() {
        this.loadData();
    }

    @Prop()
    crowd!: any;
    @Watch('crowd')
    private crowdChange(newVal: any) {
        if (!newVal || newVal === '') {
            this.chart.clear();
            this.chart.dispose();
            this.chart = null;
        } else {
            this.$nextTick(() => {
                this.init();
            });
        }
    }

    @Prop({
        default: true,
    })
    plain!: boolean;
    // **************** 图例逻辑 ******************
    @Prop({
        default: true,
    })
    showLegend!: boolean; // 是否展示图例，默认展示
    private tempData = [];
    // 是否展示图例
    private get canShowLegend(): boolean {
        return this.showLegend && this.chartType != 'ring' && !(!this.crowd || this.crowd === '') && this.tempData.length > 0;
    }
    // 修改图例
    private changeLegend(data: any) {
        this.tempData = data;
        this.data = this.tempData.filter((d: any) => {
            return !d.hide;
        });
        this.buildChart();
    }

    private chart: any = null;

    private colors: Array<string> = ['#4775FE', '#56CB80', '#3EACFF', '#8F6DFF', '#F8BB3E', '#ACDA52', '#0DB4AD', '#F8894F', '#EA63B0', '#FF6D7F'];

    private chartType: string = 'line';
    // @Watch('chartType')
    // private chartTypeChange() {
    //     this.buildChart();
    // }

    private chartTypeChange() {
        this.$bus.$emit('chart-type-item', Object.assign(this.template, { chartTypeName: this.chartType }));
        this.$nextTick(() => {
            if (this.$refs['legend']) {
                (this.$refs['legend'] as any).resetLegend();
            }
        });
        this.buildChart();
    }

    private chartTypeMap: any = [
        {
            label: '柱状图',
            value: 'bar',
        },
        {
            label: '折线图',
            value: 'line',
        },
        {
            label: '散点图',
            value: 'scatter',
        },
        {
            label: '环形图',
            value: 'ring',
        },
    ];

    private chartAction: any = [
        {
            label: '原始数据',
            value: 'show-data',
        },
        // {
        //   label: '下载',
        //   value: 'download'
        // },
        {
            label: '移除',
            value: 'remove',
        },
    ];

    private showDataDetailDialog: boolean = false;

    private data: any = [];

    private DEFAULT_SHOW_ZOOM: number = 10;

    private mounted() {
        this.init();
    }

    private init() {
        const dom = document.getElementById(this.template.id);
        if (!dom) {
            return;
        }
        if (!this.chart) {
            this.chart = echarts.init(dom as HTMLDivElement);
        }

        this.loadData();
        // if (this.crowd) {
        // }
    }

    private loadData() {
        console.log('loadData');
        // if (!this.crowd || this.crowd === '') {
        //   return;
        // }
        try {
            // const express = JSON.parse(this.crowd.crowdDefine);
            // const data = {
            //   version: '5.0',
            //   expression: express,
            //   profile: {
            //     tagCode: this.template.tagCode,
            //     colVals: this.template.tagEnums.map((obj: any) => {
            //       return obj.key;
            //     }),
            //     type: 'PROFILE'
            //   },
            //   style: this.crowd.crowdType == 2 ? 'FILE_PROFILE' : 'COND_PROFILE'
            // };
            // console.log(data.profile, this.template);
            this.data = this.makeData(this.template);
            this.tempData = [].concat(this.data);
            this.autoSetChartType();
            this.buildChart();
            // this.getTemplateData(JSON.stringify(data)).then((res: any) => {
            //   this.data = res.sort(this.compare('sort'));
            //   this.autoSetChartType();
            //   this.buildChart();
            // });
        } catch (e) {
            console.log(e);
            this.data = [];
            this.chart.clear();
        }
    }

    private compare(property: any) {
        return function(a: any, b: any) {
            const value1 = a[property];
            const value2 = b[property];
            return value1 - value2;
        };
    }

    private makeData(data: any) {
        const { tagEnums, tagCode } = data;
        const fakeList: any[] = [];
        tagEnums.forEach((item: any, index: number) => {
            const obj = {
                tagVal: `${tagCode}_${item.key}`,
                tagValCn: item.value,
                sort: index,
                count: Math.floor(Math.random() * (9999 - 99)) + 99,
            };
            fakeList.push(obj);
        });
        return fakeList;
    }

    private remove() {
        (this.$parent as any).removeItem(this.template.id);
        // this.$bus.$emit('remove-portrait-item', this.template.tagCode);
    }

    private handleCommand(command: string) {
        switch (command) {
            case 'show-data':
                this.showDataDetailDialog = true;
                break;
            case 'download':
                this.downloadPicture();
                break;
            case 'remove':
                this.remove();
                break;
            default:
                return;
        }
    }

    private autoSetChartType() {
        console.log(this.template.chartType);
        if (this.template.chartType == 0 || this.template.chartType) {
            this.chartType = this.chartTypeMap[this.template.chartType].value;
            return;
        }
        if (this.data.length < 2) {
            this.chartType = 'bar';
            return;
        }
        const idx = Math.ceil(Math.random() * 4);
        if (!this.chartTypeMap[idx]) {
            this.chartType = 'bar';
        } else {
            this.chartType = this.chartTypeMap[idx].value;
        }
    }

    private getRandomColor() {
        const idx = Math.ceil(Math.random() * this.colors.length) - 1;
        if (!this.colors[idx]) {
            return this.colors[0];
        }
        return this.colors[idx];
    }

    private buildChart() {
        let option = null;
        switch (this.chartType) {
            case 'line':
                option = this.buildLine();
                break;
            case 'bar':
                option = this.buildBar();
                break;
            case 'ring':
                option = this.buildRing();
                break;
            case 'scatter':
                option = this.buildScatter();
                break;
        }
        if (this.canShowLegend) {
            option!.grid.top = '45';
        }
        if (option) {
            this.chart.setOption(option, true);
            this.chart.resize();
        }
    }

    // 单位
    private unitMap: any = {
        '0': '',
        '10000': '万',
        '1000000': '百万',
        '10000000': '千万',
        '100000000': '亿',
    };

    // 判断适应的单位
    private addUnit(n: any) {
        if (n) {
            if (n > 100000000) {
                return 100000000;
            }
            if (n > 10000000) {
                return 10000000;
            }
            if (n > 1000000) {
                return 1000000;
            }
            if (n > 100000) {
                return 10000;
            }
        }
        return 0;
    }

    private buildLine() {
        const xData: any = [];
        const yData: any = [];
        const arrs: any = this.data.map((value: any) => {
            return value.count;
        });
        const yDataMax: any = Math.max(...arrs);

        const unitVal: number = this.addUnit(yDataMax);
        const unit: string = this.unitMap[this.addUnit(yDataMax)];

        if (this.canShowLegend) {
            this.tempData.forEach((item: any, index: number) => {
                if (!item.hide) {
                    xData.push(item.tagValCn);
                    if (unitVal == 0) {
                        yData.push({
                            name: item.tagValCn,
                            value: item.count,
                            itemStyle: { color: this.colors[index % 10] },
                        });
                    } else {
                        yData.push({
                            name: item.tagValCn,
                            value: (item.count / unitVal).toLocaleString(),
                            itemStyle: { color: this.colors[index % 10] },
                            emphasis: { itemStyle: { borderWidth: 4 } },
                        });
                    }
                }
            });
        } else {
            this.data.forEach((item: any) => {
                xData.push(item.tagValCn);
                if (unitVal == 0) {
                    yData.push(item.count);
                } else {
                    yData.push((item.count / unitVal).toLocaleString());
                }
            });
        }
        const color = this.getRandomColor();
        const option = {
            color: this.colors,
            grid: {
                left: '20',
                right: '20',
                top: '15',
                bottom: '20',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12,
                },
                formatter: function(a: any) {
                    return `${a[0].name}：${a[0].value}${unit}`;
                },
            },
            xAxis: {
                type: 'category',
                scale: true,
                data: xData,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A3A3A3',
                    formatter: function(a: any) {
                        return a + unit;
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#F0F0F0',
                    },
                },
            },
            series: [
                {
                    data: yData,
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        shadowBlur: 8,
                        shadowOffsetX: 2,
                        shadowOffsetY: 5,
                    },
                },
            ],
        };

        if (xData.length > this.DEFAULT_SHOW_ZOOM && !this.plain) {
            option.grid.bottom = '40';
            Object.assign(option, {
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 1,
                        end: 35,
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 1,
                        end: 35,
                    },
                ],
            });
        }

        return option;
    }

    private buildBar() {
        const xData: any = [];
        const yData: any = [];
        const arrs: any = this.data.map((value: any) => {
            return value.count;
        });
        const yDataMax: any = Math.max(...arrs);

        const unitVal: number = this.addUnit(yDataMax);
        const unit: string = this.unitMap[this.addUnit(yDataMax)];

        if (this.canShowLegend) {
            this.tempData.forEach((item: any, index: number) => {
                if (!item.hide) {
                    xData.push(item.tagValCn);
                    if (unitVal == 0) {
                        yData.push({
                            name: item.tagValCn,
                            value: item.count,
                            itemStyle: { color: this.colors[index % 10] },
                        });
                    } else {
                        yData.push({
                            name: item.tagValCn,
                            value: (item.count / unitVal).toLocaleString(),
                            itemStyle: { color: this.colors[index % 10] },
                            emphasis: { itemStyle: { borderWidth: 4 } },
                        });
                    }
                }
            });
        } else {
            this.data.forEach((item: any) => {
                xData.push(item.tagValCn);
                if (unitVal == 0) {
                    yData.push(item.count);
                } else {
                    yData.push((item.count / unitVal).toLocaleString());
                }
            });
        }
        const option = {
            color: this.colors,
            grid: {
                left: '20',
                right: '20',
                top: '15',
                bottom: '20',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12,
                },
                formatter: function(a: any) {
                    return `${a[0].name}：${a[0].value}${unit}`;
                },
            },
            xAxis: {
                type: 'category',
                scale: true,
                data: xData,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A3A3A3',
                    formatter: function(a: any) {
                        return a + unit;
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#F0F0F0',
                    },
                },
            },
            series: [
                {
                    data: yData,
                    type: 'bar',
                    barMaxWidth: '25%',
                },
            ],
        };

        if (xData.length > this.DEFAULT_SHOW_ZOOM && !this.plain) {
            option.grid.bottom = '40';
            Object.assign(option, {
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 1,
                        end: 35,
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 1,
                        end: 35,
                    },
                ],
            });
        }

        return option;
    }

    private buildRing() {
        const data: any = [];
        let max = -Infinity,
            min = Infinity;
        this.data.forEach((item: any) => {
            data.push({
                name: item.tagValCn,
                value: item.count,
            });
            max = Math.max(max, item.count);
            min = Math.min(min, item.count);
        });
        let roseType: boolean | string = false;
        if (max / min > 20) {
            roseType = 'radius';
        }
        const option = {
            color: this.colors,
            grid: {
                left: '20',
                right: '20',
                top: '15',
                bottom: '20',
                containLabel: true,
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
                textStyle: {
                    fontSize: 12,
                },
            },
            series: [
                {
                    name: this.data.tagVal,
                    data: data,
                    type: 'pie',
                    radius: ['40%', '60%'],
                    roseType: roseType,
                },
            ],
        };
        if (!this.plain) {
            Object.assign(option, {
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 10,
                    bottom: 20,
                },
            });
        }
        if (this.showLegend) {
            Object.assign(option, {
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 10,
                    bottom: 20,
                    itemWidth: 12,
                    itemHeight: 6,
                    textStyle: {
                        fontSize: 12,
                    },
                },
            });
        }
        return option;
    }

    private buildScatter() {
        const xData: any = [];
        const yData: any = [];
        const arrs: any = this.data.map((value: any) => {
            return value.count;
        });
        const yDataMax: any = Math.max(...arrs);

        const unitVal: number = this.addUnit(yDataMax);
        const unit: string = this.unitMap[this.addUnit(yDataMax)];

        if (this.canShowLegend) {
            this.tempData.forEach((item: any, index: number) => {
                if (!item.hide) {
                    xData.push(item.tagValCn);
                    if (unitVal == 0) {
                        yData.push({
                            name: item.tagValCn,
                            value: item.count,
                            itemStyle: { color: this.colors[index % 10] },
                        });
                    } else {
                        yData.push({
                            name: item.tagValCn,
                            value: (item.count / unitVal).toLocaleString(),
                            itemStyle: { color: this.colors[index % 10] },
                            emphasis: { itemStyle: { borderWidth: 4 } },
                        });
                    }
                }
            });
        } else {
            this.data.forEach((item: any) => {
                xData.push(item.tagValCn);
                if (unitVal == 0) {
                    yData.push(item.count);
                } else {
                    yData.push((item.count / unitVal).toLocaleString());
                }
            });
        }
        const option = {
            color: this.colors,
            grid: {
                left: '20',
                right: '20',
                top: '15',
                bottom: '20',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12,
                },
                formatter: function(a: any) {
                    return `${a[0].name}：${a[0].value}${unit}`;
                },
            },
            xAxis: {
                type: 'category',
                scale: true,
                data: xData,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A3A3A3',
                    formatter: function(a: any) {
                        return a + unit;
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#F0F0F0',
                    },
                },
            },
            series: [
                {
                    data: yData,
                    type: 'scatter',
                },
            ],
        };

        if (xData.length > this.DEFAULT_SHOW_ZOOM && !this.plain) {
            option.grid.bottom = '40';
            Object.assign(option, {
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 1,
                        end: 35,
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 1,
                        end: 35,
                    },
                ],
            });
        }

        return option;
    }

    private downloadPicture() {
        if (!this.chart) {
            this.$message.warning('图表尚未生成');
            return;
        }
        const url = this.chart.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff',
        });
        const a: any = document.createElement('a');
        console.log(url);
        a.setAttribute('href', url);
        a.setAttribute('download', `${this.template.tagVal}.png`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ========== ajax request  ==========

    private getTemplateData(expression: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/portrait/count';
            const data = {
                expression: expression,
            };
            this.$api
                .post(url, data)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
</script>
<style lang="scss" scoped>
.portrait-item {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    position: relative;

    .header {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0px 8px;

        .label {
            font-size: 1rem;
            color: rgba(51, 51, 51, 1);
            font-weight: bold;
            cursor: default;
            padding-left: 10px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            .no-crowd {
                font-size: 0.75em;
                color: #bdbdbd;
                margin-left: 5px;
            }
        }
        .actions {
            display: flex;
            align-items: center;
            .chart-type-select {
                width: 120px;
            }
            .chart-action {
                margin-left: 10px;
            }
        }
    }
    .content {
        width: 100%;
        height: calc(100% - 60px);
        .no-data {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .legend-box {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        height: 30px;
        line-height: 30px;
        z-index: 1;
    }
}
</style>
