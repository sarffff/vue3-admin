<script setup lang="ts">
import genderbar from './genderbar.vue';
</script>

<template>
    <div class="sexcontent">
        <div class="top">
            <p class="title">男女比例</p>
            <p class="bg"></p>
        </div>
        <div class="content">
            <div class="image">
                <div class="man">
                    <span>男士</span>
                    <img src="../../images/man.png" alt="">
                </div>
                <div class="woman">
                    <span>女士</span>
                    <img src="../../images/woman.png" alt="">
                </div>
            </div>
            <genderbar class="genderbar" :male-percent="60" :female-percent="40"></genderbar>
        </div>
    </div>
</template>

<style scoped lang="scss">
.sexcontent {
    background: url(../../images/dataScreen-main-lb.png) no-repeat center center fixed;
    background-size: 100% 100%;
    margin-top: 20px;
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
    .content{
        position: relative;
        top: 15%;
        left: 25%;
        height: 120px;
        width: 250px;
        .image{
            display: flex;
            gap: 30px;
            height: 100%;
            .man{
                width: 100px;
                background: url(../../images/man-bg.png) no-repeat center center fixed;
                background-size: 100% 100%;
                span{
                    position: absolute;
                    left: 1.7vw;
                    color: #fff;
                }
                img{
                    position: absolute;
                    left: 0.8vw;
                    top: 25%;
                    width: 70px;
                }
            }
            .woman{
                position: relative;
                width: 100px;
                background: url(../../images/woman-bg.png) no-repeat center center fixed;
                background-size: 100% 100%;
                span{
                    position: absolute;
                    left: 1.7vw;
                    color: #fff;
                }
                img{
                    position: absolute;
                    left: 0.8vw;
                    top: 25%;
                    width: 70px;
                }
            }
        }
        .genderbar{
            height: 50px;
            width: 95%;
        }
    }
}
</style>