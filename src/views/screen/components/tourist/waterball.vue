<!-- WaterBall.vue -->
<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill' // 必须引入

const chartRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!chartRef.value) return

  const chart = echarts.init(chartRef.value)

  chart.setOption({
    series: [
      {
        type: 'liquidFill',
        radius: '90%',
        center: ['50%', '50%'],
        data: [0.55, 0.5, 0.45], // 多层波浪
        color: [
          {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#00c2ff' },
              { offset: 1, color: '#00e3ff' },
            ],
            global: false,
          },
        ],
        backgroundStyle: {
          color: '#061a3d',
        },
        label: {
          formatter: '预约率',
          fontSize: 18,
          color: '#fff',
        },
        outline: {
          show: true,
          borderDistance: 4,
          itemStyle: {
            borderWidth: 5,
            borderColor: '#00e4ff',
            shadowBlur: 10,
            shadowColor: '#00e4ff',
            borderType: 'dashed',
          },
        },
      },
      // 半圆外环用 gauge 实现
      {
        type: 'gauge',
        startAngle: 0,
        endAngle: 180,
        radius: '100%',
        center: ['50%', '50%'],
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            color: [[1, '#00e4ff']],
            width: 8,
          },
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { show: false },
      },
    ],

  })

  // 根据窗口大小自动缩放
  window.addEventListener('resize', () => {
    chart.resize()
  })
})
</script>

<style scoped>
.chart-container {
  width: 90%;
  height: 90%;
  margin-left: 1vw;
}
</style>