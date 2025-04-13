<script lang="ts" setup>
import statbar from './statbar.vue';
</script>

<template>
    <div class="stat">
        <span>预计渠道数据统计</span>
        <p class="bg"></p>
        <statbar class="statbar"></statbar>
    </div>
</template>

<style lang="scss" scoped>  
.stat{
    span{
        color: #fff;
        font-size: 20px;
        padding: 10px 10px 0 0;
    }
    .bg{
        width: 70px;
        height: 7px;
        background: url(../../images/dataScreen-title.png) no-repeat center center fixed;
        background-size: 100% 100%;
        margin: 10px 0 0 10px;
    }
    .statbar{
        height: 200px;
    }
}
</style>