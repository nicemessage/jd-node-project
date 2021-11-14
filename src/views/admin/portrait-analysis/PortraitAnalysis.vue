<template>
    <div class="portrait-analysis">
        <div class="header">
            <div class="subject-list">
                <SysSubject> </SysSubject>
            </div>
        </div>
        <div class="body">
            <template>
                <div class="action">
                    <div class="category-list" id="dragBox" v-show="portraitCateType == 1">
                        <div
                            class="category-item hover"
                            :id="`#${category.id}`"
                            :class="{ active: category.id == curCategory }"
                            v-for="category of categoryList"
                            :key="category.id"
                            @click="curCategory = category.id"
                        >
                            {{ category.portraitCateName }}
                            <i class="el-icon-close" @click="deleteCategory(category.id)"></i>
                        </div>
                    </div>
                    <div class="tools">
                        <!-- <div class="search-tag-btn" v-show="false">
              <el-select
                v-model="selectCrowd"
                placeholder="请输入群体名称/群体编码"
                value-key="id"
                filterable
                remote
                clearable
                prefix-icon="el-icon-search"
                size="small"
                :remote-method="crowdGetAll"
                :loading="selectLoading"
              >
                <el-option v-for="item in crowdList" :key="item.id" :label="item.crowdName" :value="item"> </el-option>
              </el-select>
            </div> -->
                        <div class="btns">
                            <template>
                                <el-button
                                    v-show="categoryList.length < 10 && portraitCateType == 1"
                                    type="primary"
                                    size="small"
                                    @click="categoryDialog = true"
                                    >添加分类</el-button
                                >
                                <el-button
                                    type="primary"
                                    size="small"
                                    v-show="portraitList.length < 8 && categoryList.length > 0"
                                    @click="showAddTemplate"
                                    >添加模板</el-button
                                >
                                <!-- <el-button type="primary" size="small" @click="updateTemplate">保存模版</el-button> -->
                            </template>
                            <!-- <div class="spacer"></div>
               <el-dropdown size="small" split-button type="primary" @command="handleCommand">
                下载
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click="downloadPicture" command="download">下载图表</el-dropdown-item>
                  <el-dropdown-item>下载Excel</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
                        </div>
                    </div>
                </div>
                <div class="portrait-list no-data" v-if="!curCategory">
                    <NoData label="请配置分类" style="margin-top:100px;"></NoData>
                </div>
                <div class="portrait-list" v-else-if="portraitList.length > 0" v-loading="btnLoading">
                    <div class="item" v-for="(item, index) of portraitList" :key="index">
                        <PortraitItem :template="item" :plain="false" :crowd="selectCrowd"></PortraitItem>
                    </div>
                </div>
                <div class="portrait-list" v-else-if="showSaveBtn">
                    <div class="item">
                        <div class="no-data">
                            <NoData label="请配置模板" style="margin-top:100px;"></NoData>
                        </div>
                    </div>
                </div>
                <div class="portrait-list no-data" v-else>
                    <NoData label="请配置模板" style="margin-top:100px;"></NoData>
                </div>
            </template>
            <!-- <template v-else>
        <div class="no-category">
          <NoData label="暂无可用画像分类"></NoData>
        </div>
      </template> -->
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showAddTemplateDialog" width="1000px">
            <div slot="title" class="dialog-title">
                添加自定义模板
                <el-input v-model="tagName" placeholder="请输入标签名称/标签编码/标签描述" @input="tagQuery" @change="tagQuery" clearable size="mini" style="width: 260px;margin-left: 20px;">
                    <i slot="prefix" class="el-input__icon el-icon-search" @click="tagQuery"></i>
                </el-input>
            </div>
            <template v-if="showAddTemplateDialog">
                <EnumSelect v-model="enumList" ref="ES"></EnumSelect>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showAddTemplateDialog = false">取 消</el-button>
                <el-button type="primary" :loading="btnLoading" @click="addNewTemplate">添加</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="新增画像分类" :visible.sync="categoryDialog" @close="closeCateDialog" width="600px">
            <el-form :model="cateParam" :rules="cateRules" ref="cateForm" style="padding: 30px 30px 10px 30px;">
                <el-form-item label="分类名称：" label-width="120px" prop="portraitCateName">
                    <el-input v-model="cateParam.portraitCateName" maxlength="15" show-word-limit placeholder="请输入分类名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeCateDialog">取 消</el-button>
                <el-button type="primary" @click="addCategory">确 定</el-button>
            </div>
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
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入
import SysSubject from '@/components/SysSubject.vue';
import PortraitItem from './PortraitItem.vue';
// import PortraitItem from '@/components/PortraitItem.vue';
import EnumSelect from '@/components/SelectEnumWithComponent.vue';
import NoData from '@/components/NoDataIcon.vue';
import Sortable from 'sortablejs';

// 公共类引入
import html2canvas from 'html2canvas';

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
    @Prop({ type: Number || String }) portraitCateType?: number | string;
    @State(state => state.curSubject) curSubject!: Subject | null;
    @Watch('curSubject')
    private subjectChange() {
        this.curCategory = null;
        this.selectCrowd = 'qqq';
        this.crowdList = [];
        this.getCategory();
    }
    private categoryDialog: boolean = false;
    private selectCrowd: any | null = 'agiletag';

    private btnLoading: boolean = false;

    private curCategory: number | null = null;
    @Watch('curCategory')
    private categoryChange() {
        this.getPortrait();
    }

    @Watch('categoryList')
    private categoryListChange() {
        console.log(this.categoryList);
    }
    private selectLoading: boolean = false;
    private crowdList: any = [];

    private categoryList: any = [];

    private portraitList: any = [];

    private showAddTemplateDialog: boolean = false;
    private enumList: Array<any> = [];

    // 标签查询
    private tagName: any | null = null;
    private tagQuery() {
        (this.$refs['ES'] as any).tagNameQuery(this.tagName);
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

    private mounted() {
        // this.addMonitor();
        this.init();
        this.$bus.$off('chart-type-item', 1);
        this.$bus.$on('chart-type-item', (obj:any) => {
            const idx = this.portraitList.findIndex((item: any) => {
                return item.tagCode == obj.tagCode;
            });
            const index = this.chartTypeMap.findIndex((item: any) => {
                return item.value == obj.chartTypeName;
            });
            if (idx >= 0) {
                this.portraitList.splice(idx, 1, Object.assign(this.portraitList[idx],{chartType:index}));
            }
            this.updateTemplate("1");
        });
    }

    private addMonitor() {
        this.$bus.$off('remove-portrait-item', 1);
        this.$bus.$on('remove-portrait-item', (tagCode: string) => {
            const idx = this.portraitList.findIndex((item: any) => {
                return item.tagCode == tagCode;
            });
            if (idx >= 0) {
                this.portraitList.splice(idx, 1);
            }
            this.updateTemplate();
        });
    }

    private removeItem(tagId: string) {
        const idx = this.portraitList.findIndex((item: any) => {
            return item.id == tagId;
        });
        if (idx >= 0) {
            this.portraitList.splice(idx, 1);
        }
        this.updateTemplate();
    }

    private init() {
        // console.log(this.portraitCateType, this.categoryList.length);
        if (!this.curSubject?.id) {
            return setTimeout(this.init, 500);
        }
        if (this.portraitCateType == 1) {
            this.dragList();
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
        this.btnLoading = true;
        this.portraitList = [];
        this.portraitTemplate(this.curCategory)
            .then((res: any) => {
                // const templateList = res.templates;
                this.portraitList = res.templates;
            })
            .finally(() => {
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
        const list = this.buildFragment();
        if (this.portraitList.length + list.length > 8) {
            this.$message.warning('最多添加8个模板');
            return false;
        }
        list.forEach((fragment: any) => {
            const index: number = this.portraitList.findIndex((tag: any) => {
                return tag.tagCode === fragment.tagCode;
            });
            if (index !== -1) this.portraitList.splice(index, 1);
            this.portraitList.push(fragment);
        });
        this.updateTemplate().then(() => {
            this.getPortrait();
            this.showAddTemplateDialog = false;
        });
    }

    private buildFragment() {
        const list: any = [];
        this.enumList.forEach((item: any) => {
            const newItem: any = {
                portraitCateType: this.portraitCateType,
                subjectId: this.curSubject?.id,
                crowdCode: this.selectCrowd,
                tagCode: item.tagCode,
                tagEnums: [],
                tagVal: item.tagVal
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

    private updateTemplate(type?:any) {
        console.log('调用更更新接口');
        return new Promise(resolve => {
            if (!this.curCategory) {
                return;
            }
            this.btnLoading = true;
            const templates = this.buildTemplates();
            // console.log(templates);
            this.templateUpdate(this.curCategory, templates)
                .then(() => {
                    if(type != '1'){
                        this.$message.success('模板更新成功');
                    }
                    resolve('成功');
                })
                .finally(() => {
                    this.btnLoading = false;
                    resolve('成功');
                });
        });
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

    private autoSetChartType(obj:any) {
        if(obj.chartType == 0 || obj.chartType){
            return obj.chartType;
        }
        const idx = Math.ceil(Math.random() * 4);
        if (!this.chartTypeMap[idx]) {
            return 0;
        } else {
            return idx;
        }
    }

    private buildTemplates() {
        const list: any = [];
        this.portraitList.forEach((item: any) => {
            const newItem: any = {
                id: item.id ? item.id : '',
                tagCode: item.tagCode,
                tagVals: [],
                chartType: this.autoSetChartType(item)
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

    private checkName(rule: any, value: any, callback: any) {
        console.log(this.categoryList);
        if (!value) {
            return callback(new Error('名称不能为空'));
        } else {
            this.categoryList.forEach((t1: any) => {
                if (t1.portraitCateName === value) {
                    return callback(new Error('名称不可重复'));
                }
            });
            callback();
        }
    }
    private cateRules: any = {
        portraitCateName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
            { validator: this.checkName, message: '名称不可与已有分类名称重复', trigger: 'blur' }
        ]
    };
    private cateParam: object = {
        portraitCateName: '',
        portraitCateType: '',
        subjectId: ''
    };
    private addCategory() {
        Object.assign(this.cateParam, { portraitCateType: this.portraitCateType, subjectId: window.sessionStorage.getItem('subjectId') });
        (this.$refs.cateForm as any).validate((valid: any) => {
            if (valid) {
                this.$api.post('/api/admin/portrait/category/add', this.cateParam).then((res: any) => {
                    this.$message.success('保存成功');
                    this.categoryDialog = false;
                    this.init();
                });
            }
        });
    }
    private closeCateDialog() {
        (this.$refs.cateForm as any).resetFields();
        this.categoryDialog = false;
    }

    private deleteCategory(id: number | string) {
        this.$confirm('此操作将永久删除该画像分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
                this.$api.get('/api/admin/portrait/category/del', { id: id }).then((res: any) => {
                    this.$message.success('删除成功');
                    this.init();
                });
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
    }
    private startId: number | string = '';
    private endId: number | string = '';
    private dragList() {
        const list = document.getElementById('dragBox');
        // console.log(list);
        if (list) {
            Sortable.create(list as any, {
                // 拖拽移动的时候
                onMove: function(/** Event */ event: any /** Event */) {
                    this.startId = event.dragged.id.split('#')[1];
                    this.endId = event.related.id.split('#')[1];
                    // console.log(this.startId, this.endId);

                    return true;
                }.bind(this),
                onEnd: function() {
                    const sortList: any[] = [];
                    list.querySelectorAll('.category-item').forEach((item: any, index: number) => {
                        sortList.push({
                            id: item.id.split('#')[1],
                            portraitCateSort: index
                        });
                    });
                    console.log(sortList, JSON.stringify({ sortList: sortList }));
                    this.updateSort({ sortList: sortList });
                }.bind(this)
            });
        }
    }
    private updateSort(sortList: any) {
        this.$api.post('/api/admin/portrait/category/sort', sortList).then((res: any) => {
            this.$message.success('排序更新成功');
        });
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
            const url = '/api/admin/portrait/category/query';
            const data = {
                subjectId: this.curSubject?.id,
                portraitCateType: this.portraitCateType
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(
                        res
                        //   .filter((item: any) => {
                        //     return item.portraitCateType == this.portraitCateType; // return item.portraitCateType != 2;
                        //   })
                        //   .sort((a: any, b: any) => {
                        //     return b.portraitCateType - a.portraitCateType;
                        //   })
                    );
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private portraitTemplate(portraitCateId: number) {
        return new Promise((resolve, reject) => {
            const url = '/api/admin/portrait/template/query';
            const data = {
                subjectId: this.curSubject?.id,
                portraitCateType: this.portraitCateType,
                portraitCateId: portraitCateId
            };
            this.$bus.$emit('main-loading', true);
            this.$api
                .get(url, data)
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    resolve(res);
                })
                .catch(err => {
                    this.$bus.$emit('main-loading', false);
                    reject(err);
                });
        });
    }

    private crowdGetAll(keyword: string) {
        const url = '/api/ava/crowd/getAll';
        const data = {
            subjectId: this.curSubject?.id
        };
        if (keyword) {
            Object.assign(data, {
                keyword: keyword
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
            const url = '/api/admin/portrait/template/update';
            const data = {
                portraitCateId: portraitCateId,
                portraitCateType: this.portraitCateType,
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
.dialog-title {
    font-size: 16px;
    font-weight: 800;
}
.portrait-analysis {
    width: 100%;
    height: 100%;
    background-color: #f9fafd;
    position: relative;
    overflow: hidden;

    .header {
        width: 100%;
        height: 64px;
        display: flex;
        border-bottom: 1px solid #EAF0F9;
        .subject-list {
            width: calc(100% - 300px);
            height: 64px;
        }
    }
    .body {
        width: 100%;
        height: 100%;
        padding:14px 20px;
        box-sizing: border-box;
        overflow-y: auto;
        background-color: #f9fafd;

        .action {
            width: 100%;
            padding: 0px 0.4rem;
            margin-bottom: 10px;
            height: 30px;
            // display: flex;
            // flex-wrap: wrap;
            // justify-content: space-between;
            // align-items: center;

            .category-list {
                float: left;
                height: 32px;
                display: flex;
                margin-bottom: 10px;

                .category-item {
                    width: auto;
                    padding: 8px 20px;
                    font-size: 0.75rem;
                    background: rgba(255, 255, 255, 1);
                    color: rgba(57, 107, 246, 1);
                    cursor: pointer;

                    &.active {
                        color: rgba(255, 255, 255, 1);
                        background: rgba(57, 107, 246, 1);
                        box-shadow: 0px 2px 4px 0px rgba(125, 125, 125, 0.5);
                    }
                }
                .hover {
                    i {
                        visibility: hidden;
                    }
                    &:hover {
                        i {
                            visibility: inherit;
                        }
                    }
                }
            }
            .tools {
                float: right;
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
