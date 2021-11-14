<template>
    <div class="portrait-analysis">
        <div class="header">
            <div class="search-tool">
                <div class="search-item">
                    <SysSubject></SysSubject>
                </div>
                <div class="spacer"></div>
                <div class="search-item horizontal-center float-right" style="width: 500px">
                    群体选择：
                    <el-select
                            v-model="selectCrowd"
                            placeholder="请选择待分析群体"
                            value-key="id"
                            filterable
                            remote
                            clearable
                            prefix-icon="el-icon-search"
                            size="small"
                            @change="selectCrowdQuery"
                            @focus="crowdGetAll"
                            :remote-method="crowdGetAll"
                            :loading="selectLoading"
                            :disabled="disabled"
                             style="width: 300px"
                    >
                        <el-option v-for="item in crowdList" :key="item.id" :label="item.crowdName" :value="item"> </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="body">
            <template v-if="categoryList.length > 0">
                <div class="action">
                    <div class="row">
                        <div class="category-list">
                            <div
                                class="category-item"
                                :class="{ active: category.id == curCategory }"
                                v-for="category of categoryList"
                                :key="category.id"
                                @click="curCategory = category.id"
                            >
                                {{ category.portraitCateName }}
                            </div>
                        </div>
                        <div class="btns">
                            <template v-if="showSaveBtn">
                                <el-button type="primary" size="small" @click="showAddTemplate" class="el-icon-plus"> 自定义画像</el-button>
                                <div class="spacer"></div>
                                <el-button size="small" @click="updateTemplate">保存模版</el-button>
                            </template>
                            <div class="spacer"></div>
                            <el-dropdown size="small" split-button @command="handleCommand">
                                下载
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click="downloadPicture" command="download">下载图表</el-dropdown-item>
                                    <!-- <el-dropdown-item>下载Excel</el-dropdown-item> -->
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
                <div class="portrait-list no-data" v-if="!curCategory">
                    <NoData label="未选择模板分类"></NoData>
                </div>
                <div class="portrait-list" v-else-if="portraitList.length > 0 && updateDom && portraitLoad" v-loading="btnLoading">
                    <div class="item" v-for="(item, index) of portraitList" :key="index">
                        <PortraitItem @onload="chartOnload(index)" :template="item" :plain="false" :showLegend="true" :crowd="selectCrowd" :indexItem="index" :indexType="index < activeChartIndex"></PortraitItem>
<!--                        </template>-->
<!--                        <template v-else>-->
<!--                            <div class="loading-text" v-if="selectCrowd"><img data-v-5a334454="" src="/static/img/no-data.3d20d626.svg" alt=""><p>【{{item.tagVal}}】等待加载</p></div>-->
<!--                            <div class="loading-text" v-else><img data-v-5a334454="" src="/static/img/no-data.3d20d626.svg" alt=""><p>暂无数据，请选择群体</p></div>-->
<!--                        </template>-->
                    </div>
                </div>
                <div class="portrait-list no-data" v-else-if="showSaveBtn">
                    <NoData label="请选择群体，并添加自定义画像"></NoData>
                </div>
                <div class="portrait-list no-data" v-else>
                    <NoData label="等待后台配置模版"></NoData>
                </div>
            </template>
            <template v-else>
                <div class="no-category">
                    <NoData label="暂无可用画像分类"></NoData>
                </div>
            </template>
        </div>
        <el-dialog :close-on-click-modal="false" :before-close="beforeClose" :visible.sync="showAddTemplateDialog" width="1000px">
            <div slot="title" class="dialog-title">
                添加自定义模板
                <el-input v-model="tagName" placeholder="请输入标签名称/标签编码/标签描述" @keyup.enter.native="tagQuery" clearable size="mini" style="width: 260px;margin-left: 20px;margin-right: 10px;">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button size="mini" type="primary" @click="tagQuery">搜索</el-button>
            </div>
            <template v-if="showAddTemplateDialog">
                <EnumSelect v-model="enumList" ref="ES"></EnumSelect>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="beforeClose">取 消</el-button>
                <el-button size="small" type="primary" :loading="btnLoading" @click="addNewTemplate">添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/**
 * @name PortraitAnalysis
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入
import SysSubject from '@/components/SysSubject.vue';
import PortraitItem from '@/components/PortraitItem.vue';
import EnumSelect from '@/components/SelectEnumWithComponent.vue';
import NoData from '@/components/NoDataIcon.vue';

// 公共类引入
import html2canvas from 'html2canvas';
// import Template from "@/Template.vue";
// import * as tools from '@/assets/utils/tools';
import {getArrayObj} from '@/assets/utils/tools';

// 私有组件引入

// 私有类引入

// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

@Component({
    components: {
        SysSubject,
        PortraitItem,
        EnumSelect,
        NoData
    }
})
export default class PortraitAnalysis extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;
    @Watch('curSubject')
    private subjectChange() {
        this.curCategory = null;
        this.selectCrowd = null;
        this.crowdList = [];
        this.activeChartIndex = 2;
        this.getCategory();
    }

    private selectCrowd: any | null = null;
    @Watch('selectCrowd')
    private selectCrowdChange() {
        this.portraitLoad = false;
        setTimeout(()=>{
            this.portraitLoad = true;
            if(this.selectCrowd){
                this.activeChartIndex = 2;
            }else{
                this.activeChartIndex = 0;
            }
        }, 50);
    }

    private btnLoading: boolean = false;
    private updateDom: boolean = true;
    private disabledClear: boolean = false;
    private portraitLoad: boolean = true;

    private curCategory: number | null = null;
    @Watch('curCategory')
    private categoryChange() {
        this.getPortrait();
    }

    private selectLoading: boolean = false;
    private crowdList: any = [];
    // 标签查询
    private tagName: any | null = null;
    private tagQuery() {
        (this.$refs['ES'] as any).tagNameQuery(this.tagName);
    }
    private beforeClose() {
        this.tagName = '';
        this.showAddTemplateDialog = false
    }

    private selectCrowdQuery () {
        this.updateDom = false;
        this.activeChartIndex = 2;
        if(this.selectCrowd.crowdType == 2){
            console.log(this.selectCrowd);
            const crowdDefineDesc:any = JSON.parse(this.selectCrowd.crowdDefineDesc);
            const crowdDefine:any = JSON.parse(this.selectCrowd.crowdDefine);
            this.$bus.$emit('main-loading',true);
            this.$api.get('/api/ava/portrait/url', {"fileName":crowdDefineDesc.name}).then((res: any) => {
                this.$bus.$emit('main-loading',false);
                crowdDefine.fileUrl = res;
                this.selectCrowd.crowdDefine = JSON.stringify(crowdDefine);
                this.$nextTick();
                this.updateDom = true
                this.disabledClearQuery();
            });
        }else{
            this.$nextTick();
            this.updateDom = true
            this.disabledClearQuery();
        }
        console.log(this.selectCrowd);

    }

    private disabledClearQuery () {
        this.disabledClear = false;
        window.setTimeout(()=>{
            this.disabledClear = true;
        },30000);
    }

    private categoryList: any = [];

    private portraitList: any = [];

    private activeChartIndex: number = 0;

    //按顺序加载
    private chartOnload(index: number) {
        console.log(`加载完毕第${index+1}个,共${this.portraitList.length}`);
        this.activeChartIndex++;
    }

    private showAddTemplateDialog: boolean = false;
    private enumList: Array<any> = [];

    get disabled() {
        if (!this.selectCrowd) {
            return false;
        }
        if (this.disabledClear) {
            return false;
        }
        if (this.portraitList.length >= this.activeChartIndex) {
            return true;
        } else {
            this.disabledClear = true;
        }
        return false;
    }

    get showSaveBtn() {
        if (!this.curCategory) {
            return false;
        }
        const category = this.categoryList.find((item: any) => {
            return item.portraitCateType == 3;
        });
        if (!category) {
            return false;
        }
        return category.id == this.curCategory;
    }

    private chartTypeMap: any = [
        {
            label: '柱状图',
            value: 'bar'
        },
        {
            label: '折线图',
            value: 'line'
        },
        {
            label: '散点图',
            value: 'scatter'
        },
        {
            label: '环形图',
            value: 'ring'
        }
    ];

    get autoSetChartType() {
        const idx = Math.ceil(Math.random() * 4);
        if (!this.chartTypeMap[idx]) {
            return 0;
        } else {
            return idx;
        }
    }

    private mounted() {
        this.addMonitor();
        this.init();
    }

    private addMonitor() {
        this.$bus.$on('remove-portrait-item', (tagCode: string) => {
            const idx = this.portraitList.findIndex((item: any) => {
                return item.tagCode == tagCode;
            });
            if (idx >= 0) {
                this.portraitList.splice(idx, 1);
            }
        });

        this.$bus.$on('chart-type', (chartType: any,i:number) => {
            if((chartType || chartType == 0) && this.portraitList[i]) {
                this.portraitList[i].chartType = chartType;
            }
        });
        this.$bus.$on('remove-tag-name', () => {
            this.tagName = '';
        });
    }

    private init() {
        if (!this.curSubject) {
            return setTimeout(this.init, 500);
        }

        this.getCategory();
    }

    private getCategory() {
        this.portraitList = [];
        this.categoryQuery().then((res: any) => {
            this.categoryList = res;
            if (res.length > 0) {
                this.curCategory = res[0].id;
            }
        });
    }

    private getPortrait() {
        if (!this.curCategory) {
            return;
        }
        this.selectCrowdChange();

        this.btnLoading = true;
        this.portraitList = [];
        // this.loading = true;
        this.$bus.$emit('main-loading', true);
        this.portraitTemplate(this.curCategory, this.showSaveBtn ? 3 : 1)
            .then((res: any) => {
                // this.loading = false;
                this.$bus.$emit('main-loading', false);
                const templateList = res.templates;
                this.portraitList = res.templates;
            })
            .catch(err => {
                this.$bus.$emit('main-loading', false);
            })
            .finally(() => {
                this.$bus.$emit('main-loading', false);
                this.btnLoading = false;
            });
    }

    private showAddTemplate() {
        this.showAddTemplateDialog = true;
        this.enumList = [];
    }

    private async addNewTemplate() {
        if (!this.curCategory) {
            return;
        }
        if (!this.showSaveBtn) {
            return;
        }
        const list = this.buildFragment();
        // console.log(list);
        // console.log(this.portraitList);
        if(list.length == 0){
            this.$message(`请添加标签！`);
            return false;
        }

        for(const i in this.portraitList){
            const obj:any = getArrayObj(list,'tagVal',this.portraitList[i].tagVal);
            if(obj){
                this.$message(`标签【${obj.tagVal}】已经存在，不能重复添加！`);
                return;
            }
        }
        list.forEach((fragment: any) => {
            this.portraitList.push(fragment);
        });
        this.showAddTemplateDialog = false;
    }

    private buildFragment() {
        const list: any = [];
        this.enumList.forEach((item: any) => {
            const newItem: any = {
                portraitCateType: 1,
                subjectId: this.curSubject?.id,
                crowdCode: this.selectCrowd,
                tagCode: item.tagCode,
                tagEnums: [],
                tagVal: item.tagVal,
                chartType: this.autoSetChartType
            };
            item.enums.forEach((enumItem: any) => {
                newItem.tagEnums.push({
                    key: enumItem.tagEnumVal,
                    value: enumItem.tagEnumName
                });
            });
            list.push(newItem);
        });
        return list;
    }

    private updateTemplate() {
        if (!this.curCategory) {
            return;
        }

        this.btnLoading = true;
        const templates = this.buildTemplates();
        // console.log(templates);
        this.templateUpdate(this.curCategory, templates)
            .then(() => {
                this.$message.success('模板更新成功');
            })
            .finally(() => {
                this.btnLoading = false;
            });
    }

    private buildTemplates() {
        const list: any = [];
        console.log(this.portraitList);
        this.portraitList.forEach((item: any) => {
            const newItem: any = {
                id: item.id ? item.id : '',
                tagCode: item.tagCode,
                tagVals: [],
                chartType:item.chartType
            };
            item.tagEnums.forEach((tagEnum: any) => {
                newItem.tagVals.push(tagEnum.key);
            });
            list.push(newItem);
        });
        return list;
    }

    private handleCommand(command: string) {
        switch (command) {
            case 'download':
                this.downloadPicture();
                break;
            default:
                return;
        }
    }

    // ========== download request  ==========

    private dataURLToBlob(dataurl: string) {
        const arr: any = dataurl.split(',');
        const mime: any = arr[0].match(/:(.*?);/)[1];
        const bstr: any = atob(arr[1]);
        let n: any = bstr.length;
        const u8arr: any = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    private downloadPicture() {
        const _canvas: any = document.getElementsByClassName('portrait-list')[0];
        console.log(_canvas);
        const width: any = _canvas.offsetWidth;
        const height: any = _canvas.offsetHeight;
        console.log(width, height);
        if (width == 0 || height == 0) {
            this.$message({
                type: 'error',
                message: '截图生成失败'
            });
            return true;
        }
        const canvas2: any = document.createElement('canvas');
        const scale: any = 1;
        canvas2.width = width * scale;
        canvas2.height = height * scale;
        const context1: any = canvas2.getContext('2d');
        if (context1) {
            context1.scale(scale, scale);
        }
        const opts: any = {
            scale,
            canvas: canvas2,
            // dpi: 300,//导出pdf清晰度
            allowTaint: false,
            //Whether to test each image if it taints the canvas before drawing them
            taintTest: false,
            // 【重要】开启跨域配置
            width: width, //dom 原始宽度
            height: height,
            useCORS: true
        };

        const category = this.categoryList.find((item: any) => {
            return item.id == this.curCategory;
        });

        const a: any = document.createElement('a');
        html2canvas(_canvas, opts).then((canvas: any) => {
            const context = canvas.getContext('2d');
            // 【重要】关闭抗锯齿
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;

            const dom = document.body.appendChild(canvas);
            dom.style.display = 'none';
            a.style.display = 'none';
            document.body.removeChild(dom);
            const blob: any = this.dataURLToBlob(dom.toDataURL('image/png'));
            a.setAttribute('href', URL.createObjectURL(blob));
            //这块是保存图片操作  可以设置保存的图片的信息
            a.setAttribute('download', `${category.portraitCateName}.png`);
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(blob);
            document.body.removeChild(a);
        });
    }

    // ========== ajax request  ==========

    private categoryQuery() {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/portrait/category/query';
            const data = {
                subjectId: this.curSubject?.id
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(
                        res
                            .filter((item: any) => {
                                return item.portraitCateType != 2;
                            })
                            .sort((a: any, b: any) => {
                                return a.portraitCateType - b.portraitCateType;
                            })
                    );
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private portraitTemplate(portraitCateId: number, portraitCateType = 1) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/portrait/template/query';
            const data = {
                subjectId: this.curSubject?.id,
                portraitCateType: portraitCateType,
                portraitCateId: portraitCateId
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
    /*群里-查询所有记录*/
    private crowdGetAll(type:string) {
        const url = '/api/ava/crowd/getAll';
        const data = {
            subjectId: this.curSubject?.id,
            keyword:''
        };
        if (!type.isTrusted) {
            Object.assign(data, {
                keyword: type
            });
        }
        this.selectLoading = true;
        this.$api
            .get(url, data)
            .then(res => {
                this.crowdList = res;
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.selectLoading = false;
            });
    }

    private templateUpdate(portraitCateId: number, templates: any) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/portrait/template/update';
            const data = {
                portraitCateId: portraitCateId,
                portraitCateType: 3,
                subjectId: this.curSubject?.id,
                templates: templates
            };
            this.$api
                .post(url, data)
                .then(res => {
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
.portrait-analysis {
    width: 100%;
    height: 100%;
    // background-color: #f9fafd;
    position: relative;
    overflow: hidden;
    .loading-text{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #bdbdbd;
        img {
            width: 84px;
            height: 84px;
            margin-bottom: 10px;
            display: block;
        }
    }
    .header {
        width: 100%;
        height: 60px;
        padding: 0px 20px 0 0;
        border-bottom: 1px solid #EAF0F9;

        .search-tool {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            align-items: center;

            .search-item {
                flex: 0 0 auto;
                margin-left: 20px;
                display: flex;

                &:first-child {
                    margin-left: 0px;
                }

                &.col150 {
                    width: 150px;
                }

                &.col300 {
                    width: 300px;
                }
                &.horizontal-center{
                    line-height: 32px;
                }
                &.float-right{
                    display: flex;
                    justify-content: flex-end;
                }
            }

            .spacer {
                flex: 1 1 auto;
            }
            /deep/.el-input__inner{
                background: none;
            }
        }
    }
    .body {
        width: 100%;
        height: calc(100% - 68px);
        margin-top: 4px;
        padding: 10px 20px;
        box-sizing: border-box;
        overflow: auto;

        .action {
            width: 100%;
            padding: 0px 0.4rem;
            margin-bottom: 10px;
            // display: flex;
            // flex-wrap: wrap;
            // justify-content: space-between;
            // align-items: center;
            .row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 32px;
                .btns {
                    display: flex;
                    height: 100%;
                    .spacer {
                        width: 20px;
                    }
                }
            }
            .search {
                margin: 0px auto 10px;
                width: max-content;
                display: flex;
                &-title {
                    background-color: #396bf6;
                    color: #fff;
                    height: 32px;
                    width: 100px;
                    text-align: center;
                    line-height: 32px;
                    font-size: 14px;
                    border-radius: 5px 0px 0px 5px;
                }
                /deep/ .el-input__inner {
                    border-color: #396bf6;
                    border-radius: 0px 5px 5px 0px;
                }
            }
            .category-list {
                // width: 100%;
                height: 32px;
                display: flex;
                // margin-bottom: 10px;

                .category-item {
                    width: auto;
                    line-height: 28px;
                    text-align: center;
                    cursor: pointer;
                    font-size: 1rem;
                    border-radius: 4px;

                    margin-right: 20px;

                    color: #84919E;

                    position: relative;

                    &.active {
                        color: #3E6AF6;
                        font-weight: bold;

                        &::after{
                            content: '';
                            height: 2px;
                            background-color: #3E6AF6;
                            position: absolute;
                            bottom: 0;
                            left: 10px;
                            right: 10px;
                            border-radius: 2px;
                        }
                    }
                }
            }
            .tools {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .btns {
                    display: flex;

                    .spacer {
                        width: 20px;
                    }
                }
            }
        }
        .portrait-list {
            padding: 0.4rem 0.4rem;
            width: 100%;
            position: relative;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .item {
                width: calc(50% - 10px);
                height: 400px;
                background: rgba(255, 255, 255, 1);
                margin-bottom: 20px;
            }
        }
    }
    .no-category,
    .no-data {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
