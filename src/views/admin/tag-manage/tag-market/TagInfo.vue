<template>
    <div class="tag-info" v-if="info">
        <div class="header">
            <div class="tabs">
                <div class="tab-item" :class="{ active: panel == 'info' }" @click="panel = 'info'">
                    {{ info.tagClassify == 2 ? '组合' : '' }}标签定义
                </div>
                <!-- <div class="tab-item" :class="{ active: panel == 'refer' }" @click="panel = 'refer'">
          引用情况
        </div>
        <div class="tab-item" :class="{ active: panel == 'statistic' }" @click="panel = 'statistic'">
          覆盖分布
        </div> -->
            </div>
<!--            <div class="go-back">-->
<!--                <el-button @click="close" size="small">返回</el-button>-->
<!--            </div>-->
        </div>
        <div class="body self-scroll" v-show="panel == 'info'">
            <div class="tag-base-info info-item">
                <div class="info-item-title">基本信息</div>
                <div class="info-item-body">
                    <div class="info-item-property">
                        <div class="info-item-property-label">标签编码</div>
                        <div class="info-item-property-value">{{ info.tagCode ? info.tagCode : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">标签名称</div>
                        <div class="info-item-property-value">{{ info.tagName ? info.tagName : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">标签类型</div>
                        <div class="info-item-property-value">
                            {{ tagDataTypeMap[info.tagDataType] ? tagDataTypeMap[info.tagDataType] : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">标签分类</div>
                        <div class="info-item-property-value">{{ info.fullTagCateName ? info.fullTagCateName : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">限制等级</div>
                        <div class="info-item-property-value">
                            {{ tagSecLevelMap[info.tagSecLevel] ? tagSecLevelMap[info.tagSecLevel] : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">标签描述</div>
                        <div class="info-item-property-value">{{ info.tagDesc ? info.tagDesc : '' }}</div>
                    </div>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">数据信息</div>
                <div class="info-item-body">
                    <!-- <div class="info-item-property">
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
            <div class="info-item-property-label">数据更新时间</div>
            <div class="info-item-property-value">{{ info.dataDt ? formatDate(parseFloat(info.dataDt + '000')) : '' }}</div>
          </div> -->
                    <el-table :data="info.tagComponentReqVOList" size="mini" border>
                        <el-table-column prop="tagCompName" label="子标签名称" v-if="info.tagClassify == 2"> </el-table-column>
                        <el-table-column prop="dsId" label="数据源名称">
                            <template slot-scope="scope">
                                <div>{{ dataSourceMap[scope.row.dsId] ? dataSourceMap[scope.row.dsId] : scope.row.dsId }}</div>
                            </template>
                        </el-table-column>
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
                                <span v-if="scope.row.tagCompStyle == 21" @click="showEnum(scope.row)"
                                    >枚举型-1级 ——
                                    <span class="show-enum-btn">{{ tagEnumNameMap[scope.row.tagEnumId] }}<i class="el-icon-tickets"></i></span>
                                </span>
                                <span v-if="scope.row.tagCompStyle == 22" @click="showEnum(scope.row)"
                                    >枚举型-N级 ——
                                    <span class="show-enum-btn">{{ tagEnumNameMap[scope.row.tagEnumId] }}<i class="el-icon-tickets"></i></span>
                                </span>
                                <span v-if="scope.row.tagCompStyle == 31">自定义型-数值</span>
                                <span v-if="scope.row.tagCompStyle == 32">自定义型-文本</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dsCol" label="字段名称">
                            <template slot-scope="scope">
                                <div v-for="item in scope.row.tagComponentColumnReqVOList" :key="item.id">
                                    {{ item.dsCol }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="tagCompColType" label="数据类型">
                            <template slot-scope="scope">
                                <div v-for="item in scope.row.tagComponentColumnReqVOList" :key="item.id">
                                    {{ item.tagCompColType }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="tag-data-info info-item">
                <div class="info-item-title">数据源信息</div>
                <div class="info-item-body" v-if="dataSourceInfo">
                    <div class="info-item-property">
                        <div class="info-item-property-label">库名</div>
                        <div class="info-item-property-value">
                            {{ dataSourceInfo.sourceDb ? dataSourceInfo.sourceDb : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">表名</div>
                        <div class="info-item-property-value">
                            {{ dataSourceInfo.sourceTbOrTopic ? dataSourceInfo.sourceTbOrTopic : '' }}
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">ID列</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.sourceColId ? dataSourceInfo.sourceColId : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">DT列</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.sourceColDt ? dataSourceInfo.sourceColDt : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">表负责人</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.sourceTbManager ? dataSourceInfo.sourceTbManager : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">源库名</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.targetDb ? dataSourceInfo.targetDb : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">位图库名</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.bitmapDb ? dataSourceInfo.bitmapDb : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">源表名</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.targetTb ? dataSourceInfo.targetTb : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">生命周期(天)</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.targetTbLife ? dataSourceInfo.targetTbLife : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">命名空间</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.hbaseNs ? dataSourceInfo.hbaseNs : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">列簇</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.hbaseColFamily ? dataSourceInfo.hbaseColFamily : '' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">表名</div>
                        <div class="info-item-property-value">{{ dataSourceInfo.hbaseTb ? dataSourceInfo.hbaseTb : '' }}</div>
                    </div>
                </div>
            </div>
            <!-- <div class="tag-data-info info-item">
        <div class="info-item-title">使用形式</div>
        <div class="info-item-body">
          <div class="info-item-property">
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
                  <span class="show-enum-btn" v-if="scope.row.tagCompStyle == 21" @click="showEnum(scope.row)"
                    >枚举型
                    <i class="el-icon-tickets"></i>
                  </span>
                  <span class="show-enum-btn" v-if="scope.row.tagCompStyle == 22" @click="showEnum(scope.row)"
                    >枚举型 <i class="el-icon-tickets"></i
                  ></span>
                  <span v-if="scope.row.tagCompStyle == 31">自定义型-数值</span>
                  <span v-if="scope.row.tagCompStyle == 32">自定义型-文本</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div> -->
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
                <el-table :data="tagReferData" size="small" border>
                    <el-table-column prop="crowdCode" label="群体编码" min-width="180"> </el-table-column>
                    <el-table-column prop="crowdName" label="群体名称"> </el-table-column>
                    <el-table-column prop="createdTime" label="建群时间" min-width="180"> </el-table-column>
                    <el-table-column prop="sysName" label="应用系统"> </el-table-column>
                    <el-table-column label="应用类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.touchType == 1">命中</span>
                            <span v-else-if="scope.row.touchType == 2">下载</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="应用开始日期" min-width="150">
                        <template slot-scope="scope">
                            {{ scope.row.touchBegin ? formatDate(scope.row.touchBegin, 'YYYY-MM-DD') : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="应用结束日期" min-width="150">
                        <template slot-scope="scope">
                            {{ scope.row.touchEnd ? formatDate(scope.row.touchEnd, 'YYYY-MM-DD') : '' }}
                        </template>
                    </el-table-column>
                </el-table>
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
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                                @change="time1change"
                            >
                            </el-date-picker>
                        </div>
                        <div class="select-enum" v-if="isEnum">
                            <el-select
                                v-model="selectEnum"
                                size="small"
                                filterable
                                remote
                                clearable
                                placeholder="请选择枚举"
                                :remote-method="searchEnumVal"
                                :loading="enumLoading"
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
                        <el-date-picker v-model="selectDT" type="date" align="right" size="small" value-format="yyyy-MM-dd"> </el-date-picker>
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
<!--        <el-dialog :close-on-click-modal="false" :visible.sync="showEnumDialog">-->
<!--            <div slot="title" class="dialog-title">枚举详情</div>-->
            <!-- <el-tree :props="enumProp" :load="loadEnum" lazy check-strictly></el-tree> -->
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

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
    @Prop()
    private tagId!: any;
    @Prop()
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
    private selectEnum: string | null = null;
    private selectEnums: any = [];
    private enumLoading: boolean = false;
    private selectDT: string | null = null; // 枚举覆盖分布-时间
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
    @Watch('selectDT')
    private selectDTChange() {
        this.getListEnumData();
    }

    get isEnum() {
        if (!this.info) {
            return false;
        }
        if (this.info.tagClassify == 2) {
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

    private dataSourceMap: object = {};

    private mounted() {
        this.init();
        this.initDate();
    }

    private getMaps() {
        this.getDsIdOptions();
        this.getTagEnumNameMap();
    }

    private tagEnumNameMap: object = {};

    private async getTagEnumNameMap() {
        const param = {
            tagEnumType: this.info.tagClassify,
            subjectId: window.sessionStorage.getItem('subjectId')
        };
        await this.$api.get('/api/admin/tagEnum/list', param).then((res: any) => {
            if (res.result === '1') {
                res.data.forEach((item: any) => {
                    this.$set(this.tagEnumNameMap, `${item.id}`, item.tagEnumName);
                });
            }
        });
    }

    private getDsIdOptions() {
        const params = {
            dsType: this.info.tagClassify,
            subjectId: this.info.subjectId
        };
        this.$api.get(`/api/admin/sysDs/queryDsName`, params).then((result: any) => {
            if (result.result === '1') {
                result.data.forEach((item: any) => {
                    this.$set(this.dataSourceMap, `${item.id}`, item.dsName);
                });
                console.log(this.dataSourceMap);
            }
        });
    }

    private init() {
        if (!this.id) {
            return;
        } else {
            this.get(this.id)
                .then((res: any) => {
                    res.tagComponentReqVOList.forEach((item: any) => {
                        this.$set(item, 'dsId', item.tagComponentColumnReqVOList[0].dsId.toString());
                    });
                    this.info = res;
                    this.getMaps();
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
    private close() {
        this.$router.push({
            name: 'tag-market'
        });
    }

    private initDate() {
        const cur = new Date().getTime();
        const pre = cur - 30 * 24 * 60 * 60 * 1000;
        this.time1 = [moment(new Date().setTime(pre)).format('YYYY-MM-DD'), moment(new Date().setTime(cur)).format('YYYY-MM-DD')];
        this.selectDT = moment(new Date().setTime(cur)).format('YYYY-MM-DD');
    }

    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    private getTagReferData() {
        if (!this.info || !this.info.tagCode) {
            return;
        }
        this.getTagRefer(this.info.tagCode)
            .then((res: any) => {
                this.tagReferData = res;
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
                source: refer.tagName,
                target: refer.crowdName,
                value: 1
            };
            const touchTypeName: string = refer.touchType == 1 ? '命中' : '下载';
            const item2 = {
                source: refer.crowdName,
                target: `${refer.sysName}-${touchTypeName}`,
                value: 1
            };
            nodeSet.add(refer.tagName);
            nodeSet.add(refer.crowdName);
            nodeSet.add(`${refer.sysName}-${touchTypeName}`);
            links.push(item1, item2);
        });
        for (const node of nodeSet.values()) {
            nodes.push({
                name: node
            });
        }
        const option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: {
                type: 'sankey',
                layout: 'none',
                focusNodeAdjacency: 'allEdges',
                data: nodes,
                links: links
            }
        };
        return option;
    }

    private time1change() {
        this.getListTagData();
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
                this.listTagChart.on('click', (params: any) => {
                    this.selectDT = params.name;
                    this.getListEnumData();
                });
            }
        }
    }
    private buildListTagChart(data: any) {
        const xData: any[] = [];
        const yData: any[] = [];
        data.forEach((item: any) => {
            xData.push(item.dataDt);
            yData.push(item.coverNum);
        });
        const option = {
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: yData,
                    type: 'line'
                }
            ]
        };
        return option;
    }

    private getListEnumData() {
        if (!this.selectDT) {
            return;
        }
        if (!this.isEnum) {
            return;
        }
        this.listEnumStatis(this.selectDT as string).then(res => {
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
        const xData: any[] = [];
        const yData: any[] = [];
        data.forEach((item: any) => {
            xData.push(item.tagCode);
            yData.push(item.coverNum);
        });
        const option = {
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: yData,
                    type: 'line'
                }
            ]
        };
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
        this.selectEnum = null;
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

    private listTagStatis(startDt: string, endDt: string, tagEnumVal?: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagStatistic/listTagStatis';
            const data: object = {
                tagCode: this.info.tagCode,
                startDt: startDt,
                endDt: endDt
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

    private listEnumStatis(dt: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagStatistic/listTagEnumStatis';
            const data: object = {
                tagCode: this.info.tagCode,
                dataDt: dt
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

    private searchEnumVal(query: string) {
        const url = '/api/ava/tagEnum/searchEnumVal';
        const data: object = {
            keyword: query,
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
                tagEnumId: tagEnumId,
                // pTagEnumVal: pTagEnumVal
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
}
</script>
<style lang="scss" scoped>
.show-enum-btn {
    cursor: pointer;
    color: #396bf6;
}
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
        height: 64px;
        display: flex;
        border-bottom: 1px solid #EAF0F9;
        background-color: #fff;
        box-shadow: 0px 2px 4px 0px rgba(170, 170, 170, 0.5);

        .tabs {
            flex: 1 1 auto;
            display: flex;
            margin-left: 40px;

            .tab-item {
                position: relative;
                width: 150px;
                height: 64px;
                line-height: 64px;
                text-align: center;
                font-size: 1rem;
                font-weight: bold;
                color: rgba(27, 27, 27, 1);
                cursor: pointer;

                &.active {
                    &::after {
                        content: '';
                        width: 100%;
                        height: 4px;
                        display: block;
                        position: absolute;
                        bottom: 0px;
                        background: rgba(57, 107, 246, 1);
                    }
                }
            }
        }
        .go-back {
            width: 200px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .body {
        width: 100%;
        height: calc(100% - 72px);
        padding: 18px 40px;
        background-color: #fff;
        overflow-y: auto;

        display: flex;
        flex-direction: column;

        .info-item {
            width: 100%;
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0px;
            }

            &-title {
                position: relative;
                width: 100%;
                height: 32px;
                line-height: 32px;
                margin-bottom: 10px;
                font-size: 1rem;
                font-weight: bold;
                color: rgba(27, 27, 27, 1);
                padding-left: 20px;

                &::before {
                    content: '';
                    width: 5px;
                    height: 20px;
                    display: block;
                    position: absolute;
                    top: 6px;
                    left: 0px;
                    background: rgba(57, 107, 246, 1);
                }
            }
            &-body {
                width: 100%;
                height: auto;

                display: flex;
                flex-direction: column;

                .info-item-property {
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-bottom: 20px;
                    &:last-child {
                        margin-bottom: 0px;
                    }

                    &.500 {
                        width: 500px;
                    }

                    &-label {
                        width: 150px;
                        height: 22px;
                        text-align: right;
                        line-height: 22px;
                        font-size: 1rem;
                        color: rgba(102, 102, 102, 1);
                        margin-right: 20px;
                        cursor: default;
                    }
                    &-value {
                        width: calc(100% - 120px);
                        line-height: 22px;
                        font-size: 1rem;
                        color: rgba(27, 27, 27, 1);
                        cursor: default;
                    }
                }
            }
        }
        .search-tools {
            width: 100%;
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
                width: 150px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 1rem;
                color: rgba(51, 51, 51, 1);
                border: 1px solid #d8d8d8;
                cursor: pointer;
                &.active {
                    color: rgba(255, 255, 255, 1);
                    background: rgba(146, 172, 245, 1);
                    border: 0px;
                }
                border-right: 0px;
                &:last-child {
                    border-right: 1px solid #d8d8d8;
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
/deep/ .el-table__body-wrapper {
    &::-webkit-scrollbar,
    & textarea::-webkit-scrollbar {
        width: 6px;
        height: 0px;
    }

    &::-webkit-scrollbar-thumb,
    & textarea::-webkit-scrollbar-thumb {
        background: #d8d8d8;
    }

    &::-webkit-scrollbar-track,
    & textarea::-webkit-scrollbar-track {
        background: #e9e9e9;
    }
}
</style>
