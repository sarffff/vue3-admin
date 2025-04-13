//路由鉴权
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from './stores'
const userStore = useUserStore();
//全局前置守卫
router.beforeEach((to, from, next) => {
    const isAuthenticated = userStore.isAuthenticated // 建议使用计算属性

    // 设置页面标题
    document.title = '硅谷甄选' + `${to.meta.title} | 系统名称`

    // 登录页特殊处理
    if (to.path === '/login') {
        // 已登录用户访问登录页
        if (isAuthenticated()) {
            next({ path: '/' })
            return
        }
        // 正常访问登录页
        next()
        return
    }

    // 需要认证的页面
    if (to.meta.requiresAuth) {
        // 未登录状态
        if (!isAuthenticated) {
            next({
                path: '/login',
                query: { redirect: to.path }
            })
            return
        }
    }
    NProgress.start()
    next()
})

//全局后置守卫
router.afterEach((to, from) => {
    NProgress.done()
})  