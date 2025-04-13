<!-- GenderBarChart.vue -->
<template>
    <div ref="chartRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

// 接收外部传入的百分比数据

const props = defineProps({
    malePercent: {
        type: Number,
        required: true
    },
    femalePercent: {
        type: Number,
        required: true
    }
})

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts

const initChart = () => {
    if (!chartRef.value) return

    chart = echarts.init(chartRef.value)

    chart.setOption({
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            containLabel: false
        },
        xAxis: {
            show: false,
            type: 'value',
            max: 100
        },
        yAxis: {
            show: false,
            type: 'category',
            data: ['']
        },
        series: [
            {
                name: '男士',
                type: 'bar',
                stack: 'total',
                barWidth: 24,
                label: {
                    show: true,
                    position: 'insideLeft',
                    formatter: `男士 ${props.malePercent}%`,
                    color: '#fff',
                    fontSize: 14
                },
                itemStyle: {
                    color: '#3a8bff',
                    borderRadius: [12, 0, 0, 12]
                },
                data: [props.malePercent]
            },
            {
                name: '女士',
                type: 'bar',
                stack: 'total',
                barWidth: 24,
                label: {
                    show: true,
                    position: 'insideRight',
                    formatter: `女士 ${props.femalePercent}%`,
                    color: '#fff',
                    fontSize: 14
                },
                itemStyle: {
                    color: '#ff7c9e',
                    borderRadius: [0, 12, 12, 0]
                },
                data: [props.femalePercent]
            }
        ]
    })
}

onMounted(() => {
    initChart()
    window.addEventListener('resize', () => chart?.resize())
})

// 若 props 动态变化，更新图表
watch(() => [props.malePercent, props.femalePercent], () => {
    initChart()
})
</script>

<style scoped>
</style>