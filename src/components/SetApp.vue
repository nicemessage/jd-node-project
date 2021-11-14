<template>
    <section class="set-crowd-app">
        <div class="app-top">
            <span class="label">应用系统</span>
            <el-select
                class="com-select app-select"
                placeholder="请选择/输入关键字搜索"
                filterable
                v-model="appSystem"
                value-key="token"
                remote
                :remote-method="searchToken"
                clearable
            >
                <el-option v-for="(item, index) in appSystemList" :key="index" :label="item.systemName" :value="item"> </el-option>
                <div class="page-section" v-if="tokenTotal > tokenParams.pageSize">
                    <el-pagination
                        background
                        layout="prev,pager,next"
                        :page-size="tokenParams.pageSize"
                        :total="tokenTotal"
                        :current-page.sync="tokenParams.pageNum"
                        @current-change="getProjectList"
                    >
                    </el-pagination>
                </div>
            </el-select>
            <el-button type="primary" class="com-button" @click="addSystem">添加</el-button>
        </div>
        <el-tabs v-model="activeName" type="card" closable class="tab-wapper" @tab-remove="removeApp" v-if="appList.length > 0">
            <el-tab-pane :label="item.systemName" :name="appIndex + ''" v-for="(item, appIndex) in appList" :key="appIndex">
                <div class="app-content">
                    <span class="label">调用类型：</span>
                    <el-radio-group v-model="appList[appIndex].appType">
                        <el-radio :label="item.type" v-for="(item, index) in appTypeList" :key="index">{{ item.name }}</el-radio>
                    </el-radio-group>
                    <p class="msg">请仔细确认调用的类型，一旦创建后不可修改</p>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="empty-data" v-if="appList.length == 0 && !loadingSate">快来添加应用吧~</div>
        <div class="footer-btn" v-if="appList.length > 0">
            <el-button class="com-button" type="primary" @click="save">保存</el-button>
<!--            <el-button class="com-button" @click="cancel">取消</el-button>-->
        </div>
    </section>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
@Component({
    computed: mapGetters(['loadingSate'])
})
export default class CrowdList extends Vue {
    @Prop({ type: Object }) private appInfo?: any;
    private appSystem: any = {};
    private activeName: string | number = '0';
    private timer: any = undefined;
    private tokenParams: any = {
        pageNum: 1,
        pageSize: 10,
        systemName: ''
    };
    private appSystemList: any[] = [];
    private tokenTotal: number = 0;
    private appList: any[] = [];
    private appTypeList: any[] = [
        {
            type: 2,
            name: '群体明细下载'
        },
        {
            type: 1,
            name: '判断是否命中群体'
        }
    ];
    @Watch('appInfo', { immediate: true, deep: true })
    private async handler(val: any): Promise<void> {
        if (!val.crowdCode) {
            return;
        }
        this.appList = [];
        this.activeName = val.index || '0';
        this.$store.commit('changeLoadingStatus', true);
        if (this.appSystemList.length == 0) {
            await this.getProjectList();
        }
        if (val.list) {
            this.appList = JSON.parse(JSON.stringify(val.list));
        } else {
            await this.getAppList();
        }
        this.$store.commit('changeLoadingStatus', false);
    }
    private getAppList() {
        return new Promise((resolve: any, reject: any) => {
            const params: any = {
                crowdCode: this.appInfo.crowdCode
            };
            this.$api
                .get('/api/business/app/getList', params)
                .then((res: any) => {
                    this.appList = res;
                    resolve();
                })
                .catch(() => {
                    this.$message.error('获取应用失败');
                    reject();
                });
        });
    }
    private getProjectList() {
        return new Promise((resolve, reject) => {
            this.$api
                .get('/api/business/token/getRelatedTokenList', this.tokenParams)
                .then((res: any) => {
                    const data: any[] = [];
                    res.forEach((item: any) => {
                        const json = {
                            systemName: item.systemName,
                            token: item.token
                        };
                        data.push(json);
                    });
                    this.appSystemList = data;
                    resolve();
                })
                .catch(() => {
                    this.$message.error('获取数据失败');
                    reject();
                });
        });
    }
    private searchToken(val: any): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.$set(this.tokenParams, 'systemName', val);
            this.$set(this.tokenParams, 'pageNum', 1);
            this.getProjectList();
        }, 500);
    }
    // 添加应用
    private addSystem() {
        if (Object.keys(this.appSystem).length == 0) {
            this.$message('请选择应用系统');
            return;
        }
        const index = this.appList.findIndex((d: any) => d.token == this.appSystem.token);
        if (index > -1) {
            this.$message('该系统已存在');
        } else {
            const data = JSON.parse(JSON.stringify(this.appSystem));
            this.$set(data, 'appType', 1);
            this.appList.push(data);
            this.activeName = (this.appList.length - 1).toString();
        }
        this.$nextTick(() => {
            this.appSystem = {};
        });
    }
    private removeApp(active: string | number) {
        if (this.appList[Number(active)].id || this.appList[Number(active)].id === 0) {
            this.$confirm('是否删除该应用?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            })
                .then(() => {
                    this.$store.commit('changeLoadingStatus', true);
                    const params: any = {
                        id: this.appList[Number(active)].id,
                        appType: this.appList[Number(active)].appType,
                        crowdCode: this.appInfo.crowdCode
                    };
                    this.$api
                        .get('/api/business/app/del', params)
                        .then(() => {
                            this.appList.splice(Number(active), 1);
                            if (active <= this.activeName) {
                                if (active != 0 || this.activeName != 0) {
                                    this.activeName = (Number(this.activeName) - 1).toString();
                                }
                            }
                            this.$message.success('删除成功');
                        })
                        .catch(() => {
                            this.$message.error('删除失败');
                        })
                        .finally(() => {
                            this.$store.commit('changeLoadingStatus', false);
                        });
                })
                .catch(() => {
                    return;
                });
        } else {
            this.appList.splice(Number(active), 1);
            if (active <= this.activeName) {
                if (active != 0 || this.activeName != 0) {
                    this.activeName = (Number(this.activeName) - 1).toString();
                }
            }
        }
    }
    private save() {
        if (!this.appList[Number(this.activeName)]) {
            return;
        }
        const params = {
            crowdCode: this.appInfo.crowdCode,
            crowdRealNum: this.appInfo.crowdRealNum,
            crowdVersion: this.appInfo.crowdVersion,
            token: this.appList[Number(this.activeName)].token,
            appType: this.appList[Number(this.activeName)].appType
        };
        if (this.appList[Number(this.activeName)].id || this.appList[Number(this.activeName)].id === 0) {
            this.$message(`${this.appList[Number(this.activeName)].systemName}已存在`);
            return;
        } else {
            this.$store.commit('changeLoadingStatus', true);
            this.$api
                .post('/api/business/app/add', params)
                .then((res: any) => {
                    if (res) {
                        this.$message({
                            type: 'success',
                            message: `${this.appList[Number(this.activeName)].systemName}创建成功`,
                            duration: 1000,
                            onClose: () => {
                                this.$emit('close');
                            }
                        });
                    }
                })
                .finally(() => {
                    this.$store.commit('changeLoadingStatus', false);
                });
        }
    }
    private cancel() {
        this.$emit('close');
    }
}
</script>
<style lang="scss" scoped>
.set-crowd-app {
    padding: 30px 0 10px;
}
.app-top {
    @include align-center;
    margin-bottom: 20px;
    .app-select {
        margin: 0 10px;
        width: 50%;
    }
}
.label {
    white-space: nowrap;
    font-size: 14px;
}
.tab-wapper {
    margin-bottom: 50px;
}
.app-content {
    display: flex;
    align-items: baseline;
    padding-top: 20px;
    .label {
        margin-right: 20px;
    }
    .msg {
        font-size: 12px;
        color: #888;
        white-space: nowrap;
        margin-left: 20px;
        position: relative;
        top: -1px;
    }
}
.empty-data {
    margin: 20px 0;
    height: 140px;
    background: url(../assets/img/data-empty.png) center top no-repeat;
    background-size: auto;
    font-size: 12px;
    color: #999;
    text-align: center;
    padding-top: 130px;
}
.footer-btn {
    display: flex;
    justify-content: center;
}
</style>
