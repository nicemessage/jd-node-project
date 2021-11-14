<template>
    <div class="select-tag">
        <div class="action">
            <span class="action-l">
                <span class="title">已选</span>
            </span>
            <div class="spacer"></div>
            <el-button size="mini" plain @click="goToMarket"><i class="el-icon-plus"></i> 添加标签</el-button>
            <el-button size="mini" plain :disabled="tagList.length < 1" @click="cleanAll"><i class="el-icon-delete"></i> 清空</el-button>
        </div>
        <div class="tag-list">
            <template v-if="tagList.length > 0">
                <template v-for="item of tagList">
                    <el-tooltip v-if="lengthTagName(item) > 16" :content="`${item.tagName}（${ item.coverNum ? item.coverNum.toLocaleString() : 0 }）`" placement="left" :key="item.tagCode">
                        <div class="tag-list-item" :key="item.tagCode" draggable @dragstart="ondragstartHandler($event, item)">
                            <div class="circle"></div>
                            <span class="span">{{ item.tagName }}（{{ item.coverNum ? item.coverNum.toLocaleString() : 0 }}）</span>
                            <i class="icon el-icon-close" @click="delItem(item)"></i>
                        </div>
                    </el-tooltip>
                    <div class="tag-list-item" v-else :key="item.tagCode" draggable @dragstart="ondragstartHandler($event, item)">
                        <div class="circle"></div>
                        <span class="span">{{ item.tagName }}（{{ item.coverNum ? item.coverNum.toLocaleString() : 0 }}）</span>
                        <i class="icon el-icon-close" @click="delItem(item)"></i>
                    </div>
                </template>
            </template>
            <template v-else>
                <div class="no-data">
                    无可选标签
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * @name SelectTag
 * @author your name
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { State } from 'vuex-class';

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 公共类引入

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

interface Tag {
    tagName: string;
    tagCode: string;
    subjectId: number;
    coverNum: number;
}

@Component({
    components: {}
})
export default class SelectTag extends Vue {
    @State(state => state.curSubject) curSubject!: Subject | null;
    @Watch('curSubject')
    private subjectChange() {
        this.init();
    }

    private MAX_LEN: number = 20;

    private tagList: Tag[] = [];

    @Prop()
    private crowdData!: string;

    private created() {
        // 解决firefox 拖拽兼容问题
        document.body.ondrop = function(event) {
            event.preventDefault();
            event.stopPropagation();
        };
    }

    private mounted() {
        this.init();
    }

    private init() {
        if (!this.curSubject) {
            return setTimeout(this.init, 500);
        }
        this.$bus.$emit('main-loading',true);
        this.getSelectTagBySubject().then((res: any) => {
            this.$bus.$emit('main-loading',false);
            this.tagList = res;
        });
    }

    private goToMarket() {
        if (this.crowdData) {
            this.$router.push({
                name: 'tag-market',
                query:{
                    code: this.crowdData.crowdCode
                }
            });
        } else {
            this.$router.push({
                name: 'tag-market'
            });
        }

    }

    private delItem(item: Tag) {
        if (!item || !item.tagCode) {
            return;
        }
        this.delSelectTag(item.tagCode).then(() => {
            this.init();
            this.$message.success('标签删除成功');
        });
    }

    private cleanAll() {
        if (this.tagList.length < 1) {
            this.$message.warning('已无可清除内容');
            return;
        }
        this.delAll().then(() => {
            this.init();
            this.$message.success('全部清除成功');
        });
    }

    private ondragstartHandler(ev: any, tag: any) {
        ev.dataTransfer.clearData();
        ev.dataTransfer.setData('text/plain', JSON.stringify(tag));
    }

    // 优化已选提示
    private lengthTagName(item:any) {
        if(item.coverNum) {
            return Number(item.tagName.length) + Number(item.coverNum.toLocaleString().length)/2 + 2;
        }
        return Number(item.tagName.length) + 3;

    }

    // ========== ajax request  ==========

    private getSelectTagBySubject() {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagSelected/getAll';
            const data: object = {
                subjectId: this.curSubject?.id
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

    private delSelectTag(tagCode: string) {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagSelected/del';
            const data: object = {
                subjectId: this.curSubject?.id,
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

    private delAll() {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/tagSelected/delAll';
            const data: object = {
                subjectId: this.curSubject?.id
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
}
</script>
<style lang="scss" scoped>
.select-tag {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 18px 20px;

    .action {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #EAF0F9;
        .go-back{
            cursor: pointer;
        }
        padding-bottom: 20px;
        .title{
            position: relative;
            font-size: 1rem;
            font-weight: bold;
            color: #1b1b1b;
            cursor: default;
            padding-left: 10px;
            height: 32px;
            line-height: 32px;
            &:before{
                position: absolute;
                content: " ";
                width: 3px;
                height: 12px;
                overflow: hidden;
                left: 0;
                top: 4px;
                background: #3a57fe;
            }
        }
    }
    .tag-list {
        width: 100%;
        height: calc(100% - 58px);
        position: relative;
        overflow-y: auto;
        padding-top: 10px;
        &-item {
            position: relative;
            width: 100%;
            height: 36px;
            line-height: 36px;


            font-size: 0.75rem;
            color: #333333;

            cursor: move;
            .span {
                display: inline-block;
                width: calc(100% - 30px);
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                padding-left: 20px;
            }

            .circle {
                position: absolute;
                top:16px;
                left:5px;
                width: 5px;
                height: 5px;
                background-color: #D9E0E5;
                border-radius: 50%;
            }

            .icon {
                width: 14px;
                height: 14px;
                position: absolute;
                top: 11px;
                right: 11px;
                bottom: 11px;
                /*background: rgba(239, 239, 239, 1);*/
                line-height: 14px;
                text-align: center;
                cursor: pointer;
            }
        }

        .no-data {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: url("~@/assets/img/kongkong.png") center center no-repeat;
            background-size: 50%;
            padding-top: 100px;
            color: #BBBDC1;
        }
    }
}
</style>
