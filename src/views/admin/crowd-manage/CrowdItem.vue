<template>
    <div class="crowd-item">
        <div class="crowd-item-header" @click="goToInfo">
            <div>{{ data.crowdName }}</div>
            <div class="spacer"></div>
            <div v-if="data.crowdState == 2">{{ data.crowdRealNum ? data.crowdRealNum.toLocaleString() : 0 }}</div>
        </div>
        <div class="crowd-item-body" @click="goToInfo">
            <div class="item-property">
                <div class="item-property-label">群体ID</div>
                <div class="item-property-value">{{ data.crowdCode }}</div>
                <i title="复制" class="el-icon-document-copy copyBtn" @click.stop="copyCrowdCode(data.crowdCode)"></i>
            </div>
            <div class="item-property">
                <div class="item-property-label">创建方式</div>
                <div class="item-property-value">
                    {{ crowdTypeMap[data.crowdType] ? crowdTypeMap[data.crowdType] : '' }}
                </div>
            </div>
            <!-- <div class="item-property">
        <div class="item-property-label">更新策略</div>
        <div class="item-property-value">
          <template v-if="data.crowdUpdateCycle == 1">
            可更新
          </template>
          <template v-else-if="data.crowdUpdateCycle == 2">
            不更新
          </template>
        </div>
      </div> -->
            <div class="item-property">
                <div class="item-property-label">更新日期</div>
                <div class="item-property-value">
                    {{ data.crowdDataDt ? formatDate(data.crowdDataDt,'YYYY-MM-DD') : '-' }}
                </div>
            </div>
            <div class="item-property">
                <div class="item-property-label">群体状态</div>
                <div class="item-property-value">
                    <template v-if="data.crowdState == 1"><span style="color:#EEBB4C">加工中</span></template>
                    <template v-else-if="data.crowdState == 2"><span style="color:#396BF6">有效</span> </template>
                    <template v-else><span style="color:#E2524B">加工失败</span> </template>
                </div>
            </div>
        </div>
        <div class="crowd-item-footer">
            <i class="el-icon-setting" v-if="data.crowdState != 1" style="color:#396BF6" @click="editCrowd"></i>
            <i class="el-icon-delete" @click="showDelDialog = true"></i>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDelDialog" width="500px">
            <div slot="title" class="dialog-title">删除群体</div>
            <div style="padding: 30px;">确认删除该群体</div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDelDialog = false">取 消</el-button>
                <el-button size="small" type="danger" @click="delCrowd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="editDialog" width="500px">
            <div slot="title" class="dialog-title">群体设置</div>
            <el-form :model="setParams" status-icon :rules="setRules" ref="setForm" label-width="100px" class="demo-ruleForm" style="padding: 30px;">
                <el-form-item label="群体名称" prop="crowdName">
                    <el-input class="com-input" type="text" v-model="setParams.crowdName" placeholder="请输入群体名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="群体负责人" prop="crowdManagerList">
                    <el-select
                        class="com-select noSuffix"
                        style="width:100%"
                        v-model="setParams.crowdManagerList"
                        filterable
                        remote
                        multiple
                        reserve-keyword
                        allow-create
                        default-first-option
                        placeholder="请输入用户Id查询"
                        :remote-method="searchErp"
                        :loading="erpLoading"
                    >
                        <el-option v-for="item in erpOptions" :key="item.value" :label="`${item.displayName}(${item.erpName})`" :value="item.erpName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="群体数量">
                    <div class="setRealNum">{{ setParams.crowdRealNum > 0 ? setParams.crowdRealNum.toLocaleString() : 0 }}</div>
                </el-form-item>
                <el-form-item label="群体描述" prop="crowdDesc">
                    <el-input
                        class="com-input"
                        type="textarea"
                        placeholder="请输入群体描述"
                        :rows="5"
                        :resize="'none'"
                        v-model="setParams.crowdDesc"
                        maxlength="200"
                        clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="submitForm('setForm')">提交</el-button>
<!--                    <el-button size="mini" @click="resetForm('setForm')">取消</el-button>-->
                </el-form-item>
            </el-form>
        </el-dialog>
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

// mixin引入

// 第三方库引入
import moment from 'moment';

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

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
    crowdDesc: string;
    crowdManager: string;
    crowdManagerList: any;
}

@Component({
    components: {}
})
export default class CrowdItem extends Vue {
    @Prop({
        required: true
    })
    private data?: Crowd;

    private showDelDialog: boolean = false;
    private routerFor: string = 'tag-to-crowd';

    private crowdTypeMap: any = {
        1: '标签建群',
        2: '文件建群',
        3: '-',
        4: '库表建群',
        5: '二次筛选',
        6: '地址建群'
    };

    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    private goToInfo() {
        if (!this.data || !this.data.crowdCode) {
            return;
        }
        const target = {
            name: 'admin/crowd-info',
            params: {
                crowdCode: this.data.crowdCode
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

    private editDialog: boolean = false;
    private setParams: any = {
        crowdCode: '',
        crowdDesc: '',
        crowdManager: '',
        crowdManagerList: [],
        crowdName: '',
        crowdRealNum: 0
    };
    private setRules: any = {
        crowdName: [{ required: true, message: '请填写群体名称', trigger: 'blur' }],
        crowdManagerList: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        crowdDesc: [{ required: true, message: '请填写群体描述', trigger: 'blur' }]
    };
    private editCrowd() {
        if (!this.data) {
            return;
        }
        const { crowdCode, crowdDesc, crowdManager, crowdName, crowdRealNum } = this.data;
        this.setParams = {
            crowdCode,
            crowdDesc,
            crowdManager,
            crowdManagerList:crowdManager.split(","),
            crowdName,
            crowdRealNum: crowdRealNum ? crowdRealNum : 0
        };
        this.editDialog = true;
    }
    private submitForm(formName: string = 'setForm') {
        (this.$refs[formName] as any).validate((valid: any) => {
            if (valid) {
                this.setParams.crowdManager = this.setParams.crowdManagerList.join(",");
                this.$api.post('/api/ava/crowd/set', this.setParams).then((res: any) => {
                    this.editDialog = false;
                    this.$bus.$emit('CrowdDelete');
                });
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }
    private resetForm(formName: string = 'setForm') {
        (this.$refs[formName] as any).resetFields();
        this.editDialog = false;
    }

    private erpOptions: any[] = [];

    private erpLoading: boolean = false;

    private searchErp(str: string = '') {
        this.erpLoading = true;
        if (str !== '') {
            this.$api.get('/api/admin/token/getErpUser', { keyword: str }).then((res: any) => {
                this.erpOptions = res.filter((item: any) => {
                    return item.erpName !== '';
                });
                this.erpLoading = false;
            });
        }
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
}
</script>
<style lang="scss" scoped>
.setRealNum {
    padding: {
        left: 15px;
    }
    color: #396bf6;
    font-size: 20px;
}
.copyBtn {
    line-height: 20px;
    cursor: pointer;
}
/deep/ .noSuffix {
    .el-input__suffix {
        display: none;
    }
}
.crowd-item {
    position: relative;
    height: 194px;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    /*box-shadow: 0px 2px 6px 0px rgba(189, 189, 189, 0.5);*/
    // box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.6);
    margin-bottom: 20px;

    cursor: default;

    .spacer {
        flex: 1 1 auto;
    }
    &-header {
        width: 100%;
        height: 50px;
        border-radius: 4px 4px 0px 0px;
        padding: {
            left: 20px;
            right: 20px;
        }

        display: flex;
        align-items: center;

        font-size: 1rem;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);

        cursor: pointer;
    }
    &-body {
        width: 100%;
        height: calc(100% - 50px - 32px);
        padding:0 20px;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        .item-property {
            width: 100%;
            height: 20px;
            margin-bottom: 15px;
            display: flex;
            font-size: 0.75rem;
            color: rgba(51, 51, 51, 1);
            &-label {
                width: 50px;
                margin-right: 10px;
                text-align: right;
            }
            &-value {
                flex: 1 1 auto;
            }
        }
    }
    &-footer {
        width: 100%;
        height: 32px;
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
