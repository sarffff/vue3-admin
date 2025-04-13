import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  // ✅ 已登录用户不能访问 login 页面
  if (to.path === '/login' && token) {
    return next('/')
  }

  // ✅ 没登录，只能访问 login 页面
  if (!token && to.meta.requiresAuth) {
    return next('/login')
  }
  if (!token && to.meta.requiresAuth) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath } // 带上原始跳转地址
    })
  }

  // ✅ 其他情况正常放行
  next()
})

export default router
