<template>
    <div class="tag-market" element-loading-text="加载中" v-loading="loading">
        <div class="header">
            <div class="subject-list">
                <SysSubject></SysSubject>
            </div>
            <div class="search-tag-btn">
                <el-input
                        size="medium"
                        placeholder="请输入标签编码/标签名称/标签描述"
                        v-model="searchWord"
                        clearable
                        @keyup.enter.native="searchTag"
                        style="width: 300px;background: none;"
                >
                    <i class="el-input__icon el-icon-search" slot="suffix" @click="searchTag"></i>
                </el-input>
                <div class="select-item">
                    <el-button size="medium" v-if="showType == 'table'" @click="selectShowType('item')">
                        <i class="el-icon-tickets"></i>
                    </el-button>
                    <el-button size="medium" v-if="showType == 'item'" @click="selectShowType('table')">
                        <i class="el-icon-bank-card"></i>
                    </el-button>
                </div>
            </div>
        </div>
        <div class="body">
            <TagTypeComp :search="searchFilter"></TagTypeComp>
            <div class="tag-list">
                <div class="tag-list-count-and-order">
                    <div class="tag-count">
                        筛选结果总数<span>{{ total }}</span>
                    </div>
                    <div class="tag-order">
                        <div class="tag-order-item" :class="{ active: sortBy == item.key }" v-for="item of sortList"
                             :key="`order-item-${item.key}`"  @click="setOrder(item.key)">
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                            <span class="sort-btns">
                                <i
                                        class="order-btn el-icon el-icon-caret-top"
                                        :class="{ active: sortBy == item.key && sortOrder == 1 }"
                                ></i>
                                <i
                                        class="order-btn el-icon el-icon-caret-bottom"
                                        :class="{ active: sortBy == item.key && sortOrder == 2 }"
                                ></i>
                            </span>
                        </div>

                        <!--                        <div class="select-item">-->
                        <!--                            <div class="mode-select" :class="{ active: showType == 'item' }" @click="selectShowType('item')">-->
                        <!--                                <i class="el-icon-bank-card"></i>-->
                        <!--                            </div>-->
                        <!--                            <div class="mode-select" :class="{ active: showType == 'table' }" @click="selectShowType('table')">-->
                        <!--                                <i class="el-icon-tickets"></i>-->
                        <!--                            </div>-->
                        <!--                        </div>-->
                    </div>
                </div>
                <div class="tag-list-content">
                    <TagListComp :tagList="tagList" :showType="showType"></TagListComp>
                </div>
            </div>
        </div>
        <div class="paginationa">
            <el-pagination
                    layout="prev, pager, next, sizes, total"
                    :pager-count="5"
                    :total="total"
                    :page-size.sync="pageSize"
                    :current-page.sync="pageNo"
                    :page-sizes="pageSizeList"
            >
            </el-pagination>
        </div>
        <el-drawer
                title="标签详情"
                :visible.sync="tableDialog"
                direction="rtl"
                size="80%">
            <TagInfo :tagId="tagId" :tagCode="tagCode" v-if="tableDialog"></TagInfo>
        </el-drawer>
        <!-- <el-popover ref="MyShop" key="shop-car" trigger="click" placement="top" :visible-arrow="false">
            <div class="shop-car-content">
                <TagShopCar :curSize.sync="carSize"></TagShopCar>
            </div>
            <div slot="reference" class="shop-car">
                <el-badge :value="carSize" :hidden="carSize < 1" class="item">
                    <i class="el-icon-shopping-cart-full"></i>
                </el-badge>
            </div>
        </el-popover> -->
        <transition name="el-fade-in-linear">
            <div class="shop-car-content" v-show="ShopCarVisible">
                <TagShopCar :curSize.sync="carSize"></TagShopCar>
                <i class="el-icon-close subject-content-i" @click="ShopCarVisible = false"></i>
            </div>
        </transition>
        <div class="shop-car" @click="ShopCarVisible = !ShopCarVisible">
            <b v-if="carSize >= 1">
                {{carSize}}
            </b>
            <i class="el-icon-shopping-cart-2"></i>
            <span>已选</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';

    // mixin引入
    import {PageMixin} from '@/mixins/pageMixin';

    // 第三方库引入

    // 静态配置引入

    // 公共组件引入
    import SysSubject from '@/components/SysSubject.vue';
    import TagTypeComp from '@/components/TagType.vue';

    // 公共类引入

    // 私有组件引入
    import TagListComp from './TagList.vue';
    import TagShopCar from './TagShopCar.vue';
    import TagInfo from './TagInfo.vue';

    // 私有类引入

    // 本地定义和声明
    interface TagType {
        label: string;
        tagCateType: number;
        children: Tag[];
    }

    interface Tag {
        id: number; // 主键ID
        tagCode: string; // 标签编码
        tagName: string; // 标签名称
        subjectId: number; // 主体ID
        tagClassify: number; // 标签类型
        tagDesc: string; //标签描述
        tagLogicDesc: string; //标签逻辑描述
        tagSecLevel: number; // 标签安全级
        tagStatus: number; // 标签状态
        modifiedTime: string; // 修改时间
        createdTime: string; // 创建时间
        coverNum: number; // 覆盖数
        [propName: string]: any;
    }

    interface TagFilter {
        [propName: string]: any;
    }

    interface Subject {
        id: number;
        subjectCn: string;
        subjectEn: string;
        subjectDesc: string;
        subjectSort: number;
    }

    interface SearchFilter {
        lastTagCateIdList?: Array<string>;
        isGrant?: number;
        tagClassify?: number;
        tagDataType?: number;
    }

    // 路由勾子
    Component.registerHooks(['beforeRouteLeave']);

    @Component({
        components: {
            SysSubject,
            TagTypeComp,
            TagListComp,
            TagShopCar,
            TagInfo
        }
    })
    export default class TagMarket extends Mixins(PageMixin) {
        @State(state => state.curSubject) curSubject!: Subject | null;

        private ShopCarVisible: boolean = false;

        private tagFilter: TagFilter[] = [];

        private tagList: Tag[] = [];

        private searchFilter: SearchFilter = {};

        private searchWord: string = '';
        private tableDialog: boolean = false;
        private loading: boolean = false;

        private shopcarCount: number = 0;

        private sortBy: number = 1;
        private sortList: any = [
            {
                label: '浏览',
                icon: 'icon el-icon-view',
                key: 1
            },
            {
                label: '群体引用',
                icon: 'icon el-icon-copy-document',
                key: 2
            },
            {
                label: '覆盖人数',
                icon: 'icon el-icon-user',
                key: 3
            }
        ];
        private sortOrder: number = 2;
        private tagId: any = false;
        private tagCode: string = "";

        private carSize: number = 0;

        private showType: string = 'item'; // item, table;

        @Watch('pageNo')
        private pageNoChange() {
            this.searchTag();
        }

        @Watch('pageSize')
        private pageSizeChange() {
            this.searchTag();
        }

        private eventId: Array<any> = [];

        private mounted() {
            this.addMonitor();
            this.init();

            const MyShop: any = this.$refs.MyShop;
            // MyShop.$refs.popper.style.bottom = '100px';
            // MyShop.$refs.popper.style.top = 'auto';
            // console.log(MyShop)
        }

        private addMonitor() {
            let id: number | null = null;
            id = this.$bus.$on('applyTagGrant', () => {
                this.searchTag();
            });
            this.eventId.push({
                id: id,
                event: 'applyTagGrant'
            });
            id = this.$bus.$on('checkTagInfo', (id: number) => {
                console.log(id);
                this.tableDialog = true;
                this.tagId = id;
                for (const i in this.tagList) {
                    if (this.tagList.hasOwnProperty(i)) {
                        const tag = this.tagList[i];
                        if (tag.id == this.tagId) {
                            this.tagCode = tag.tagCode;
                        }
                    }
                }
                // this.$router.push({
                //     name: 'tag-info',
                //     params: {
                //         tagCode: id.toString()
                //     }
                // });
            });
            this.eventId.push({
                id: id,
                event: 'checkTagInfo'
            });
        }

        private beforeDestroy() {
            this.eventId.forEach((event: any) => {
                this.$bus.$off(event.event, event.id);
            });
        }

        private init() {
            return '1';
        }

        private setOrder(sortBy: number, order?: number) {
            this.sortBy = sortBy;
            if(order){
                this.sortOrder = order;
            }else{
                this.sortOrder = this.sortOrder == 1 ? 2 : 1;
            }
            this.searchTag();
        }

        private searchTag() {
            if (!this.curSubject) {
                return;
            } else {
                const params = {
                    isSuperAdmin: 0,
                    sortBy: this.sortBy,
                    sortOrder: this.sortOrder,
                    subjectId: this.curSubject.id,
                    pageNum: this.pageNo,
                    pageSize: this.pageSize
                };

                Object.assign(params, this.searchFilter);

                if (this.searchWord && this.searchWord != '') {
                    Object.assign(params, {
                        keyword: this.searchWord.trim()
                    });
                }
                this.loading = true;
                this.tagPage(params).then((res: any) => {
                    this.loading = false;
                    this.tagList = res.list.slice(0);
                    this.total = res.total;
                }).catch(err => {
                    this.loading = false;
                });
            }
        }

        private selectShowType(type: string) {
            if (this.showType == type) {
                return;
            }
            this.showType = type;
        }

        // ========== ajax request  ==========

        private tagPage(params?: any) {
            return new Promise((resolve, reject) => {
                if (!this.curSubject) {
                    reject();
                } else {
                    const url = '/api/ava/tag/page';
                    const data = {};
                    Object.assign(data, params);
                    this.$api
                        .post(url, data)
                        .then(res => {
                            resolve(res);
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        }
    }
</script>
<style lang="scss" scoped>
    .subject-content-i {
        width: 45px;
        height: 45px;
        display: block;
        line-height: 45px;
        text-align: center;
        font-size: 22px;
        cursor: pointer;
        position: absolute;
        right: 5px;
        top: 2px;
    }

    .shop-car-content {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        box-shadow: 0px 0px 20px 0px rgba(62, 106, 246, 0.14);
        padding: 12px;
        position: fixed;
        bottom: 50px !important;
        right: 20px !important;
        transform-origin: center bottom;
        z-index: 2001;
    }

    .tag-market {
        width: 100%;
        height: 100%;
        background-color: #f9fafd;
        position: relative;
        overflow: hidden;

        .header {
            width: 100%;
            height: 60px;
            /*background-color: #fff;*/
            /*box-shadow: 0px 2px 4px 0px rgba(170, 170, 170, 0.5);*/
            display: flex;

            .subject-list {
                width: calc(100% - 300px);
                height: 64px;
            }

            .search-tag-btn {
                width: 350px;
                height: 60px;
                margin-right: 20px;
                float: right;
                display: flex;
                align-items: center;
            }
            /deep/.el-input__inner{
                background: none;
            }
        }

        .body {
            width: 100%;
            height: calc(100% - 118px);
            margin-top: 4px;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;

            .tag-list {
                flex: 1 1 auto;
                width: 100%;
                margin-top: 12px;
                /*display: flex;*/
                /*flex-direction: column;*/

                .tag-list-count-and-order {
                    width: 100%;
                    height: 26px;
                    position: relative;
                    /*flex: 0 0 auto;*/
                    /*display: flex;*/
                    /*justify-content: space-between;*/
                    /*align-items: center;*/

                    .tag-count {
                        font-size: 0.75rem;
                        color: rgba(153, 153, 153, 1);
                        line-height: 26px;

                        span {
                            margin-left: 5px;
                            color: rgba(57, 107, 246, 1);
                        }
                    }

                    .tag-order {
                        font-size: 0.75rem;
                        color: rgba(153, 153, 153, 1);
                        position: absolute;
                        right: 0;
                        top: 2px;
                        width: 300px;
                        display: flex;

                        .tag-order-item {
                            display: flex;
                            align-items: center;
                            margin-left: 20px;
                            cursor: pointer;

                            .icon {
                                margin-right: 5px;
                            }

                            .sort-btns {
                                margin-left: 5px;
                                display: flex;
                                flex-direction: column;
                                transform: scale(0.7, 0.7);
                                position: relative;
                                top: 1px;
                            }

                            .order-btn {
                                line-height: 10px;
                                cursor: pointer;
                                color: rgba(153, 153, 153, 1);

                                &.active {
                                    font-weight: bold;
                                    color: rgba(57, 107, 246, 1);
                                }
                            }

                            &.active {
                                font-weight: bold;
                                color: rgba(57, 107, 246, 1);
                            }

                            .mode-select {
                                /*width: 30px;*/
                                height: 26px;
                                display: inline-block;
                                line-height: 26px;
                                text-align: center;
                                /*margin-right: 10px;*/
                                color: rgba(57, 107, 246, 1);
                                /*background: rgba(255, 255, 255, 1);*/
                                border-radius: 4px;
                                cursor: pointer;
                                display: none;

                                &.active {
                                    display: block;
                                }
                            }
                        }
                    }
                }

                .tag-list-content {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
            }
        }

        .paginationa {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding-left: 20px;
            height: 50px;
            line-height: 50px;
            padding-top: 8px;
            z-index: 89;
            box-shadow:  0 0 8px 0 rgba(142,148,156,0.1);
        }

        .shop-car {
            position: fixed;
            bottom: 0;
            right: 20px;
            width: 80px;
            height: 50px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            background: #3E6AF6;
            z-index: 90;

            b {
                top: 6px;
                left: 17px;
                line-height: 14px;
                height: 16px;
                padding: 0 3px;
                background: #f00;
                position: absolute;
                border: 1px solid #fff;
                border-radius: 8px;
                font-size: 12px;
                font-weight: initial;
            }

            i {
                position: relative;
                top: 3px;
                width: 30px;
                height: 30px;
                font-size: 2rem;
                line-height: 30px;
                display: block;
                color: #fff;
            }

            span {
                color: #fff;
                padding: 0 4px;
            }

            &:hover{
                b{
                    animation: rotate .5s linear infinite;
                    animation-iteration-count:1;
                }
            }
            @keyframes rotate {
                0% {
                    transform: translateY(0) translateX(0);
                }
                25% {
                    transform: translateY(-5px) translateX(0);
                }
                50% {
                    transform: translateY(-10px) scale(1.5, 0.7) translateX(0);
                }
                85% {
                    transform: translateY(-5px) translateX(0);
                }
                100% {
                    transform: translateY(0)  translateX(0);
                }
            }
        }

        .tag-info-container {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
        }

        .select-item {
            margin-left: 10px;
            height: 30px;

            .el-button {
                background: none;
                position: relative;
                top: -2px;
                padding: 7px 10px;
                font-size: 18px;
            }
        }
    }
</style>
