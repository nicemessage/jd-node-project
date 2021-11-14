<template>
    <section class="home-section">
        <div class="banner">
            <div class="banner-content">
                <div class="banner-left">
                    <h1>统一画像平台</h1>
                    <p>
                        统一画像平台实现了用户，企业，地址等多主体下的标签、群体数据的统一定义、开发、使用、存储、管理及对接，全方位服务于群体刻画、精准投放、广告营销等众多场景。
                    </p>
                    <div class="btn-box">
                        <template v-if="user && user !== ''">
                            <div class="start-btn disBtn" v-if="startDis">流程审批</div>
                            <div class="start-btn" v-else @click="toSystem">立即开启</div>
                        </template>
                        <template v-else>
                            <div class="start-btn" @click="toSystem">申请使用</div>
                        </template>
                        <div class="jump-btn" @click="jumpCf">快速入门</div>
                    </div>
                </div>
                <img src="@/assets/img/banner.png" alt="" class="banner-right fl" />
            </div>
        </div>
        <div class="product-introduce">
            <div class="product-introduc-content">
                <h5 class="title">
                    <span> 产品简介 <em class="line"></em></span>
                </h5>
                <div class="introduc-wrap">
                    <div class="introduc-item" v-for="(item, index) in introducData" :key="index">
                        <img :src="item.url" alt="" />
                        <div class="introduc-item-text">
                            <strong>{{ item.title }}</strong>
                            <p>{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flow-path">
            <div class="flow-path-content">
                <h5 class="title">
                    <span>流程指引<em class="long line"></em></span>
                </h5>
                <div class="flow-path-text">
                    <div class="flow-path-left">
                        <div class="flow-path-title">
                            <div class="flow-path-title_left">01</div>
                            <div class="flow-path-title_right">
                                <span>STEP ONE</span>
                                <p>新增标签</p>
                            </div>
                        </div>
                        <div class="flow-path-left_content">
                            <div class="left-content-item" v-for="(item, index) in flowData" :key="index">
                                <div class="item-top">
                                    <img :src="item.url" alt="" />
                                    <span>{{ item.title }}</span>
                                </div>
                                <img class="item-arrow" src="@/assets/img/arrow-down.png" alt="" v-if="index != flowData.length - 1" />
                            </div>
                        </div>
                    </div>
                    <div class="flow-path-right">
                        <div class="flow-path-title">
                            <div class="flow-path-title_left">02</div>
                            <div class="flow-path-title_right">
                                <span>STEP TWO</span>
                                <p>群体创建</p>
                            </div>
                        </div>
                        <div class="flow-path-right_content">
                            <div class="mode">
                                <span class="tip">方式一</span>
                                <p class="name">标签组合建群</p>
                                <div class="mode_content">
                                    <div class="mode_item" v-for="(item, index) in mode1" :key="index">
                                        <em></em>
                                        <img :src="item.url" alt="" />
                                        <span>{{ item.title }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mode">
                                <span class="tip">方式二</span>
                                <p class="name">文件上传建群</p>
                                <div class="mode_content">
                                    <div class="mode_item" v-for="(item, index) in mode2" :key="index">
                                        <em></em>
                                        <img :src="item.url" alt="" />
                                        <span>{{ item.title }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="app">
            <div class="app-content">
                <h5 class="title">
                    <span>应用场景<em class="long line"></em></span>
                </h5>
                <ul class="app-content_wrap">
                    <li v-for="(item, index) in appData" :key="index" :style="{ 'background-image': `url(${item.url})` }">
                        <div class="msg">
                            <strong>{{ item.title }}</strong>
                            <p>{{ item.text }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="product-dynamic">
            <div class="product-dynamic-content">
                <h5 class="title">
                    <span>产品动态<em class="long line"></em></span>
                </h5>
                <div class="product-dynamic-wrap">
                    <ul>
                        <li>
                            <strong>2019-10-16 </strong>
                            <div class="cricle">
                                <em></em>
                                <div class="line"></div>
                            </div>
                            <div class="version">
                                V0.5版本<span><em></em></span>
                            </div>
                            <p>实现标签组合圈群、群体画像分析</p>
                        </li>
                        <li>
                            <strong>2020-08-06 </strong>
                            <div class="cricle">
                                <em></em>
                                <div class="white">
                                    <div></div>
                                </div>
                            </div>
                            <div class="version">
                                V1.0版本<span><em></em></span>
                            </div>
                            <p>统一企业ID，实现文件建群</p>
                        </li>
                        <li>
                            <strong class="op-hide">1</strong>
                            <div class="cricle">
                                <em class="disabled"></em>
                                <div class="white">
                                    <div></div>
                                </div>
                            </div>
                            <div class="version disabled">
                                未来可期<span><em></em></span>
                            </div>
                        </li>
                        <li>
                            <strong class="op-hide">1</strong>
                            <div class="cricle">
                                <em class="disabled"></em>
                            </div>
                        </li>
                    </ul>
                    <img src="@/assets/img/arrow-left.png" alt="" class="product-dynamic left" />
                    <img src="@/assets/img/arrow-right1.png" alt="" class="product-dynamic right" />
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="top">
                <p>
                    <a href="https://jr.jd.com/" target="_blank" class="link">京东数科</a>
                    <a href="https://www.jd.com/" target="_blank" class="link">京东商城</a>
                    <a href="https://jrhelp.jd.com/show/getProblemInfo?id=688" target="_blank" class="link">关于京东数科</a>
                    <a href="https://jrhelp.jd.com/show/getProblemInfo-3061" target="_blank" class="link">知识产权</a>
                    <a href="https://jrhelp.jd.com/show/getProblemInfo-2748" target="_blank" class="link">隐私政策</a>
                    <a href="http://7.jd.com/#/?url=http%3A%2F%2F7.jd.com%2FotherPage%23%2Ffeedback" target="_blank" class="link">意见反馈</a>
                </p>
                <p>
                    <span><em></em>联系我们</span>
                    <a href="timline://chat/?topin=zhoudandan14" class="dd-btn">
                        用户画像
                        <img src="@/assets/img/dd.png" alt="" />
                    </a>
                    <a href="timline://chat/?topin=zhoudandan14" class="dd-btn">
                        企业画像
                        <img src="@/assets/img/dd.png" alt="" />
                    </a>
                </p>
            </div>
            <div class="bottom">Copyright© 2014-2020 京东JD.com 版权所有 | Powered by 京东数字科技-数字技术中心-数据资产部</div>
        </div>
        <el-dialog :close-on-click-modal="false" title="申请开通" :visible.sync="dialogFormVisible" @close="resetForm">
            <el-form :model="form" ref="form" :rules="rules" label-width="120px" label-opsition="left">
                <el-form-item label="申请原因" prop="keyword">
                    <el-input size="mini" v-model="form.keyword" autocomplete="off" type="textarea" placeholder="请填写申请原因" rows="5"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="resetForm">取 消</el-button>
                <el-button size="mini" type="primary" @click="addAuth">申 请</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Overview extends Vue {
    private dialogFormVisible: boolean = false;

    private form: any = {
        keyword: ''
    };

    private rules: any = {
        keyword: [{ required: true, message: '请输入申请原因', trigger: 'blur' }]
    };

    private user: string = '';
    private introducData: any[] = [
        {
            url: require('@/assets/img/introduc1.png'),
            title: '标签管理',
            text: '构建数科统一企业标签体系，统一开发、注册管理标签'
        },
        {
            url: require('@/assets/img/introduc2.png'),
            title: '标签圈群',
            text: '丰富的标签数据搭配灵活的逻辑组合方式，精准圈选目标群体'
        },
        {
            url: require('@/assets/img/introduc3.png'),
            title: '文件建群',
            text: '文件内任意ID通过IDMapping建群，实现秒级数据校验分析'
        },
        {
            url: require('@/assets/img/introduc4.png'),
            title: '画像分析',
            text: '全面立体洞察目标企业群，为精细化运营提供全方位画像支撑'
        },
        {
            url: require('@/assets/img/introduc5.png'),
            title: '渠道应用',
            text: '群体多系统应用，支持后续策略分析、营销触达等多场景闭环'
        },
        {
            url: require('@/assets/img/introduc6.png'),
            title: '数据回流',
            text: '将群体数据回流到数仓，支持数据分析，BI展示等应用场景'
        }
    ];
    private flowData: any[] = [
        {
            url: require('@/assets/img/flow-left1.png'),
            title: '标签需求'
        },
        {
            url: require('@/assets/img/flow-left2.png'),
            title: '标签加工'
        },
        {
            url: require('@/assets/img/flow-left3.png'),
            title: '标签注册'
        },
        {
            url: require('@/assets/img/flow-left4.png'),
            title: '标签上线'
        }
    ];
    private mode1: any[] = [
        {
            url: require('@/assets/img/mode1-1.png'),
            title: '标签筛选'
        },
        {
            url: require('@/assets/img/mode1-2.png'),
            title: '逻辑组合'
        },
        {
            url: require('@/assets/img/mode1-3.png'),
            title: '画像分析'
        },
        {
            url: require('@/assets/img/mode1-4.png'),
            title: '保存群体'
        }
    ];
    private mode2: any[] = [
        {
            url: require('@/assets/img/mode2-1.png'),
            title: '文件上传'
        },
        {
            url: require('@/assets/img/mode2-2.png'),
            title: '数据分析'
        },
        {
            url: require('@/assets/img/mode1-3.png'),
            title: '画像分析'
        },
        {
            url: require('@/assets/img/mode1-4.png'),
            title: '保存群体'
        }
    ];
    private appData: any[] = [
        {
            url: require('@/assets/img/app1.png'),
            title: '精准营销',
            text: '通过标签触达目标客户，在客户获取、广告投放、服务推荐等营销推广上更有针对性，提升运营效益且节省人力'
        },
        {
            url: require('@/assets/img/app2.png'),
            title: '千人千面',
            text: '整合业务数据，注册开发海量标签，基于人口属性、行为特征、偏好等精准刻画企业商家全貌'
        },
        {
            url: require('@/assets/img/app3.png'),
            title: '生命周期管理',
            text: '构建企业生命周期模型，维持现有商家、唤醒沉睡商家并指导流失召回'
        },
        {
            url: require('@/assets/img/app4.png'),
            title: '风险识别价值评估',
            text: '构建黑/白名单，防范风险企业商家产生的异常行为。建立企业商家价值模型，分析其价值迁移并聚焦高潜企业商家'
        }
    ];
    private startDis: boolean = false;

    private created() {
        this.$api.get('/api/ava/menu/getUserRole').then((res: any) => {
            try {
                // console.log(res);
                for (let i = 0; i < res.length; i++) {
                    const item: any = res[i];
                    window.sessionStorage.setItem('userErp', item.erp);
                    this.user = item.erp;
                    this.$store.commit('saveUserInfo', item);
                    if (item.roleCode === 'user') {
                        if (item.state === 1) {
                            // Waring: 此处处理权限存在风险，每次记录用户的角色信息时，可能出现低权限角色覆盖高权限角色的可能，需要后续排除风险！
                            this.getSubjectList();
                            this.startDis = false;
                            return;
                            // throw new Error('已有权限');
                        }
                        if (item.state === 2) {
                            console.log('数据修改');
                            this.startDis = true;
                            return;
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    private getSubjectList() {
        this.$api.get('/api/admin/sysSubject/querySysSubject?subjectStatus=1').then((res: any) => {
            if (res.result === '1') {
                window.sessionStorage.setItem('subjectIdList', JSON.stringify(res.data));
                window.sessionStorage.setItem('subjectId', `${res.data[0].id}`);
            }
        });
    }
    private toSystem() {
        if (this.startDis) {
            return false;
        }
        if (this.user) {
            this.$router.push({
                name: 'tag-market'
            });
        } else {
            this.dialogFormVisible = true;
        }
    }
    private jumpCf() {
        window.open('http://doc.jd.com/agiletag/help/');
    }

    private addAuth() {
        (this.$refs.form as any).validate((valid: any) => {
            if (valid) {
                this.$api.get('/api/ava/userGrantRole/add', { keyword: this.form.keyword, roleCode: 'user' }).then((res: any) => {
                    this.$message.success('已提交申请');
                    this.dialogFormVisible = false;
                    // this.$router.go(0);
                    this.startDis = true;
                    this.user = 'user';
                });
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }

    private resetForm() {
        (this.$refs.form as any).resetFields();
        this.dialogFormVisible = false;
    }
}
</script>

<style scoped lang="scss">
.disBtn {
    background: #ccc !important;
    cursor: no-drop !important;
}
.banner {
    height: 364px;
    background: rgba(33, 33, 33, 1);
}
.banner-content {
    width: 1200px;
    height: 100%;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
}
.banner-left {
    padding-top: 56px;
    width: 50%;
    height: 100%;
    position: relative;
    z-index: 1;
    h1 {
        font-size: 40px;
        font-weight: 500;
        color: #fff;
    }
    p {
        margin: 32px 0 56px;
        color: #fff;
        opacity: 0.7;
        font-size: 14px;
    }
    .btn-box {
        display: flex;
        align-items: center;
    }
    .start-btn {
        width: 160px;
        height: 40px;
        line-height: 40px;
        background: linear-gradient(83deg, rgba(54, 147, 255, 1) 0%, rgba(25, 90, 255, 1) 100%);
        border-radius: 2px;
        box-shadow: 0px 4px 14px 0px rgba(25, 90, 255, 0.25);
        font-size: 14px;
        color: #fff;
        text-align: center;
        cursor: pointer;
    }
    .jump-btn {
        width: 160px;
        height: 40px;
        line-height: 40px;
        border-radius: 2px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        border: 1px solid #fff;
        margin-left: 20px;
        &:hover {
            background: #fff;
            color: #333;
        }
    }
}
.banner-right {
    width: auto;
    height: 100%;
    position: absolute;
    right: -98px;
    top: 0;
}
.product-introduce {
    background: #fff;
}
.product-introduc-content {
    width: 1200px;
    padding: 60px 60px 20px;
    margin: 0 auto;
}
.introduc-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: 72px;
    .introduc-item {
        display: flex;
        align-items: center;
        margin-bottom: 50px;
        width: 26%;
        &:nth-of-type(3n-1) {
            margin: 0 11% 40px;
        }
        img {
            width: 40px;
            height: 40px;
            margin-right: 24px;
        }
        .introduc-item-text {
            strong {
                color: #212121;
                font-size: 18px;
            }
            p {
                word-break: break-all;
                color: #979797;
                font-size: 14px;
                margin-top: 8px;
            }
        }
    }
}
.flow-path,
.product-dynamic {
    background: rgba(245, 249, 252, 1);
}
.flow-path-content {
    width: 1200px;
    padding: 40px 0;
    margin: 0 auto;
}
.flow-path-text {
    margin-top: 40px;
    display: flex;
}
.flow-path-left {
    width: 468px;
    padding: 10px 20px 20px;
    background: #fff;
    margin-right: 24px;
    &_content {
        padding-top: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .left-content-item {
        margin-bottom: 12px;
        &:last-child {
            margin: 0;
        }
        .item-top {
            display: flex;
            align-items: center;
            img {
                width: 30px;
                height: 30px;
                margin-right: 24px;
            }
            span {
                font-size: 16px;
                color: #212121;
            }
        }
        .item-arrow {
            width: 26px;
            height: auto;
            margin: 16px 0 0 72px;
        }
    }
}
.flow-path-right {
    width: 684px;
    padding: 10px 20px 20px;
    background: #fff;
    &_content {
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }
}
.mode {
    &:last-child {
        margin-left: 140px;
    }
    .tip {
        font-size: 14;
        color: #3693ff;
    }
    .name {
        font-size: 18px;
        color: #212121;
        margin: 2px 0 20px;
        font-weight: 600;
    }
    &_item {
        display: flex;
        align-items: center;
        position: relative;
        margin-bottom: 40px;
        &::after {
            content: '';
            width: 2px;
            height: 45px;
            background: #568dd5;
            position: absolute;
            bottom: 2px;
            left: 6px;
            transform: translateY(100%);
        }
        &:last-child {
            margin-bottom: 0;
            &::after {
                display: none;
            }
        }
        em {
            width: 14px;
            height: 14px;
            border: 2px solid #568dd5;
            border-radius: 50%;
        }
        img {
            width: 18px;
            height: 18px;
            margin: 0 8px 0 24px;
        }
        span {
            font-size: 14px;
            color: #212121;
        }
    }
}
.flow-path-title {
    display: flex;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    &_left {
        width: 62px;
        font-family: FZLTDHJW--GB1-0;
        font-size: 36px;
        color: rgba(45, 104, 255, 1);
        position: relative;
        margin-right: 18px;
        &::after {
            content: '';
            width: 1px;
            height: 30px;
            background: #979797;
            position: absolute;
            right: 0;
            top: 50%;
            margin-top: -15px;
        }
    }
    &_right {
        span {
            font-size: 12px;
            color: #979797;
        }
        p {
            font-size: 16px;
            color: #212121;
            margin-top: 2px;
            font-weight: 600;
        }
    }
}
.app-content {
    width: 1200px;
    padding: 60px 0;
    margin: 0 auto;
    &_wrap {
        display: flex;
        margin-top: 52px;
        li {
            width: 282px;
            height: 282px;
            margin-right: 24px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                .msg {
                    bottom: 0;
                    p {
                        opacity: 1;
                    }
                }
            }
            .msg {
                width: 100%;
                background: #fff;
                opacity: 0.8;
                position: absolute;
                left: 0;
                bottom: -88px;
                padding: 24px;
                transition: all 0.3s ease-out;
                strong {
                    font-size: 18px;
                    color: #212121;
                }
                p {
                    min-height: 76px;
                    margin-top: 5px;
                    font-size: 14px;
                    color: #212121;
                    word-break: break-all;
                    opacity: 0;
                    transition: all 0.3s ease-out;
                }
            }
        }
    }
}
.product-dynamic-content {
    width: 1200px;
    padding: 40px 0 60px;
    margin: 0 auto;
}
.product-dynamic-wrap {
    margin-top: 60px;
    position: relative;
    ul {
        width: 980px;
        margin: 0 auto;
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        li {
            width: 110px;
            margin-right: 180px;
            &:last-child {
                margin-right: 0;
            }
            strong {
                font-size: 18px;
                color: #212121;
                &.op-hide {
                    visibility: hidden;
                }
            }
            .cricle {
                margin: 8px 0px 12px 45px;
                position: relative;
                em {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 1);
                    border: 4px solid rgba(86, 131, 221, 1);
                    border-radius: 50%;
                    &.disabled {
                        border-color: rgba(213, 227, 255, 1);
                    }
                }
                .line {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    margin-top: -4px;
                    width: 285px;
                    height: 4px;
                    background: linear-gradient(90deg, rgba(84, 115, 231, 1) 0%, rgba(87, 150, 207, 1) 100%);
                }
                .white {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    margin-top: -8px;
                    width: 285px;
                    height: 12px;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    div {
                        width: 100%;
                        border-bottom: 1px dashed #aabce0;
                    }
                }
            }
            .version {
                width: 110px;
                height: 36px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(84, 119, 228, 1);
                color: rgba(84, 119, 228, 1);
                border-radius: 2px;
                text-align: center;
                line-height: 36px;
                position: relative;
                &.disabled {
                    border-color: rgba(213, 227, 255, 1);
                    span {
                        border-color: transparent transparent rgba(213, 227, 255, 1);
                    }
                }
                span {
                    display: block;
                    width: 0;
                    height: 0;
                    border-width: 0 10px 10px;
                    border-style: solid;
                    border-color: transparent transparent rgba(84, 119, 228, 1);
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    margin-left: -10px;
                    em {
                        display: block;
                        width: 0;
                        height: 0;
                        border-width: 0 10px 10px;
                        border-style: solid;
                        border-color: transparent transparent #fff;
                        position: absolute;
                        top: 1.5px;
                        left: -10px;
                    }
                }
            }
            p {
                color: #979797;
                font-size: 14px;
                width: 120px;
                word-break: break-all;
                margin-top: 8px;
            }
        }
    }
    .product-dynamic {
        position: absolute;
        top: 30px;
        width: 15px;
        cursor: pointer;
        &.left {
            left: 0;
        }
        &.right {
            right: 0;
        }
    }
}
.title {
    text-align: center;
    span {
        color: #212121;
        font-size: 24px;
        font-weight: 500;
        position: relative;
    }
    .line {
        width: 40px;
        height: 4px;
        background: linear-gradient(360deg, rgba(54, 147, 255, 1) 0%, rgba(25, 90, 255, 1) 100%);
        box-shadow: 0px 4px 5px 0px rgba(25, 90, 255, 0.25);
        position: absolute;
        bottom: -8px;
        left: 50%;
        margin-left: -20px;
        &.long {
            width: 75px;
            margin-left: -37.5px;
        }
    }
}
.footer {
    width: 100%;
    background: #0e142d;
    .top {
        padding: 24px 0 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        p {
            display: flex;
            align-items: center;
        }
        .link {
            color: #fff;
            opacity: 0.7;
            font-size: 12px;
            position: relative;
            padding-right: 10px;
            margin-right: 10px;
            &:last-child {
                &::after {
                    display: none;
                }
            }
            &::after {
                content: '';
                position: absolute;
                top: 50%;
                right: 0;
                width: 1px;
                height: 12px;
                margin-top: -6px;
                opacity: 0.2;
                background-color: #fff;
            }
        }
        span {
            margin-left: 30px;
            margin-right: 20px;
            color: #fff;
            font-size: 14px;
            em {
                display: inline-block;
                width: 8px;
                height: 8px;
                background: rgb(245, 186, 30);
                border-radius: 50%;
                margin-right: 14px;
            }
        }
        .dd-btn {
            color: #fff;
            opacity: 0.7;
            font-size: 12px;
            position: relative;
            padding-right: 10px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            img {
                width: 16px;
                height: 16px;
                margin-left: 4px;
            }
            &:last-child {
                &::after {
                    display: none;
                }
            }
            &::after {
                content: '';
                position: absolute;
                top: 50%;
                right: 0;
                width: 1px;
                height: 12px;
                margin-top: -6px;
                opacity: 0.2;
                background-color: #fff;
            }
        }
    }
    .bottom {
        height: 42px;
        line-height: 42px;
        color: #fff;
        opacity: 0.7;
        font-size: 12px;
        text-align: center;
        border-top: 2px solid #2b3147;
    }
}
</style>
