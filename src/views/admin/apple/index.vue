<template>
    <section class="class-apple" v-loading="loading">
        <template v-if="user">
            <div style="text-align: center;" v-if="startDis">
                流程审批中
            </div>
        </template>
        <template v-else>
            <div class="class-apple-title">申请运营管理权限！</div>
            <el-form :model="form" ref="form" :rules="rules" label-width="120px" label-opsition="left">
                <el-form-item label="申请原因" prop="keyword">
                    <el-input size="mini" v-model="form.keyword" autocomplete="off" type="textarea" placeholder="请填写申请原因" rows="5"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: center;padding: 10px;">
                <el-button size="mini" :loading="addAuthLoading" type="primary" @click="addAuth">申 请</el-button>
            </div>
        </template>
    </section>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Apple extends Vue {
        private form: any = {
            keyword: ''
        };
        private rules: any = {
            keyword: [{ required: true, message: '请输入申请原因', trigger: 'blur' }]
        };
        private loading:boolean = false;
        private addAuthLoading:boolean = false;
        private user: string = '';
        private startDis: boolean = false;
        private created() {
            this.loading = true;
            this.$api.get('/api/ava/menu/getUserRole').then((res: any) => {
                this.loading = false;
                for (let i = 0; i < res.length; i++) {
                    const item = res[i];
                    if (item.roleCode === 'admin' || item.roleCode === 'developer') {
                        this.user = item.erp;
                        this.$store.commit('saveUserInfo', item);
                        if (item.state === 1) {
                            this.startDis = false;
                            return true;
                        }
                        if (item.state === 2) {
                            this.startDis = true;
                        }
                    }
                }
            });
        }
        private addAuth() {
            this.addAuthLoading = true;
            (this.$refs.form as any).validate((valid: any) => {
                if (valid) {
                    this.$api
                        .get('/api/ava/userGrantRole/add', { keyword: this.form.keyword, roleCode: 'developer' })
                        .then((res: any) => {
                            this.$message.success('申请成功');
                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        })
                        .finally(() => {
                            this.addAuthLoading = false;
                        });
                } else {
                    this.addAuthLoading = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
</script>
<style scoped lang="scss">
    .class-apple{
        height: 100%;
        background: #fff;
        padding: 30px;
        &-title{
            line-height: 60px;
            font-size: 16px;
            text-align: center;
        }
    }
</style>
