<template>
    <div class="select-enum" v-if="show">
        <div class="tag-container">
            <div class="tag-category tag-container-item">
                <div class="tag-container-item-header">
                    标签分类
                    <el-input prefix-icon="el-icon-search" placeholder="输入关键字" size="mini" v-model="filterText"
                              style="width: 120px;margin-left: 10px;"></el-input>
                </div>
                <div class="tag-container-item-body" v-loading="loading2">
                    <el-tree ref="tag-tree" :filter-node-method="filterNode" :props="tagCategoryProp" :load="loadTagCategory" lazy @node-click="handleTagCategoryClick"></el-tree>
                </div>
            </div>
            <div class="tag-list  tag-container-item">
                <div class="tag-container-item-header">
                    标签名称
                </div>
                <div class="tag-container-item-body" v-loading="loading1">
                    <template v-if="tagList.length > 0">
                        <div
                            class="tag-item"
                            v-for="tag of tagList"
                            :key="tag.id"
                            :class="{ active: selectTag && tag.tagCode == selectTag.tagCode }"
                            @click="handleCheckTagChange(tag)"
                        >
                            {{ tag.tagName }}
                        </div>
                    </template>
                    <div class="tag-item-empty" v-else>
                        暂无数据
                    </div>
                </div>
            </div>
            <div class="enum-list  tag-container-item">
                <div class="tag-container-item-header">枚举</div>
                <div class="tag-container-item-body" v-loading="loading">
                    <template v-if="tagComponentList.length > 0">
                    <div class="tag-compoent" v-for="tagComp of tagComponentList" :key="tagComp.id">
                        <div class="tag-component-label">
                            {{ tagComp.tagCompName }}
                        </div>
                        <div class="tag-component-enum-select-all tag-component-label" v-if="tagComp.tagCompStyle == 21">
                            <el-checkbox v-model="tagComp.selectAll" @change="checked => selectAll(checked, tagComp.id)">全选</el-checkbox>
                        </div>
                        <div class="tag-component-enum">
                            <el-tree
                                :ref="`tree-${tagComp.id}`"
                                node-key="id"
                                :props="enumProp"
                                :load="(node, resolve) => loadEnum(tagComp, node, resolve)"
                                :show-checkbox="select"
                                :default-checked-keys="keys"
                                lazy
                                check-strictly
                                @check-change="handleEnumChange"
                            ></el-tree>
                        </div>
                    </div>
                    </template>
                    <div class="tag-item-empty" v-else>
                        暂无数据
                    </div>
                </div>
            </div>
            <template v-if="select">
                <div class="select-list  tag-container-item">
                    <div class="tag-container-item-header">
                        已选择
                    </div>
                    <div class="tag-container-item-body padding">
                        <template v-if="value.length > 0">
                            <template v-for="(item, index) of value">
                                <div class="select-item" :key="item.tagCode">
                                    <div class="tag-name">{{ item.tagVal }}</div>
                                    <div class="tag-vals">
                                        <span v-for="enumItem of item.enums" :key="enumItem.tagEnumVal">{{ enumItem.tagEnumName }}</span>
                                    </div>
                                    <div class="del">
                                        <i class="el-icon-close" @click="delTagFromValue(index, item.tagCompId)"></i>
                                        </div>
                                    </div>
                            </template>
                        </template>
                        <div class="tag-item-empty" v-else>
                            暂无数据
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name SelectEnum
 * @author your name
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';
import { State } from 'vuex-class';
import th from "element-ui/src/locale/lang/th";

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

@Component({
    components: {}
})
export default class SelectEnum extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;

    @Prop({
        default: true
    })
    private show!: boolean;

    @Prop({
        default: []
    })
    private value!: Array<any>;

    @Prop({
        default: true
    })
    private select!: boolean;

    private keys:[] = [];
    private loading:boolean = false;
    private loading1:boolean = false;
    private loading2:boolean = false;

    private tagList: Array<any> = [];
    private selectTagCategory: string | null = null;
    private selectTag: any | null = null;

    private tagComponentList: Array<any> = [];

    private selectEnum: any = new Map();
    private enumCheckAll: boolean = false;

    private treeDataSelect: Array<any> = [];

    private tagCategoryProp: object = {
        label: 'tagCateName',
        children: 'children',
        isLeaf: this.isLeaf
    };
    private enumProp: object = {
        label: 'tagEnumName',
        children: 'children',
        isLeaf: this.isLeaf,
        id: 'id'
    };

    private mounted() {
        this.init();
    }

    private init() {
        // this.value.forEach( (valItem:any) => {
        //     this.treeDataSelect.push(valItem.tagEnumId);
        // })
    }

    private filterText: string = '';

    @Watch('filterText')
    private filterTextChange(val: string) {
        this.$refs['tag-tree'].filter(val);
    }

    private filterNode(value, data) {
        if (!value) return true;
        return data.tagCateName.indexOf(value) !== -1;
    }

    private isLeaf(data: any) {
        if (data.tagCateIsLeaf == 1 || data.tagEnumIsLeaf == 1) {
            return true;
        }
        return false;
    }

    private loadTagCategory(node: any, resolve: any) {
        const id = node && node.data ? node.data.id : 0;
        this.loading2 = true;
        this.findSub(id).then(res => {
            this.loading2 = false;
            resolve(res);
        }).catch(err => {
            this.loading2 = false;
        });
    }

    private loadEnum(tagComp: any, node: any, resolve: any) {
        // console.log(node);
        // console.log(tagComp);
        const tagEnumId = tagComp.tagEnumId;
        const tagEnumVal = node && node.data ? node.data.tagEnumVal : false;
console.log(33);
        this.enumList(tagEnumId, tagEnumVal).then((res: any) => {
            // console.log(res);
            res.map((item: any) => {
                // console.log(item);
                item['compId'] = tagComp.id;
            });
            // console.log(res);
            resolve(res);
        });
    }

    private handleTagCategoryClick(data: any) {
        if (!data || data.tagCateIsLeaf != 1) {
            return;
        }
        // if (data.id == this.selectTagCategory) {
        //     return;
        // }
        this.tagComponentList = [];
        this.tagList = [];
        this.selectTagCategory = data.id;
        this.$bus.$emit('remove-tag-name');
        this.loading1 = true;
        this.tagListAll([data.id]).then((res: any) => {
            this.loading1 = false;
            this.tagList = res.slice(0);
        });
    }

    private handleCheckTagChange(tag: any) {
        this.selectTag = tag;
        this.loading = true;
        this.tagFetch(tag.tagCode).then((res: any) => {
            // console.log(res);
            // console.log(this.value);
            this.tagComponentList = res.tagComponentReqVOList.filter((item: any) => {
                return item.tagCompStyle == 21 || item.tagCompStyle == 22;
            });
            this.initTreeState();
            this.loading = false;
        });
    }

    private handleEnumChange(data: any, isSelect: boolean) {
        if (!this.select) {
            return;
        }
        if (!this.selectTag) {
            return;
        }
        // console.log(data);
        // console.log(this.tagComponentList, data);
        const tagComp = this.getTagComp(data); //this.selectTag.tagCode;
        // console.log(tagComp);
        if (!tagComp) {
            return;
        }
        if (isSelect) {
            // console.log(data);
            const tagIdx = this.value.findIndex((item: any) => {
                return item.tagCode == tagComp.tagCode;
            });
            if (tagIdx >= 0) {
                const _idx = this.value[tagIdx].enums.findIndex((item: any) => {
                    return item.id == data.id;
                });
                if (_idx < 0) {
                    if(this.value[tagIdx].enums.length > 80){
                        this.$message.warning('枚举数不能大于80个，请重新选择');
                        this.value[tagIdx].enums.push(data);
                        for (const i in this.tagComponentList) {
                            const tree: any = (this.$refs[`tree-${this.tagComponentList[i].id}`] as any)[0];
                            tree.setChecked(this.value[tagIdx].enums[this.value[tagIdx].enums.length-1].id,false,false);
                        }
                        return false;
                    }
                    this.value[tagIdx].enums.push(data);
                }
            } else {
                const newItem = tagComp; //JSON.parse(JSON.stringify(this.selectTag));
                Object.assign(newItem, {
                    enums: [data]
                });
                this.value.push(newItem);
            }
        } else {
            const tagIdx = this.value.findIndex((item: any) => {
                return item.tagCode == tagComp.tagCode;
            });
            if (tagIdx >= 0) {
                const tagEnumVal = data.tagEnumVal;
                const enumIdx = this.value[tagIdx].enums.findIndex((item: any) => {
                    return item.tagEnumVal == tagEnumVal;
                });
                if (this.value[tagIdx].enums.length == 1) {
                    this.delTagFromValue(tagIdx);
                } else {
                    this.value[tagIdx].enums.splice(enumIdx, 1);
                }
            }
        }
    }

    private tagNameQuery(tagName:any) {
        if (!tagName) {
            this.tagList = [];
            this.tagComponentList = [];
            return;
        }
        const data:any = {
            subjectId: this.curSubject?.id,
            isEnumType: 1,
            keyword: tagName
        };
        this.loading1 = true;
        this.$api
            .post('/api/ava/tag/getTagsByParams', data)
            .then(res => {
                this.loading1 = false;
                this.tagList = res.slice(0);
                this.tagComponentList = [];
            })
            .catch(err => {
                this.loading1 = false;
                this.tagList = [];
                this.tagComponentList = [];
            });
    }

    private getTagComp(tagEnumItem: any) {
        const tagComp = this.tagComponentList.find((item: any) => {
            return item.id == tagEnumItem.compId;
        });
        const tag = this.tagList.find((item: any) => {
            return item.tagCode == tagComp.tagCode;
        });
        if (!tagComp || !tag) {
            return null;
        }
        if (tagComp.tagCompStyle == 21) {
            return {
                tagCompId: tagComp.id,
                tagCode: tagComp.tagComponentColumnReqVOList[0].tagCompCol,
                tagVal: tag.tagName //tagComp.tagCompName
            };
        } else if (tagComp.tagCompStyle == 22) {
            const tagCompCol = tagComp.tagComponentColumnReqVOList.find((item: any) => {
                return item.tagEnumLevelId == tagEnumItem.tagEnumLevelId;
            });
            if (!tagCompCol) {
                return null;
            }
            return {
                tagCompId: tagComp.id,
                tagCode: tagCompCol.tagCompCol,
                tagVal: `${tag.tagName}-${tagComp.tagCompName}-${tagCompCol.tagEnumLevelName}`
            };
        }
        return null;
    }

    private delTagFromValue(idx: number, tagCompId?: number) {
        const tagVal:string = this.value[idx].tagVal;
        if (tagVal === this.selectTag.tagName) {
            this.keys = [];
            for (const i in this.tagComponentList) {
                const tree: any = (this.$refs[`tree-${this.tagComponentList[i].id}`] as any)[0];
                tree.setCheckedKeys([]);
                this.tagComponentList[i].selectAll = false;
            }
        }
        this.value.splice(idx, 1);
        if(!tagCompId){
            return;
        }
        const index = this.tagComponentList.findIndex((item: any) => {
            return item.tagCompId == tagCompId;
        });
        if (index >= 0) {
            const tagComp: any = this.tagComponentList[index];
            this.selectAll(undefined, tagComp.id);
            tagComp.selectAll = false;
        }
    }

    // tree回显
    private initTreeState() {
        // this.tagComponentList = JSON.parse(JSON.stringify(this.tagComponentList));
        this.keys = [];
        this.value.forEach((key: any) => {
            if (key.tagCode === this.selectTag.tagCode &&
                key.tagVal === this.selectTag.tagName) {
                key.enums.forEach((enums: any) => {
                    this.keys.push(enums.id);
                });
            }
        });
    }

    private selectAll(select: any, id: number) {
        const tagComp = this.tagComponentList.find(item => {
            return item.id == id;
        });

        const tree: any = (this.$refs[`tree-${id}`] as any)[0];

        if (select) {
            const nodesMap = tree.store.nodesMap;
            if(Object.keys(nodesMap).length > 80){
                this.$message.warning('枚举数不能大于80个，请重新选择');
                tagComp.selectAll = false;
                return false;
            }
            for (const key in nodesMap) {
                const node: any = nodesMap[key];
                tree.setChecked(node, true, true);
            }
            // console.log(nodes);
        } else {
            const nodesMap = tree.store.nodesMap;
            if(Object.keys(nodesMap).length > 80){
                this.$message.warning('枚举数不能大于80个，请重新选择');
                tagComp.selectAll = false;
                return false;
            }
            // 已选结果中移除
            const idx = this.value.findIndex(item => {
                // return item.tagCode == tagComp.tagComponentColumnReqVOList[0].tagCompCol;
                return item.tagCompId == tagComp.id;
            });
            this.value.splice(idx, 1);
            // 树中移除
            tree.setCheckedKeys([]);
        }
    }

    // ========== ajax request  ==========

    private findSub(pid: number) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagCategory/findSub';
            const data = {
                pid: pid,
                subjectId: this.curSubject?.id
            };
            this.$api
                .get(url, data)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private tagListAll(lastTagCateIdList: any, keyword?: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tag/list';
            const data = {
                lastTagCateIdList: lastTagCateIdList,
                subjectId: this.curSubject?.id,
                isEnumType: 1
            };
            if (keyword) {
                Object.assign(data, {
                    keyword: keyword
                });
            }
            this.$api
                .post(url, data)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private tagFetch(tagCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tag/fetch';
            const data = {
                tagCode: tagCode
            };
            this.$api
                .get(url, data)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private tagComponet(tagCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tag/tagCompList';
            const data = {
                tagCode: tagCode
            };
            this.$api
                .get(url, data)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private enumList(tagEnumId: number, pTagEnumVal: number) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagEnum/list';
            const data = {
                tagEnumId: tagEnumId
            };
            if(pTagEnumVal){
                Object.assign(data,{pTagEnumVal:pTagEnumVal});
            }
            this.$api
                .get(url, data)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
</script>
<style lang="scss" scoped>
.select-enum {
    width: 100%;
    height: 400px;
    /deep/.el-tree-node__content:hover {
        background-color: #F5F7FA;
        color: #3D6EF0;
    }
    .tag-item-empty{
        width: 100%;
        height: calc(100% - 52px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tag-container {
        width: 100%;
        height: 400px;
        display: flex;
        overflow: hidden;

        &-item {
            flex: 0 0 auto;
            width: 227px;
            height: 100%;
            border-left: 1px solid #EAF0F9;

            &-header {
                position: relative;
                height: 32px;
                line-height: 32px;
                font-size: 1rem;
                font-weight: bold;
                color: rgba(27, 27, 27, 1);
                cursor: default;
                margin: 10px 10px 0 15px;
                padding-left: 5px;
                &::before {
                    position: absolute;
                    content: " ";
                    width: 3px;
                    height: 13px;
                    overflow: hidden;
                    left: -5px;
                    top: 9px;
                    background: #3a57fe;
                }
            }
            &-body {
                width: 100%;
                // padding: 20px;
                height: calc(100% - 42px);
                overflow: auto;
                padding: 0 10px;
                &.padding{
                    padding: 0;
                }
            }
        }
        .spacer {
            flex: 1 1 auto;
            &.x2 {
                flex: 2 1 auto;
            }
            &.x3 {
                flex: 3 1 auto;
            }
        }
    }
    .tag-list .tag-container-item-body {
        .tag-item {
            width: 100%;
            line-height: 24px;
            padding-left: 10px;
            display: block;
            cursor: pointer;
            position: relative;
            &::before {
                position: absolute;
                content: " ";
                width: 4px;
                height: 4px;
                border-radius: 50%;
                overflow: hidden;
                left: 0;
                top: 10px;
                background: #B5C9DC;
            }
            &.active {
                color: #3E6AF6;
                &::before {
                    background: #3E6AF6;
                }
            }
        }
    }
    .select-list {
        width: 320px;
        // display: flex;
        // flex-direction: column;
        .select-item {
            width: 100%;
            min-height: 28px;
            background: rgba(255, 255, 255, 1);
            border-bottom: 1px solid #EAF0F9;
            position: relative;
            padding: 5px 20px;

            .tag-name {
                width: 100%;
                min-height: 28px;
                line-height: 28px;
                position: relative;
                color: #333;
                &::before {
                    position: absolute;
                    content: " ";
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    overflow: hidden;
                    left: -10px;
                    top: 14px;
                    background: #B5C9DC;
                }
            }
            .tag-vals {
                width: 100%;
                line-height: 28px;
                display: flex;
                flex-wrap: wrap;
                font-size: 12px;
                span {
                    margin-right: 10px;
                    color: #888888;
                }
            }

            i {
                position: absolute;
                right: 10px;
                top: 14px;
                cursor: pointer;
                &:hover {
                    color: #3D6EF0;
                }
            }
        }
    }

    .enum-list {
        .tag-compoent {
            margin-bottom: 20px;
        }
        .tag-component-label {
            font-weight: bold;
            min-height: 28px;
            line-height: 28px;
            padding-left: 10px;
        }
    }
    .spacer.arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            font-size: 2.5rem;
        }
    }
}
</style>
