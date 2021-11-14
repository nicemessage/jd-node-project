<template>
    <section class="class-admin">
        <div class="header">

            <div class="subject-list">
                <SubHead @changeId="changeId"/>
            </div>
            <div class="search-tag-btn">
                <el-select v-model="params.tagCateType" size="medium" class="com-select" style="margin-right:5px;"
                           @change="getListData">
                    <el-option label="标签分类" value="1"></el-option>
                    <el-option label="组合分类" value="2"></el-option>
                </el-select>
                <el-input
                        class="com-input search-ipt"
                        placeholder="分类名称/创建人/修改人"
                        maxlength="100"
                        v-model="params.keyword"
                        clearable
                        @change="pageChange(1)"
                        @clear="pageChange(1)"
                        style="margin-right:5px;"
                        size="medium"
                >
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="pageChange(1)"></i>
                </el-input>
                <el-button type="primary" @click="addClass(lv1)" size="medium">
                    <i class="el-icon-plus el-icon--right"></i> 添加一级分类
                </el-button>
            </div>
        </div>
        <main class="section self-scroll">
            <!--      <div class="pool-search">-->
            <!--        <div class="pool-search_left">-->

            <!--        </div>-->

            <!--      </div>-->
            <!-- <el-row style="margin:10px 0px;">
              <el-col :span="3">
                <div class="FlexCenter">
                  <el-select v-model="params.tagCateType" class="com-select" @change="getListData">
                    <el-option label="标签分类" value="1"> </el-option>
                    <el-option label="组合分类" value="2"> </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="21">
                <SearchRow
                  @upDate="updatedKeyWord"
                  @pageChange="pageChange"
                  placeholder="分类名称/创建人/修改人"
                  @add="addClass(lv1)"
                  btnTxt="添加一级分类"
                ></SearchRow>
              </el-col>
            </el-row> -->

            <div id="classAdminTable">
                <el-table
                        :data="classList"
                        size="small"
                        row-key="id"
                        border
                        default-expand-all
                        :row-class-name="rowParentId"
                        :tree-props="{ children: 'childs' }"
                        :default-sort="{ prop: 'tagCateSort' }"
                >
                    <el-table-column prop="tagCateName" label="分类名称" align="left" min-width="150px"></el-table-column>
                    <el-table-column prop="tagCateLevel" label="分类级别">
                        <template slot-scope="scope">
                            {{ LvName(scope.row.tagCateLevel) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="tagCateType" label="分类类型">
                        <template>
                            {{ TypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="创建人"></el-table-column>
                    <el-table-column prop="createdTime" label="创建时间">
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.createdTime) }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="modifier" label="修改人"></el-table-column>
                    <el-table-column prop="modifiedTime" label="修改时间">
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.modifiedTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="opBtns" label="操作" width="190" fixed="right">
                        <template slot-scope="scope">
                            <a @click="addClass(scope.row)">新增子级</a>
                            <a @click="editRow(scope.row)">编辑</a>
                            <a @click="showRow(scope.row)">查看</a>
                            <a @click="delRow(scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <ClassEdit ref="classDialog" :dialogTitle="dialogTitle" :isDetail="isDetail" @closeDialog="closeDialog"/>
        </main>
    </section>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ComTable from '@/components/ComTable.vue';
    import SubHead from '@/components/SysSubject.vue';
    import SearchRow from '@/components/searchRow.vue';
    import ClassEdit from './components/classEdit.vue';
    import Sortable from 'sortablejs';
    import moment from 'moment';
    import {State} from "vuex-class";

    interface Subject {
        id: number;
        subjectCn: string;
        subjectEn: string;
        subjectDesc: string;
        subjectSort: number;
    }

    @Component({
        components: {
            ComTable,
            SubHead,
            SearchRow,
            ClassEdit
        },
        computed: {
            TypeName() {
                if (this.params.tagCateType === '1') {
                    return '标签分类';
                }
                if (this.params.tagCateType === '2') {
                    return '组合分类';
                }
            }
        }
    })
    export default class SubjectList extends Vue {
        @State(state => state.curSubject) curSubject!: Subject | null;
        private isDetail: boolean = false;
        private dialogTitle: string = '';
        private lv1: object = {
            tagCateLevel: -1
        };
        private params: any = {
            keyword: '',
            subjectId: '',
            tagCateType: '1'
        };
        private startId: any = '';
        private endId: any = '';
        private isMove: boolean = false;

        private updatedKeyWord(val: any) {
            this.params.keyword = val;
            console.log(val);
        }

        private total: number = 0;
        private classList: any[] = [];

        private rowParentId(e: any) {
            return `${e.row.pid}#${e.row.id}`;
        }

        private mounted() {
            this.init();
        }

        private LvName(val: any) {
            if (val == 0) return '一级';
            if (val == 1) return '二级';
            if (val == 2) return '三级';
        }

        private async init(): Promise<void> {
            this.$store.commit('changeLoadingStatus', true);
            await Promise.all([this.getListData(), this.dragTable()]).finally(() => {
                this.$store.commit('changeLoadingStatus', false);
            });
        }

        private changeId(): void {
            this.getListData();
        }

        private makeLvName(lv: number) {
            if (lv === 0) {
                return '一级';
            } else if (lv === 1) {
                return '二级';
            } else if (lv === 2) {
                return '三级';
            }
        }

        public addClass(row: any) {
            this.isDetail = false;
            if (row.tagCateLevel >= 2) {
                this.$message.warning('分类最多支持3级！');
                return false;
            }
            const lv = this.makeLvName(row.tagCateLevel + 1);
            this.dialogTitle = `新增${lv}分类`;
            (this.$refs['classDialog'] as ClassEdit).open(row);
        }

        private oldClassList: any[] = [];

        private getListData(): void {
            this.params.subjectId = this.curSubject?.id;
            this.$bus.$emit('main-loading', true);
            this.$api
                .post('/api/admin/tagCategory/search', this.params)
                .then((res: any) => {
                    this.$bus.$emit('main-loading', false);
                    res.map((item: any) => {
                        item.childs = [];
                    });
                    const arr = this.tagCateType(res);
                    this.classList = this.makeTree(arr);
                    this.oldClassList = JSON.parse(JSON.stringify(this.classList));
                })
                .catch((err: any) => {
                    this.$bus.$emit('main-loading', false);
                    console.log('error', err);
                });
        }

        private tagCateType(arr: any) {
            return arr.filter((ele: any) => {
                return ele.tagCateType == this.params.tagCateType;
            });
        }

        private compare(property: any) {
            return function (a: any, b: any) {
                const value1 = a[property];
                const value2 = b[property];
                return value1 - value2;
            };
        }

        // console.log(arr.sort(compare('age')))
        private makeTree(arr: any[]) {
            let pArr = arr.filter((item: any) => {
                return item.tagCateLevel === 0;
            });
            if (pArr.length === 0) {
                pArr = arr.filter((item: any) => {
                    return item.tagCateLevel === 1;
                });
                if (pArr.length === 0) {
                    pArr = arr.filter((item: any) => {
                        return item.tagCateLevel === 2;
                    });
                }
            }
            pArr.map((item: any) => {
                const children: any[] = arr.filter((aItem: any) => {
                    return item.id === aItem.pid;
                });
                children.map((cItem: any) => {
                    const childs: any[] = arr.filter((aItem: any) => {
                        return cItem.id === aItem.pid;
                    });
                    childs.sort(this.compare('tagCateSort'));
                    Object.assign(cItem, {childs: childs});
                });
                children.sort(this.compare('tagCateSort'));
                Object.assign(item, {childs: children});
            });
            pArr.sort(this.compare('tagCateSort'));
            console.log('pArr:', pArr);
            return pArr;
        }

        private pageChange(): void {
            this.getListData();
        }

        private showRow(row: any): void {
            this.isDetail = true;
            const lv = this.makeLvName(row.tagCateLevel);
            this.dialogTitle = `查看${lv}分类`;
            row.createdTime = this.formatDate(row.createdTime);
            row.modifiedTime = this.formatDate(row.modifiedTime);
            (this.$refs['classDialog'] as ClassEdit).open(row);
            // this.$api.get('/admin/tagCategory/get', { id: row.id }).then((res: any) => {
            //   if (res.result === '1') {
            //     console.log(res.data);
            //     this.isDetail = true;
            //     (this.$refs['classDialog'] as ClassEdit).open(res.data);
            //   } else {
            //     this.$message.error(res.msg);
            //   }
            // });
        }

        private editRow(row: any): void {
            this.isDetail = false;
            const lv = this.makeLvName(row.tagCateLevel);
            this.dialogTitle = `修改${lv}分类`;
            (this.$refs['classDialog'] as ClassEdit).open(row);
        }

        private delRow(row: any): void {
            this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.deleteRow(row);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }

        private deleteRow(row: any): void {
            this.$api
                .get('/api/admin/tagCategory/del', {id: row.id})
                .then((res: any) => {
                    row.visible = false;
                    this.$message.success('恭喜您，删除成功！');
                    this.getListData();
                })
                .catch((err: any) => {
                    row.visible = false;
                    console.log(err);
                });
        }

        public closeDialog() {
            this.getListData();
        }

        private formatDate(dateStr: any) {
            return moment(dateStr).format('YYYY-MM-DD HH:mm:ss');
        }

        private dragTable() {
            const t = document.getElementById('classAdminTable');
            if (t) {
                const tbody = t.querySelector('.el-table__body-wrapper tbody');
                Sortable.create(tbody as any, {
                    // 拖拽移动的时候
                    onMove: function (/** Event */ event: any /** Event */) {
                        // console.log('onMove:', event, originalEvent)
                        // 判断是否是相同的parentId
                        let startParentId, endParentId;
                        event.dragged.classList.forEach((className: any) => {
                            if (className.indexOf('#') !== -1) {
                                // 包含#字，分割，拿到parentId和id
                                const idArr = className.split('#');
                                startParentId = idArr[0];
                                this.startId = idArr[1];
                            }
                        });
                        event.related.classList.forEach((className: any) => {
                            if (className.indexOf('#') !== -1) {
                                // 包含#字，分割，拿到parentId和id
                                const idArr = className.split('#');
                                endParentId = idArr[0];
                                this.endId = idArr[1];
                            }
                        });
                        console.log(startParentId, endParentId);
                        if (startParentId === endParentId) {
                            // 相同parentId才允许拖入
                            console.log('允许拖动');
                            this.isMove = true;
                            return true;
                        } else {
                            this.isMove = false;
                            console.log('不允许拖动');
                            return false;
                        }
                    }.bind(this),
                    onEnd: function () {
                        console.log('拖动结束');
                        if (this.isMove) {
                            let param = {};
                            const startRow = this.findItemById(this.classList, this.startId);
                            const endRow = this.findItemById(this.classList, this.endId);
                            console.log('onend', 'startId:', startRow, 'endId:', endRow.data.tagCateSort);

                            if (startRow.data.pid === 0) {
                                if (startRow.data.tagCateSort < endRow.data.tagCateSort) {
                                    // 从上到下拖动
                                    param = this.makeSortList(this.classList, startRow.index, endRow.index);
                                } else {
                                    param = this.makeSortListDown(this.classList, startRow.index, endRow.index);
                                }
                            } else {
                                // 子list拖拽，找到拖拽的list
                                const res = this.findItemById(this.classList, startRow.data.pid);
                                const childs = JSON.parse(JSON.stringify(res.data.childs));
                                if (startRow.data.tagCateSort < endRow.data.tagCateSort) {
                                    // 从上到下拖动
                                    param = this.makeSortList(childs, startRow.index, endRow.index);
                                } else {
                                    param = this.makeSortListDown(childs, startRow.index, endRow.index);
                                }
                            }
                            // 这里调用后台接口
                            console.log('param：', param);
                            const params = {
                                tagCategorySortVOList: param
                            };
                            this.upDateSort(params);
                        } else {
                            console.log('识别到了');
                            // this.$router.go(0);
                            this.classList = [];
                            // this.classList = JSON.parse(JSON.stringify(this.oldClassList));
                            this.getListData();
                            return false;
                        }
                    }.bind(this)
                });
            }
            // const tbody = document.getElementById('classAdminTable').querySelector('.el-table__body-wrapper tbody');
        }

        public upDateSort(param: any) {
            this.$api.post('/api/admin/tagCategory/sort', param).then((res: any) => {
                this.classList = [];
                this.$nextTick(() => {
                    this.getListData();
                });
                this.$message.success('排序更新成功！');
            });
        }

        public makeSortList(arr: any[], startIndex: any, endIndex: any) {
            const sortList: any[] = [];
            // console.log('startSort:', arr[startIndex].tagCateSort)
            for (let i = startIndex + 1; i <= endIndex; i++) {
                sortList.push({
                    id: arr[i].id,
                    tagCateSort: arr[startIndex].tagCateSort++
                });
            }
            sortList.push({
                id: arr[startIndex].id,
                tagCateSort: arr[endIndex].tagCateSort
            });
            return sortList;
        }

        public makeSortListDown(arr: any[], startIndex: any, endIndex: any) {
            const sortList: any[] = [];
            const list = arr.splice(endIndex, startIndex - endIndex + 1);
            // console.log('初始截取list', list)
            const last = list.pop();
            let tagCateSort = list[0].tagCateSort;
            // console.log('删除末尾项', list, last, tagCateSort)
            list.unshift(last);
            // console.log('添加到第一项', list)
            list.map(item => {
                sortList.push({
                    id: item.id,
                    tagCateSort: tagCateSort++
                });
            });
            return sortList;
        }

        public findItemById(arr: any[], id: any) {
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (item.id === Number(id)) {
                    // id相同，找到对应item，跳出
                    return {data: item, index: i};
                } else if (item.childs.length === 0) {
                    // 子list长度为零，跳过本次循环，进行下一次
                    continue;
                } else {
                    // 子list存在，进行遍历查询
                    const res: any = this.findItemById(item.childs, id);
                    if (res) {
                        return res;
                    }
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    a{
        padding-right: 10px;
    }
    .class-admin {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .header {
        width: 100%;
        height: 64px;
        display: flex;
        /deep/.el-input__inner{
            background: none;
        }
        .subject-list {
          width: 30%;
          height: 64px;
          flex: 1 1 auto;
        }

        .search-tag-btn {
          min-width: 300px;
          height: 64px;
          margin-right: 20px;
          float: right;
          display: flex;
          align-items: center;
          flex: 1 1 auto;
        }
    }

    .FlexCenter {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .section {
        padding: 0 20px;
        overflow-y: auto;
        height: calc(100% - 68px);
    }

    .pool-search {
        display: flex;
        justify-content: space-between;
        margin: 0 0 12px 0;

        .search-ipt {
            width: 350px;
        }

        &_left {
            flex: 1;
            display: flex;
        }

        &_select {
            margin-right: 15px;
            width: 110px;
        }
    }
</style>
