<template>
    <section class="tag-type-filter">
        <div class="tag-filter-result">
            <div class="label">已选条件</div>
            <div class="tag-list">
                <el-tag
                    v-for="(tagName, index) in selectedTagName"
                    :key="index"
                    style="margin-right:5px;"
                    closable
                    @close="deleteTagInSelect(tagName)"
                    >{{ tagName }}</el-tag
                >
                <span v-if="selectedTagName.size == 0" class="span-text">请选择筛选规则</span>
            </div>
            <div class="clean-all">
                <span v-if="selectedTagName.size != 0" @click="cleanAll" class="span">清空筛选</span>
            </div>
        </div>
        <collapse-transition>
            <div class="tag-type-list" v-show="showTagType">
                <div class="tag-type" v-for="tagType of tagTypeList" :class="tagType.show?'':'tag-hide'" :key="tagType.tagCateType" v-show="tagType.children && tagType.children.length > 0">
                    <div class="tag-type-label">{{ tagType.label }}</div>
                    <div class="tag-type-content">
                        <div class="tag-item" v-for="item of tagType.children" :key="item.id">
                            <div class="tag-item-label">
                                {{ item.tagCateName }}
                            </div>
                            <div class="tag-type-next">
                                |
                            </div>
                            <div class="tag-item-content" v-if="item.children && item.children.length > 0">
                                <template v-for="tag of item.children">
                                    <template v-if="tag.tagCateIsLeaf == 1">
                                        <div class="tag-sub-item" :key="tag.id" :class="{ active: tag.active }" @click="addTagToFilter(tag)">
                                            {{ tag.tagCateName }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <el-popover :key="tag.id" popper-class="tag-market-popover" trigger="click" @show="showTagNodes(tag)">
                                            <div class="tag-nodes-content" v-if="tag.children && tag.children.length > 0">
                                                <div
                                                    class="tag-node"
                                                    :class="{ active: node.active }"
                                                    v-for="node of tag.children"
                                                    :key="node.id"
                                                    @click="addTagToFilter(node)"
                                                >
                                                    {{ node.tagCateName }}
                                                </div>
                                            </div>
                                            <div v-else>未查找到子分类</div>
                                            <div slot="reference" class="tag-sub-item" :key="tag.id">
                                                {{ tag.tagCateName }}
                                            </div>
                                        </el-popover>
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="tag-type-more" v-if="!tagType.show" @click="more(tagType)">更多<span class="el-icon-arrow-down"></span></div>
                    <div class="tag-type-more" v-else @click="hide(tagType)">收起<span class="el-icon-arrow-up"></span></div>
                </div>
                <div class="tag-type">
                    <div class="tag-type-label">数据更新</div>
                    <div class="tag-type-content row">
                        <div
                            class="tag-sub-item"
                            :class="{ active: item.value == tagClassify }"
                            v-for="item in tagClassifyMap"
                            :key="item.value"
                            @click="setFilterValue('tagClassify', item.value)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </div>
                <div class="tag-type" :style="admin?'border-bottom: none;':''">
                    <div class="tag-type-label">标签类型</div>
                    <div class="tag-type-content row">
                        <div
                            class="tag-sub-item"
                            :class="{ active: item.value == tagDataType }"
                            v-for="item in tagDataTypeMap"
                            :key="item.value"
                            @click="setFilterValue('tagDataType', item.value)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </div>
                <div class="tag-type" style="border-bottom: none;" v-if="!admin">
                    <div class="tag-type-label">标签权限</div>
                    <div class="tag-type-content row">
                        <div
                            class="tag-sub-item"
                            :class="{ active: item.value == grantState }"
                            v-for="item in grantStateMap"
                            :key="item.value"
                            @click="setFilterValue('grantState', item.value)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </div>
            </div>
        </collapse-transition>
        <div class="show-btn" @click="showTagType = !showTagType">
            <i class="el-icon-d-arrow-left pointerIcon" v-show="showTagType"></i>
            <i class="el-icon-d-arrow-right pointerIcon" v-show="!showTagType"></i>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共类引入
import CollapseTransition from '@/assets/utils/collapse-transition';

// 私有组件引入

// 私有类引入

// 本地定义和声明
interface TagType {
    label: string;
    tagCateType: number;
    children: Tag[];
    [propName: string]: any;
}

interface Tag {
    id: number;
    pid: number;
    tagCateName: string;
    tagCateType: number;
    tagCateLevel: number;
    subjectId: number;
    [propName: string]: any;
}

interface TagFilter {
    [propName: string]: any;
}

interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

interface TagNode {
    label: string;
    id: number;
    data: Tag | null;
    children: TagNode[];
}

// 路由勾子
Component.registerHooks(['beforeRouteLeave']);

@Component({
    components: {
        'collapse-transition': CollapseTransition
    }
})
export default class TagTypeFilter extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;
    @Watch('curSubject')
    private subjectChange() {
        this.init();
    }

    @Prop()
    private search!: any;

    @Prop()
    private admin!: any;

    private selectedTag = new Set();
    private selectedTagName = new Set();
    private selectNameToTagMap = new Map();

    private selectHead: TagNode = {
        label: '',
        id: -1,
        data: null,
        children: []
    };

    private tagTypeList: TagType[] = [
        {
            id: 0,
            label: '标签分类',
            tagCateType: 1,
            children: [],
            show: false
        },
        {
            id: 0,
            label: '组合分类',
            tagCateType: 2,
            children: [],
            show: false
        }
    ];

    private grantState: number | null = null;
    private grantStateMap: object = [
        {
            label: '未授权',
            value: 0
        },
        {
            label: '已授权',
            value: 1
        },
        {
            label: '已申请',
            value: 2
        },
        {
            label: '已驳回',
            value: 3
        }
    ];

    private tagClassify: number | null = null;
    private tagClassifyMap: object = [
        {
            label: '离线更新',
            value: 12
        },
        {
            label: '实时更新',
            value: 3
        }
    ];

    private tagDataType: number | null = null;
    private tagDataTypeMap: object = [
        {
            label: '事实及统计类',
            value: 1
        },
        {
            label: '挖掘预测类',
            value: 2
        }
    ];

    private searchWord: string = '';

    private showTagType: boolean = true;

    private mounted() {
        this.init();
    }

    private reset() {
        this.tagTypeList.forEach((tagType: TagType) => {
            tagType.children = [];
        });
        this.selectedTag = new Set();
        this.selectedTagName = new Set();
        this.selectNameToTagMap = new Map();
    }

    private async init() {
        if (!this.curSubject) {
            return setTimeout(this.init, 500);
        }
        this.reset();
        this.getTagTypeList().then((res: any) => {
            this.buildTagByType(
                res.filter((item: Tag) => {
                    return this.curSubject && item.subjectId == this.curSubject.id;
                }),
                0
            );
        });
        this.searchTag();
    }

    // 更多按钮
    private more (tagType:any) {
        tagType.show = true;
    }
    private hide (tagType:any) {
        tagType.show = false;
    }

    private buildTagByType(tagList: Tag[], pid: number, pNode?: Tag) {
        tagList.forEach((tag: Tag) => {
            if (tag.pid == pid) {
                if (pid == 0) {
                    const idx = tag.tagCateType;
                    if (this.tagTypeList[idx - 1]) {
                        this.tagTypeList[idx - 1].children.push(tag);
                    }
                } else {
                    if (pNode) {
                        if (!pNode.children) {
                            pNode['children'] = [];
                        }
                        pNode.children.push(tag);
                    }
                }
                if (tag.tagCateIsLeaf == 0) {
                    this.buildTagByType(tagList, tag.id, tag);
                }
            }
        });
    }

    private addTagToFilter(tag: Tag) {
        if (tag.active) {
            this.$set(tag, 'active', false);
        } else {
            this.$set(tag, 'active', true);
        }
        this.$forceUpdate();
        const name = this.genTagName(tag);
        if (this.selectedTagName.has(name)) {
            this.selectedTagName.delete(name);
            this.selectNameToTagMap.delete(name);
        } else {
            this.selectedTagName.add(name);
            this.selectNameToTagMap.set(name, tag.id);
        }
        if (this.selectedTag.has(tag.id)) {
            this.selectedTag.delete(tag.id);
            // this.deleteTagFromTree(tag);
        } else {
            this.selectedTag.add(tag.id);
        }
        if (this.selectedTag.size == 0) {
            delete this.search.lastTagCateIdList;
        }
        console.log(this.selectedTagName);
        this.searchTag();
    }

    private deleteTagInSelect(name: string) {
        // console.log(name);
        this.selectedTagName.delete(name);
        const id = this.selectNameToTagMap.get(name);
        this.selectNameToTagMap.delete(name);
        this.selectedTag.delete(id);

        console.log(name, id);

        this.tagTypeList.forEach((tagType: any) => {
            let list: any = tagType.children;
            let i = 0,
                len = list.length;
            while (i < len) {
                const tagItem = list[i];
                // console.log(tagItem);
                if (tagItem.id == id) {
                    tagItem.active = false;
                }
                if (tagItem.tagCateIsLeaf == 0 && tagItem.children) {
                    list = list.concat(tagItem.children);
                    len = list.length;
                }
                i++;
            }
        });

        this.$forceUpdate();
        this.searchTag();
    }

    private cleanAll() {
        const list: any = [...this.selectedTagName];
        // console.log(list);
        list.forEach((name: string) => {
            this.selectedTagName.delete(name);
            const id = this.selectNameToTagMap.get(name);
            this.selectNameToTagMap.delete(name);
            this.selectedTag.delete(id);
            this.tagTypeList.forEach((tagType: any) => {
                let list: any = tagType.children;
                let i = 0,
                    len = list.length;
                while (i < len) {
                    const tagItem = list[i];
                    // console.log(tagItem);
                    if (tagItem.id == id) {
                        tagItem.active = false;
                    }
                    if (tagItem.tagCateIsLeaf == 0 && tagItem.children) {
                        list = list.concat(tagItem.children);
                        len = list.length;
                    }
                    i++;
                }
            });
        });

        this.$forceUpdate();
        this.searchTag();
    }

    private genTagName(tag: Tag) {
        // console.log(tag);
        let name = tag.tagCateName;
        const tagCateType: number = tag.tagCateType;
        const tagCate = this.tagTypeList[tagCateType - 1];

        let pid = tag.pid;
        while (pid != 0) {
            const pNode: any = this.getPNode(pid, tagCateType);
            // console.log('pNode', pNode);
            if (!pNode) {
                break;
            }
            name = `${pNode.tagCateName}｜${name}`;
            pid = pNode.pid;
        }
        name = `${tagCate.label}｜${name}`;

        return name;
    }

    private getPNode(pid: number, tagCateType: number) {
        // console.log(pid, tagCateType);
        const root = this.tagTypeList[tagCateType - 1];
        let list: any = root.children.slice(0);
        let pNode: any = null;
        // console.log(list);
        while (!pNode && list.length > 0) {
            let next: any = [];
            list.forEach((node: any) => {
                // console.log(node);
                if (node.id == pid) {
                    pNode = node;
                } else {
                    if (node.children) {
                        next = next.concat(node.children);
                    }
                }
            });
            // console.log(next);
            list = next;
        }
        return pNode;
    }

    private showTagNodes(tag: Tag) {
        if (!tag.children) {
            this.getSubTag(tag.id).then((res: any) => {
                tag.children = res;
                if (res.length > 0) {
                    return true;
                }
                return false;
            });
        } else {
            return true;
        }
    }

    private setFilterValue(targetName: string, value: number) {
        if (!targetName) {
            return;
        }
        if (this.$data[targetName] == value) {
            this.$data[targetName] = null;
            delete this.search[targetName];
        } else {
            this.$data[targetName] = value;
            this.search[targetName] = value;
        }
        this.searchTag();
    }

    private searchTag() {
        const lastTagCateIdList: Array<string> = [];
        for (const key of this.selectedTag.keys()) {
            lastTagCateIdList.push(key as string);
        }
        this.search.lastTagCateIdList = lastTagCateIdList;

        (this.$parent as any).searchTag();
    }

    // ========== ajax request  ==========

    private getTagTypeList(level: number = 2) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagCategory/findAboveLevel';
            const data: object = {
                tagCateLevel: level,
                subjectId: this.curSubject?.id
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    private getSubTag(pid: number) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagCategory/findSub';
            const data: object = {
                pid: pid,
                subjectId: this.curSubject?.id
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
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
.pointerIcon {
    transform:rotate(90deg) // 旋转45度
  }
.tag-type-filter {
    flex: 0 0 auto;
    width: 100%;
    position: relative;
    // padding: 20px;
    // background: rgba(255, 255, 255, 1);

    display: flex;
    flex-direction: column;
}

.tag-filter-result {
    flex: 0 0 auto;
    width: 100%;
    min-height: 45px;
    background: rgba(255, 255, 255, 1);
    // box-shadow: 0px 2px 4px 0px rgba(170, 170, 170, 0.5);
    display: flex;
    align-items: center;
    // margin-bottom: 6px;
    .span{
        color: #888888;
        cursor: pointer;
        &:hover{
            color: #3E6AF6;
        }
    }
    .span-text{
        color: #aaa;
    }
    .label {
        width: 80px;
        text-align: left;
        color: rgba(27, 27, 27, 1);
        cursor: default;
        margin-left: 20px;
        color: #666666;
    }
    .tag-list {
        width: calc(100% - 180px);
        // padding: {
        //     top: 10px;
        //     bottom: 10px;
        // }
        .el-tag {
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 8px;
            border: 1px solid #3E6AF6;
            border-radius: 0;
        }
    }
    .clean-all {
        width: 80px;
        display: flex;
    }
}

.tag-type-list {
    flex: 0 0 auto;
    width: 100%;
    padding:0 20px;
    background: rgba(255, 255, 255, 1);
    border-top: 1px solid #E5E9EC;

    display: flex;
    flex-direction: column;
    .tag-hide {
        height: 50px;
        overflow: hidden;
    }
}

.tag-type {
    width: 100%;
    height: auto;
    display: flex;
    min-height: 30px;
    border-bottom: 1px dashed #E5E9EC;
    padding-top: 5px;
    &:last-child {
        margin-bottom: 0px;
    }

    &-label {
        width: 80px;
        line-height: 40px;
        color: #666666;
        cursor: default;
        font-size: 14px;
    }
    &-content {
        width: calc(100% - 80px);
        height: auto;
        display: flex;
        flex-direction: column;

        &.row {
            flex-direction: row;
        }
    }
    &-more{
        width: 45px;
        line-height: 40px;
        height: auto;
        display: flex;
        color: #3E6AF6;
        cursor: pointer;
        span{
            line-height: 40px;
            float: right;
        }
    }
}

.tag-item {
    min-height: 50px;
    line-height: 40px;
    display: flex;
    &:last-child {
        margin-bottom: 0px;
    }

    &-label {
        flex: 0 0 auto;
        width: auto;
        font-size: 14px;
        color: #333333;
        cursor: default;
        margin-right: 20px;
    }

    .tag-type-next {
        margin-left: -5px;
        margin-right: 15px;
    }
}
.tag-sub-item {
    // flex: 0 0 auto;
    // width: auto;
    width: max-content;
    float: left;
    margin: 0 20px 5px 0;
    line-height: 40px;

    padding: 0 5px;
    font-size: 14px;
    color: #333333;
    margin: {
        left: -5px;
        right: 20px;
    }
    box-sizing: content-box;
    position: relative;
    cursor: pointer;

    &.active {
        color: #3E6AF6;
    }
    &:hover {
        color: #5984fe;
    }
}

.show-btn {
    position: absolute;
    width: 60px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    bottom: -13px;
    left: calc(50% - 30px);
    background-color: #fff;
    border-radius: 0 0 6px 6px;
    cursor: pointer;
    // box-shadow: 0px 2px 2px 0px rgba(147, 147, 147, 0.5);
}
</style>
<style lang="scss">
.el-popover.tag-market-popover {
    .tag-nodes-content {
        display: flex;
    }
    .tag-node {
        flex: 0 0 auto;
        width: auto;
        height: 20px;
        padding: 0 5px;
        line-height: 20px;
        font-size: 0.875rem;
        color: rgba(51, 51, 51, 1);
        margin-right: 20px;
        position: relative;
        cursor: pointer;
        &:last-child {
            margin-right: 0px;
        }

        &.active {
            color: #3E6AF6;
        }
    }
}
</style>
