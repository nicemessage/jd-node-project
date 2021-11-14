<template>
    <div class="portrait-preview">
        <div class="action">
            <span class="action-l">
                <span class="title">画像</span>
                <!--                <span class="crowd-num" v-show="crowdNum >= 0">{{ `群体数量：${crowdNum}` }}</span>-->
            </span>
            <span class="action-r">
                <el-button-group>
                    <el-button size="mini" plain @click="showAddTemplate">
                        <!--                        <i class="el-icon-plus"></i>-->
                        添加
                    </el-button>
                    <el-button size="mini" plain @click="searchTemplate">
                        <!--                        <i class="el-icon-refresh-left"></i>-->
                        重置
                    </el-button>
                    <el-button size="mini" plain @click="cleanAll">
                        <!--                        <i class="el-icon-delete"></i>-->
                        清空
                    </el-button>
                    <el-button size="mini" plain @click="analysis" type="primary" style="border-left:1px #abc3ff solid; ">
                        <!--                        <i class="el-icon-delete"></i>-->
                        分析
                    </el-button>
                </el-button-group>
            </span>
        </div>
        <div class="portrait-list">
            <div class="item" v-for="(item, index) of portraitList" :key="index">
                <PortraitItem :template="item" :crowd="crowd" :indexType="true" :plain="false"></PortraitItem>
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

// 公共类引入

// 私有组件引入
import PortraitItem from '@/components/PortraitItem.vue';
import EnumSelect from '@/components/SelectEnumWithComponent.vue';

// 私有类引入

// 本地定义和声明

@Component({
    components: {
        PortraitItem,
        EnumSelect,
    },
})
export default class PortraitPreview extends Vue {
    @State(state => state.curSubject) curSubject!: any | null;

    @Watch('curSubject')
    private subjectChange() {
        this.getPortrait();
    }

    @State(state => state.portrait) portraitCache: any;
    @State(state => state.portraitCode) portraitCodeCache: any;

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

    get code() {
        if (this.$route.query.code) {
            return this.$route.query.code;
        }
        return false;
    }

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
            this.portraitList = [];
            this.$nextTick(() => {
                this.portraitList = res.templates;
                this.updatePortrait();
            });
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
    }

    private getExpress() {
        return (this.$parent as any).getCrowdDefine();
    }

    private showAddTemplate() {
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
        if (subjectId === null || subjectId === undefined) {
            return;
        }
        if (this.code && this.portraitCodeCache.hasOwnProperty(subjectId)) {
            this.portraitList = this.portraitCodeCache[subjectId];
        } else if (!this.code && this.portraitCache.hasOwnProperty(subjectId)) {
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
        if (this.code) {
            this.$store.commit('setPortraitCode', payload);
        } else {
            this.$store.commit('setPortrait', payload);
        }
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
        console.log('===================== beforeDestroy');
    }
}
</script>
<style lang="scss" scoped>
.portrait-preview {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 18px 20px;

    .action {
        width: 100%;
        min-height: 50px;
        border-bottom: 1px solid #eaf0f9;
        overflow: auto;

        .action-l {
            float: left;
            padding-bottom: 5px;
        }

        .action-r {
            float: right;
            padding-bottom: 5px;

            i {
                margin-right: 5px;
            }
        }

        .title {
            position: relative;
            font-size: 1rem;
            font-weight: bold;
            color: #1b1b1b;
            cursor: default;
            padding-left: 10px;
            height: 32px;
            line-height: 32px;
            &:before {
                position: absolute;
                content: ' ';
                width: 3px;
                height: 12px;
                overflow: hidden;
                left: 0;
                top: 4px;
                background: #3a57fe;
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
        position: relative;
        overflow-y: auto;
        /*padding: {*/
        /*    left: 10px;*/
        /*    right: 10px;*/
        /*}*/

        .item {
            display: block;
            width: 100%;
            height: 350px;

            border-bottom: 1px solid #eaf0f9;
        }
    }
}
</style>
