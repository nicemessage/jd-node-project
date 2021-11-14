<template>
    <section
        class="enum-select"
        v-loading="enumLoading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255)"
    >
        <template v-if="enumList.length > 0">
            <div class="enum-warp self-scroll">
                <div v-for="(item, index) in enumList" :key="index" class="enum-item">
                    <div class="enum-name">
                        <p>
                            <span class="con-name">{{ item.tagComponentName }}</span>
                            <el-checkbox
                                :indeterminate="isIndeterminate"
                                v-model="checkAll"
                                @change="handleCheckAllChange(item)"
                                v-if="item.tagComponentStyle == TAG_MULTIPLE"
                                >全选</el-checkbox
                            >
                        </p>
                        <el-input
                            v-if="item.tagComponentStyle == TAG_MULTIPLE"
                            class="com-input enum-width"
                            placeholder="请输入枚举名称"
                            v-model="enumParams.keyWord"
                            clearable
                            @input="inpSearchEnum(item, index)"
                            @clear="searchEnum(item, index)"
                        >
                        </el-input>
                    </div>
                    <template v-if="item.tagComponentStyle == TAG_MULTIPLE_N">
                        <div class="tree-box">
                            <el-tree
                                :data="item.children"
                                :props="enumPropsMore"
                                :load="loadEnum"
                                :check-strictly="false"
                                lazy
                                node-key="tagEnumVal"
                                show-checkbox
                                ref="enumTree"
                                class="common-el"
                                @check-change="treeCheck"
                            >
                            </el-tree>
                        </div>
                    </template>
                    <template v-if="item.tagComponentStyle == TAG_MULTIPLE">
                        <div class="tree-box">
                            <div class="enum-box">
                                <el-checkbox-group
                                    v-model="item.val"
                                    @change="handleCheckedCitiesChange(item.val, item.children)"
                                    v-if="item.children && item.children.length > 0"
                                >
                                    <el-checkbox v-for="(data, active) in item.children" :key="active" :label="data" class="check-item">
                                        <el-popover
                                            placement="top-start"
                                            trigger="hover"
                                            :content="data.tagEnumName"
                                            v-if="data.tagEnumName.length > 10"
                                        >
                                            <span slot="reference" class="enum-text">{{ data.tagEnumName }}</span>
                                        </el-popover>
                                        <span v-else class="enum-text">{{ data.tagEnumName }}</span>
                                    </el-checkbox>
                                </el-checkbox-group>
                                <span v-else class="enum-empty">暂无数据</span>
                            </div>
                        </div>
                    </template>
                    <template v-if="item.tagComponentStyle == TAG_NUM">
                        <div class="enum-box">
                            <el-input-number v-model="item.val[0]" class="enum-num"></el-input-number>
                            <!-- <el-input v-model="item.val[0]" type="number" clearable class="num-width com-input"> </el-input> -->
                            <span class="concat-line"></span>
                            <el-input-number v-model="item.val[1]" class="enum-num"></el-input-number>
                            <!-- <el-input v-model="item.val[1]" type="number" clearable class="num-width com-input"> </el-input> -->
                        </div>
                    </template>
                    <template v-if="item.tagComponentStyle == TAG_TEXT">
                        <div class="enum-box">
                            <el-input v-model="item.val" type="text" clearable class="enum-width com-input" placeholder="请输入"> </el-input>
                        </div>
                    </template>
                    <template v-if="item.tagComponentStyle == TAG_YEAR">
                        <div class="enum-box">
                            <el-date-picker
                                v-model="item.val[0]"
                                type="year"
                                placeholder="开始"
                                :picker-options="todayEnd"
                                value-format="yyyy"
                                class="year-width com-date"
                            >
                            </el-date-picker>
                            <span class="concat-line"></span>
                            <el-date-picker
                                v-model="item.val[1]"
                                type="year"
                                placeholder="结束"
                                :picker-options="todayEnd"
                                value-format="yyyy"
                                class="year-width com-date"
                            >
                            </el-date-picker>
                        </div>
                    </template>
                    <template v-if="item.tagComponentStyle == TAG_DATE">
                        <div class="enum-box">
                            <el-date-picker
                                v-model="item.val"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                class="enum-long-width com-date"
                            >
                            </el-date-picker>
                        </div>
                    </template>
                    <template v-if="item.tagComponentStyle == TAG_TIME">
                        <div class="enum-box">
                            <el-time-picker
                                v-model="item.val"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                is-range
                                value-format="HH:mm:ss"
                                class="enum-long-width com-date"
                            >
                            </el-time-picker>
                        </div>
                    </template>
                    <template v-if="item.tagComponentStyle == TAG_NEAR">
                        <div class="enum-box">
                            <!-- <el-input v-model="item.val" type="number" clearable class="num-width com-input"> </el-input> -->
                            <el-input-number v-model="item.val" class="enum-num" :min="1"></el-input-number>
                            <span class="enum-label">(近x天)</span>
                        </div>
                    </template>
                    <template
                        v-if="
                            item.tagComponentStyle == TAG_MONTH ||
                                item.tagComponentStyle == TAG_DAY ||
                                item.tagComponentStyle == TAG_HOUR ||
                                item.tagComponentStyle == TAG_MIN ||
                                item.tagComponentStyle == TAG_SECOND
                        "
                    >
                        <div class="enum-box">
                            <el-select class="com-select select-width" placeholder="请选择" v-model="item.val" clearable>
                                <el-option v-for="(item, index) in enumOption[item.tagComponentStyle]" :key="index" :label="item" :value="item">
                                </el-option>
                            </el-select>
                            <span class="enum-label" v-if="item.tagComponentStyle == TAG_MONTH">月</span>
                            <span class="enum-label" v-if="item.tagComponentStyle == TAG_DAY">日</span>
                            <span class="enum-label" v-if="item.tagComponentStyle == TAG_HOUR">时</span>
                            <span class="enum-label" v-if="item.tagComponentStyle == TAG_MIN">分</span>
                            <span class="enum-label" v-if="item.tagComponentStyle == TAG_SECOND">秒</span>
                        </div>
                    </template>
                </div>
            </div>
            <div class="footer-btn">
<!--                <el-button class="com-button" @click="cancel">取消</el-button>-->
                <el-button class="com-button" type="primary" @click="saveEnum">保存</el-button>
            </div>
        </template>
        <div v-if="enumList.length == 0 && !enumLoading" class="enum-empty">暂无数据</div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {
    TAG_MULTIPLE,
    TAG_MULTIPLE_N,
    TAG_DATE,
    TAG_YEAR,
    TAG_TIME,
    TAG_NEAR,
    TAG_NUM,
    TAG_TEXT,
    TAG_MONTH,
    TAG_DAY,
    TAG_HOUR,
    TAG_MIN,
    TAG_SECOND
} from '@/assets/utils/const-val';
@Component
export default class TagConnect extends Vue {
    @Prop({ type: Object }) private tagInfo?: any;
    private TAG_MULTIPLE: number = TAG_MULTIPLE;
    private TAG_MULTIPLE_N: number = TAG_MULTIPLE_N;
    private TAG_DATE: number = TAG_DATE;
    private TAG_YEAR: number = TAG_YEAR;
    private TAG_TIME: number = TAG_TIME;
    private TAG_NEAR: number = TAG_NEAR;
    private TAG_NUM: number = TAG_NUM;
    private TAG_TEXT: number = TAG_TEXT;
    private TAG_MONTH: number = TAG_MONTH;
    private TAG_DAY: number = TAG_DAY;
    private TAG_HOUR: number = TAG_HOUR;
    private TAG_MIN: number = TAG_MIN;
    private TAG_SECOND: number = TAG_SECOND;
    private enumLoading: boolean = false;
    private enumPropsMore: any = {
        children: 'children',
        label: 'tagEnumName',
        isLeaf: 'leaf'
    }; //树形默认数据结构
    private todayEnd: any = {
        disabledDate(time: any) {
            const curDate = new Date().getTime();
            const days = 36500 * 24 * 3600 * 1000;
            const timer = curDate - days;
            return time.getTime() > Date.now() || time.getTime() < timer;
        }
    }; //今天以前的时间
    private enumOption: any = {
        '13': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        '14': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        '16': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        '17': [],
        '18': []
    };
    private symbolTip: any = {
        '=': '_EQUALS',
        '!=': '_NOT_EQUALS',
        '<': '_LESS',
        '>': '_GREATER',
        '<=': '_LESS_OR_EQUALS',
        '>=': '_GREATER_OR_EQUALS',
        IN: '_IN',
        NOT_IN: '_NOT_IN'
    };
    private enumList: any[] = [];
    private saveTrueEnum: any[] = [];
    private isIndeterminate: boolean = false;
    private checkAll: boolean = false;
    private enumTimer: any = undefined;
    private maxHeight: number = 0;
    private treeChecked: any[] = [];
    private enumParams: any = {
        tagCode: '',
        keyWord: ''
    };
    private tagData: any = {
        tagCode: '',
        where: {
            colsAnd: [],
            colsOr: []
        },
        type: 'VAL'
    };
    private tagShow: any = {
        tagName: '',
        data: []
    };
    private tagDataBase: any = {
        tagCode: '',
        where: {
            colsAnd: [],
            colsOr: []
        },
        type: 'VAL'
    };
    private tagShowBase: any = {
        tagName: '',
        data: []
    };
    private mounted(): void {
        for (let i = 0; i < 60; i++) {
            this.enumOption[TAG_MIN].push(i);
            this.enumOption[TAG_SECOND].push(i);
        }
        window.addEventListener('resize', this.resizeEvent, true);
    }
    private beforeDestroy(): void {
        window.removeEventListener('resize', this.resizeEvent, true);
    }
    private resizeEvent(): void {
        const dialog: any = document.querySelector('.enum-dialog');
        if (!dialog) {
            return;
        }
        const enumWrap: any = dialog.querySelector('.enum-warp');
        const enumHeader: any = dialog.querySelector('.el-dialog__header');
        const enumFooter: any = dialog.querySelector('.footer-btn');
        if (dialog && enumWrap) {
            this.maxHeight = dialog.offsetHeight - enumHeader.offsetHeight - enumFooter.offsetHeight - 40;
            enumWrap.style.maxHeight = `${this.maxHeight}px`;
        }
    }
    @Watch('tagInfo', { immediate: true, deep: true })
    private handler(val: any): void {
        if (val.tagCode || (val.tagData && val.tagData.tagCode)) {
            if (val.tagData) {
                this.tagData = JSON.parse(JSON.stringify(val.tagData));
                this.tagShow = JSON.parse(JSON.stringify(val.tagShow));
            } else {
                this.$set(this.tagData, 'tagCode', val.tagCode);
                this.$set(this.tagData, 'where', { colsAnd: [], colsOr: [] });
                this.$set(this.tagShow, 'data', []);
                this.$set(this.tagShow, 'tagName', val.tagName);
            }
            this.$set(this.enumParams, 'tagCode', this.tagData.tagCode);
            this.tagDataBase = JSON.parse(JSON.stringify(this.tagData));
            this.tagShowBase = JSON.parse(JSON.stringify(this.tagShow));
            this.isIndeterminate = false;
            this.checkAll = false;
            this.getEnumComponent();
        }
    }
    private getEnumComponent(): void {
        this.enumLoading = true;
        const params: any = {
            tagCode: this.tagData.tagCode
        };
        this.$api
            .get('/api/business/tag/queryTagComponent', params)
            .then((res: any) => {
                // res[0].tagComponentStyle = this.TAG_NEAR;
                this.getEnum(res);
            })
            .catch(() => {
                this.$message.error('获取组件失败');
                this.enumLoading = false;
            });
    }
    private async getEnum(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            let item: any = arr[i];
            let dataStr: string = '';
            let dataDbArr: any[] = ['', ''];
            item.tagComponentName = item.tagComponentName.replace(/\n+/g, '');
            item.tagComponentColumnVOList.forEach((com: any) => {
                if (!com.tagColumnComponentId) {
                    com.tagColumnComponentId = 0;
                }
                if (!com.tagEnumGroupId) {
                    com.tagEnumGroupId = 0;
                }
                if (!com.tagComponentColumnSort) {
                    com.tagComponentColumnSort = 0;
                }
            });
            item.tagComponentColumnVOList.sort(this.enumSort);
            switch (item.tagComponentStyle) {
                case TAG_MULTIPLE:
                    item = Object.assign(item, {
                        id: item.tagComponentColumnVOList[0].tagColumnComponentId,
                        type: item.tagComponentStyle,
                        name: item.tagComponentName,
                        val: []
                    });
                    await this.getEnumTreeData(item, i);
                    break;
                case TAG_MULTIPLE_N:
                    item = Object.assign(item, {
                        id: item.tagComponentColumnVOList[0].tagColumnComponentId,
                        type: item.tagComponentStyle,
                        name: item.tagComponentName,
                        val: ''
                    });
                    await this.getEnumTreeData(item, i);
                    break;
                case TAG_YEAR:
                case TAG_TIME:
                case TAG_NUM:
                case TAG_DATE:
                    if (this.tagShow.data && this.tagShow.data.length > 0) {
                        const index = this.tagShow.data.findIndex((d: any) => d.colId == item.tagComponentColumnVOList[0].tagColumnComponentId);
                        if (index > -1) {
                            dataDbArr = this.tagShow.data[index].val;
                        }
                    }
                    item = Object.assign(item, {
                        id: item.tagComponentColumnVOList[0].tagColumnComponentId,
                        type: item.tagComponentStyle,
                        name: item.tagComponentName,
                        val: dataDbArr
                    });
                    break;
                case TAG_NEAR:
                case TAG_TEXT:
                case TAG_MONTH:
                case TAG_DAY:
                case TAG_HOUR:
                case TAG_MIN:
                case TAG_SECOND:
                    if (this.tagShow.data && this.tagShow.data.length > 0) {
                        const index = this.tagShow.data.findIndex((d: any) => d.colId == item.tagComponentColumnVOList[0].tagColumnComponentId);
                        if (index > -1) {
                            dataStr = this.tagShow.data[index].val[0];
                        }
                    }
                    item = Object.assign(item, {
                        id: item.tagComponentColumnVOList[0].tagColumnComponentId,
                        type: item.tagComponentStyle,
                        name: item.tagComponentName,
                        val: dataStr
                    });
                    break;
            }
        }
        this.enumList = arr;
        this.$nextTick(() => {
            if (this.treeChecked.length > 0) {
                const enumTree = this.$refs.enumTree as any[];
                this.treeChecked.forEach((item: any) => {
                    enumTree[item.index].setCheckedKeys(item.data);
                });
            }
            this.resizeEvent();
        });
        this.enumLoading = false;
    }
    private getEnumTreeData(item: any, i: number): Promise<void> {
        return new Promise(resolve => {
            const params: any = {
                tagEnumGroupId: item.tagComponentColumnVOList[0].tagEnumGroupId
            };
            const conId: any = {};
            item.tagComponentColumnVOList.forEach((item: any) => {
                conId[item.tagComponentColumnSort.toString()] = item.tagColumnComponentId;
            });
            this.$api.get('/api/business/tag/queryTagEnum', params).then((res: any) => {
                res.forEach((data: any) => {
                    data = Object.assign(data, {
                        index: i,
                        id: item.tagComponentColumnVOList[0].tagColumnComponentId,
                        type: item.tagComponentStyle,
                        enumCon: item.tagComponentName,
                        tagCode: item.tagCode,
                        level: item.tagComponentColumnVOList[item.tagComponentColumnVOList.length - 1].tagComponentColumnSort
                    });
                    if (item.tagComponentStyle == TAG_MULTIPLE_N) {
                        data.childrenId = conId;
                        data.leaf = false;
                    } else {
                        data.leaf = true;
                    }
                    if (data.type == TAG_MULTIPLE && this.tagShow.data && this.tagShow.data.length > 0) {
                        const index = this.tagShow.data.findIndex((d: any) => d.colId == data.id);
                        if (index > -1) {
                            const active = this.tagShow.data[index].code.indexOf(data.tagEnumVal);
                            if (active > -1) {
                                item.val.push(data);
                            }
                        }
                    }
                });
                if (item.type == TAG_MULTIPLE_N && this.tagShow.data && this.tagShow.data.length > 0) {
                    const index = this.tagShow.data.findIndex((d: any) => d.colId == item.id);
                    if (index > -1) {
                        const json = {
                            index: i,
                            data: this.tagShow.data[index].code
                        };
                        this.treeChecked.push(json);
                    }
                }
                this.$set(item, 'children', res);
                if (item.type == TAG_MULTIPLE) {
                    this.handleCheckedCitiesChange(item.val, item.children);
                }
                resolve();
            });
        });
    }
    private getEnumNode(parent: any, resolve: any) {
        const params: any = {
            tagEnumCode: parent.data.tagEnumCode
        };
        this.$api.get('/api/business/tag/querySubEnum', params).then((res: any) => {
            let conIdVal: any;
            res.forEach((data: any) => {
                conIdVal = parent.data.childrenId[data.tagEnumLevel.toString()];
                data = Object.assign(data, {
                    index: parent.data.index,
                    id: conIdVal,
                    type: parent.data.type,
                    enumCon: parent.data.enumCon,
                    tagCode: parent.data.tagCode,
                    childrenId: parent.data.childrenId,
                    level: parent.data.level
                });
                if (data.tagEnumLevel == parent.data.level) {
                    data.leaf = true;
                } else {
                    data.leaf = false;
                }
            });
            parent.data.childrenNode = res;
            resolve(res);
            this.$nextTick(() => {
                if (this.tagShow.data && this.tagShow.data.length > 0) {
                    const index = this.tagShow.data.findIndex((d: any) => d.colId == conIdVal);
                    const enumTree = this.$refs.enumTree as any[];
                    if (index > -1) {
                        let checkData = this.tagShow.data[index].code;
                        const active = this.treeChecked.findIndex((d: any) => d.index === parent.data.index);
                        if (active > -1) {
                            checkData = checkData.concat(this.treeChecked[active].data);
                        }
                        enumTree[parent.data.index].setCheckedKeys(checkData);
                    }
                }
            });
        });
    }
    private loadEnum(node: any, resolve: any) {
        if (node.data instanceof Array) {
            return resolve(node.data);
        } else if (node.data instanceof Object) {
            this.getEnumNode(node, resolve);
        }
    }
    private inpSearchEnum(item: any, index: number): void {
        clearTimeout(this.enumTimer);
        this.enumTimer = setTimeout(() => {
            this.searchEnum(item, index);
        }, 300);
    }
    private searchEnum(item: any, index: number): void {
        this.enumLoading = true;
        this.$api
            .get('/api/business/tag/fuzzyQueryTagEnum', this.enumParams)
            .then((res: any) => {
                res.forEach((data: any) => {
                    data = Object.assign(data, {
                        enumCon: item.tagComponentName,
                        id: item.id,
                        index: index,
                        leaf: true,
                        level: 0,
                        parentTagEnumCode: '0',
                        type: item.type
                    });
                });
                this.$set(item, 'children', res);
                item.val.forEach((value: any, i: number) => {
                    const active = item.children.findIndex((d: any) => d.tagEnumVal == value.tagEnumVal);
                    if (active > -1) {
                        item.val.splice(i, 1, item.children[active]);
                    }
                });
            })
            .finally(() => {
                this.enumLoading = false;
            });
    }
    private async treeCheck(item: any, isTrue: boolean): Promise<void> {
        const treeEl = this.$refs.enumTree as any[];
        if (isTrue) {
            if (this.saveTrueEnum.indexOf(item.parentTagEnumCode) != -1) {
                return;
            }
            if (this.saveTrueEnum.indexOf(item.tagEnumCode) == -1) {
                this.saveTrueEnum.push(item.tagEnumCode);
            }
            const data: any = {
                colId: item.id.toString(),
                comparison: this.symbolTip['IN'],
                colVals: [item.tagEnumVal.toString()]
            };
            const showData: any = {
                colId: item.id.toString(),
                enumConName: item.enumCon,
                type: item.type,
                code: [item.tagEnumVal.toString()],
                val: [item.tagEnumFullName]
            };
            const showObjIndex = this.tagShow.data.findIndex((d: any) => d.colId == item.id);
            const objIndex = this.tagData.where.colsOr.findIndex((d: any) => d.colId == item.id);
            if (item.type == TAG_MULTIPLE_N) {
                if (objIndex > -1) {
                    if (this.tagData.where.colsOr[objIndex].colVals.indexOf(item.tagEnumVal) == -1) {
                        this.tagData.where.colsOr[objIndex].colVals.push(item.tagEnumVal.toString());
                    }
                } else {
                    this.tagData.where.colsOr.push(data);
                }
                if (item.childrenNode && item.childrenNode.length > 0) {
                    await this.delChildrenCode(item, showObjIndex);
                }
                if (showObjIndex > -1) {
                    if (this.tagShow.data[showObjIndex].val.indexOf(item.tagEnumFullName) == -1) {
                        this.tagShow.data[showObjIndex].val.push(item.tagEnumFullName);
                    }
                    if (this.tagShow.data[showObjIndex].code.indexOf(item.tagEnumVal) == -1) {
                        this.tagShow.data[showObjIndex].code.push(item.tagEnumVal);
                    }
                } else {
                    this.tagShow.data.push(showData);
                }
            }
        } else {
            const objIndex = this.tagData.where.colsOr.findIndex((d: any) => d.colId == item.id);
            const showObjIndex = this.tagShow.data.findIndex((d: any) => d.colId == item.id);
            if (objIndex > -1) {
                const indexNum = this.tagData.where.colsOr[objIndex].colVals.indexOf(item.tagEnumVal.toString());
                if (indexNum != -1) {
                    this.tagData.where.colsOr[objIndex].colVals.splice(indexNum, 1);
                }
                if (this.tagData.where.colsOr[objIndex].colVals.length == 0) {
                    this.tagData.where.colsOr.splice(objIndex, 1);
                }
            }
            if (showObjIndex > -1) {
                const codeNum = this.tagShow.data[showObjIndex].code.indexOf(item.tagEnumVal.toString());
                const indexNum = this.tagShow.data[showObjIndex].val.indexOf(item.tagEnumFullName);
                if (indexNum != -1) {
                    this.tagShow.data[showObjIndex].val.splice(indexNum, 1);
                }
                if (codeNum != -1) {
                    this.tagShow.data[showObjIndex].code.splice(codeNum, 1);
                }
                if (this.tagShow.data[showObjIndex].val.length == 0) {
                    this.tagShow.data.splice(showObjIndex, 1);
                }
            }
            if (this.saveTrueEnum.indexOf(item.tagEnumCode) != -1) {
                this.saveTrueEnum.splice(this.saveTrueEnum.indexOf(item.tagEnumCode), 1);
            }
            if (item.childrenNode && item.childrenNode.length > 0) {
                const checkNodes = treeEl[item.index].getCheckedNodes();
                checkNodes.forEach((val: any) => {
                    const index = item.childrenNode.findIndex((d: any) => d.tagEnumVal == val.tagEnumVal);
                    if (index != -1) {
                        this.treeCheck(val, true);
                    }
                });
            }
        }
    }
    private delChildrenCode(item: any, showObjIndex: number) {
        return new Promise(resolve => {
            const childrenItem = this.tagData.where.colsOr.findIndex((d: any) => d.colId == item.childrenNode[0].id);
            if (childrenItem != -1) {
                item.childrenNode.forEach((val: any) => {
                    const codeIndex = this.tagData.where.colsOr[childrenItem].colVals.indexOf(val.tagEnumVal);
                    if (codeIndex != -1) {
                        this.tagData.where.colsOr[childrenItem].colVals.splice(codeIndex, 1);
                    }
                    if (showObjIndex > -1) {
                        const codeIndex = this.tagShow.data[showObjIndex].code.indexOf(val.tagEnumVal);
                        const nameIndex = this.tagShow.data[showObjIndex].val.indexOf(val.tagEnumFullName);
                        if (codeIndex != -1) {
                            this.tagShow.data[showObjIndex].code.splice(codeIndex, 1);
                        }
                        if (nameIndex != -1) {
                            this.tagShow.data[showObjIndex].val.splice(nameIndex, 1);
                        }
                    }
                    if (val.childrenNode && val.childrenNode.length > 0) {
                        this.delChildrenCode(val, showObjIndex);
                    }
                });
                if (this.tagData.where.colsOr[childrenItem].colVals.length == 0) {
                    this.tagData.where.colsOr.splice(childrenItem, 1);
                }
            }
            resolve();
        });
    }
    private async saveEnum() {
        for (let i = 0; i < this.enumList.length; i++) {
            const item: any = this.enumList[i];
            switch (item.type) {
                case TAG_MULTIPLE:
                    if (item.val.length > 0) {
                        this.addCheckVal(item.val, item.id, item.name, item.type);
                    } else {
                        this.$message.error('请选择枚举');
                        return;
                    }
                    break;
                case TAG_DATE:
                    if (item.val[0] && item.val[1]) {
                        await this.addDbEnum(item.val[0], item.val[1], item.id, item.name, item.type);
                    } else {
                        this.$message.error('请将日期填写完整');
                        return;
                    }
                    break;
                case TAG_YEAR:
                case TAG_TIME:
                case TAG_NUM:
                    if (item.val[0] && item.val[1]) {
                        if ((item.type == TAG_YEAR || item.type == TAG_NUM) && Number(item.val[0]) > Number(item.val[1])) {
                            this.$message.error('请按正确顺序填写信息');
                            return;
                        }
                        await this.addDbEnum(item.val[0], item.val[1], item.id, item.name, item.type);
                    } else {
                        if (item.type == TAG_YEAR) {
                            this.$message.error('请将年份填写完整');
                        } else if (item.type == TAG_TIME) {
                            this.$message.error('请将时间填写完整');
                        } else if (item.type == TAG_NUM) {
                            this.$message.error('请将数值填写完整');
                        }
                        return;
                    }
                    break;
                case TAG_NEAR:
                    if (!item.val) {
                        this.$message.error('请将天数填写完整');
                        return;
                    }
                    this.addNear(item.val, item.id, item.name, item.type);
                    break;
                case TAG_TEXT:
                case TAG_MONTH:
                case TAG_DAY:
                case TAG_HOUR:
                case TAG_MIN:
                case TAG_SECOND:
                    if (!item.val) {
                        this.$message.error('请将信息填写完整');
                        return;
                    }
                    this.addEqual(item.val, item.id, item.name, item.type);
                    break;
            }
        }
        const tagData = JSON.parse(JSON.stringify(this.tagData));
        const tagShow = JSON.parse(JSON.stringify(this.tagShow));
        this.$emit('close', tagData, tagShow);
    }
    private cancel(): void {
        this.$emit('close', this.tagDataBase, this.tagShowBase);
    }
    public initEnumState(): void {
        this.enumList = [];
        this.treeChecked = [];
        this.enumParams.tagCode = '';
        this.enumParams.keyWord = '';
    }
    private async addDbEnum(startVal: any, endVal: any, id: any, name: string, type: any): Promise<void> {
        const showIndex = this.tagShow.data.findIndex((d: any) => d.colId == id);
        const dataIndex = this.tagData.where.colsAnd.findIndex((d: any) => d.colId == id);
        const startData = {
            colId: id.toString(),
            comparison: this.symbolTip['>='],
            colVals: [startVal.toString()]
        };
        const endData = {
            colId: id.toString(),
            comparison: this.symbolTip['<='],
            colVals: [endVal.toString()]
        };
        const showData = {
            colId: id.toString(),
            enumConName: name,
            val: [startVal.toString(), endVal.toString()],
            type: type
        };
        if (showIndex > -1) {
            this.tagShow.data.splice(showIndex, 1, showData);
        } else {
            this.tagShow.data.push(showData);
        }
        if (dataIndex > -1) {
            await this.removeEnum(this.tagData.where.colsAnd, 'colId', id);
        }
        this.tagData.where.colsAnd.push(startData, endData);
    }
    private handleCheckAllChange(item: any) {
        if (this.checkAll) {
            this.$set(item, 'val', item.children);
        } else {
            this.$set(item, 'val', []);
        }
        this.isIndeterminate = false;
    }
    private handleCheckedCitiesChange(val: any[], data: any[]) {
        this.checkAll = val.length === data.length;
        this.isIndeterminate = val.length > 0 && val.length < data.length;
    }
    private addCheckVal(val: any[], id: string | number, name: string, type: any): void {
        const nameData = Array.from(val, ({ tagEnumName }) => tagEnumName);
        const valData = Array.from(val, ({ tagEnumVal }) => tagEnumVal);
        const data: any = {
            colId: id.toString(),
            comparison: this.symbolTip['IN'],
            colVals: valData
        };
        const showData: any = {
            colId: id.toString(),
            enumConName: name,
            type: type,
            code: valData,
            val: nameData
        };
        this.comAddEnum(data, showData, id);
    }
    private addNear(val: any, id: string | number, name: string, type: any): void {
        const data = {
            colId: id.toString(),
            comparison: this.symbolTip['<='],
            colVals: [val]
        };
        const showData = {
            colId: id.toString(),
            enumConName: name,
            val: [val],
            type: type
        };
        this.comAddEnum(data, showData, id);
    }
    private addEqual(val: any, id: string | number, name: string, type: any): void {
        const data = {
            colId: id.toString(),
            comparison: this.symbolTip['='],
            colVals: [val.toString()]
        };
        const showData = {
            colId: id.toString(),
            enumConName: name,
            val: [val.toString()],
            type: type
        };
        this.comAddEnum(data, showData, id);
    }
    private comAddEnum(data: any, showData: any, id: string | number): void {
        const showIndex = this.tagShow.data.findIndex((d: any) => d.colId == id);
        const dataIndex = this.tagData.where.colsAnd.findIndex((d: any) => d.colId == id);
        if (showIndex > -1) {
            this.tagShow.data.splice(showIndex, 1, showData);
        } else {
            this.tagShow.data.push(showData);
        }
        if (dataIndex > -1) {
            this.tagData.where.colsAnd.splice(dataIndex, 1, data);
        } else {
            this.tagData.where.colsAnd.push(data);
        }
    }
    private removeEnum(arr: any[], key: string, value: string | number) {
        return new Promise(resolve => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][key] == value) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            resolve();
        });
    }
    private enumSort(a: any, b: any): any {
        return a.tagComponentColumnSort - b.tagComponentColumnSort;
    }
}
</script>

<style scoped lang="scss">
.enum-select {
    flex: 1;
}
.enum-warp {
    overflow-y: auto;
    margin-bottom: 10px;
}
.enum-width {
    width: 200px;
}
.num-width /deep/ {
    width: 80px;
    .el-input__inner {
        padding-right: 20px;
    }
    .el-input__suffix {
        margin-right: -6px;
    }
}
.select-width {
    width: 90px;
}
.year-width {
    width: 120px;
}
.enum-long-width {
    width: 280px;
}
.enum-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #333;
}
::v-deep .enum-item {
    padding-right: 10px;
    margin-bottom: 15px;
    font-size: 12px;
    overflow-y: auto;
    .search-enum {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    .enum-name {
        height: 50px;
        background: #fafafa;
        display: flex;
        align-items: center;
        padding: 0 16px;
        justify-content: space-between;
    }
    .con-name {
        margin-right: 36px;
        color: rgba(0, 0, 0, 0.8);
    }
    .tree-box {
        width: 100%;
    }
    .enum-box {
        display: flex;
        align-items: center;
        overflow-y: hidden;
        padding: 10px 0;
        .concat-line {
            margin: 0 12px;
            width: 10px;
            height: 1px;
            background: #606266;
        }
        .enum-label {
            margin-left: 10px;
            white-space: nowrap;
        }
        .check-item {
            margin-bottom: 10px;
            margin-right: 10px;
            width: 24%;
            display: flex;
            align-items: center;
            &:nth-of-type(4n) {
                margin-right: 0;
            }
            .el-checkbox__label {
                @include more-ellipsis;
            }
        }
        .el-checkbox-group {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
        }
    }
}
.footer-btn {
    display: flex;
    justify-content: center;
}
</style>
