<template>
     <div ref="chartContainer" class="chart-container"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

const chartContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
     if (!chartContainer.value) return;
     const myChart = echarts.init(chartContainer.value);

     // 假设的未来30天日期数据，可根据实际调整
     const days = ['05/05', '05/07', '05/09', '05/11', '05/13', '05/15', '05/17', '05/19', '05/21', '05/23', '05/25', '05/27', '05/29', '05/31', '06/02'];
     // 假设的游客量数据，可根据实际数据替换
     const visitorNumbers = [12000, 15000, 10000, 8000, 13000, 9000, 11000, 10500, 14000, 17000, 12500, 14500, 11500, 10000, 9500];

     const option = {
          tooltip: {
               trigger: 'axis',
          },
          grid: {
               top: '5%',
               bottom: '10%',
               left: '8%',
               right: 20
          },
          xAxis: {
               type: 'category',
               data: days,
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
                    name: '游客量',
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    areaStyle: {
                         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                              {
                                   offset: 0,
                                   color: 'rgb(255, 158, 68)'
                              },
                              {
                                   offset: 1,
                                   color: 'rgb(255, 70, 131)'
                              }
                         ])
                    },
                    data: visitorNumbers
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