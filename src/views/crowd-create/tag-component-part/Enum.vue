<template>
    <div class="tag-component">
        <div class="component-enum">
            <div class="tag-component-name">
                {{ tagComponentName }}
            </div>
            <div class="search-content" v-if="canSelectAll">
                <template v-if="canSelectAll">
                    <span style="padding-right: 15px;">
                        <el-checkbox v-model="selectAll" :indeterminate="selectAll == 1" :true-label="2" :false-label="0"
                                     @change="checked => setSelectAll(checked)">全选</el-checkbox>
                    </span>
                </template>
                <el-input v-model="keyword" clearable size="mini" style="width: 240px;" placeholder="请输入" @change="searchEnum"></el-input>&nbsp;
                <el-button size="mini" @click="searchEnum">搜索</el-button>
            </div>
            <el-tree
                    ref="tag-component-enum-tree"
                    :props="enumProp"
                    :load="loadNode"
                    :data="enumNodes"
                    lazy
                    show-checkbox
                    node-key="tagEnumVal"
                    check-strictly
                    :default-expanded-keys="treeDataSelect"
                    :default-checked-keys="treeDataSelect"
                    @node-expand="nodeExpand"
                    @check-change="nodeCheck"
            ></el-tree>
        </div>
        <div class="component-selected">
            <div class="tag-component-name">已选</div>
            <div class="component-selected-list">
                <span v-for="val of value" :key="val.tagEnumVal">{{ showName(val) }}；</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /**
     * @name TagComponentEnum
     * @author your name
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import { Component, Vue, Prop } from 'vue-property-decorator';
    // import Template from '@/Template.vue';

    // mixin引入

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入

    // 公共类引入

    // 私有组件引入

    // 私有类引入

    // 本地定义和声明

    @Component()
    export default class TagComponentEnum extends Vue {
        @Prop()
        private value!: any;

        @Prop({
            required: true
        })
        private tagEnumId!: string;
        @Prop({
            required: true
        })
        private tagComponentName!: string;

        @Prop()
        private tagCode?: string;

        @Prop()
        private tagComponentId?: number | string;

        @Prop({
            default: false
        })
        private canSelectAll!: boolean;

        private selectAll: number = 0;

        private enumProp: object = {
            label: 'tagEnumName',
            children: 'children',
            disabled: this.isDisabled,
            isLeaf: this.isLeaf
        };

        private selected: any = new Map();

        private treeDataSelect: Array<any> = [];

        // private treeData: any = [];

        private enumNodes: any = [];

        private keyword: string = '';

        private mounted() {
            this.init();
        }

        private init() {
            this.value.forEach((item: any) => {
                this.selected.set(item.tagEnumVal, item);
                this.treeDataSelect.push(item.tagEnumVal);
            });
        }

        private isLeaf(data: any) {
            if (data.tagEnumIsLeaf == 1) {
                return true;
            }
            return false;
        }

        private isDisabled(data: any, node: any) {
            if (node.parent && node.parent.checked) {
                return true;
            }
            if (node.parent && node.parent.parent && node.parent.parent.checked) {
                return true;
            }
            if (node.parent && node.parent.parent && node.parent.parent.parent && node.parent.parent.parent.checked) {
                return true;
            }
            return false;
        }

        private searchEnum() {
            this.searchEnumVal(this.keyword).then( (res:any) => {
                // console.log(res);
                this.enumNodes = res;
            } )
        }

        private loadNode(node: any, resolve: any) {
            const id = node.data && node.data.tagEnumVal ? node.data.tagEnumVal : '###';
            // console.log(node);
            // console.log(999);
            this.tagEnumList(id).then(res => {
                if (id == '###') {
                    this.treeData = res;
                }
                resolve(res);
            });
        }

        private nodeExpand(data: any, node: any) {
            if (node.checked) {
                return;
            }
            // console.log('expand')
            // console.log([...this.selected.keys()]);
            // (this.$refs['tag-component-enum-tree'] as any).setCheckedNodes([...this.selected.keys()]);
        }

        // 展示标签路径
        private showName(data:any){
            let name:string = data.tagEnumName;
            if(data.nodeParent && data.nodeParent.length > 0){
                data.nodeParent.forEach((item:any)=>{
                    name = `${item.tagEnumName}-${name}`
                })
            }
            return name;
        }

        // 递归获取祖先级信息
        private getNodeParent(node:any){
            let obj:any = [];
            if (node && node.data.tagEnumVal) {
                obj.push({
                    tagEnumVal:node.data.tagEnumVal,
                    tagEnumName:node.data.tagEnumName,
                });
            }
            if(node && node.parent){
                obj=obj.concat(this.getNodeParent(node.parent));
            }
            return obj;
        }

        private nodeCheck(data: any, state: boolean) {
            if (state) {
                const node:any = (this.$refs['tag-component-enum-tree'] as any).getNode(data.tagEnumVal);
                const nodeParent:any = this.getNodeParent(node.parent);
                data.nodeParent = nodeParent;

                if (!this.selected.has(data.tagEnumVal)) {
                    // if (data.ptagEnumVal) {
                    //
                    // }
                    this.selected.set(data.tagEnumVal, data);
                    this.value.push(data);
                    for (let i=0; i<this.value.length; i++) {
                        const idx = this.value[i].nodeParent.findIndex((item: any) => {
                            return item.tagEnumVal == data.tagEnumVal;
                        });
                        if(idx>=0){
                            this.selected.delete(this.value[i].tagEnumVal);
                            this.value.splice(i, 1);
                            this.treeDataSelect.splice(i, 1);
                            i--;
                        }
                    }
                    (this.$refs['tag-component-enum-tree'] as any).setCheckedNodes(this.value);
                }
            } else {
                if (this.selected.has(data.tagEnumVal)) {
                    this.selected.delete(data.tagEnumVal);
                    const idx = this.value.findIndex((item: any) => {
                        return item.tagEnumVal == data.tagEnumVal;
                    });
                    if (idx >= 0) {
                        this.value.splice(idx, 1);
                    }
                }
            }
            if (this.canSelectAll) {
                if (this.value.length > 0 && this.value.length < this.treeData.length) {
                    this.selectAll = 0;
                }
            }
            this.$bus.$emit('updateTagValue');
        }

        private setSelectAll(select: boolean) {
            while (this.value.length > 0) {
                this.value.pop();
            }
            this.selected.clear();
            if (select) {
                const keys: Array<string> = [];
                // console.log(this.treeData);
                this.treeData.forEach((item: any) => {
                    keys.push(item.tagEnumVal);
                    this.value.push(item);
                    this.selected.set(item.tagEnumVal, item);
                });
                // console.log(keys);
                (this.$refs['tag-component-enum-tree'] as any).setCheckedKeys(keys);
            } else {
                (this.$refs['tag-component-enum-tree'] as any).setCheckedKeys([]);
            }
            this.$bus.$emit('updateTagValue');
        }

        // ========== ajax request  ==========

        private tagEnumList(pTagEnumVal: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/tagEnum/list';
                const data = {
                    tagEnumId: this.tagEnumId
                };
                if(pTagEnumVal){
                    data.pTagEnumVal = pTagEnumVal;
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

        private searchEnumVal(keyword?: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/tagEnum/searchEnumVal';
                const data = {
                    tagCode: this.tagCode,
                    tagCompId: this.tagComponentId
                };
                if(keyword && keyword!=''){
                    Object.assign(data, {
                        keyword: keyword
                    });
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
    .tag-component {
        width: 100%;
        height: 390px;
        overflow: hidden;
        background: #FBFCFF;
        position: relative;
        &-name {
            position: relative;
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
        .component-enum {
            width: 400px;
            height: 390px;
            overflow-y: auto;
            overflow-x: hidden;
            padding:10px 20px;
            .search-content {
                width: 400px;
                margin-left: 0;
                margin-bottom: 10px;
                .el-input__inner{
                    background: none;
                }
            }
            .el-tree{
                background: none;
                height: 300px;
                overflow: auto;
            }
        }

        .component-selected {
            position: absolute;
            padding:10px 20px;
            background: #fff;
            border-left: 1px solid #EAF0F9;
            right: 0;
            top:0;
            width: 400px;
            height: 390px;
            overflow-y: auto;
            overflow-x: hidden;
            cursor: default;
        }
    }
</style>
