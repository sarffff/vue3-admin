<script setup lang="ts">
import agepie from './agepie.vue';
</script>

<template>
    <div class="content">
        <div class="top">
            <p class="title">年龄分布</p>
            <p class="bg"></p>
        </div>
        <div class="echarts">
            <agepie></agepie>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content {
    background: url(../../images/dataScreen-main-lb.png) no-repeat center center fixed;
    background-size: 100% 100%;
    margin-top: 10px;
    .top {
        margin-top: 10px;

        .title {
            color: #fff;
            font-size: 20px;
        }

        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/dataScreen-title.png) no-repeat center center fixed;
            background-size: 100% 100%;
            margin: 10px 0 0 10px;
        }
    }
    .echarts{
       height: 260px;
    }
}
</style>