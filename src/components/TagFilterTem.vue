<template>
    <div class="tag-template">
        <div v-for="(tagItem, tagIndex) in dataList" :key="tagIndex" class="tag-arr">
            <div v-for="(enumItem, enumIndex) in tagItem.val" :key="enumIndex" class="enum-arr">
                <template v-if="!enumItem.type || enumItem.type != 'LOGIC'">
                    <div class="data-text">
                        {{ enumItem.tagName }}：
                        <strong v-for="(params, active) in enumItem.data" :key="active">
                            <template
                                v-if="
                                    params.type == 21 ||
                                        params.type == 22 ||
                                        params.type == 19 ||
                                        params.type == 32 ||
                                        params.type == 13 ||
                                        params.type == 14 ||
                                        params.type == 16 ||
                                        params.type == 17 ||
                                        params.type == 18
                                "
                            >
                                <em v-if="active > 0">;</em>
                                <span v-if="enumItem.tagName.trim() !== params.enumConName.trim()">{{ params.enumConName }}：</span>
                                <span v-for="(vals, i) in params.val" :key="i">
                                    <span>{{ vals }}</span
                                    ><em v-if="i != params.val.length - 1">，</em>
                                </span>
                            </template>
                            <template v-if="params.type == 11 || params.type == 12 || params.type == 15 || params.type == 31">
                                <em v-if="active > 0">;</em>
                                <span v-if="enumItem.tagName.trim() !== params.enumConName.trim()">{{ params.enumConName }}：</span>
                                <span v-for="(vals, i) in params.val" :key="i">
                                    <span>{{ vals }}</span
                                    ><em v-if="i != params.val.length - 1">-</em>
                                </span>
                            </template>
                        </strong>
                    </div>
                </template>
                <template v-if="enumItem.type && enumItem.type == 'LOGIC'">
                    <em v-if="enumItem.logic == '_AND'" class="data-concat">且</em>
                    <em v-if="enumItem.logic == '_OR'" class="data-concat">或</em>
                    <em v-if="enumItem.logic == '_NOT'" class="data-concat">非</em>
                </template>
            </div>
            <div v-if="tagItem.logic == '_AND' && tagIndex != dataList.length - 1" class="group-concat">
                且
            </div>
            <div v-if="tagItem.logic == '_OR' && tagIndex != dataList.length - 1" class="group-concat">
                或
            </div>
            <div v-if="tagItem.logic == '_NOT' && tagIndex != dataList.length - 1" class="group-concat">
                非
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class TagFilterTem extends Vue {
    @Prop({
        type: Array,
        default: () => {
            return [];
        }
    })
    private dataList!: any[];
}
</script>
<style lang="scss" scoped>
.tag-template {
    min-width: 30%;
}
.tag-arr {
    min-width: 40%;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9ea;
    margin-bottom: 24px;
    flex-wrap: wrap;
    padding: 10px 12px 5px;
    font-size: 12px;
    color: #35394a;
    border-radius: 4px;
    position: relative;
    strong {
        font-weight: 500;
    }
    &:last-child {
        margin-bottom: 0;
    }
    .enum-arr {
        margin-bottom: 5px;
        &:nth-of-type(2n-1) {
            width: 90%;
        }
        &:nth-of-type(2n) {
            flex: 1;
        }
    }
}
.data-text {
    padding-right: 6px;
    span {
        word-break: break-all;
    }
}
.data-concat {
    margin-bottom: 5px;
    margin-left: 6px;
    color: #8a8aa7;
}
.group-concat {
    position: absolute;
    left: 50%;
    bottom: -22px;
    color: #8a8aa7;
}
</style>
