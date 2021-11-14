<template>
    <section class="com-table">
        <el-table
            :data="tableData"
            :lazy="isLazy"
            :load="load"
            :row-key="rowKey"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :ref="refs"
            :header-cell-style="{
                color: '#333',
                'font-size': '12px',
                'font-weight': '500',
                background: '#f7f9fb',
                padding: '8px 0',
                'border-color': '#ECF0F0'
            }"
            :cell-style="{
                padding: '8px 0',
                color: '#333',
                'font-size': '12px'
            }"
            :expand-row-keys="openKeys"
            @sort-change="sortChange"
            @expand-change="expandChange"
            border
        >
            <el-table-column type="index" width="50" :label="'序号'" v-if="isIndex"></el-table-column>
            <el-table-column
                v-for="(column, index) in columnData"
                :key="index"
                :type="column.type ? column.type : ''"
                :prop="column.prop ? column.prop : ''"
                :label="column.label ? column.label : ''"
                :width="column.width ? column.width : ''"
                :minWidth="column.minWidth ? column.minWidth : ''"
                :className="column.className"
                :sortable="column.isSort ? column.isSort : false"
            >
                <template slot-scope="scope">
                    <template v-if="column.slotName">
                        <slot :name="column.slotName" :row="scope.row" :column="index" :index="scope.$index" />
                    </template>
                    <template v-else>
                        <span v-html="column.template ? column.template(scope.row) : scope.row[column.prop]"></span>
                    </template>
                </template>
            </el-table-column>
            <template slot="empty">
                <div class="data-empty" v-show="!loadingSate">
                    <img src="@/assets/img/data-empty.png" alt="" />
                    <p>暂无数据</p>
                </div>
            </template>
        </el-table>
        <section class="page-container clearfix" v-if="total > pageSize || total > defSizes">
            <el-pagination
                background
                layout="total,sizes,prev, pager, next,jumper"
                :page-size="pageSize"
                :page-sizes="pageSizes"
                :current-page.sync="params.pageNum"
                :total="total"
                @size-change="handlerSizePage"
                @current-change="handlerCurrentPage"
            ></el-pagination>
        </section>
    </section>
</template>
<script lang="ts">
/**
 * @name tagTable
 * @author wangziyu
 * @description 简单描述
 */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
@Component({
    computed: mapGetters(['loadingSate'])
})
export default class TagTable extends Vue {
    @Prop({ type: Array }) private tableData?: any[];
    @Prop({ type: Array }) private columnData?: any[];
    @Prop({ type: Array }) private openKeys?: any[];
    @Prop({ type: Boolean, default: false }) private isLazy?: boolean;
    @Prop({ type: Boolean, default: false }) private isIndex?: boolean;
    @Prop({ type: String }) private rowKey?: string;
    @Prop({ type: String }) private refs?: string;
    @Prop({ type: Number }) private pageSize?: number;
    @Prop({
        type: Object,
        default: () => {
            return {
                pageNum: 1
            };
        }
    })
    private params?: any;
    @Prop({ type: Number }) private defSizes?: number;
    @Prop({
        type: Array,
        default: () => {
            return [10, 20, 30, 40, 50];
        }
    })
    private pageSizes?: number[];
    @Prop({ type: Number }) private total?: number;
    private load(tree: any, treeNode: any, resolve: any) {
        this.$emit('load', tree, resolve);
    }
    private expandChange(node: any, isOpen: any) {
        this.$emit('expandChange', node, isOpen);
    }
    private sortChange(data: any) {
        this.$emit('sort', data.prop, data.order);
    }
    private handlerCurrentPage(index: number) {
        this.$emit('pageChange', index);
    }
    private handlerSizePage(size: number) {
        this.$emit('sizeChange', size);
    }
}
</script>
<style lang="scss" scoped>
.com-table {
    width: 100%;
}
.page-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
.data-empty {
    padding: 20px 0;
    line-height: normal;
    p {
        margin-top: 10px;
    }
}
</style>
