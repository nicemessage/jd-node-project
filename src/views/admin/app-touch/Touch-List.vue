<template>
    <div class="touch-list">
        <div class="search-tool">
            <div class="spacer"></div>
            <div class="search-item">
                <el-button size="small" class="el-icon-time" @click="delayShow"> 批量延期</el-button>
            </div>
            <div class="search-item" style="padding-right:0;">
                <el-button type="primary" size="small" :disabled="addDisabled" @click="showAdd(false)" class="el-icon-plus"> 新建应用任务</el-button>
            </div>
        </div>
        <div class="search-tool" style="padding-left: 0;">
            <div class="search-item" style="width: 12%;">
                <el-select
                        v-model="searchParams.touchStatush"
                        clearable
                        size="small"
                        placeholder="应用状态"
                        @change="getAppTouchList"
                        @clear="clearProperty(searchParams, 'touchStatush')"
                        style="width:100%;"
                >
                    <el-option v-for="item in touchStatushList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="search-item" style="width: 35%;">
                <el-date-picker
                        v-model="searchParams.touchTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        size="small"
                        range-separator="至"
                        start-placeholder="应用开始日期"
                        end-placeholder="应用结束日期"
                        :picker-options="pickerOptions"
                        value-format="timestamp"
                        @change="getAppTouchList"
                        style="width:100%;"
                >
                </el-date-picker>
            </div>
            <div class="search-item" style="width: 19%;">
                <el-input size="small" clearable v-model="searchParams.tagKeyword" placeholder="任务名称/应用系统" @change="getAppTouchList" style="width:100%;">
                </el-input>
            </div>
            <div class="search-item" style="width: 19%;">
                <el-input size="small" clearable v-model="searchParams.keywordCrowd" placeholder="群体名称/群体编码" @change="getAppTouchList" style="width:100%;">
                </el-input>
            </div>
            <div class="search-item" style="width: 15%;padding-right:0;">
                <el-input size="small" clearable v-model="searchParams.creator" placeholder="任务创建人ERP" @change="getAppTouchList" style="width:100%;">
                </el-input>
            </div>

        </div>
        <div class="touch-content">
            <div class="wrapper">
                <el-table
                        :data="dataList"
                        size="small"
                        height="100%"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column
                            type="selection"
                            :selectable="selectableFun"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="touchName" label="任务名称" min-width="200">
                        <template slot-scope="scope">
                            <a @click="showInfo(scope.row)">{{scope.row.touchName}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新机制" min-width="80">
                        <template slot-scope="scope">
                            {{crowdUpdateCycleMap[scope.row.crowdUpdateCycle]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="任务创建人" min-width="100"></el-table-column>
                    <el-table-column prop="sysName" label="应用系统" min-width="150"></el-table-column>
                    <el-table-column label="应用类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.touchType == '1'">
                                <span>群体命中</span>
                            </template>
                            <template v-else-if="scope.row.touchType == '2'">
                                <span>群体下载</span>
                            </template>
                            <template v-else-if="scope.row.touchType == '3'">
                                <span>数据推送</span>
                            </template>
                            <template v-else-if="scope.row.touchType == '4'">
                                <span>数据推送</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="应用状态"  min-width="70">
                        <template slot-scope="scope">
                            <template v-if="scope.row.touchStatus == '1'">
                                <span>未开始</span>
                            </template>
                            <template v-else-if="scope.row.touchStatus == '2'">
                                <span style="color:#e6a23c;">准备中</span>
                            </template>
                            <template v-else-if="scope.row.touchStatus == '3'">
                                <span style="color:#65BF9F;">应用中</span>
                            </template>
                            <template v-else-if="scope.row.touchStatus == '4'">
                                <span style="color:#f56c6c;">结束</span>
                            </template>
                            <template v-else-if="scope.row.touchStatus == '5'">
                                <span style="color:#f56c6c;">失败</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100">
                        <template slot="header">
                            应用开始日期<br>应用结束日期
                        </template>
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.touchBegin, 'YYYY-MM-DD') }}<br>
                            {{ formatDate(scope.row.touchEnd, 'YYYY-MM-DD') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="群体名称(群体数量)/群体编码" min-width="300">
                        <template slot-scope="scope">
                            {{scope.row.crowdName}} ({{scope.row.crowdRealNum}})<br>{{scope.row.crowdCode}}
                            <el-tooltip class="item" effect="dark" content="复制群体编码" placement="bottom">
                                <span class="el-icon-document-copy crowd-name"  @click.stop="copyCrowdCode(scope.row.crowdCode)"></span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <!--                    <el-table-column min-width="180">-->
                    <!--                        <template slot="header">-->
                    <!--                            <div>创建时间/修改时间</div>-->
                    <!--                            &lt;!&ndash; <div>修改时间</div> &ndash;&gt;-->
                    <!--                        </template>-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            <div>{{ formatDate(scope.row.createdTime) }}</div>-->
                    <!--                            <div>{{ formatDate(scope.row.modifiedTime) }}</div>-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column label="操作" width="190" fixed="right">
                        <template slot-scope="scope">
                            <a v-show="scope.row.touchStatus == '4'" @click="showRestart(scope.row)">激活</a>
                            <a v-show="editStat(scope.row)" @click="showEdit(scope.row)">编辑</a>
                            <a v-show="delStat(scope.row)" @click="showDel(scope.row)">删除</a>
                            <a v-show="stopStat(scope.row)" @click="showStop(scope.row)">停止</a>
                            <el-tooltip content="敬请期待" placement="top" effect="light">
                                <span class="option-item disable">应用效果</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!--                <div class="touch-task no-data" v-else>-->
                <!--                    <NoData label="选中应用群体后可新增应用任务"></NoData>-->
                <!--                </div>-->

            </div>

        </div>
        <div class="paginationa">
            <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :page-size.sync="pageSize"
                    :current-page.sync="pageNo"
                    :page-sizes="pageSizeList"
            >
            </el-pagination>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDelDialog" width="500px">
            <div slot="title" class="dialog-title">删除应用任务</div>
            <span>确认删除该应用任务</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDelDialog = false">取 消</el-button>
                <el-button size="small" type="danger" @click="delAppTouch">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showStopDialog" width="500px">
            <div slot="title" class="dialog-title">停止应用任务</div>
            <div style="padding: 30px;">确认停止该应用任务</div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showStopDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="stopAppTouch">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showEditDialog" width="600px">
            <div slot="title" class="dialog-title">{{ newItem.id ? '编辑应用任务' : '新建应用任务' }}</div>
            <el-form :model="newItem" :rules="addNewRules" ref="add-new" style="padding: 30px;">
                <el-form-item v-if="!newItem.id" prop="crowdCode" label="群体名称" label-width="120px">
                    <span slot="label">
                        <el-tooltip class="item" effect="dark" content="同一个群体不能重复创建应用群体" placement="left">
                            <span class="el-icon-question"></span>
                        </el-tooltip>
                        群体名称 </span>
                    <el-select
                            v-model="newItem.crowd"
                            placeholder="请输入群体名称/群体编码"
                            value-key="id"
                            style="width: 100%;"
                            filterable
                            remote
                            clearable
                            :disabled="newItem.id"
                            prefix-icon="el-icon-search"
                            size="small"
                            :remote-method="queryCrowdUnTouchList"
                            :loading="selectLoading"
                            @change="setCrowd"
                            @clear="clearCrowd"
                            @focus="queryCrowdUnTouchList"
                    >
                        <el-option v-for="item in crowdUnTouchList" :key="item.id" :label="item.crowdName" :value="item"> </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item v-else prop="crowdCode" label="群体名称" label-width="120px" >
                    <el-input v-model="newItem.crowdName" disabled size="small"></el-input>
                </el-form-item>
                <el-form-item prop="crowdUpdateCycle" label-width="120px">
                    <span slot="label">
                        <el-tooltip placement="left">
                            <div slot="content">
                                依赖标签：在应用周期内只有群体覆盖的标签的T+1数据全部更新完再更新群体数据<br>
                                定时更新：优先依赖标签，定时兜底<br>
                                不更新：群体数据为静态数据，不更新
                            </div>
                            <span class="el-icon-question"></span>
                        </el-tooltip>
                        更新机制 </span>
                    <el-radio-group v-model="newItem.crowdUpdateCycle" :disabled="newItem.crowdType == 2" @change="crowdUpdateCycleChange">
                        <el-radio :label="1">不更新</el-radio>
                        <!--                        <el-radio :label="2" v-if="(newItem.crowdType != 2 && newItem.crowdType != 5) || (newItem.crowdType == 5 && newItem.isUpdate)">依赖更新</el-radio>-->
                        <el-radio :label="2" v-if="newItem.crowdType != 2 && newItem.crowdType != 6">依赖更新</el-radio>
                        <el-radio :label="3" v-if="newItem.crowdType == 1">定时更新</el-radio>
                        <el-radio :label="4" v-if="!newItem.id && newItem.crowd && newItem.crowd.crowdHasRealtime == 1">间隔更新</el-radio>
                        <el-radio :label="4" v-if="newItem.id && newItem.crowdHasRealtime == 1">间隔更新</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="newItem.crowdUpdateCycle == 3" prop="crowdUpdateTime" label="更新时间" label-width="120px">
                    <el-time-select size="small" v-model="newItem.crowdUpdateTime" placeholder="选择时间" :picker-options="pickerOptions" @input="crowdUpdateTimeSX()">
                    </el-time-select>
                </el-form-item>
                <el-form-item v-if="newItem.crowdUpdateCycle == 4" prop="crowdUpdateTime" label="更新时间" label-width="120px">
                    <el-select
                            v-model="newItem.crowdUpdateTime"
                            placeholder="请选择更新时间"
                            size="small"
                            @change="crowdUpdateTimeSX()"
                    >
                        <el-option v-for="item in crowdUpdateTimeMap" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="touchName" label="任务名称" label-width="120px">
                    <el-input v-model="newItem.touchName" width="200px" size="small" placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item prop="sysName" label="应用系统" label-width="120px" v-if="!newItem.id">
                    <el-select
                            v-model="newItem.sysName"
                            size="small"
                            value-key="sysName"
                            style="width: 100%;"
                            filterable
                            remote
                            clearable
                            :disabled="!!newItem.id"
                            placeholder="请输入系统名称/系统编码"
                            :remote-method="searchSys"
                            :loading="selectLoading"
                            @change="sysSelectChange"
                    >
                        <el-option v-for="item in sysList" :key="item.id" :label="item.sysName" :value="item.sysCode"> </el-option
                        ></el-select>
                </el-form-item>
                <el-form-item prop="sysName" label="应用系统" label-width="120px" v-else>
                    <el-input v-model="newItem.sysName" disabled  size="small"></el-input>
                </el-form-item>
                <el-form-item prop="touchType" label="应用类型" label-width="120px">
                    <el-radio-group v-model="newItem.touchType"  :disabled="!!newItem.id">
                        <el-radio v-show="!disableRaido" :disabled="disableRaido" :label="1">
                            群体命中
                        </el-radio>
                        <el-radio v-show="!disableRaido" :disabled="disableRaido" :label="2">
                            群体下载
                        </el-radio>
                        <el-radio v-show="disableRaido" v-if="newItem.touchType != 4" :disabled="disableRaido" :label="3">
                            数据推送
                        </el-radio>
                        <el-radio v-show="disableRaido" v-if="newItem.touchType == 4" :disabled="disableRaido" :label="4">
                            数据推送
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="touchTime" label="应用周期" label-width="120px" v-if="newItem.touchTime">
                    <div class="date-picker">
                        <div class="date-picker-item">
                            <el-date-picker
                                    v-model="newItem.touchTime[0]"
                                    type="date"
                                    align="right"
                                    size="small"
                                    disabled
                                    :picker-options="pickerOptions2"
                                    value-format="timestamp"
                            >
                            </el-date-picker>
                        </div>
                        <div class="date-spacer">至</div>
                        <div class="date-picker-item">
                            <el-date-picker
                                    v-model="newItem.touchTime[1]"
                                    type="date"
                                    align="right"
                                    size="small"
                                    :clearable="false"
                                    :disabled="forzonTimeSelect"
                                    :picker-options="pickerOptions2"
                                    value-format="timestamp"
                            >
                            </el-date-picker>
                        </div>
                    </div>
                    <!-- <el-date-picker
                            v-model="newItem.touchTime"
                            type="daterange"
                            align="right"
                            unlink-panels
                            size="small"
                            :disabled="forzonTimeSelect"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions2"
                            value-format="timestamp"
                        >
                        </el-date-picker> -->
                </el-form-item>
                <el-form-item v-if="showPins" prop="pins" label="应用商户" label-width="120px">
                    <el-tag
                            :key="`pin-idx-${index}`"
                            v-for="(pin, index) in newItem.pins"
                            :closable="!newItem.id"
                            :disable-transitions="false"
                            @close="removePin(index)"
                    >
                        <el-tooltip class="item" effect="dark" :content="pin" placement="top">
                            <span>{{ pin }}</span>
                        </el-tooltip>
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="pinInputVisible"
                            v-model="pinValue"
                            clearable
                            ref="savePinInput"
                            size="small"
                            @keyup.enter.native="handlePinInputConfirm"
                            @blur="handlePinInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showPinInput">+ 商户PIN</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="showEditDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="addOrupdateAppTouch">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" :visible.sync="showInfoDialog" width="1100px" :before-close="hideInfoDialog">
            <div slot="title" class="dialog-title">应用任务查看</div>
            <div style="padding: 30px;">
                <div class="info-item">
                    <div class="part-title" v-if="disableRaido">基础属性：</div>
                    <div class="info-item-body" v-if="newItem">
                        <div class="info-item-property">
                            <div class="info-item-property-label">任务名称：</div>
                            <div class="info-item-property-value">{{ newItem.touchName ? newItem.touchName : '-' }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">任务创建人：</div>
                            <div class="info-item-property-value">{{ newItem.creator ? newItem.creator : '-' }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">群体名称：</div>
                            <div class="info-item-property-value">{{ newItem.crowdName ? newItem.crowdName : '-' }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">群体编码：</div>
                            <div class="info-item-property-value">{{ newItem.crowdCode ? newItem.crowdCode : '-' }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">群体数量：</div>
                            <div class="info-item-property-value">{{ newItem.crowdRealNum ? newItem.crowdRealNum : '-' }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">群体更新时间：</div>
                            <div class="info-item-property-value">{{ newItem.crowdDataDt ? newItem.crowdDataDt : '-' }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">更新机制：</div>
                            <div class="info-item-property-value">
                                {{ (newItem.crowdUpdateCycle == 3 ? (crowdUpdateCycleMap[newItem.crowdUpdateCycle] + (newItem.crowdUpdateTime ? ('(' + newItem.crowdUpdateTime + ')') : '')) : crowdUpdateCycleMap[newItem.crowdUpdateCycle]) }}
                            </div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">应用系统：</div>
                            <div class="info-item-property-value">{{ newItem.sysName ? newItem.sysName : '-' }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">应用类型：</div>
                            <div class="info-item-property-value">{{ getTouchType(newItem) }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">应用状态：</div>
                            <div class="info-item-property-value">{{ getTouchState(newItem) }}</div>
                        </div>
                        <div class="info-item-property">
                            <div class="info-item-property-label">应用有效期：</div>
                            <div class="info-item-property-value">{{ getTouchTime(newItem) }}</div>
                        </div>
                    </div>
                </div>
                <div class="info-item-select">
                    <div class="info-type-select" :class="{ active: infoShowType == 'opration' }" @click="selectShowType('opration')">
                        操作日志
                    </div>
                    <div class="info-type-select" v-if="disableRaido" :class="{ active: infoShowType == 'task' }" @click="selectShowType('task')">
                        任务日志
                    </div>
                </div>
                <div>
                    <el-table
                            ref="logtable"
                            v-if="infoShowType == 'opration'"
                            :data="crowdOprationList"
                            style="width: 100%"
                            empty-text="暂无操作日志"
                            :header-cell-style="{ textAlign: 'center' }"
                            :cell-style="{ textAlign: 'center' }"
                    >
                        <el-table-column type="index" label="序号" width="150"></el-table-column>
                        <el-table-column property="operator" label="操作人erp"></el-table-column>
                        <el-table-column property="createdTime" label="操作时间"></el-table-column>
                        <el-table-column property="operateName" label="操作内容"></el-table-column>
                    </el-table>
                </div>
                <div class="crowd-export">
                    <el-table
                            v-if="disableRaido && infoShowType == 'task'"
                            :data="crowdExportList"
                            style="width: 100%"
                            border
                            empty-text="暂无任务日志"
                            :header-cell-style="{ textAlign: 'center' }"
                            :cell-style="{ textAlign: 'center' }"
                    >
                        <el-table-column label="开始时间" min-width="110">
                            <template slot-scope="scope">
                                <div v-if="scope.row.crowdExportStatus == 1 && (newItem.token == DEFAULT_TOKEN_5K || newItem.token == DEFAULT_TOKEN_JZT)">--</div>
                                <div v-else>{{formatDate(scope.row.createdTime)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="结束时间" min-width="110">
                            <template slot-scope="scope">
                                <div v-if="scope.row.crowdExportStatus == 1 && (newItem.token == DEFAULT_TOKEN_5K || newItem.token == DEFAULT_TOKEN_JZT)">--</div>
                                <div v-else>{{ formatDate(scope.row.modifiedTime) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="群体数量" min-width="110">
                            <template slot-scope="scope">
                                {{ scope.row.crowdExportNum ? scope.row.crowdExportNum.toLocaleString() : '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.crowdExportStatus == 1">待执行</span>
                                <span v-if="scope.row.crowdExportStatus == 2">成功</span>
                                <span v-if="scope.row.crowdExportStatus == 3">失败</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="群体版本（crowd_vers）" width="220">
                            <template slot-scope="scope">
                                {{ scope.row.crowdVersion }}
                            </template>
                        </el-table-column>
                        <el-table-column label="目标详情" min-width="120">
                            <template slot-scope="scope">
                                <template v-if="newItem.token == DEFAULT_TOKEN_5K">
                                    <template v-if="scope.row.crowdExportMsg">{{ `5k:${scope.row.crowdExportMsg}` }}</template>
                                </template>
                                <template v-if="newItem.token == DEFAULT_TOKEN_JZT">
                                    <span v-for="(tag, index) of genJZTTag(scope.row.crowdExportMsg)" :key="`tag-${index}`" class="tag-span">{{tag}}</span>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="paginationa">
                    <el-pagination
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageConf.total"
                            :page-size.sync="pageConf.pageSize"
                            :current-page.sync="pageConf.pageNo"
                            :page-sizes="pageConf.pageSizeList"
                    >
                    </el-pagination>
                </div>
            </div>

        </el-dialog>
        <!--延期-->
        <el-dialog :close-on-click-modal="false" :visible.sync="delayDialog" width="400px">
            <div slot="title" class="dialog-title">批量延期</div>
            <div style="padding: 30px;">
                <el-date-picker
                        v-model="delayVal"
                        :picker-options="pickerOptions1"
                        type="date"
                        value-format="timestamp"
                        placeholder="选择日期">
                </el-date-picker>
                最多可延期90天
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="delay">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    /**
     * @name TouchList
     * @author your name
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
    import { State } from 'vuex-class';

    // mixin引入
    import { PageMixin } from '@/mixins/pageMixin';

    // 第三方库引入
    import moment from 'moment';

    // 静态配置引入

    // 公共组件引入

    // 公共类引入
    import NoData from '@/components/NoDataIcon.vue';
    // import Template from "@/Template.vue";

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

    interface Touch {
        [propName: string]: any;
    }

    @Component({
        components: {NoData }
    })
    export default class TouchList extends Mixins(PageMixin) {
        @State(state => state.curSubject) curSubject!: Subject | null;
        @Watch('curSubject')
        private subjectChange() {
            this.getAppTouchList();
        }

        private selectCrowd:any | null;
        @Watch('selectCrowd')
        private selectCrowdChange(val: any) {
            this.init();
        }

        @Watch('newItem.crowd')
        private crowdChange() {
            // console.log(this.newItem.crowd);
            this.selectCrowd = this.newItem.crowd;
            if(this.selectCrowd){
                this.searchSys();
            }
        }


        private DEFAULT_TOKEN_5K: string = '2bc70b4b5cbb49e79a63b20189bc9b96';
        private DEFAULT_TOKEN_JZT: string = 'b327a6d2aa95401bb1d88459557c6276';

        private addDisabled: boolean = false; // 新增应用任务按钮在没有选择群体时禁用

        private dataList: Array<Touch> = [];
        private crowdUnTouchList: any = [];

        private delItem: Touch | null = null;

        private crowdUpdateTimeMap:any = [
            {
                value: '1800',
                label: '半小时'
            },
            {
                value: '3600',
                label: '1小时'
            }
        ];

        private newItem: any = {
            crowd:null,
            crowdUpdateCycle: 1,
            crowdUpdateTime: null,
            crowdCode: null,
            crowdName: null,
            beginTime: null,
            endTime: null,
            touchTime: null,
            subjectId: this.curSubject?.id,
            token: null,
            sysName: null,
            touchType: 1,
            touchName: null,
            id: null,
            pins: []
        };

        private crowdUpdateCycleMap:object = {
            1:"不更新",
            2:"依赖更新",
            3:"定时更新",
            4:"间隔更新"
        }

        private addNewRules: object = {
            crowdCode: [{ required: true, message: '请选择群体', trigger: 'change' }],
            crowdUpdateCycle: [{ required: true, message: '请选择群体更新机制', trigger: 'change' }],
            crowdUpdateTime: [{ required: true, message: '请选择更新时间', trigger: 'change' }],
            touchName: [
                { required: true, message: '请填写任务名称', trigger: 'blur' },
                { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
            ],
            sysName: [{ required: true, message: '请选择应用系统', trigger: 'change' }],
            touchTime: [{ required: true, message: '请选择应用周期', trigger: 'change' }],
            touchType: [{ required: true, message: '请选择应用类型', trigger: 'change' }]
        };

        private showInfoDialog: boolean = false;
        private showEditDialog: boolean = false;
        private showDelDialog: boolean = false;
        private showStopDialog: boolean = false;

        private searchParams: object = {
            sysName: null,
            token: null,
            touchStatush: null,
            touchTime: null,
            tagKeyword: '',
            keywordCrowd: '',
            creator: ''
        };

        private selectLoading: boolean = false;
        private delayDialog: boolean = false;

        private sysList: any[] = [];
        private crowdList: any[] = [];

        private infoShowType: string = ""; // 任务日志 task 操作日志 opration
        private crowdOprationList: any = []; // 操作日志
        private crowdExportList: any = []; // 任务日志
        private pageConf: any = {
            pageSize: 20,
            pageSizeList: this.pageSizeList,
            pageNo: 1,
            total: 0
        };
        private multipleSelection: any = [];

        private pageSize:number = 20;

        private crowdUpdateCycleChange(e:any){
            console.log(e);
            if(e == '3'){
                this.$set(this.newItem, 'crowdUpdateTime', '09:00');
            } else if(e == '4'){
                this.$set(this.newItem, 'crowdUpdateTime', '1800');
            } else {
                this.$set(this.newItem, 'crowdUpdateTime', '');
            }
        }

        /* 延期 */
        private delayVal: any = '';
        private delayShow() {
            if(this.multipleSelection.length == 0){
                this.$message('请选择应用任务');
                return false;
            }
            this.delayVal = '';
            this.delayDialog = true;
        };

        private delay() {
            if(this.delayVal){
                const list:any = [];
                for(const i in this.multipleSelection){
                    list.push(Object.assign(this.multipleSelection[i],{
                        touchEnd:this.delayVal
                    }));
                }
                const data:any = {
                    appTouchList:list
                };
                console.log(data);
                this.$api
                    .post(`/api/ava/app/touch/delay`, data)
                    .then(res => {
                        this.getAppTouchList();
                        this.delayDialog = false;
                        this.$message.success('延期成功');
                    })
                    .catch(err => {
                        this.delayDialog = false;
                    });

            } else {
                this.$message('请选择截止日期');
            }
        };

        private handleSelectionChange(val:any) {
            this.multipleSelection = val;
        }

        private selectableFun(val:any){
            if(val.token === this.DEFAULT_TOKEN_5K && val.crowdUpdateCycle == 1){
                return false;
            }
            if(val.touchStatus == 1 || val.touchStatus == 2 || val.touchStatus == 3){
                return true;
            }
            return false;
        }

        private  pickerOptions1 = {
            disabledDate: (time) => {
                // 设置可选择的日期为今天之后的一个月内
                const curDate = (new Date()).getTime()
                // 这里算出一个月的毫秒数,
                const day = 90 * 24 * 3600 * 1000
                const dateRegion = curDate + day
                return time.getTime() < Date.now() - 8.64e7 ||
                    time.getTime() > dateRegion
            }
        }

        private pickerOptions = {
            shortcuts: [
                {
                    text: '最近一周',
                    onClick(picker: any) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近一个月',
                    onClick(picker: any) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近三个月',
                    onClick(picker: any) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }
            ]
        };

        private pickerOptions2 = {
            disabledDate: (date: Date) => {
                return date.getTime() + 24 * 60 * 60 * 1000 < Date.now() || date.getTime() > Date.now() + 90 * 24 * 60 * 60 * 1000; // - 24 * 60 * 60 * 1000;
            },
            shortcuts: [
                {
                    text: '最近一周',
                    onClick(picker: any) {
                        const cur = new Date();
                        picker.$emit('pick', cur.getTime() + 3600 * 1000 * 24 * (7 - 1));
                    }
                },
                {
                    text: '最近一个月',
                    onClick(picker: any) {
                        const cur = new Date();
                        picker.$emit('pick', cur.getTime() + 3600 * 1000 * 24 * (30 - 1));
                    }
                },
                {
                    text: '最近三个月',
                    onClick(picker: any) {
                        const cur = new Date();
                        picker.$emit('pick', cur.getTime() + 3600 * 1000 * 24 * (90 - 1));
                    }
                }
            ]
        };

        private touchStatushList = [
            {
                label: '未开始',
                value: 1
            },
            {
                label: '准备中',
                value: 2
            },
            {
                label: '应用中',
                value: 3
            },
            {
                label: '结束',
                value: 4
            }
        ];

        private pinInputVisible: boolean = false;
        private pinValue: string = '';

        @Watch('pageNo')
        private pageNoChange() {
            this.getAppTouchList();
        }
        @Watch('pageSize')
        private pageSizeChange() {
            this.getAppTouchList();
        }

        private hideInfoDialog(){
            this.showInfoDialog = false;
            this.getAppTouchList();
        }

        get forzonTimeSelect() {
            if ((!this.newItem.crowdUpdateCycle || this.newItem.crowdUpdateCycle == 1) && this.newItem &&  this.newItem.token == this.DEFAULT_TOKEN_5K) {
                return true;
            }
            if (this.newItem && this.newItem.token == this.DEFAULT_TOKEN_JZT) {
                return true;
            }
            return false;
        }

        get disableRaido() {
            if (!this.newItem) {
                return true;
            }
            if (this.newItem.token == this.DEFAULT_TOKEN_5K || this.newItem.token == this.DEFAULT_TOKEN_JZT) {
                return true;
            }

            return false;
        }

        get showPins() {
            if (!this.newItem) {
                return false;
            }
            if (this.newItem.id) {
                return false;
            }
            if (this.newItem.token == this.DEFAULT_TOKEN_JZT) {
                return true;
            }
            return false;
        }

        private getTouchType(newItem: any) {
            return newItem.touchType == 1?'群体命中':(newItem.touchType == 2?'群体下载':'数据推送');
        }

        private getTouchTime(newItem: any) {
            if (newItem.touchTime && newItem.touchTime.length > 0) {
                const st = newItem.touchTime[0];
                let et = '';
                if (newItem.touchTime.length > 1) {
                    et = newItem.touchTime[1];
                }
                return `${moment(parseInt(st)).format('YYYY-MM-DD')} ~ ${(et != ''?moment(parseInt(et)).format('YYYY-MM-DD'):'')}`;
            }
            return '~';
        }

        private getTouchState(newItem: any) {
            if (newItem.touchStatus == '1') {
                return "未开始";
            } else if (newItem.touchStatus == '2') {
                return "准备中";
            } else if (newItem.touchStatus == '3') {
                return "应用中";
            } else if (newItem.touchStatus == '4') {
                return "结束";
            } else if (newItem.touchStatus == '5') {
                return "失败";
            }
            return "-";
        }

        private copyCrowdCode(str: string) {
            this.$copyText(str).then(() => {
                this.$notify({
                    title: '复制成功',
                    message: '',
                    type: 'success'
                });
            });
        }

        private clearCrowd(){
            this.sysList = [];
        }

        private setCrowd(crowd:any){
            // console.log(crowd);
            this.$set(this.newItem, 'crowdCode', crowd.crowdCode);
            this.$set(this.newItem, 'crowdType', crowd.crowdType);
            this.$set(this.newItem, 'isUpdate', crowd.isUpdate);
            // this.newItem.crowdUpdateCycle = 1;
            // console.log(this.newItem.crowdUpdateCycle);
            if(!this.newItem.crowdUpdateCycle && !crowd.crowdUpdateCycle){
                this.$set(this.newItem, 'crowdUpdateCycle', 1);
            }else{
                this.$set(this.newItem, 'crowdUpdateCycle', crowd.crowdUpdateCycle);
                if(crowd.crowdUpdateTime){
                    this.$set(this.newItem, 'crowdUpdateTime', crowd.crowdUpdateTime);
                }
            }


            // if (this.newItem.crowdType == 2 || this.newItem.crowdType == 5) {
            //     this.newItem.crowdUpdateCycle = 1;
            // }else{
            //     this.newItem.crowdUpdateCycle = null;
            // }
        }

        private eventId: Array<{ id:number, event: string}> = [];

        private mounted() {
            this.getAppTouchList();
            const id = this.$bus.$on('update-touch-list', () => {
                this.getAppTouchList();
            })
            this.eventId.push({
                id: id,
                event: 'update-touch-list'
            });

            if(this.$route.query.crowdCode){
                this.showAdd(this.$route.query.crowdCode);
            }
        }

        private beforeDestroy(){
            this.eventId.forEach( (ev:{ id:number, event: string}) => {
                this.$bus.$off(ev.event, ev.id);
            })
        }

        private init() {
            console.log('init执行');
            this.infoShowType = "task";
            if (!this.curSubject) {
                return setTimeout(this.init, 500);
            }
            if (!this.selectCrowd) {
                console.log('selectCrowd：', this.selectCrowd);
                this.addDisabled = true;
                return false;
            }
            Object.assign(this.pageConf, {
                pageSize: 20,
                pageSizeList: this.pageSizeList,
                pageNo: 1,
                total: 0
            });
            this.addDisabled = false;
            this.getAppTouchList();
            this.searchSys('');
        }

        private getAppTouchList() {
            const params = this.genQueryParam(this.searchParams);
            this.queryList(params).then((res: any) => {
                this.total = res.total;
                this.dataList = res.list;
            });
        }

        private genQueryParam(params: any) {
            const query: any = {};
            if (params.sysName && params.sysName != '') {
                query['sysName'] = params.sysName;
            }
            if (params.token && params.token != '') {
                query['token'] = params.token;
            }
            if (params.touchStatush) {
                query['touchStatus'] = params.touchStatush;
            }
            if (params.touchTime) {
                query['touchBegin'] = params.touchTime[0];
                query['touchEnd'] = params.touchTime[1];
            }
            if (params.tagKeyword) {
                query['keyword'] = params.tagKeyword;
            }
            if (params.keywordCrowd) {
                query['keywordCrowd'] = params.keywordCrowd;
            }
            if (params.creator) {
                query['creator'] = params.creator;
            }


            return query;
        }

        private formatDate(dateStr: string, formatStr?: string) {
            return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
        }

        private editStat(item: Touch) {
            if (item.sysName == '京准通') {
                return false;
            }
            if (item.touchStatus == '1') {
                return true;
            }
            if (item.touchStatus == '2') {
                return false;
            }
            if (item.touchStatus == '3') {
                return true;
            }
            if (item.touchStatus == '4') {
                return false;
            }

            return false;
        }
        private delStat(item: Touch) {
            if (item.touchStatus == '1') {
                return true;
            }
            if (item.touchStatus == '2') {
                return true;
            }
            if (item.touchStatus == '3') {
                return false;
            }
            if (item.touchStatus == '4') {
                return false;
            }
            return false;
        }
        private stopStat(item: Touch) {
            if (item.touchStatus == '1') {
                return false;
            }
            if (item.touchStatus == '2') {
                return false;
            }
            if (item.touchStatus == '3') {
                return true;
            }
            if (item.touchStatus == '4') {
                return false;
            }
            return false;
        }

        private showAdd(crowdCode:any = false) {
            this.reInitItemOnAdd();
            if(crowdCode){
                this.queryCrowdUnTouchList(crowdCode,true);
            }
            this.showEditDialog = true;
            if (this.$refs['add-new']) {
                setTimeout(()=>{
                    (this.$refs['add-new'] as any).clearValidate();
                }, 10);
            }
        }

        private reInitItemOnAdd() {
            this.newItem = {
                crowd:null,
                crowdCode: null,
                crowdName: null,
                beginTime: null,
                endTime: null,
                touchTime: [null, null],
                subjectId: this.curSubject?.id,
                token: null,
                sysName: null,
                touchType: 1,
                pins: []
            };
            // if (this.forzonTimeSelect) {
            const startTm: number = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
            const endTm: number = new Date(new Date(new Date().toLocaleDateString()).getTime() + 60 * 60 * 1000 * 24 * 30).getTime(); // - 1000;
            this.newItem.touchTime = [startTm, endTm];
            // }
        }

        private showInfo(item: Touch) {
            if (!item) {
                return;
            }
            this.newItem = JSON.parse(JSON.stringify(item));
            if (!this.newItem) {
                return;
            }
            const beginTime = new Date(this.newItem.touchBegin).getTime();
            const endTime = new Date(this.newItem.touchEnd).getTime();
            this.$set(this.newItem, 'touchTime', [beginTime, endTime]);
            this.showInfoDialog = true;
            // 打开页面请求数据
            this.selectShowType("opration");
        }

        private selectShowType(type: string) {
            this.infoShowType = type;
            // 修改了tab，重置页码
            this.pageConf = {
                pageSize: 20,
                pageSizeList: this.pageSizeList,
                pageNo: 1,
                total: 0
            };
            if (type == "opration") {
                // 正常都会有
                this.taskLog(
                    this.newItem.id,
                    this.pageConf.pageNo,
                    this.pageConf.pageSize
                ).then((res: any) => {
                    this.crowdOprationList = res.list;
                    this.pageConf.total = res.total;
                });
            } else {
                // 5k相关显示
                if (this.disableRaido) {
                    const crowdExportType = this.newItem.token == this.DEFAULT_TOKEN_5K ? 4 : 3;
                    this.crowdExport(
                        this.newItem.crowdCode,
                        crowdExportType,
                        this.pageConf.pageNo,
                        this.pageConf.pageSize,
                        this.newItem.id
                    ).then((res: any) => {
                        this.crowdExportList = res.list;
                        this.pageConf.total = res.total;
                    });
                } else {
                    this.crowdExportList = [];
                }
            }
        }

        // 激活
        private showRestart(item: Touch) {
            const data:any = {
                appTouchList:[
                    {
                        crowdCode: item.crowdCode,
                        id: item.id
                    }
                ]
            };
            this.$api
                .post(`/api/admin/app/touch/activate`, data)
                .then(res => {
                    this.getAppTouchList();
                    this.delayDialog = false;
                    this.$message.success('激活成功');
                })
                .catch(err => {
                    this.delayDialog = false;
                });
        }

        private showEdit(item: Touch) {
            if (!item) {
                return;
            }
            this.newItem = JSON.parse(JSON.stringify(item));
            if (this.newItem) {
                const beginTime = new Date(this.newItem.touchBegin).getTime();
                const endTime = new Date(this.newItem.touchEnd).getTime();
                this.$set(this.newItem, 'touchTime', [beginTime, endTime]);
                this.showEditDialog = true;

                if (this.$refs['add-new']) {
                    (this.$refs['add-new'] as any).clearValidate();
                }
            }
        }
        private showDel(item: Touch) {
            if (!item) {
                return;
            }
            this.delItem = item;
            this.$confirm(`确认删除【${this.delItem.touchName}】应用任务?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delAppTouch();
            });
        }
        private showStop(item: Touch) {
            if (!item) {
                return;
            }
            this.delItem = item;
            this.showStopDialog = true;
        }

        private clearProperty(target: any, propName: string) {
            if (!target || !propName) {
                return;
            }
            target[propName] = null;
        }

        private delAppTouch() {
            if (!this.delItem) {
                return;
            }
            this.del(this.delItem.id).then(() => {
                this.delItem = null;
                this.$message.success('删除成功');
                this.showDelDialog = false;
                this.getAppTouchList();
            });
        }
        private stopAppTouch() {
            if (!this.delItem) {
                return;
            }
            this.stop(this.delItem.id).then(() => {
                this.delItem = null;
                this.$message.success('停止成功');
                this.showStopDialog = false;
                this.getAppTouchList();
            });
        }

        private sysSelectChange(sysCode: string) {
            if (!this.newItem) {
                return;
            }
            const sys = this.sysList.find((item: any) => {
                return item.sysCode == sysCode;
            });
            // console.log(sys);
            if (!sys) {
                this.newItem.sysName = null;
                this.newItem.token = null;
            } else {
                this.newItem.sysName = sys.sysName;
                this.newItem.token = sys.token;

                if (sys.token == this.DEFAULT_TOKEN_5K || sys.token == this.DEFAULT_TOKEN_JZT) {
                    this.newItem.touchType = 3;
                }
                if (this.forzonTimeSelect) {
                    const startTm: number = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
                    const endTm: number = startTm;
                    this.newItem.touchTime = [startTm, endTm];
                }
            }
        }

        private addOrupdateAppTouch() {
            (this.$refs['add-new'] as any).validate((valid: any) => {
                if (valid) {
                    if (!this.newItem) {
                        return;
                    }
                    if (this.newItem.touchTime) {
                        this.newItem.touchBegin = this.newItem.touchTime[0];
                        this.newItem.touchEnd = this.newItem.touchTime[1];
                    }
                    if (!this.newItem.id) {
                        if (this.selectCrowd) {
                            this.newItem.crowdName = this.selectCrowd.crowdName;
                            this.newItem.crowdCode = this.selectCrowd.crowdCode;
                            this.newItem.crowdVersion = this.selectCrowd.crowdVersion;
                            this.newItem.crowdRealNum = this.selectCrowd.crowdRealNum ? this.selectCrowd.crowdRealNum : 0;
                        }
                        // console.log(this.newItem);
                        let type: string = '';
                        if (this.newItem.token == this.DEFAULT_TOKEN_5K) {
                            type = '5k';
                        } else if (this.newItem.token == this.DEFAULT_TOKEN_JZT) {
                            if(this.newItem.pins.length == 0){
                                this.$message('京准通，应用商户PIN不能为空');
                                return false;
                            }
                            type = 'jzt';
                        }
                        console.log(this.newItem);
                        // return false;
                        this.add(this.newItem, type).then(() => {
                            this.$message.success('添加成功');
                            this.showEditDialog = false;
                            this.getAppTouchList();
                        });
                    } else {
                        // console.log(this.newItem);
                        let type: string = '';
                        if (this.newItem.token == this.DEFAULT_TOKEN_5K) {
                            type = '5k';
                        } else if (this.newItem.token == this.DEFAULT_TOKEN_JZT) {
                            if(this.newItem.pins.length == 0){
                                this.$message('京准通，应用商户PIN不能为空');
                                return false;
                            }
                            type = 'jzt';
                        }

                        delete this.newItem.valid;
                        delete this.newItem.createdTime;
                        delete this.newItem.modifiedTime;
                        delete this.newItem.creator;
                        delete this.newItem.modifier;
                        console.log(this.newItem);
                        // return false;
                        this.update(this.newItem, type).then(() => {
                            this.$message.success('修改成功');
                            this.showEditDialog = false;
                            this.getAppTouchList();
                        });
                    }
                }
            });
        }

        private crowdUpdateTimeSX(){
            this.$forceUpdate();
        }

        private removePin(idx: number) {
            if (!this.newItem) {
                return;
            }
            this.newItem.pins.splice(idx, 1);
        }

        private showPinInput() {
            this.pinInputVisible = true;
            this.$nextTick(() => {
                (this.$refs.savePinInput as any).$refs.input.focus();
            });
        }

        private handlePinInputConfirm() {
            if (!this.newItem) {
                return;
            }
            if (!this.newItem.pins) {
                this.newItem.pins = [];
            }
            const inputValue = this.pinValue;
            if (inputValue) {
                this.newItem.pins.push(inputValue);
            }
            this.pinInputVisible = false;
            this.pinValue = '';
        }

        private genJZTTag(crowdExportMsg){
            console.log(crowdExportMsg);
            if(!crowdExportMsg || crowdExportMsg == ''){
                return [];
            }
            return JSON.parse(crowdExportMsg);
        }

        // ========== ajax request  ==========

        private queryCrowdUnTouchList(query?: any,newApp?:any = false) {
            const url = `/api/ava/crowd/all`;
            const data = {
                subjectId: this.curSubject?.id,
                // crowdTouchState: 0,
                crowdState: 2,
                pageNum: 1,
                pageSize: 20
            };
            if (query && !query.isTrusted) {
                Object.assign(data, {
                    keyword: query
                });
            }else{
                Object.assign(data, {
                    keyword: ''
                });
            }
            this.selectLoading = true;
            this.$api
                .post(url, data)
                .then((res: any) => {
                    this.selectLoading = false;
                    this.crowdUnTouchList = res.list;
                    if(newApp && this.crowdUnTouchList[0]){
                        this.newItem.crowd = this.crowdUnTouchList[0];
                        this.setCrowd(this.newItem.crowd);
                    }
                })
                .catch(err => {
                    this.selectLoading = false;
                    console.log(err);
                });
        }

        private queryList(query?: any) {
            return new Promise((resolve, reject) => {
                const url = '/api/admin/app/touch/queryList';
                const data = {
                    pageNum: this.pageNo,
                    pageSize: this.pageSize,
                    subjectId: this.curSubject?.id,
                    keywordCrowd: this.searchParams.keywordCrowd
                };
                if (query) {
                    Object.assign(data, query);
                }
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

        private del(id: number) {
            return new Promise((resolve, reject) => {
                const url = '/api/admin/app/touch/del';
                const data = {
                    id: id
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

        private add(params: any, type?: string) {
            let url: string = '/api/admin/app/touch/';
            if (type == '5k') {
                url = `${url}5k`;
            } else if (type == 'jzt') {
                url = `${url}jzt`;
            } else {
                url = `${url}add`;
            }

            return new Promise((resolve, reject) => {
                const data = params;
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

        private update(params: any, type?: string) {
            let url: string = '/api/admin/app/touch/';
            // if (type == '5k') {
            //     url = `${url}5k`;
            // } else if (type == 'jzt') {
            //     url = `${url}jzt`;
            // } else {
            //     url = `${url}update`;
            // }
            url = `${url}update`;
            return new Promise((resolve, reject) => {
                const data = params;
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

        private stop(id: number) {
            return new Promise((resolve, reject) => {
                const url = '/api/admin/app/touch/stop';
                const data = {
                    id: id
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

        private searchSys(query: string) {
            const url = '/api/admin/token/getAll';
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
                    if (this.selectCrowd.crowdType == 2 || this.selectCrowd.crowdType == 4) {
                        this.sysList = res.filter((item: any) => {
                            return item.token != this.DEFAULT_TOKEN_5K;
                            // && item.token != this.DEFAULT_TOKEN_JZT;
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
        private searchCrowd(query: string) {
            const url = '/api/admin/crowd/getAll';
            const data: object = {
                subjectId: this.curSubject?.id
            };
            if (query && query != '') {
                Object.assign(data, {
                    keyword: query
                });
            }
            this.selectLoading = true;
            this.$api
                .get(url, data)
                .then((res: any) => {
                    this.crowdList = res.filter((item: any) => {
                        return item.crowdState == 2;
                    });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.selectLoading = false;
                });
        }

        private crowdExport(crowdCode: string, crowdExportType: number, pageNum: number, pageSize: number, touchId: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/crowdExport/page';
                const data = {
                    crowdCode: crowdCode,
                    crowdExportType: crowdExportType,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    touchId: touchId
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
        private taskLog(taskID: string, pageNum: number, pageSize: number) {
            return new Promise((resolve, reject) => {
                const data:any = {
                    objId:taskID,
                    objType:"touch",
                    pageNum: pageNum,
                    pageSize: pageSize
                };
                this.$api
                    .post('/api/ava/log/selectPage', data)
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
    .crowd-name{
        padding: 0 3px;
        cursor: pointer;
        color: #999;
    }
    .part-title{
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        margin-bottom: 20px;
        position: relative;
        font-size: 1rem;
        font-weight: bold;
        color: #1b1b1b;
        &:before {
            content: ' ';
            width: 3px;
            height: 16px;
            display: block;
            position: absolute;
            top: 8px;
            left: 0px;
            background: #396bf6;
        }
    }
    /deep/ .el-range-separator {
        width: 18px;
    }
    /deep/ .el-tag{
        position: relative;
        float: left;
        top:3px;
        padding-right: 20px;
        margin:0 6px 4px 0;
        margin-left: 0!important;
        /deep/ .el-icon-close {
            position: absolute;
            right: 4px;
            top:8px;
        }
        /deep/ span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            max-width: 200px;
            display: inline-block;
        }
    }
    .tag-span{
        float: left;
        border: 1px solid #d9ecff;
        background: #ecf5ff;
        color: #409eff;
        padding: 3px 10px;
        line-height: 15px;
        font-size: 12px;
        margin: 0 3px 3px 0;
        border-radius: 3px;
        text-align: left;
    }
    .no-data {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    .touch-list {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 10px 0 0 0;
        .search-tool {
            width: 100%;
            margin-bottom: 9px;
            padding-left: 130px;
            display: flex;
            align-items: center;

            @media screen and (max-width: 1500px){
                flex-wrap: wrap;
            }

            .search-item {
                flex: 0 0 auto;
                padding-right: 10px;
                @media screen and (max-width: 1500px){
                    margin-bottom: 10px;
                }
                &:first-child {
                    margin-left: 0px;
                }
            }
            .spacer {
                flex: 1 1 auto;
            }
        }

        .touch-content {
            width: 100%;
            height: calc(100% - 145px);
            overflow: hidden;
            background: rgba(255, 255, 255, 1);
            // border: 1px solid rgba(189, 189, 189, 1);
            border-radius: 3px;
            position: relative;

            .wrapper {
                width: 100%;
                height: 100%;
                overflow: auto;
                position: relative;
                border: 1px solid #E5E9EC;
            }
            a{
                padding-right: 10px;
            }
            .option-item {
                width: 80px;
                height: 17px;
                margin-right: 10px;
                // background-color: #396bf6;
                border-radius: 4px;
                font-size: 0.75rem;
                color: #396bf6;
                text-align: center;
                line-height: 17px;
                cursor: pointer;

                &.disable {
                    color: #ccc;
                    // background: rgba(219, 219, 219, 1);
                }
                &:last-child {
                    margin-right: 0px;
                }
            }
        }

        .paginationa {
            width: 100%;
            padding: {
                top: 0px;
                bottom: 18px;
                left: 40px;
                right: 0;
            }
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
        .info-item {
            width: 100%;
            margin-bottom: 20px;
            width: 100%;
            height: auto;
            overflow: auto;

            .info-item-property {
                width: calc(50% - 100px);
                float: left;
                min-height: 40px;
                overflow: hidden;
                &:last-child {
                    margin-bottom: 0px;
                }

                &-label {
                    width: 30%;
                    height: 40px;
                    text-align: right;
                    line-height: 40px;
                    font-size: 1rem;
                    color: rgba(27, 27, 27, 1);
                    cursor: default;
                    float: left;
                }
                &-value {
                    width: 69%;
                    line-height: 40px;
                    font-size: 1rem;
                    cursor: default;
                    text-align: left;
                    float: right;
                    color: #666;
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
                font-size: 16px;
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
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
    }
    .el-dialog {
        .button-new-tag {
            float: left;
            vertical-align: bottom;
            position: relative;
            top: 3px;
        }
        .el-tag {
            margin-left: 10px;
            &:first-child {
                margin-left: 0px;
            }
        }
        .input-new-tag {
            width: 90px;
            vertical-align: bottom;
            float: left;
        }
        .date-picker {
            // display: flex;
            .date-spacer {
                margin-left: 10px;
                margin-right: 10px;
            }
        }
    }
    /deep/.el-input__inner{
        background: none;
    }
    /deep/.el-range-input{
        background: none;
    }
</style>
