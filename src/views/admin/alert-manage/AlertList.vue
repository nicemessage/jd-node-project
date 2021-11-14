<template>
    <div class="alert-list">
        <div class="alert-top-search-list">
            <div class="alert-top-search-item" style="line-height: initial">
                <SysSubject @changeId="getAlertList"> </SysSubject>
            </div>
            <div class="alert-top-search-item">
                <el-input size="small" v-model="alertName" placeholder="预警规则名称"></el-input>
            </div>
            <div class="alert-top-search-item">
                <el-select size="small" v-model="type">
                    <el-option v-for="(item, i) in ['群体规则', '标签规则']" :value="item" :key="i">{{ item }}</el-option>
                </el-select>
            </div>
            <div class="alert-top-search-item">
                <el-input size="small" v-model="itemName" placeholder="群体ID/群体名称/标签ID/标签名称"></el-input>
            </div>
            <div style="float: right">
                <el-button size="small" type="primary" @click="addNewAlert">+ 添加预警监控</el-button>
            </div>
        </div>
        <div class="touch-content">
            <div class="wrapper">
                <el-table :data="list" size="small">
                    <el-table-column prop="monitorId" label="预警规则ID" width="280"></el-table-column>
                    <el-table-column prop="monitorName" label="预警规则名称" width="100"></el-table-column>
                    <el-table-column prop="monitorType" label="规则类型" width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.monitorType == 1 ? '群体规则' : '标签规则' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="objName" label="预警标签/群体"></el-table-column>
                    <el-table-column prop="creator" label="规则创建人" width="100"></el-table-column>
                    <el-table-column label="状态" width="60">
                        <template slot-scope="scope">
                            <template v-if="scope.row.valid == '0'">
                                <span style="color: #f56c6c">无效</span>
                            </template>
                            <template v-else-if="scope.row.valid == '1'">
                                <span style="color: #65bf9f">有效</span>
                            </template>
                            <template v-else-if="scope.row.state == '1'">
                                <span>运行中</span>
                            </template>
                            <template v-else-if="scope.row.state == '2'">
                                <span>已停止</span>
                            </template>
                            <template v-else></template>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后修改时间" width="100">
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.modifiedTime, 'YYYY-MM-DD') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="260" fixed="right">
                        <template slot-scope="scope">
                            <span class="option-item" @click="showEdit(scope.row, 1)">修改</span>
                            <span class="option-item" @click="showEdit(scope.row, 0)">查看</span>
                            <span class="option-item" @click="showDel(scope.row)">删除</span>
                            <span class="option-item" @click="showHistory(scope.row)">预警历史</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div style="width: 100%; padding: 0 0 18px 40px; text-align: right; margin-top: 10px">
            <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-size.sync="pageSize"
                :current-page.sync="pageNo"
                :page-sizes="pageSizeList"
            ></el-pagination>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showEditDialog" width="800px">
            <div slot="title" class="dialog-title">
                <span>{{ newAlertType == 2 ? '创建' : newAlertType == 1 ? '编辑' : '查看' }}</span
                >预警规则
            </div>
            <el-form :model="item" ref="form" :rules="rules" style="padding: 30px 30px 0 30px" label-width="140px" label-align="right">
                <el-form-item prop="alertName" class="alert-dialog-list-item">
                    <span slot="label">预警规则名称：</span>
                    <el-input
                        v-if="newAlertType != 0"
                        size="small"
                        style="width: 550px"
                        v-model="item.alertName"
                        placeholder="预警规则名称"
                    ></el-input>
                    <span v-else>{{ item.alertName }}</span>
                </el-form-item>
                <el-form-item prop="type" class="alert-dialog-list-item">
                    <span slot="label">预警规则类型：</span>
                    <el-select v-if="newAlertType != 0" size="small" style="width: 550px" clearable v-model="item.type" @change="changeDialogType">
                        <el-option v-for="(x, i) in ['群体', '标签']" :value="x" :key="i">{{ x }}</el-option>
                    </el-select>
                    <span v-else>{{ item.type }}</span>
                </el-form-item>
                <el-form-item prop="typeItemList" class="alert-dialog-list-item">
                    <span slot="label">预警{{ item.type ? item.type : '目标' }}：</span>
                    <el-select
                        v-if="newAlertType != 0"
                        size="small"
                        style="width: 550px"
                        filterable
                        remote
                        clearable
                        multiple
                        :multiple-limit="5"
                        @change="changeTypeItemSelect"
                        :remote-method="searchItem"
                        v-model="tempSelect"
                        :placeholder="'预警' + (item.type ? item.type : '目标')"
                    >
                        <el-option v-for="(x, i) in typeItems" :value="x.value" :label="x.label" :key="i">{{ x.label }}</el-option>
                    </el-select>
                    <span v-else>{{ item.objName }}</span>
                </el-form-item>
                <el-form-item prop="notifiList" class="alert-dialog-list-item">
                    <span slot="label">通知策略：</span>
                    <el-checkbox-group style="height: 28px" :disabled="newAlertType == 0" v-model="item.notifiList">
                        <el-checkbox label="1">邮件</el-checkbox>
                        <el-checkbox label="2">咚咚消息</el-checkbox>
                        <!-- <el-checkbox label="3">短信</el-checkbox> -->
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="erps" class="alert-dialog-list-item">
                    <span slot="label">通知对象：</span>
                    <SearchErp
                        v-if="newAlertType != 0"
                        :value.sync="item.erps"
                        size="small"
                        style="width: 550px"
                        clearable
                        :multiple-limit="5"
                        multiple
                    ></SearchErp>
                    <span v-else>{{ item.erpName }}</span>
                </el-form-item>
                <el-form-item prop="ruleList" class="alert-dialog-list-item">
                    <span slot="label">预警规则：</span>
                    <el-button v-if="newAlertType != 0" type="primary" size="small" :disabled="addRuleMoreDisable" @click="dialogAdd"
                        >添加规则</el-button
                    >
                </el-form-item>
            </el-form>
            <div style="overflow: hidden">
                <el-table size="small" style="width: 700px; margin: 0 50px 30px 50px" :data="item.ruleList">
                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>
                    <el-table-column label="预警问题" prop="problem" width="165">
                        <template slot-scope="scope">
                            <el-select v-if="newAlertType != 0" size="mini" v-model="scope.row.problem">
                                <el-option v-for="(item, i) in problems()" :disabled="findRuleInList(item)" :value="item" :key="i">{{
                                    item
                                }}</el-option>
                            </el-select>
                            <span v-else>{{ scope.row.problem }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="预警详细">
                        <template slot-scope="scope">
                            <template v-if="scope.row.problem == '群体未更新' || scope.row.problem == '标签未更新'">
                                <span style="margin-right: 10px">选择通知时间:</span>
                                <el-time-select
                                    v-if="newAlertType != 0"
                                    v-model="scope.row.time"
                                    :picker-options="{ start: '00:00', step: '00:05', end: '23:55' }"
                                    size="mini"
                                    :editable="false"
                                    :clearable="false"
                                    placeholder="通知时间"
                                    value-format="HH-mm"
                                ></el-time-select>
                                <span v-else>{{ scope.row.time }}</span>
                            </template>
                            <template v-else-if="scope.row.problem == '群体数量阈值异常' || scope.row.problem == '标签覆盖人数阈值异常'">
                                <span style="margin-right: 10px">群体正常范围:</span>
                                <el-input v-if="newAlertType != 0" size="mini" style="width: 90px" v-model.number="scope.row.start"></el-input>
                                <span v-else>{{ scope.row.start }}</span>
                                <span style="margin-right: 10px; margin-left: 10px">-</span>
                                <el-input v-if="newAlertType != 0" size="mini" style="width: 90px" v-model.number="scope.row.end"></el-input>
                                <span v-else>{{ scope.row.end }}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="newAlertType != 0" label="操作" width="60" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span class="option-item" @click="dialogDel(scope.row, scope.$index)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span v-if="newAlertType != 0" slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取消</el-button>
                <el-button size="medium" type="primary" @click="submitAlert">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showHistoryDialog" width="800px">
            <div slot="title" class="dialog-title">（{{ historyItem.monitorName }}）预警历史</div>
            <el-table size="small" style="width: 100%" :data="historyList">
                <el-table-column
                    prop="objName"
                    header-align="center"
                    align="center"
                    :label="(historyItem.monitorType == 1 ? '群体' : '标签') + '名称'"
                ></el-table-column>
                <el-table-column
                    prop="objCode"
                    header-align="center"
                    align="center"
                    :label="(historyItem.monitorType == 1 ? '群体' : '标签') + '编码'"
                ></el-table-column>
                <!-- <el-table-column prop="monitorType" label="报警类型"></el-table-column> -->
                <el-table-column prop="createdTime" header-align="center" align="center" width="140" label="报警时间">
                    <template slot-scope="scope">
                        {{ formatDate(scope.row.createdTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="monitorDesc" header-align="center" align="center" label="命中规则"></el-table-column>
                <!-- <el-table-column prop="noticeObj" label="通知对象"></el-table-column> -->
            </el-table>
            <div style="width: 100%; padding: 0 10px 18px 40px; text-align: right; margin-top: 10px">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="historyTotal"
                    :page-size.sync="historyPageSize"
                    :current-page.sync="historyPageNo"
                    :page-sizes="pageSizeList"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { PageMixin } from '@/mixins/pageMixin';
import SysSubject from '@/components/SysSubject.vue';
import SearchErp from '@/components/SearchErp.vue';
import moment from 'moment';
@Component({
    components: { SearchErp, SysSubject },
})
export default class AlertList extends Mixins(PageMixin) {
    @State(state => state.userInfo)
    userInfo?: any;
    @State(state => state.curSubject)
    curSubject!: any | null;
    @Watch('curSubject')
    private subjectChange() {
        this.alertName = '';
        this.itemName = '';
        this.getAlertList();
    }
    // 三个搜索参数
    private alertName: string = ''; // 预警规则名称
    @Watch('alertName')
    changeName() {
        this.getAlertList();
    }
    private type: string = '群体规则'; // 群体规则 或 标签规则
    @Watch('type')
    changeType() {
        this.getAlertList();
    }
    private itemName: string = ''; // 实例名字 群体ID/群体名称/标签ID/标签名称
    @Watch('itemName')
    changeItemName() {
        this.getAlertList();
    }
    private list = []; // 列表
    private showEditDialog: boolean = false; // 是否显示弹窗
    private showHistoryDialog: boolean = false; // 是否显示弹窗
    private newAlertType: number = 0; // 0查看，1修改，2新增
    private item: any = {
        // 弹窗中的内容
        alertName: '', // 名称
        type: '', // 类型
        typeItemList: [], // 类型对应所有标签或群体
        notifiList: [], // 通知类型
        erps: [], // 人
        ruleList: [], // 规则
    };
    private tempSelect = [];
    private rules = {
        alertName: [{ required: true, message: '请输入预警名称' }],
        type: [{ required: true, message: '请选择预警类型' }],
        typeItemList: [{ required: true, message: '请添加预警对象' }],
        notifiList: [{ required: true, message: '请添加通知类型' }],
        erps: [{ required: true, message: '请添加通知对象' }],
        ruleList: [{ required: true, message: '请添加规则' }],
    };
    private typeItems = []; // 类型对应的搜索到的列表

    // mixins了 页参数
    @Watch('pageNo')
    private pageNoChange() {
        this.getAlertList();
    }
    @Watch('pageSize')
    private pageSizeChange() {
        this.getAlertList();
    }

    // 预警历史相关
    private historyItem: any = {};
    private historyList: any = [];
    private historyTotal = 0;
    private historyPageNo = 1;
    @Watch('historyPageNo')
    private changeHistoryPage() {
        if (this.showHistoryDialog) {
            this.requestHistory();
        }
    }
    private historyPageSize = 10;
    private changeHistorySize() {
        if (this.showHistoryDialog) {
            this.requestHistory();
        }
    }

    private requestHistory() {
        if (!this.showHistoryDialog) {
            this.$bus.$emit('main-loading', true);
        }
        this.$api
            .post('/api/ava/monitor/queryLogList', {
                subjectId: this.curSubject.id,
                monitorId: this.historyItem.monitorId,
                pageNum: this.historyPageNo,
                pageSize: this.historyPageSize,
            })
            .then((res: any) => {
                this.historyList = res.list;
                this.historyTotal = res.total;
                if (!this.showHistoryDialog) {
                    this.$bus.$emit('main-loading', false);
                    this.showHistoryDialog = true;
                }
            })
            .catch(() => {
                this.$bus.$emit('main-loading', false);
            });
    }
    // 查看报警历史
    private showHistory(item: any) {
        // console.log('alert showHistory');
        this.historyItem = item;
        this.historyPageNo = 1;
        this.historyPageSize = 10;
        this.requestHistory();
    }

    // 时间格式化
    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    // 页面的修改报警
    private showEdit(item: any, edit: number) {
        const form = this.$refs.form as any;
        if (form) {
            form.resetFields();
        }
        this.tempSelect = [];
        this.$bus.$emit('main-loading', true);
        this.$api
            .get('/api/ava/monitor/detail', {
                monitorId: item.monitorId,
            })
            .then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.item = {
                    monitorId: item.monitorId,
                    alertName: res.monitorName,
                    type: res.monitorType == 1 ? '群体' : '标签',
                    notifiList: res.noticeTypeList,
                    erps: res.noticeObjList,
                };
                this.item.erpName = res.noticeObjList.join(',');
                const rules = JSON.parse(res.monitorContent);
                const ruleList: any = [];
                const problemList = this.problems();
                rules.forEach((item: any) => {
                    const idx = Number(item.ruleKey) - 1;
                    if (idx == 0) {
                        ruleList.push({
                            problem: problemList[idx],
                            time: item.ruleVal.slice(0, 2) + ':' + item.ruleVal.slice(2),
                        });
                    } else if (idx == problemList.length - 1) {
                        const start = item.ruleVal.split(',')[0];
                        const end = item.ruleVal.split(',')[1];
                        ruleList.push({
                            problem: problemList[idx],
                            start: Number(start),
                            end: Number(end),
                        });
                    } else {
                        ruleList.push({ problem: problemList[idx] });
                    }
                });
                this.item.ruleList = ruleList;
                const codeList = res.objCode.split(',');
                const nameList = res.objName.split(',');
                if (nameList) {
                    this.selectItems = nameList.map((name: any, index: number) => {
                        return { label: name, value: name, code: codeList[index] };
                    });
                    // this.typeItems = this.selectItems;
                }
                this.item.objName = res.objName;
                this.newAlertType = edit;
                this.showEditDialog = true;
                this.item.typeItemList = nameList;
                this.tempSelect = nameList;
                this.computeCanAddMore();
            })
            .catch(() => {
                this.$bus.$emit('main-loading', false);
            });
        // console.log('alert showEdit');
    }
    // 删除报警
    private showDel(item: any) {
        // console.log('alert showDel');
        this.$api.get('/api/ava/monitor/delete', { monitorId: item.monitorId }).then((res: any) => {
            this.$message.success('删除成功');
            this.getAlertList();
        });
    }
    // 添加一个新的预警
    private addNewAlert() {
        this.newAlertType = 2;
        this.item = {
            alertName: '',
            type: '',
            typeItemList: [],
            notifiList: [],
            erps: [],
            ruleList: [],
        };
        this.tempSelect = [];
        this.typeItems = [];
        this.showEditDialog = true;
        const form = this.$refs.form as any;
        if (form) {
            form.resetFields();
        }
    }

    // dialog删除规则
    private dialogDel(item: any, idx: number) {
        // Vue.delete(this.item.ruleList, idx);
        this.item.ruleList.splice(idx, 1);
        this.computeCanAddMore();
    }
    // 添加规则
    private dialogAdd() {
        // console.log(this.item);
        // // 根据不同的类型选择不同的操作
        // if (this.item.type == '标签') {
        //     console.log('biaoqian');
        // } else if (this.item.type == '群体') {
        //     console.log('crowd');
        // }
        if (this.item.type && this.item.type.length > 0) {
            //{
            //    problem: this.problems().length > 0 ? this.problems()[0] : '',
            //    time: '12:00',
            //    start: 800,
            //    end: 1000,
            //}
            const problems = this.problems();
            for (let index = 0; index < problems.length; index++) {
                const item = problems[index];
                const rule = this.item.ruleList.find((r: any) => {
                    return r.problem == item;
                });
                if (!rule) {
                    const data: any = {};
                    data.problem = item;
                    data.time = '12:00';
                    data.start = 800;
                    data.end = 1000;
                    this.item.ruleList.push(data);
                    break;
                }
            }
        }
        this.computeCanAddMore();
    }
    // 更改类型
    private changeDialogType(val: any) {
        // console.log(val);
        this.item.type = val;
        this.item.typeItemList = [];
        this.tempSelect = [];
        this.item.ruleList = [];
        this.typeItems = [];
        this.computeCanAddMore();
    }
    private searchItem(query: string) {
        if (query.length == 0) {
            return;
        }
        // 根据不同的类型选择不同的操作
        if (this.item.type == '标签') {
            // 没添加规则的标签接口
            // console.log('biaoqian');
            const url = '/api/admin/tag/page';
            const data = {
                isSuperAdmin: 0,
                // 没有排序
                // sortBy: this.sortBy,
                // sortOrder: this.sortOrder,
                subjectId: this.curSubject.id,
                pageNum: 1,
                pageSize: 20,
            };
            if (query && query != '') {
                Object.assign(data, {
                    keyword: query.trim(),
                });
            }
            this.$api
                .post(url, data)
                .then((res: any) => {
                    this.typeItems = res.list.slice(0).map((item: any) => {
                        return { label: item.tagName, value: item.tagName, code: item.tagCode };
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (this.item.type == '群体') {
            // 没添加规则的群体接口
            // console.log('crowd');
            const url = `/api/ava/crowd/me`;
            const data = {
                subjectId: this.curSubject.id,
                // crowdTouchState: 0,
                crowdState: 2,
                pageNum: 1,
                pageSize: 20,
            };
            if (query) {
                Object.assign(data, {
                    keyword: query.trim(),
                });
            } else {
                Object.assign(data, {
                    keyword: '',
                });
            }
            this.$api
                .post(url, data)
                .then((res: any) => {
                    this.typeItems = res.list.map((item: any) => {
                        return { label: item.crowdName, value: item.crowdName, code: item.crowdCode };
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
    private selectItems = [];
    private changeTypeItemSelect(names: any) {
        this.item.typeItemList = names;
        this.tempSelect = names;
        // console.log(names);
        const items: any = [];
        for (let i = 0; i < this.selectItems.length; i++) {
            const item: any = this.selectItems[i];
            const idx = names.indexOf(item.label);
            if (idx >= 0) {
                items.push(item);
            }
        }
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            let item = items.find((res: any) => {
                return res.label == name;
            });
            if (!item) {
                item = this.typeItems.find((res: any) => {
                    return res.label == name;
                });
                if (item) {
                    items.push(item);
                }
            }
        }
        this.selectItems = items;
    }
    private addRuleMoreDisable = false;
    private computeCanAddMore() {
        this.addRuleMoreDisable = !this.item.type || this.item.type == '' || this.item.ruleList.length == this.problems().length;
    }

    private findRuleInList(item: any): boolean {
        return (
            this.item.ruleList.find((name: any) => {
                return item == name.problem;
            }) != null
        );
    }
    private problems() {
        if (this.item.type == '标签') {
            return ['标签未更新', '标签覆盖人数为0', '标签覆盖人数阈值异常'];
        } else if (this.item.type == '群体') {
            return ['群体未更新', '群体数量为0', '群体加工失败', '群体数量阈值异常'];
        }
        return [];
    }
    // 提交
    private submitAlert() {
        (this.$refs.form as any).validate((valid: any) => {
            if (valid) {
                const data: any = {};
                data.monitorName = this.item.alertName;
                data.monitorType = this.item.type == '群体' ? 1 : 2;
                data.noticeTypeList = this.item.notifiList;
                data.noticeObjList = this.item.erps;
                data.monitorDesc = '';
                data.objCodeList = this.selectItems.map((res: any) => {
                    return res.code;
                });
                data.subjectId = this.curSubject.id;
                data.creator = window.sessionStorage.getItem('userErp');
                const rules: any = [];
                const problems = this.problems();
                for (let i = 0; i < problems.length; i++) {
                    const rule = this.item.ruleList.find((item: any) => {
                        return item.problem == problems[i];
                    });
                    if (rule) {
                        let val = '';
                        if (i == 0) {
                            val = rule.time.replace(':', '');
                        } else if (this.problems().length - 1 == i) {
                            val = `${rule.start ? rule.start : 0},${rule.end ? rule.end : ' '}`;
                        }
                        rules.push({
                            ruleKey: String(i + 1),
                            ruleVal: val,
                        });
                    }
                }
                data.monitorContent = JSON.stringify(rules);
                this.$bus.$emit('main-loading', true);
                if (this.newAlertType == 2) {
                    // 新增
                    this.$api
                        .post('/api/ava/monitor/add', data)
                        .then((res: any) => {
                            // console.log(res);
                            this.item = {
                                alertName: '',
                                type: '',
                                typeItemList: [],
                                notifiList: [],
                                erps: [],
                                ruleList: [],
                            };
                            this.getAlertList();
                            this.showEditDialog = false;
                        })
                        .catch(() => {
                            this.$bus.$emit('main-loading', false);
                        });
                } else if (this.newAlertType == 1) {
                    // 修改
                    data.monitorId = this.item.monitorId;
                    this.$api
                        .post('/api/ava/monitor/update', data)
                        .then((res: any) => {
                            // console.log(res);
                            this.item = {
                                alertName: '',
                                type: '',
                                typeItemList: [],
                                notifiList: [],
                                erps: [],
                                ruleList: [],
                            };
                            this.getAlertList();
                            this.showEditDialog = false;
                        })
                        .catch(() => {
                            this.$bus.$emit('main-loading', false);
                        });
                }
                this.showEditDialog = false;
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }
    mounted() {
        this.getAlertList();
    }
    // 请求列表
    private getAlertList() {
        const data: any = {};
        data.keyword = this.itemName;
        data.monitorName = this.alertName;
        data.monitorType = this.type == '标签规则' ? 2 : 1;
        data.pageNum = this.pageNo;
        data.pageSize = this.pageSize;
        data.subjectId = this.curSubject.id;
        this.$bus.$emit('main-loading', true);
        this.$api
            .post('/api/ava/monitor/queryList', data)
            .then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.list = res.list;
                this.total = res.total;
            })
            .catch(() => {
                this.$bus.$emit('main-loading', false);
            });
    }
}
</script>
<style lang="scss" scoped>
.alert-list {
    padding: 20px;

    .alert-top-search-list {
        height: 60px;
        line-height: 60px;

        .alert-top-search-item {
            float: left;
            margin-right: 10px;
            /deep/ .el-input {
                width: 250px;
            }
        }
    }
    .option-item {
        width: 80px;
        height: 17px;
        margin-right: 15px;
        padding: 6px 7px; // background-color: #396bf6;
        border-radius: 4px;
        text-align: center;
        font-size: 0.75rem;
        color: #396bf6;
        line-height: 17px;
        cursor: pointer;
        user-select: none;

        &.disable {
            color: #ccc; // background: rgba(219, 219, 219, 1);
        }
        &:last-child {
            margin-right: 0px;
        }
    }

    .alert-dialog-list-item {
        height: 32px;
        line-height: 32px;
        padding: 0 0 8px 0;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
    }
}
</style>
