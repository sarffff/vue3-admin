// ChinaMap.vue
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import chinaJson from './china.json'

const mapRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (!mapRef.value) return

    echarts.registerMap('china', chinaJson as any)
    const chart = echarts.init(mapRef.value)

    const geoCoordMap: Record<string, [number, number]> = {
        '北京': [116.46, 39.92],
        '上海': [121.48, 31.22],
        '广州': [113.23, 23.16],
        '成都': [104.06, 30.67],
        '杭州': [120.19, 30.26],
        '西安': [108.95, 34.27],
        '新疆': [87.61, 43.79],
        '西藏': [91.13,29.66],
    }

    const convertData = () => {
        return [
            { fromName: '成都', toName: '北京', coords: [geoCoordMap['成都'], geoCoordMap['北京']] },
            { fromName: '北京', toName: '上海', coords: [geoCoordMap['北京'], geoCoordMap['上海']] },
            { fromName: '成都', toName: '广州', coords: [geoCoordMap['成都'], geoCoordMap['广州']] },
            { fromName: '西安', toName: '新疆', coords: [geoCoordMap['西安'], geoCoordMap['新疆']] },
            { fromName: '成都', toName: '西藏', coords: [geoCoordMap['成都'], geoCoordMap['西藏']] },
        ]
    }

    chart.setOption({
        geo: {
            map: 'china',
            roam: false,
            zoom: 1.2,
            label: {
                show: true,
                color: '#fff'
            },
            itemStyle: {
                areaColor: '#234E93',
                borderColor: '#29fcff',
                borderWidth: 1
            },
            emphasis: {
                label: {
                    color: '#fff',
                    fontSize: 20
                },
                itemStyle: {
                    areaColor: '#2a9df4'
                }
            }
        },
        series: [
            {
                name: '飞线',
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 4,
                    trailLength: 0.5,
                    color: '#fff',
                    symbolSize: 4
                },
                lineStyle: {
                    color: '#00f6ff',
                    width: 1,
                    curveness: 0.3
                },
                data: convertData()
            },
            {
                name: '飞线点',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    color: '#fff'
                },
                symbolSize: 8,
                itemStyle: {
                    color: '#00f6ff'
                },
                data: Object.keys(geoCoordMap).map(name => ({
                    name,
                    value: geoCoordMap[name]
                }))
            }
        ]
    })

    window.addEventListener('resize', () => chart.resize())
})
</script>

<template>
    <div class="map" ref="mapRef"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 600px;
}
</style>
