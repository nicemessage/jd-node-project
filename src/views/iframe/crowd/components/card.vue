<template>
    <div class="crowd-item">
        <div v-if="tab === 'newSys'">
            <div class="crowd-item-header">
                <div class="crowd-item-header-name" :title="data.touchName">{{ data.touchName }}</div>
                <div class="spacer"></div>
                <el-button size="mini" v-if="query.clickName" @click="parentClick(data.crowdCode, data.crowdName, data.token, data.crowdRealNum)">{{
                    query.clickName
                }}</el-button>
                <div v-for="(item, index) in query.btnArr" :key="index">
                    <a
                        class="system-btn"
                        :href="linkUrl(item,data)"
                        :target="item.openType"
                        >{{ item.name }}</a
                    >
                </div>
            </div>
            <div class="crowd-item-body">
                <div class="item-property">
                    <div class="item-property-label">应用周期：</div>
                    <div class="item-property-value">
                        {{ `${ formatDate(data.touchBegin)} — ${formatDate(data.touchEnd)}` }}
                    </div>
                </div>
                <div class="item-property">
                    <div class="item-property-label">应用类型：</div>
                    <div class="item-property-value">
                        {{ touchTypeMap[data.touchType] ? touchTypeMap[data.touchType] : '无' }}
                    </div>
                </div>
                <div class="item-property">
                    <div class="item-property-label">应用状态：</div>
                    <div class="item-property-value">
                        {{ touchStatusMap[data.touchStatus] ? touchStatusMap[data.touchStatus] : '无' }}
                    </div>
                </div>
                <div class="item-property" style="color:#BDBDBD;">
                    <div class="item-property-label">群体ID：</div>
                    <div class="item-property-value">{{ data.crowdCode }}</div>
                    <i title="复制" class="el-icon-document-copy copyBtn" @click.stop="copyCrowdCode(data.crowdCode)"></i>
                </div>
                <div class="item-property" style="color:#BDBDBD;">
                    <div class="item-property-label">群体名称：</div>
                    <div class="item-property-value">{{ data.crowdName }}</div>
                </div>
                <div class="numStyle">
                    <h2 style="color:#396BF6;">{{ data.crowdRealNum ? data.crowdRealNum.toLocaleString() : 0 }}</h2>
                    <span>(人)</span>
                </div>
            </div>
        </div>
        <div v-if="tab === 'oldSys'">
            <div class="crowd-item-header">
                <div class="crowd-item-header-name" :title="data.ruleName">{{ data.ruleName }}</div>
                <div class="spacer"></div>
                <el-button size="mini" v-if="query.clickName" @click="parentClick(data.crowdCode, data.crowdName, data.token, data.crowdRealNum)">{{
                    query.clickName
                }}</el-button>
                <div v-for="(item, index) in query.btnArr" :key="index">
                    <a
                        class="system-btn"
                        v-if="item.link.indexOf('?') == -1"
                        :href="linkUrl(item,data)"
                        :target="item.openType"
                        >{{ item.name }}</a
                    >
                </div>
            </div>
            <div class="crowd-item-body">
                <div class="item-property" style="color:#BDBDBD;margin-bottom: 6px;">
                    <div class="item-property-label" style="width: 50px;">群体ID：</div>
                    <div class="item-property-value">{{ data.id }}</div>
                    <i title="复制" class="el-icon-document-copy copyBtn" @click.stop="copyCrowdCode(data.id)"></i>
                </div>
                <div class="item-property" style="margin-bottom: 6px;">
                    <h2 style="color:#237aff;font-size: 24px;">{{ data.ruleNum ? data.ruleNum.toLocaleString() : 0 }}</h2>
                    <span style="line-height:35px;">（人）</span>
                </div>
                <div class="item-property" style="color:#BDBDBD;">
                    <div class="item-property-label" style="width: 36px;">状态：</div>
                    <div class="item-property-value" :class="{ blue: data.color == 1, red: data.color == 2 }">
                        {{ data.stateText }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name CrowdItem
 * @author liang2064
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Prop } from 'vue-property-decorator';

// mixin引入

// 第三方库引入
import moment from 'moment';

// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明
interface Crowd {
    id: number;
    crowdName: string;
    crowdCode: string;
    crowdRealNum: number;
    crowdVersion: string;
    crowdType: number;
    crowdUpdateCycle: string;
    subjectId: number;
    crowdState: number;
}

@Component({
    components: {}
})
export default class CrowdCard extends Vue {
    @Prop({
        required: true
    })
    private data?: Crowd;

    @Prop()
    private tab!: string;

    @Prop()
    private query!: any;
    private showDelDialog: boolean = false;
    private routerFor: string = 'tag-to-crowd';

    private linkUrl(item:any,data:any){
        let url:string = '';
        if (item.link.indexOf('?') == -1) {
            url = `${item.link}?crowdId=${data.crowdCode}&name=${data.crowdName}&appCode=${data.token}&crowdNum=${data.crowdRealNum}`;
        } else {
            url = `${item.link}&crowdId=${data.crowdCode}&name=${data.crowdName}&appCode=${data.token}&crowdNum=${data.crowdRealNum}`;
        }
        return url;
    }

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

    private ruleSmartStatusMap: object = {
        0: '已过期',
        1: '30天未调用下线'
    };

    private formatDate(dateStr: string, formatStr?: string) {
        return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD');
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

    private copyCrowdCode(str: string) {
        this.$copyText(str).then(() => {
            this.$notify({
                title: '复制成功',
                message: '',
                type: 'success'
            });
        });
    }

    private btnClick(url: string, openType: string) {
        console.log(url);
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
.numStyle {
    display: flex;
    position: absolute;
    top: 38%;
    right: 15%;
    span {
        font-size: 12px;
        vertical-align: bottom;
        line-height: 37px;
    }
}
.crowd-item {
    height: 188px;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    /*box-shadow: 0px 2px 6px 0px rgba(189, 189, 189, 0.5);*/
    margin-bottom: 20px;
    &:hover{
        box-shadow: 0px 0px 10px 0px rgba(142, 148, 156, 0.2);
    }

    cursor: default;
    .spacer {
        flex: 1 1 auto;
    }

    &-header {
        width: 100%;
        height: 50px;
        border-radius: 6px 6px 0px 0px;
        padding: {
            left: 20px;
            right: 20px;
        }

        display: flex;
        align-items: center;

        font-size: 1rem;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
        &-name {
            max-width: 58%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    &-body {
        width: 100%;
        height: calc(100% - 50px);
        padding:0 20px;
        display: flex;
        flex-direction: column;
        position: relative;
        .copyBtn {
            line-height: 20px;
            cursor: pointer;
        }

        .item-property {
            width: 100%;
            display: flex;
            font-size: 12px;
            line-height: 26px;
            font-weight: normal;
            &-label {
                width: 60px;
                text-align: left;
            }
            &-value {
                flex: 1 1 auto;
            }
        }
    }
    &-footer {
        width: 100%;
        height: 32px;
        padding: {
            left: 20px;
            right: 20px;
        }
        display: flex;
        justify-content: flex-end;
        align-items: center;
        i {
            margin-left: 20px;
            cursor: pointer;
        }
    }
}
</style>
