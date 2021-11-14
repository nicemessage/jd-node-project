<template>
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialog" custom-class="com-dialog" width="1000px" top="0">
        <div style="padding: 30px;">
            <el-form :model="params" :rules="rules" label-width="110px" class="com-form edit-subject" ref="form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="枚举名称" prop="tagEnumName">
                            <el-input
                                class="com-input"
                                placeholder="可输入2~15个字符"
                                v-model.trim="params.tagEnumName"
                                maxlength="50"
                                clearable
                                @change="nameChange"
                                :disabled="isDetail"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="枚举类型" prop="tagEnumType">
                            <div class="flex" style="display:flex;">
                                <el-select v-model="params.tagEnumType" :disabled="isDetail" @change="changeType" class="com-select" style="flex:1">
                                    <el-option label="单级枚举" :value="1"> </el-option>
                                    <el-option label="N级枚举" :value="2"> </el-option>
                                </el-select>
                                <el-select
                                    v-show="params.tagEnumType == 2"
                                    :disabled="isDetail"
                                    v-model="tagEnumLevel"
                                    @change="changeLevel"
                                    class="com-select"
                                    style="flex:1;"
                                >
                                    <!-- <el-option label="一级" :value="0"></el-option> -->
                                    <el-option label="二级" :value="1"></el-option>
                                    <el-option label="三级" :value="2"></el-option>
                                    <el-option label="四级" :value="3"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="params.tagEnumType == 2">
                    <el-col :span="12">
                        <el-form-item label="一级名称" :required="true">
                            <el-input
                                class="com-input"
                                placeholder="可输入2~15个字符"
                                v-model.trim="params.tagEnumLevelName[0]"
                                maxlength="50"
                                clearable
                                :disabled="isDetail || tagEnumLevel == 0"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="tagEnumLevel >= 1">
                        <el-form-item label="二级名称" :required="true">
                            <el-input
                                class="com-input"
                                placeholder="可输入2~15个字符"
                                v-model.trim="params.tagEnumLevelName[1]"
                                maxlength="50"
                                clearable
                                :disabled="isDetail"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="params.tagEnumType == 2 && tagEnumLevel >= 2">
                    <el-col :span="12" v-if="tagEnumLevel >= 2">
                        <el-form-item label="三级名称" :required="true">
                            <el-input
                                class="com-input"
                                placeholder="可输入2~15个字符"
                                v-model.trim="params.tagEnumLevelName[2]"
                                maxlength="50"
                                clearable
                                :disabled="isDetail"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="tagEnumLevel >= 3">
                        <el-form-item label="四级名称" :required="true">
                            <el-input
                                class="com-input"
                                placeholder="可输入2~15个字符"
                                v-model.trim="params.tagEnumLevelName[3]"
                                maxlength="50"
                                clearable
                                :disabled="isDetail"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="flexSpaceB searchRow">
                    <el-input
                        class="com-input"
                        style="width:35%;"
                        @change="searchList"
                        placeholder="请输入枚举值名称，按回车搜索"
                        v-model="keyWord"
                        clearable
                    ></el-input>
                    <div>
                        <el-button size="mini" type="primary" @click="downLoad">枚举值模板</el-button>
                        <el-button size="mini" @click="importExcel" type="primary">文件上传</el-button>
                        <el-tooltip class="item" effect="dark" content="文件上传功能会覆盖当前已填写的枚举信息" placement="top-start">
                            <i class="el-icon-question" style="margin-left:5px;color:#396bf6;"></i>
                        </el-tooltip>
                        <input type="file" id="uploadExcel" ref="uploadExcel" v-show="false" accept=".xls, .xlsx, .excel" @change="getUploadFile" />
                    </div>
                </div>
<!--                :data="showTable"-->
                <el-table
                    :data="showTable.slice(0, (page - 1) * size + size)"
                    style="width: 100%;border:1px solid #ccc;border-top:none;"
                    :header-cell-style="{
                        color: '#1B1B1B',
                        'font-size': '14px',
                        'font-weight': '600',
                        padding: '26px 0',
                        background: '#f9fafd'
                    }"
                >
                    <el-table-column type="index" width="50" align="center"> </el-table-column>
                    <el-table-column
                        prop="tagEnumName"
                        min-width="180px"
                        :render-header="renderHeader"
                        label="枚举值名称"
                        align="center"
                        header-align="center"
                    >
                        <template slot-scope="scope">
                            <el-input
                                class="com-input"
                                placeholder="可输入2~20个字符"
                                :disabled="isDetail"
                                v-model.trim="scope.row.tagEnumName"
                                minlength="2"
                                maxlength="20"
                                clearable
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tagEnumVal"
                        min-width="180px"
                        :render-header="renderHeader"
                        label="枚举值"
                        align="center"
                        header-align="center"
                    >
                        <template slot-scope="scope">
                            <el-input
                                class="com-input"
                                placeholder="1~20位的英文、数字"
                                :disabled="isDetail || scope.row.tagEnumIsLeaf == 0"
                                v-model.trim="scope.row.tagEnumVal"
                                @keyup.native="iptKeyUp"
                                minlength="1"
                                maxlength="20"
                                clearable
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="params.tagEnumType == 2"
                        prop="tagEnumLevel"
                        :render-header="renderHeader"
                        label="级别"
                        align="center"
                        header-align="center"
                    >
                        <template slot-scope="scope">
                            {{ LvName(scope.row.tagEnumLevel) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="params.tagEnumType == 2"
                        prop="ptagEnumVal"
                        :render-header="renderHeader"
                        label="父级名称"
                        align="center"
                        header-align="center"
                    >
                        <template slot-scope="scope">
                            {{ findPName(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="250px" align="center" header-align="center">
                        <template slot-scope="scope">
                            <div class="flexSpaceA">
                                <el-button
                                    type="text"
                                    :disabled="isDetail"
                                    @click="addRow(scope.row, scope.row.tagEnumLevel, false)"
                                    :size="'mini'"
                                    class="com-button"
                                    >添加同级</el-button
                                >
                                <el-button
                                    type="text"
                                    :disabled="params.tagEnumType == 1 || scope.row.tagEnumLevel == params.tagEnumLevel || isDetail"
                                    @click="addRow(scope.row, scope.row.tagEnumLevel + 1, true)"
                                    :size="'mini'"
                                    class="com-button"
                                    >添加子级</el-button
                                >
                                <el-button
                                    :size="'mini'"
                                    type="text"
                                    :disabled="isDetail || enumTable.length == 1"
                                    @click="removeRow(scope.row)"
                                    class="com-button"
                                    >删除</el-button
                                >
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="height: 30px;cursor: pointer;text-align: center;background: #fff;line-height: 30px;"
                     v-if="showTable.length > 100 && showTable.length > ((page - 1) * size + size)" @click="addTable">
                    <a>共（{{showTable.length}}）条,当前展示（{{tableListN}}）条，点击展开更多...</a>
                </div>
            </el-form>

        </div>
        <div slot="footer">
<!--            <el-button @click="cancel">取消</el-button>-->
            <el-button v-if="!isDetail" type="primary" @click="save" :loading="btnLoading">保存</el-button>
        </div>
    </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import XLSX from 'xlsx';
import { State, Mutation } from 'vuex-class';

@Component({})
export default class AddEnumDialog extends Vue {
    @State(state => state.nameAndTime) nameAndTime: any;
    @State(state => state.btnLoading) btnLoading?: boolean;
    @Mutation('chagneBtnLoading') chagneBtnLoading?: any;
    @Prop({ type: Boolean, default: false }) private isDetail?: boolean;
    @Prop({ type: String, default: '新增' }) private dialogTitle?: string;

    private iptKeyUp(e: any) {
        e.target.value = e.target.value.replace(/[^0-9a-zA-Z]*$/g, '');
    }

    private keyWord: string = '';
    private page: number = 1;
    private size: number = 100;
    private editDialog: boolean = false;
    private tagEnumLevel: number | string = 1;
    private params: any = {
        id: '',
        isReusable: 0,
        subjectId: window.sessionStorage.getItem('subjectId'),
        tagEnumName: '',
        tagEnumType: 1,
        tagEnumLevelName: [],
        tagEnumLevelReqVOList: []
    };
    private rules: any = {
        tagEnumName: [
            { required: true, message: '请输入枚举名称', trigger: 'blur' },
            { min: 2, max: 15, message: '请输入2~15个字符', trigger: 'blur' }
        ],
        // tagEnumLevelName: [
        //   { required: true, message: '请输入枚举值级别名称', trigger: 'blur' },
        //   { min: 2, max: 15, message: '请输入2~15个字符', trigger: 'blur' }
        // ],
        tagEnumType: [{ required: true }]
    };

    get tableListN() {
        return this.showTable.slice(0, (this.page - 1) * this.size + this.size).length
    }
    // 增加页数
    private addTable() {
        this.page++;
    }

    private checkName() {
        let sameVal = false;
        this.showTable.forEach((t1: any, i1: number) => {
            this.showTable.forEach((t2: any, i2: number) => {
                if (t1.tagEnumVal === t2.tagEnumVal && i1 !== i2) {
                    sameVal = true;
                }
            });
        });
        console.log('sameVal:', sameVal);
        return sameVal;
    }
    private enumTable: any[] = [];
    private showTable: any[] = [
        {
            id: '',
            subjectId: this.params.subjectId,
            tagEnumName: '',
            tagEnumVal: '',
            tagEnumLevel: 0,
            ptagEnumVal: '###',
            tagEnumIsLeaf: 1
        }
    ];
    private LvName(val: any) {
        if (this.params.tagEnumType == 1) {
            return '——';
        } else {
            if (val == 0) return '一级';
            if (val == 1) return '二级';
            if (val == 2) return '三级';
            if (val == 3) return '四级';
        }
    }
    private downLoad() {
        console.log('downLoad');
        this.$api.get('/api/admin/tagEnum/tagEnumTemplate').then((res: any) => {
            window.open(res);
        });
    }
    public open(row: any = {}) {
        this.editDialog = true;
        this.tagEnumLevel = 1;
        this.$nextTick(() => {
            (this.$refs['form'] as any).resetFields();
            this.keyWord = '';
            this.enumTable = [
                {
                    id: '',
                    subjectId: this.params.subjectId,
                    tagEnumName: '',
                    tagEnumVal: '',
                    tagEnumLevel: 0,
                    ptagEnumVal: '###',
                    tagEnumIsLeaf: 1
                }
            ];
            this.params = {
                id: '',
                isReusable: 0,
                subjectId: window.sessionStorage.getItem('subjectId'),
                tagEnumName: '',
                tagEnumType: 1,
                tagEnumLevelName: [],
                tagEnumLevelReqVOList: []
            };
            if (this.dialogTitle != '新增枚举') {
                Object.assign(this.params, row);
                this.getLevelNameList(row.id);
                this.$bus.$emit('main-loading', true);
                this.$api.get(`/api/admin/tagEnum/listTagEnumVal`,{tagEnumId:row.id}).then((res: any) => {
                    this.$bus.$emit('main-loading', false);
                    res.forEach((item: any) => {
                        item.valid = 1;
                        delete item.creator;
                        delete item.modifier;
                        delete item.createdTime;
                        delete item.modifiedTime;
                    });
                    this.enumTable = res;

                    console.log('修改后：', res, this.enumTable);
                });
            }
        });
    }
    private getLevelNameList(id: any) {
        this.params.tagEnumLevelName = [];
        this.$api.get(`/api/admin/tagEnum/listTagEnumLevel?tagEnumId=${id}`).then((res: any) => {
            res.forEach((ele: any) => {
                this.params.tagEnumLevelName.push(ele.tagEnumLevelName);
            });
            this.tagEnumLevel = this.params.tagEnumLevelName.length - 1;
        });
    }
    private renderHeader(cerateElement: any, { column }: any) {
        return cerateElement('div', [
            cerateElement('span', {
                domProps: {
                    innerHTML: '*'
                },
                style: {
                    color: 'red',
                    fontSize: '16px',
                    marginLeft: '5px'
                }
            }),
            cerateElement('span', column.label)
        ]);
    }
    private searchList(keyWord: string = '') {
        if (keyWord !== '') {
            if (this.dialogTitle == '新增枚举') {
                this.showTable = this.enumTable.filter((item: any) => {
                    return item.tagEnumName.toLowerCase().indexOf(keyWord.toLowerCase()) != -1;
                });
            } else {
                const activeList = this.enumTable.filter((item: any) => {
                    return item.valid == 1;
                });
                this.showTable = activeList.filter((item: any) => {
                    return item.tagEnumName.toLowerCase().indexOf(keyWord.toLowerCase()) != -1;
                });
            }
        } else {
            if (this.dialogTitle == '新增枚举') {
                this.showTable = this.enumTable;
            } else {
                this.showTable = this.enumTable.filter((item: any) => {
                    return item.valid == 1;
                });
            }
        }
        // console.log(this.showTable);
    }
    @Watch('enumTable', { immediate: true, deep: true })
    private handler(): void {
        this.searchList();
    }
    //打开文件
    private importExcel() {
        (this.$refs.uploadExcel as any).click();
    }
    //读取文件
    private getUploadFile(e: any) {
        //拿到所导入文件的名字
        const file = e.target.files[0];
        if (!file) {
            return false;
        }
        const reader = new FileReader();
        reader.onload = function(e: any) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetNames = workbook.SheetNames;
            const worksheet = workbook.Sheets[sheetNames[0]];
            const a: any[] = XLSX.utils.sheet_to_json(worksheet);
            const keys = Object.keys(a[0]);
            const b: any[] = [];
            a.forEach((item: any) => {
                const t = {
                    id: '',
                    subjectId: this.params.subjectId,
                    tagEnumName: item[keys[0]],
                    tagEnumVal: item[keys[1]],
                    ptagEnumVal: item[keys[2]],
                    tagEnumLevel: item[keys[3]]
                };
                if (this.dialogTitle === '修改枚举') {
                    Object.assign(t, { valid: 1 });
                }
                b.push(t);
            });
            if (b.length == 0) {
                this.$message.error('文件解析失败！请查看文件类型和格式是否正确！');
                return false;
            }
            b.forEach((t1: any) => {
                const isLeaf = b.every((t2: any) => {
                    return t1.tagEnumVal != t2.ptagEnumVal;
                });
                if (isLeaf) {
                    t1.tagEnumIsLeaf = 1;
                } else {
                    t1.tagEnumIsLeaf = 0;
                }
            });
            const isOne = b.every((item: any) => {
                return item.ptagEnumVal === '###' && Number(item.tagEnumLevel) === 0;
            });
            if (isOne) {
                this.params.tagEnumType = 1;
            } else {
                this.params.tagEnumType = 2;
                let lv = 1;
                b.forEach((bitem: any) => {
                    if (bitem.tagEnumLevel >= lv) lv = bitem.tagEnumLevel;
                });
                this.tagEnumLevel = lv;
            }
            console.log('是否为单级枚举：', isOne);
            if (this.dialogTitle === '修改枚举') {
                this.enumTable.forEach((item: any) => {
                    item.valid = 0;
                });
                this.enumTable = this.enumTable.concat(JSON.parse(JSON.stringify(b)));
            } else {
                this.enumTable = JSON.parse(JSON.stringify(b));
            }
            (this.$refs.uploadExcel as any).value = '';
        }.bind(this);
        reader.readAsBinaryString(file);
    }
    private findPName(row: any) {
        const { ptagEnumVal, tagEnumVal } = row;
        if (ptagEnumVal === '###' || ptagEnumVal == '' || !ptagEnumVal) return '——';
        const arr = this.enumTable.filter((item: any) => {
            return item.tagEnumVal != tagEnumVal && item.tagEnumVal == ptagEnumVal;
        });
        if (arr.length > 0) {
            return arr[0].tagEnumName;
        } else {
            this.$message.warning(`没有找到枚举值为${ptagEnumVal}的枚举！请仔细检查模板！`);
            this.enumTable = [
                {
                    id: '',
                    subjectId: this.params.subjectId,
                    tagEnumName: '',
                    tagEnumVal: '',
                    tagEnumLevel: 0,
                    ptagEnumVal: '###',
                    tagEnumIsLeaf: 1,
                    valid: 1
                }
            ];
            return false;
        }
    }
    private checkList(row: any, tagEnumLevel: any) {
        if (tagEnumLevel > this.tagEnumLevel) {
            this.$message.warning(`当前枚举最低级别为${this.LvName(this.tagEnumLevel)}级枚举！`);
            return false;
        }
        if (row.tagEnumName == '') {
            this.$message.warning('请填写当前枚举值名称！');
            return false;
        }
        if (row.tagEnumVal == '') {
            this.$message.warning('请填写当前枚举值！');
            return false;
        }
        if (this.checkName()) {
            this.$message.warning('枚举值不可重复');
            return false;
        }
        for (let i = 0; i < this.showTable.length; i++) {
            const item = this.showTable[i];
            if (item.tagEnumName === '') {
                this.$message.warning(`请填写第${i + 1}行枚举值名称！`);
                return false;
            }
            if (item.tagEnumVal === '') {
                this.$message.warning(`请填写第${i + 1}行枚举值！`);
                return false;
            }
            for (let n = 0; n < this.showTable.length; n++) {
                if (i !== n) {
                    const t2 = this.showTable[n];
                    if (item.tagEnumVal === t2.tagEnumVal) {
                        this.$message.warning('枚举值不可重复！');
                        return false;
                    }
                    if (item.tagEnumLevel === t2.tagEnumLevel && item.tagEnumName === t2.tagEnumName) {
                        this.$message.warning('相同级别下枚举值名称不可重复！');
                        return false;
                    }
                }
            }
        }
        return true;
    }
    private oldLevel: number | string = 0;
    private changeLevel(val: any) {
        if (val == 0) {
            this.params.tagEnumLevelName[0] = this.params.tagEnumName;
        } else {
            const highLevel = this.showTable.some((item: any) => {
                return Number(item.tagEnumLevel) > Number(val);
            });
            if (highLevel) {
                this.$message.warning('列表中已有更低级别，请先删除后再切换');
                this.tagEnumLevel = this.oldLevel;
                return false;
            } else {
                this.oldLevel = val;
            }
            this.params.tagEnumLevelName.length = Number(this.tagEnumLevel) + 1;
        }
    }
    private changeType(val: any) {
        if (val == 1) {
            this.changeLevel(0);
        } else {
            this.tagEnumLevel = 1;
        }
        this.keyWord = '';
        this.enumTable = [
            {
                id: '',
                subjectId: this.params.subjectId,
                tagEnumName: '',
                tagEnumVal: '',
                tagEnumLevel: 0,
                ptagEnumVal: '###',
                tagEnumIsLeaf: 1
            }
        ];
        this.params.tagEnumLevelName = [];
        if (this.dialogTitle === '修改枚举') {
            Object.assign(this.enumTable[0], { valid: 1 });
        }
    }
    private nameChange(val: any) {
        // console.log(val);
        // if (this.tagEnumLevel == 0) {
        //   this.params.tagEnumLevelName[0] = val;
        //   this.$forceUpdate();
        // }
        if (this.params.tagEnumType == 1) {
            this.params.tagEnumLevelName[0] = val;
        }
    }
    private addRow(row: any, tagEnumLevel: any, addChild: boolean = false) {
        if (!this.checkList(row, tagEnumLevel)) return false;
        const item = {
            id: '',
            subjectId: this.params.subjectId,
            tagEnumName: '',
            tagEnumVal: '',
            tagEnumLevel: tagEnumLevel,
            ptagEnumVal: '###',
            tagEnumIsLeaf: 1
        };
        if (this.dialogTitle === '修改枚举') {
            Object.assign(item, { valid: 1, tagEnumId: row.tagEnumId });
        }
        if (tagEnumLevel != 0) {
            // 不是一级，有父级名称
            if (addChild) {
                row.tagEnumIsLeaf = 0;
                item.ptagEnumVal = row.tagEnumVal;
            } else {
                item.ptagEnumVal = row.ptagEnumVal;
            }
        }
        this.enumTable.forEach((t: any, index: number) => {
            // 变量全量数据，匹配
            if (JSON.stringify(t) === JSON.stringify(row)) {
                this.enumTable.splice(index + 1, 0, item);
            }
        });
    }
    private removeRow(row: any) {
        let parent: any = {};
        for (let i = 0; i < this.showTable.length; i++) {
            const item = this.showTable[i];
            if (item.ptagEnumVal == row.tagEnumVal) {
                this.$message.warning(`该级别下含有子级，请先删除子级！`);
                return false;
            }
            if (item.tagEnumVal == row.ptagEnumVal) {
                parent = item;
            }
        }

        this.enumTable.forEach((item: any, index: number) => {
            // 变量全量数据，匹配
            if (JSON.stringify(item) === JSON.stringify(row)) {
                if (item.id) {
                    item.valid = 0;
                } else {
                    this.enumTable.splice(index, 1);
                }
            }
        });
        const isLeaf = this.showTable.some((item: any) => {
            return item.tagEnumVal !== row.tagEnumVal && item.ptagEnumVal == parent.tagEnumVal;
        });
        if (isLeaf) {
            parent.tagEnumIsLeaf = 0;
        } else {
            parent.tagEnumIsLeaf = 1;
        }
        console.log(isLeaf);
    }
    private cancel(): void {
        this.editDialog = false;
    }
    private saveCheck() {
        // console.log('checkSave');
        // 验证
        if (this.params.tagEnumType == 1) {
            try {
                this.showTable.forEach((item: any, i: number) => {
                    if (item.tagEnumName === '' || item.tagEnumVal === '') {
                        throw new Error('noValue');
                    }
                    if (item.tagEnumLevel != '0' || item.ptagEnumVal !== '###') {
                        throw new Error('errorValue');
                    }
                    this.showTable.forEach((t2: any, i2: number) => {
                        if (item.tagEnumName === t2.tagEnumName && i !== i2) {
                            throw new Error('sameName');
                        }
                        if (item.tagEnumVal === t2.tagEnumVal && i !== i2) {
                            throw new Error('sameValue');
                        }
                    });
                });
            } catch (e) {
                if (e.message === 'noValue') {
                    this.$message.warning('枚举值名称和枚举值必填！');
                    return false;
                }
                if (e.message === 'errorValue') {
                    this.$message.warning('父枚举值或枚举级别数据错误！');
                    return false;
                }
                if (e.message === 'sameName') {
                    this.$message.warning('枚举值名称不可重复！');
                    return false;
                }
                if (e.message === 'sameValue') {
                    this.$message.warning('枚举值不可重复！');
                    return false;
                }
            }
        }
        if (this.params.tagEnumType == 2) {
            // N级枚举
            this.keyWord = '';
            this.searchList();
            for (let i = 0; i <= this.tagEnumLevel; i++) {
                if (this.params.tagEnumLevelName[i] == undefined || this.params.tagEnumLevelName[i] == '') {
                    this.$message.warning(`请填写${this.LvName(i)}名称`);
                    return false;
                }
                for (let n = 0; n <= this.tagEnumLevel; n++) {
                    if (this.params.tagEnumLevelName[i] == this.params.tagEnumLevelName[n] && i != n) {
                        this.$message.warning(`各级别名称不可重复`);
                        return false;
                    }
                }

                try {
                    const arr = this.showTable.filter((item: any) => {
                        // 当前级别： i,arr: 当前级别list，验证名称是否重复
                        return item.tagEnumLevel == i;
                    });
                    arr.forEach((t1: any, i1: number) => {
                        arr.forEach((t2: any, i2: number) => {
                            if (t1.tagEnumName == t2.tagEnumName && i1 != i2) {
                                throw new Error('same');
                            }
                        });
                    });
                } catch (e) {
                    if (e.message == 'same') {
                        this.$message.warning('同级别下枚举值名称不可重复！');
                        return false;
                    }
                }
            }
            let level = 0;
            this.showTable.forEach((item: any) => {
                if (item.tagEnumLevel > level) {
                    level = item.tagEnumLevel;
                }
            });
            if (Number(level) != Number(this.tagEnumLevel)) {
                this.$message.warning(`所选级别与列表级别不一致！`);
                return false;
            }
            for (let i = 0; i < this.showTable.length; i++) {
                const item = this.showTable[i];
                if ((item.ptagEnumVal === '###' && item.tagEnumLevel != 0) || (item.ptagEnumVal !== '###' && item.tagEnumLevel == 0)) {
                    this.$message.warning(`枚举列表第${i + 1}行父枚举值与级别不对应！`);
                    return false;
                }
                if (item.tagEnumLevel != 0) {
                    const parent = this.showTable.filter((ele: any) => {
                        return ele.tagEnumVal == item.ptagEnumVal;
                    })[0];
                    if (item.tagEnumLevel - parent.tagEnumLevel > 1) {
                        this.$message.warning(`枚举列表第${i + 1}行级别错误！`);
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private makeParam() {
        this.params.tagEnumLevelName.map((name: any, i: number) => {
            const ele = {
                id: '',
                subjectId: this.params.subjectId,
                tagEnumId: '',
                tagEnumLevel: i,
                tagEnumLevelName: name,
                tagEnumValReqVOList: []
            };
            this.params.tagEnumLevelReqVOList.push(ele);
        });
        // this.makeIsLeaf();
        this.params.tagEnumLevelReqVOList.forEach((item: any) => {
            item.tagEnumValReqVOList = this.enumTable.filter((ele: any) => {
                return item.tagEnumLevel == ele.tagEnumLevel;
            });
            item.tagEnumValReqVOList.map((t: any, i: number) => {
                t.tagEnumSort = i + 1;
            });
        });

        // console.log('list：', this.params.tagEnumLevelReqVOList);
    }
    private makeSort() {
        this.params.tagEnumLevelReqVOList.forEach((item: any) => {
            item.tagEnumValReqVOList.map((t: any, i: number) => {
                t.tagEnumSort = i + 1;
            });
        });
    }
    private makeIsLeaf() {
        this.enumTable.forEach((t1: any) => {
            const isLeaf = this.enumTable.every((t2: any) => {
                return t1.tagEnumVal != t2.ptagEnumVal;
            });
            if (isLeaf) {
                t1.tagEnumIsLeaf = 1;
            } else {
                t1.tagEnumIsLeaf = 0;
            }
        });
    }
    private save() {
        this.chagneBtnLoading(true);
        const form = this.$refs.form as any;
        if (!this.saveCheck()) {
            this.chagneBtnLoading(false);
            return false;
        }
        form.validate((valid: any) => {
            if (valid) {
                this.params.modifiedTime = null;
                this.params.modifier = null;
                this.params.createdTime = null;
                this.params.creator = null;
                if (this.params.id !== '') {
                    // id存在为修改
                    this.makeTagEnumLevelReqVOList().then(res => {
                        this.params.tagEnumLevelReqVOList = res;
                        console.log(this.params, JSON.stringify(this.params));
                        this.$api
                            .post('/api/admin/tagEnum/update', this.params)
                            .then((res: any) => {
                                this.editDialog = false;
                                this.$emit('update');
                                this.$message.success('修改成功');
                            })
                            .finally(() => {
                                this.chagneBtnLoading(false);
                            });
                    });
                } else {
                    // id不存在为新增
                    const param: any = {};
                    this.makeParam();
                    const { subjectId, tagEnumType, tagEnumName, tagEnumLevelReqVOList } = this.params;
                    const a = {
                        isReusable: 0,
                        subjectId,
                        tagEnumName,
                        tagEnumType,
                        tagEnumLevelReqVOList
                    };
                    Object.assign(param, a);
                    console.log(JSON.stringify(param));
                    this.$api
                        .post('/api/admin/tagEnum/add', param)
                        .then((res: any) => {
                            this.editDialog = false;
                            this.$emit('update');
                            this.$message.success('新增成功');
                        })
                        .finally(() => {
                            this.chagneBtnLoading(false);
                        });
                }
            } else {
                this.chagneBtnLoading(false);

                return false;
            }
        });
    }
    private makeTagEnumLevelReqVOList() {
        return new Promise((resolve, reject) => {
            // 生成初始的分级list
            let tagEnumLevelReqVOList: any[] = [];
            const id = this.params.id;
            this.$api
                .get(`/api/admin/tagEnum/listTagEnumLevel?tagEnumId=${id}`)
                .then((res: any) => {
                    tagEnumLevelReqVOList = res;
                    if (tagEnumLevelReqVOList.length >= this.params.tagEnumLevelName.length) {
                        // 删除了某个等级
                        tagEnumLevelReqVOList.forEach((item: any, index: number) => {
                            if (this.params.tagEnumLevelName[index]) {
                                item.tagEnumLevelName = this.params.tagEnumLevelName[index];
                                item.tagEnumValReqVOList = [];
                            } else {
                                item.valid = 0;
                            }
                        });
                    } else {
                        tagEnumLevelReqVOList.forEach((item: any, index: number) => {
                            if (this.params.tagEnumLevelName[index]) {
                                item.tagEnumLevelName = this.params.tagEnumLevelName[index];
                                item.tagEnumValReqVOList = [];
                            }
                        });
                        const startIdx = tagEnumLevelReqVOList.length;
                        for (let i = startIdx; i < this.params.tagEnumLevelName.length; i++) {
                            tagEnumLevelReqVOList.push({
                                id: '',
                                subjectId: window.sessionStorage.getItem('subjectId'),
                                tagEnumId: id,
                                tagEnumLevel: i,
                                tagEnumLevelName: this.params.tagEnumLevelName[i],
                                tagEnumValReqVOList: []
                            });
                        }
                    }
                    // 在分级list下挂载枚举值列表的数据
                    // this.makeIsLeaf();
                    tagEnumLevelReqVOList.forEach((item: any) => {
                        item.tagEnumValReqVOList = this.enumTable.filter((ele: any) => {
                            return item.tagEnumLevel == ele.tagEnumLevel;
                        });
                        item.tagEnumValReqVOList.map((t: any, i: number) => {
                            t.tagEnumSort = i + 1;
                            t.tagEnumLevelId = item.id;
                        });
                    });
                    resolve(tagEnumLevelReqVOList);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
</script>
<style scoped lang="scss">
footer {
    text-align: center;
    margin-top: 36px;
}
/deep/ .el-select {
    width: 100%;
}
/deep/ .noSuffix {
    .el-input__suffix {
        display: none;
    }
}
.flexSpaceB {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.flexSpaceA {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.searchRow {
    background: #f9fafd;
    padding: 20px 25px;
    border: 1px solid #ccc;
    border-bottom: none;
}
</style>
