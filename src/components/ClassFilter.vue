<template>
    <div class="class-filter">
        <div class="class-top">
            <el-select
                class="com-select"
                popper-class="bus-select"
                placeholder="请选择业务线"
                v-model="businessType"
                :clearable="$store.state.userInfo.role != 'card'"
                @change="changeBusiness"
                value-key="id"
                :disabled="isDisabled"
            >
                <el-option v-for="(item, index) in businessData" :key="index" :label="item.busiName" :value="item"></el-option>
            </el-select>
        </div>
        <div class="class-content self-scroll" ref="clssContent" @click.self="hideThird">
            <div class="class-item" v-for="(item, index) in classData" :key="index">
                <p class="first-class" @click.self="hideThird">
                    <em class="line"></em>
                    <span>{{ item.tagCateName }}</span>
                </p>
                <div class="second-class" v-if="item.children && item.children.length > 0">
                    <div v-for="(val, i) in item.children" :key="i">
                        <template v-if="val.tagCateName.length > 6">
                            <el-popover placement="top" trigger="hover" :content="val.tagCateName">
                                <span
                                    class="second-class-item"
                                    :class="{ no_click: !val.belongsToBusiLine || isDisabled }"
                                    slot="reference"
                                    @click="setSecond(val, i, item, $event)"
                                    >{{ val.tagCateName.substring(0, 6) }}</span
                                >
                            </el-popover>
                        </template>
                        <span
                            v-else
                            class="second-class-item"
                            :class="{
                                no_click: !val.belongsToBusiLine || isDisabled,
                                ck_span: saveClass.secondId == val.tagCateCode || val.isActive
                            }"
                            @click="setSecond(val, i, item, $event)"
                            >{{ val.tagCateName }}</span
                        >
                    </div>
                </div>
                <span class="empty" v-else>暂无数据</span>
            </div>
            <div class="third-class" :style="{ top: `${thirdTop}px`, left: `${thirdLeft}px` }" :class="{ isShow: !isHideThird }">
                <ul>
                    <li
                        v-for="(item, index) in thirdClass.thirdData"
                        :key="index"
                        @click="setThird(item)"
                        :class="{ ck_third: saveClass.thirdId == item.tagCateCode }"
                    >
                        <i class="el-icon-check"></i>
                        {{ item.tagCateName }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component
export default class ClassFilter extends Vue {
    @Prop({ type: Array }) private businessData?: any[];
    @Prop({ type: Array }) private classData?: any[];
    @Prop({
        type: Array,
        default: () => {
            return [];
        }
    })
    private classSelect?: any[];
    @Prop({
        type: Boolean,
        default: () => {
            return false;
        }
    })
    private isDisabled?: boolean;
    @Prop({ type: Object })
    private businessDef?: any;
    private businessType: any = '';
    private thirdTop: number = 0;
    private thirdLeft: number = 0;
    private hideTimer: any = undefined;
    private showTimer: any = undefined;
    private isHideThird: boolean = true;
    private saveClass: any = {
        firstId: '',
        firstName: '',
        secondId: '',
        secondName: '',
        thirdId: '',
        thirdName: ''
    };
    private saveClassData: any = {
        firstId: '',
        firstName: '',
        secondId: '',
        secondName: '',
        thirdId: '',
        thirdName: ''
    };
    private thirdClass: any = {
        thirdData: []
    };
    private mounted(): void {
        this.$nextTick(function() {
            document.addEventListener('click', this.closeBox, true);
        });
        const classSelect = this.classSelect as any[];
        if (classSelect.length > 0) {
            if (classSelect[1]) {
                this.$set(this.saveClass, 'firstId', classSelect[1]);
            }
            if (classSelect[2]) {
                this.$set(this.saveClass, 'secondId', classSelect[2]);
            }
            if (classSelect[3]) {
                this.$set(this.saveClass, 'thirdId', classSelect[3]);
            }
        }
    }
    @Watch('businessDef', { deep: true })
    private handler(val: any): void {
        this.businessType = val;
        this.$emit('setBusiness', this.businessType);
    }
    private beforeDestroy(): void {
        document.removeEventListener('click', this.closeBox, true);
    }
    private closeBox(e: any): void {
        const clssContent = this.$refs.clssContent;
        if (clssContent && !(clssContent as any).contains(e.target)) {
            this.hideThird();
        }
    }
    private setSecond(second: any, index: number, first: any, e: any): void {
        if (this.isDisabled || !second.belongsToBusiLine) {
            return;
        }
        const params: any = {
            firstId: first.tagCateCode,
            firstName: first.tagCateName,
            secondId: second.tagCateCode,
            secondName: second.tagCateName
        };
        if (second.children && second.children.length > 0) {
            if (second.isActive) {
                this.hideThird();
            } else {
                (this.classData as any[]).forEach(item => {
                    if (item.children && item.children.length > 0) {
                        item.children.forEach((data: any) => {
                            data.isActive = false;
                        });
                    }
                });
                this.$set(first.children[index], 'isActive', true);
                params.children = second.children;
                this.showThird(params, second, first, e);
            }
        } else {
            this.hideThird();
            params.thirdId = '';
            params.thirdName = '';
            if (second.tagCateCode == this.saveClass.secondId) {
                this.saveClass = {
                    firstId: '',
                    firstName: '',
                    secondId: '',
                    secondName: '',
                    thirdId: '',
                    thirdName: ''
                };
            } else {
                this.saveClass = Object.assign(this.saveClass, params);
            }
            this.$emit('selectedClass', this.saveClass);
        }
    }
    private showThird(data: any, second: any, first: any, e: any): void {
        const spanEl = e.target;
        const top = spanEl.getBoundingClientRect().top;
        const left = spanEl.getBoundingClientRect().left;
        const width = spanEl.offsetWidth;
        this.$set(this.thirdClass, 'thirdData', data.children);
        this.saveClassData = Object.assign(this.saveClassData, data);
        this.$nextTick(() => {
            this.thirdTop = top;
            this.thirdLeft = left + width + 4;
            this.isHideThird = false;
        });
    }
    private hideThird(): void {
        (this.classData as any[]).forEach(item => {
            if (item.children && item.children.length > 0) {
                item.children.forEach((data: any) => {
                    data.isActive = false;
                });
            }
        });
        this.isHideThird = true;
        this.$set(this.thirdClass, 'thirdData', []);
    }
    private setThird(data: any): void {
        if (data.tagCateCode == this.saveClass.thirdId) {
            this.saveClass = {
                firstId: '',
                firstName: '',
                secondId: '',
                secondName: '',
                thirdId: '',
                thirdName: ''
            };
        } else {
            this.saveClass = Object.assign(this.saveClass, this.saveClassData);
            this.$set(this.saveClass, 'thirdId', data.tagCateCode);
            this.$set(this.saveClass, 'thirdName', data.tagCateName);
            delete this.saveClass.children;
        }
        this.$emit('selectedClass', JSON.parse(JSON.stringify(this.saveClass)));
        this.hideThird();
    }
    public clearClass(): void {
        this.saveClass = {};
    }
    public clearBusiness(): void {
        this.businessType = {};
    }
    private changeBusiness(): void {
        this.saveClass = {};
        this.$emit('setBusiness', this.businessType);
    }
}
</script>

<style scoped lang="scss">
.class-filter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.class-top {
    padding: 18px 16px 0;
}
.class-content {
    position: relative;
    flex: 1;
    padding: 0 16px 18px;
    overflow-y: auto;
}
.first-class {
    margin-top: 24px;
    @include align-center;
    em {
        width: 3px;
        height: 14px;
        background: $color;
        margin-right: 10px;
    }
    span {
        font-size: 14px;
        word-break: break-all;
    }
}
.second-class {
    display: flex;
    flex-wrap: wrap;
    > div {
        flex-basis: 50%;
        padding-top: 16px;
    }
    span {
        font-size: 12px;
        color: #666;
        cursor: pointer;
        white-space: nowrap;
        &.no_click {
            color: #a6a6a6;
            opacity: 0.4;
        }
        &.ck_span {
            color: $color;
            opacity: 1;
        }
    }
}
.third-class {
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.02), 0px 2px 12px 0px rgba(0, 0, 0, 0.04), 0px 3px 6px 0px rgba(0, 0, 0, 0.02);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    visibility: hidden;
    opacity: 0;
    padding: 2px 0;
    &.isShow {
        visibility: initial;
        animation: showa 0.3s ease-in-out forwards;
    }
    @keyframes showa {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    li {
        min-width: 100px;
        font-size: 12px;
        color: #000;
        padding: 6px 0;
        text-align: center;
        cursor: pointer;
        position: relative;
        &:hover {
            color: $color;
        }
        &.ck_third {
            color: $color;
            background: rgba(230, 241, 255, 1);
            .el-icon-check {
                display: block;
            }
        }
        .el-icon-check {
            color: $color;
            position: absolute;
            left: 8px;
            top: 50%;
            margin-top: -6px;
            display: none;
        }
    }
}
.empty {
    font-size: 12px;
    color: #c2c2c2;
}
</style>
