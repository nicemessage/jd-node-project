<template>
    <div class="crowd-item">
        <div class="crowd-item-header" @click="goToInfo">
            <div class="crowd-name">
                <div class="ribbon" :style="{backgroundColor: ribbonColors[dataIdx % 6]}"></div>
                {{ data.crowdName }}
            </div>
            <template v-if="data.crowdState == 1">
                <div class="crowd-state a">
                    <div class="circle"></div>
                    加工中
                </div>
            </template>
            <template v-else-if="data.crowdState == 2">
                <div class="crowd-state b">
                    <div class="circle"></div>
                    有效
                </div>
            </template>
            <template v-else-if="data.crowdState == 3">
                <div class="crowd-state c">
                    <div class="circle"></div>
                    加工失败
                </div>
            </template>
            <div class="crowd-num" v-if="data.crowdState == 2">{{ data.crowdRealNum === null ? '' :
                data.crowdRealNum.toLocaleString() }}
            </div>
            <div class="crowd-num" v-else-if="data.crowdState == 3">
                0
            </div>
            <div class="crowd-num" v-else style="color: #BAC3C9;font-weight: normal;">
                加工中，请稍后...
            </div>
        </div>
        <div class="crowd-item-body" @click="goToInfo">
            <div class="item-property">
                <div class="circle"></div>
                <div class="item-property-label">群体编码：</div>
                <div class="item-property-value">{{ data.crowdCode }}</div>
                <i title="复制" class="el-icon-document-copy copyBtn" @click.stop="copyCrowdCode(data.crowdCode)"></i>
            </div>
            <div class="item-property">
                <div class="circle"></div>
                <div class="item-property-label">创建方式：</div>
                <div class="item-property-value">
                    {{ crowdTypeMap[data.crowdType] ? crowdTypeMap[data.crowdType] : '' }}
                </div>
            </div>
            <div class="item-property">
                <div class="circle"></div>
                <div class="item-property-label">更新日期：</div>
                <div class="item-property-value">
                    {{ data.crowdDataDt ? formatDate(data.crowdDataDt, 'YYYY-MM-DD') : '加工后展示' }}
                </div>
            </div>
            <!--            <div class="item-property">-->
            <!--                <div class="item-property-label">群体状态</div>-->
            <!--                <div class="item-property-value">-->
            <!--                    <template v-if="data.crowdState == 1"><span style="color:#EEBB4C">加工中</span></template>-->
            <!--                    <template v-if="data.crowdState == 2"><span style="color:#396BF6">有效</span></template>-->
            <!--                    <template v-if="data.crowdState == 3"><span style="color:#E2524B">加工失败</span></template>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
        <div class="crowd-item-footer" v-if="type == 'me'">
            <el-tooltip class="item" effect="dark" v-if="data.crowdState == 2" content="命中查询" placement="bottom">
                <span @click.stop.prevent="checkHit" style="cursor: pointer;"><svg-icon icon-class="icon2"/></span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="data.crowdState != 1" content="创建应用任务" placement="bottom">
                <i><span @click.stop.prevent="toTouch" style="cursor: pointer;"><svg-icon icon-class="icon5"/></span></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="data.crowdState != 1" content="设置" placement="bottom">
                <i class="el-icon-setting" @click.stop.prevent="setCrowd"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="data.crowdState != 1 && data.crowdType != 5" content="编辑" placement="bottom">
                <i class="el-icon-edit" @click.stop.prevent="editCrowd"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="日志" placement="bottom">
                <i class="el-icon-tickets" @click.stop.prevent="showCrowdLog"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="el-icon-delete" @click.stop.prevent="showDelDialogText"></i>
            </el-tooltip>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDelDialog" width="500px">
            <div slot="title" class="dialog-title">删除群体</div>
            <div style="padding: 30px;">确认删除该群体</div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDelDialog = false">取 消</el-button>
                <el-button size="small" type="danger" @click="delCrowd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showCreateNewCrowdDialog" width="600px"
                   :before-close="cancelSetCrowd">
            <div slot="title" class="dialog-title">设置群体</div>
            <div class="el-body" v-if="data">
                <el-form :model="data" :rules="addNewRules" ref="saveCrowd" label-width="100px">
                    <el-form-item label="群体名称" prop="crowdName">
                        <el-input size="small" v-model="data.crowdName" maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="群体负责人" prop="crowdManagerList">
                        <SearchErp :value.sync="data.crowdManagerList" multiple></SearchErp>
                    </el-form-item>
                    <!--                    <el-form-item label="群体数量">-->
                    <!--                        <span class="crowd-num">{{ data.crowdPredNum === null ? '' : data.crowdPredNum.toLocaleString() }}</span>-->
                    <!--                    </el-form-item>-->
                    <el-form-item label="群体描述" prop="crowdDesc">
                        <el-input size="small" type="textarea" :rows="3" maxlength="200" minlength="3"
                                  v-model="data.crowdDesc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelSetCrowd">取 消</el-button>
                <el-button size="small" type="primary" @click="saveCrowd">保 存</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showCheckHitDialog" width="600px">
            <div slot="title" class="dialog-title">命中查询</div>
            <div class="el-body">
                <el-form label-width="130px">
                    <el-form-item label="群体ID" prop="crowdCode">
                        <el-input size="small" disabled v-model="data.crowdCode"></el-input>
                    </el-form-item>
                    <el-form-item label="融合用户唯一id">
                        <el-input size="small" v-model="checkHitSearch" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="返回结果">
                        <span style="color: rgba(255, 0, 0, 0.847058823529412);font-size: 16px;font-weight: 600;">{{checkHitResult}}</span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showCheckHitDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="checkHitRes">确 定</el-button>
            </span>
        </el-dialog>
        <el-drawer
                title="群体日志"
                :visible.sync="showLog"
                :before-close="hideCrowdLog"
                size="80%">
            <div class="drawer-top">
                操作人:
                <el-input style="width: 14%;"
                          v-model="operator"
                          placeholder="请输入用户Id"
                          size="small"
                          clearable>
                </el-input>&nbsp;
                操作类型:
                <el-select v-model="operateType" placeholder="请选择"  style="width: 12%;" size="small" clearable>
                    <el-option
                            v-for="item in operateTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>&nbsp;
                操作日期:
                <el-date-picker
                        v-model="time"
                        style="width: 35%;"
                        size="small"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>&nbsp;&nbsp;
                <el-button type="primary" size="small" @click="showCrowdLog">查询</el-button>
            </div>
            <div class="drawer-body">
                <el-table :data="logList" size="small" style="width: 100%" border>
                    <el-table-column prop="operator" label="操作人"></el-table-column>
                    <el-table-column prop="operateType" label="操作类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.operateType == 'A'">创建</span>
                            <span v-if="scope.row.operateType == 'U'">修改</span>
                            <span v-if="scope.row.operateType == 'D'">删除</span>
                            <span v-if="scope.row.operateName">({{scope.row.operateName}})</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdTime" label="操作时间"></el-table-column>
                </el-table>
            </div>
            <div class="drawer-bottom">
                <el-pagination
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="logListConf.total"
                        :page-size.sync="logListConf.pageSize"
                        :current-page.sync="logListConf.pageNo"
                        :page-sizes="[10, 20, 50, 100]"
                        @size-change="showCrowdLog"
                        @current-change="showCrowdLog"
                >
                </el-pagination>
            </div>
        </el-drawer>
<!--        <el-dialog :close-on-click-modal="false" :visible.sync="showLog" width="1000px">-->
<!--            <div slot="title" class="dialog-title">群体日志</div>-->
<!--            <div class="el-body">-->
<!--                <el-table :data="logList" size="small" style="width: 100%">-->
<!--                    <el-table-column prop="tagName" label="标签名称" min-width="160"></el-table-column>-->
<!--                    <el-table-column prop="tagCode" label="标签编码" min-width="120"></el-table-column>-->

<!--                </el-table>-->
<!--            </div>-->
<!--        </el-dialog>-->
    </div>
</template>

<script lang="ts">
/**
 * @name CrowdItem
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入
import moment from 'moment';

// 静态配置引入

// 公共组件引入
import SearchErp from '@/components/SearchErp.vue';
// import Template from '@/Template.vue';

// 公共类引入

// 私有组件引入

// 私有类引入
import EnumSelect from '@/components/SelectEnumWithComponent.vue';

// 本地定义和声明
interface Crowd {
    id: number;
    crowdName: string;
    crowdCode: string;
    crowdRealNum: number;
    crowdVersion: string;
    crowdType: number;
    crowdUpdateCycle: string;
    subjectId: number;
    crowdState: number;
}

@Component({
    components: {
        SearchErp,
        EnumSelect
    }
})
export default class CrowdItem extends Vue {
    @State(state => state.curSubject)
    curSubject!: any | null;
    @Prop({
        required: true
    })
    private data?: any;

    @Prop() private type!: string;

    @Prop() private pageNo!: any;

    @Prop() private crowdState!: any;

    @Prop() private crowdType!: any;

    @Prop() private keyword!: any;

    @Prop() private crowdShowType!: any;

    @Prop({ default: 0 })
    private dataIdx: number;

    // private newCrowd: any = null;
    private addNewRules: any = {
        crowdName: [{ required: true, message: '请填写群体名称', trigger: 'blur' }],
        crowdDesc: [
            { required: true, message: '请填写群体描述', trigger: 'blur' },
            { min: 3, max: 200, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        crowdManagerList: [{ required: true, message: '请填写群体负责人', trigger: 'blur' }]
    };
    private showCreateNewCrowdDialog: boolean = false;
    private cacheCrowd: any = null;

    private enumList: any = [];
    private logList: any = [];
    private logListConf: any = {
        pageNo: 1,
        pageSize: 10,
        total: 0
    };
    // 操作人
    private operator: string = '';
    // 操作类型
    private operateType: string = '';
    private operateTypeList: any = [
        {
            value: 'A',
            label: '新增'
        },
        {
            value: 'U',
            label: '修改'
        },
        {
            value: 'D',
            label: '删除'
        }
    ];
    // 操作时间
    private time: any = [];

    private showDelDialog: boolean = false;
    private showLog: boolean = false;
    private routerFor: string = 'tag-to-crowd';

    private crowdTypeMap: any = {
        1: '标签圈群',
        2: '文件建群',
        3: '-',
        4: '库表建群',
        5: '二次筛选',
        6: '地址建群'
    };

    private mounted() {
        this.data.crowdManagerList = this.data.crowdManager.split(',');
    }

    private showDelDialogText() {
        this.$confirm('确认删除该群体?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.delCrowd();
        });
    }

    private ribbonColors = ['#4775FE', '#47ADFE', '#56CB80', '#F8BB3E', '#8F6DFF', '#F8894F'];

    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    private showCheckHitDialog: boolean = false;
    private checkHitSearch: string = ''; // 接口命中搜索词
    private checkHitResult: string = ''; // 接口命中返回结果
    private checkHit() {
        this.showCheckHitDialog = true;
    }
    private checkHitRes() {
        // 弹窗命中
        this.$bus.$emit('main-loading', true);
        this.$api
            .post('/api/ava/crowd/isHit', {
                subjectId: this.curSubject.id,
                id: this.checkHitSearch,
                codes: [this.data.crowdCode]
            })
            .then((res: any) => {
                this.$bus.$emit('main-loading', false);
                if (res) {
                    const result: string = res[this.data.crowdCode];
                    const resMap: any = {
                        '1': '命中',
                        '0': '不命中',
                        '-1': '人群不存在/人群未应用到命中服务/人群数量为0',
                        '-2': 'pin不存在',
                        '-7': '无权限'
                    };
                    this.checkHitResult = String(resMap[result] as any);
                }
            })
            .catch(err => {
                this.$bus.$emit('main-loading', false);
                console.log(err);
            });
    }

    private toTouch() {
        const target = {
            name: 'app-touch',
            query: {
                crowdCode: this.data.crowdCode
            }
        };
        this.$router.push(target);
    }

    private goToInfo() {
        if (!this.data || !this.data.crowdCode) {
            return;
        }
        const target = {
            name: 'crowd-info',
            params: {
                crowdCode: this.data.crowdCode,
                pageNo: this.pageNo,
                crowdState: this.crowdState,
                crowdType: this.crowdType,
                keyword: this.keyword,
                crowdShowType: this.crowdShowType
            }
        };
        this.$router.push(target);
    }

    private delCrowd() {
        if (!this.data || !this.data.crowdCode) {
            return;
        }
        this.del(this.data.crowdCode).then(() => {
            this.$message.success('删除成功');
            this.$bus.$emit('CrowdDelete');
        });
    }

    private editCrowd() {
        if (!this.data) {
            return;
        }
        // const crowdCode: string = this.data.crowdCode;
        // const crowdType: number = this.data.crowdType;
        //
        // switch (crowdType) {
        //     case 2:
        //         this.routerFor = 'file-to-crowd';
        //         break;
        //     case 4:
        //         this.routerFor = 'db-to-crowd';
        //         break;
        //     default:
        //         this.routerFor = 'tag-to-crowd';
        // }
        // this.$router.push({
        //     name: this.routerFor,
        //     query: {
        //         code: crowdCode
        //     }
        // });
        this.$bus.$emit('editCrowd', this.data);
    }

    private copyCrowdCode(str: string) {
        this.$copyText(str).then(() => {
            this.$notify({
                title: '复制成功',
                message: '',
                type: 'success'
            });
        });
    }

    private setCrowd() {
        this.cacheCrowd = JSON.parse(JSON.stringify(this.data));
        this.data.crowdManagerList = this.data.crowdManager.split(',');
        this.showCreateNewCrowdDialog = true;
    }

    private saveCrowd() {
        (this.$refs.saveCrowd as any).validate((valid: boolean) => {
            if (valid) {
                this.data.crowdManager = this.data.crowdManagerList.join(',');
                this.crowdUpdateTag(this.data).then(() => {
                    this.$bus.$emit('CrowdDelete');
                    this.showCreateNewCrowdDialog = false;
                    this.$message.success('更新成功');
                });
            }
        });
    }

    private cancelSetCrowd() {
        // console.log('cancel');
        Object.assign(this.data, this.cacheCrowd);
        this.cacheCrowd = null;
        this.showCreateNewCrowdDialog = false;
    }

    private hideCrowdLog() {
        this.operator = '';
        this.operateType = '';
        this.time = [];
        this.logListConf = {
            pageNo: 1,
            pageSize: 10,
            total: 0
        };
        this.showLog = false;
    }

    private showCrowdLog() {
        // /ava/log/selectPage
        const data: any = {
            objId: this.data.crowdCode,
            operator: this.operator,
            operateType: this.operateType
        };
        if (this.time && this.time.length > 1) {
            Object.assign(data, {
                startTime: this.time[0],
                endTime: this.time[1]
            });
        }
        Object.assign(data, this.logListConf);
        this.$bus.$emit('main-loading', true);
        this.$api
            .post('/api/ava/log/selectPage', data)
            .then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.showLog = true;
                this.logList = res.list;
                this.logListConf.total = res.total;
                this.logListConf.pageSize = res.pageSize;
                this.logListConf.pageNo = res.pageNum;
            })
            .catch(err => {
                this.$bus.$emit('main-loading', false);
                console.log(err);
            });
    }

    // ========== ajax request  ==========

    private del(crowdCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/del';
            const data: object = {
                crowdCode: crowdCode
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

    private crowdUpdateTag(newCrowd: any) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/update/tag';
            const data = newCrowd;
            Object.assign(data, newCrowd);

            delete data.createdTime;
            delete data.modifiedTime;
            delete data.valid;
            delete data.crowdDefine;
            delete data.crowdDefineDesc;

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
}
</script>
<style lang="scss" scoped>
.drawer-top {
    position: absolute;
    top: 70px;
    left: 20px;
    right: 20px;
    height: 50px;
}
.drawer-body {
    padding: 0 20px;
    overflow: auto;
    position: absolute;
    top: 130px;
    left: 0;
    right: 0;
    bottom: 50px;
}
.drawer-bottom {
    padding: 0 20px;
    overflow: auto;
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 0;
    text-align: right;
    height: 50px;
}
.crowd-item {
    position: relative;
    height: 194px;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    /*box-shadow: 0px 2px 6px 0px rgba(189, 189, 189, 0.5);*/
    // box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.6);
    margin-bottom: 20px;
    box-shadow: 0 0 8px 0 rgba(142, 148, 156, 0.1);

    cursor: default;

    .spacer {
        flex: 1 1 auto;
    }
    &-header {
        width: 100%;
        height: 100px;
        /*background: rgba(230, 237, 255, 1);*/
        /*border-radius: 6px 6px 0px 0px;*/
        padding: {
            left: 20px;
            right: 20px;
            top: 20px;
        }

        /*display: flex;*/
        /*align-items: center;*/

        font-size: 1rem;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);

        cursor: pointer;

        .crowd-name {
            font-size: 1rem;
            height: 30px;
            line-height: 40px;
            color: #666666;
            position: relative;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 80%;

            .ribbon {
                /*width: 100%;*/
                width: 50px;
                height: 3px;
                border-radius: 2px;
                background-color: #4775fe;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .crowd-num {
            height: 40px;
            line-height: 40px;
            font-size: 1.57rem;
            color: #333333;
            font-weight: bold;
        }

        .crowd-state {
            width: auto;
            position: absolute;
            right: 20px;
            top: 20px;
            height: 30px;
            line-height: 40px;
            font-size: 12px;

            .circle {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 5px;
                position: relative;
                top: -2px;
            }

            &.a {
                color: #eebb4c;
                .circle {
                    background-color: #eebb4c;
                }
            }

            &.b {
                color: #396bf6;
                .circle {
                    background-color: #396bf6;
                }
            }

            &.c {
                color: #e2524b;
                .circle {
                    background-color: #e2524b;
                }
            }
        }
    }

    &-body {
        width: 100%;
        /*height: calc(100% - 50px - 32px);*/
        height: 80px;
        padding: {
            left: 20px;
            right: 20px;
        }
        display: flex;
        flex-direction: column;

        .copyBtn {
            line-height: 20px;
            cursor: pointer;
        }

        .item-property {
            width: 100%;
            height: 20px;
            margin-bottom: 6px;
            display: flex;
            font-size: 0.75rem;
            color: #888888;

            .circle {
                width: 5px;
                height: 5px;
                background-color: #d9e0e5;
                border-radius: 50%;
                display: inline-block;
                margin-right: 10px;
                margin-top: 7.5px;
            }

            &-label {
                width: auto;
                /*margin-right: 10px;*/
                /*text-align: right;*/
            }

            &-value {
                flex: 1 1 auto;
            }
        }
    }

    &-footer {
        width: 100%;
        height: 32px;
        position: relative;
        top: -20px;
        padding: {
            left: 20px;
            right: 20px;
        }
        display: flex;
        justify-content: flex-end;
        align-items: center;

        i {
            margin-left: 20px;
            cursor: pointer;
        }
    }
}
</style>
