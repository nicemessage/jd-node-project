<template>
    <div class="tag-component">
        <div class="tag-component-name">{{ tagComponetName }}</div>
        <div class="tag-component-content">
            <div v-if="type == 31">
                <el-input-number size="small" v-model="startVal" :controls="false" @blur="updateValue"> </el-input-number>
                <span> - </span>
                <el-input-number size="small" v-model="endVal" :controls="false" @blur="updateValue"> </el-input-number>
            </div>
            <div v-else-if="type == 32">
                <div style="padding: 15px 0">
                    <el-input v-model.trim="text" size="small" clearable>
                        <template #append>
                            <el-button
                                type="primary"
                                size="small"
                                @click="finishInputEnum"
                                style="background: #2d68ff; color: #fff; border-radius: 0 3px 3px 0"
                            >
                                添加
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <!-- 枚举选择 -->
                <div style="margin: 15px 0; border: 1px #eee solid; padding: 15px; border-radius: 5px">
                    <el-tag style="padding: 0 10px 10px 5px; margin-right: 5px" v-for="(t, i) in texts" :key="i" @close="delEnum(i)" closable>
                        {{ t }}
                    </el-tag>
                </div>
                <!-- <el-input v-model="text" size="small" @change="updateValue"></el-input> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name TagComponentInput
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
    components: {},
})
export default class TagComponentInput extends Vue {
    @Prop({
        required: true,
    })
    private value!: any;
    @Prop({
        required: true,
    })
    private type!: number;
    @Prop({
        required: true,
    })
    private tagComponetName!: string;

    private text: string = '';
    private texts: string[] = [];
    private startVal: number | null = 0;
    private endVal: number | null = 0;

    private mounted() {
        this.init();
    }

    private init() {
        if (!this.value) {
            return;
        }
        if (this.type == 31) {
            this.startVal = this.value && this.value[0] ? this.value[0] : 0;
            this.endVal = this.value && this.value[1] ? this.value[1] : 0;
        } else if (this.type == 32) {
            // this.text = this.value && this.value[0] ? this.value[0] : 0;
            console.log(this.value);
            this.texts = this.value ? this.value : [];
        }
        // this.updateValue();
    }

    private finishInputEnum() {
        if (this.text && this.text.length > 0) {
            this.texts.push(this.text);
            this.text = '';
            this.$emit('update:value', this.texts);
            this.$bus.$emit('updateTagValue');
        }
    }

    private delEnum(idx: number) {
        // 删除枚举
        if (idx < this.texts.length) {
            this.texts.splice(idx, 1);
            this.$emit('update:value', this.texts);
            this.$bus.$emit('updateTagValue');
        }
    }

    /* 监听数字大小 */
    private updateValue() {
        if (this.type == 31) {
            if (!this.endVal) {
                this.endVal = 0;
            }
            if (!this.startVal) {
                this.startVal = 0;
            }
            if (this.startVal > this.endVal) {
                const val: number = this.startVal;
                this.endVal = val;
            }
            this.$emit('update:value', [this.startVal, this.endVal]);
            this.$bus.$emit('updateTagValue');
        } else if (this.type == 32) {
            this.$emit('update:value', [this.text]);
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
    padding: 10px 20px 20px;
    background: #fbfcff;
    border-bottom: 1px solid #eaf0f9;

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
            content: ' ';
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

        display: flex;
        position: relative;

        .component-enum {
            flex: 0 0 auto;
            width: 750px;
            padding-right: 20px;
        }

        .component-selected {
            flex: 0 0 auto;
            width: 350px;
            cursor: default;

            &-list {
                span {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
