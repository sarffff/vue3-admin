<script setup lang="ts">
import { ref } from 'vue';
import waterball from './waterball.vue';
let peopleNumber = ref('216908人')
</script>

<template>
    <div class="content">
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="num">可预约人数:<span>1000</span>人</p>
        </div>
        <div class="number">
            <span v-for="(item, index) in peopleNumber" :key="index" class="num">{{ item }}</span>
        </div>
        <div class="charts">
            <waterball class="waterball"></waterball>
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

        .num {
            float: right;
            color: #fff;
            margin-right: 10px;
            font-size: 18px;

            span {
                color: aqua;
            }
        }
    }

    .number {
        margin: 30px 20px 0 20px;
        display: flex;

        span {
            flex: 1;
            height: 50px;
            text-align: center;
            line-height: 50px;
            background: url(../../images/total.png) no-repeat center center fixed;
            background-size: 100% 100%;
            color: #29fcff;
            font-size: 30px;
            font-weight: bolder;
        }
    }

    .charts {
        height: 260px;
    }
}
</style>