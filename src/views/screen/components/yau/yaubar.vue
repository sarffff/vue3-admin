<template>
    <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import type { Right } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

const chartRef = ref<HTMLDivElement | null>(null);

// 月份数据
const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
// 2021年游客量数据，这里是模拟数据，实际需替换
const data2021 = [50, 30, 40, 60, 70, 40, 30, 20, 50, 60, 70, 80];
// 2022年游客量数据，这里是模拟数据，实际需替换
const data2022 = [80, 60, 70, 90, 80, 60, 50, 40, 70, 80, 90, 100];
// 2023年游客量数据，这里是模拟数据，实际需替换
const data2023 = [100, 80, 90, 110, 100, 80, 70, 60, 90, 100, 110, 120];

onMounted(() => {
    if (!chartRef.value) return;
    const myChart = echarts.init(chartRef.value);

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['2021年', '2022年', '2023年'],
            textStyle: {
                color: '#fff'
            },
            right: 30,
        },
        xAxis: {
            type: 'category',
            data: months,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#fff'
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                    show: false
               },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#fff'
            }
        },
        series: [
            {
                name: '2021年',
                type: 'line',
                stack: '总量',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 165, 0, 0.3)' },
                        { offset: 1, color: 'rgba(255, 165, 0, 0.1)' }
                    ])
                },
                data: data2021
            },
            {
                name: '2022年',
                type: 'line',
                stack: '总量',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 128, 255, 0.3)' },
                        { offset: 1, color: 'rgba(0, 128, 255, 0.1)' }
                    ])
                },
                data: data2022
            },
            {
                name: '2023年',
                type: 'line',
                stack: '总量',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 0, 0, 0.3)' },
                        { offset: 1, color: 'rgba(255, 0, 0, 0.1)' }
                    ])
                },
                data: data2023
            }
        ],
    };

    myChart.setOption(option);

    window.addEventListener('resize', () => {
        myChart.resize();
    });
});
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
}
</style>