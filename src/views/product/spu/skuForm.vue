<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
let status = ref<number>(0)
let emit = defineEmits(['updateStatus'])
const cancleStatus = () => {
    emit('updateStatus', status.value)
    skuInfoList.value = []
    imageList.value = []
    saleAttrList.value = []
}
import { reqGetInfoList } from '@/api/product/attr'
import { reqGetSpuImageList, reqGetSpuSaleAttrList,reqAddSku } from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
let skuInfoList = ref<any>([])
let imageList = ref<any>([])
let saleAttrList = ref<any>([])
let skuFormData = reactive<SkuData>({
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName: '',
    price: '',
    weight:'',
    skuDesc: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg:''
})
const initSkuForm = async (C1value: number | string, C2value: number | string, spu: any) => {
    skuFormData.category3Id = spu.category3Id
    skuFormData.tmId = spu.tmId
    skuFormData.spuId = spu.id
    const results = await Promise.allSettled([
        reqGetInfoList(C1value, C2value, spu.category3Id),
        reqGetSpuImageList(spu.id),
        reqGetSpuSaleAttrList(spu.id)
    ]);
    if (results[0].status === 'fulfilled') {
        skuInfoList.value = results[0].value.data;
    } else {
        ElMessage.warning('获取品牌列表失败');
    }

    if (results[1].status === 'fulfilled') {
        imageList.value = results[1].value.data;
    } else {
        ElMessage.warning('获取品牌图片列表失败');
    }

    if (results[2].status === 'fulfilled') {
        saleAttrList.value = results[2].value.data;
    } else {
        ElMessage.warning('获取品牌属性失败');
    }
}
let tableRef = ref<any>()
const handle = (row: any) => {
    tableRef.value.clearSelection()
    tableRef.value.toggleRowSelection(row,true)
    skuFormData.skuDefaultImg = row.imgUrl
}
const saveSku = async() => {
    skuFormData.skuAttrValueList = skuInfoList.value.reduce((prev: any, next: any) => {
        if (next.attrIds) {
            let [attrId, valueId] = next.attrIds.split(':')
            prev.push({
                attrId,
                valueId
            })
        }
        return prev
    }, []);
    skuFormData.skuSaleAttrValueList = saleAttrList.value.reduce((prev: any, next: any) => {
        if (next.saleAttrIds) {
            let [saleAttrId, saleAttrValueId] = next.saleAttrIds.split(':')
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev
    }, []);
    let res: any = await reqAddSku(skuFormData)
    if (res.code === 200) {
        ElMessage.success('添加成功')
    }
    emit('updateStatus',status.value)
}
defineExpose({
    initSkuForm
})
</script>

<template>
    <el-form label-width="100px" :model="skuFormData">
        <el-form-item label="SKU名称" prop="skuName">
            <el-input placeholder="SKU名称" v-model="skuFormData.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
            <el-input placeholder="价格(元)" v-model="skuFormData.price" />
        </el-form-item>
        <el-form-item label="重量(克)" prop="weight">
            <el-input placeholder="重量(克)" v-model="skuFormData.weight" />
        </el-form-item>
        <el-form-item label="SKU描述" prop="skuDese">
            <el-input type="textarea" placeholder="请输入SKU描述" v-model="skuFormData.skuDesc" />
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true" label-width="70px">
                <el-form-item v-for="item in skuInfoList" :label="item.attrName" :key="item.id" style="width: 300px;">
                    <el-select clearable v-model="item.attrIds">
                        <el-option v-for="options in item.attrValueList" :value="`${item.id}:${options.id}`" :label="options.valueName" :key="options.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true" label-width="60px">
                <el-form-item v-for="item in saleAttrList" :label="item.saleAttrName" :key="item.id">
                    <el-select style="width: 300px;" v-model="item.saleAttrIds">
                        <el-option v-for="options in item.spuSaleAttrValueList" :value="`${item.id}:${options.id}`" :label="options.saleAttrValueName" :key="options.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imageList" ref="tableRef">
                <el-table-column type="selection" width="60px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #default="{ row }">
                        <img :src="row.imgUrl" :alt="row.imgName" class="attr_img">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="warning" @click="handle(row)">设为默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="saveSku">保存</el-button>
            <el-button type="info" @click="cancleStatus">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped lang="scss">
.attr_img{
    width: 100px;
    height: 100px;
}
</style>