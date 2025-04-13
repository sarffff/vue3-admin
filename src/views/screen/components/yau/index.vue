<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import yaubar from './yaubar.vue';
</script>

<template>
    <div class="yau">
        <span>年度游客量对比</span>
        <p class="bg"></p>
        <yaubar></yaubar>
    </div>
</template>

<style lang="scss" scoped>  
.yau{
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
}
</style>