<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import TOP from './components/top/index.vue'
import TOURIST from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Yau from './components/yau/index.vue'
import Stat from './components/stat/index.vue'
let screen = ref();
let screenWidth = ref(0);
let screenHeight = ref(0);
const getScreenSize = (w = 1920, h = 1080) => {
    screenWidth.value = window.innerWidth / w
    screenHeight.value = window.innerHeight / h
    return screenHeight.value > screenWidth.value ? screenWidth.value : screenHeight.value
}
onMounted(() => {
    screen.value = document.querySelector('.screen')
    screen.value.style.transform = `scale(${getScreenSize()}) translate(-50%,-50%)`
})
window.addEventListener('resize', () => {
    screen.value.style.transform = `scale(${getScreenSize()}) translate(-50%,-50%)`
})
</script>

<template>
    <div class="container">
        <div class="screen">
            <div class="top">
                <TOP></TOP>
            </div>
            <div class="bottom">
                <div class="left">
                    <TOURIST class="tourist"></TOURIST>
                    <Sex class="sex"></Sex>
                    <Age class="age"></Age>
                </div>
                <div class="center">
                    <Map class="map"></Map>
                    <div class="b-line">
                        <span>未来30天游客量趋势图</span>
                        <p class="bg"></p>
                        <Line class="line"></Line>
                    </div>
                </div>
                <div class="right">
                    <Rank class="r-rank"></Rank>
                    <Yau class="r-yau"></Yau>
                    <Stat class="r-stat"></Stat>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat center center fixed;
    background-size: cover;

    .screen {
        width: 1920px;
        height: 1080px;

        position: fixed;
        top: 50%;
        left: 50%;
        transform-origin: left top;

        .top {
            width: 100%;
            height: 40px;
        }

        .bottom {
            display: flex;

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 1040px;

                .r-rank {
                    flex: 1.2;
                    background: url(./images/dataScreen-main-rt.png) no-repeat;
                    background-size: 100% 100%;
                    margin: 20px 0;
                }

                .r-yau {
                    flex: 1;
                    background: url(./images/dataScreen-main-rc.png) no-repeat;
                    background-size: 100% 100%;
                    margin: 0 0 20px 0;
                }

                .r-stat {
                    flex: 1;
                    background: url(./images/dataScreen-main-rb.png) no-repeat;
                    background-size: 100% 100%;
                    margin-bottom: 20px;
                }
            }

            .left {
                flex: 1;
                height: 1040px;
                display: flex;
                flex-direction: column;

                .tourist {
                    flex: 1.2;
                }

                .sex {
                    flex: 1;
                }

                .age {
                    flex: 1;
                }
            }

            .center {
                flex: 2;
                height: 1040px;
                display: flex;
                flex-direction: column;

                .map {
                    flex: 3;
                    position: relative;
                    top: 5%
                }

                .b-line {
                    flex: 1;
                    z-index: 9999;
                    height: 300px;
                    width: 95%;
                    background: url(./images/dataScreen-main-cb.png) no-repeat center center fixed;
                    background-size: 100% 100%;
                    margin: 0 0 2vw 2vw;

                    span {
                        color: #fff;
                        font-size: 20px;
                    }

                    .bg {
                        width: 70px;
                        height: 7px;
                        background: url(./images/dataScreen-title.png) no-repeat;
                        background-size: 100% 100%;
                        margin: 1vh 0 0 1vw;
                    }

                    .line {
                        padding: 2vw 0 0 0;
                    }
                }
            }
        }
    }
}
</style>