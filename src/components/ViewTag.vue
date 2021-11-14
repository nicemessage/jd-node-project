<template>
    <section class="dialog-bg" @click.self="closeDialog">
        <div class="dialog-wapper width">
            <div class="dialog-header opacity">
                <strong class="head-tit left isIndex">标签筛选<em></em></strong>
                <div>
                    <el-input
                        v-model="tagParams.keyWord"
                        placeholder="请输入标签名称/标签编码"
                        class="search-ipt com-input"
                        clearable
                        @keyup.enter.native="pageChange(1)"
                        @clear="pageChange(1)"
                    >
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="pageChange(1)"></i>
                    </el-input>
                </div>
            </div>
            <div class="tag-section opacity clearfix">
                <div class="tag-left">
                    <div class="class-list">
                        <class-filter
                            ref="classModule"
                            @setBusiness="setBusiness"
                            @selectedClass="selectedClass"
                            :businessData="businessData"
                            :classData="classData"
                            :classSelect="tagInfo.classId"
                            :businessDef="businessDef"
                            :isDisabled="tagInfo.tagCode ? true : false"
                        ></class-filter>
                    </div>
                    <ul class="tag-list self-scroll" v-if="tagList.length > 0" @scroll="tagScroll($event)">
                        <li
                            v-for="(item, index) in tagList"
                            :key="index"
                            @click="tagClickHandler(index, item)"
                            class="tag-li"
                            :class="{
                                active_tag: item.isCk,
                                disabled: tagInfo.tagCode
                            }"
                        >
                            {{ item.tagName }}
                        </li>
                    </ul>
                    <ul class="tag-list" v-if="tagList.length == 0 && !loadingSate">
                        <li class="tag-li empty">
                            暂无数据
                        </li>
                    </ul>
                    <div
                        class="case-list self-scroll"
                        v-loading="caseLoading"
                        element-loading-text="加载中..."
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255)"
                    >
                        <template v-if="enumList.length > 0">
                            <div
                                v-for="(item, index) in enumList"
                                :key="index"
                                class="case-li self-scroll"
                                :class="{ moreHeight: enumList.length > 1 }"
                            >
                                <div class="tree-box">
                                    <div class="tree-all">
                                        <el-checkbox v-model="isAll[index]" @change="setAll(index, item.children)">全选</el-checkbox>
                                    </div>
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
                            </div>
                        </template>
                        <div v-if="enumList.length == 0" class="case-empty">
                            暂无数据
                        </div>
                    </div>
                </div>
                <div class="footer-section" :class="{ end: tagTemList.length == 0 }">
                    <div class="selected-enum" v-if="tagTemList.length > 0">
                        <span class="label">已选条件：</span>
                        <div class="selected-tag">{{ tagTemList.length }}个</div>
                        <el-button class="remove-btn" @click="deleteSelected">删除</el-button>
                    </div>
                    <div class="btn-box">
<!--                        <el-button @click="closeDialog" class="cancel">取消</el-button>-->
                        <el-button type="primary" @click="save" class="save-btn">保存筛选</el-button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ClassFilter from '@/components/ClassFilter.vue';
@Component({
    components: {
        ClassFilter
    },
    computed: mapGetters(['loadingSate'])
})
export default class ViewTag extends Vue {
    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    private tagInfo!: any;
    private tagList: any[] = []; //标签列表
    private tagTotal: number = 0;
    private enumList: any[] = []; //枚举列表
    private saveTrueEnum: any[] = [];
    private tagData: any = {
        tagCode: '',
        where: {
            colsAnd: [],
            colsOr: []
        },
        type: 'VAL'
    }; //保存标签列表
    private tagShow: any = {
        tagName: '',
        data: []
    }; //当前标签展示用
    private tagParams: any = {
        busiId: '',
        keyWord: '',
        pageNum: 1,
        pageSize: 20,
        queryType: 2,
        sortField: '',
        sortType: '',
        tagCateCode: '',
        tagCateCodes: []
    };
    private businessData: any[] = [];
    private classData: any[] = [];
    private caseLoading: boolean = false; //枚举加载load
    private isAll: any[] = [];
    private enumPropsMore: any = {
        children: 'children',
        label: 'tagEnumName',
        isLeaf: 'leaf'
    }; //树形默认数据结构
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
    private tagTemList: any[] = [];
    private tagScroll: any = undefined;
    private tagScrollTmer: any = undefined;
    private isScroll: boolean = true;
    private selectedTag: any = {};
    private businessDef: any = {};
    private async mounted(): Promise<void> {
        this.$store.commit('changeLoadingStatus', true);
        if (this.tagInfo.classId.length > 0) {
            this.$set(this.tagParams, 'tagCateCode', this.tagInfo.classId[this.tagInfo.classId.length - 1]);
        }
        if (this.tagInfo.busId) {
            this.$set(this.tagParams, 'busiId', this.tagInfo.busId);
        }
        if (this.$store.state.userInfo.roleTypeList.indexOf(3) == -1) {
            if (this.$store.state.userInfo.roleTypeList.indexOf(4) != -1) {
                await this.getBusiness(4);
                this.$store.commit('changeLoadingStatus', false);
            }
        } else {
            const arr: any[] = [];
            this.$store.state.userInfo.roleTypeList.forEach((val: any) => {
                arr.push(this.getBusiness(val));
            });
            await Promise.all(arr.concat([this.getClass(this.tagParams.busiId), this.getTags()])).finally(() => {
                this.$store.commit('changeLoadingStatus', false);
            });
        }
        this.tagScroll = (e: any) => {
            clearTimeout(this.tagScrollTmer);
            this.tagScrollTmer = setTimeout(async () => {
                const wapHeight = e.target.offsetHeight;
                const wapScroll = e.target.scrollTop;
                const childHeight = e.target.scrollHeight;
                if (childHeight > wapHeight && wapHeight + wapScroll + 20 >= childHeight && this.isScroll && this.tagList.length < this.tagTotal) {
                    this.tagParams.pageNum++;
                    this.isScroll = false;
                    this.$store.commit('changeLoadingStatus', true);
                    await Promise.all([this.getTags()]).finally(() => {
                        this.$store.commit('changeLoadingStatus', false);
                    });
                }
            }, 50);
        };
    }
    private getBusiness(id?: any) {
        return new Promise((resolve, reject) => {
            const params: any = {
                familyId: id
            };
            this.$api
                .get('/api/business/businessLine/busiLineList', params)
                .then((res: any) => {
                    this.businessData = res;
                    if (this.businessData.length > 0 && this.$store.state.userInfo.role === 'card') {
                        this.businessDef = this.businessData[0];
                    }
                    this.businessData.sort((a: any, b: any) => {
                        return a.id - b.id;
                    });
                    resolve();
                })
                .catch(() => {
                    this.$message.error('获取业务线失败');
                    reject();
                });
        });
    }
    private getClass(id?: number | string) {
        return new Promise((resolve, reject) => {
            const params: any = {
                busiId: id || ''
            };
            this.$api
                .get('/api/business/tagCategory/queryTagCateListByBusiLine', params)
                .then((res: any) => {
                    const classData: any[] = [];
                    if (res.length > 0) {
                        res.sort(this.classSort);
                    }
                    res.forEach((item: any) => {
                        item.isActive = false;
                        if (item.tagCateLevel > 0) {
                            const index: number = res.findIndex((d: any) => d.tagCateCode == item.parentTagCateCode);
                            if (index > -1) {
                                if (res[index].children) {
                                    res[index].children.push(item);
                                } else {
                                    res[index].children = [item];
                                }
                            }
                        } else {
                            classData.push(item);
                        }
                    });
                    classData.sort(this.classSort1);
                    this.classData = classData;
                    resolve();
                })
                .catch(() => {
                    this.$message.error('获取分类失败');
                    reject();
                });
        });
    }
    private getTags() {
        return new Promise((resolve, reject) => {
            this.$api
                .post('/api/business/tag/queryTagByCondition', this.tagParams)
                .then((res: any) => {
                    this.tagTotal = res.total;
                    res.list.forEach((item: any) => {
                        item.isCk = false;
                    });
                    this.tagList = this.tagList.concat(res.list);
                    if (res.list.length > 0) {
                        this.isScroll = true;
                    }
                    if (!this.selectedTag.tagCode) {
                        if (this.tagInfo.tagCode) {
                            const index = this.tagList.findIndex((d: any) => d.tagCode == this.tagInfo.tagCode);
                            if (index > -1 && this.tagList[index]) {
                                this.tagClick(index, this.tagList[index]);
                            }
                        } else {
                            if (this.tagList[0]) {
                                this.tagClick(0, this.tagList[0]);
                            }
                        }
                    }
                    resolve();
                })
                .catch(() => {
                    this.$message.error('获取标签失败');
                    reject();
                });
        });
    }
    private async setBusiness(data: any): Promise<void> {
        this.$store.commit('changeLoadingStatus', true);
        if (data.busiName === '信用卡') {
            this.$set(this.tagParams, 'familyId', '4');
        } else {
            this.$set(this.tagParams, 'familyId', '3');
        }
        this.$set(this.tagParams, 'busiId', data.id);
        this.$set(this.tagParams, 'tagCateCode', '');
        this.$set(this.tagParams, 'pageNum', 1);
        this.isScroll = true;
        this.tagList = [];
        this.enumList = [];
        this.selectedTag = {};
        await Promise.all([this.getClass(data.id), this.getTags()]).finally(() => {
            this.$store.commit('changeLoadingStatus', false);
        });
    }
    private async selectedClass(data: any): Promise<void> {
        if (data.thirdId) {
            this.$set(this.tagParams, 'tagCateCode', data.thirdId);
        } else if (data.secondId) {
            this.$set(this.tagParams, 'tagCateCode', data.secondId);
        } else if (data.firstId) {
            this.$set(this.tagParams, 'tagCateCode', data.firstId);
        } else {
            this.$set(this.tagParams, 'tagCateCode', '');
        }
        this.pageChange(1);
    }
    private async pageChange(num: number): Promise<void> {
        this.$store.commit('changeLoadingStatus', true);
        this.$set(this.tagParams, 'pageNum', num);
        this.isScroll = true;
        this.tagList = [];
        this.enumList = [];
        this.selectedTag = {};
        await Promise.all([this.getTags()]).finally(() => {
            this.$store.commit('changeLoadingStatus', false);
        });
    }
    private tagClickHandler(index: number, item: any) {
        if (this.tagInfo.tagCode) {
            return;
        }
        this.tagClick(index, item);
    }
    // 选中标签
    private async tagClick(index: number, item: any): Promise<void> {
        if (!item.tagCode || item.isCk) {
            return;
        }
        this.caseLoading = true;
        const active: number = this.tagList.findIndex(d => d.isCk === true);
        if (active > -1) {
            this.$set(this.tagList[active], 'isCk', false);
        }
        this.$set(this.tagList[index], 'isCk', true);
        this.selectedTag = item;
        if (this.tagShow.data.length > 0) {
            const index = this.tagTemList.findIndex((d: any) => d.tagData.tagCode == this.tagData.tagCode);
            if (index === -1) {
                const tagShow = JSON.parse(JSON.stringify(this.tagShow));
                const tagData = JSON.parse(JSON.stringify(this.tagData));
                const json = {
                    tagShow: tagShow,
                    tagData: tagData
                };
                this.tagTemList.push(json);
            }
            this.tagData.where = {
                colsAnd: [],
                colsOr: []
            };
            this.tagShow.data = [];
        }
        this.getEnumCon(item.tagCode, item.tagName);
    }
    // 请求枚举组件
    private getEnumCon(code: any, name: any) {
        if (this.tagShow.data.length == 0) {
            this.$set(this.tagData, 'tagCode', code);
            this.$set(this.tagShow, 'tagName', name);
        }
        this.isAll = [];
        const params: any = {
            tagCode: code
        };
        this.$api
            .get('/api/business/tag/queryTagComponent', params)
            .then(res => {
                const data = res as any;
                if (data.length > 0) {
                    this.getEnum(data);
                } else {
                    this.enumList = [];
                    this.caseLoading = false;
                }
            })
            .catch(() => {
                this.$message.error('获取枚举组件失败');
            });
    }
    // 请求枚举
    private async getEnum(arr: any[]): Promise<void> {
        const checkList: any[] = [];
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
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
            await this.getEnumTreeData(item, i, checkList);
            this.isAll.push(false);
        }
        this.enumList = arr;
        this.$nextTick(() => {
            if (checkList.length > 0) {
                checkList.forEach(item => {
                    const enumTreeEl = (this.$refs.enumTree as any[])[item.index];
                    enumTreeEl.setCheckedKeys(item.arr);
                });
            } else {
                this.$refs.enumTree as any[];
                for (let i = 0; i < (this.$refs.enumTree as any[]).length; i++) {
                    const checked = (this.$refs.enumTree as any[])[i].getCheckedKeys();
                    if (checked.length > 0) {
                        checked.forEach((item: any) => {
                            (this.$refs.enumTree as any[])[i].setChecked(item, false);
                        });
                    }
                }
            }
            setTimeout(() => {
                this.caseLoading = false;
            }, 100);
        });
    }
    // 请求枚举树状数据
    private getEnumTreeData(item: any, i: number, checkList: any[]) {
        return new Promise((resolve: any, reject) => {
            const params: any = {
                tagEnumGroupId: item.tagComponentColumnVOList[0].tagEnumGroupId
            };
            const conId: any = {};
            item.tagComponentColumnVOList.forEach((data: any) => {
                conId[data.tagComponentColumnSort.toString()] = data.tagColumnComponentId;
            });
            this.$api
                .get('/api/business/tag/queryTagEnum', params)
                .then(res => {
                    const val = res as any;
                    val.forEach((data: any) => {
                        data.index = i;
                        data.id = item.tagComponentColumnVOList[0].tagColumnComponentId;
                        data.type = item.tagComponentStyle;
                        data.enumCon = item.tagComponentName;
                        data.tagCode = item.tagCode;
                        data.level = item.tagComponentColumnVOList[item.tagComponentColumnVOList.length - 1].tagComponentColumnSort;
                        data.leaf = true;
                    });
                    this.$set(item, 'children', val);
                    this.$nextTick(() => {
                        const json: any = {};
                        if (this.tagTemList.length > 0) {
                            const index = this.tagTemList.findIndex((d: any) => d.tagData.tagCode == item.tagCode);
                            if (index > -1) {
                                const objAndIndex = this.tagTemList[index].tagData.where.colsAnd.findIndex(
                                    (d: any) => d.colId == item.tagComponentColumnVOList[0].tagColumnComponentId
                                );
                                const objOrIndex = this.tagTemList[index].tagData.where.colsOr.findIndex(
                                    (d: any) => d.colId == item.tagComponentColumnVOList[0].tagColumnComponentId
                                );
                                if (objAndIndex > -1) {
                                    json.arr = this.tagTemList[index].tagData.where.colsAnd[objAndIndex].colVals;
                                    json.index = i;
                                    checkList.push(json);
                                }
                                if (objOrIndex > -1) {
                                    json.arr = this.tagTemList[index].tagData.where.colsOr[objOrIndex].colVals;
                                    json.index = i;
                                    checkList.push(json);
                                }
                            }
                        } else if (this.tagInfo.enumId.length > 0) {
                            json.arr = this.tagInfo.enumId;
                            json.index = i;
                            checkList.push(json);
                        }
                    });
                    resolve();
                })
                .catch(() => {
                    this.$message.error('获取数据失败');
                    reject();
                });
        });
    }
    // 加载子枚举
    private loadEnum(node: any, resolve: any) {
        if (node.data instanceof Array) {
            return resolve(node.data);
        } else if (node.data instanceof Object) {
            this.getEnumNode(node, resolve);
        }
    }
    // 请求子枚举
    private getEnumNode(parent: any, resolve: any) {
        const params: any = {
            tagEnumCode: parent.data.tagEnumCode
        };
        this.$api
            .get('/api/business/tag/querySubEnum', params)
            .then(res => {
                let conIdVal: any;
                const val = res as any;
                val.forEach((data: any) => {
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
                parent.data.childrenNode = val;
                resolve(val);
            })
            .catch(() => {
                this.$message.error('获取数据失败');
            });
    }
    // 枚举选择
    private async treeCheck(item: any, isTrue: boolean): Promise<void> {
        if (isTrue) {
            if (item.tagCode != this.tagData.tagCode) {
                (this.$refs.enumTree as any[])[item.index].setChecked(item.tagEnumVal, false);
                this.$message('每次只能选择一个标签，请删除已选');
                return;
            }
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
                val: [item.tagEnumName]
            };
            const showObjIndex = this.tagShow.data.findIndex((d: any) => d.colId == item.id);
            const objIndex = this.tagData.where.colsAnd.findIndex((d: any) => d.colId == item.id);
            if (objIndex > -1) {
                if (this.tagData.where.colsAnd[objIndex].colVals.indexOf(item.tagEnumVal) == -1) {
                    this.tagData.where.colsAnd[objIndex].colVals.push(item.tagEnumVal.toString());
                }
            } else {
                this.tagData.where.colsAnd.push(data);
            }
            if (showObjIndex > -1) {
                if (this.tagShow.data[showObjIndex].val.indexOf(item.tagEnumName) == -1) {
                    this.tagShow.data[showObjIndex].val.push(item.tagEnumName);
                }
                if (this.tagShow.data[showObjIndex].code.indexOf(item.tagEnumVal) == -1) {
                    this.tagShow.data[showObjIndex].code.push(item.tagEnumVal);
                }
            } else {
                this.tagShow.data.push(showData);
            }
            if ((this.$refs.enumTree as any[])[item.index].data.length == (this.$refs.enumTree as any[])[item.index].getCheckedKeys().length) {
                this.$nextTick(() => {
                    this.$set(this.isAll, item.index, true);
                });
            }
        } else {
            if (item.tagCode != this.tagData.tagCode) {
                return;
            }
            const objIndex = this.tagData.where.colsAnd.findIndex((d: any) => d.colId == item.id);
            if (objIndex > -1) {
                const indexNum = this.tagData.where.colsAnd[objIndex].colVals.indexOf(item.tagEnumVal.toString());
                if (indexNum != -1) {
                    this.tagData.where.colsAnd[objIndex].colVals.splice(indexNum, 1);
                }
                if (this.tagData.where.colsAnd[objIndex].colVals.length == 0) {
                    this.tagData.where.colsAnd.splice(objIndex, 1);
                }
            }
            const showObjIndex = this.tagShow.data.findIndex((d: any) => d.colId == item.id);
            if (showObjIndex > -1) {
                const codeNum: number = this.tagShow.data[showObjIndex].code.indexOf(item.tagEnumVal.toString());
                const indexNum: number = this.tagShow.data[showObjIndex].val.indexOf(item.tagEnumName);
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
            this.$set(this.isAll, item.index, false);
            if (item.childrenNode && item.childrenNode.length > 0) {
                const checkNodes = (this.$refs.enumTree as any[])[item.index].getCheckedNodes();
                checkNodes.forEach((val: any) => {
                    const index = item.childrenNode.findIndex((d: any) => d.tagEnumVal == val.tagEnumVal);
                    if (index != -1) {
                        this.treeCheck(val, true);
                    }
                });
            }
        }
    }
    // 保存标签
    private save() {
        if (this.tagShow.data.length > 0) {
            const index = this.tagTemList.findIndex((d: any) => d.tagData.tagCode == this.tagData.tagCode);
            if (index === -1) {
                const json = {
                    tagShow: this.tagShow,
                    tagData: this.tagData
                };
                this.tagTemList.push(json);
            }
        }
        console.log(this.tagTemList);
        this.$emit('saveTem', this.tagTemList);
        this.closeDialog();
    }
    // 删除已选
    private deleteSelected() {
        for (let i = 0; i < (this.$refs.enumTree as any[]).length; i++) {
            const checked = (this.$refs.enumTree as any[])[i].getCheckedKeys();
            if (checked.length > 0) {
                checked.forEach((item: any) => {
                    (this.$refs.enumTree as any[])[i].setChecked(item, false);
                });
            }
        }
        this.tagTemList = [];
        this.tagData.where = {
            colsAnd: [],
            colsOr: []
        };
        this.tagShow.data = [];
    }
    private setAll(index: number, arr: any[]) {
        if (this.isAll[index]) {
            arr.forEach(item => {
                (this.$refs.enumTree as any[])[index].setChecked(item.tagEnumVal, true);
            });
        } else {
            arr.forEach(item => {
                (this.$refs.enumTree as any[])[index].setChecked(item.tagEnumVal, false);
            });
        }
    }
    //关弹窗
    private closeDialog() {
        this.$emit('close');
    }
    private enumSort(a: any, b: any) {
        return a.tagComponentColumnSort - b.tagComponentColumnSort;
    }
    private classSort(a: any, b: any) {
        return b.tagCateLevel - a.tagCateLevel;
    }
    private classSort1(a: any, b: any) {
        return Number(a.tagCateCode) - Number(b.tagCateCode);
    }
}
</script>
<style scoped lang="scss">
.dialog-bg {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    min-width: 750px;
}
.dialog-wapper {
    width: 0%;
    height: 100%;
    background: #fff;
    cursor: default;
    position: absolute;
    top: 0;
    right: 0;
    &.width {
        animation: move 0.6s ease-in-out forwards;
    }
}
@keyframes move {
    100% {
        width: 80%;
    }
}
.dialog-header {
    display: flex;
    align-items: center;
    position: relative;
    height: 60px;
    border-bottom: 1px solid #f0f2f5;
    padding-left: 30px;
    opacity: 0;
    &.opacity {
        animation: opacity 0.6s ease-in-out forwards;
    }
    .head-tit {
        font-size: 14px;
        color: #333;
        margin-right: 37px;
        display: flex;
        align-items: center;
        height: 100%;
        position: relative;
        cursor: pointer;
        &.isIndex {
            em {
                position: absolute;
                bottom: 10px;
                left: 50%;
                margin-left: -12px;
                width: 24px;
                height: 2px;
                background: $color;
            }
        }
    }
    .left {
        margin-right: 20px;
    }
    .search-ipt {
        font-size: 12px;
        .el-input__prefix {
            cursor: pointer;
        }
    }
}
::v-deep .tag-section {
    height: calc(100% - 52px);
    padding: 20px 20px 25px 35px;
    opacity: 0;
    &.opacity {
        animation: opacity 0.3s ease-in-out 0.3s forwards;
    }
    .tag-left {
        display: flex;
        height: calc(100% - 60px);
        width: 100%;
        border: 1px solid #f0f2f5;
    }
    .class-list {
        width: 24%;
        min-width: 185px;
        border-right: 1px solid #f0f2f5;
        .class-btn {
            width: 100%;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #f0f2f5;
            cursor: pointer;
            text-align: center;
            font-size: 14px;
            color: #333;
            padding: 0 20px;
            position: relative;
            &.activeColor {
                background: #f6f8fc;
            }
            &:hover {
                background: #f6f8fc;
            }
            .iconfont {
                position: absolute;
                right: 10px;
                transition: 0.3s ease-in-out;
                &.rotate {
                    transform: rotateZ(-90deg);
                }
            }
        }
    }
    .tag-list {
        width: 35%;
        height: 100%;
        overflow-y: auto;
        position: relative;
        border-right: 1px solid #f0f2f5;
        padding: 10px 0;
        .tag-li {
            width: 100%;
            height: 36px;
            line-height: 36px;
            text-align: center;
            position: relative;
            font-size: 12px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 10px;
            cursor: pointer;
            &.disabled {
                color: #909399;
            }
            &.empty {
                &:hover {
                    background-color: transparent;
                }
            }
            &:hover {
                background-color: #f0f7ff;
            }
            &.active_tag {
                color: #fff;
                background-color: $color;
            }
        }
    }
    .case-list {
        flex: 1;
        overflow-y: auto;
        position: relative;
        padding: 10px;
        .coll-all {
            margin-left: 24px;
            margin-bottom: 6px;
        }
        .case-empty {
            text-align: center;
            font-size: 12px;
            color: #333;
        }
    }
    .case-li {
        white-space: nowrap;
        margin-bottom: 15px;
        font-size: 12px;
        display: flex;
        overflow-y: auto;
        align-items: center;
        .tag-name {
            margin-right: 10px;
            display: inline-block;
            text-align: right;
            color: #333;
            &.top4 {
                align-self: flex-start;
                margin-top: 4px;
            }
        }
        .tree-box {
            width: 100%;
        }
        .tree-all {
            padding-left: 24px;
            margin-bottom: 2px;
        }
        .el-input__inner {
            height: 24px;
            line-height: 24px;
        }
        .el-input__icon {
            line-height: 13px;
        }
    }
    .case-li.moreHeight {
        max-height: 80%;
    }
}
.footer-section {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    &.end {
        justify-content: flex-end;
    }
}
.selected-enum {
    display: flex;
    align-items: center;
    .label {
        font-size: 12px;
        color: #333;
        white-space: nowrap;
    }
    .selected-tag {
        margin: 0 10px;
        font-size: 12px;
        color: #333;
        max-height: 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        strong {
            font-weight: 500;
        }
    }
}
.btn-box {
    display: flex;
    justify-content: flex-end;
    margin-left: 20px;
}
@keyframes opacity {
    100% {
        opacity: 1;
    }
}
</style>
