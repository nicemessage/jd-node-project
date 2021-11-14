<template>
    <div class="aside-menu" :class="{ 'collapse': isCollapse }">
        <header class="title" :class="{ 'collapse': isCollapse }">
            <div class="context" v-show="!isCollapse" @click="toHome">
                <span v-if="notIframe">
                    功能菜单
                </span>
                <span v-else>
                    AgileTag
                </span>
            </div>
            <div class="collapse-btn" @click="isCollapse = !isCollapse">
                <i class="el-icon-s-fold icon" v-if="!isCollapse"></i>
                <i class="el-icon-s-unfold icon" v-else></i>
            </div>
        </header>
        <div class="menu-wrapper">
            <template v-if="!isCollapse">
                <div style="overflow: auto;height: 100%">
                    <div class="menu-item" :class="{'active': highlightItem == item.url}" v-for="(item, index) of menuData" :key="`menu-${index}`">
                        <!--                    <i class="iconfont">{{ item.icon }}</i>-->
                        <div class="menu-item-label" @click="openMenuItem(index)">
                            <svg-icon :icon-class="iconMap[item.name] ? iconMap[item.name]: 'token-apply'" />
                            <span class="context">{{ item.name }}</span>
                        </div>
                        <template v-if="item.children">
                            <div class="menu-item-children" v-show="item.open">
                                <div class="menu-item-children-item" :class="{'active': highlightItem == _item.url}" v-for="(_item, _index) of item.children" :key="`submenu-${_index}`" @click="go(_item.url)">
                                    <div class="menu-item-children-item-label">
                                        <div class="circle"></div>
                                        <span>{{ _item.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="menu-item min" :class="{'active': highlightItem == item.url}" v-for="(item, index) of menuData" :key="`menu-${index}`" @mouseover="item.show = true" @mouseout="item.show = false">
                    <svg-icon :icon-class="iconMap[item.name] ? iconMap[item.name]: 'token-apply'" />
                    <div class="menu-item-children min" v-show="item.show">
                        <div v-if="!item.children" class="menu-item-children-item" @click="go(item.url)">
                            <div class="menu-item-children-item-label">{{item.name}}
                            </div>
                        </div>
                        <template v-if="item.children">
                            <div class="menu-item-children-item" v-for="(_item, _index) of item.children" :key="`submenu-${_index}`" @click="go(_item.url)">
                                <div class="menu-item-children-item-label">
                                    {{ _item.name }}
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
// import Template from '@/Template.vue';

@Component({})
export default class AsideMenu extends Vue {
    private routerName = '';
    private isCollapse = false;
    private menuData = [];

    private whiteList: Array<string> = ['welcome', 'no-auth'];
    private subPage = new Map([['tag-info', 'tag-market'], ['crowd-info', 'crowd-manage']]);

    private iconMap: any = {
        标签市场: 'icon1',
        群体创建: 'icon2',
        群体管理: 'icon3',
        画像分析: 'icon4',
        群体应用: 'icon5',
        对接系统: 'icon6',
        帮助文档: 'icon7',
        运营管理: 'icon8',
        系统管理: 'icon9',
    };

    @Watch('$route', {
        immediate: true,
        deep: true,
    })
    private handler(val: any): void {
        // this.routerName = val.path.split('/')[1];
        this.routerName = `/${val.path.split('/')[1]}`;
    }

    get current() {
        return this.$route.name;
    }

    get notIframe() {
        try {
            if (window.location.href == top.location.href) {
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    get highlightItem() {
        if (this.subPage.has(this.current!)) {
            return `/${this.subPage.get(this.current!)}`;
        }
        return `/${this.current}`;
    }

    private mounted() {
        this.initMenu().then((res: any) => {
            // console.log(res);
            if(!Object.keys(res).length){
                window.parent.postMessage({
                    status: 'go',
                    url: '/401/tag'
                }, "*");
            }else if (!res.ava) {
                // this.menuData = [];
                this.toHome();
            } else {
                // res.ava.push({name: "群体权限配置", url: "/admin/empower"})
                res.ava.forEach((t: any) => {
                    t.show = false;
                    t.open = false;
                });

                // const system = res.ava.find((item: any) => {
                //     return item.name == '系统管理';
                // });
                // if (system && system.children) {
                //     system.children.push({
                //         name: '监控预警',
                //         url: '/admin/alert-manage',
                //     });
                // }
                this.menuData = res.ava;
                // if(res.admin){
                //     const admin:any = JSON.parse(JSON.stringify(res.admin));
                //     for(const i:any in admin){
                //         admin[i].url = `/admin${res.admin[i].url}`;
                //     }
                //     this.menuData = res.ava.concat(
                //         [
                //             {
                //                 icon: "",
                //                 name: "运营管理",
                //                 open: true,
                //                 show: false,
                //                 url: "",
                //                 children: admin
                //             }
                //         ]
                //     );
                // } else
                //     {
                //     this.menuData = res.ava.concat(
                //         [
                //             {
                //                 icon: "",
                //                 name: "运营管理",
                //                 open: true,
                //                 show: false,
                //                 url: "/admin/apple"
                //             }
                //         ]
                //     );
                // }
                this.valid();
            }
        });
    }

    private toHome() {
        this.$router.push({
            name: 'tag-market',
        });
    }

    private valid() {
        const path = this.$route.path;
        const name = this.$route.name;

        // console.log(path, name);

        let _valid = false;

        // 白名单内容校验
        this.whiteList.forEach((item: string) => {
            if (item == path || item == name) {
                _valid = true;
            }
        });

        if (_valid) {
            return;
        }

        let list: any[] = this.menuData.slice(0);
        let next: any[] = [];

        while (list.length > 0) {
            const item = list.pop();
            if (item.url) {
                // console.log(item, item.url, item.url == name, item.url == path, item.url == name || item.url == path);
                if (item.url == name || path.indexOf(item.url) == 0) {
                    // console.log(item);
                    _valid = true;
                }
            }
            if (item.children) {
                next = next.concat(item.children);
            }
            if (list.length == 0 && next.length > 0) {
                list = next.slice(0);
                next = [];
            }
        }

        if (_valid) {
            return;
        }
        if (path == '/') {
            this.$router.push({
                name: 'tag-market',
            });
            return;
        }
        location.href = '/lost?to=true';
        // this.$alert('当前用户无访问页面权限，请联系管理员添加权限。', '提示', {
        //     confirmButtonText: '确定',
        //     callback: action => {
        //         this.$router.push({
        //             name: 'tag-market'
        //         });
        //     }
        // });
    }

    private openMenuItem(idx: number) {
        for (let i = 0; i < this.menuData.length; i++) {
            if (i == idx) {
                (this.menuData[i] as any).open = !(this.menuData[i] as any).open;
            } else {
                // 当前菜单内容较少，不需要关闭
                // this.menuData[i].open = false;
            }
        }
        if (!(this.menuData[idx] as any).children) {
            this.go((this.menuData[idx] as any).url);
        }
    }

    private go(path: string) {
        if (!path) {
            return false;
        } else if (path.indexOf('http') !== -1) {
            window.open(path);
            return true;
        } else if (path[0] != '/') {
            return false;
        } else {
            this.$router.push({
                path: path,
                query: {
                    t: JSON.stringify(+new Date()),
                },
            });
        }
    }

    // ========== ajax request  ==========

    private initMenu() {
        return new Promise((resolve, reject) => {
            const url = '/api/ava/menu/init';
            const data = {};
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

<style scoped lang="scss">
.aside-menu {
    width: 200px;
    height: 100%;
    /*overflow-y: auto;*/
    background: rgba(255, 255, 255, 1);
    flex-shrink: 0;
    border-right: 1px solid #eaf0f9;
    &.collapse {
        width: 50px;
    }
}

.title {
    width: 100%;
    height: 49px;
    padding-left: 24px;
    padding-right: 0;
    color: rgba(51, 51, 51, 1);
    font-size: 16px;
    @include align-center;
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);
    justify-content: space-between;

    border-bottom: 1px solid #eaf0f9;

    .context {
        font-family: PingFangSC-Medium;
        font-size: 1rem;
        line-height: 1.5rem;
        cursor: pointer;
        @include align-center;
        white-space: nowrap;
        font-weight: bold;

        img {
            margin-right: 14px;
        }
    }

    .collapse-btn {
        width: 49px;
        height: 49px;
        text-align: center;
        line-height: 49px;
        cursor: pointer;
        &:hover {
            background: #f0f0fa;
        }
    }

    i {
        cursor: pointer;
    }

    &.collapse {
        padding: 0;
    }
}

.menu-wrapper {
    width: 100%;
    height: calc(100% - 50px);
    /*overflow: auto;*/
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 3;

    .menu-split-line {
        width: 100%;
        height: 1px;
    }

    .menu-item {
        width: 100%; // min-height: 48px;
        line-height: 48px;
        box-sizing: border-box;

        /*padding: {*/
        /*    left: 16px;*/
        /*    right: 16px;*/
        /*}*/
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        color: rgba(0, 0, 0, 0.85);
        cursor: pointer;

        &.active {
            background: rgba(186, 195, 249, 0.2);

            .menu-item-label {
                color: #3e6af6;
            }
        }

        &.min {
            width: 50px;
            height: 50px;
            padding: 0;
            position: relative;
            z-index: 5;

            display: flex;
            justify-content: center;
            align-items: center;
        }

        &-label {
            width: 100%;
            padding-left: 25px;

            &:hover {
                background: rgba(186, 195, 249, 0.2);
            }

            .context {
                margin-left: 10px;
            }
        }

        &-children {
            width: 100%;
            /*display: flex;*/
            /*flex-direction: column;*/
            min-height: 36px;
            line-height: 36px;

            &-item {
                width: 100%;
                height: 36px;
                font-size: 0.875rem;

                padding: {
                    /*top: 8px;*/
                    /*bottom: 8px;*/
                    right: 8px;
                    left: 49px;
                }

                &:hover {
                    background: rgba(186, 195, 249, 0.2);
                }

                &-label {
                    color: rgba(0, 0, 0, 0.65);
                    display: flex;
                    align-items: center;
                }

                .circle {
                    width: 6px;
                    height: 6px;
                    background-color: transparent;
                    border: 1px solid rgba(0, 0, 0, 0.65);
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 10px;
                    margin-top: 15px;
                    margin-bottom: 15px;
                }

                &.active {
                    background: rgba(186, 195, 249, 0.2);
                    /*color: #2c68ff;*/
                    color: #3e6af6;

                    .menu-item-children-item-label {
                        color: #3e6af6;
                    }

                    .circle {
                        background-color: #3e6af6;
                        border-color: #3e6af6;
                    }
                }
            }

            &.min {
                background-color: #fff;
                position: absolute;
                top: 0;
                width: auto;
                left: 50px;
                z-index: 6;
                display: flex;
                flex-direction: column;
                box-shadow: 2px 2px 5px #f0f1f7;

                .menu-item-children-item {
                    width: 120px;
                    height: 50px;
                    line-height: 50px;
                    font-size: 0.75rem;

                    padding: {
                        left: 10px;
                        right: 10px;
                    }

                    &:hover {
                        background: rgba(186, 195, 249, 0.2);
                    }
                }
            }
        }
    }
}
</style>
