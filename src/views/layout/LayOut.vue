<script setup lang="ts">
import logo from './logo';
import SliderBar from '@/components/SliderBar.vue';
import Tabbar from '@/components/Tabbar.vue';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores';
import { reqUserInfo } from '@/api/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const isCollapse = ref(false);

const changeCollapse = () => {
    isCollapse.value = !isCollapse.value;
};

// 获取用户信息并生成动态路由
const initUser = async () => {
    try {
        const { data } = await reqUserInfo();
        userStore.setUserInfo(data);

        // 重要：在用户信息设置之后再调用生成路由的方法
        userStore.generateRoutes();

        const redirect = router.currentRoute.value.query.redirect || '/';
        router.replace(redirect as string);
    } catch (error) {
        console.error('用户信息获取失败', error);
        // 可选：跳转登录或其他处理
    }
};

onMounted(() => {
    initUser();
});
</script>


<template>
    <div class="layout_container" :class="{ collapsed: isCollapse }">
        <div class="layout_slider">
            <div class="logo">
                <img src="@/assets/images/logo.png" alt="Logo">
                <span v-if="!isCollapse">{{ logo.title }}</span>
            </div>
            <slider-bar :isCollapse="isCollapse"></slider-bar>
        </div>
        <div class="layout_tabbar">
            <tabbar @foldSlider="changeCollapse"></tabbar>
        </div>
        <div class="layout_main">
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
    display: flex;
    transition: all 0.3s ease-in-out;

    /* 侧边栏 */
    .layout_slider {
        position: fixed;
        width: 260px;
        height: 100vh;
        background-color: #001529;
        transition: width 0.3s ease-in-out;

        .logo {
            display: flex;
            align-items: center;
            height: 50px;
            padding: 10px;
            overflow: hidden;

            img {
                width: 40px;
                height: 40px;
                transition: all 0.3s ease-in-out;
            }

            span {
                color: #fff;
                font-size: 22px;
                font-weight: bold;
                padding-left: 10px;
                white-space: nowrap;
                transition: opacity 0.3s ease-in-out;
            }
        }
    }

    /* 折叠后侧边栏宽度变小 */
    &.collapsed .layout_slider {
        width: 100px;
    }

    /* 折叠后隐藏文字 */
    &.collapsed .logo span {
        opacity: 0;
    }

    /* 让顶部导航栏自动适应 */
    .layout_tabbar {
        position: fixed;
        top: 0;
        left: 260px;
        width: calc(100% - 260px);
        height: 50px;
        transition: left 0.3s ease-in-out;
        background: linear-gradient(to right, #eaedf1, #d0e2f1, #a8c8e8);
        background-size: 400% 400%;
        /* 让渐变的范围更大，能让动画效果更明显 */
        animation: gradientAnimation 3s ease infinite;
        /* 动画效果 */
        padding: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        /* 可选 */
    }

    // 渐变动画
    @keyframes gradientAnimation {
        0% {
            background-position: 0% 50%;
        }

        50% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0% 50%;
        }
    }

    &.collapsed .layout_tabbar {
        left: 80px;
        width: calc(100% - 80px);
    }

    /* 主要内容区 */
    .layout_main {
        position: absolute;
        top: 50px;
        left: 260px;
        width: calc(100% - 260px);
        height: calc(100% - 50px);
        background: linear-gradient(to right, #eaedf1, #d0e2f1, #a8c8e8);
        padding: 20px;
        overflow-y: auto;
        transition: left 0.3s ease-in-out, width 0.3s ease-in-out;
    }

    &.collapsed .layout_main {
        left: 80px;
        width: calc(100% - 80px);
    }
}

.layout_container :deep(.el-sub-menu__icon-arrow) {
    transition: opacity 0.3s ease-in-out;
}

.layout_container.collapsed :deep(.el-sub-menu__icon-arrow) {
    display: none;
}

/* 让菜单展开时的过渡动画更丝滑 */
.el-menu {
    transition: width 0.3s ease-in-out;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
