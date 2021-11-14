export default [
    {
        path: '/main',
        name: 'welcome',
        component: () => import('@/views/Welcome.vue')
    },
    {
        // 标签市场
        path: '/tag-market',
        name: 'tag-market',
        component: () => import('@/views/tag-market/TagMarket.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 标签详情
        path: '/tag-market/tag-info/:tagCode',
        name: 'tag-info',
        component: () => import('@/views/tag-market/TagInfo.vue')
    },
    {
        // 对接系统
        path: '/token-apply',
        name: 'token-apply',
        component: () => import('@/views/sys-manage/TokenApply.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 群体应用
        path: '/app-touch',
        name: 'app-touch',
        component: () => import('@/views/app-touch/AppTouch.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 群体管理
        path: '/crowd-manage',
        name: 'crowd-manage',
        component: () => import('@/views/crowd-manage/CrowdManage.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 群体详情
        path: '/crowd-manage/:crowdCode',
        name: 'crowd-info',
        component: () => import('@/views/crowd-manage/CrowdInfo.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 画像分析
        path: '/portrait-analysis',
        name: 'portrait-analysis',
        component: () => import('@/views/portrait-analysis/PortraitAnalysis.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 管理权限申请
        path: '/admin/apple',
        name: 'admin/apple',
        component: () => import('@/views/admin/apple/index.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 标签管理
        path: '/admin/tag-market',
        name: 'admin/tag-market',
        component: () => import('@/views/admin/tag-manage/tag-market/TagMarket.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 标签管理注册页面
        path: '/admin/tag-market/:tagId',
        name: 'admin/tag-register',
        component: () => import('@/views/admin/tag-manage/TagRegister.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 标签管理详情
        path: '/admin/tag-info/:tagCode',
        name: 'admin/tag-info',
        component: () => import('@/views/admin/tag-manage/tag-market/TagInfo.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 群体管理页面
        path: '/admin/crowd-manage',
        name: 'admin/crowd-manage',
        component: () => import('@/views/admin/crowd-manage/CrowdManage.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 群体详情
        path: '/admin/crowd-manage/:crowdCode',
        name: 'admin/crowd-info',
        component: () => import('@/views/admin/crowd-manage/CrowdInfo.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 触达管理页面&群体应用管理
        path: '/admin/app-touch',
        name: 'admin/app-touch',
        component: () => import('@/views/admin/app-touch/AppTouch.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        //画像分析模板
        path: '/admin/select-analysis',
        name: 'admin/select-analysis',
        component: () => import('@/views/admin/select-analysis/select-analysis.vue'),
        meta: {
            // keepAlive: true,
            needJoin: true
        }
    },
    {
        //画像分析模板
        path: '/admin/portrait-analysis',
        name: 'admin/portrait-analysis',
        component: () => import('@/views/admin/select-analysis/portrait-analysis.vue'),
        meta: {
            // keepAlive: true,
            needJoin: true
        }
    },
    {
        // 枚举管理
        path: '/admin/enums-admin',
        name: 'admin/enums-admin',
        component: () => import('@/views/admin/enums-admin/enums-admin.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 分类管理
        path: '/admin/class-admin',
        name: 'admin/class-admin',
        component: () => import('@/views/admin/class-admin/class-admin.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 数据源管理
        path: '/admin/data-source',
        name: 'admin/data-source',
        component: () => import('@/views/admin/data-source-admin/index.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 主体管理
        path: '/admin/subject-admin',
        name: 'admin/subject-admin',
        component: () => import('@/views/admin/subject-admin/index.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // ID池管理
        path: '/admin/id-pool',
        name: 'admin/id-pool',
        component: () => import('@/views/admin/id-pool/index.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 权限管理页面-token
        path: '/admin/token-apply',
        name: 'admin/token-apply',
        component: () => import('@/views/admin/sys-manage/TokenApply.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 数据查询
        path: '/admin/data-query',
        name: 'admin/data-query',
        component: () => import('@/views/admin/data-query/dataQuery.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 报警系统
        path: '/admin/alert-manage',
        name: 'admin/alert-manage',
        component: () => import('@/views/admin/alert-manage/AlertList.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 日志查询
        path: '/admin/log-query',
        name: 'admin/log-query',
        component: () => import('@/views/admin/data-query/logQuery.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        // 群体权限配置
        path: '/admin/empower',
        name: 'admin/empower',
        component: () => import('@/views/admin/empower/index.vue'),
        meta: {
            keepAlive: false,
            needJoin: true
        }
    },
    {
        path: '/no-auth',
        name: 'no-auth',
        component: () => import('@/views/NoAuth.vue')
    },
];
