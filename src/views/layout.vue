<template>
    <div class="main" v-loading="loading" element-loading-text="加载中">
        <div class="tag-header" v-if="notIframe">
            <img :src="require(`@/assets/img/tag-logo.png`)" class="logo">
            <div class="tag-header-logout" @click="logout">注销登录</div>
        </div>
        <el-container class="tag-wapper" :class="notIframe?'tag-wapper-top':''">
            <aside-menu></aside-menu>
            <el-main
                v-loading="false"
                element-loading-custom-class="layout-load"
                element-loading-text="Loading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255,0.9)"
            >
    <!--            <transition name="slide-fade">-->
    <!--                <keep-alive>-->
    <!--                    <router-view></router-view>-->
    <!--                </keep-alive>-->
    <!--            </transition>-->
                <transition name="slide-fade">
                    <router-view></router-view>
                </transition>
            </el-main>
            <WaterMark />
        </el-container>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
// import { mapGetters } from 'vuex';
import AsideMenu from '@/components/AsideMenu.vue';
import WaterMark from "@/components/WaterMark.vue";
@Component({
    components: {
        AsideMenu,
        WaterMark
    },
    // computed: mapGetters(['loadingSate'])
})
export default class Layout extends Vue {
    private loading:boolean = false;
    private eventId: Array<{ id:number, event: string}> = [];

    private mounted() {
        const id = this.$bus.$on('main-loading', (type:boolean) => {
            this.loading = type;
        });
        this.eventId.push({
            id: id,
            event: 'main-loading'
        });
        this.$api.get('/api/ava/token/getErpUserDetail').then((res: any) => {
            try {
                window.sessionStorage.setItem('userErp', res.erpName);
            } catch (e) {
                console.log(e);
            }
        });
    }

    private beforeDestroy(){
        this.eventId.forEach( (ev:{ id:number, event: string}) => {
            this.$bus.$off(ev.event, ev.id);
        })
    }

    get heightCont(){
        if(this.notIframe){
            return 'calc(100% - 60px)';
        }
        return '100%';
    }

    get notIframe() {
        try{
            if(window.location.href == top.location.href){
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    private logout() {
       location.href='http://uas-web.ql/logout?return_url='+location.href
    }
}
</script>
<style lang="scss" scoped>
.main{
    position: absolute;
    top:0;
    left: 0;
    bottom: 0;
    right:0;
}

/deep/.el-loading-spinner .circular{
    width: 60px;
    height: 60px;
    animation: loading-rotate 2s linear infinite;
    display: none;
}
/deep/.el-loading-spinner {
    background: url('~@/assets/img/loading-chart.gif') no-repeat;
    background-size: 60px 60px;
    position: relative;
    width: 60px;
    padding-top: 42px;
    top: 50%;
    left: 50%;
    margin-left: -30px;
    margin-top: -30px;
}
/deep/.el-loading-text{
    color:#333!important;
    font-size: 12px;
}
.tag-header{
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #f0f1f7;
    position: relative;
    box-shadow: 0 0 5px #f0f1f7;
    .logo{
        height: 30px;
        position: absolute;
        left: 15px;
        top: 15px;
    }
    &-logout{
        position: absolute;
        right:0;
        top:0;
        height: 60px;
        line-height: 60px;
        padding: 0 30px;
        cursor: pointer;
        &:hover {
            color: #3E6AF6;
        }
    }
}
.tag-wapper {
    min-width: 100%;
    height: 100%;
    overflow-y: auto;
}
.tag-wapper-top {
    height: calc(100% - 60px);
}
.slide-fade {
    position: absolute;
    left: 0;
    right: 0;
}
.slide-fade-enter-active {
    transition: all 0.6s ease;
}
.slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(2, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
    left: 0;
    right: 0;
    opacity: 0;
}
</style>
