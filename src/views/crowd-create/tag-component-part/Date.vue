<template>
    <div class="tag-component">
        <div class="tag-component-name">{{ tagComponetName }}</div>
        <div class="tag-component-content">
            <template v-if="type == 11 || type == 19">
                <div class="time-content" v-show="!showLast">
                    <el-date-picker
                        v-model="time"
                        type="daterange"
                        unlink-panels
                        size="small"
                        :clearable="false"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="timestamp"
                        @change="updateValue"
                    >
                    </el-date-picker>
                </div>
                <div class="time-content" v-show="showLast">
                    <span>选择最近</span>
                    <el-input-number
                        size="mini"
                        v-model="lastDays"
                        controls-position="right"
                        :min="0"
                        :step="1"
                        :max="9999"
                        step-strictly
                        @change="updateValue"
                    >
                    </el-input-number>
                    <span>日（近9999日）</span>
                </div>
                <div class="last-switch">
                    <el-switch
                        v-model="showLast"
                        active-text="动态时间"
                        active-color="#13ce66"
                        :active-value="true"
                        inactive-text="静态时间"
                        inactive-color="#409EFF"
                        :inactive-value="false"
                    >
                    </el-switch>
                </div>
            </template>
            <template v-else-if="type == 16 || type == 17 || type == 18">
                <el-time-select v-model="time" :picker-options="getPickerOptions(type)" placeholder="选择时间"> </el-time-select>
            </template>
            <template v-else-if="type == 12">
                <el-date-picker v-model="time[0]" size="small" type="year" placeholder="选择开始年" value-format="timestamp" @change="updateValue"> </el-date-picker>
                <span> - </span>
                <el-date-picker v-model="time[1]" size="small" type="year" placeholder="选择结束年" value-format="timestamp" @change="updateValue"> </el-date-picker>
            </template>
            <template v-else>
                <el-date-picker
                    v-model="time"
                    :type="getDateType(type)"
                    unlink-panels
                    size="small"
                    :clearable="false"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    @change="updateValue"
                >
                </el-date-picker
            ></template>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name TagComponentDate
 * @author liang10
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

@Component
export default class TagComponentDate extends Vue {
    @Prop({
        required: true
    })
    private value!: any;

    @Prop({
        required: true
    })
    private type!: number;
    @Prop({
        required: true
    })
    private tagComponetName!: string;

    private time: any = null;

    private lastDays: number = 0;

    private showLast: boolean = false;

    private created() {
        this.init();
    }

    private init() {
        if (!this.value) {
            this.showLast = this.type == 19 ? true : false;
            if (this.type == 12) {
                this.time = [null, null];
            }
            return;
        }
        if (this.type == 11 || this.type == 19) {
            if (this.value.length > 1) {
                this.showLast = false;
                this.time = this.value;
            } else {
                this.showLast = true;
                this.lastDays = this.value[0] ? this.value[0] : 0;
            }
        } else {
            this.time = this.value;
        }
    }

    private getDateType(type: number) {
        if (type == 12) {
            return 'yearrange';
        }
        if (type == 13) {
            return 'monthrange';
        }
        if (type == 14) {
            return 'daterange';
        }
        if (type == 15) {
            return 'datetime';
        }
    }

    private getPickerOptions(type: number) {
        if (type == 16) {
            return {
                start: '00:00',
                step: '01:00',
                end: '24:00'
            };
        }
        if (type == 17) {
            return {
                start: '00:00',
                step: '00:01',
                end: '00:59'
            };
        }
        if (type == 18) {
            return {
                start: '00:00:00',
                step: '00:00:01',
                end: '00:00:59'
            };
        }
    }

    private updateValue() {
        if (this.type == 11 || this.type == 19) {
            if (this.showLast) {
                this.$emit('update:value', [this.lastDays]);
                this.$bus.$emit('updateTagValue');
            } else {
                this.$emit('update:value', this.time);
                this.$bus.$emit('updateTagValue');
            }
        } else {
            this.$emit('update:value', this.time);
            this.$bus.$emit('updateTagValue');
        }
    }
}
</script>
<style lang="scss" scoped>
.tag-component {
    width: 100%;
    height: auto;
    max-height: 500px;
    overflow-y: auto;
    padding:10px 20px 20px;
    background: #FBFCFF;
    border-bottom: 1px solid #EAF0F9;

    &-name {
        position: relative;
        width: 100%;
        height: 32px;
        line-height: 32px;
        font-size: 1rem;
        font-weight: bold;
        color: rgba(27, 27, 27, 1);
        cursor: default;
        padding-left: 10px;
        &::before {
            position: absolute;
            content: " ";
            width: 3px;
            height: 13px;
            overflow: hidden;
            left: 0;
            top: 9px;
            background: #3a57fe;
        }
    }
    &-content {
        width: 100%;
        height: auto;
        position: relative;

        .time-content {
            width: auto;
            height: 40px;
            display: flex;
            align-items: center;

            span {
                margin-left: 10px;
                margin-right: 10px;
            }

            &:first-child {
                margin-left: 0px;
            }
        }

        .last-switch {
            margin-top: 20px;
            padding-left: 10px;
        }
    }
}
</style>
