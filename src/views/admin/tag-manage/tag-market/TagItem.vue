<template>
    <section class="tag-item">
        <div class="tag-state">
            <div class="tag-state-left">
                <div class="tag-name" @click="checkTagInfo">{{ data.tagName }}</div>
                <div class="tag-state-item">{{ data.tagCode }}</div>
                <div class="tag-state-item">{{ tagClassifyMap[data.tagClassify] }}</div>
                <div class="tag-state-item">{{ tagDataTypeMap[data.tagDataType] }}</div>
                <div class="tag-state-item">{{ grantStateMap[data.grantState] }}</div>
            </div>
            <div class="tag-state-right">
                <template v-if="data.grantState == 1">
                    <el-button size="mini" type="primary" @click="addToShopCar">添加</el-button>
                </template>
                <template v-else>
                    <el-button size="mini" type="primary" @click="showApplyDialog">申请使用</el-button>
                </template>
            </div>
        </div>
        <div class="tag-desc">
            {{ data.tagDesc }}
        </div>
        <div class="tag-analysis">
            <div class="tag-analysis-item"><i class="icon el-icon-view"></i>{{ data.browseNum ? data.browseNum.toLocaleString() : 0 }}</div>
            <hr />
            <div class="tag-analysis-item"><i class="icon el-icon-copy-document"></i>{{ data.referNum ? data.referNum.toLocaleString() : 0 }}</div>
            <hr />
            <div class="tag-analysis-item"><i class="icon el-icon-user"></i>{{ data.coverNum ? data.coverNum.toLocaleString() : 0 }}</div>
            <div class="tag-analysis-date">{{ data.dataDt ? data.dataDt : '' }}</div>
        </div>
        <el-dialog :close-on-click-modal="false" title="提出申请" :visible.sync="applyDialogVisible" width="30%"
            ><el-input type="textarea" :rows="4" :placeholder="reasonPlaceHold" v-model="reason"> </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="applyDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="apply">提 交</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// mixin引入

// 第三方库引入

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
    referNum: number; // 人群引用
    [propName: string]: any;
}

interface Apply {
    subjectId: number;
    tagCode: string;
    reason: string;
}

@Component
export default class TagItem extends Vue {
    @Prop()
    private data!: Tag;

    private grantStateMap: object = {
        0: '未授权',
        1: '已授权',
        2: '已申请',
        3: '已驳回'
    };
    private tagClassifyMap: object = {
        1: '离线更新',
        2: '实时更新'
    };
    private tagDataTypeMap: object = {
        1: '事实及统计类',
        2: '挖掘预测类'
    };

    private applyDialogVisible: boolean = false;

    private reason: string = '';
    private reasonPlaceHold: string = '请填写使用说明，确认后将进入审批流程';

    private addToShopCar() {
        this.$bus.$emit('addTagToShopCar', this.data);
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
        const applyInfo: Apply = {
            subjectId: this.data.subjectId,
            tagCode: this.data.tagCode,
            reason: this.reason
        };
        this.addGrant(applyInfo)
            .then(() => {
                this.$bus.$emit('applyTagGrant');
                this.$message.success('申请已提交');
            })
            .catch(err => {
                console.log(err);
            });
    }

    private checkTagInfo() {
        this.$bus.$emit('checkTagInfoA', this.data.id);
    }

    // ========== ajax request  ==========

    private addGrant(info: Apply) {
        return new Promise((resolve, reject) => {
            const url = '/api/admin/userGrantTag/add';
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
    width: 100%;
    height: 150px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    box-shadow: 0px 2px 6px 0px rgba(189, 189, 189, 0.5);
    margin-bottom: 18px;

    padding: 25px;

    display: flex;
    flex-direction: column;

    .tag-state {
        width: 100%;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-left {
            flex: 1 1 auto;
            height: 28px;
            display: flex;
            align-items: center;
        }
        &-right {
            flex: 0 0 auto;
            width: 80px;
        }

        .tag-name {
            width: 80px;
            font-size: 1.125rem;
            font-weight: bold;
            color: rgba(27, 27, 27, 1);
            cursor: pointer;
        }
        .tag-state-item {
            font-size: 0.75rem;
            color: rgba(102, 102, 102, 1);
            background: rgba(255, 255, 255, 1);
            border-radius: 4px;
            box-shadow: 0px 2px 4px 0px rgba(195, 195, 195, 0.5);
            padding: 3px 10px;
            margin-left: 10px;
            cursor: default;
        }
    }
    .tag-desc {
        width: 80%;
        max-width: 1200px;
        font-size: 0.75rem;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 10px;
        flex: 1 1 auto;
    }
    .tag-analysis {
        width: 100%;
        height: 18px;
        display: flex;
        align-items: center;

        .tag-analysis-item {
            font-size: 0.75rem;
            color: rgba(153, 153, 153, 1);
            padding: 0px 10px;
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
            padding: 0px 10px;
            margin-left: 30px;
        }
    }
}
</style>
