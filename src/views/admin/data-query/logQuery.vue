<template>
    <div class="token-apply">
        <div class="query-list">
            <span class="query-list-span">
                任务类型：
                <el-select v-model="jobType" size="small" style="width: 140px">
                    <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </span>
            <span class="query-list-span">
                任务名/群体名：
                <el-input v-model="task" size="small" clearable placeholder="请输入任务名/群体名" style="width: 160px"> </el-input>
            </span>
            <span class="query-list-span">
                更新日期：
                <el-date-picker size="small" style="width: 130px" v-model="time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                </el-date-picker>
            </span>
            <span class="query-list-span">
                版本号：
                <el-input v-model="version" size="small" clearable placeholder="请输入版本号" style="width: 130px"> </el-input>
            </span>

            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button type="primary" size="small" @click="again">任务重跑</el-button>
        </div>
        <div class="body self-scroll">
            <div class="token-list">
                <el-table :data="list" size="small" border>
                    <el-table-column label="日志">
                        <template slot-scope="scope">
                            <div>{{ scope.row }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name TokenApply
 * @author tokenApply
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class LogQuery extends Vue {
    private map: any = {
        CRU: '库表更新更新',
        CRC: '库表建群新建',
        CK: '标签推送CK',
        HB: '标签推送HBase',
        BFC: '5K回流',
        ADR: '地址建群',
    };
    private mapList: any = [
        {
            value: 'CRU',
            label: '库表更新更新',
        },
        {
            value: 'CRC',
            label: '库表建群新建',
        },
        {
            value: 'CK',
            label: '标签推送CK',
        },
        {
            value: 'HB',
            label: '标签推送HBase',
        },
        {
            value: 'BFC',
            label: '5K回流',
        },
        {
            value: 'ADR',
            label: '地址推送',
        },
        {
            value: 'TAG',
            label: '标签更新',
        },
        {
            value: 'GROUP',
            label: '群体更新',
        },
    ];

    private list: any[] = [];

    private jobType: string = 'CRU';
    private task: string = '';
    private version: string = '';
    private time: string = '';

    private again() {
        if (!this.task) {
            this.$message('请输入任务名/群体名');
            return false;
        }
        this.$confirm('您确定要任务重跑?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            this.query(1);
        });
    }

    // ========== ajax request  ==========

    private query(type: string) {
        if (!this.task) {
            this.$message('请输入任务名/群体名');
            return false;
        }
        const data = {
            jobType: this.jobType,
            task: this.task,
            time: this.time,
            version: this.version,
        };
        let url: string = '/api/data/job/log';
        if (type == '1') {
            url = '/api/data/job/run';
        }
        this.$bus.$emit('main-loading', true);
        this.$api
            .post(url, data)
            .then((res) => {
                this.$bus.$emit('main-loading', false);
                if (type == '1') {
                    this.$message({
                        type: 'success',
                        message: '任务重跑成功!',
                    });
                } else {
                    this.list = res;
                }
            })
            .catch((err) => {
                this.$bus.$emit('main-loading', false);
            });
    }
}
</script>
<style lang="scss" scoped>
/*.token-apply {*/
/*    padding:10px 20px;*/
/*}*/
/deep/.el-input__inner {
    background: none;
}
.search-tool {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
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
    }

    .select-item {
        height: 30px;
    }

    .spacer {
        flex: 1 1 auto;
    }
}
.token-apply {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    min-width: 1100px;
    .query-list {
        padding: 15px 20px 0;
        font-size: 12px;
        &-span {
            padding-right: 10px;
        }
    }
    .body {
        width: 100%;
        height: calc(100% - 110px);
        margin-top: 4px;
        box-sizing: border-box;
        padding: 10px 20px;
        a {
            padding: 0 15px 0 0;
        }
        .search-tool {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
        }

        .token-list {
            width: 100%;
            /*height: calc(100% - 120px);*/
            height: auto;
            max-height: calc(100% - 60px);
            overflow: auto;
            background-color: #fff;
        }

        .option-item {
            margin-right: 10px;
            // color: rgba(57, 107, 246, 1);
            cursor: pointer;
        }

        .paginationa {
            width: 100%;
            padding: {
                top: 10px;
                bottom: 18px;
            }
            display: flex;
            justify-content: flex-end;
        }
    }
}
/deep/.el-tabs__header {
    margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 1px solid #f6f8fa;
}
</style>
