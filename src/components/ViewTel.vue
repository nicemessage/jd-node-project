<template>
    <section
        class="view-tel"
        v-loading="isLoading"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255)"
    >
        <div class="view-canvas_top">
            <div class="select-section" v-if="isSuccess">
                <el-select class="view-select" placeholder="请选择" v-model="viewType" @change="typeChange">
                    <el-option v-for="(item, index) in viewTypes" :key="index" :label="item.type" :value="item.val"> </el-option>
                </el-select>
                <el-select class="view-select black" placeholder="展开" v-model="viewEvent" @change="eventChange" clearable>
                    <el-option v-for="(item, index) in viewEvents" :key="index" :label="item.name" :value="item.data"> </el-option>
                </el-select>
            </div>
            <el-button class="com-button" v-else @click="removeTel">删除</el-button>
        </div>
        <div class="canvas-el" v-show="isSuccess" ref="charts"></div>
        <div class="view-error" v-if="!isSuccess">
            计算失败
        </div>
        <el-dialog :close-on-click-modal="false" :title="viewData.name" :visible.sync="dataDialog" custom-class="com-dialog view-dialog" top="0" width="60%" :lock-scroll="true">
            <com-table :tableData="viewData.data" :columnData="enumColumn"></com-table>
        </el-dialog>
    </section>
</template>

<script lang="ts">
import echarts from 'echarts';
import chartTool from '@/assets/utils/chart-tool.ts';
import ComTable from '@/components/ComTable.vue';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
    components: {
        ComTable
    }
})
export default class ViewTel extends Vue {
    @Prop({ type: Object }) private viewParams?: any;
    private viewData: any = {};
    private viewEx: any = {};
    private telIndex: number | null = null;
    private viewTypes: any[] = [
        {
            type: '柱状图',
            val: 1
        },
        {
            type: '饼图',
            val: 2
        },
        {
            type: '折线图',
            val: 3
        },
        {
            type: '散点图',
            val: 4
        }
    ]; //图类型
    private viewEvents: any[] = [
        {
            name: '列表',
            data: 1
        },
        {
            name: '下载',
            data: 2
        },
        {
            name: '修改',
            data: 3
        },
        {
            name: '删除',
            data: 4
        }
    ]; //图功能
    private viewType: number = 1;
    private viewEvent: null | number = null;
    private canvasEl: any = null;
    private isSuccess: boolean = true;
    private isLoading: boolean = false;
    private dataDialog: boolean = false;
    private enumColumn: any[] = [
        {
            prop: 'name',
            label: '枚举名称'
        },
        {
            prop: 'value',
            label: '数量'
        },
        {
            prop: 'prop',
            label: '占比'
        }
    ];
    @Watch('viewParams', { immediate: true, deep: true })
    private handler(val: any): void {
        console.log(val);
        if (val.viewInfo && val.viewInfo.data[0] && !val.viewInfo.isApi) {
            this.isLoading = true;
            this.isSuccess = true;
            this.viewData = val.viewInfo;
            this.viewEx = val.viewEx;
            this.telIndex = val.viewIndex;
            this.getViewData();
        }
    }
    private beforeDestroty(): void {
        this.removeEvent();
    }
    private getViewData(): void {
        const params = {
            portraitExpression: JSON.stringify(this.viewEx)
        };
        this.$api
            .post('/api/business/portrait/estimate', params)
            .then((res: any) => {
                let allNum: number = 0;
                for (const key in res) {
                    const index = this.viewData.data.findIndex((d: any) => d.id == key);
                    if (index > -1) {
                        this.viewData.data[index].value = (res as any)[key];
                    }
                    allNum += (res as any)[key];
                }
                this.viewData.data.forEach((item: any) => {
                    if (allNum > 0) {
                        item.prop = `${((item.value / allNum) * 100).toFixed(2)}%`;
                    } else {
                        item.prop = '0%';
                    }
                });
                this.$set(this.viewData, 'isApi', true);
                if (!this.canvasEl) {
                    this.canvasEl = echarts.init(this.$refs.charts as HTMLDivElement);
                }
                this.setEchart();
                this.bindEvent();
            })
            .catch(() => {
                this.isSuccess = false;
                this.isLoading = false;
            });
    }
    private getOption(): any {
        switch (this.viewType) {
            case 1:
                return chartTool.bar(this.viewData.name, this.viewData.data);
            case 2:
                return chartTool.pie(this.viewData.name, this.viewData.data);
            case 3:
                return chartTool.line(this.viewData.name, this.viewData.data);
            case 4:
                return chartTool.scatter(this.viewData.name, this.viewData.data);
            default:
                return chartTool.bar(this.viewData.name, this.viewData.data);
        }
    }
    private setEchart(): void {
        this.canvasEl.setOption(this.getOption());
        this.isLoading = false;
    }
    private bindEvent(): void {
        window.addEventListener('resize', this.resizeEvent, true);
    }
    private removeEvent(): void {
        window.removeEventListener('resize', this.resizeEvent, true);
    }
    private resizeEvent(): void {
        this.canvasEl.resize();
    }
    private typeChange(): void {
        this.canvasEl.clear();
        this.setEchart();
    }
    private eventChange(): void {
        let a: any, img: any;
        switch (this.viewEvent) {
            case 1:
                this.dataDialog = true;
                break;
            case 2:
                a = document.createElement('a');
                img = this.canvasEl.getDataURL({
                    type: 'png',
                    backgroundColor: '#fff'
                });
                a.setAttribute('href', img);
                a.setAttribute('download', this.viewData.name);
                a.click();
                break;
            case 3:
                this.editTel();
                break;
            case 4:
                this.removeTel();
                break;
        }
        this.viewEvent = null;
    }
    private editTel(): void {
        this.$emit('modifyTel', this.telIndex);
    }
    private removeTel(): void {
        this.$emit('removeTel', this.telIndex);
    }
}
</script>

<style scoped lang="scss">
.view-tel,
.canvas-el {
    width: 100%;
    height: 100%;
}
.view-tel {
    position: relative;
}
.view-canvas_top {
    width: 100%;
    height: 50px;
    @include align-center;
    justify-content: flex-end;
    padding: 0 24px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background: transparent;
}
.view-title {
    font-size: 12px;
    font-weight: 600;
}
::v-deep .select-section {
    .view-select {
        width: 74px;
        height: 24px;
        background: #fff;
        margin-right: 10px;
        &.black {
            .el-input__inner {
                &::placeholder {
                    color: #000;
                }
            }
        }
        &:last-child {
            margin: 0;
        }
        .el-input__inner {
            background: #fff;
            height: 24px;
            line-height: 24px;
            color: #000;
            font-size: 12px;
            padding-right: 20px;
        }
        .el-input__icon {
            width: 14px;
            line-height: 24px;
        }
    }
}
.view-error {
    width: 100%;
    height: 100%;
    background: url(../assets/img/data-empty.png) center center no-repeat;
    background-size: auto;
    font-size: 12px;
    color: #888;
    text-align: center;
    padding-top: 268px;
}
</style>
