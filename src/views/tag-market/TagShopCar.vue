<template>
    <div class="tag-shop-car">
        <div class="subject-content">
            <!--            <SysSubject size="small"></SysSubject>-->
            {{curSubject.subjectCn}}
        </div>
        <div class="tag-list">
            <template v-if="tagList.length > 0">
                <el-tooltip class="item tag-list-item" effect="dark"
                            :content="`${item.tagName} （${ item.coverNum === null ? '' : item.coverNum.toLocaleString() }）`"
                            placement="left" v-for="item of tagList" :key="`shopcar-${item.tagCode}`">
                    <el-button>
                        <span>{{ item.tagName }} （{{ item.coverNum === null ? '' : item.coverNum.toLocaleString() }}）</span>
                        <i class="icon el-icon-close" @click="delItem(item)"></i>
                    </el-button>
                </el-tooltip>
            </template>
            <template v-else>
                <div class="noTagText">
                    暂无标签，快去添加标签吧~
                </div>
            </template>
        </div>
        <div class="action">
            <div class="action-btn action-btn-left" @click="cleanAll">清空</div>
            <div class="action-btn" :class="{ disable: tagList.length < 1 }" @click="goToCrowd">去建群</div>
        </div>
    </div>
</template>

<script lang="ts">
    /**
     * @name TagShopCar
     * @author liang2064
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 购物车组件
     */
    import {Component, Vue, Watch, Prop} from 'vue-property-decorator';
    import {State} from 'vuex-class';

    // mixin引入

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入
    import SysSubject from '@/components/SysSubject.vue';

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
        components: {
            SysSubject
        }
    })
    export default class TagShopCar extends Vue {
        @State(state => state.curSubject) curSubject!: Subject | null;

        @Watch('curSubject')
        private subjectChange() {
            this.init();
        }

        @Prop()
        private curSize!: number;

        private msg: any = null;

        private MAX_LEN: number = 20;

        private tagList: Tag[] = [];

        private eventId: Array<any> = [];

        private mounted() {
            this.addMonitor();
            this.init();
        }

        private beforeDestroy() {
            this.eventId.forEach((event: any) => {
                this.$bus.$off(event.event, event.id);
            });
        }

        private addMonitor() {
            const id = this.$bus.$on('addTagToShopCar', (payload: Tag) => {
                // console.log('addTagToShopCar');
                this.addItem(payload);
            });
            this.eventId.push({
                id: id,
                event: 'addTagToShopCar'
            });

            const id1 = this.$bus.$on('addType', () => {
                // console.log('addTagToShopCar');
                return this.tagList;
            });
            this.eventId.push({
                id: id1,
                event: 'addType'
            });
        }

        private init() {
            if (!this.curSubject) {
                return setTimeout(this.init, 500);
            }
            this.$bus.$emit('main-loading',true);
            this.getSelectTagBySubject().then((res: any) => {
                this.$bus.$emit('main-loading',false);
                this.tagList = res;
                this.$emit('update:curSize', this.tagList.length);
            });
        }

        private addItem(item: Tag) {
            // 空目标检查
            if (!item || !item.tagCode) {
                return;
            }
            // 空余位置检查
            if (this.tagList.length >= this.MAX_LEN) {
                this.$message.warning('添加标签已达数量上限');
                return;
            }
            // 已添加检查
            const idx = this.tagList.findIndex((tag: Tag) => {
                return tag.tagCode == item.tagCode;
            });
            // console.log(idx);
            if (idx >= 0) {
                if (this.msg) {
                    this.msg.close();
                }
                this.msg = this.$message.warning('该标签已被添加');
                return;
            }
            this.addSelectTag(item.tagCode).then(() => {
                this.$message.success(`标签【${item.tagName}】添加成功`);
                this.init();
            });
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

        private goToCrowd() {
            if (this.tagList.length < 1) {
                return;
            }
            if (this.$route.query.code) {
                this.$router.push({
                    name: 'crowd-manage',
                    query:{
                        code: this.$route.query.code,
                        type: 1
                    }
                });
            } else {
                this.$router.push({
                    name: 'crowd-manage',
                    query:{
                        new: 'tag'
                    }
                });
            }
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

        private addSelectTag(tagCode: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/tagSelected/add';
                const data: object = {
                    subjectId: this.curSubject?.id,
                    tagCode: tagCode
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
    }
</script>
<style lang="scss" scoped>
    .tag-shop-car {
        width: 350px;
        min-height: 300px;
        max-height: 700px;
        // overflow-y: auto;
        .subject-content {
            width: 100%;
            height: 34px;
            border-bottom: 1px solid rgba(170, 170, 170, 0.2);
        }

        .tag-list {
            width: 100%;
            height: 100%;
            min-height: 300px;
            /*min-height: 220px;*/
            max-height: 480px;
            overflow-y: auto;

            .el-button {
                position: relative;
                padding-left: 14px;

                &:before {
                    position: absolute;
                    content: " ";
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    overflow: hidden;
                    left: 4px;
                    top: 14px;
                    background: #B5C9DC;
                }
            }

            span {
                text-align: left;
                display: block;
                width: 290px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .noTagText {
                width: 100%;
                text-align: center;
                margin-top: 25%;
                background: url("~@/assets/img/kongkong.png") center 0 no-repeat;
                background-size: 50%;
                height: 200px;
                padding-top: 100px;
                color: #BBBDC1;
            }

            &-item {
                position: relative;
                width: 350px;
                background: rgba(255, 255, 255, 1);
                padding: 10px 30px 10px 10px;
                margin-left: 0;
                display: block;
                color: #333;
                cursor: default;
                border: none;

                &:hover {
                    background: #f9f9f9;
                }

                .icon {
                    width: 14px;
                    height: 14px;
                    position: absolute;
                    top: 6px;
                    right: 11px;
                    bottom: 11px;
                    line-height: 22px;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }

        .action {
            width: 350px;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #EAF0F9;

            .action-btn {
                width: 50%;
                height: 40px;
                line-height: 40px;
                text-align: center;
                cursor: pointer;

                &:hover {
                    color: #3D6EF0;
                }
            }

            .action-btn-left {
                border-right: 1px solid #EAF0F9;
            }
        }
    }
</style>
