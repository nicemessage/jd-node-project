<template>
    <div class="crowd-info">
        <div class="header">
            <div class="tabs">
                <div class="tab-item" v-for="tab of tabs" :key="tab.key" :class="{ active: panel == tab.key }" @click="panel = tab.key">
                    {{ tab.label }}
                </div>
            </div>
            <div class="go-back">
                <el-button v-if="showUpdateBtn" type="primary" @click="calcCrowd" size="small">更新</el-button>
                <el-button @click="goBack" size="small">返回</el-button>
            </div>
        </div>
        <div class="body" v-show="panel == 'info'">
            <div class="info-item">
                <div class="info-item-title">基本信息</div>
                <div class="info-item-body" v-if="crowd">
                    <div class="info-item-property">
                        <div class="info-item-property-label">群体名称</div>
                        <div class="info-item-property-value">{{ crowd.crowdName ? crowd.crowdName : '-' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">群体数量</div>
                        <div class="info-item-property-value">{{ crowd.crowdRealNum === null ? '-' : crowd.crowdRealNum }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">群体ID</div>
                        <div class="info-item-property-value">{{ crowd.crowdCode ? crowd.crowdCode : '-' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">群体负责人</div>
                        <div class="info-item-property-value">{{ crowd.crowdManager ? crowd.crowdManager : '-' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">群体状态</div>
                        <div class="info-item-property-value">
                            <template v-if="crowd.crowdState == 1">加工中</template>
                            <template v-if="crowd.crowdState == 2">有效</template>
                            <template v-if="crowd.crowdState == 3">加工失败</template>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">更新日期</div>
                        <div class="info-item-property-value">{{ crowd.crowdDataDt ? formatDate(crowd.crowdDataDt, 'YYYY-MM-DD') : '-' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">创建人</div>
                        <div class="info-item-property-value">{{ crowd.creator ? crowd.creator : '-' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">创建时间</div>
                        <div class="info-item-property-value">{{ crowd.createdTime ? formatDate(crowd.createdTime) : '-' }}</div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">创建方式</div>
                        <div class="info-item-property-value">
                            <template v-if="crowd.crowdType == 1">标签圈群</template>
                            <template v-if="crowd.crowdType == 2">文件建群</template>
                            <template v-if="crowd.crowdType == 3">-</template>
                            <template v-if="crowd.crowdType == 4">库表建群</template>
                            <template v-if="crowd.crowdType == 5">二次筛选</template>
                            <template v-if="crowd.crowdType == 6">地址建群</template>
                        </div>
                    </div>
                    <div class="info-item-property">
                        <div class="info-item-property-label">群体描述</div>
                        <div class="info-item-property-value desc">{{ crowd.crowdDesc ? crowd.crowdDesc : '-' }}</div>
                    </div>
                    <template v-if="crowd.crowdType == 1">
                        <div class="info-item-property">
                            <div class="info-item-property-label">筛选条件</div>
                            <div class="info-item-property-value">
                                <div v-for="(filter, index) in definedDesc.expression" :key="index" class="crowd-enum-item-list">
                                    <div class="info-filter-item">
                                        <div class="info-tag-item" v-for="(tag, tIndex) in filter.tag" :key="tIndex">
                                            <div class="info-tag-time" style="float: right; background: #f7f8fd;">{{getTagTime(tag)}}</div>
                                            <div v-if="tag.tagComponent.length > 1" style="text-align: left; background: #f7f8fd;">
                                                <div style="display: inline-block; width: 3px; height: 12px; background: rgba(62,106,246,1); vertical-align: middle;"></div>
                                                <div class="info-tag-title" style="text-align: left; margin-left: 8px; display: inline-block; background: #f7f8fd;">{{tag.tagData.tagName}}</div>
                                            </div>
                                            <div class="info-tag-content" v-for="(tagComponent, tcIndex) in tag.tagComponent" :key="tcIndex">
                                                <div class="info-tag-tip"></div>
                                                <div class="info-tag-title">{{getTagName(tagComponent)}}</div>
                                                <el-tooltip :content="getTagValue(tag, tcIndex)" placement="top">
                                                    <div class="info-tag-value">{{getTagValue(tag, tcIndex)}}</div>
                                                </el-tooltip>
                                            </div>
                                            <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div>
                                        </div>
                                    </div>
                                    <div v-if="definedDesc.logic.length > index" class="logic-1 info-filter-logic">{{mapLogic(index)}}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="crowd.crowdType == 4">
                        <db-detail :dbInfo="crowd.crowdDefineDesc"></db-detail>
                    </template>
                    <template v-if="crowd.crowdType == 5">
                        <div class="info-item-property">
                            <div class="info-item-property-label">筛选条件</div>
                            <div else class="info-item-property-value">
                                <div v-if="definedDesc.valueType == 1">
                                    <div class="info-filter-item">
                                        <div class="info-tag-item">
                                            <div class="info-tag-content">
                                                <div class="info-tag-tip"></div>
                                                <div class="info-tag-title" style="float: none; margin-bottom: 0; font-weight: bold;">群体：{{getCrowdNameTwo(definedDesc.crowd)}}</div>
                                                <!-- <div class="info-tag-time">{{getTagTime(tag)}}</div> -->
                                                <!-- <div class="info-tag-value1">{{getTagValueTwo(filter)}}</div> -->
                                            </div>
                                            <!-- <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div> -->
                                        </div>
                                    </div>
                                    <div class="logic-1 info-filter-logic">{{mapLogic(0, [definedDesc.logicCrowd])}}</div>
                                </div>
                                <div v-for="(filter, index) in definedDesc.expression" :key="index" class="crowd-enum-item-list">
                                    <div class="info-filter-item">
                                        <div class="info-tag-item">
                                            <div class="info-tag-content">
                                                <div class="info-tag-tip"></div>
                                                <div class="info-tag-title">{{getTagNameTwo(filter)}}</div>
                                                <!-- <div class="info-tag-time">{{getTagTime(tag)}}</div> -->
                                                <div class="info-tag-value1">{{getTagValueTwo(filter)}}</div>
                                            </div>
                                            <!-- <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div> -->
                                        </div>
                                    </div>
                                    <div v-if="definedDesc.expression.length - 1 > index" class="logic-1 info-filter-logic">{{mapLogic(index, definedDesc.logic)}}</div>
                                </div>
                                <div v-if="definedDesc.valueType != 1">
                                    <div class="logic-1 info-filter-logic">{{mapLogic(0, [definedDesc.logicCrowd])}}</div>
                                    <div class="info-filter-item" style="margin-top: 10px;">
                                        <div class="info-tag-item">
                                            <div class="info-tag-content">
                                                <div class="info-tag-tip"></div>
                                                <div class="info-tag-title" style="float: none; margin-bottom: 0; font-weight: bold;">群体：{{getCrowdNameTwo(definedDesc.crowd)}}</div>
                                                <!-- <div class="info-tag-time">{{getTagTime(tag)}}</div> -->
                                                <!-- <div class="info-tag-value1">{{getTagValueTwo(filter)}}</div> -->
                                            </div>
                                            <!-- <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="info-item-property-value" style="width: calc(100% - 40px); float: left;" v-html="genEnumContentTwo()"></div> -->
                        </div>
                    </template>
                </div>
            </div>
            <div class="info-item-select">
                <div class="info-type-select" :class="{ active: infoShowType == 'record' }" @click="selectShowType('record')">
                    更新记录
                </div>
                <div class="info-type-select" :class="{ active: infoShowType == 'quote' }" @click="selectShowType('quote')">
                    应用任务
                </div>
            </div>
            <div class="info-item">
                <div class="info-item-body">
                    <div>
                        <el-table
                            v-if="infoShowType == 'record'"
                            :data="crowdHistoryList"
                            size="small"
                            border
                            empty-text="暂无更新记录"
                            :header-cell-style="{ textAlign: 'center' }"
                            :cell-style="{ textAlign: 'center' }"
                        >
                            <el-table-column prop="crowdVersion" label="群体版本" width="150"></el-table-column>
                            <el-table-column label="更新开始时间" width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.createdTime ? formatDate(scope.row.createdTime) : '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="更新结束时间" width="150">
                                <template slot-scope="scope">
                                    {{ (scope.row.modifiedTime && scope.row.crowdState != 1) ? formatDate(scope.row.modifiedTime) : '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column width="120">
                                <template slot="header">
                                    <el-select v-model="crowdUpdateType" size="mini">
                                        <el-option label="更新类型" :value="null"></el-option>
                                        <el-option label="修改更新" :value="1"></el-option>
                                        <el-option label="手动更新" :value="2"></el-option>
                                        <el-option label="触达更新" :value="3"></el-option>
                                    </el-select>
                                </template>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.crowdUpdateType == 1">修改更新</span>
                                    <span v-if="scope.row.crowdUpdateType == 2">手动更新</span>
                                    <span v-if="scope.row.crowdUpdateType == 3">触达更新</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="modifier" label="更新人" width="120"> </el-table-column>
                            <el-table-column label="更新日期" width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.crowdDataDt ? formatDate(scope.row.crowdDataDt, 'YYYY-MM-DD') : '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="crowdRealNum" label="群体数量" min-width="180"> </el-table-column>
                            <el-table-column label="状态" width="80">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.crowdState == 1">加工中</span>
                                    <span v-if="scope.row.crowdState == 2">有效</span>
                                    <span v-if="scope.row.crowdState == 3">
                                        <el-tooltip class="item" effect="dark" :content="scope.row.crowdMsg" placement="left">
                                            <div>加工失败</div>
                                        </el-tooltip>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="使用标签" min-width="180" align="left" v-if="crowd.crowdType == 1||crowd.crowdType == 5">
                                <template slot-scope="scope">
                                    <div style="text-align: center;">
                                        <el-button @click="showCrowdRow(scope.row)">详情</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="crowd.crowdType == 4" label="SQL详情" min-width="100">
                                <template slot-scope="scope">
                                    <a v-if="scope.row.updateSQL" @click="showSQL(scope.row)">详情</a>
                                    <div v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div>
                        <div style="position:relative;"
                            v-if="infoShowType == 'quote'">
                            <div class="crowd-quote-search">
                                <div class="crowd-quote-search-item">
                                    <el-input style="width: 100%" size="small" v-model="searchTaskName" clearable placeholder="任务名称"></el-input>
                                </div>
                                <div class="crowd-quote-search-item">
                                    <el-select
                                        v-model="searchSystemName"
                                        size="small"
                                        value-key="sysName"
                                        style="width: 100%;"
                                        filterable
                                        remote
                                        clearable
                                        placeholder="请输入系统名称/系统编码"
                                        :remote-method="searchSys"
                                        :loading="selectLoading"
                                        @change="sysSelectChange"
                                    >
                                        <el-option v-for="item in sysList" :key="item.id" :label="item.sysName" :value="item.sysCode"> </el-option>
                                    </el-select>
                                    <!-- <el-input style="width: 100%" size="small" v-model="searchSystemName" clearable placeholder="应用系统"></el-input> -->
                                </div>
                                <div class="crowd-quote-search-item">
                                    <el-input style="width: 100%" size="small" v-model="searchTaskCreateErp" clearable placeholder="任务创建人"></el-input>
                                </div>
                                <div class="crowd-quote-search-item">
                                    <el-button size="small" type="primary" @click="getCrowdQuoteList">查询</el-button>
                                </div>
                            </div>
                            <el-table
                                :data="crowdQuoteList"
                                empty-text="暂无应用任务"
                                size="small"
                                border
                                :header-cell-style="{ textAlign: 'center' }"
                                :cell-style="{ textAlign: 'center' }"
                            >
                                <el-table-column property="touchName" label="任务名称"></el-table-column>
                                <el-table-column property="sysName" label="应用系统"></el-table-column>
                                <el-table-column property="creator" label="任务创建人" width="150"></el-table-column>
                                <el-table-column label="更新机制">
                                    <template slot-scope="scope">
                                        {{crowdUpdateCycleMap[scope.row.crowdUpdateCycle]}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="状态" width="100">
                                    <template slot-scope="scope">
                                    {{ getTouchState(scope.row)}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="任务应用周期">
                                    <template slot-scope="scope">
                                        {{ (scope.row.touchBegin ? formatDate(scope.row.touchBegin, 'YYYY-MM-DD') : '-') + ' ~ ' + (scope.row.touchEnd ? formatDate(scope.row.touchEnd, 'YYYY-MM-DD') : '-') }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="pagination" v-show="pageConf.total > 0">
                        <el-pagination
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageConf.total"
                            :page-size.sync="pageConf.pageSize"
                            :current-page.sync="pageConf.pageNo"
                            :page-sizes="pageConf.pageSizeList">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <el-drawer
            title="筛选条件"
            :visible.sync="showTempDefinedDescDialog"
            :modal="false"
            direction="rtl"
            size="50%">
            <div v-if="crowd" style="overflow: auto; position: absolute; width: 100%; height: calc(100% - 80px);">
                <div v-if="crowd.crowdType == 1" class="info-item-property-value" style="width: calc(100% - 40px); margin: 0 auto; position: relative;">
                    <div v-for="(filter, index) in tempDefinedDesc.expression" :key="index" class="crowd-enum-item-list">
                        <div class="info-filter-item">
                            <div class="info-tag-item" v-for="(tag, tIndex) in filter.tag" :key="tIndex">
                                <div class="info-tag-time" style="float: right; background: #f7f8fd;">{{getTagTime(tag)}}</div>
                                <div v-if="tag.tagComponent.length > 1" style="text-align: left; background: #f7f8fd;">
                                    <div style="display: inline-block; width: 3px; height: 12px; background: rgba(62,106,246,1); vertical-align: middle;"></div>
                                    <div class="info-tag-title" style="text-align: left; margin-left: 8px; display: inline-block; background: #f7f8fd;">{{tag.tagData.tagName}}</div>
                                </div>
                                <div class="info-tag-content" v-for="(tagComponent, tcIndex) in tag.tagComponent" :key="tcIndex">
                                    <div class="info-tag-tip"></div>
                                    <div class="info-tag-title">{{getTagName(tagComponent)}}</div>
                                    <div class="info-tag-value1">{{getTagValue(tag, tcIndex)}}</div>
                                </div>
                                <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div>
                            </div>
                        </div>
                        <div v-if="tempDefinedDesc.logic.length > index" class="logic-1 info-filter-logic">{{mapLogic(index, tempDefinedDesc.logic)}}</div>
                    </div>
                </div>
                <div v-else class="info-item-property-value" style="width: calc(100% - 40px); margin: 0 auto; position: relative;">
                    <div v-if="tempDefinedDesc.valueType == 1">
                        <div class="info-filter-item">
                            <div class="info-tag-item">
                                <div class="info-tag-content">
                                    <div class="info-tag-tip"></div>
                                    <div class="info-tag-title" style="float: none; margin-bottom: 0; font-weight: bold;">群体：{{getCrowdNameTwo(tempDefinedDesc.crowd)}}</div>
                                    <!-- <div class="info-tag-time">{{getTagTime(tag)}}</div> -->
                                    <!-- <div class="info-tag-value1">{{getTagValueTwo(filter)}}</div> -->
                                </div>
                                <!-- <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div> -->
                            </div>
                        </div>
                        <div class="logic-1 info-filter-logic">{{mapLogic(0, [tempDefinedDesc.logicCrowd])}}</div>
                    </div>
                    <div v-for="(filter, index) in tempDefinedDesc.expression" :key="index" class="crowd-enum-item-list">
                        <div class="info-filter-item">
                            <div class="info-tag-item">
                                <div class="info-tag-content">
                                    <div class="info-tag-tip"></div>
                                    <div class="info-tag-title">{{getTagNameTwo(filter)}}</div>
                                    <!-- <div class="info-tag-time">{{getTagTime(tag)}}</div> -->
                                    <div class="info-tag-value1">{{getTagValueTwo(filter)}}</div>
                                </div>
                                <!-- <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div> -->
                            </div>
                        </div>
                        <div v-if="tempDefinedDesc.expression.length - 1 > index" class="logic-1 info-filter-logic">{{mapLogic(index, tempDefinedDesc.logic)}}</div>
                    </div>
                    <div v-if="tempDefinedDesc.valueType != 1">
                        <div class="logic-1 info-filter-logic">{{mapLogic(0, [tempDefinedDesc.logicCrowd])}}</div>
                        <div class="info-filter-item" style="margin-top: 10px;">
                            <div class="info-tag-item">
                                <div class="info-tag-content">
                                    <div class="info-tag-tip"></div>
                                    <div class="info-tag-title" style="float: none; margin-bottom: 0; font-weight: bold;">群体：{{getCrowdNameTwo(tempDefinedDesc.crowd)}}</div>
                                    <!-- <div class="info-tag-time">{{getTagTime(tag)}}</div> -->
                                    <!-- <div class="info-tag-value1">{{getTagValueTwo(filter)}}</div> -->
                                </div>
                                <!-- <div v-if="filter.logic.length > tIndex" class="logic info-tag-logic">{{mapLogic(tIndex, filter.logic)}}</div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <el-dialog :close-on-click-modal="false" :visible.sync="showSQLDialog" width="1100px" :before-close="hideSQLDialog">
            <div slot="title" class="dialog-title">SQL详情</div>
            <div style="padding: 30px;">
                {{sql}}
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
/**
 * @name CrowdInfo
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Watch } from 'vue-property-decorator';

// mixin引入

// 第三方库引入
import moment from 'moment';
import DbDetail from './DbDetail.vue';

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明

interface Crowd {
    crowdCode: string;
    crowdVersion: string;
    [propName: string]: string | number;
}

interface CrowdHistory {
    crowdVersion: string;
}

interface PageConf {
    pageNo: number;
    pageSize: number;
    pageSizeList: Array<number>;
    total: number;
}

@Component({
    components: { DbDetail }
})
export default class CrowdInfo extends Vue {
    private DEFAULT_TOKEN_5K: string = '2bc70b4b5cbb49e79a63b20189bc9b96';
    private DEFAULT_TOKEN_JZT: string = 'b327a6d2aa95401bb1d88459557c6276';
    get crowdCode() {
        return this.$route.params.crowdCode ? this.$route.params.crowdCode : null;
    }
    private crowd: Crowd | null = null;
    private definedDesc: any = {};
    private tempDefinedDesc: any = {expression:null, logic:null};
    private showTempDefinedDescDialog: boolean = false;
    private selectLoading: boolean = false;
    private sysList: any[] = [];

    private loading: boolean = false;
    private crowdUpdateCycleMap: any = {
        1:"不更新",
        2:"依赖更新",
        3:"定时更新"
    };

    private nameMap: any = {
        1: 'tag-to-crowd',
        2: 'file-to-crowd',
        3: '-',
        4: 'db-to-crowd',
        5: 'two-to-crowd',
        6: 'address-to-crowd'
    };

    private panel: string = 'info';
    private tabs: object = [
        {
            label: '群体详情',
            key: 'info'
        }
        // {
        //     label: '引用情况',
        //     key: 'refer'
        // },
        // {
        //     label: '覆盖情况',
        //     key: 'statistic'
        // }
    ];

    private showSQLDialog: boolean = false;
    private infoShowType: string = ""; // 当前显示为更新记录还是引用状况
    private crowdHistoryList: Array<CrowdHistory> = [];
    private crowdQuoteList: Array<CrowdQuote> = [];

    private searchTaskName: string = "";
    private searchSystemName: string = "";
    private searchTaskCreateErp: string = "";
    private sql: string = "";

    private pageConf: PageConf = {
        pageNo: 1,
        pageSize: 10,
        pageSizeList: [5, 10, 20, 50],
        total: 0
    };
    private crowdUpdateType: number | null = null;
    @Watch('crowdUpdateType')
    private crowdUpdateTypeChange() {
        this.getCrowdHistory();
    }

    @Watch('pageConf.pageSize')
    private pageSizeChange() {
        if (this.infoShowType == "record") {
            this.getCrowdHistory();
        } else {
            this.getCrowdQuoteList();
        }
    }
    @Watch('pageConf.pageNo')
    private pageNoChange() {
        if (this.infoShowType == "record") {
            this.getCrowdHistory();
        } else {
            this.getCrowdQuoteList();
        }
    }

    get showUpdateBtn() {
        if (!this.crowd) {
            return false;
        }
        if (this.crowd.crowdType == 1 && this.crowd.crowdTouchState == 0) {
            return true;
        }
        return false;
    }

    get showUpdateRecordEdit() {
        // console.log(this.crowd);
        if (!this.crowd || this.crowd.crowdState == 1) {
            return false;
        }
        const userErp:string = window.sessionStorage.getItem("userErp");
        const crowdManager:[] = this.crowd.crowdManager.split(",");

        if (this.crowd.crowdType == 1 || this.crowd.crowdType == 4) {
            if(crowdManager.indexOf(userErp) != -1){
                return true;
            }
        }
        return false;
    }

    get showUpdateRecord() {
        if (!this.crowd) {
            return false;
        }
        if (this.crowd.crowdType == 1 || this.crowd.crowdType == 4 || this.crowd.crowdType == 5) {
            return true;
        }
        return false;
    }

    private mounted() {
        this.init();
    }

    private goBack() {
        const target = {
            name: 'admin/crowd-manage'
        };
        this.$router.push(target);
    }

    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
    }

    private init() {
        this.getCrowdInfo();
    }

    private getCrowdInfo() {
        if (!this.crowdCode) {
            return;
        }
        this.loading = true;
        this.detail(this.crowdCode).then((res: any) => {
            const info: any = res;
            this.crowd = info;
            const crowdDefineDesc = JSON.parse(info ? info.crowdDefineDesc : (info.crowdDefineDesc as string));
            this.definedDesc = crowdDefineDesc;
            this.$nextTick(() => {
                this.getCrowdHistory();
                if (this.infoShowType != "record") {
                    this.infoShowType = "quote";
                    this.getCrowdQuoteList();
                }
            });
        }).finally( () => {
            this.loading = false;
        });
    }

    private getCrowdHistory() {
        if (!this.crowd || !this.crowd.crowdCode || !this.crowd.crowdVersion || !this.crowd.crowdType) {
            return;
        }
        if (!this.showUpdateRecord) {
            return;
        }
        this.infoShowType = "record";
        this.crowdHistory(this.crowd.crowdCode, this.crowdUpdateType).then((res: any) => {
            this.crowdHistoryList = res.list.slice(0);
            this.pageConf.total = res.total;
        });
    }

    private getCrowdQuoteList() {
        if (!this.crowd || !this.crowd.crowdCode || !this.crowd.crowdVersion || !this.crowd.crowdType) {
            return;
        }
        // 不用做是否展示判断，所有类型都应该有引用记录
        // 请求引用记录
        this.crowdQuotes(this.crowd.crowdCode).then((res: any) => {
            this.crowdQuoteList = res.list.slice(0);
            this.pageConf.total = res.total;
        });
    }

    private getTouchState(row: any) {
        if (row.touchStatus == '1') {
            return "未开始";
        } else if (row.touchStatus == '2') {
            return "准备中";
        } else if (row.touchStatus == '3') {
            return "应用中";
        } else if (row.touchStatus == '4') {
            return "结束";
        } else if (row.touchStatus == '5') {
            return "失败";
        }
        return "-";
    }

    private selectShowType(type: string) {
        this.infoShowType = type;
        this.pageConf = {
            pageNo: 1,
            pageSize: 10,
            pageSizeList: [5, 10, 20, 50],
            total: 0
        };
        this.searchTaskName = "";
        this.searchSystemName = "";
        this.searchTaskCreateErp = "";
        // 假装页面更换了，其实是为了刷新数据
        this.pageSizeChange();
    }

    private showSQL(item: any) {
        this.sql = item.updateSQL;
        //console.log(item.updateSQL);
        this.showSQLDialog = true;
    }

    private hideSQLDialog() {
        this.sql = "";
        this.showSQLDialog = false;
    }

    private calcCrowd() {
        if (!this.crowdCode) {
            return;
        }
        this.crowdCalculate(this.crowdCode).then(() => {
            this.$message.success('更新请求已提交');
            this.getCrowdHistory();
        });
    }

    // 二次筛选组合标签信息
    private genEnumContentTwo(crowd?: any) {
        if (!this.crowd || this.crowd.crowdType != 5) {
            return '';
        }
        let text:string = '';
        const map:any = {
            '_AND': '且',
            '_OR': '或',
            '_NOT': '非',
            'undefined':''
        };
        try{
            const crowdDefineDesc = JSON.parse(crowd ? crowd.crowdDefineDesc : (this.crowd.crowdDefineDesc as string));
            for (const i in crowdDefineDesc.expression) {
                let teg:string = crowdDefineDesc.expression[i].tagVal;
                let text1:any = '';
                teg = `${teg} ：`;
                for (const j in crowdDefineDesc.expression[i].enums) {
                    teg += this.showName(crowdDefineDesc.expression[i].enums[j]);
                    teg += " ";
                }
                text1 = text1+teg;
                text1 = `<div>${text1}</div>`;
                if(i != 0){
                    text1 = `<div class="logic-1">${map[crowdDefineDesc.logic[i-1]]}</div>${text1}`;
                }
                text += text1;
            }
            //text = text+map['_AND'];
            // 这里显示对什么群组进行的二次筛选
            if(crowdDefineDesc.valueType == 1){
                text = `<div style="font-weight: bold">群体：${crowdDefineDesc.crowd.crowdName}</div><div class="logic-1">${map[crowdDefineDesc.logicCrowd]}</div>${text}`;
            } else {
                text = `${text}<div class="logic-1">${map[crowdDefineDesc.logicCrowd]}</div><div style="font-weight: bold">群体：${crowdDefineDesc.crowd.crowdName}</div>`;
            }
            text = `<div class="crowd-enum-item-list">${text}</div>`;
        }catch (e) {
            console.log(e);
        }
        return text;
    }

    private getTagNameTwo(filter: any) {
        return filter.tagVal;
    }

    private getTagValueTwo(filter: any) {
        let teg: string = '';
        for (const j in filter.enums) {
            teg += this.showName(filter.enums[j]);
            teg += " ";
        }
        return teg;
    }

    private getCrowdNameTwo(crowd?: any) {
        if (crowd) {
            return crowd.crowdName ? crowd.crowdName : ""
        } else {
            return ""
        }
    }

    // 展示标签路径
    private showName(data:any){
        let name:string = data.tagEnumName;
        if(data.nodeParent && data.nodeParent.length > 0){
            data.nodeParent.forEach((item:any)=>{
                name = `${item.tagEnumName}-${name}`
            })
        }
        return name;
    }

    private getTagName(tagComponent: any) {
        return tagComponent.tagCompName;
    }

    private getTagTime(tag: any) {
        return this.formatDate(tag.tagData.modifiedTime, '数据更新日期：YYYY-MM-DD');
    }

    private getTagValue(tag: any, i: number) {
        let tempValue = '';
        if (tag.tagComponent[i].tagCompStyle == 21 || tag.tagComponent[i].tagCompStyle == 22) {
            tempValue = `${tag.tagValue[i]
                .map((item: any) => this.showName(item))
                .join('；')}`;
        } else if (tag.tagComponent[i].tagCompStyle >= 11 && tag.tagComponent[i].tagCompStyle <= 19) {
            if (tag.tagComponent[i].tagCompStyle == 12) {
                tempValue = `${tag.tagValue[i]
                    .map((item: any) => this.formatDate(item, 'YYYY'))
                    .join(' ~ ')}`;
            }else if(tag.tagComponent[i].tagCompStyle == 13){
                tempValue = `${tag.tagValue[i]
                    .map((item: any) => this.formatDate(item, 'YYYY-MM'))
                    .join(' ~ ')}`;
            }else if(tag.tagComponent[i].tagCompStyle == 11 || tag.tagComponent[i].tagCompStyle == 19) {
                if(tag.tagValue[i]){
                    if(tag.tagValue[i].length == 1){
                        tempValue = `最近${tag.tagValue[i][0]}天`;
                    }else{
                        tempValue = `${tag.tagValue[i]
                            .map((item: any) => this.formatDate(item, 'YYYY-MM-DD'))
                            .join(' ~ ')}`;
                    }
                }else{
                    tempValue = ``
                }
            } else{
                tempValue = `${tag.tagValue[i]
                    .map((item: any) => this.formatDate(item, 'YYYY-MM-DD'))
                    .join(' ~ ')}`;
            }
        } else {
            tempValue = `${tag.tagValue[i].join('，')}`;
        }
        return tempValue;
    }

    private mapLogic(i: number, logic?: any) {
        const map:any = {
                '_AND': '且',
                '_OR': '或',
                '_NOT': '非',
                'undefined':''
            };
        if (!logic) {
            return map[(this.definedDesc.logic[i]?this.definedDesc.logic[i]:'undefined')];
        } else {
            return map[(logic[i]?logic[i]:'undefined')];
        }
    }

    private showCrowdRow(crowd: any) {
        if (!this.crowd) {
            return;
        }
        const crowdDefineDesc = JSON.parse(crowd ? crowd.crowdDefineDesc : (this.crowd.crowdDefineDesc as string));
        this.tempDefinedDesc = crowdDefineDesc;
        this.showTempDefinedDescDialog = true;
    }

    private genEnumContent(crowd?: any) {

        if (!this.crowd || this.crowd.crowdType != 1) {
            return '';
        }
        let text:string = '';
        const map:any = {
                '_AND': '且',
                '_OR': '或',
                '_NOT': '非',
                'undefined':''
            };
        // console.log(this.crowd.crowdDefineDesc);
        try{
            const crowdDefineDesc = JSON.parse(crowd ? crowd.crowdDefineDesc : (this.crowd.crowdDefineDesc as string));
            // console.log(crowdDefineDesc);
            let m:number = 0;
            // 遍历表达式，取出每一个筛选，以m为索引
            crowdDefineDesc.expression.forEach((expression: any) => {
                // console.log(expression);
                // 根据索引找到筛选之间的逻辑
                const type1:any = crowdDefineDesc.logic[m]?crowdDefineDesc.logic[m]:'undefined';
                let n:number = 0;
                m++;
                    // #error : tag 和 筛选器之间要加一层
                    // # 内部使用temptext，完事之后添加如text，并同时在两边加入div
                let tempText: string = "";
                // 遍历筛选里每一个tag，以n为索引
                expression.tag.forEach((tag: any) => {
                    // 根据索引找到tag之间端逻辑
                    const type:any = expression.logic[n]?expression.logic[n]:'undefined';
                    // 判断tag的组件是否多于1个，如果多于1个，则显示数据源文字信息
                    const len:any = tag.tagComponent.length;
                    if(len > 1){
                        tempText = `${tempText}<div>${tag.tagData.tagDesc}</div>`;

                    }
                    //this.showName(
                    n++;
                    // 然后展示tag的组件信息
                    tempText = `${tempText}<div class='info-tag-item'><div class='info-tag-content'><div class="info-tag-tip"></div>`;
                    for (let i = 0; i < len; i++) {
                        const tagTime: any = this.formatDate(tag.tagData.modifiedTime, '数据更新日期：YYYY-MM-DD');
                        tempText = `${tempText}<div class="info-tag-title">${tag.tagComponent[i].tagCompName}</div><div class="info-tag-time">${tagTime}</div>`;
                        let tempValue: string = '';
                        if (tag.tagComponent[i].tagCompStyle == 21 || tag.tagComponent[i].tagCompStyle == 22) {
                            tempValue = `${tag.tagValue[i]
                                .map((item: any) => this.showName(item))
                                .join('；')}`;
                        } else if (tag.tagComponent[i].tagCompStyle >= 11 && tag.tagComponent[i].tagCompStyle <= 19) {
                            if (tag.tagComponent[i].tagCompStyle == 12) {
                                tempValue = `${tag.tagValue[i]
                                    .map((item: any) => this.formatDate(item, 'YYYY'))
                                    .join(' ~ ')}`;
                            }else if(tag.tagComponent[i].tagCompStyle == 13){
                                tempValue = `${tag.tagValue[i]
                                    .map((item: any) => this.formatDate(item, 'YYYY-MM'))
                                    .join(' ~ ')}`;
                            }else if(tag.tagComponent[i].tagCompStyle == 11 || tag.tagComponent[i].tagCompStyle == 19) {
                                if(tag.tagValue[i]){
                                    if(tag.tagValue[i].length == 1){
                                        tempValue = `最近${tag.tagValue[i][0]}天`;
                                    }else{
                                        tempValue = `${tag.tagValue[i]
                                            .map((item: any) => this.formatDate(item, 'YYYY-MM-DD'))
                                            .join(' ~ ')}`;
                                    }
                                }else{
                                    tempValue = ``
                                }
                            } else{
                                tempValue = `${tag.tagValue[i]
                                    .map((item: any) => this.formatDate(item, 'YYYY-MM-DD'))
                                    .join(' ~ ')}`;
                            }
                        } else {
                            tempValue = `${tag.tagValue[i].join('，')}`;
                        }
                        tempText = `${tempText}<el-tooltip :content="${tempValue}" effect="dark" placement="top-start"><div class="info-tag-value">${tempValue}</div></el-tooltip>`
                        tempText = `${tempText}</div>`;
                    }
                    tempText = `${tempText}</div>`;
                    // 然后添加tag逻辑
                    if(map[type]){
                        tempText += `<div class="logic info-tag-logic">${map[type]}</div>`;
                    }
                });
                text += `<div class='info-filter-item'>${tempText}</div>`;
                // 然后添加筛选逻辑
                if (map[type1]) {
                    text += `<div class="logic-1 info-filter-logic">${map[type1]}</div>`;
                }
            });
            // 组成表达式
            text = `<div class="crowd-enum-item-list">${text}</div>`;
        }catch (e) {
            console.log(e);
        }
        return text;
    }

    // ========== ajax request  ==========

    private detail(crowdCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/detail';
            const data: object = {
                crowdCode: crowdCode
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

    private crowdHistory(crowdCode: string, crowdUpdateType: number | null) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowdHistory/page';
            const data: object = {
                crowdCode: crowdCode,
                pageSize: this.pageConf.pageSize,
                pageNum: this.pageConf.pageNo
            };
            if (crowdUpdateType) {
                Object.assign(data, {
                    crowdUpdateType: crowdUpdateType
                });
            }
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

    private crowdQuotes(crowdCode: string) {
        // 获取引用记录
        return new Promise((resolve, reject) => {
            const url = '/api/admin/app/touch/queryList';
            const data: object = {
                crowdCode: crowdCode,
                sysName: this.searchSystemName ? this.searchSystemName : "",
                touchName: this.searchTaskName ? this.searchTaskName : "",
                creator: this.searchTaskCreateErp ? this.searchTaskCreateErp : "",
                pageSize: this.pageConf.pageSize,
                pageNum: this.pageConf.pageNo
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

    private crowdCalculate(crowdCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/crowd/calculate';
            const data: object = {
                crowdCode: crowdCode
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

    private searchSys(query: string) {
        const url = '/api/ava/token/getAll';
        const data: object = {};
        if (query && query != '') {
            Object.assign(data, {
                keyword: query
            });
        }
        this.selectLoading = true;
        this.$api
            .get(url, data)
            .then((res: any) => {
                if (!this.crowd) {
                    return;
                }
                if (this.crowd.crowdType == 2 || this.crowd.crowdType == 4) {
                    this.sysList = res.filter((item: any) => {
                        return item.token != this.DEFAULT_TOKEN_5K;
                        //  && item.token != this.DEFAULT_TOKEN_JZT;
                    });
                } else {
                    this.sysList = res;
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.selectLoading = false;
            });
    }

    private sysSelectChange(sysCode: string) {
        if (!this.crowd) {
            return;
        }
        const sys = this.sysList.find((item: any) => {
            return item.sysCode == sysCode;
        });
        if (!sys) {
            this.searchSystemName = "";
        } else {
            this.searchSystemName = sys.sysName;
        }
    }
}
</script>
<style lang="scss" scoped>
.crowd-info {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f9fafd;

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
            margin-right: 40px;
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

        .info-item-select {
            flex: 0 0 auto;
            display: flex;
            margin-bottom: 10px;

            &:first-child {
                margin-left: 0px;
            }

            .info-type-select {
                text-align: left;
                cursor: pointer;
                height: 50px;
                line-height: 42px;
                margin-bottom: 10px;
                margin-right: 16px;
                padding-top: 10px;
                font-size: 1rem;
                color: rgba(27, 27, 27, 1);
                clear: both;
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
                        left: 0px;
                        right: 0px;
                        border-radius: 2px;
                    }
                }
            }
        }

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

                .crowd-quote-search {
                    flex: 0 0 auto;
                    display: flex;
                    margin-bottom: 12px;

                    .crowd-quote-search-item {
                        width: 160px;
                        margin-right: 20px;
                        text-align: left;
                        clear: both;
                        position: relative;
                    }
                }

                .info-item-property1 {
                    width: calc(100% - 40px);
                }

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

                        &.desc {
                            width: 60vw;
                            word-wrap: break-word;
                            word-break: break-all;
                            overflow: hidden;
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
        }
    }

    .info-filter-item {
        border: 1px solid rgba(229,233,236,1);
        border-radius: 2px;
        background: #fff;
        padding: 10px;
        margin-bottom: 10px;
        margin-right: 13px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .info-tag-item {
        background: rgba(247,248,253,1);
        border-radius: 2px;
        padding: 12px 20px;
        margin-bottom: 8px;
        margin-right: 13px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .info-tag-logic {
        white-space: normal;
        line-height: 20px;
        text-align: center;
        margin: 3px 0;
        background: rgba(255,255,255,1);
        border: 1px solid rgba(101,136,248,1);
        border-radius: 2px;
        width: 26px;
        height: 26px;
        float: right;
        margin-right: -30px;
        color: #6588f8;
        padding: 2px;
    }

    .info-filter-logic {
        white-space: normal;
        line-height: 20px;
        text-align: center;
        margin: 3px 0;
        background: rgba(101,136,248,1);
        border-radius: 2px;
        width: 26px;
        height: 26px;
        float: right;
        margin-top: -18px;
        padding: 2px;
    }

    .info-tag-content {
        background: #f7f8fd;

        div {
            margin: 0;
            background: #f7f8fd;
            padding: 0;
            line-height: 20px;
            text-align: left;
        }

        .info-tag-tip {
            width: 4px;
            height: 4px;
            margin-top: 8px;
            background: rgba(181,201,220,1);
            float: left;
        }

        .info-tag-title {
            margin-left: 8px;
            float: left;
            margin-bottom: 8px;
        }

        .info-tag-time {
            float: right;
        }

        .info-tag-value {
            width: 100%;
            white-space: nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
            margin-bottom: 10px;
        }

        .info-tag-value1 {
            width: 100%;
            clear: both;
        }
    }

}
</style>
<style lang="scss">
.crowd-enum-item-list {
    div{
        white-space: normal;
        line-height: 20px;
        padding: 5px;
        text-align: left;
        border-radius: 3px;
        background: #f9f9f9;
        margin: 3px 0;
    }
    .logic {
        background: #5984fe;
        color: #fff;
        display: block;
        border-radius: 3px;
        padding: 2px 5px;
        width: 60px;
        text-align: center;
        margin: 0 auto;
    }
    .logic-1 {
        background: #3E6AF6;
        color: #fff;
        display: block;
        border-radius: 3px;
        padding: 4px 10px;
        width: 80px;
        text-align: center;
        margin: 0 auto;
    }
}
</style>
