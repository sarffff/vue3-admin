<template>
    <div ref="chartRef" class="rose-chart"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (!chartRef.value) return
    const chart = echarts.init(chartRef.value)

    chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c}人 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'middle',
            textStyle: {
                color: '#fff'
            },
            data: ['10岁以下', '10-18岁', '18-30岁', '30-40岁', '40-60岁', '60岁以上']
        },
        series: [
            {
                name: '年龄分布',
                type: 'pie',
                radius: ['30%', '65%'],
                center: ['40%', '50%'],
                roseType: 'area',
                label: {
                    color: '#fff',
                    fontSize: 12,
                    formatter: '{b}\n{d}%',
                },
                labelLine: {
                    length: 8,
                    length2: 12,
                    smooth: true
                },
                itemStyle: {
                    borderRadius: 6,
                    borderColor: '#0f2a57',
                    borderWidth: 2,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                data: [
                    { value: 16, name: '10岁以下', itemStyle: { color: '#fbb03b' } },
                    { value: 12, name: '10-18岁', itemStyle: { color: '#ff6b6b' } },
                    { value: 14, name: '18-30岁', itemStyle: { color: '#00d2ff' } },
                    { value: 24, name: '30-40岁', itemStyle: { color: '#00b3a9' } },
                    { value: 16, name: '40-60岁', itemStyle: { color: '#66b3ff' } },
                    { value: 20, name: '60岁以上', itemStyle: { color: '#b486f8' } }
                ]
            }
        ]
    })

    window.addEventListener('resize', () => chart.resize())
})
</script>

<style scoped>
.rose-chart {
    width: 100%;
    height: 100%;
}
</style>