<template>
    <section class="step-line">
        <div class="tag-step">
            <div class="tag-step_item" :class="{ active: stepNum === 0, success: stepNum > 0 }">
                <div class="tag-step_label">
                    <span><i class="el-icon-check" v-if="stepNum > 0"></i><b v-else>1</b></span>
                    <em>条件筛选</em>
                </div>
                <div class="last-bg">
                    <div class="last-border"></div>
                </div>
            </div>
            <div class="tag-step_item" :class="{ active: stepNum === 1, success: stepNum > 1 }">
                <div class="first-bg">
                    <div class="first-border"></div>
                </div>
                <div class="tag-step_label">
                    <span><i class="el-icon-check" v-if="stepNum > 1"></i><b v-else>2</b></span>
                    <em>逻辑组合</em>
                </div>
                <div class="last-bg">
                    <div class="last-border"></div>
                </div>
            </div>
            <div class="tag-step_item" :class="{ active: stepNum === 2, success: stepNum > 2 }">
                <div class="first-bg">
                    <div class="first-border"></div>
                </div>
                <div class="tag-step_label">
                    <span><i class="el-icon-check" v-if="stepNum > 2"></i><b v-else>3</b></span>
                    <em>群体创建</em>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class StepLine extends Vue {
    @Prop({ type: Number, default: 0 }) private stepNum?: number;
}
</script>

<style scoped lang="scss">
.step-line {
    height: 60px;
}
.tag-step {
    height: 100%;
    @include align-center;
    justify-content: space-between;
    .tag-step_item {
        width: 32.5%;
        height: 100%;
        justify-content: center;
        @include align-center;
        position: relative;
        &.active {
            &:first-child {
                border-left: 2px solid $color;
            }
            &:last-child {
                border-right: 2px solid $color;
            }
            border-top: 2px solid $color;
            border-bottom: 2px solid $color;
            .first-bg {
                border-color: $color $color $color #f5f9fc;
            }
            .last-bg {
                border-color: transparent transparent transparent $color;
            }
            .last-border,
            .first-border {
                display: block;
            }
            .tag-step_label {
                span {
                    border-color: $color;
                    background: $color;
                    color: #fff;
                }
                em {
                    color: #333;
                }
            }
        }
        &.success {
            .tag-step_label {
                span {
                    border-color: #6db247;
                    color: #6db247;
                }
                em {
                    color: #6db247;
                }
            }
        }
    }
    .first-bg {
        width: 0;
        height: 0;
        border-width: 30px;
        border-style: solid;
        border-color: #fff #fff #fff #f5f9fc;
        position: absolute;
        top: -2;
        left: 0;
        z-index: 1;
    }
    .last-bg {
        width: 0;
        height: 0;
        border-width: 30px;
        border-style: solid;
        border-color: transparent transparent transparent #fff;
        position: absolute;
        top: -2px;
        right: -60px;
        z-index: 2;
    }
    .first-border {
        width: 0;
        height: 0;
        border-width: 28px;
        border-style: solid;
        border-color: #fff #fff #fff transparent;
        position: absolute;
        top: -28px;
        right: -30px;
        z-index: 2;
        display: none;
    }
    .last-border {
        width: 0;
        height: 0;
        border-width: 28px;
        border-style: solid;
        border-color: transparent transparent transparent #fff;
        position: absolute;
        top: -28px;
        right: -26px;
        z-index: 2;
        display: none;
    }
    .tag-step_label {
        height: 100%;
        background: #fff;
        white-space: nowrap;
        @include align-center;
        justify-content: center;
        flex: 1;
        span {
            width: 36px;
            height: 36px;
            @include align-center;
            justify-content: center;
            border-radius: 50%;
            color: #d5e3ff;
            border: 2px solid #d5e3ff;
            font-size: 18px;
            margin-right: 8px;
        }
        em {
            font-size: 16px;
            color: #a6a6a6;
        }
    }
}
</style>
