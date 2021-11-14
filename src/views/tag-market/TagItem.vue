<template>
    <section class="tag-item">
        <div
                class="tag-type"
                :class="{ 's0': data.grantState == 0, 's1': data.grantState == 1, 's2': data.grantState == 2, 's3': data.grantState == 3 }"
        >
            {{ grantStateMap[data.grantState] }}
        </div>
        <div class="tag-state">
            <div class="tag-state-left">
                <div class="tag-name" @click="checkTagInfo">{{ data.tagName }}</div>
            </div>
        </div>
        <div class="tag-desc">
            <el-tooltip :content="data.tagDesc" placement="bottom-start">
                <span>{{ data.tagDesc }}</span>
            </el-tooltip>
        </div>
        <div class="tag-state-div">
            <div class="tag-state-item">{{ data.tagCode }}</div>
            <div class="tag-state-item">{{ tagClassifyMap[data.tagClassify] }}</div>
            <div class="tag-state-item">{{ tagDataTypeMap[data.tagDataType] }}</div>
        </div>
        <div class="tag-analysis">
            <div class="tag-analysis-item">
                <el-tooltip content="浏览" placement="bottom">
                    <span>
                    <i class="icon el-icon-view"></i>{{ data.browseNum === null ? '' : data.browseNum.toLocaleString() }}
                    </span>
                </el-tooltip>
            </div>
            <div class="tag-analysis-item">
                <el-tooltip content="群体引用" placement="bottom">
                    <span>
                    <i class="icon el-icon-copy-document"></i>{{ data.referNum === null ? '' : data.referNum.toLocaleString() }}
                    </span>
                </el-tooltip>
            </div>
            <div class="tag-analysis-item">
                <el-tooltip content="覆盖人数" placement="bottom">
                    <span>
                    <i class="icon el-icon-user"></i>{{ data.coverNum === null ? '' : data.coverNum.toLocaleString() }}
                    </span>
                </el-tooltip>
            </div>
            <div class="tag-analysis-item">
                <el-tooltip content="更新日期" placement="bottom">
                    <span>
                    <i class="icon el-icon-time"></i>{{ data.dataDt ? formatDate(parseInt(data.dataDt + '000'),'YYYY-MM-DD') : '' }}
                    </span>
                </el-tooltip>
            </div>

            <div class="button-bg">
                <template v-if="data.grantState == 1">
                    <a v-if="tagListAddType" class="el-icon-shopping-cart-full not-add"><span>已添加</span></a>
                    <a v-else @click="addToShopCar" class="el-icon-shopping-cart-full"><span>添加</span></a>
                </template>
                <template v-else>
                    <a v-if="data.grantState != 2"
                       @click="showApplyDialog"
                       class="el-icon-document-add"
                    ><span>申请</span></a>
                    <span v-if="data.grantState == 2"
                       class="el-icon-document-add"
                    ><span>申请</span></span>
                </template>
            </div>

        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="applyDialogVisible" width="30%">
            <div slot="title" class="dialog-title">提出申请</div>
            <div style="padding: 15px;"><el-input type="textarea" :rows="4" :placeholder="reasonPlaceHold" v-model="reason"> </el-input></div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="applyDialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="apply">提 交</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
// mixin引入

// 第三方库引入
import moment from 'moment';

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明
interface Tag {
    id: number; // 主键ID
    tagCode: string; // 标签编码
    tagName: string; // 标签名称
    subjectId: number; // 主体ID
    grantState: number; // 授权状态
    tagDataType: number; // 标签数据类型
    tagClassify: number; // 标签类型
    tagLogicDesc: string; //标签逻辑描述
    tagSecLevel: number; // 标签安全级
    tagStatus: number; // 标签状态
    tagDesc: string; //标签描述
    modifiedTime: string; // 修改时间
    createdTime: string; // 创建时间
    coverNum: number; // 覆盖数
    browseNum: number; // 浏览数
    referNum: number; // 群体引用
    [propName: string]: any;
}

interface Apply {
    subjectId: number;
    tagCode: string;
    reason: string;
}

interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

@Component
export default class TagItem extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;

    @Prop()
    private data!: Tag;

    private grantStateMap: object = {
        0: '未授权',
        1: '已授权',
        2: '审批中',
        3: '已驳回'
    };
    private tagClassifyMap: object = {
        1: '离线更新',
        2: '离线更新',
        3: '实时更新'
    };
    private tagDataTypeMap: object = {
        1: '事实及统计类',
        2: '挖掘预测类'
    };

    private applyDialogVisible: boolean = false;

    private reason: string = '';
    private reasonPlaceHold: string = '请填写使用说明，确认后将进入审批流程';

    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    private addToShopCar() {
        if(this.tagListAddType){
            return;
        }
        this.$bus.$emit('addTagToShopCar', this.data);
    }

    get tagListAddType () {
        const tagList:[] = this.$bus.$emit('addType');
        // 已添加检查
        const idx = tagList.findIndex((tag: Tag) => {
            return this.data.tagCode == tag.tagCode;
        });
        if (idx >= 0) {
            return true;
        }
        return false;
    }

    private showApplyDialog() {
        this.applyDialogVisible = true;
        this.reason = '';
    }

    private apply() {
        if (!this.data) {
            this.$message.error('未检查到标签信息');
            return;
        }
        if (!this.reason || this.reason == '') {
            this.$message.warning('未填写任何说明');
            return;
        }
        if (!this.curSubject) {
            this.$message.warning('缺失主体信息');
            return;
        }
        const applyInfo: Apply = {
            subjectId: this.curSubject.id,
            tagCode: this.data.tagCode,
            reason: this.reason
        };
        this.addGrant(applyInfo)
            .then(() => {
                this.$bus.$emit('applyTagGrant');
                this.$message.success('申请已提交');
                this.applyDialogVisible = false;
            })
            .catch(err => {
                console.log(err);
            });
    }

    private checkTagInfo() {
        this.$bus.$emit('checkTagInfo', this.data.id);
    }

    // ========== ajax request  ==========

    private addGrant(info: Apply) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/userGrantTag/add';
            const data = info;
            this.$api
                .post(url, data)
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
.tag-item {
    // height: 100px;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    box-shadow:  0px 0px 10px 0px rgba(142,148,156,0.1);
    margin-bottom: 20px;
    height: 158px;
    position: relative;
    padding: 0;

    display: flex;
    flex-direction: column;
    overflow: hidden;
    .tag-type {
        height: 20px;
        font-size: 12px;
        position: absolute;
        right: 20px;
        top: 20px;
        line-height: 20px;
        &:before {
            position: absolute;
            content: " ";
            width: 6px;
            height: 6px;
            border-radius: 6px;
            overflow: hidden;
            left: -12px;
            top: 7px;
        }
        &.s0 {
            color: #e2524b;
            &:before {
                background: #e2524b;
            }
        }
        &.s1 {
            color: #26A872;
            &:before {
                background: #26A872;
            }
        }
        &.s2 {
            color: #eebb4c;
            &:before {
                background: #eebb4c;
            }
        }
    }

    .tag-state {
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px 0 20px;

        &-left {
            flex: 1 1 auto;
            height: 28px;
            display: flex;
            align-items: center;
        }

        .tag-name {
            width: 90%;
            font-size: 1rem;
            font-weight: bold;
            color: rgba(27, 27, 27, 1);
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

    }
    .tag-state-div {
        flex: 1 1 auto;
        padding: 0 20px;
        min-width: 430px;
    }
    .tag-state-item {
        font-size: 0.75rem;
        color: #888;
        background: rgba(255, 255, 255, 1);
        border: 1px solid #D9E0E5;
        border-radius: 2px;
        padding: 3px 10px;
        margin-right: 10px;
        cursor: default;
        display: inline-block;
    }
    .tag-desc {
        width: 100%;
        max-width: 1200px;
        font-size: 0.75rem;
        color: rgba(153, 153, 153, 1);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: 0;
        margin-bottom: 10px;
        flex: 1 1 auto;
        padding: 0 20px;
        max-height: 30px;
        line-height: 30px;
        min-width: 430px;
    }
    .tag-analysis {
        width: 100%;
        min-width: 450px;
        display: flex;
        align-items: center;
        line-height: 40px;
        height: 40px;
        border-top: 1px dashed rgba(229,233,236,1);
        padding: 0 20px;
        .tag-analysis-item {
            font-size: 0.75rem;
            color: #888888;
            padding: 0px 5px;
            cursor: default;

            .icon {
                margin-right: 10px;
            }

            &:first-child {
                padding-left: 0px;
            }
        }
        hr {
            width: 1px;
            height: 10px;
            background: rgba(153, 153, 153, 1);
            border: 0px;
        }
        .tag-analysis-date {
            font-size: 0.75rem;
            color: rgba(102, 102, 102, 1);
            padding: 0;
            flex: 1 1 auto;
            margin-left: 30px;
            text-align: right;
            color: #888888;
        }
    }
    .el-icon-view {
        color: #3D6EF0;
    }
    .el-icon-copy-document {
        color: #56CB80;
    }
    .el-icon-user {
        color: #F8BB3E;
    }
    .button-bg {
        height: 40px;
        line-height: 40px;
        text-align: right;
        flex: 1 1 auto;
        font-size: 19px;
        &>span{
            position: relative;
            top:-3px;
            color: #aaa;
            cursor: not-allowed;
            &:before {
                position: relative;
                left:-3px;
                top:2px;
            }
            span{
                font-size: 12px;
            }
        }
        a{
            position: relative;
            top:-3px;
            &:before {
                position: relative;
                left:-3px;
                top:2px;
            }
            span{
                font-size: 12px;
            }
            &.not-add{
                color: #888;
                cursor: not-allowed;
            }
        }
    }
}
</style>
