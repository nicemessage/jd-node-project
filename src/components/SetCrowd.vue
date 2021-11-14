<template>
    <section class="set-crowd">
        <el-form :model="crowdInfo" :rules="rules" label-width="110px" class="com-form" ref="form">
            <el-form-item label="群体名称" prop="crowdName">
                <el-input class="com-input crowd-width" placeholder="请输入" v-model="crowdInfo.crowdName" maxlength="50" clearable></el-input>
            </el-form-item>
            <el-form-item label="群体描述" prop="crowdDesc">
                <el-input
                    class="com-input crowd-width"
                    type="textarea"
                    placeholder="请输入"
                    :rows="5"
                    :resize="'none'"
                    v-model="crowdInfo.crowdDesc"
                    maxlength="200"
                    clearable
                >
                </el-input>
            </el-form-item>
            <el-form-item label="群体负责人" prop="adminUser">
                <select-user :crowdInfo="crowdInfo" @checkAdmin="checkAdmin"></select-user>
            </el-form-item>
            <el-form-item label="生成群体类型" prop="crowdIdType" v-if="crowdInfo.crowdDataList && crowdInfo.crowdDataList.length > 0">
                <div class="type-choose">
                    <el-checkbox-group v-model="crowdInfo.crowdIdType" :disabled="routerName == 'crowd-edit' ? false : true">
                        <el-checkbox :label="item.typeId" v-for="(item, index) in crowdInfo.crowdDataList" :key="index">{{
                            item.typeName
                        }}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="type-msg" v-if="routerName == 'crowd-edit'">
                    <strong v-if="crowdInfo.crowdOrigNum">
                        当前群体数量共计
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            :content="crowdInfo.crowdOrigNum | kilbit"
                            v-if="crowdInfo.crowdOrigNum.length > 6"
                        >
                            <span slot="reference">{{ crowdInfo.crowdOrigNum.substring(0, 6) | kilbit }}...</span>
                        </el-popover>
                        <span v-else>{{ crowdInfo.crowdOrigNum | kilbit }}</span
                        >个
                    </strong>
                    <strong v-for="(item, index) in crowdInfo.crowdDataList" :key="index">
                        ，{{ item.typeName }}群体
                        <el-popover placement="top-start" trigger="hover" :content="item.num | kilbit" v-if="item.num.length > 6">
                            <span slot="reference">{{ item.num.substring(0, 6) | kilbit }}...</span>
                        </el-popover>
                        <span v-else>{{ item.num | kilbit }}</span>
                        个
                    </strong>
                </div>
            </el-form-item>
            <el-form-item label="群体更新" prop="crowdUpdateCycle" v-if="crowdInfo.crowdType != 2">
                <div class="update-choose">
                    <el-switch v-model="crowdInfo.crowdUpdateCycle"></el-switch>
                </div>
            </el-form-item>
            <el-form-item label="群体有效期" prop="crowdEndTime">
                <div class="date-choose">
                    <el-date-picker class="com-date" v-model="crowdInfo.crowdEndTime" type="date" placeholder="选择日期" :picker-options="dateLimit">
                    </el-date-picker>
                    <p class="msg">有效期最多30天，如需长期使用，需邮件申请</p>
                </div>
            </el-form-item>
        </el-form>
        <div class="footer">
<!--            <el-button class="com-button" @click="cancel">取消</el-button>-->
            <el-button class="com-button" type="primary" @click="saveCrowd">保存</el-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import SelectUser from '@/components/SelectUser.vue';
@Component({
    components: {
        SelectUser
    }
})
export default class SetCrowd extends Vue {
    @Prop({ type: Object }) private crowdData?: any;
    private routerName: string = '';
    private crowdInfo: any = {
        crowdDataList: [],
        crowdIdType: [],
        tagCodes: [],
        crowdName: '',
        crowdDesc: '',
        adminUser: '',
        crowdUpdateCycle: false,
        crowdEndTime: '',
        crowdType: 1,
        crowdDatasourceType: 12,
        type: 0,
        crowdSourceToken: '159f4c1ca7f8e90082cf110aba613cef'
    };
    private dateLimit: any = {
        disabledDate(time: any) {
            const curDate = new Date().getTime();
            const oneMouth = 30 * 24 * 3600 * 1000;
            const oneMouths = curDate + oneMouth;
            return time.getTime() < Date.now() || time.getTime() > oneMouths;
        }
    }; //时间限制
    private rules: any = {
        crowdName: [{ required: true, message: '请输入群体名称', trigger: 'blur' }],
        crowdDesc: [{ required: true, message: '请输入群体描述', trigger: 'blur' }],
        crowdManagerList: [{ required: true, message: '请输入群体负责人', trigger: 'blur' }],
        crowdIdType: [{ required: true, message: '请选择群体类型', trigger: 'blur' }],
        crowdUpdateCycle: [{ required: true, message: '请选择群体更新', trigger: 'change' }],
        crowdEndTime: [{ required: true, message: '请输入群体有效期', trigger: 'blur' }]
    };
    private loading: boolean = false;
    private userList: any[] = [];
    @Watch('crowdData', { immediate: true, deep: true })
    private handler(val: any): void {
        if (!val) {
            return;
        }
        if (this.$refs.form) {
            (this.$refs.form as any).clearValidate();
        }
        this.routerName = this.$route.name as string;
        this.crowdInfo = Object.assign(this.crowdInfo, val);
        this.crowdInfo.crowdUpdateCycle = this.crowdInfo.crowdUpdateCycle == 'D' ? true : false;
        const name = `${this.$store.state.userInfo.organizationFullName}-${this.$store.state.userInfo.realName}`;
        if (this.crowdInfo.adminUser) {
            if (typeof this.crowdInfo.adminUser === 'string') {
                this.crowdInfo.adminUser = this.crowdInfo.adminUser.split(',');
            } else {
                if (this.crowdInfo.adminUser.length == 0 && !this.crowdInfo.crowdCode) {
                    this.crowdInfo.adminUser.push(name);
                }
            }
        } else {
            this.crowdInfo.adminUser = name.split(',');
        }
        if (this.crowdInfo.crowdIdType && typeof this.crowdInfo.crowdIdType === 'string') {
            this.crowdInfo.crowdIdType = this.crowdInfo.crowdIdType.split(',');
        } else {
            this.crowdInfo.crowdIdType = [];
        }
        if (this.crowdInfo.crowdEndTime) {
            if (new Date(this.crowdInfo.crowdEndTime).getTime() < new Date().getTime()) {
                this.crowdInfo.crowdEndTime = '';
            }
        }
        this.$set(this.crowdInfo, 'familyId', this.$store.state.userInfo.role == 'card' ? 4 : 3);
    }
    private saveCrowd(): void {
        (this.$refs.form as any).validate((item: any) => {

            if (item) {
                this.$store.commit('changeLoadingStatus', true);
                const params = JSON.parse(JSON.stringify(this.crowdInfo));
                if (params.crowdDefine) {
                    const ex = JSON.parse(params.crowdDefine);
                    this.$set(ex.groupBy.groupByCol, 'colVals', JSON.parse(JSON.stringify(params.crowdIdType)));
                    this.$set(params, 'crowdDefine', JSON.stringify(ex));
                }
                if (params.crowdUpdateCycle) {
                    params.crowdUpdateCycle = 'D';
                } else {
                    params.crowdUpdateCycle = 'N';
                }
                console.log(params);
                if (params.crowdDataList && params.crowdDataList.length > 0) {
                    params.crowdIdType = params.crowdIdType.join(',');
                    delete params.crowdDataList;
                }
                const name = `${this.$store.state.userInfo.organizationFullName}-${this.$store.state.userInfo.realName}`;
                const index = params.adminUser.indexOf(name);
                if (index > -1) {
                    params.adminUser.splice(params.adminUser[index], 1, window.sessionStorage.getItem("userErp"));
                }
                if (params.tagCodes.length == 0) {
                    delete params.tagCodes;
                }
                params.adminUser = params.adminUser.join(',');
                params.crowdName = params.crowdName.trim();
                params.crowdDesc = params.crowdDesc.trim();
                params.crowdManager = params.crowdManagerList.split(",");
                console.log(params);
                if (!params.crowdCode) {
                    delete params.crowdCode;
                    this.addCrowd(params);
                } else {
                    this.updateCrowd(params);
                }
            }
        });
    }
    private addCrowd(params: any): void {
        this.$api
            .post('/api/business/crowd/add', params)
            .then(() => {
                this.$message({
                    type: 'success',
                    message: '保存群体成功',
                    duration: 1000,
                    onClose: () => {
                        this.$emit('init');
                    }
                });
            })
            .finally(() => {
                this.$store.commit('changeLoadingStatus', false);
            });
    }
    private updateCrowd(params: any): void {
        if (this.routerName == 'crowd-edit') {
            params.type = 1;
        } else {
            params.type = 0;
        }
        this.$api
            .post('/api/business/crowd/update', params)
            .then(() => {
                this.$message({
                    type: 'success',
                    message: '更新群体成功',
                    duration: 1000,
                    onClose: () => {
                        this.$emit('init');
                    }
                });
            })
            .finally(() => {
                this.$store.commit('changeLoadingStatus', false);
            });
    }
    private remoteMethod(query: string): void {
        if (query !== '') {
            this.loading = true;
            setTimeout(() => {
                const params: any = {
                    keyWord: query
                };
                this.$api
                    .get('/api/business/tool/erpFuzzyQuery', params)
                    .then((res: any) => {
                        this.userList = res;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }, 200);
        } else {
            this.userList = [];
        }
    }
    private checkAdmin() {
        if (this.crowdInfo.adminUser[this.crowdInfo.adminUser.length - 1] === window.sessionStorage.getItem("userErp")) {
            const name = `${this.$store.state.userInfo.organizationFullName}-${this.$store.state.userInfo.realName}`;
            const index = this.crowdInfo.adminUser.indexOf(name);
            if (index > -1) {
                this.crowdInfo.adminUser.splice(this.crowdInfo.adminUser.length - 1, 1);
                this.crowdInfo.adminUser.splice(index, 1, window.sessionStorage.getItem("userErp"));
            }
        }
        const form = this.$refs.form as any;
        form.validateField('adminUser');
    }
    private cancel(): void {
        this.$emit('close');
    }
}
</script>

<style scoped lang="scss">
.crowd-width {
    width: 320px;
}
.type-choose {
    display: flex;
    white-space: nowrap;
    align-items: baseline;
}
.update-choose,
.date-choose {
    display: flex;
    align-items: center;
}
.type-msg {
    display: flex;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    white-space: nowrap;
    strong {
        font-weight: 500;
        display: flex;
    }
}
.msg {
    display: flex;
    margin-left: 16px;
    font-size: 14px;
    color: #ccc;
    white-space: nowrap;
}
.footer {
    padding-top: 20px;
    display: flex;
    justify-content: center;
}
</style>
