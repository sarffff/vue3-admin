<template>
    <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import type { Right } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const chartRef = ref<HTMLDivElement | null>(null)

const data = [
    { value: 40, name: '智慧文旅平台', itemStyle: { color: '#3aa1ff' } },
    { value: 10, name: '携程', itemStyle: { color: '#ffc53d' } },
    { value: 20, name: '飞猪', itemStyle: { color: '#ff7cae' } },
    { value: 30, name: '其他渠道', itemStyle: { color: '#ff6b6b' } }
]

onMounted(() => {
    if (!chartRef.value) return
    const myChart = echarts.init(chartRef.value)

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {d}%'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            top: 'center',
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            formatter: (name: string) => {
                const item = data.find(d => d.name === name)
                return `${name}  ---  ${item?.value}%`
            }
        },
        graphic: {
            elements: [
                {
                    type: 'image',
                    style: {
                        image: 'https://img.icons8.com/ios-filled/50/ffffff/pie-chart.png', // 可替换成本地图标
                        width: 100,
                        height: 100
                    },
                    right: 120,
                    top: 'center'
                }
            ]
        },
        series: [
            {
                name: '预约渠道占比',
                type: 'pie',
                radius: ['60%', '90%'],
                center: ['65%', '50%'], // 右偏展示图例
                roseType: 'radius',
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data
            }
        ],
    }

    myChart.setOption(option)

    window.addEventListener('resize', () => {
        myChart.resize()
    })
})
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
}
</style>