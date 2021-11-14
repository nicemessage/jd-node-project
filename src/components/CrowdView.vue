<template>
    <section class="crowd-view">
        <div class="top-btn">
            <el-button type="primary" class="com-button" @click="addView">添加画像</el-button>
            <el-button type="primary" class="com-button" @click="saveMyTem">保存我的模板</el-button>
            <el-button type="primary" class="com-button" @click="downPdf" :disabled="viewData.length > 0 ? false : true">PDF图表</el-button>
            <el-button type="primary" class="com-button" @click="downExcel" :disabled="viewData.length > 0 ? false : true">EXCEL明细</el-button>
        </div>
        <div class="view-section">
            <div class="view-content">
                <div class="view-box" v-for="(item, index) in viewData" :key="index">
                    <p class="bg"></p>
                    <view-tel :viewParams="Object.assign(item, { viewIndex: index })" @removeTel="removeTel" @modifyTel="modifyTel"></view-tel>
                </div>
            </div>
        </div>
        <view-tag v-if="tagDialog" :tagInfo="tagInfo" @close="closeTagDialog" @saveTem="saveTem"></view-tag>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ViewTel from '@/components/ViewTel.vue';
import ViewTag from '@/components/ViewTag.vue';
import * as tools from '@/assets/utils/tools';
import html2Canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import { saveAs } from 'file-saver';
@Component({
    components: {
        ViewTel,
        ViewTag
    }
})
export default class CrowdView extends Vue {
    @Prop({ type: String }) private exType?: string;
    private excelTem: string[] = ['标签名称', '枚举名称', '数量', '占比'];
    private crowdEx: string = sessionStorage.getItem('crowdEx') || '';
    private fileEx: string = sessionStorage.getItem('fileEx') || '';
    private viewTem: any[] = [];
    protected viewData: any[] = [];
    private tagDialog: boolean = false;
    private tagInfo: any = {
        busId: '',
        classId: [], //默认展开分类的id
        enumId: [], //选中的枚举id
        tagCode: ''
    };
    private async mounted(): Promise<void> {
        this.$store.commit('changeLoadingStatus', true);
        await Promise.all([this.getTemplate()]).finally(() => {
            this.$store.commit('changeLoadingStatus', false);
        });
    }
    private getTemplate() {
        return new Promise((resolve, reject) => {
            this.$api
                .get('/api/business/portrait/templateList')
                .then((res: any) => {
                    this.viewTem = res;
                    res.forEach((item: any) => {
                        this.handlerTem(item);
                    });
                    resolve();
                })
                .catch(() => {
                    this.$message.error('获取画像模板失败');
                    reject();
                });
        });
    }
    private handlerTem(item: any): void {
        const json: any = {
            viewEx: {
                version: '4.0',
                expressionId: '',
                expression: '',
                fileExpression: '',
                portraitElement: {
                    tagCode: item.tagCode,
                    portraitCol: {
                        colId: item.columnId,
                        colVals: []
                    },
                    type: 'PORTRAIT'
                },
                style: this.exType
            },
            viewInfo: {
                name: item.tagName,
                data: [],
                type: item.chartType
            }
        };
        switch (this.exType) {
            case 'PORTRAIT':
                json.viewEx.expression = this.crowdEx ? JSON.parse(this.crowdEx) : '';
                delete json.viewEx.expressionId;
                delete json.viewEx.fileExpression;
                break;
            case 'BITMAP_PORTRAIT':
                json.viewEx.expressionId = this.$route.query.id || '';
                delete json.viewEx.expression;
                delete json.viewEx.fileExpression;
                break;
            case 'FILE_PORTRAIT':
                json.viewEx.fileExpression = this.fileEx ? JSON.parse(this.fileEx) : '';
                delete json.viewEx.expressionId;
                delete json.viewEx.expression;
                break;
        }
        item.tagEnums.forEach((data: any) => {
            json.viewEx.portraitElement.portraitCol.colVals.push(data.tagEnumVal);
            json.viewInfo.data.push({
                name: data.tagEnumName,
                id: data.tagEnumVal,
                value: 0,
                prop: '0%'
            });
        });
        const codeArr: any[] = [];
        this.viewData.forEach(data => {
            const codeData = {
                code: data.viewEx.portraitElement.tagCode,
                col: data.viewEx.portraitElement.portraitCol.colId
            };
            codeArr.push(codeData);
        });
        const obj = tools.getArrayObjDb(codeArr, 'code', item.tagCode, 'col', item.columnId);
        if (obj) {
            this.viewData.splice(obj.index, 1, json);
        } else {
            this.viewData.push(json);
        }
    }
    private addView(): void {
        this.$set(this.tagInfo, 'classId', []);
        this.$set(this.tagInfo, 'tagCode', '');
        this.$set(this.tagInfo, 'enumId', []);
        this.tagDialog = true;
    }
    private modifyTel(index: number): void {
        const arr: any[] = [];
        this.viewTem[index].tagEnums.forEach((item: any) => {
            arr.push(item.tagEnumVal);
        });
        const params: any = {
            tagCode: this.viewTem[index].tagCode
        };
        this.$api
            .get('/api/business/tag/queryTagPath', params)
            .then((res: any) => {
                if (res.list && res.list.length > 0) {
                    this.$set(this.tagInfo, 'busId', res.list[0].id);
                }
                this.$set(this.tagInfo, 'classId', res.path.split('/'));
                this.$set(this.tagInfo, 'tagCode', this.viewTem[index].tagCode);
                this.$set(this.tagInfo, 'enumId', arr);
                this.tagDialog = true;
            })
            .catch(() => {
                this.$message.error('获取数据失败');
            });
    }
    private removeTel(index: number): void {
        if (this.viewTem.length == 1) {
            this.$message('请至少保留一个模板');
            return;
        }
        this.viewTem.splice(index, 1);
        this.viewData.splice(index, 1);
        if (this.viewData[index]) {
            this.$set(this.viewData[index].viewInfo, 'isApi', false);
        }
    }
    private saveTem(tagTem: any[]): void {
        tagTem.forEach((tem: any) => {
            tem.tagShow.data.forEach((item: any) => {
                const template: any = {
                    chartType: 'LINE',
                    columnId: item.colId,
                    tagCode: tem.tagData.tagCode,
                    tagName: tem.tagShow.tagName,
                    tagEnums: []
                };
                for (let i = 0; i < item.val.length; i++) {
                    const enumData: any = {
                        tagEnumName: item.val[i],
                        tagEnumVal: item.code[i]
                    };
                    template.tagEnums.push(enumData);
                }
                const codeArr: any[] = [];
                this.viewTem.forEach(data => {
                    const codeData = {
                        code: data.tagCode,
                        col: data.columnId
                    };
                    codeArr.push(codeData);
                });
                const obj: any = tools.getArrayObjDb(codeArr, 'code', tem.tagData.tagCode, 'col', item.colId);
                if (template.tagEnums.length > 0) {
                    if (obj) {
                        this.viewTem.splice(obj.index, 1, template);
                    } else {
                        this.viewTem.push(template);
                    }
                } else {
                    if (obj) {
                        this.viewTem.splice(obj.index, 1);
                    }
                }
                this.handlerTem(template);
            });
        });
    }
    private closeTagDialog(): void {
        this.tagDialog = false;
    }
    private saveMyTem(): void {
        this.$store.commit('changeLoadingStatus', true);
        const paramsArr: any[] = [];
        this.viewTem.forEach(item => {
            const json: any = {
                portraitCategoryId: '5',
                portraitTemplateType: '1',
                portraitTemplateJson: item
            };
            paramsArr.push(json);
        });
        const params: any = {
            portraitTemplateJsonArray: paramsArr.length > 0 ? JSON.stringify(paramsArr) : ''
        };
        this.$api
            .post('/api/business/portrait/templateBatchUpdate', params)
            .then(() => {
                this.$message.success('保存模板成功');
            })
            .catch(() => {
                this.$message.error('保存模板失败');
            })
            .finally(() => {
                this.$store.commit('changeLoadingStatus', false);
            });
    }
    // private downExcel() {
    //     this.$api.get('/excel/getData').then((res: any) => {
    //         saveAs(new Blob([JSON.stringify(res.data)], { type: 'application/vnd.ms-excel;charset=utf-8' }), '画像数据.xlsx');
    //     });
    // }
    /*  private downExcel() {
        const workbook = new Excel.Workbook();
        const sheet: any = workbook.addWorksheet('画像数据');
        // const tableColumn: any[] = [];
        sheet.columns = [
            { header: '创建日期', key: 'a', width: 15 },
            { header: '单号', key: 'id', width: 15 },
            { header: '电话号码', key: 'phone', width: 15 },
            { header: '地址', key: 'address', width: 15 }
        ];
        const data = [
            {
                a: '2018-10-01',
                id: '787818992109210',
                phone: '11111111111',
                address: '深圳市'
            }
        ];
        sheet.addRows(data);
        // const tableData: any[] = [];
        // this.excelTem.forEach((item: any) => {
        //     const data: any = {
        //         header: item,
        //         key: ''
        //     };
        //     switch (item) {
        //         case '标签名称':
        //             data.key = 'tagName';
        //             data.width = 30;
        //             break;
        //         case '枚举名称':
        //             data.key = 'name';
        //             data.width = 20;
        //             break;
        //         case '数量':
        //             data.key = 'value';
        //             break;
        //         case '占比':
        //             data.key = 'prop';
        //             break;
        //     }
        //     tableColumn.push(data);
        // });
        // sheet.columns = tableColumn;
        // this.viewData.forEach((item: any) => {
        //     for (let i = 0; i < item.viewInfo.data.length; i++) {
        //         const val = item.viewInfo.data[i];
        //         const data = {
        //             tagName: '',
        //             name: val.name,
        //             value: val.value,
        //             prop: val.prop
        //         };
        //         if (i === 0) {
        //             data.tagName = item.viewInfo.name;
        //         }
        //         tableData.push(data);
        //     }
        // });
        // sheet.addRows(tableData);
        workbook.xlsx.writeBuffer().then(function(buffer) {
            console.log(buffer);
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '画像数据.xlsx');
        });
    } */
    private downExcel(): void {
        let headList = '<tr>';
        let bodyList = '';
        this.excelTem.forEach(item => {
            const headEl = `<th>${item}</th>`;
            headList += headEl;
        });
        headList += '</tr>';
        for (let i = 0; i < this.viewData.length; i++) {
            for (let k = 0; k < this.viewData[i].viewInfo.data.length; k++) {
                const item = this.viewData[i].viewInfo.data[k];
                let bodyEl = '<tr style="text-align:center;">';
                if (k === 0) {
                    bodyEl += `<td>${this.viewData[i].viewInfo.name}</th>`;
                } else {
                    bodyEl += '<td></td>';
                }
                bodyEl += `<td>${item.name}</td><td>${item.value}</td><td>${item.prop}</td></tr>`;
                bodyList += bodyEl;
            }
        }
        let res =
            "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://agiletag.w3.org/TR/REC-html40'>";
        res += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
        res += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
        res += '; charset=UTF-8">';
        res += '<head>';
        res += '<!--[if gte mso 9]>';
        res += '<xml>';
        res += '<x:ExcelWorkbook>';
        res += '<x:ExcelWorksheets>';
        res += '<x:ExcelWorksheet>';
        res += '<x:Name>';
        res += '{worksheet}';
        res += '</x:Name>';
        res += '<x:WorksheetOptions>';
        res += '<x:DisplayGridlines/>';
        res += '</x:WorksheetOptions>';
        res += '</x:ExcelWorksheet>';
        res += '</x:ExcelWorksheets>';
        res += '</x:ExcelWorkbook>';
        res += '</xml>';
        res += '<![endif]-->';
        res += '</head>';
        res += '<body>';
        res += `<table><thead>${headList}</thead><tbody>${bodyList}</tbody>`;
        res += '</body></html>';
        const elink = document.createElement('a');
        const uri = `data:application/vnd.ms-excel;charset=utf-8,${encodeURIComponent(res)}`;
        elink.download = '画像结果明细.xls';
        elink.style.display = 'none';
        elink.href = uri;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
    }
    private downPdf(): void {
        const app: any = document.querySelector('#app');
        const wapper: any = document.querySelector('.tag-wapper');
        const right: any = document.querySelector('.el-main');
        app.style.overflowY = 'visible';
        wapper.style.overflowY = 'visible';
        right.style.overflowY = 'visible';
        this.$nextTick(() => {
            const parent: any = document.querySelector('.view-section');
            html2Canvas(parent, {
                allowTaint: true,
                width: parent.scrollWidth,
                height: parent.scrollHeight
            }).then(canvas => {
                const contentWidth: any = canvas.width;
                const contentHeight: any = canvas.height;
                //一页pdf显示html页面生成的canvas高度;
                const pageHeight: any = (contentWidth / 592.28) * 841.89;

                //未生成pdf的html页面高度
                let leftHeight: any = contentHeight;
                //pdf页面偏移
                let position: any = 0;
                //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
                const imgWidth: any = 595.28;
                const imgHeight: any = (592.28 / contentWidth) * contentHeight;
                const pageData = canvas.toDataURL('image/png', 1.0);
                const pdf = new jsPDF('', 'pt', 'a4');
                //  pdf.addImage(pageData, 'PNG', 0, 0,595.28, 592.28 / canvas.width * canvas.height);
                // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                // 当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight);
                } else {
                    while (leftHeight > 0) {
                        pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight);
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if (leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }
                pdf.save('画像报告.pdf');
                app.style.overflowY = 'auto';
                wapper.style.overflowY = 'auto';
                right.style.overflowY = 'auto';
            });
        });
    }
}
</script>

<style scoped lang="scss">
.top-btn {
    margin-bottom: 25px;
    display: flex;
    justify-content: flex-end;
}
.view-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .view-box {
        width: 49%;
        height: 400px;
        margin-bottom: 20px;
        border: 1px solid rgba(221, 221, 221, 1);
        border-radius: 4px;
        position: relative;
    }
    .bg {
        width: 100%;
        height: 50px;
        background: rgba(250, 250, 250, 1);
        border-radius: 4px 4px 0px 0px;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
