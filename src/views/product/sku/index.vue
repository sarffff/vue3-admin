<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reqSkuList, reqOnSale, reqOffSale, reqGetSkuInfo, reqDeleteSku } from '@/api/product/sku'
import type { SkuData, SkuListResponseData, SkuInfoData } from '@/api/product/sku/type'
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let skuList = ref<SkuData[]>([])
const getSkuList = async () => {
    let result: SkuListResponseData = await reqSkuList(currentPage.value, pageSize.value)
    if (result.code === 200) {
        skuList.value = result.data.records
        total.value = result.data.total
    }
    else {
        ElMessage.error(result.message)
    }
}
onMounted(() => {
    getSkuList()
})
const updateSale = async (row: SkuData) => {
    if (row.isSale == 1) {
        await reqOffSale(row.id as number)
        ElMessage.success('下架成功')
        row.isSale = 0
    }
    else {
        await reqOnSale(row.id as number)
        ElMessage.success('上架成功')
        row.isSale = 1
    }
}
const updateSku = () => {
    ElMessage.warning('功能开发中,尽请期待!')
}
let drawer = ref<boolean>(false)
let skuInfo = ref<SkuData>({})
const findSku = async (row: SkuData) => {
    let res: SkuInfoData = await reqGetSkuInfo(row.id as number)
    if (res.code === 200) {
        drawer.value = !drawer.value
        skuInfo.value = res.data
    }
    else {
        ElMessage.error(res.message)
    }
}
const confirmDelete = async (row: SkuData) => {
    let res = await reqDeleteSku(row.id as number)
    if (res.code === 200) {
        ElMessage.success('删除成功')
        getSkuList()
    }
    else {
        ElMessage.error(res.message)
    }
}
</script>

<template>
    <el-table :data="skuList" style="width: 100%; margin: 10px 0" border>
        <el-table-column label="序号" prop="id" width="80" algin="center" />
        <el-table-column prop="skuName" label="名称" width="150" />
        <el-table-column prop="skuDesc" label="描述" width="600" />
        <el-table-column label="图片" width="300">
            <template #default="{ row }">
                <img :src="row.skuDefaultImg" style="width: 150px; height: 150px;" />
            </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="150" />
        <el-table-column prop="price" label="价格" width="150" />
        <el-table-column fixed="right" label="操作" width="300" style="left: 5px;">
            <template #default="{ row }">
                <el-button @click="updateSale(row)" type="success" size=18
                    :icon="row.isSale === 0 ? 'Top' : 'Bottom'"></el-button>
                <el-button @click="updateSku" type="primary" size=18 icon="Edit"></el-button>
                <el-button @click="findSku(row)" type="info" size=18 icon="InfoFilled"></el-button>
                <el-popconfirm title="你确认删除该sku嘛?" confirm-button-text="确认" cancel-button-text="取消" @confirm="confirmDelete(row)" width="200px">
                    <template #reference>
                        <el-button type="danger" size=18 icon="Delete"></el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getSkuList"
        @size-change="getSkuList" />
    <el-drawer v-model="drawer" title="查看商品详情">
        <template #default>
            <el-descriptions title="查看商品详情" :column="1" border>
                <el-descriptions-item label="名称" label-align="left" align="center" label-class-name="my-label">
                    {{ skuInfo.skuName }}
                </el-descriptions-item>
                <el-descriptions-item label="描述" label-align="left" align="center">
                    {{ skuInfo.skuDesc }}
                </el-descriptions-item>
                <el-descriptions-item label="价格" label-align="left" align="center">
                    {{ skuInfo.price }}
                </el-descriptions-item>
                <el-descriptions-item label="平台属性" label-align="left" align="center">
                    <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin-right: 5px;">
                        {{ item.valueName }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="销售属性" label-align="left" align="center">
                    <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id" style="margin-right: 5px;"
                        type="success">
                        {{ item.saleAttrValueName }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="商品图片" label-align="left" align="center">
                    <el-carousel :interval="4000" type="card" height="200px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item">
                            <img :src="item.imgUrl" style="width: 100%; height: 100%;" />
                        </el-carousel-item>
                    </el-carousel>
                </el-descriptions-item>
            </el-descriptions>
        </template>
    </el-drawer>

</template>

<style lang="scss" scoped>
:deep(.el-table_1_column_7 .cell) {
    display: flex;
    margin-left: 5px;
    gap: 10px
}

:deep(.my-label) {
    width: 100px;
}

.el-carousel__item img {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>