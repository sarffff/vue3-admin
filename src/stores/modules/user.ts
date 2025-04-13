import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { constantRoutes, asyncRoutes } from '@/router/routes';
import router from "@/router";
import type { RouteRecordRaw } from 'vue-router';

export const useUserStore = defineStore('user', () => {
    let token = ref<string>('');
    let userInfo = reactive<Record<string, any>>({});
    const menuRoutes = ref<RouteRecordRaw[]>([...constantRoutes]);

    const setToken = (newToken: string): void => {
        token.value = newToken;
        localStorage.setItem('token', newToken);
    };

    const setUserInfo = (newUserInfo: Record<string, any>): void => {
        Object.assign(userInfo, newUserInfo);
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    };

    const removeToken = (): void => {
        token.value = '';
        localStorage.removeItem('token');
    };

    const removeUserInfo = (): void => {
        Object.keys(userInfo).forEach(key => delete userInfo[key]);
        localStorage.removeItem('userInfo');
    };

    const isAuthenticated = () => {
        return !!token.value;
    };

    // 用于递归过滤权限路由
    function filterAsyncRoutes(routes: any[], allowedNames: string[]) {
        return routes
            .filter(route => allowedNames.includes(route.name!))
            .map(route => {
                const r = { ...route };
                if (r.children) {
                    r.children = filterAsyncRoutes(r.children, allowedNames);
                }
                return r;
            });
    }

    const generateRoutes = () => {
        const allowedNames = userInfo.routes || []; // 假设 userInfo.routes 是字符串数组
        const filteredRoutes = filterAsyncRoutes(asyncRoutes, allowedNames);

        // 注册到 router
        filteredRoutes.forEach(route => {
            router.addRoute(route); // 注意只能 add 一级 route，子路由自动包含
        });

        // 添加到菜单中展示（如果你有）
        menuRoutes.value.push(...filteredRoutes);
    };
    return {
        token,
        userInfo,
        menuRoutes,
        setToken,
        removeToken,
        setUserInfo,
        removeUserInfo,
        isAuthenticated,
        generateRoutes
    };
});
