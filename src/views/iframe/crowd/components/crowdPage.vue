<template>
    <div class="body" v-loading="loading">
        <div class="search-tool">
            <div class="search-item">
                <div class="select-item">
                    <div class="mode-select" :class="{ active: crowdShowMode == 'card' }" @click="selectMode('card')">
                        <i class="el-icon-bank-card"></i>
                    </div>
                    <div class="mode-select" :class="{ active: crowdShowMode == 'table' }" @click="selectMode('table')">
                        <i class="el-icon-tickets"></i>
                    </div>
                </div>
                <div style="display:flex;" v-show="tab === 'oldSys'">
                    <div class="type-select" v-show="showMeCrowd" :class="{ active: crowdShowType == 'me' }" @click="selectType('me')">我的群体</div>
                    <div class="type-select" :class="{ active: crowdShowType == 'all' }" @click="selectType('all')">全部群体</div>
                </div>
            </div>
            <!-- <div class="spacer"></div> -->
            <div class="search-item col300">
                <el-input size="small" v-model="keyword" clearable :placeholder="placeholder" @change="getCrowdList">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>
        <template v-if="crowdList.length > 0">
            <div class="crowd-content card" v-if="crowdShowMode == 'card'">
                <el-row :gutter="20" style="width: 100%">
                    <el-col :md="12" :lg="8" :xl="6" v-for="item of crowdList" :key="item.id">
                        <Card :data="item" :query="query" :tab="tab"></Card>
                    </el-col>
                </el-row>
            </div>
            <div class="crowd-content table" v-else-if="crowdShowMode == 'table'">
                <el-table
                    v-if="tab === 'oldSys'"
                    :data="crowdList"
                    size="small"
                    style="width: 100%;fontWeight:normal;"
                    :header-cell-style="{ fontWeight: 'bold', color: '#000' }"
                >
                    <el-table-column min-width="200" label="群体名称" prop="ruleName" align="center"></el-table-column>
                    <el-table-column min-width="300" label="群体ID" prop="id" align="center"></el-table-column>
                    <el-table-column min-width="120" label="人数" prop="ruleNum" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.ruleNum ? scope.row.ruleNum.toLocaleString() : 0 }}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" label="状态" align="center">
                        <template slot-scope="scope">
                            <span :class="{ blue: scope.row.color == 1, red: scope.row.color == 2 }">{{ scope.row.stateText }}</span>
                            <!-- {{ ruleSmartStatusMap[scope.row.ruleSmartStatus] ? ruleSmartStatusMap[scope.row.ruleSmartStatus] : '无' }} -->
                        </template>
                    </el-table-column>
                    <el-table-column v-if="query.btnArr.length > 0 || query.clickName" label="操作" min-width="280" align="center">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                v-if="query.clickName"
                                @click="parentClick(scope.row.id, scope.row.ruleName, scope.row.ruleRelaProj, scope.row.ruleNum)"
                                >{{ query.clickName }}</el-button
                            >
                            <a
                                v-for="(item, index) in query.btnArr"
                                :key="index"
                                class="system-btn"
                                :href="
                                    `${item.link}?crowdId=${scope.row.id}&name=${scope.row.ruleName}&appCode=${scope.row.ruleRelaProj}&crowdNum=${scope.row.ruleNum}`
                                "
                                :target="item.openType"
                                >{{ item.name }}</a
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    v-if="tab === 'newSys'"
                    :data="crowdList"
                    size="small"
                    style="width: 100%;font-weight:normal;"
                    :header-cell-style="{ fontWeight: 'bold', color: '#000', background: '#f6f8fc' }"
                >
                    <el-table-column min-width="100" label="应用任务名称" prop="touchName" show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="群体名称" prop="crowdName"></el-table-column>
                    <el-table-column min-width="260" label="群体ID" prop="crowdCode"></el-table-column>
                    <el-table-column min-width="110px">
                        <template slot="header">
                            <div>创建时间</div>
                            <div>更新时间</div>
                        </template>
                        <template slot-scope="scope">
                            <div>{{ formatDate(scope.row.createdTime) }}</div>
                            <div>{{ formatDate(scope.row.modifiedTime) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100px">
                        <template slot="header">
                            <div>创建人</div>
                            <div>更新人</div>
                        </template>
                        <template slot-scope="scope">
                            <div>{{ scope.row.creator }}</div>
                            <div>{{ scope.row.modifier }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80" label="人数" prop="ruleNum">
                        <template slot-scope="scope">
                            {{ scope.row.crowdRealNum ? scope.row.crowdRealNum.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80" label="状态">
                        <template slot-scope="scope">
                            {{ touchStatusMap[scope.row.touchStatus] ? touchStatusMap[scope.row.touchStatus] : '——' }}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80" label="创建方式">
                        <template slot-scope="scope">
                            {{ crowdTypeMap[scope.row.crowdType] ? crowdTypeMap[scope.row.crowdType] : '——' }}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" label="应用类型">
                        <template slot-scope="scope">
                            {{ touchTypeMap[scope.row.touchType] ? touchTypeMap[scope.row.touchType] : '——' }}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="240" label="筛选条件">
                        <template slot-scope="scope">
                            <div class="search-div" v-if="scope.row.crowdType == 1" v-html="genEnumContent(scope.row)"></div>
<!--                            <div class="search-div" v-if="scope.row.crowdType == 4">-->
<!--                                <db-detail :dbInfo="crowd.crowdDefineDesc"></db-detail>-->
<!--                            </div>-->
                            <div class="search-div" v-if="scope.row.crowdType == 5" v-html="genEnumContentTwo(scope.row)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="query.btnArr.length > 0 || query.clickName" label="操作" min-width="100">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                v-if="query.clickName"
                                @click="parentClick(scope.row.crowdCode, scope.row.crowdName, scope.row.token, scope.row.crowdRealNum)"
                                >{{ query.clickName }}</el-button
                            >
                            <a
                                v-for="(item, index) in query.btnArr"
                                :key="index"
                                class="system-btn"
                                :href="linkUrl(item,scope.row)"
                                :target="item.openType"
                                >{{ item.name }}</a
                            >
                        </template>
                    </el-table-column>
                </el-table>
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
        </template>
        <template v-else>
            <div class="no-data">
                <NoData label="暂无群体数据"></NoData>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入
import { PageMixin } from '@/mixins/pageMixin';

// 第三方库引入
import moment from 'moment';

// 静态配置引入

// 公共组件引入
import NoData from '@/components/NoDataIcon.vue';

// 公共类引入
import SysSubject from '@/components/SysSubject.vue';

// 私有组件引入
import Card from './card.vue';
// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}
interface Moban {
    createdTime: string;
    creator: string; // 创建人
    crowdCode: string; // 群体编码
    crowdName: string; // 群体名称
    crowdRealNum: number; // 群体实际大小
    crowdVersion: string; // 群体版本
    id: number; // 主键ID
    modifiedTime: string; // 修改时间
    subjectId: number;
    sysName: string; //触达平台
    token: string;
    touchBegin: string; // 触达开始时间
    touchEnd: string; // 触达结束时间
    touchName: string; // 任务名称
    touchStatus: number; // 触达状态 1:未开始,2:准备中,3:应用中,4:结束
    touchType: number; // 触达类型 1:命中,2:下载,3:明细,4:5k集群
}
@Component({
    components: {
        SysSubject,
        Card,
        NoData
    }
})
export default class Crowd extends Mixins(PageMixin) {
    @Prop({ type: String }) private tab?: string;
    @Prop() private query?: any;
    @State(state => state.curSubject) curSubject!: Subject | null;
    @Watch('curSubject')
    private subjectChange() {
        this.pageNo = 1;
        this.pageSize = 10;
        this.getCrowdList();
    }

    @State(state => state.crowdShowType) crowdShowType!: string;
    @State(state => state.crowdShowMode) crowdShowMode!: string;
    @Watch('tab')
    private tabChange() {
        this.init();
    }
    @Watch('pageNo')
    private pageNoChange() {
        this.getCrowdList();
    }
    @Watch('pageSize')
    private pageSizeChange() {
        this.getCrowdList();
    }
    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD');
    }

    private keyword: string = '';
    private loading: boolean = true;
    private showMeCrowd: boolean = true;
    private ruleSmartStatusMap: object = {
        0: '已过期',
        1: '30天未调用下线'
    };

    private touchTypeMap: any = {
        // 触达类型
        1: '群体命中',
        2: '群体下载',
        3: '群体明细',
        4: '5k集群'
    };

    private touchStatusMap: object = {
        // 触达状态
        1: '未开始',
        2: '准备中',
        3: '应用中',
        4: '结束'
    };

    private crowdTypeMap: object = {
        1: '标签圈群',
        2: '上传群体',
        3: '',
        4: '自定义',
        5: '二次筛选',
        6: '地址建群'
    };

    private appTypeMap: object = {
        1: '群体推送',
        2: '群体命中'
    };

    private placeholder: string = '';

    private mounted() {
        this.addMonitor();
        this.init();
    }

    private addMonitor() {
        this.$bus.$on('CrowdDelete', () => {
            this.getCrowdList();
        });
    }

    private linkUrl(item:any,data:any){
        let url:string = '';
        if (item.link.indexOf('?') == -1) {
            url = `${item.link}?crowdId=${data.crowdCode}&name=${data.crowdName}&appCode=${data.token}&crowdNum=${data.crowdRealNum}`;
        } else {
            url = `${item.link}&crowdId=${data.crowdCode}&name=${data.crowdName}&appCode=${data.token}&crowdNum=${data.crowdRealNum}`;
        }
        return url;
    }

    private init() {
        console.log('载入init');
        if (!this.query.token) {
            return setTimeout(this.init, 500);
        }
        if (!this.query.loginUser || this.query.loginUser === '') {
            this.selectType('all');
            this.showMeCrowd = false;
        }
        if (this.query.listType == 0) {
            this.selectMode('table');
        }
        if (this.tab === 'oldSys') {
            this.placeholder = '请输入群体名称/群体ID/群体负责人ERP';
        } else {
            this.placeholder = '请输入任务名称/群体名称/群体ID';
        }
        this.getCrowdList(this.crowdShowType);
    }
    private crowdList: any[] = [];
    private getCrowdList(selectType: string = '') {
        const params = {
            pageNum: this.pageNo,
            pageSize: this.pageSize
            // token: this.query.token
        };
        let url = '/api/ava/app/touch/queryOldCrowd';
        if (this.keyword !== '') Object.assign(params, { keyword: this.keyword });
        // if (this.query.loginUser) Object.assign(params, { loginUser: this.query.loginUser });
        if (this.tab === 'newSys') {
            url = '/api/ava/app/touch/queryNewCrowd';
            Object.assign(params, { subjectId: this.curSubject?.id });
        } else {
            if (this.crowdShowType === 'all') Object.assign(params, { type: 0 });
            if (this.crowdShowType === 'me') {
                Object.assign(params, { type: 1 });
                if (this.query.loginUser) Object.assign(params, { loginUser: this.query.loginUser });
            }

        }
        this.loading = true;
        this.queryList(url, params).then((res: any) => {
            console.log(res);
            this.loading = false;
            if (this.tab === 'newSys') {
                this.crowdList = res.list;
                this.total = res.total;
            }
            if (this.tab === 'oldSys') {
                if (res.data) {
                    this.crowdList = res.data.datas.listResult;
                    this.total = res.data.datas.pageBean.totalRecord;
                    this.makeOldData();
                }
            }
        }).catch(e => {
            this.loading = false;
        });
    }

    private makeOldData() {
        this.crowdList.forEach((item: any) => {
            item.stateText = '30天未调用下线';
            item.color = 1;
            switch (item.ruleType) {
                case 1:
                    if (item.ruleStatus == 1) {
                        if (item.ruleExpireType != 3) {
                            if (!item.ruleExpireDate || item.ruleExpireDate === 'null') {
                                item.stateText = '暂无配置';
                                item.color = 2;
                            } else {
                                item.stateText = `${item.ruleExpireDate}到期`;
                            }
                        } else {
                            const ruleTime = new Date(item.ruleExpireDate).getTime();
                            const nowTime = new Date();
                            const nowDay = `${nowTime.getFullYear()}/${nowTime.getMonth() + 1}/${nowTime.getDate()}`;
                            const nowDayTime = new Date(nowDay).getTime();
                            const aDay = 24 * 60 * 60 * 1000;
                            const diffDay = (ruleTime - nowDayTime) / aDay;
                            if (diffDay <= 4 && diffDay > 0) {
                                item.stateText = `${item.ruleExpireDate}下线`;
                                item.color = 2;
                            }
                        }
                    } else {
                        item.stateText = '已过期';
                        item.color = 2;
                    }
                    break;
                case 2:
                    item.stateText = '——';
                    break;
                case 3:
                    item.stateText = '——';
                    break;
            }
        });
    }

    private selectType(newType: string) {
        if (this.crowdShowType == newType) {
            return;
        }
        this.pageNo = 1;
        this.pageSize = 10;
        this.$store.commit('updateCrowdShowType', newType);
        this.getCrowdList(this.crowdShowType);
    }

    private selectMode(newMode: string) {
        if (this.crowdShowMode == newMode) {
            return;
        }
        this.$store.commit('updateCrowdShowMode', newMode);
    }


    private genEnumContentTwo(crowd?: any) {
        if ((!this.crowd || this.crowd.crowdType != 5) && !crowd) {
            return '';
        }
        let text:string = '';
        const map:any = {
            '_AND': '且',
            '_OR': '或',
            '_NOT': '非',
            'undefined':''
        };
        const crowdDefineDesc = JSON.parse(crowd ? crowd.crowdDefineDesc : (this.crowd.crowdDefineDesc as string));
        for (const i in crowdDefineDesc.expression) {
            let teg:string = crowdDefineDesc.expression[i].tagVal;
            let text1:any = '';
            teg = `${teg} ：`;
            for (const j in crowdDefineDesc.expression[i].enums) {
                teg += crowdDefineDesc.expression[i].enums[j].tagEnumName;
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
        if(crowdDefineDesc.valueType == 1){
            text = `<div style="font-weight: bold">群体：${crowdDefineDesc.crowd.crowdName}</div><div class="logic-1">${map[crowdDefineDesc.logicCrowd]}</div>${text}`;
        } else {
            text = `${text}<div class="logic-1">${map[crowdDefineDesc.logicCrowd]}</div><div style="font-weight: bold">群体：${crowdDefineDesc.crowd.crowdName}</div>`;
        }
        text = `<div class="crowd-enum-item-list">${text}</div>`;
        return text;
    }

    private genEnumContent(crowd?: any) {
        if ((!this.crowd || this.crowd.crowdType != 1) && !crowd) {
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
            let m:number = 0;
            crowdDefineDesc.expression.forEach((expression: any) => {
                // console.log(expression);
                const type1:any = crowdDefineDesc.logic[m]?crowdDefineDesc.logic[m]:'undefined';
                let n:number = 0;
                m++;
                expression.tag.forEach((tag: any) => {
                    const type:any = expression.logic[n]?expression.logic[n]:'undefined';
                    const len:any = tag.tagComponent.length;
                    if(len > 1){
                        text = `${text}<div>${tag.tagData.tagName}</div>`;
                    }
                    n++;
                    for (let i = 0; i < len; i++) {
                        if (tag.tagComponent[i].tagCompStyle == 21 || tag.tagComponent[i].tagCompStyle == 22) {
                            text = `${text}<div>${tag.tagComponent[i].tagCompName}：${tag.tagValue[i]
                                .map((item: any) => item.tagEnumName)
                                .join('，')}；</div>`;
                        } else if (tag.tagComponent[i].tagCompStyle >= 11 && tag.tagComponent[i].tagCompStyle <= 19) {
                            if (tag.tagComponent[i].tagCompStyle == 12) {
                                text = `${text}<div>${tag.tagComponent[i].tagCompName}：${tag.tagValue[i]
                                    .map((item: any) => this.formatDate(item, 'YYYY'))
                                    .join(' ~ ')}；</div>`;
                            }else if(tag.tagComponent[i].tagCompStyle == 13){
                                text = `${text}<div>${tag.tagComponent[i].tagCompName}：${tag.tagValue[i]
                                    .map((item: any) => this.formatDate(item, 'YYYY-MM'))
                                    .join(' ~ ')}；</div>`;
                            }else if(tag.tagComponent[i].tagCompStyle == 11 || tag.tagComponent[i].tagCompStyle == 19) {
                                if(tag.tagValue[i].length == 1){
                                    text = `${text}<div>${tag.tagComponent[i].tagCompName}：最近${tag.tagValue[i][0]}天；</div>`;
                                }else{
                                    text = `${text}<div>${tag.tagComponent[i].tagCompName}：${tag.tagValue[i]
                                        .map((item: any) => this.formatDate(item, 'YYYY-MM-DD'))
                                        .join(' ~ ')}；</div>`;
                                }
                            } else{
                                text = `${text}<div>${tag.tagComponent[i].tagCompName}：${tag.tagValue[i]
                                    .map((item: any) => this.formatDate(item, 'YYYY-MM-DD'))
                                    .join(' ~ ')}；</div>`;
                            }
                        } else {
                            text = `${text}<div>${tag.tagComponent[i].tagCompName}：${tag.tagValue[i].join('，')}；</div>`;
                        }
                    }
                    if(map[type]){
                        text += `<div class="logic">${map[type]}</div>`;
                    }
                });
                if (map[type1]) {
                    text += `<div class="logic-1">${map[type1]}</div>`;
                }
            });
            text = `<div class="crowd-enum-item-list">${text}</div>`;
        }catch (e) {
            console.log(e);
        }
        return text;
    }

    // 自定义点击事件
    parentClick(crowdCode: string, crowdName: string, appCode: string, crowdNum: string | number) {
        console.log({
            crowdCode: crowdCode,
            crowdName: crowdName,
            appCode: appCode,
            crowdNum: crowdNum,
        });
        window.parent.postMessage(
            {
                crowdCode: crowdCode,
                crowdName: crowdName,
                appCode: appCode,
                crowdNum: crowdNum,
            },
            '*'
        );
    }
    // ajax query xxxxxxxxxxxx
    private queryList(url: string, params: any) {
        return new Promise((resolve, reject) => {
            this.$api
                .get(url, params)
                .then((res: any) => {
                    resolve(res);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
}
</script>

<style lang="scss" scoped>
.blue {
    color: #2fbaf1;
}
.red {
    color: #ee3333;
}
.system-btn {
    height: 28px;
    border: 1px solid #dcdfe6;
    color: #606266;
    background: white;
    border-radius: 4px;
    text-align: center;
    line-height: 27px;
    font-size: 12px;
    font-weight: normal;
    display: inline-block;
    margin-left: 10px;
    padding: 0 10px;
    &:hover {
        color: #2d68ff;
        border-color: #c0d2ff;
        background-color: #eaf0ff;
    }
}
.body {
    width: 100%;
    height: calc(100% - 50px);
    margin-top: 4px;
    padding:18px 20px 60px;
    box-sizing: border-box;
    overflow: auto;
    /deep/.search-div{
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
    .search-tool {
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        padding: 0 30px 0 0;
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

            .type-select {
                width: 90px;
                height: 30px;
                line-height: 28px;
                text-align: center;
                cursor: pointer;

                font-size: 0.75rem;
                border-radius: 4px;

                margin-right: 20px;

                color: rgba(57, 107, 246, 1);
                border: 1px solid rgba(57, 107, 246, 1);
                background: #fff;
                &.active {
                    line-height: 30px;
                    background: rgba(57, 107, 246, 1);
                    color: rgba(255, 255, 255, 1);
                    border: 0px;
                }
            }

            .select-item {
                width: 80px;
                height: 30px;
                .mode-select {
                    width: 30px;
                    height: 30px;
                    display: inline-block;
                    line-height: 30px;
                    text-align: center;
                    margin-right: 10px;
                    color: rgba(57, 107, 246, 1);
                    background: rgba(255, 255, 255, 1);
                    border-radius: 4px;
                    box-shadow: 0px 2px 4px 0px rgba(196, 196, 196, 0.55);
                    cursor: pointer;
                    &.active {
                        color: #fff;
                        background: rgba(57, 107, 246, 1);
                        border-radius: 4px;
                        box-shadow: 0px 2px 4px 0px rgba(57, 107, 246, 0.65);
                    }
                }
            }
        }
        .spacer {
            flex: 1 1 auto;
        }
    }
    .crowd-content {
        width: 100%;
        margin-bottom: 40px;
        display: flex;
        flex-wrap: wrap;

        &.table {
            padding: 0;
            border: 1px solid #EBEEF5;
            border-bottom: 0;
            background-color: #fff;
        }
    }
    .paginationa {
        width: 100%;
        background: #fff;
        position: fixed;
        left:0;
        bottom: 0;
        right:0;
        height: 60px;
        padding: 15px 20px;
        text-align: right;
        box-shadow: 0px 7px 7px 7px #eee;
    }
    .no-data {
        width: 100%;
        height: calc(100% - 52px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
