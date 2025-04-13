<template>
    <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const chartRef = ref<HTMLDivElement | null>(null)

const data = [
    { name: '  峨眉山  ', value: 80, count: '8.00w' },
    { name: '稻城亚丁', value: 60, count: '6.00w' },
    { name: '  九寨沟  ', value: 50, count: '5.00w' },
    { name: '万里长城', value: 40, count: '4.00w' },
    { name: '北京故宫', value: 30, count: '3.00w' }
]

// 调整颜色数组，使其更接近图片样式
const rankColors = ['#ff4d4f', '#ff8c00', '#00bfff', '#ffd700', '#9370db']

onMounted(() => {
    if (!chartRef.value) return
    const chart = echarts.init(chartRef.value)

    chart.setOption({
        grid: {
            left: 50,
            right: 60,
            top: 10,
            bottom: 20,
            containLabel: true
        },
        xAxis: { show: false, type: 'value' },
        yAxis: [
            {
                type: 'category',
                inverse: true,
                data: data.map((item, index) => `{rank${index}|NO.${index + 1}} {name|${item.name}}`),
                axisLabel: {
                    formatter: (value: string, index: number) => {
                        return `{rank${index}|NO.${index + 1}}    {name|${data[index].name}}` // 注意中间空格间距
                    },
                    rich: data.reduce((acc, item, index) => {
                        acc[`rank${index}`] = {
                            color: '#fff',
                            backgroundColor: rankColors[index],
                            borderRadius: 4,
                            padding: [4, 0, 4, 0], // 上右下左，居中对齐
                            fontSize: 12,
                            width: 40,             // 固定宽度使整体左对齐
                            height: 20,            // 固定高度控制垂直整齐
                            align: 'center',
                            verticalAlign: 'middle' // 这也有助于对齐
                        }
                        return acc
                    }, {
                        name: {
                            color: '#fff',
                            fontSize: 14,
                            padding: [0, 8, 0, 8] // 给名字和排名块之间加点距离
                        }
                    } as Record<string, any>),
                    margin: 14
                },
                axisLine: { show: false },
                axisTick: { show: false }
            },
            {
                type: 'category',
                inverse: true,
                data: data.map(item => item.count),
                axisLabel: {
                    color: '#fff',
                    fontSize: 14
                },
                axisLine: { show: false },
                axisTick: { show: false }
            }
        ],
        series: [
            // 数据条
            {
                type: 'bar',
                data: data.map((item, index) => ({
                    value: item.value,
                    itemStyle: {
                        color: rankColors[index],
                        borderRadius: 10
                    }
                })),
                yAxisIndex: 0,
                barWidth: 14,
                label: {
                    show: true,
                    position: 'insideRight',
                    formatter: '{c}%',
                    color: '#fff',
                    fontSize: 12
                },
                z: 2
            }
        ],
    })

    window.addEventListener('resize', () => chart.resize())
})
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 300px;
}
</style>