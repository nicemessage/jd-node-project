<template>
    <div class="crowd-info">
        <el-form :model="CrowdVO" :rules="rules" ref="form" style="width: 90%">

            <el-row>
                <el-col
                        :xs="24"
                        :sm="24"
                        :md="24"
                        :lg="24"
                        :xl="24"
                >

                    <el-form-item label="群体名称" prop="crowdName" label-width="120px">
                        <el-input class="com-input crowd-width" placeholder="请输入群体名称"
                                  v-model="CrowdVO.crowdName" maxlength="50" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col
                        :xs="24"
                        :sm="24"
                        :md="24"
                        :lg="24"
                        :xl="24"
                >

<!--                    <el-form-item label="群体负责人" prop="adminUser" label-width="120px">-->
<!--                        <select-user ref="selectUser" :adminUser="CrowdVO.adminUser" @checkAdmin="checkAdmin"-->
<!--                                     class="com-width"></select-user>-->
<!--                        -->
<!--                    </el-form-item>-->
                    <el-form-item label="群体负责人" prop="crowdManagerList" label-width="120px">
                        <SearchErp :value.sync="CrowdVO.crowdManagerList" multiple style="margin-left: 20px;"></SearchErp>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col
                        :xs="24"
                        :sm="24"
                        :md="24"
                        :lg="24"
                        :xl="24"
                >

                    <el-form-item label="群体描述" prop="crowdDesc" label-width="120px">
                        <el-input
                                class="com-input crowd-width"
                                type="textarea"
                                size="small"
                                placeholder="请输入群体描述"
                                :rows="5"
                                :resize="'none'"
                                v-model="CrowdVO.crowdDesc"
                                maxlength="200"
                                clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

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
    import {Component, Vue} from 'vue-property-decorator';
    import SelectUser from '@/components/SelectUserNew.vue';
    // mixin引入

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入

    // 公共类引入
    import SearchErp from '@/components/SearchErp.vue';

    // 私有组件引入

    // 私有类引入

    // 本地定义和声明

    @Component({
        components: {
            SelectUser,
            SearchErp
        }
    })
    export default class CrowdInfo extends Vue {

        private CrowdVO: any = {
            crowdDesc: '',
            crowdManager: '',
            crowdName: '',
            crowdCode: '',
            adminUser: '',
            crowdManagerList:[window.sessionStorage.getItem("userErp")]
        }

        private rules: any = {
            crowdManagerList: [{required: true, message: '请输入群体负责人', trigger: 'blur'}],
            crowdName: [{required: true, message: '请输入群体名称', trigger: 'blur'}],
            crowdDesc: [{required: true, message: '请输入群体描述', trigger: 'blur'}]
        };


        // private mounted() {
        // }

        // private checkAdmin(adminUser: string, erp: string) {
        //     this.CrowdVO.crowdManager = erp;
        //     this.CrowdVO.crowdManagerList = adminUser.split(",");
        //     this.CrowdVO.adminUser = adminUser;
        //     const form = this.$refs.form as any;
        //     form.validateField('adminUser');
        // }

        private init(crowdVO: any) {
            this.CrowdVO.crowdManager = crowdVO.crowdManager;
            this.CrowdVO.crowdManagerList = crowdVO.crowdManager.split(",");
            this.CrowdVO.adminUser = crowdVO.crowdManager;
            this.CrowdVO.crowdName = crowdVO.crowdName;
            this.CrowdVO.crowdDesc = crowdVO.crowdDesc;
            //
            // (this.$refs.selectUser as any).changeSelect(this.CrowdVO.adminUser);
        }


        private getCrowdInfo() {
            let check = false;
            (this.$refs.form as any).validate((item: boolean) => {
                check = item;
            });

            if (check) {
                return this.CrowdVO;
            }
        }

    }
</script>
<style lang="scss" scoped>
    .crowd-info {
        width: 100%;
        height: 100%;
        line-height: 40px;
        padding-top: 18px;

        .enum-ipt {
            display: flex;
            align-items: center;
            position: relative;

            .add-btn {
                position: absolute;
                left: calc(100% + 10px);
            }
        }

        .tag-list {
            margin-top: 10px;
            padding-bottom: 20px;
            .enum-item {
                margin: 0 10px 10px 0;
            }
        }

        .com-width {
            width: 100%;
            margin-left: 20px;

        }

        .crowd-width {
            margin-left: 20px;
        }

        /deep/ .el-form-item__error {
            margin-left: 20px;
        }

        .com-select {
            width: 100%;
        }
    }
</style>
