<template>
    <div class="db-crowd-info">
        <el-form :model="CrowdCustomVO">
            <div class="pargraph">
                <div class="title">
                    <div class="text"><span class="line"></span><span>数据源信息</span></div>
                    <div>
                        <db-info ref="dbInfo"></db-info>
                    </div>
                </div>

                <div class="title">
                    <div class="text"><span class="line"></span><span>群体信息</span></div>
                    <div>
                        <crowd-info ref="crowdInfo"></crowd-info>
                        <!--              <crowd-info ref="crowdInfo" @corwdInfo="corwdInfo"></crowd-info>-->
                    </div>
                </div>

<!--                <div class="footer">-->
<!--                    <el-button v-if="code" @click="cancel">取消</el-button>-->
<!--                    <el-button type="primary" @click="saveCrowd">保存</el-button>-->
<!--                </div>-->
            </div>
        </el-form>
    </div>
</template>

<script lang="ts">
/**
 * @name DbCrowdInfo
 * @author shileilei3
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import {Component, Prop, Vue} from 'vue-property-decorator';
import { State } from 'vuex-class';
// 私有类引入
import DbInfo from './DbInfo.vue';
import CrowdInfo from './CrowdInfo.vue';

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
    components: {
        DbInfo,
        CrowdInfo
    }
})
export default class DbCrowdInfo extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;

    private code : string = '';

    private CrowdCustomVO: any = {};

    @Prop()
    private crowdData!: string;

    @Prop() private crowdNum!: number; // 群体数量

    // private mounted() {
    //     this.init('');
    // }

    private init(code: string) {
        this.code = code;
        if(this.code){
            this.$bus.$emit('main-loading', true);
            this.$api.
            get('/api/ava/crowd/detail', {"crowdCode":this.code}).
            then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.CrowdCustomVO = res;
                this.resetForm();
                (this.$refs['crowdInfo'] as any).init(this.CrowdCustomVO);
            });
        }else{
            this.resetForm();
        }
    }

    private resetForm(){
        (this.$refs['crowdInfo'] as any).$refs.form.resetFields();
        (this.$refs['dbInfo'] as any).$refs.form.resetFields();
        (this.$refs['dbInfo'] as any).init(this.CrowdCustomVO.crowdDefineDesc);
    }

    // 计算群体数量 
    private calcCrowdNum() {
        // 直接更新到crowdNum就可以了
        const dbParam = (this.$refs['dbInfo'] as any).getDbInfo();
        if (dbParam) {
            const str = JSON.stringify(dbParam);
            this.$emit('update:crowdNum', -1);
            this.$bus.$emit('main-loading', true);
            const url = '/api/ava/crowd/number';
            this.$api
                .post(url, {
                    crowdType: 4,
                    expression: str
                })
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    this.$emit('update:crowdNum', res);
                })
                .catch(err => {
                    this.$bus.$emit('main-loading', false);
                });
        }
    }

    private saveCrowd() {
        const crowdParam = (this.$refs['crowdInfo'] as any).getCrowdInfo();
        const dbParam = (this.$refs['dbInfo'] as any).getDbInfo();
        if (dbParam && crowdParam) {
            console.log(crowdParam);
            this.CrowdCustomVO.sourceVO = dbParam;
            const str = JSON.stringify(dbParam);
            crowdParam.crowdManager = crowdParam.crowdManagerList.join(",");
            crowdParam.adminUser = crowdParam.crowdManagerList.join(",");
            Object.assign(this.CrowdCustomVO, crowdParam);
            this.CrowdCustomVO.crowdDefineDesc = str;
            this.CrowdCustomVO.crowdType = 4;
            this.CrowdCustomVO.subjectId = this.curSubject?.id;
            this.CrowdCustomVO.crowdDsType = dbParam.dsCol;
            if(this.code){
                this.CrowdCustomVO.crowdCode = this.code;
            }
            this.$bus.$emit('main-loading',true);
            this.$api.post('/api/ava/crowd/addOrUpdate/customer', this.CrowdCustomVO).then((res: any) => {
                this.$bus.$emit('main-loading',false);
                console.log(res);
                // this.goToList();
                this.$message({
                    type: 'success',
                    message: '群体保存成功！预计加工时间30min-2h，有效后才能在“群体应用”中选择到该群体~'
                });
                this.$bus.$emit('HideToCrowd',true);
            }).catch(() => {
                // this.$message('群体保存失败！请联系用户画像进行处理~');
                this.$bus.$emit('main-loading',false);
            });
        }
    }

    private cancel() {
        this.goToList();
    }

    private goToList() {
        this.$router.push({
            path: '/crowd-manage'
        });
    }
}
</script>
<style lang="scss" scoped>
.db-crowd-info {
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff;
    padding: 30px;

    .pargraph {
        padding-bottom: 20px;
    }
    .pargraph > .title {
        height: 100%;
        line-height: 22px;
        font-size: 14px;
        color: rgba(0, 0, 0, 1);
    }
    .pargraph .title .text {
        display: flex;
        align-items: center;
    }
    .line {
        width: 3px;
        height: 14px;
        background: #396bf6;
        margin-right: 10px;
    }
    /deep/ .el-form-item__label {
        color: rgba(51, 51, 51, 1);
        font-family: PingFangSC-Medium;
    }
    /deep/ .com-width {
        margin-left: 20px;
    }
}
.footer {
    text-align: left;
    padding-top: 10px;
    padding-left: 140px;
}
</style>
