<template>
    <div class="tag-to-crowd">
        <div class="body">
            <DbCrowdInfo ref="dbCrowd" :crowdData="crowdData" :crowdNum.sync="crowdNum"></DbCrowdInfo>
        </div>
        <div class="footer">
            <div class="search-tag-btn">
                <el-button size="small" plain @click="calcCrowdNum" v-if="crowdNum < 0">
                    <span>计算群体数量</span>
                </el-button>
                <el-button size="small" plain @click="calcCrowdNum" v-if="crowdNum >= 0">
                    <span>{{ `群体数量：${crowdNum}` }}</span>
                </el-button>
                <el-button size="small" type="primary" @click="saveCrowd">保存群体</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name DbToCrowd
 * @author shileilei3
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
// 公共类引入
import SysSubject from '@/components/SysSubject.vue';
// 私有类引入
import DbCrowdInfo from './DbCrowdInfo.vue';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 私有组件引入

// 本地定义和声明
interface Subject {
    id: number;
    subjectCn: string;
    subjectEn: string;
    subjectDesc: string;
    subjectSort: number;
}

@Component({
    components: {
        SysSubject,
        DbCrowdInfo
    }
})
export default class DbToCrowd extends Vue {
    @State(state => state.curSubject)
    curSubject!: Subject | null;
    @Watch('curSubject')
    private subjectChange() {
        this.init();
    }

    private selectTagList: any[] = [];

    private crowdNum: number = -1;

    @Prop() private crowdData!: string;

    get code() {
        if (this.crowdData) {
            return this.crowdData.crowdCode;
        }
        return null;
    }

    private mounted() {
        return setTimeout(this.init, 500);
    }

    private cancel() {
        this.$router.push({
            path: '/crowd-manage'
        });
    }

    // 计算群体数量
    private calcCrowdNum() {
        (this.$refs['dbCrowd'] as any).calcCrowdNum();
    }

    private saveCrowd() {
        (this.$refs['dbCrowd'] as any).saveCrowd();
    }

    private init() {
        (this.$refs['dbCrowd'] as any).init(this.code);
    }
}
</script>
<style lang="scss" scoped>
.tag-to-crowd {
    width: 100%;
    height: 100%;
    position: relative;
    /*overflow: hidden;*/

    .footer {
        width: 100%;
        height: 60px;
        border-top: 1px solid #eee;
        padding: 0 15px;
        line-height: 60px;
        .search-tag-btn {
            width: 100%;
            text-align: right;
        }
    }
    .body {
        width: 100%;
        padding: 5px 20px;
        overflow-y: auto;
        height: calc(100% - 70px);
        box-sizing: content-box;
        border-top: 1px solid #eee;
        .tag-select-list {
            flex: 0 0 auto;
            width: 250px;
            height: 100%;
            background-color: #fff;
        }
        .expression {
            flex: 0 0 auto;
            width: 550px;
            height: 100%;
            background-color: #fff;
        }
        .portrait-preview {
            flex: 0 0 auto;
            width: 500px;
            height: 100%;
            background-color: #fff;
        }
    }
    /deep/ .el-tabs__nav {
        height: 64px;
    }
}
</style>
