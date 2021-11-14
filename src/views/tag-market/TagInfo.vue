<template>
    <div class="tag-info" v-if="info">
        <div class="header">
            <div class="tabs">
                <div class="tab-item" :class="{ active: panel == 'info' }" @click="panel = 'info'">
                    {{ info.tagClassify == 2 ? '组合' : '' }}标签定义
                </div>
                <div class="tab-item" :class="{ active: panel == 'refer' }" @click="panel = 'refer'">
                    引用情况
                </div>
                <div class="tab-item" :class="{ active: panel == 'statistic' }" @click="panel = 'statistic'">
                    覆盖分布
                </div>
            </div>
<!--            <div class="go-back">-->
<!--                <el-button @click="close" size="small">返回</el-button>-->
<!--            </div>-->
        </div>
        <div class="body" v-show="panel == 'info'">
            <div class="tag-base-info info-item">
                <div class="info-item-title">基本信息</div>
                <div class="info-item-body">
                    <div class="info-item-property">
                        <div class="info-item-property-label">{{ info.tagClassify == 2 ? '组合' : '标签' }}编码</div>
                        <div class="info-item-property-value">{{ info.tagCode ? info.tagCode : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">{{ info.tagClassify == 2 ? '组合' : '标签' }}名称</div>
                        <div class="info-item-property-value">{{ info.tagName ? info.tagName : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">{{ info.tagClassify == 2 ? '组合' : '标签' }}类型</div>
                        <div class="info-item-property-value">
                            {{ tagDataTypeMap[info.tagDataType] ? tagDataTypeMap[info.tagDataType] : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">{{ info.tagClassify == 2 ? '组合' : '标签' }}分类</div>
                        <div class="info-item-property-value">{{ info.fullTagCateName ? info.fullTagCateName : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">标签等级</div>
                        <div class="info-item-property-value">
                            {{ tagSecLevelMap[info.tagSecLevel] ? tagSecLevelMap[info.tagSecLevel] : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">{{ info.tagClassify == 2 ? '组合' : '标签' }}描述</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="info.tagDesc ? info.tagDesc : ''" placement="right">
                                <span>{{ info.tagDesc ? info.tagDesc : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">数据信息</div>
                <div class="info-item-body">
                    <div class="info-item-property">
                        <div class="info-item-property-label">数据更新</div>
                        <div class="info-item-property-value">
                            {{ tagClassifyMap[info.tagClassify] ? tagClassifyMap[info.tagClassify] : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">数据频率</div>
                        <div class="info-item-property-value">
                            {{ sourceDataCycle[info.sourceDataCycle] ? sourceDataCycle[info.sourceDataCycle] : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">更新日期</div>
                        <div class="info-item-property-value">{{ info.dataDt ? formatDate(parseFloat(info.dataDt + '000'), 'YYYY-MM-DD') : '' }}</div>
                    </div>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">数据源信息</div>
                <div class="info-item-body">
                    <div class="info-item-property">
                        <div class="info-item-property-label">库名</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.sourceDb ? dataSourceInfo.sourceDb : ''" placement="top-start">
                                <span>{{ dataSourceInfo.sourceDb ? dataSourceInfo.sourceDb : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">表名</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.sourceTbOrTopic ? dataSourceInfo.sourceTbOrTopic : ''" placement="top-start">
                                <span>{{ dataSourceInfo.sourceTbOrTopic ? dataSourceInfo.sourceTbOrTopic : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">ID列</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.sourceColId ? dataSourceInfo.sourceColId : ''" placement="top-start">
                                <span>{{ dataSourceInfo.sourceColId ? dataSourceInfo.sourceColId : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">DT列</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.sourceColDt ? dataSourceInfo.sourceColDt : ''" placement="top-start">
                                <span>{{ dataSourceInfo.sourceColDt ? dataSourceInfo.sourceColDt : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">表负责人</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.sourceTbManager ? dataSourceInfo.sourceTbManager : ''" placement="top-start">
                                <span>{{ dataSourceInfo.sourceTbManager ? dataSourceInfo.sourceTbManager : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">源库名</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.targetDb ? dataSourceInfo.targetDb : ''" placement="top-start">
                                <span>{{ dataSourceInfo.targetDb ? dataSourceInfo.targetDb : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">位图库名</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.bitmapDb ? dataSourceInfo.bitmapDb : ''" placement="top-start">
                                <span>{{ dataSourceInfo.bitmapDb ? dataSourceInfo.bitmapDb : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">源表名</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.targetTb ? dataSourceInfo.targetTb : ''" placement="top-start">
                                <span>{{ dataSourceInfo.targetTb ? dataSourceInfo.targetTb : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">生命周期(天)</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.targetTbLife ? dataSourceInfo.targetTbLife : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">命名空间</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.hbaseNs ? dataSourceInfo.hbaseNs : ''" placement="top-start">
                                <span>{{ dataSourceInfo.hbaseNs ? dataSourceInfo.hbaseNs : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">列簇</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.hbaseColFamily ? dataSourceInfo.hbaseColFamily : ''" placement="top-start">
                                <span>{{ dataSourceInfo.hbaseColFamily ? dataSourceInfo.hbaseColFamily : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">表名</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="dataSourceInfo.hbaseTb ? dataSourceInfo.hbaseTb : ''" placement="top-start">
                                <span>{{ dataSourceInfo.hbaseTb ? dataSourceInfo.hbaseTb : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">使用形式</div>
                <div class="info-item-body">
                    <div class="info-item-property1">
                        <el-table :data="info.tagComponentReqVOList" size="small" border>
                            <el-table-column prop="tagCompName" label="标签名称" min-width="180"> </el-table-column>
                            <el-table-column label="使用形式" min-width="180">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.tagCompStyle == 11">日期型-年月日</span>
                                    <span v-if="scope.row.tagCompStyle == 12">日期型-年</span>
                                    <span v-if="scope.row.tagCompStyle == 13">日期型-月</span>
                                    <span v-if="scope.row.tagCompStyle == 14">日期型-日</span>
                                    <span v-if="scope.row.tagCompStyle == 15">时间型-时分秒</span>
                                    <span v-if="scope.row.tagCompStyle == 16">时间型-时</span>
                                    <span v-if="scope.row.tagCompStyle == 17">时间型-分</span>
                                    <span v-if="scope.row.tagCompStyle == 18">时间型-秒</span>
                                    <span v-if="scope.row.tagCompStyle == 19">时间型-时间窗口</span>
                                    <a class="show-enum-btn" v-if="scope.row.tagCompStyle == 21" @click="showEnum(scope.row)"
                                        >枚举型
                                        <i class="el-icon-tickets"></i>
                                    </a>
                                    <a class="show-enum-btn" v-if="scope.row.tagCompStyle == 22" @click="showEnum(scope.row)"
                                        >枚举型 <i class="el-icon-tickets"></i
                                    ></a>
                                    <span v-if="scope.row.tagCompStyle == 31">自定义型-数值</span>
                                    <span v-if="scope.row.tagCompStyle == 32">自定义型-文本</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">加工信息</div>
                <div class="info-item-body">
                    <div class="info-item-property">
                        <div class="info-item-property-label">技术负责人</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="info.techManager ? info.techManager : ''" placement="top-start">
                                <span>{{ info.techManager ? info.techManager : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">加工逻辑</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="info.tagLogicDesc ? info.tagLogicDesc : ''" placement="top-start">
                                <span>{{ info.tagLogicDesc ? info.tagLogicDesc : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">业务库</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="info.rootSoureDb ? info.rootSoureDb : ''" placement="top-start">
                                <span>{{ info.rootSoureDb ? info.rootSoureDb : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">业务表</div>
                        <div class="info-item-property-value">
                            <el-tooltip class="item" effect="dark" :content="info.rootSoureTb ? info.rootSoureTb : ''" placement="top-start">
                                <span>{{ info.rootSoureTb ? info.rootSoureTb : '' }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">业务信息</div>
                <div class="info-item-body">
                    <div class="info-item-property">
                        <div class="info-item-property-label">业务负责人</div>
                        <div class="info-item-property-value">{{ info.bizManager ? info.bizManager : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">业务部门</div>
                        <div class="info-item-property-value">{{ info.bizManagerDep ? info.bizManagerDep : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">所属业务</div>
                        <div class="info-item-property-value">{{ info.bizName ? info.bizName : '' }}</div>
                    </div>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">操作信息</div>
                <div class="info-item-body">
                    <div class="info-item-property">
                        <div class="info-item-property-label">创建人</div>
                        <div class="info-item-property-value">{{ info.creator ? info.creator : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">创建时间</div>
                        <div class="info-item-property-value">{{ info.createdTime ? formatDate(info.createdTime) : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">修改人</div>
                        <div class="info-item-property-value">{{ info.modifier ? info.modifier : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">修改时间</div>
                        <div class="info-item-property-value">{{ info.modifiedTime ? formatDate(info.modifiedTime) : '' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="body" v-show="panel == 'refer'">
            <div class="refer-type-select">
                <div class="refer-type" :class="{ active: tagReferType == 'table' }" @click="tagReferType = 'table'">群体引用明细</div>
                <div class="refer-type" :class="{ active: tagReferType == 'chart' }" @click="tagReferType = 'chart'">群体引用图表</div>
                <div class="refer-type" :class="{ active: tagReferType == 'refer' }" @click="tagReferType = 'refer'">取值接口引用明细</div>
            </div>
            <div class="refer-content" v-show="tagReferType == 'table'">
                <el-table :data="_tagReferData" size="small" border>
                    <el-table-column prop="crowdCode" label="群体编码" min-width="230"> </el-table-column>
                    <el-table-column prop="crowdName" label="群体名称" min-width="140"> </el-table-column>
                    <el-table-column prop="createdTime" label="建群时间" min-width="110"> </el-table-column>
                    <el-table-column prop="sysName" label="应用系统"> </el-table-column>
                    <el-table-column label="应用类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.touchType == 1">命中</span>
                            <span v-else-if="scope.row.touchType == 2">下载</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="应用开始日期" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.touchBegin ? formatDate(scope.row.touchBegin, 'YYYY-MM-DD') : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="应用结束日期" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.touchEnd ? formatDate(scope.row.touchEnd, 'YYYY-MM-DD') : '' }}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        layout="total, prev, pager, next, jumper"
                        :total="tagReferListPageConf.total"
                        :page-size.sync="tagReferListPageConf.pageSize"
                        :current-page.sync="tagReferListPageConf.pageNo"
                    >
                    </el-pagination>
                </div>
            </div>
            <div class="refer-content" v-show="tagReferType == 'chart'">
                <div id="tag-refer-chart"></div>
            </div>
            <div class="refer-content" v-show="tagReferType == 'refer'">
                <el-table :data="tagReferValData" size="small" border>
                    <el-table-column prop="sysName" label="系统名称" min-width="180"> </el-table-column>
                    <el-table-column prop="sysManager" label="系统负责人"> </el-table-column>
                    <el-table-column label="接口调用量" min-width="180">
                        <template>
                            ——
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        layout="total, prev, pager, next, jumper"
                        :total="tagReferValPageConf.total"
                        :page-size.sync="tagReferValPageConf.pageSize"
                        :current-page.sync="tagReferValPageConf.pageNo"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="body" v-show="panel == 'statistic'">
            <div class="tag-base-info info-item">
                <div class="info-item-title">覆盖数量分布</div>
                <div class="info-item-body">
                    <div class="search-tools">
                        <div class="data-picker">
                            <el-date-picker
                                v-model="time1"
                                type="daterange"
                                align="right"
                                unlink-panels
                                size="small"
                                :clearable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                value-format="timestamp"
                                @change="getListTagData"
                            >
                            </el-date-picker>
                        </div>
                        <div class="select-enum" v-if="isEnum">
                            <!--:remote-method="searchEnumVal"-->
                            <el-select
                                v-model="selectEnum"
                                size="small"
                                filterable
                                remote
                                clearable
                                placeholder="请选择枚举"
                                @focus="searchEnumVal"
                                :loading="enumLoading"
                                loading-text="加载中"
                            >
                                <el-option v-for="item in selectEnums" :key="item.id" :label="item.tagEnumName" :value="item.tagEnumVal"> </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="list-tag-chart" id="list-tag-chart"></div>
                </div>
            </div>
            <div class="tag-base-info info-item" v-if="isEnum">
                <div class="info-item-title">枚举覆盖分布</div>
                <div class="info-item-body">
                    <div class="search-tools">
                        <el-date-picker v-model="selectDT" type="date" align="right" size="small" value-format="timestamp" @change="getListEnumData"> </el-date-picker>
                    </div>
                    <div class="list-tag-chart" id="list-enum-chart"></div>
                </div>
            </div>
        </div>
        <el-drawer
                title="枚举详情"
                :visible.sync="showEnumDialog"
                :modal="false"
                direction="rtl"
                size="50%">
<!--        <el-dialog :close-on-click-modal="false" :modal="false" :visible.sync="showEnumDialog">-->
<!--            <div slot="title" class="dialog-title">枚举详情</div>-->
            <!-- <el-tree :props="enumProp" :load="loadEnum" lazy check-strictly></el-tree> -->
<!--            <div style="padding:20px;display: flex;">-->
<!--                <el-input v-model="tagEnumId" placeholder="请输入标签枚举ID" size="small" style="margin-right: 10px;" @change="queryEnum"></el-input>-->
<!--                <el-button type="primary" size="small" @click="queryEnum">搜索</el-button>-->
<!--            </div>-->
            <div style="overflow: auto;position: absolute;top:60px;bottom: 0;left:0;right:0;">
                <el-table :data="enumData" :load="loadEnum" lazy :tree-props="enumProp" size="small" style="width: 100%" height="100%">
                    <el-table-column prop="tagEnumName" label="枚举" min-width="120"> </el-table-column>
                    <el-table-column prop="tagEnumVal" label="数值" min-width="120"> </el-table-column>
                </el-table>
            </div>

<!--        </el-dialog>-->
        </el-drawer>
    </div>
</template>

<script lang="ts">
/**
 * @name TagInfo
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 标签详情
 */
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

// mixin引入

// 第三方库引入
import echarts from 'echarts';
import moment from 'moment';

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明
interface TagRefer {
    id: number;
    tagCode: string;
    tagName: string;
    crowdName: string;
    crowdCode: string;
    sysName: string;
    touchType: number;
}
interface TagValRefer {
    sysCode: string;
    sysManager: string;
    sysName: string;
}

interface PageConf {
    pageNo: number;
    pageSize: number;
    pageSizeList: Array<number>;
    total: number;
}

@Component({
    components: {}
})
export default class TagInfo extends Vue {


    @Prop({
        require: false
    })
    private tagId!: any;

    @Prop({
        require: false
    })
    private tagCode!: any;

    get id() {
        if(this.tagId){
            return this.tagId;
        }
        return parseInt(this.$route.params.tagCode);
    }

    private tagClassifyMap = {
        1: '离线标准',
        2: '离线组合',
        3: '实时标准'
    };
    private tagSecLevelMap = {
        1: '一级',
        2: '二级'
    };
    private tagDataTypeMap = {
        1: '事实及统计类',
        2: '挖掘预测类'
    };
    private sourceDataCycle = {
        h: '小时',
        d: '日',
        m: '月',
        y: '年'
    };

    private panel: string = 'info'; // info, refer, statistic
    @Watch('panel')
    private panelChange(newVal: string) {
        if (newVal == 'refer') {
            this.initStatistic();
            this.getTagReferData();
            this.tagReferValPageConf = {
                pageNo: 1,
                pageSize: 10,
                pageSizeList: [5, 10, 20, 50],
                total: 0
            };
            this.getTagReferValData();
        } else if (newVal == 'statistic') {
            this.initRefer();
            this.initDate();
            this.getListTagData();
            this.getListEnumData();
        } else {
            this.initRefer();
            this.initStatistic();
        }
    }

    private info: any = null;
    private dataSourceInfo: any = null;

    private tagReferData: Array<TagRefer> = [];
    private tagReferValData: Array<TagRefer> = [];

    private tagReferListPageConf: PageConf = {
        pageNo: 1,
        pageSize: 10,
        pageSizeList: [5, 10, 20, 50],
        total: 0
    };

    get _tagReferData() {
        const start = (this.tagReferListPageConf.pageNo - 1) * this.tagReferListPageConf.pageSize;
        const end = start + this.tagReferListPageConf.pageSize;
        return this.tagReferData.slice(start, end);
    }

    private tagReferValPageConf: PageConf = {
        pageNo: 1,
        pageSize: 10,
        pageSizeList: [5, 10, 20, 50],
        total: 0
    };
    @Watch('tagReferValPageConf.pageNo')
    private historyPageNoChange() {
        this.getTagReferValData();
    }

    private tagReferType: string = 'table'; // table, chart,
    private tagReferChart: any = null;
    @Watch('tagReferType')
    private tagReferTypeChange(newVal: string) {
        if (newVal == 'chart') {
            if (!this.tagReferChart) {
                this.$nextTick(() => {
                    const dom = document.getElementById('tag-refer-chart');
                    if (!dom) {
                        return;
                    } else {
                        this.tagReferChart = echarts.init(dom as HTMLDivElement);
                        const option = this.buildReferChart(this.tagReferData);
                        this.tagReferChart.setOption(option);
                    }
                });
            }
        }
    }

    // private queryEnum () {
    //     console.log(this.input);
    // }

    private time1: any = []; // 覆盖数量分布-时间
    private pickerOptions = {
        shortcuts: [
            {
                text: '最近一周',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            },
            {
                text: '最近一个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            },
            {
                text: '最近三个月',
                onClick(picker: any) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }
        ]
    };
    private selectEnum: string = '';
    private selectEnums: any = [];
    private enumLoading: boolean = false;
    private selectDT: number | null = null; // 枚举覆盖分布-时间
    private listTagChart: any = null;
    private listEnumChart: any = null;

    private showEnumDialog: boolean = false;
    private tagEnumId: any = null;
    private enumProp: object = {
        label: 'tagEnumName',
        children: 'children',
        hasChildren: this.isLeaf,
        isLeaf: this.isLeaf
    };
    private enumData: any = [];

    @Watch('selectEnum')
    private selectEnumChange() {
        this.getListTagData();
    }

    get isEnum() {
        if (!this.info) {
            return false;
        }
        if (this.info.tagClassify == 2) {
            return false;
        }
        if (this.info.tagClassify == 3) {
            return false;
        }
        if (!this.info.tagComponentReqVOList || this.info.tagComponentReqVOList.length == 0) {
            return false;
        }
        if (this.info.tagComponentReqVOList[0].tagCompStyle == 21) {
            return true;
        }
        if (this.info.tagComponentReqVOList[0].tagCompStyle == 22) {
            return true;
        }
        return false;
    }

    private mounted() {
        this.init()
        this.initDate();
    }

    private init() {
        if (!this.id) {
            return;
        } else {
            this.get(this.id)
                .then((res: any) => {
                    this.info = res;
                })
                .catch(err => {
                    console.log(err);
                });

            this.getTagDataSource(this.tagCode)
                .then((res: any) => {
                    if (res.length) {
                        this.dataSourceInfo = res[0];
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
    // private close() {
    //     this.$router.push({
    //         name: 'tag-market'
    //     });
    // }

    private initDate() {
        // const cur = Date.parse(new Date());
        const cur = new Date(new Date().toLocaleDateString()).getTime()
        const pre = (cur - 30 * 24 * 60 * 60 * 1000).toString();
        this.time1 = [pre, cur.toString()];
        this.selectDT = (cur - 24 * 60 * 60 * 1000);
    }

    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    private formatDateString(dateNum: number, formatStr?: string) {
        return moment(dateNum).format(formatStr ? formatStr : 'YYYY-MM-DD');
    }

    private getTagReferData() {
        if (!this.info || !this.info.tagCode) {
            return;
        }
        this.getTagRefer(this.info.tagCode)
            .then((res: any) => {
                this.tagReferData = res;
                this.tagReferListPageConf.total = res.length;
            })
            .catch(err => {
                console.log(err);
            });
    }

    private getTagReferValData() {
        if (!this.info || !this.info.tagCode) {
            return;
        }
        this.getTagValRefer(this.info.tagCode, this.tagReferValPageConf)
            .then((res: any) => {
                this.tagReferValData = res.list;
                this.tagReferValPageConf.total = res.total;
            })
            .catch(err => {
                console.log(err);
            });
    }

    private buildReferChart(refers: Array<TagRefer>) {
        const links: any = [];
        const nodes: any = [];
        const nodeSet: any = new Set();

        refers.forEach((refer: TagRefer) => {
            const item1 = {
                source: `标签-${refer.tagName}`,
                target: `群体-${refer.crowdName}`,
                value: 1
            };
            if (!nodeSet.has(`标签-${refer.tagName}`)) {
                nodeSet.add(`标签-${refer.tagName}`);
                nodes.push({
                    name: `标签-${refer.tagName}`,
                    depth: 0,
                    itemStyle: {
                        borderWidth: 0
                    }
                });
            }
            if (!nodeSet.has(`群体-${refer.crowdName}`)) {
                nodeSet.add(`群体-${refer.crowdName}`);
                nodes.push({
                    name: `群体-${refer.crowdName}`,
                    depth: 1,
                    itemStyle: {
                        borderWidth: 0
                    }
                });
            }

            links.push(item1);

            if (refer.sysName) {
                const touchTypeName: string = refer.touchType == 1 ? '命中' : '下载';
                const item2 = {
                    source: `群体-${refer.crowdName}`,
                    target: `${refer.sysName}-${touchTypeName}`,
                    value: 1
                };
                if (!nodeSet.has(`${refer.sysName}-${touchTypeName}`)) {
                    nodeSet.add(`${refer.sysName}-${touchTypeName}`);
                    nodes.push({
                        name: `${refer.sysName}-${touchTypeName}`,
                        depth: 2,
                        itemStyle: {
                            borderWidth: 0
                        }
                    });
                }
                links.push(item2);
            }
        });

        // console.log(nodes);
        // console.log(links);

        const option = {
            color: ['#FE8062', '#FEC949', '#9CD77C', '#64C8CF', '#628EFF', '#625D7F', '#CC95D0', '#D37093'],
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: {
                type: 'sankey',
                layout: 'none',
                focusNodeAdjacency: 'allEdges',
                data: nodes,
                links: links,
                lineStyle: {
                    color: 'source',
                    curveness: 0.5
                }
            }
        };
        return option;
    }

    private getListTagData() {
        this.listTagStatis(this.time1[0], this.time1[1], this.selectEnum ? this.selectEnum : undefined).then(res => {
            this.renderListTagChart(res);
        });
    }
    private renderListTagChart(data: any) {
        const option = this.buildListTagChart(data);
        if (this.listTagChart) {
            this.listTagChart.setOption(option);
        } else {
            const dom = document.getElementById('list-tag-chart');
            if (!dom) {
                return;
            } else {
                this.listTagChart = echarts.init(dom as HTMLDivElement);
                this.listTagChart.setOption(option);
            }
        }
    }

    // 图表配色
    private colors: Array<string> = [
        "#4775FE",
        "#56CB80",
        "#3EACFF",
        "#8F6DFF",
        "#F8BB3E",
        "#ACDA52",
        "#0DB4AD",
        "#F8894F",
        "#EA63B0",
        "#FF6D7F",
    ];

    // 单位
    private unitMap: any = {
        '0': '',
        '10000': '万',
        '1000000': '百万',
        '10000000': '千万',
        '100000000': '亿'
    };

    // 判断适应的单位
    private addUnit(n: any) {
        if (n) {
            if (n > 100000000) {
                return 100000000;
            }
            if (n > 10000000) {
                return 10000000;
            }
            if (n > 1000000) {
                return 1000000;
            }
            if (n > 100000) {
                return 10000;
            }
        }
        return 0;
    }

    private buildListTagChart(data: any) {
        const xData: any[] = [];
        const yData: any[] = [];
        const arrs: any = data.map((value) => {
            return value.coverNum;
        });
        const yDataMax: any = Math.max(...arrs);

        const unitVal: number = this.addUnit(yDataMax);
        const unit: string = this.unitMap[this.addUnit(yDataMax)];

        if (this.info.tagClassify == 3) {
            // realtime
            data.forEach((item: any) => {
                xData.push(this.formatDateString(item.dataDt * 1000, 'YYYY-MM-DD HH:mm:ss'));
                // yData.push(item.coverNum);
                if (unitVal == 0) {
                    yData.push(item.coverNum);
                } else {
                    yData.push((item.coverNum / unitVal).toLocaleString());
                }
            });
        } else {
            // offline
            const start = parseInt(this.time1[0]);
            const end = parseInt(this.time1[1]);
            let next = 0;
            while (start + next * 24 * 3600 * 1000 <= end) {
                const cur = start + next * 24 * 3600 * 1000;
                xData.push(this.formatDateString(cur, 'YYYY-MM-DD'));
                yData.push(null);
                next++;
            }
            data.forEach((item: any) => {
                const x = this.formatDateString(item.dataDt * 1000, 'YYYY-MM-DD');
                const index = xData.findIndex((dateStr: string) => {
                    return dateStr == x;
                });
                if (index >= 0) {
                    if (unitVal == 0) {
                        yData[index] = item.coverNum;
                    } else {
                        yData[index] = (item.coverNum / unitVal).toLocaleString();
                    }
                }
            });
        }
        const option = {
            color: this.colors,
            xAxis: {
                scale: true,
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function(a) {
                        return a + unit;
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12
                },
                formatter: function(a) {
                    if(!a[0].value){
                        a[0].value = 0;
                    }
                    return `${a[0].name}：${a[0].value}${unit}`;
                }
            },
            series: [
                {
                    data: yData,
                    type: 'line'
                }
            ]
        };

        if (xData.length >= 10) {
            Object.assign(option, {
                dataZoom: [
                    {
                        type: 'slider'
                    }
                ]
            });
        }

        return option;
    }

    private getListEnumData() {
        if (!this.selectDT) {
            return;
        }
        if (!this.isEnum) {
            return;
        }
        this.listEnumStatis(this.selectDT).then(res => {
            this.renderListEnumChart(res);
        });
    }

    private renderListEnumChart(data: any) {
        const option = this.buildListEnumChart(data);
        if (this.listEnumChart) {
            this.listEnumChart.setOption(option);
        } else {
            const dom = document.getElementById('list-enum-chart');
            if (!dom) {
                return;
            } else {
                this.listEnumChart = echarts.init(dom as HTMLDivElement);
                this.listEnumChart.setOption(option);
            }
        }
    }
    private buildListEnumChart(data: any) {
        // console.log(data);
        const xData: any[] = [];
        const yData: any[] = [];
        const arrs: any = data.map((value) => {
            return value.coverNum;
        });
        const yDataMax: any = Math.max(...arrs);

        const unitVal: number = this.addUnit(yDataMax);
        const unit: string = this.unitMap[this.addUnit(yDataMax)];


        data.forEach((item: any) => {
            xData.push(item.tagEnumName);
            if (unitVal == 0) {
                yData.push(item.coverNum);
            } else {
                yData.push((item.coverNum / unitVal).toLocaleString());
            }
        });
        const option = {
            color: this.colors,
            xAxis: {
                scale: true,
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function(a) {
                        return a + unit;
                    }
                }
            },
            animation: false,
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12
                },
                formatter: function(a) {
                    if(!a[0].value){
                        a[0].value = 0;
                    }
                    return `${a[0].name}：${a[0].value}${unit}`;
                }
            },
            series: [
                {
                    data: yData,
                    type: 'bar',
                    barMaxWidth: '30%'
                }
            ]
        };

        if (xData.length >= 10) {
            Object.assign(option, {
                dataZoom: [
                    {
                        type: 'slider'
                    }
                ]
            });
        }

        return option;
    }

    private initRefer() {
        this.tagReferType = 'table';
        if (this.tagReferChart) {
            this.tagReferChart.clear();
            this.tagReferChart = null;
        }
    }
    private initStatistic() {
        this.selectEnum = '';
        this.selectDT = null;
        if (this.listTagChart) {
            this.listTagChart.clear();
            this.listTagChart = null;
        }
        if (this.listEnumChart) {
            this.listEnumChart.clear();
            this.listEnumChart = null;
        }
    }

    private showEnum(tagComp: any) {
        // console.log(tagComp);
        this.tagEnumId = tagComp.tagEnumId;
        this.enumList(this.tagEnumId, '###').then(res => {
            this.enumData = res;
            this.showEnumDialog = true;
        });
    }

    private loadEnum(node: any, resolve: any) {
        // console.log(node.data);
        const tagEnumId = this.tagEnumId;
        const tagEnumVal = node && node.data ? node.data.tagEnumVal : '###';
        this.enumList(tagEnumId, tagEnumVal).then(res => {
            resolve(res);
        });
    }

    private isLeaf(data: any) {
        if (data.tagCateIsLeaf == 1 || data.tagEnumIsLeaf == 1) {
            return true;
        }
        return false;
    }

    // ========== ajax request  ==========

    private get(id: number) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tag/get';
            const data: object = {
                id: id
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private getTagDataSource(tagCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/admin/tag/getDsByTag';
            const data: object = {
                tagCode: tagCode
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private getTagRefer(tagCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tag/getTagRefer';
            const data: object = {
                tagCode: tagCode
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private getTagValRefer(tagCode: string, pageConf: PageConf) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tag/getTagValRefer';
            const data: object = {
                tagCode: tagCode,
                pageNum: pageConf.pageNo,
                pageSize: pageConf.pageSize
            };
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

    private listTagStatis(startDt: number, endDt: number, tagEnumVal?: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagStatistic/listTagStatis';
            const data: object = {
                tagCode: this.info.tagCode,
                startDt: Math.floor(startDt / 1000),
                endDt: Math.floor(endDt / 1000)
            };
            if (tagEnumVal) {
                Object.assign(data, {
                    tagEnumVal: tagEnumVal
                });
            }
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private listEnumStatis(dt: number) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagStatistic/listTagEnumStatis';
            const data: object = {
                tagCode: this.info.tagCode,
                dataDt: Math.floor(dt / 1000)
            };
            this.$api
                .get(url, data)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    private searchEnumVal() {
        if (this.selectEnums.length > 0) {
            return false;
        }
        const url = '/api/ava/tagEnum/searchEnumVal';
        const data: object = {
            keyword: '',
            tagCode: this.info.tagCode
        };
        this.enumLoading = true;
        this.$api
            .get(url, data)
            .then((res: any) => {
                this.selectEnums = res;
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.enumLoading = false;
            });
    }

    private enumList(tagEnumId: number, pTagEnumVal: number | string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagEnum/list';
            const data = {
                tagEnumId: tagEnumId
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
}
</script>
<style lang="scss" scoped>
.tag-info {
    width: 100%;
    /*height: 100%;*/
    overflow: auto;
    background-color: #F6F8FA;
    /*padding: 20px;*/
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;

    .header {
        width: 100%;
        height: 50px;
        display: flex;
        border-bottom: 1px solid #EAF0F9;
        background-color: #fff;

        position: relative;
        z-index: 500;

        .tabs {
            flex: 1 1 auto;
            display: flex;

            .tab-item {
                position: relative;
                width: 120px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 1rem;
                color: #aaa;
                cursor: pointer;

                &.active {
                    color: #3D6EF0;
                    &::after {
                        content: '';
                        width: 40px;
                        height: 3px;
                        display: block;
                        position: absolute;
                        left: 40px;
                        bottom: 0;
                        border-radius: 3px;
                        background: rgba(57, 107, 246, 1);
                    }
                }
            }
        }
        .go-back {
            width: 80px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .body {
        width: 100%;
        height: calc(100% - 50px);
        padding: 18px 0 18px 30px;
        background-color: #fff;
        overflow-y: auto;

        .info-item {
            width: 100%;
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0px;
            }

            &-title {
                position: relative;
                width: 100%;
                height: 42px;
                line-height: 32px;
                margin-bottom: 10px;
                padding-top: 10px;
                font-size: 16px;
                font-weight: bold;
                color: rgba(27, 27, 27, 1);
                clear: both;
            }
            &-body {
                width: 100%;
                height: auto;
                overflow: auto;
                .info-item-property1 {
                    width: calc(100% - 40px);
                }
                .info-item-property {
                    width: calc(50% - 40px);
                    float: left;
                    min-height: 40px;
                    margin-right: 39px;
                    border-bottom: 1px dashed #E5E9EC;
                    overflow: hidden;
                    &:last-child {
                        margin-bottom: 0px;
                    }

                    &-label {
                        width: 30%;
                        height: 40px;
                        text-align: left;
                        line-height: 40px;
                        font-size: 1rem;
                        color: #666;
                        cursor: default;
                        float: left;
                    }
                    &-value {
                        width: 69%;
                        line-height: 40px;
                        font-size: 1rem;
                        color: rgba(27, 27, 27, 1);
                        cursor: default;
                        text-align: right;
                        float: right;
                        white-space: nowrap;
                        text-overflow:ellipsis;
                        overflow:hidden;
                    }

                    .show-enum-btn {
                        cursor: pointer;
                        color: #396bf6;
                    }
                }
            }
        }
        .search-tools {
            width: calc(100% - 40px);
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;

            .select-enum {
                margin-left: 20px;
            }
        }
        .refer-type-select {
            width: 100%;
            display: flex;
            margin-bottom: 20px;
            .refer-type {
                width: auto;
                padding: 8px 20px;
                font-size: 0.75rem;
                background: rgba(255, 255, 255, 1);
                color: rgba(57, 107, 246, 1);
                border: 1px solid rgba(57, 107, 246, 1);
                cursor: pointer;

                &.active {
                    color: rgba(255, 255, 255, 1);
                    background: rgba(57, 107, 246, 1);
                    box-shadow: 0px 2px 4px 0px rgba(125, 125, 125, 0.5);
                }
                border-right: 0px;
                &:last-child {
                    border-right: 1px solid rgba(57, 107, 246, 1);
                }
            }
        }
        #tag-refer-chart,
        #list-tag-chart,
        #list-enum-chart {
            width: 70vw;
            min-width: 800px;
            height: 500px;
            margin: {
                left: auto;
                right: auto;
            }
        }
    }

    .pagination {
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
