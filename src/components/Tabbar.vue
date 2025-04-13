<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { reqLogout } from '@/api/user'
const userStore = useUserStore()
const router = useRouter()
let Icon = ref(false)
let isCollapse = ref<Boolean>(false)
const emit = defineEmits(['foldSlider'])
const transCollapse = () => {
    emit('foldSlider', isCollapse.value)
}
const changeIcon = () => {
    Icon.value = !Icon.value
    transCollapse()
}
import { useRoute } from 'vue-router'
const route = useRoute()

const fullScreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        document.documentElement.requestFullscreen()
    }
}
const logout = async () => {
    const res = await reqLogout()
    if (res.code === 200) {
        userStore.removeToken()
        userStore.removeUserInfo()
        router.replace('/login')
        ElMessage.success('退出成功')
    }
}
let drawer = ref<boolean>(false)
let darkMode = ref<boolean>(false)
let color = ref<string>('red')
const changeColor = () => {
    let html: HTMLElement = document.querySelector('html') as HTMLElement
    darkMode.value ? html.className = 'dark' : html.className = ''
}
const changeTheme = (val: string) => {
    console.log(val)
    let html: HTMLElement = document.querySelector('html') as HTMLElement
    // 设置 css 变量
    html.style.setProperty('--el-color-primary', val)
}
</script>

<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <el-icon size="24" @click="changeIcon">
                <component :is="!Icon ? 'Fold' : 'Expand'" />
            </el-icon>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(item, index) in route.matched" :key="index" :to="{ path: item.path }"
                    v-show="item.meta.title">
                    <el-icon>
                        <component :is="item.meta.icon" />
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>

        </div>
        <div class="tabbar_right">
            <el-button type="primary" plain size="large" icon="Refresh" circle></el-button>
            <el-button type="primary" plain size="large" icon="FullScreen" circle @click="fullScreen"></el-button>
            <el-button type="primary" plain size="large" icon="Setting" circle @click="drawer = true"></el-button>
            <img :src="userStore.userInfo.avatar" alt="">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ userStore.userInfo.name }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <el-drawer v-model="drawer" title="主题设置" :append-to-body="true" size="20%">
        <el-form label-width="100px">
            <el-form-item label="主题颜色">
                <el-color-picker v-model="color" show-alpha @change="changeTheme"></el-color-picker>
            </el-form-item>
            <el-form-item label="暗黑模式">
                <el-switch v-model="darkMode" active-color="#13ce66" inactive-color="#ff4949"
                    @change="changeColor"></el-switch>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .tabbar_left {
        display: flex;
        align-items: center;
        margin-left: 20px;

        .el-icon {
            margin-right: 10px;
        }

        .el-breadcrumb__item {
            height: 18px;
        }

        .el-breadcrumb__item .el-icon {
            font-size: 20px
        }

        .el-breadcrumb__item span {
            font-size: 16px;
            position: relative;
            top: -2px;
        }
    }

    .tabbar_right {
        display: flex;
        align-items: center;

        img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin: 0 10px 0 20px;
        }

        .el-dropdown {
            margin-right: 5px;
        }
    }
}
</style>