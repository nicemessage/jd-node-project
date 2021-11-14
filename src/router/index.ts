import Vue from 'vue';
import VueRouter from 'vue-router';
import routerConfig from './config';

Vue.use(VueRouter);

const routes: any = [
    {
        path: '/',
        component: () => import('@/views/layout.vue'),
        children: routerConfig
    },
    {
        path: '/lost',
        component: () => import('@/views/lost.vue')
    },
	{
		path:'/userGrantTag',
		name:'usergranttag',
		component: () => import('@/views/userGrantTag.vue'),
	},
	{
		path:'/sysToken',
		name:'systoken',
		component: () => import('@/views/sysToken.vue'),
	},
	{
		path:'/roleGrant',
		name:'rolegrant',
		component: () => import('@/views/roleGrant.vue'),
	},
	{
		path:'/updateToken',
		name:'updatetoken',
		component: () => import('@/views/updateToken.vue'),
	},
    {
        path: '/iframe-crowd',
        component: () => import('@/views/iframe/crowd/crowd.vue')
    }
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
router.onError(error => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
        window.location.reload();
    } else {
        console.log(error);
    }
});
router.beforeResolve((to, from, next) => {
    if (to.matched.length == 0) {
        next('/lost');
        return;
    }
    if (to.meta && to.meta.needJoin) {
        if (router.app.$store.state.userInfo.erp) {
            if (to.name === 'file-upload' || to.name === 'cluster-crowd') {
                if (router.app.$store.state.userInfo.role === 'card') {
                    next('/no-auth');
                } else {
                    next();
                }
            } else {
                next();
            }
        } else {
            next();
        }
    } else {
        next();
    }
});
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
    return (originalPush.call(this, location) as any).catch((err: any) => err);
};
export default router;
