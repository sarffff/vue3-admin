<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push('/home')
}
</script>

<template>
    <div class="not-found">
        <div class="content">
            <h1>404</h1>
            <p>页面不存在</p>
            <button @click="goHome">返回首页</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.not-found {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse at center, #0a1f44 0%, #000d2b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

    .content {
        text-align: center;

        h1 {
            font-size: 120px;
            font-weight: bold;
            color: #3aa1ff;
            margin: 0;
        }

        p {
            font-size: 20px;
            margin: 20px 0;
            color: #ccc;
        }

        button {
            margin-top: 20px;
            padding: 10px 30px;
            background-color: #3aa1ff;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: 0.3s;

            &:hover {
                background-color: #1e90ff;
            }
        }
    }
}
</style>
