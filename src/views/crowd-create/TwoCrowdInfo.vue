<template>
    <div class="two-crowd-info">
        <div class="pargraph">
            <div class="title">
                <div class="text" style="border-bottom: 1px dashed #DEE3EB;font-weight: bold;"><span class="line" style="margin-top: 11px;"></span><span>选择群体</span>
                    <el-tooltip class="item" effect="dark" content="可选择文件建群和库表建群类型的群体" placement="bottom">
                        <i class="el-icon-question" style="padding: 0 5px;color: #999;"></i>
                    </el-tooltip>
                    <el-select
                            v-model="crowdCode"
                            placeholder="请输入群体名称/群体ID"
                            filterable
                            remote
                            size="medium"
                            :clearable="true"
                            @change="crowdCodeChange"
                            :remote-method="getQueryList"
                            :loading="loading3"
                            style="margin-left: 15px;width: 300px;">
                        <el-option
                                v-for="item in list"
                                :key="item.crowdCode"
                                :label="item.crowdName"
                                :value="item.crowdCode"
                                v-show="item.crowdType != 5"

                        >
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="title">
                <div class="text">
                    <span style="float: left;width: 67%;min-width: 666px;"><span class="line"></span><span>选择标签</span></span>
                    <span style="float:left;padding-left: 5px;"><span class="line"></span><span>逻辑组合</span></span>
                    <span style="float: right;position: relative;top:-4px;">
                        <el-button plain size="mini" @click="calcCrowdNum" v-if="crowdNum < 0">
                            <span>计算群体数量</span>
                        </el-button>
                        <el-button plain size="mini" v-if="crowdNum >= 0">
                            <span class="crowd-num">{{ `群体数量：${crowdNum}` }}</span>
                        </el-button>
                    </span>
                </div>
                <div class="select-enum" v-if="show">
                    <div class="tag-container">
                        <div class="tag-category tag-container-item" style="border-left: 0;">
                            <div class="tag-container-item-header">标签分类</div>
                            <div class="tag-container-item-body" v-loading="loading2" v-if="treeType">
                                <el-tree ref="tag-tree" :props="tagCategoryProp" :load="loadTagCategory" lazy @node-click="handleTagCategoryClick"></el-tree>
                            </div>
                        </div>
                        <div class="tag-list  tag-container-item">
                            <div class="tag-container-item-header" style="height: 64px;">
                                标签名称<br>
                                <el-input v-model="tagName"
                                          prefix-icon="el-icon-search"
                                          clearable
                                          placeholder="请输入标签编码/标签名称/标签描述"
                                          @keyup.enter.native="tagNameQuery(tagName)"
                                          size="mini"
                                          style="width: 105%;position: relative;left:-10px;">

                                </el-input>
                            </div>
                            <div class="tag-container-item-body" v-loading="loading1" style="height: calc(100% - 80px);padding: 0 10px;">
                                <template v-if="tagList.length > 0">
                                    <div
                                            v-for="tag of tagList"
                                            :key="tag.id">
                                        <div
                                                class="tag-item"
                                                v-if="tag.tagGranted == 1"
                                                :class="{ active: selectTag && tag.tagCode == selectTag.tagCode }"
                                                @click="handleCheckTagChange(tag)"
                                        >
                                            {{ tag.tagName }}
                                        </div>
                                        <div v-else class="tag-item tag-item-f">
                                            {{ tag.tagName }}
                                        </div>
                                    </div>

                                </template>
                                <div class="tag-item-empty" v-else style="padding-bottom:30px;">
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
                                                    ref="tree"
                                                    node-key="tagEnumVal"
                                                    :props="enumProp"
                                                    :load="(node, resolve) => loadEnum(tagComp, node, resolve)"
                                                    :show-checkbox="select"
                                                    :default-checked-keys="keys"
                                                    :default-expanded-keys="keys"
                                                    lazy
                                                    check-strictly
                                                    @check="handleEnumChange"
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
                                    <div style="padding: 0 8px;">
                                        筛选对象：
                                        <el-select v-model="valueType" placeholder="请选择" size="mini" style="width: 60%" @change="updateExpression">
                                            <el-option
                                                    label="群体为筛选对象"
                                                    value="1">
                                            </el-option>
                                            <el-option
                                                    label="标签为筛选对象"
                                                    value="2">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="valueType == 1">
                                        <div class="tag-list-title">群体</div>
                                        <div class="select-item-crowd" v-if="crowd && crowd.crowdName">{{crowd.crowdName}}
                                            <div class="del">
                                                <i class="el-icon-close" @click="delCrowd"></i>
                                            </div>
                                        </div>
                                        <div v-else style="padding:5px 8px;text-align: center;border: 1px solid #EAF0F9;margin: 8px;">
                                            暂无群体
                                        </div>
                                        <div class="logic-select">
                                            <el-radio-group v-model="logicCrowd" border size="mini" @change="logicCrowdChange">
                                                <el-radio-button v-for="logic_t in logicList" :label="logic_t.value" :key="logic_t.value">{{
                                                    logic_t.label }}
                                                </el-radio-button>
                                            </el-radio-group>
                                        </div>
                                    </div>

                                    <div class="tag-list-title">标签</div>
                                    <template v-if="value.length > 0">
                                        <template v-for="(item, index) of value">
                                            <div v-if="index > 0" class="logic-select" :key="`logic-${index}`">
                                                <el-radio-group v-model="logic[index - 1]" border size="mini" @change="logicChange">
                                                    <el-radio-button v-for="logic_a in logicList" :label="logic_a.value" :key="logic_a.value">{{
                                                        logic_a.label }}
                                                    </el-radio-button>
                                                </el-radio-group>
                                            </div>
                                            <div class="select-item" :key="item.tagCode">
                                                <div class="tag-name">{{ item.tagVal }}</div>
                                                <div class="tag-vals">
                                                    <span v-for="enumItem of item.enums" :key="enumItem.tagEnumVal">{{ showName(enumItem) }}</span>
                                                </div>
                                                <div class="del">
                                                    <i class="el-icon-close" @click="delTagFromValue(index, item.tagCompId)"></i>
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                    <div v-else style="padding:5px 8px;text-align: center;border: 1px solid #EAF0F9;margin: 8px;">
                                        暂无标签
                                    </div>
                                    <div v-if="valueType == 2">
                                        <div class="tag-list-title">群体</div>
                                        <div class="logic-select">
                                            <el-radio-group v-model="logicCrowd" border size="mini" @change="logicCrowdChange">
                                                <el-radio-button v-for="logic_t in logicList" :label="logic_t.value" :key="logic_t.value">{{
                                                    logic_t.label }}
                                                </el-radio-button>
                                            </el-radio-group>
                                        </div>
                                        <div class="select-item-crowd" v-if="crowd && crowd.crowdName">
                                            {{crowd.crowdName}}
                                            <div class="del">
                                                <i class="el-icon-close" @click="delCrowd"></i>
                                            </div>
                                        </div>
                                        <div v-else style="padding:5px 8px;text-align: center;border: 1px solid #EAF0F9;margin: 8px;">
                                            暂无群体
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /**
     * @name TwoCrowdInfo
     * @author 于涛
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import { Component, Vue ,Prop, Watch} from 'vue-property-decorator';
    import { State } from 'vuex-class';
    // 私有类引入

    // mixin引入

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入

    // 公共类引入

    // 私有组件引入

    // 本地定义和声明
    interface CrowdCustomVO {
        crowdDesc: string;
        crowdDsType: number;
        crowdManager: string;
        crowdName: string;
        crowdType: number;
        subjectId: number;
        crowdCode: string;
        crowdDefineDesc: string;
        sourceVO: {
            clusterName: string;
            columnName: string;
            dbName: string;
            dsCol: string;
            enumColumnName: string;
            tableName: string;
            enums: [];
        };
    }

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
    export default class TwoCrowdInfo extends Vue {
        @State(state => state.curSubject) curSubject!: Subject | null;
        @Watch('curSubject')
        private subjectChange() {
            this.treeType = false;
            this.queryList();
            this.getExpreesion();
            this.tagList = [];
            this.tagComponentList = [];
            console.log(99);
        }

        private code : string = '';

        private CrowdCustomVO: any = {};

        @State(state => state.expressionTwo) expressionCache: any;

        @Prop({
            default: true
        })
        private show!: boolean;


        private value: any = [];
        private valueChange() {
            this.crowdNum = -1;
        }

        private crowdNum: any = -1;
        private treeType: boolean = true;

        @Prop({
            default: true
        })
        private select!: boolean;
        private keys:[] = [];
        private loading:boolean = false;
        private loading1:boolean = false;
        private loading2:boolean = false;
        private loading3:boolean = false;

        private expression: any = [];
        private logic: any = [];

        private logicList: any = [
            {
                label: '或',
                value: '_OR'
            },
            {
                label: '且',
                value: '_AND'
            },
            {
                label: '非',
                value: '_NOT'
            }
        ];

        private LOGIC_OR = {
            logic: '_OR',
            type: 'LOGIC'
        };
        private LOGIC_AND = {
            logic: '_AND',
            type: 'LOGIC'
        };
        private LOGIC_NOT = {
            logic: '_NOT',
            type: 'LOGIC'
        };
        private LOGIC = {
            _OR:{
                logic: '_OR',
                type: 'LOGIC'
            },
            _AND:{
                logic: '_AND',
                type: 'LOGIC'
            },
            _NOT:{
                logic: '_NOT',
                type: 'LOGIC'
            },
        };

        private L_BRE = {
            bre: '_L',
            type: 'BRE'
        };
        private R_BRE = {
            bre: '_R',
            type: 'BRE'
        };

        private logicCrowd: any = '_AND';

        private valueType:string = '1';

        private tagList: Array<any> = [];
        private selectTagCategory: string | null = null;
        private selectTag: any | null = null;

        private tagComponentList: Array<any> = [];

        private selectEnum: any = new Map();
        private enumCheckAll: boolean = false;
        private timer: any = null;
        private keyword: any = '';

        private treeDataSelect: Array<any> = [];

        private tagCategoryProp: object = {
            label: 'tagCateName',
            children: 'children',
            isLeaf: this.isLeaf
        };
        private enumProp: object = {
            label: 'tagEnumName',
            children: 'children',
            disabled: this.isDisabled,
            isLeaf: this.isLeaf,
            id: 'id'
        };

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

        private calcCrowdNum(type?:any) {
            if(!this.crowdCode){
                if(type != '1') {
                    this.$message.info('请添加群体');
                }
                return;
            }
            this.expression = JSON.parse(JSON.stringify(this.value));
            if (this.expression.length == 0) {
                if(type != '1') {
                    this.$message.info('请添加表达式内容');
                }
                return;
            }
            if (this.expression && this.expression.length == 0) {
                if(type != '1'){
                    this.$message.info('请添加标签');
                }
                return;
            }
            const exp = this.buildCrowdExp();
            if (!exp) {
                this.$message.info('输入信息不规范');
                return;
            }
            // console.log(exp);
            // console.log(JSON.stringify(exp));
            this.crowdNum = -1;
            this.$bus.$emit('main-loading', true);
            this.crowdNumber(exp).then((num: any) => {
                this.$bus.$emit('main-loading', false);
                this.crowdNum = num;
            }).catch(err => {
                this.$bus.$emit('main-loading', false);
            });
        }

        private tagName: string = '';
        private list: any = [];
        private crowdCode: string = '';
        private crowd: any = {};
        private crowdCodeChange(){
            this.crowd = this.list.find((_item: any) => {
                return _item.crowdCode == this.crowdCode;
            });
            this.updateExpression();
        }

        private mounted() {
            this.queryList();
        }

        private init() {
            if (!this.curSubject) {
                return setTimeout(this.init, 500);
            }
            this.getExpreesion();
        }
        private getQueryList(query:any){
            clearTimeout(this.timer);
            this.loading3 = true;
            this.timer = setTimeout(() => {
                this.loading3 = false;
                this.keyword = query;
                this.queryList(query);
            }, 500);
        }
        // 获取群体列表
        private queryList(){
            const data:any = {
                subjectId: this.curSubject?.id,
                second2Crowd: 1,
                keyword: this.keyword
            };
            this.$bus.$emit('main-loading',true);
            this.$api.
            get('/api/ava/crowd/getAll', data).
            then((res: any) => {
                this.$bus.$emit('main-loading',false);
                this.list = res;
                this.treeType = true;
                // if (this.list.length == 0) {
                //     this.crowdCode = '';
                //     this.crowd = {};
                //     // this.$message('当前群体为空');
                // }else{
                //     this.crowdCode = res[0].crowdCode;
                //     this.crowd = res[0];
                //
                // }
                this.init();
                this.keyword = '';
            }).catch(err => {
                this.$bus.$emit('main-loading',false);
            });
        }

        // 删除选中群体
        private delCrowd(){
            this.crowdCode = '';
            this.crowd = {};
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
            const tagEnumVal = node && node.data ? node.data.tagEnumVal : '###';
console.log(999);
            this.enumList(tagEnumId, tagEnumVal).then((res: any) => {
                res.map((item: any) => {
                    item['compId'] = tagComp.id;
                });
                resolve(res);
            });
        }

        private handleTagCategoryClick(data: any) {
            if (!data || data.tagCateIsLeaf != 1) {
                return;
            }
            if (data.id == this.selectTagCategory) {
                return;
            }
            this.tagComponentList = [];
            this.tagList = [];
            this.selectTagCategory = data.id;
            this.loading1 = true;
            this.tagName = '';
            this.tagListAll([data.id]).then((res: any) => {
                this.loading1 = false;
                this.tagList = res.slice(0);
                if(this.tagList.length > 0 && this.tagList[0].tagGranted == 1){
                    this.handleCheckTagChange(this.tagList[0])
                }
            }).catch(err => {
                this.loading1 = false;
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
            if (node && node.data && node.data.tagEnumVal) {
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

        private handleEnumChange(data?: any, isSelect?: boolean) {
            console.log(data,isSelect);
            // if (!this.select) {
            //     return;
            // }
            // if (!this.selectTag) {
            //     return;
            // }

            const node:any = (this.$refs[`tree`] as any)[0].getNode(data.tagEnumVal);
            const nodeParent:any = this.getNodeParent(node.parent);
            data.nodeParent = nodeParent;

            const tagComp = this.getTagComp(data); //this.selectTag.tagCode;
            // console.log(tagComp);
            if (!tagComp) {
                return;
            }
            if (isSelect.checkedKeys.indexOf(data.tagEnumVal) != -1) {
                const tagIdx = this.value.findIndex((item: any) => {
                    return item.tagCode == tagComp.tagCode;
                });
                if (tagIdx >= 0) {
                    const _idx = this.value[tagIdx].enums.findIndex((item: any) => {
                        return item.tagEnumVal == data.tagEnumVal;
                    });
                    if (_idx < 0) {
                        this.value[tagIdx].enums.push(data);
                    }
                    if(this.tagComponentList[0].tagCompStyle == '22' && this.value[tagIdx]){
                        for (let i=0; i<this.value[tagIdx].enums.length; i++) {
                            if(this.value[tagIdx].enums[i].nodeParent && this.value[tagIdx].enums[i].nodeParent.length > 0){
                                const idx = this.value[tagIdx].enums[i].nodeParent.findIndex((item: any) => {
                                    return item.tagEnumVal == data.tagEnumVal;
                                });
                                if(idx>=0){
                                    (this.$refs[`tree`] as any)[0].setChecked(this.value[tagIdx].enums[i].tagEnumVal,false,false);
                                    this.value[tagIdx].enums.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                } else {
                    const newItem = tagComp; //JSON.parse(JSON.stringify(this.selectTag));
                    Object.assign(newItem, {
                        enums: [data]
                    });
                    this.value.push(newItem);
                    if(this.logic){
                        this.logic.push('_AND');
                    }
                }
            } else
                {
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
            this.expression = JSON.parse(JSON.stringify(this.value));
            this.updateExpression();
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
                    if(this.tagList.length > 0 && this.tagGranted == 1){
                        console.log(this.tagList[0]);
                        this.handleCheckTagChange(this.tagList[0])
                    }
                })
                .catch(err => {
                    this.loading1 = false;
                    this.tagList = [];
                    this.tagComponentList = []
                });
        }

        private getTagComp(tagEnumItem: any) {
            const tagComp = this.tagComponentList.find((item: any) => {
                return item.id == tagEnumItem.compId;
            });
            const tag = this.tagList.find((item: any) => {
                return item.tagCode == tagComp.tagCode;
            });
            // console.log(tagComp.tagCompStyle);
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
                // const tagCompCol = tagComp.tagComponentColumnReqVOList.find((item: any) => {
                //     return item.tagEnumLevelId == tagEnumItem.tagEnumLevelId;
                // });
                // if (!tagCompCol) {
                //     return null;
                // }
                // console.log(tagComp.tagComponentColumnReqVOList);
                return {
                    tagCompId: tagComp.id,
                    tagCode: tagComp.tagComponentColumnReqVOList[0].tagCompCol,
                    tagVal: `${tag.tagName}-${tagComp.tagCompName}`
                };
            }
            return null;
        }

        private delTagFromValue(idx: number, tagCompId?: number) {
            const tagVal:string = this.value[idx].tagVal;
            // console.log(this.selectTag);
            if (this.selectTag && tagVal === this.selectTag.tagName) {
                this.keys = [];
                for (const i in this.tagComponentList) {
                    const tree: any = (this.$refs[`tree`] as any)[0];
                    tree.setCheckedKeys([]);
                    this.tagComponentList[i].selectAll = false;
                }
            }
            this.value.splice(idx, 1);
            this.updateExpression();
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
            console.log(this.tagComponentList);
            this.keys = [];
            this.value.forEach((key: any) => {
                if (key.tagCode === this.selectTag.tagCode) {
                    key.enums.forEach((enums: any) => {
                        this.keys.push(enums.tagEnumVal);
                    });
                }
            });
        }

        private selectAll(select: any, id: number) {
            const tagComp = this.tagComponentList.find(item => {
                return item.id == id;
            });
            const tree: any = (this.$refs[`tree`] as any)[0];
            // console.log(tree);
            // console.log(tree.getNode());

            if (select) {
                const nodesMap = tree.store.nodesMap;
                // console.log(nodesMap);
                for (const key in nodesMap) {
                    const node: any = nodesMap[key];
                    tree.setChecked(node, true, true);
                    console.log(node.data.tagEnumVal);
                    this.handleEnumChange(node.data,{checkedKeys:[node.data.tagEnumVal]});
                }
                // console.log(nodes);
            } else {
                // 已选结果中移除
                const idx = this.value.findIndex(item => {
                    // return item.tagCode == tagComp.tagComponentColumnReqVOList[0].tagCompCol;
                    return item.tagCompId == tagComp.id;
                });
                this.value.splice(idx, 1);
                const nodesMap = tree.store.nodesMap;
                for (const key in nodesMap) {
                    const node: any = nodesMap[key];
                    this.handleEnumChange(node.data,{checkedKeys:[]});
                }
                // 树中移除
                tree.setCheckedKeys([]);
            }
        }

        private logicChange() {
            this.updateExpression();
        }

        private logicCrowdChange() {
            this.updateExpression();
        }

        // ========== session storage ==========

        private getExpreesion() {
            const subjectId = this.curSubject?.id;
            if (!subjectId) {
                return;
            }
            // console.log(this.expressionCache, subjectId, this.expressionCache.hasOwnProperty(subjectId));
            if (this.expressionCache.hasOwnProperty(subjectId)) {
                this.expression = this.expressionCache[subjectId].expression;
                this.logic = this.expressionCache[subjectId].logic;
                this.logicCrowd = this.expressionCache[subjectId].logicCrowd;
                // this.crowd = this.expressionCache[subjectId].crowd;
                this.crowdCode = this.expressionCache[subjectId].crowd.crowdCode;
                this.valueType = this.expressionCache[subjectId].valueType;
                this.value = JSON.parse(JSON.stringify(this.expression));

                this.crowd = this.list.find((_item: any) => {
                    return _item.crowdCode == this.crowdCode;
                });
                if (!this.crowd) {
                    this.crowd = {};
                    this.crowdCode = '';
                }
            } else {
                this.expression = [];
                this.logic = [];
                this.value = [];
                this.crowd = {};
                this.crowdCode = '';
            }
        }

        private updateExpression() {
            this.expression = JSON.parse(JSON.stringify(this.value));
            const subjectId = this.curSubject?.id;
            const payload = {
                subjectId: subjectId,
                expression: this.expression,
                logic: this.logic,
                logicCrowd: this.logicCrowd,
                crowd: this.crowd,
                valueType: this.valueType
            };
            this.$store.commit('setExpressionTwo', payload);
            this.valueChange();
        }

        private setExpression(crowdDefine: any) {
            this.expression = crowdDefine.expression;
            this.logic = crowdDefine.logic ? crowdDefine.logic : [];
            this.logicCrowd = crowdDefine.logicCrowd;
            this.crowd = crowdDefine.crowd;
            this.valueType = crowdDefine.valueType;
            this.updateExpression();
        }

        private validExp() {
            let notAll: boolean = true;
            if (this.value.length < 1) {
                this.$message.warning('当前标签为空，请选择标签');
                return false;
            }
            for (let i = 0; i < this.value.length; i++) {
                if (this.value[i].enums.length > 0) {
                    notAll = false;
                }
            }
            // if (notAll) {
            //     this.$message.warning('存在未选择值的标签，请检查');
            //     return false;
            // }
            return true;
        }

        private getExpression() {
            return {
                expression: this.expression,
                logic: this.logic,
                version: '5.0',
                logicCrowd: this.logicCrowd,
                crowd: this.crowd,
                crowdCode: this.crowdCode,
                valueType: this.valueType,
            };
        }

        private getConds (list:any) {
            const arr = [];
            const arr1 = [];
            for(const i in list){
                arr1.push(list[i].tagEnumVal);
            }
            arr.push({
                comparison: '_IN',
                colVals: arr1
            });

            return arr;
        }

        private buildCrowdExp() {
            const valid = this.validExp();
            if (!valid) {
                return;
            }
            const expression: any = {
                version: '5.0',
                elements: [],
                style: 'COMB'
            };

            for (const i in this.expression) {
                expression.elements.push({
                        tagCode: this.expression[i].tagCode,
                        tagCond: {
                            merge: "OR",
                            conds: this.getConds(this.expression[i].enums)
                        },
                        tagPart: {
                            form: 'LATEST'
                        },
                        type:"VALUE"
                });
                if(i < this.expression.length-1){
                    expression.elements.push(this.LOGIC[this.logic[i]]);
                }
            }

            if(this.valueType == '1'){
                expression.elements.unshift(this.LOGIC[this.logicCrowd]);
                expression.elements.unshift({
                    "groupCode": this.crowd.crowdCode,
                    "groupVersion": this.crowd.crowdVersion,
                    "type": "GROUP"
                });
            } else {
                expression.elements.push(this.LOGIC[this.logicCrowd]);
                expression.elements.push({
                    "groupCode": this.crowd.crowdCode,
                    "groupVersion": this.crowd.crowdVersion,
                    "type": "GROUP"
                });
            }

            expression.elements.unshift(this.L_BRE);
            expression.elements.push(this.R_BRE);

            return expression;
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
                    tagEnumId: tagEnumId,
                    pTagEnumVal: pTagEnumVal
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

        private crowdNumber(expression: any) {
            console.log(expression);
            return new Promise((resolve, reject) => {
                const url = '/api/ava/crowd/number';
                const data = {
                    expression: JSON.stringify(expression)
                };
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

        private goToList() {
            this.$router.push({
                path: '/crowd-manage'
            });
        }
    }
</script>
<style lang="scss" scoped>
    .two-crowd-info {
        height: 100%;
        position: relative;
        /*overflow-x: hidden;*/
        background: #fff;

        .pargraph > .title {
            height: 100%;
            line-height: 22px;
            font-size: 14px;
            color: rgba(0, 0, 0, 1);
        }
        .pargraph .title .text {
            padding: 20px;
            min-width: 800px;
            &>span>span{
                font-weight: bold;
            }
        }
        .line {
            width: 3px;
            height: 14px;
            background: #396bf6;
            margin-right: 10px;
            margin-top: 4px;
            float: left;
        }
        /deep/ .el-form-item__label {
            color: rgba(51, 51, 51, 1);
            font-family: PingFangSC-Medium;
        }
        /deep/ .com-width {
            margin-left: 20px;
        }
    }
    .select-enum {
        width: 100%;
        overflow: auto;
        position: absolute;
        top:137px;
        left:0;
        bottom: 0;
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
            min-width: 900px;
            height: 100%;
            display: flex;
            overflow: hidden;
            border-top: 1px solid #EAF0F9;
            border-left: 0;

            &-item {
                flex: 0 0 auto;
                padding-left: 10px;
                padding-right: 10px;
                min-width: 227px;
                width: 22%;
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
                        width: 6px;
                        height: 6px;
                        overflow: hidden;
                        border-radius: 50%;
                        left: -7px;
                        top: 13px;
                        background: #3a57fe;
                    }
                }
                &-body {
                    width: 100%;
                    // padding: 20px;
                    height: calc(100% - 42px);
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding: 0;
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
            .tag-item-f{
                color: #aaa;
                cursor: not-allowed;
            }
        }
        .select-list {
            // display: flex;
            // flex-direction: column;
            flex: 1 1 auto;
            .logic-select{
                padding: 0 8px;
                text-align: center;
                .el-radio-button--mini /deep/{
                    .el-radio-button__inner{
                        padding: 5px 10px;
                    }
                }
            }
            .tag-list-title{
                position: relative;
                height: 32px;
                line-height: 32px;
                font-size: 1rem;
                color: #1b1b1b;
                cursor: default;
                font-weight: bold;
                margin: 10px 10px 0 15px;
                padding-left: 5px;
                &:before {
                    position: absolute;
                    content: " ";
                    width: 8px;
                    height: 8px;
                    overflow: hidden;
                    left: -8px;
                    top: 12px;
                    background: #3a57fe;
                }
            }
            .select-item-crowd {
                min-height: 28px;
                background: #F6F8FB;
                border: 1px solid #EAF0F9;
                position: relative;
                padding:5px 25px 5px 8px;
                margin: 8px;
                position: relative;
                i {
                    position: absolute;
                    right: 10px;
                    top: 9px;
                    cursor: pointer;
                }
            }
            .select-item {
                min-height: 28px;
                background: #F6F8FB;
                border: 1px solid #EAF0F9;
                position: relative;
                padding:5px 25px 5px 8px;
                margin: 8px;

                .tag-name {
                    width: 100%;
                    min-height: 28px;
                    line-height: 28px;
                    position: relative;
                    color: #333;
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
