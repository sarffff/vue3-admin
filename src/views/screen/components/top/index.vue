<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'

let time = ref(new Date())
let timer: any = null

const formatTime = () => {
  return dayjs(time.value).format('YYYY年MM月DD日 HH:mm:ss')
}

onMounted(() => {
  timer = setInterval(() => {
    time.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>


<template>
    <div class="top">
        <div class="top-left">
            <span class="tltitle" @click="$router.push('/home')">首页</span>
        </div>
        <div class="top-center">
            <div class="tctitle">智慧旅游可视化大数据平台</div>
        </div>
        <div class="top-right">
            <span class="trtitle">统计报告</span>
            <span class="time">{{ formatTime() }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.top{
    display: flex;
    .top-left{
        flex: 1;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat center center;
        background-size: cover;
        .tltitle{
            width: 150px;
            height: 40px;
            float: right;
            background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat center center;
            background-size: cover;
            text-align: center;
            line-height: 40px;
            color: #29fcff;
            font-size: 20px;
            cursor: pointer;
        }
    }
    .top-center{
        flex: 2;
        .tctitle{
            width: 100%;
            height: 74px;
            background: url(../../images//dataScreen-header-center-bg.png) no-repeat center center;
            background-size: 100% 100%;
            text-align: center;
            line-height: 74px;
            color: #29fcff;
            font-size: 34px;
        }
    }
    .top-right{
        flex: 1;
        background: url(../../images//dataScreen-header-right-bg.png) no-repeat center center;
        background-size: cover;
        .trtitle{
            width: 150px;
            height: 40px;
            float: left;
            background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat center center;
            background-size: cover;
            text-align: center;
            line-height: 40px;
            color: #29fcff;
            font-size: 20px;
        }
        .time{
            height: 40px;
            text-align: center;
            line-height: 40px;
            margin-left: 2vw;
            color: #29fcff;
            font-size: 20px;
        }
    }
}
</style>