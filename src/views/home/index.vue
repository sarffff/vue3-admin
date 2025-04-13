<script setup lang="ts">
import { useUserStore } from '@/stores'
import { computed } from 'vue'

const userStore = useUserStore()

// 动态问候语
const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) return '早上好'
    if (hour >= 11 && hour < 13) return '中午好'
    if (hour >= 13 && hour < 18) return '下午好'
    return '晚上好'
})
</script>


<template>
    <el-card>
        <div class="form">
            <el-avatar :src="userStore.userInfo.avatar" :size="200"></el-avatar>
            <div class="title">
                <h3>{{ greeting }}{{ userStore.userInfo.name }}</h3>
                <h4>欢迎来到硅谷甄选运营平台</h4>
            </div>
        </div>
    </el-card>
    <SvgIcon iconName="pre-welcome" ></SvgIcon>
</template>

<style scoped lang="scss">
.form {
    display: flex;
    .title{
        margin: 50px 0 0 50px;
        h3{
            font-size: 22px;
        }
        h4{
            margin-top: 50px;
            font-size: 24px;
        }
    }
}
.svg-icon{
    height: 500px;
    width: 800px;
    margin-left: 400px;
}
</style>