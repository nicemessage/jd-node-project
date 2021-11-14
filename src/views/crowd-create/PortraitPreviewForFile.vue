<template>
    <div class="portrait-preview">
        <div class="action">
            <div class="text">
                <span class="line"></span><span>画像</span>
                <span class="crowd-num" v-show="crowdNum >= 0" style="color: #333">{{ `群体数量：${crowdNum}` }}</span>
            </div>

            <el-button-group>
                <el-button size="mini" plain @click="showAddTemplate">
                    <!--                    <i class="el-icon-plus"></i> -->
                    添加
                </el-button>
                <el-button size="mini" plain @click="searchTemplate">
                    <!--                    <i class="el-icon-refresh-left"></i> -->
                    重置
                </el-button>
                <el-button size="mini" plain @click="cleanAll">
                    <!--                    <i class="el-icon-delete"></i> -->
                    清空
                </el-button>
                <el-button size="mini" plain @click="analysis" type="primary" style="border-left:1px #abc3ff solid; ">
                    <!--                    <i class="el-icon-delete"></i>-->
                    分析
                </el-button>
            </el-button-group>
        </div>
        <div class="portrait-list">
            <div class="item" v-for="(item, index) of portraitList" :key="index">
                <PortraitItem :template="item" :crowd="crowd" :indexType="true" :plain="false"></PortraitItem>
            </div>
            <div v-if="portraitList.length === 0" style="padding: 120px 0;">
                <NoData label="请添加画像"></NoData>
            </div>
        </div>
        <el-dialog
            :close-on-click-modal="false"
            :before-close="beforeClose"
            :visible.sync="showAddTemplateDialog"
            width="1000px"
            :append-to-body="true"
        >
            <div slot="title" class="dialog-title">
                添加自定义画像
                <el-input
                    v-model="tagName"
                    placeholder="请输入标签名称/标签编码/标签描述"
                    @keyup.enter.native="tagQuery"
                    clearable
                    size="mini"
                    style="width: 260px;margin-left: 20px;margin-right: 10px;"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button size="mini" type="primary" @click="tagQuery">搜索</el-button>
            </div>
            <template v-if="showAddTemplateDialog">
                <EnumSelect v-model="enumList" ref="ES"></EnumSelect>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="beforeClose">取 消</el-button>
                <el-button size="medium" type="primary" :loading="btnLoading" @click="addToPreview">添加到预览</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/**
 * @name PortraitPreview
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共组件引入
import NoData from '@/components/NoDataIcon.vue';

// 私有组件引入
import PortraitItem from '@/components/PortraitItem.vue';
import EnumSelect from '@/components/SelectEnumWithComponent.vue';

// 私有类引入

// 本地定义和声明

@Component({
    components: {
        PortraitItem,
        EnumSelect,
        NoData,
    },
})
export default class PortraitPreview extends Vue {
    @State(state => state.curSubject) curSubject!: any | null;
    @Watch('curSubject')
    private subjectChange() {
        this.getPortrait();
    }
    @State(state => state.portraitFile) portraitCache: any;

    @Prop()
    private crowdNum!: any;
    @Watch('crowdNum')
    private crowdNumChange(newVal: number) {
        if (newVal >= 0) {
            // this.buildSimuCrowd();
        } else {
            this.crowd = null;
        }
    }

    private analysis() {
        if (this.crowdNum == -1) {
            this.$message.warning('请计算群体数量');
            return false;
        }
        if (this.crowdNum && this.crowdNum >= 0) {
            this.buildSimuCrowd();
        } else {
            this.crowd = null;
        }
    }

    private btnLoading: boolean = false;

    private portraitList: any = [];

    private crowd: any = null;

    private showAddTemplateDialog: boolean = false;
    private enumList: any = [];
    private eventId: Array<any> = [];

    // 标签查询
    private tagName: any | null = null;
    private tagQuery() {
        this.$refs.ES.tagNameQuery(this.tagName);
    }
    private beforeClose() {
        this.tagName = '';
        this.showAddTemplateDialog = false;
    }

    private mounted() {
        this.addMonitor();
        this.init();
    }

    private addMonitor() {
        let id: number | null = null;
        id = this.$bus.$on('remove-portrait-item', (tagCode: string) => {
            const idx = this.portraitList.findIndex((item: any) => {
                return item.tagCode == tagCode;
            });
            if (idx >= 0) {
                this.portraitList.splice(idx, 1);
                this.updatePortrait();
            }
        });
        this.eventId.push({
            id: id,
            event: 'remove-portrait-item',
        });
        id = this.$bus.$on('remove-tag-name', () => {
            this.tagName = '';
        });
        this.eventId.push({
            id: id,
            event: 'remove-tag-name',
        });
    }

    private init() {
        if (!this.curSubject) {
            return setTimeout(this.init, 500);
        }
        this.getPortrait();
        // this.searchTemplate();
    }

    private searchTemplate() {
        this.portraitTemplate().then((res: any) => {
            this.portraitList = res.templates;
            this.updatePortrait();
        });
    }

    private cleanAll() {
        this.portraitList = [];
        this.updatePortrait();
    }

    private buildSimuCrowd() {
        const express = this.getExpress();
        const crowd = {
            crowdDefine: JSON.stringify(express),
            crowdRealNum: this.crowdNum,
        };
        this.crowd = crowd;
        this.crowd.crowdType = 2;
    }

    private getExpress() {
        return (this.$parent as any).getCrowdDefine();
    }

    private showAddTemplate() {
        if (this.crowdNum == undefined || this.crowdNum < 0) {
            this.$message.warning('请先上传文件！');
            return;
        }
        this.enumList = [];
        this.showAddTemplateDialog = true;
    }

    private addToPreview() {
        this.btnLoading = true;
        // const express = this.getExpress();
        // console.log(this.enumList);
        if (this.enumList.length < 1) {
            this.btnLoading = false;
            this.showAddTemplateDialog = false;
            this.tagName = '';
        }
        let repetition: boolean = false;
        this.enumList.forEach(async (item: any) => {
            const newTemplate: any = {
                tagCode: item.tagCode,
                tagVal: item.tagVal,
                tagEnums: [],
            };
            const idx = this.portraitList.findIndex((_item: any) => {
                return _item.tagCode == newTemplate.tagCode;
            });
            // console.log(idx);
            if (idx >= 0) {
                repetition = true;
            } else {
                item.enums.forEach((enumItem: any) => {
                    const newItem: any = {
                        key: enumItem.tagEnumVal,
                        value: enumItem.tagEnumName,
                    };
                    newTemplate.tagEnums.push(newItem);
                });
                this.portraitList.push(newTemplate);
            }
        });
        this.updatePortrait();

        if (repetition) {
            this.$message.warning('存在重复添加的标签组件');
        }

        this.btnLoading = false;
        this.showAddTemplateDialog = false;
    }

    private reset() {
        this.portraitList = [];
    }

    // ========== session storage ==========

    private getPortrait() {
        const subjectId = this.curSubject?.id;
        if (!subjectId) {
            return;
        }
        if (this.portraitCache.hasOwnProperty(subjectId)) {
            this.portraitList = this.portraitCache[subjectId];
        } else {
            this.searchTemplate();
        }
    }
    private updatePortrait() {
        const subjectId = this.curSubject?.id;
        const payload = {
            subjectId: subjectId,
            portraitList: this.portraitList,
        };
        console.log('---------', payload);
        this.$store.commit('setPortraitFile', payload);
    }

    // ========== ajax request  ==========

    private portraitTemplate() {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/portrait/template/query';
            const data = {
                subjectId: this.curSubject?.id,
                portraitCateType: 2,
            };
            this.$api
                .get(url, data)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private beforeDestroy() {
        this.eventId.forEach((event: any) => {
            this.$bus.$off(event.event, event.id);
        });
    }
}
</script>
<style lang="scss" scoped>
.portrait-preview {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .action {
        width: 100%;
        height: 58px;
        display: flex;
        align-items: center;
        padding: 0 0 0 12px;
        .text {
            flex: 1 1 auto;
            .line {
                width: 3px;
                height: 13px;
                background: #396bf6;
                margin-right: 10px;
                display: inline-block;
                position: relative;
                top: 1px;
            }
        }
        .crowd-num {
            margin-left: 10px;
            font-size: 0.875rem;
            color: #333;
        }
    }

    .portrait-list {
        width: 100%;
        height: calc(100% - 58px);
        border-top: 1px #eaf0f9 solid;
        position: relative;
        overflow-y: auto;
        // display: flex;
        // flex-wrap: wrap;
        /*padding: {*/
        /*    left: 10px;*/
        /*    right: 10px;*/
        /*}*/
        // justify-content: space-around;
        // align-content: flex-start;
        .item {
            display: inline-block;
            width: 50%;
            height: 375px;
            border-right: 1px #eaf0f9 solid;
            border-bottom: 1px #eaf0f9 solid;
            &:nth-child(2n + 0) {
                border-right: 0;
            }

            @media screen and (max-width: 1200px) {
                width: 100%;
                border-right: 0;
            }
        }
    }
}
</style>
