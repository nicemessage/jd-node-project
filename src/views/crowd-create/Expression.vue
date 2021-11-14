<template>
    <div class="expression" v-loading="loading">
        <div class="action">
            <span class="action-l">
                <span class="title">逻辑组合</span>
            </span>
            <span class="action-r">
                <el-button-group>
                    <el-button plain size="mini" @click="addExp"><i class="el-icon-plus"></i>新增分支</el-button>
                    <el-button plain size="mini" @click="calcCrowdNum" v-if="crowdNum < 0">
                        <span><i class="el-icon-check"></i>计算群体数量</span>
                    </el-button>
                    <el-button plain size="mini" v-if="crowdNum >= 0">
                        <span class="crowd-num">{{ `群体数量：${crowdNum}` }}</span>
                    </el-button>
                    <el-button plain size="mini" @click="cleanAll"><i class="el-icon-delete"></i>清空</el-button>
                </el-button-group>
            </span>
        </div>
        <div class="expression-list">
            <template v-for="(exp, index) of expression">
                <div v-if="index > 0" class="logic-select" :key="`logic-${index}`">
                    <el-radio-group v-model="expLogic[index - 1]" border size="mini" @change="logicChange">
                        <el-radio-button v-for="logic in logicList" :label="logic.value" :key="logic.value">
                            {{ logic.label }}
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div class="expression-item" :key="`exp-${index}`" @dragover="ondragoverHandle($event)" @drop="ondropHandle($event, index)">
                    <!--                    <div class="expression-item-index">-->
                    <!--                        <div class="rectangle"></div>-->
                    <!--                        分支{{index+1}}-->
                    <!--                    </div>-->
                    <div class="no-content" v-if="exp.length == 0">请拖入左侧标签，并选择标签值，可拖入多个标签</div>
                    <div class="expression-item-content" v-else>
                        <template v-for="(tag, _index) of exp.tag">
                            <div v-if="_index > 0" :key="`tag-logic-${_index}`" class="logic-select in">
                                <el-radio-group v-model="exp.logic[_index - 1]" border size="mini" @change="logicChange">
                                    <el-radio-button v-for="logic in logicList" :label="logic.value" :key="logic.value">
                                        {{ logic.label }}
                                    </el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="tag-item" :key="`tag-${_index}`">
                                <div class="tag-header">
                                    <el-tooltip :content="tag.tagData.tagName" placement="left">
                                        <div class="tag-name">{{ tag.tagData.tagName }}</div>
                                    </el-tooltip>
                                    <div class="tag-btns">
                                        <i class="el-icon-edit primary" @click="editTagInExp(tag, false)"></i>
                                        <i class="el-icon-delete" @click="delTagInExp(index, _index)"></i>
                                    </div>
                                </div>
                                <div class="tag-value">
                                    <div class="tag-value-item" v-for="(tagComponent, idx) of tag.tagComponent" :key="`tag-comp-idx-${idx}`">
                                        <span style="display: inline-block" v-if="tag.tagComponent.length > 1">
                                            {{ tagComponent.tagCompName }}：
                                        </span>
                                        <template v-if="isEnum(tagComponent.tagCompStyle)">
                                            <el-tooltip class="item" effect="dark" placement="right">
                                                <div slot="content">
                                                    {{
                                                        tag.tagValue[idx]
                                                            .map((item) => {
                                                                return showName(item);
                                                            })
                                                            .join('；')
                                                    }}
                                                </div>
                                                <span class="tag-value-name">
                                                    {{
                                                        `${tag.tagValue[idx]
                                                            .map((item) => {
                                                                return showName(item);
                                                            })
                                                            .join('；')}`
                                                    }}
                                                </span>
                                            </el-tooltip>
                                        </template>
                                        <span style="display: inline-block" v-else-if="isDate(tagComponent.tagCompStyle)">
                                            <template v-if="tagComponent.tagCompStyle == 11 || tagComponent.tagCompStyle == 19">
                                                <template v-if="tag.tagValue[idx].length == 1">
                                                    {{ `最近${tag.tagValue[idx][0]}天` }}
                                                </template>
                                                <template v-else>
                                                    {{ `${tag.tagValue[idx].map((item) => formatDate(item, 'YYYY-MM-DD')).join(' ~ ')}` }}
                                                </template>
                                            </template>
                                            <template v-else-if="tagComponent.tagCompStyle == 12">
                                                {{ `${tag.tagValue[idx].map((item) => formatDate(item, 'YYYY')).join(' ~ ')}` }}
                                            </template>
                                            <template v-else-if="tagComponent.tagCompStyle == 13">
                                                {{ `${tag.tagValue[idx].map((item) => formatDate(item, 'YYYY-MM')).join(' ~ ')}` }}
                                            </template>
                                            <template v-else>
                                                {{ `${tag.tagValue[idx].map((item) => formatDate(item, 'YYYY-MM-DD')).join(' ~ ')}` }}
                                            </template>
                                        </span>
                                        <span style="display: inline-block" v-else-if="isInput(tagComponent.tagCompStyle)">
                                            {{ `${tag.tagValue[idx].join('~')}` }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="add-tag-text">请拖入左侧标签，并选择标签值，可拖入多个标签</div>
                    </div>
                    <div class="action-btns">
                        <i class="el-icon-top btn" v-show="expression.length > 1 && index > 0" @click="moveUp(index)"></i>
                        <i class="el-icon-delete btn" v-show="expression.length > 1" @click="removeExp(index)"></i>
                        <i class="el-icon-bottom btn" v-show="expression.length > 1 && index < expression.length - 1" @click="moveDown(index)"></i>
                    </div>
                </div>
            </template>
        </div>
        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="showTagValueSelectDialog"
            :before-close="rollbackTagValueSelect"
            width="800px"
            :append-to-body="true"
        >
            <div slot="title" class="dialog-title">标签筛选</div>
            <div v-if="editTag && showTagValueSelectDialog">
                <div v-for="(component, index) of editTag.tagComponent" :key="component.id">
                    <template v-if="isEnum(component.tagCompStyle)">
                        <EnumComponent
                            :value.sync="editTag.tagValue[index]"
                            :tagEnumId="component.tagEnumId"
                            :tagCode="editTag.tagData.tagCode"
                            :tagComponentId="component.id"
                            :tagComponentName="component.tagCompName"
                            :canSelectAll="component.tagCompStyle == 21"
                        >
                        </EnumComponent>
                    </template>
                    <template v-else-if="isDate(component.tagCompStyle)">
                        <DateComponent :value.sync="editTag.tagValue[index]" :type="component.tagCompStyle" :tagComponetName="component.tagCompName">
                        </DateComponent>
                    </template>
                    <template v-else-if="isInput(component.tagCompStyle)">
                        <CustomInput :value.sync="editTag.tagValue[index]" :type="component.tagCompStyle" :tagComponetName="component.tagCompName">
                        </CustomInput>
                    </template>
                    <template v-else>
                        {{ component.tagCompName }}
                    </template>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="rollbackTagValueSelect">取消</el-button>
                <el-button size="medium" type="primary" @click="saveTagValue">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/**
 * @name Expression
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 表达式组件
 */
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入
import moment from 'moment';

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入
import DateComponent from './tag-component-part/Date.vue';
import EnumComponent from './tag-component-part/Enum.vue';
import CustomInput from './tag-component-part/CustomInput.vue';
// import Template from '@/Template.vue';

// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

@Component({
    components: {
        DateComponent,
        EnumComponent,
        CustomInput,
    },
})
export default class Expression extends Vue {
    @State((state) => state.curSubject) curSubject!: Subject | null;

    @Watch('curSubject')
    private subjectChange() {
        this.getExpreesion();
    }

    @State((state) => state.expression) expressionCache: any;
    @State((state) => state.expressionCode) expressionCacheCode: any;

    @Prop({
        default: -1,
    })
    private crowdNum!: number;

    private expression: any = [
        {
            tag: [],
            logic: [],
        },
    ];
    private expLogic: any = [];

    @Prop()
    private crowdData!: string;

    get code() {
        if (this.crowdData) {
            return this.crowdData.crowdCode;
        }
        return false;
    }

    private loading: boolean = false;

    private logicList: any = [
        {
            label: '或',
            value: '_OR',
        },
        {
            label: '且',
            value: '_AND',
        },
        {
            label: '非',
            value: '_NOT',
        },
    ];

    private LOGIC_OR = {
        logic: '_OR',
        type: 'LOGIC',
    };
    private LOGIC_AND = {
        logic: '_AND',
        type: 'LOGIC',
    };
    private LOGIC_NOT = {
        logic: '_NOT',
        type: 'LOGIC',
    };

    private L_BRE = {
        bre: '_L',
        type: 'BRE',
    };
    private R_BRE = {
        bre: '_R',
        type: 'BRE',
    };

    private showTagValueSelectDialog: boolean = false;
    private editTag: any = null;
    private rollbackValue: any = null;
    private newItemType: boolean = false;
    private idx: number = 0;

    private monitorList: Array<any> = [];

    private mounted() {
        this.addMonitor();
        this.init();
    }

    private addMonitor() {
        const updateTagValueId = this.$bus.$on('updateTagValue', () => {
            this.updateExpression();
        });
        this.monitorList.push({
            event: 'updateTagValue',
            id: updateTagValueId,
        });
    }

    // 展示标签路径
    private showName(data: any) {
        let name: string = data.tagEnumName;
        if (data.nodeParent && data.nodeParent.length > 0) {
            data.nodeParent.forEach((item: any) => {
                name = `${item.tagEnumName}-${name}`;
            });
        }
        return name;
    }

    private beforeDestroy() {
        this.monitorList.forEach((monitor: any) => {
            this.$bus.$off(monitor.event, monitor.id);
        });
    }

    private init() {
        if (!this.curSubject) {
            return setTimeout(this.init, 500);
        }

        this.getExpreesion();
    }

    private formatDate(dateStr: string, formatStr?: string) {
        // console.log(dateStr, formatStr);
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    private isDate(state: number) {
        const list = [11, 12, 13, 14, 15, 16, 17, 18, 19];
        const set = new Set(list);
        if (set.has(state)) {
            return true;
        }
        return false;
    }

    private isEnum(state: number) {
        const list = [21, 22];
        const set = new Set(list);
        if (set.has(state)) {
            return true;
        }
        return false;
    }

    private isInput(state: number) {
        const list = [31, 32];
        const set = new Set(list);
        if (set.has(state)) {
            return true;
        }
        return false;
    }

    private cleanAll() {
        // to-do 增加一个确认弹窗
        this.expression = [
            {
                tag: [],
                logic: [],
            },
        ];
        this.expLogic = [];
        this.updateExpression();
    }

    private addExp() {
        if (this.expression.length == 10) {
            this.$message.warning('上限10个分支，无法继续添加');
            return;
        }
        this.expression.push({
            tag: [],
            logic: [],
        });
        this.expLogic.push('_AND');
        this.updateExpression();
    }

    private removeExp(idx: number) {
        if (this.expression.length <= idx) {
            console.log('无效索引');
            return;
        }
        this.expression.splice(idx, 1);
        this.expLogic.splice(idx - 1, 1);
        this.updateExpression();
    }

    private moveUp(idx: number) {
        this.expression[idx] = this.expression.splice(idx - 1, 1, this.expression[idx])[0];
        this.updateExpression();
    }

    private moveDown(idx: number) {
        this.expression[idx] = this.expression.splice(idx + 1, 1, this.expression[idx])[0];
        this.updateExpression();
    }

    private delTagInExp(expIndex: number, tagIndex: number) {
        if (expIndex === undefined || tagIndex === undefined) {
            return;
        }
        this.expression[expIndex]['tag'].splice(tagIndex, 1);
        this.expression[expIndex]['logic'].splice(tagIndex - 1, 1);
        this.updateExpression();
    }

    private editTagInExp(tag: any, newItemType?: any) {
        this.editTag = tag;
        this.rollbackValue = JSON.parse(JSON.stringify(tag.tagValue));
        this.showTagValueSelectDialog = true;
        this.newItemType = newItemType;
    }

    private rollbackTagValueSelect() {
        this.editTag.tagValue = this.rollbackValue;
        this.showTagValueSelectDialog = false;
        if (this.newItemType) {
            // console.log(this.expression[this.idx],this.idx);
            this.delTagInExp(this.idx, this.expression[this.idx]['tag'].length - 1);
        }
        // this.delTagInExp(index, _index)
        this.updateExpression();
    }

    // 检查逻辑组合信息,符合标签必须填写完整
    private validation() {
        // const rollbackValue:any = this.expression[this.idx]['tag'][0].tagValue;
        const tag: any = this.expression[this.idx]['tag'];

        for (const j in tag) {
            if (tag[j].tagValue.length > 1) {
                for (const i in tag[j].tagValue) {
                    if (tag[j].tagValue[i].length == 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private saveTagValue() {
        // if(this.validation()){
        //     this.$message.info('请添加枚举值');
        //     return false;
        // }
        this.showTagValueSelectDialog = false;
        this.updateExpression();
    }

    private calcCrowdNum(type?: any) {
        if (this.expression.length == 0) {
            if (type != '1') {
                this.$message.info('请添加表达式内容');
            }
            return;
        }
        if (this.expression.length == 1 && this.expression[0].tag.length == 0) {
            if (type != '1') {
                this.$message.info('请添加标签');
            }
            return;
        }
        const valid = this.validExp();
        if (!valid) {
            return;
        }
        const exp = this.buildCrowdExp();
        if (!exp) {
            this.$message.info('输入信息不规范');
            return;
        }
        // console.log(exp);
        // console.log(JSON.stringify(exp));
        this.$emit('update:crowdNum', -1);
        this.$bus.$emit('main-loading', true);
        this.crowdNumber(exp)
            .then((num: any) => {
                this.$bus.$emit('main-loading', false);
                this.$emit('update:crowdNum', num);
            })
            .catch((err) => {
                this.$bus.$emit('main-loading', false);
            });
    }

    private getExpression() {
        return {
            expression: this.expression,
            logic: this.expLogic,
            version: '5.0',
        };
    }

    private buildCrowdExp() {
        const valid = this.validExp();
        if (!valid) {
            return;
        }
        try {
            const expression: any = {
                version: '5.0',
                elements: [],
                style: 'COND',
            };
            console.log(this.expression);
            this.expression.forEach((exp: any, index: number) => {
                let fragment: Array<any> = [];
                // console.log(exp.tag);
                if (exp.tag.length == 1) {
                    fragment = this.buildTagComponet(exp.tag[0]);
                } else if (exp.tag.length > 1) {
                    exp.tag.forEach((tag: any, _index: number) => {
                        const item = this.buildTagComponet(tag);
                        if (item) {
                            fragment = fragment.concat(item);
                            console.log(_index, exp.logic);
                            fragment.push({
                                logic: exp.logic[_index],
                                type: 'LOGIC',
                            });
                        }
                    });
                    if (fragment[fragment.length - 1] && fragment[fragment.length - 1].type == 'LOGIC') {
                        fragment.pop();
                    }
                    if (fragment.length > 1) {
                        fragment.unshift(this.L_BRE);
                        fragment.push(this.R_BRE);
                    }
                }
                if (fragment && fragment.length > 0) {
                    expression.elements = expression.elements.concat(fragment);
                    expression.elements.push({
                        logic: this.expLogic[index],
                        type: 'LOGIC',
                    });
                }
            });
            // console.log(expression.elements);
            if (expression.elements[expression.elements.length - 1].type == 'LOGIC') {
                expression.elements.pop();
            }

            expression.elements.unshift(this.L_BRE);
            expression.elements.push(this.R_BRE);
            return expression;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    private validExp() {
        // console.log(this.expression);
        for (let i = 0; i < this.expression.length; i++) {
            const exp = this.expression[i];
            if (exp.tag.length < 1) {
                this.$message.warning('存在未包含标签的表达式片段，请检查');
                return false;
            }
            let notAll: boolean = true;
            for (let j = 0; j < exp.tag.length; j++) {
                const tagValue = exp.tag[j].tagValue;
                tagValue.forEach((value: any) => {
                    if (value.length > 0) {
                        notAll = false;
                    }
                });
            }
            if (notAll) {
                this.$message.warning('存在未选择值的标签，请检查');
                return false;
            }
        }
        return true;
    }

    private buildTagComponet(tag: any) {
        if (tag.tagComponent.length > 1) {
            let list: any = [];
            let count = 0;
            const len = tag.tagComponent.length;
            let dt: any = []; // dt类别组件字段处理，只有第一个有效，其余忽略
            for (let i = 0; i < len; i++) {
                const item = this.buildTagComponet({
                    tagComponent: [tag.tagComponent[i]],
                    tagValue: [tag.tagValue[i]],
                });
                if (item) {
                    // console.log(item);
                    if (item[0].tagCode == `${tag.tagData.tagCode}_dt`) {
                        dt = dt.concat(item);
                    } else {
                        list = list.concat(item);
                        count++;
                        list.push(this.LOGIC_AND);
                    }
                }
            }
            list.pop();
            if (count > 1) {
                list.unshift(this.L_BRE);
                list.push(this.R_BRE);
            }
            // console.log(list);
            if (dt.length > 0) {
                const _dt = dt[0];
                list.forEach((item: any) => {
                    if (item.type == 'VALUE') {
                        item.tagPart = {
                            form: 'CUSTOM',
                            boundary: _dt.tagCond.conds,
                        };
                    }
                });
            }
            return list;
        } else if (tag.tagComponent.length == 1) {
            const tagComponent: any = tag.tagComponent[0];
            if (this.isEnum(tagComponent.tagCompStyle)) {
                return this.buildEnumItem(tag.tagComponent[0], tag.tagValue[0]);
            } else if (this.isDate(tagComponent.tagCompStyle)) {
                return this.buildDateItem(tag.tagComponent[0], tag.tagValue[0]);
            } else if (this.isInput(tagComponent.tagCompStyle)) {
                return this.buildInputItem(tag.tagComponent[0], tag.tagValue[0]);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    private buildEnumItem(tagComponent: any, values: any) {
        if (!values || values.length == 0) {
            return null;
        }
        if (tagComponent.tagCompStyle == 21) {
            const valList: any = [];
            values.forEach((_value: any) => {
                valList.push(_value.tagEnumVal);
            });
            const item: any = {
                tagCode: tagComponent.tagComponentColumnReqVOList[0].tagCompCol,
                tagCond: {
                    merge: 'OR',
                    conds: [
                        {
                            comparison: '_IN',
                            colVals: valList,
                        },
                    ],
                },
                tagPart: {
                    form: 'LATEST',
                },
                type: 'VALUE',
            };
            return [item];
        } else if (tagComponent.tagCompStyle == 21 || tagComponent.tagCompStyle == 22) {
            const list: Array<any> = [];
            let count = 0;
            tagComponent.tagComponentColumnReqVOList.forEach((tagComponCol: any) => {
                const valList: any = [];
                values.forEach((_value: any) => {
                    if (_value.tagEnumLevelId == tagComponCol.tagEnumLevelId) {
                        valList.push(_value.tagEnumVal);
                    }
                });
                if (valList.length > 0) {
                    const item: any = {
                        tagCode: tagComponCol.tagCompCol,
                        tagCond: {
                            merge: 'OR',
                            conds: [
                                {
                                    comparison: '_IN',
                                    colVals: valList,
                                },
                            ],
                        },
                        tagPart: {
                            form: 'LATEST',
                        },
                        type: 'VALUE',
                    };
                    list.push(item);
                    count++;
                    console.log(99);
                    list.push(this.LOGIC_OR);
                }
            });
            list.pop();
            if (count > 1) {
                list.unshift(this.L_BRE);
                list.push(this.R_BRE);
            }
            return list;
        } else {
            return null;
        }
    }

    private buildDateItem(tagComponent: any, values: any) {
        if (!values || values.length == 0) {
            return null;
        }
        if (tagComponent.tagCompStyle == 11 || tagComponent.tagCompStyle == 19) {
            if (values.length == 1) {
                console.log(tagComponent);
                const item: any = {
                    tagCode: tagComponent.tagComponentColumnReqVOList[0].tagCompCol, //tagComponent.tagCode,
                    tagCond: {
                        merge: 'OR',
                        conds: [
                            {
                                comparison: '_BEFORE_DAYS',
                                colVals: values,
                            },
                        ],
                    },
                    tagPart: {
                        form: 'LATEST',
                    },
                    type: 'VALUE',
                };
                return [item];
            } else if (values.length > 1) {
                const item: any = {
                    tagCode: tagComponent.tagComponentColumnReqVOList[0].tagCompCol, //tagComponent.tagCode,
                    tagCond: {
                        merge: 'AND',
                        conds: [
                            {
                                comparison: '_GREATER_OR_EQUALS',
                                colVals: [values[0] / 1000],
                            },
                            {
                                comparison: '_LESS_OR_EQUALS',
                                colVals: [values[1] / 1000],
                            },
                        ],
                    },
                    tagPart: {
                        form: 'LATEST',
                    },
                    type: 'VALUE',
                };
                return [item];
            } else {
                return null;
            }
        } else {
            const item: any = {
                tagCode: tagComponent.tagComponentColumnReqVOList[0].tagCompCol, //tagComponent.tagCode,
                tagCond: {
                    merge: 'AND',
                    conds: [
                        {
                            comparison: '_GREATER_OR_EQUALS',
                            colVals: [values[0] / 1000],
                        },
                        {
                            comparison: '_LESS_OR_EQUALS',
                            colVals: [values[1] / 1000],
                        },
                    ],
                },
                tagPart: {
                    form: 'LATEST',
                },
                type: 'VALUE',
            };
            return [item];
        }
    }

    private buildInputItem(tagComponent: any, values: any) {
        if (!values || values.length == 0) {
            return null;
        }
        if (tagComponent.tagCompStyle == 31) {
            const item: any = {
                tagCode: tagComponent.tagComponentColumnReqVOList[0].tagCompCol, //tagComponent.tagCode,
                tagCond: {
                    merge: 'AND',
                    conds: [
                        {
                            comparison: '_GREATER_OR_EQUALS',
                            colVals: [values[0]],
                        },
                        {
                            comparison: '_LESS_OR_EQUALS',
                            colVals: [values[1]],
                        },
                    ],
                },
                tagPart: {
                    form: 'LATEST',
                },
                type: 'VALUE',
            };
            return [item];
        } else if (tagComponent.tagCompStyle == 32) {
            const item: any = {
                tagCode: tagComponent.tagComponentColumnReqVOList[0].tagCompCol, //tagComponent.tagCode,
                tagCond: {
                    merge: 'OR',
                    conds: [
                        {
                            comparison: '_IN',
                            colVals: values,
                        },
                    ],
                },
                tagPart: {
                    form: 'LATEST',
                },
                type: 'VALUE',
            };
            return [item];
        } else {
            return null;
        }
    }

    private logicChange() {
        this.updateExpression();
    }

    // ========== session storage ==========

    private getExpreesion() {
        const subjectId = this.curSubject?.id;
        if (!subjectId) {
            return;
        }
        console.log('get catch');
        // expressionCacheCode
        if (this.code && this.expressionCacheCode.hasOwnProperty(subjectId)) {
            this.expression = this.expressionCacheCode[subjectId].expression;
            this.expLogic = this.expressionCacheCode[subjectId].expLogic;
            // this.calcCrowdNum('1');
        } else if (!this.code && this.expressionCache.hasOwnProperty(subjectId)) {
            this.expression = this.expressionCache[subjectId].expression;
            this.expLogic = this.expressionCache[subjectId].expLogic;
            // this.calcCrowdNum('1');
        } else {
            this.expression = [
                {
                    tag: [],
                    logic: [],
                    version: '5.0',
                },
            ];
            this.expLogic = [];
        }
    }

    private updateExpression() {
        const subjectId = this.curSubject?.id;
        const payload = {
            subjectId: subjectId,
            expression: this.expression,
            expLogic: this.expLogic,
        };
        if (this.code) {
            this.$store.commit('setExpressionCode', payload);
        } else {
            this.$store.commit('setExpression', payload);
        }

        this.$emit('update:crowdNum', -1);
    }

    private setExpression(crowdDefine: any) {
        // console.log(crowdDefine);
        this.expression = crowdDefine.expression
            ? crowdDefine.expression
            : [
                  {
                      tag: [],
                      logic: [],
                      version: '5.0',
                  },
              ];
        this.expLogic = crowdDefine.logic ? crowdDefine.logic : [];
        this.updateExpression();
    }

    // ========== event ==========

    private ondragoverHandle(ev: any) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
    }

    private ondropHandle(ev: any, idx: number) {
        ev.preventDefault();
        const dataStr = ev.dataTransfer.getData('text');
        const tag = JSON.parse(dataStr);
        // ev.dataTransfer.clearData();
        this.idx = idx;
        // this.expression[idx].push(tag);
        if (tag.tagCode) {
            this.addNewExpressItem(tag.tagCode, idx);
        }
    }

    private addNewExpressItem(tagCode: string, idx: number) {
        if (this.expression[idx].length == 20) {
            this.$message.warning('单个分支最多添加20个标签');
            return;
        }
        const index = this.expression[idx]['tag'].findIndex((item: any) => {
            return item && item.tagData && item.tagData.tagCode == tagCode;
        });
        // console.log(index);
        if (index >= 0) {
            this.$message.warning('此分支内已添加该标签');
            return;
        }
        this.$bus.$emit('main-loading', true);
        this.tagFetch(tagCode)
            .then((res: any) => {
                console.log(res);
                this.$bus.$emit('main-loading', false);
                const len: number = res.tagComponentReqVOList.length;
                const values: any = [];
                for (let i = 0; i < len; i++) {
                    values.push([]);
                }
                const tagComponent = res.tagComponentReqVOList.slice(0);
                const tagData: any = res;
                delete tagData.tagComponentReqVOList;
                const newItem = {
                    tagData: tagData,
                    tagComponent: tagComponent,
                    tagValue: values,
                };

                this.expression[idx]['tag'].push(newItem);
                if (this.expression[idx]['tag'].length > 1) {
                    this.expression[idx]['logic'].push('_AND');
                }
                this.newItemType = true;
                this.editTagInExp(newItem, true);
            })
            .catch((err) => {
                this.$bus.$emit('main-loading', false);
            });
    }

    // ========== ajax request  ==========

    private tagFetch(tagCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tag/fetch';
            const data = {
                tagCode: tagCode,
            };
            this.$api
                .get(url, data)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    private crowdNumber(expression: any) {
        console.log(expression);
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/number';
            const data = {
                expression: JSON.stringify(expression),
            };
            this.$api
                .post(url, data)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
</script>
<style lang="scss" scoped>
.tag-value-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    display: inline-block;
    position: relative;
    line-height: 11px;
    top: 1px;
}
.expression {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 18px 20px;
    .el-radio-button--mini /deep/ {
        .el-radio-button__inner {
            padding: 5px 10px;
        }
    }
    .action {
        width: 100%;
        height: 50px;
        /*border-bottom: 1px solid #EAF0F9;*/

        .action-l {
            float: left;
            padding-bottom: 5px;
        }

        .action-r {
            float: right;
            padding-bottom: 5px;

            i {
                margin-right: 5px;
            }
        }

        .title {
            position: relative;
            font-size: 1rem;
            font-weight: bold;
            color: #1b1b1b;
            cursor: default;
            padding-left: 10px;
            height: 32px;
            line-height: 32px;

            &:before {
                position: absolute;
                content: ' ';
                width: 3px;
                height: 12px;
                overflow: hidden;
                left: 0;
                top: 4px;
                background: #3a57fe;
            }
        }
    }

    .expression-list {
        width: 100%;
        height: calc(100% - 58px);
        position: relative;
        overflow-y: auto;

        // display: flex;
        // flex-direction: column;
        // align-items: center;

        .expression-item {
            position: relative;
            width: 100%;
            height: auto;
            min-height: 130px;
            background: #f6f8fb;
            border: 1px solid #d9e0e5;
            /*border-radius: 4px;*/
            margin: {
                left: auto;
                right: auto;
            }
            cursor: default;
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            &-index {
                width: 100%;
                height: 24px;
                padding: 0 10px;
                line-height: 24px;
                color: #333333;

                .rectangle {
                    width: 5px;
                    height: 5px;
                    background-color: #3e6af6;
                    display: inline-block;
                    margin-right: 10px;
                    margin-bottom: 1px;
                }
            }

            .no-content {
                width: calc(100% - 32px);
                height: 100%;
                padding: 0 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.875rem;
                color: rgba(189, 189, 189, 1);
            }

            &-content {
                width: calc(100% - 32px);
                height: 100%;
                padding: 10px;

                .tag-item {
                    width: 100%;
                    min-height: 36px;
                    background: #fff;
                    border: 1px solid #d9e0e5;

                    margin-bottom: 5px;

                    padding: 10px 15px;

                    &:last-child {
                        margin-bottom: 0px;
                    }

                    .tag-header {
                        width: 100%;
                        height: 25px;
                        overflow: hidden;
                        line-height: 30px;
                        display: flex;
                        color: #333333;
                        .tag-name {
                            flex: 1 1 auto;
                            text-align: left;
                            box-sizing: content-box;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                        .tag-btns {
                            flex: 0 0 auto;
                            margin-right: 12px;
                            display: flex;
                            align-items: center;

                            i {
                                width: 12px;
                                height: 12px;
                                margin-left: 10px;
                                cursor: pointer;
                            }
                        }
                    }

                    .tag-value {
                        width: 100%;

                        &-item {
                            width: 100%;
                            // height: 22px;
                            line-height: 22px;
                            color: #888888;
                            font-size: 0.75rem;
                        }
                    }
                }

                .add-tag-text {
                    text-align: center;
                    color: #bbbdc1;
                    font-size: 12px;
                }
            }

            .action-btns {
                padding-top: 10px;
                width: 32px;
                display: flex;
                flex-direction: column;

                .btn {
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    border-radius: 50%;
                    color: #999999;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 2px 4px 0px rgba(196, 196, 196, 0.5);
                    cursor: pointer;
                    font-size: 0.75rem;
                    margin-bottom: 10px;

                    &:last-child {
                        margin-bottom: 0px;
                    }
                }
            }
        }

        .logic-select {
            position: relative;
            width: 130px;
            margin: {
                top: 5px;
                bottom: 5px;
                left: auto;
                right: auto;
            }

            &.in {
                margin-left: 0px;
            }
        }
    }

    .tag-enum-list {
        max-height: 500px;
        overflow-y: auto;
    }
}
</style>
