<script setup lang="ts">
import { onMounted, ref } from 'vue'
import rankbar from './rankbar.vue';
</script>

<template>
    <div class="rank">
        <span>热门景点排名</span>
        <p class="bg"></p>
        <div class="charts">
            <div class="title">
                <span>排名</span>
                <span>景点</span>
                <span>游客量</span>
            </div>
            <rankbar class="rankbar"></rankbar>
        </div>    
    </div>
</template>
<style scoped>
.rank {
    span {
        color: #fff;
        font-size: 20px;
        padding: 10px 10px 0 0;
    }

    .bg {
        width: 70px;
        height: 7px;
        background: url(../../images/dataScreen-title.png) no-repeat;
        background-size: 100% 100%;
        margin: 1vh 0 0 1vw;
    }
    .charts {
        width: 100%;
        height: 300px;
        margin: 2vh 0;
        .title{
            height: 50px;
            background: url(../../images/rankingChart-bg.png) no-repeat;
            background-size: 100% 100%;
            line-height: 50px;
            margin: 10px 10px;
            span{
                color: #FE9900;
                font-size: 18px;
                padding: 0 20px 0 25px;
            }
        }
        .rankbar{
            width: 100%;
            height: 100%;
        }
    }
}
</style>