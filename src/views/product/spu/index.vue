<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import SelectTag from '@/components/SelectTag.vue';
import spuForm from './spuForm.vue';
import skuForm from './skuForm.vue';
import { reqGetCfirst, reqGetCsecond, reqGetCthird } from '@/api/product/attr';
import type { CategoryResponseData, CategoryObj } from '@/api/product/attr/type';
import { reqGetSpuList, reqSkuList, reqDeleteSpu } from '@/api/product/spu';
import type { SpuResponseData, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type';

// 分类数据
const labels = reactive<{ FirstLabel: CategoryObj[]; SecondLabel: CategoryObj[]; ThirdLabel: CategoryObj[] }>({
    FirstLabel: [],
    SecondLabel: [],
    ThirdLabel: []
});

// 选中的分类
const selectedCategories = reactive({ C1value: '', C2value: '', C3value: '' });

// **获取一级分类**
const getC1 = async () => {
    try {
        const res: CategoryResponseData = await reqGetCfirst();
        if (res.code === 200) labels.FirstLabel = res.data;
    } catch (error) {
        console.error("获取一级分类失败:", error);
    }
};

// **获取二级分类**=
const handleCategory1IdChange = async (category1Id: string) => {
    selectedCategories.C1value = category1Id;
    selectedCategories.C2value = selectedCategories.C3value = '';
    labels.SecondLabel = [];
    labels.ThirdLabel = [];

    if (!category1Id) return;

    try {
        const res: CategoryResponseData = await reqGetCsecond(category1Id);
        if (res.code === 200) labels.SecondLabel = res.data;
    } catch (error) {
        console.error("获取二级分类失败:", error);
    }
};

// **获取三级分类**
const handleCategory2IdChange = async (category2Id: string) => {
    selectedCategories.C2value = category2Id;
    selectedCategories.C3value = '';
    labels.ThirdLabel = [];

    if (!category2Id) return;

    try {
        const res: CategoryResponseData = await reqGetCthird(category2Id);
        if (res.code === 200) labels.ThirdLabel = res.data;
    } catch (error) {
        console.error("获取三级分类失败:", error);
    }
};
let changeStatus = ref<number>(0)
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
const spuAttrList = ref<SpuData[]>([]);
const handleSizeChange = (val: number) => {
    pageSize.value = val
    handleCategoryList(selectedCategories.C3value)
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    handleCategoryList(selectedCategories.C3value)
}
// **获取spu列表**
const handleCategoryList = async (category3Id: string) => {
    selectedCategories.C3value = category3Id;
    spuAttrList.value = [];

    if (!category3Id) return;

    try {
        const res: SpuResponseData = await reqGetSpuList(currentPage.value, pageSize.value, selectedCategories.C3value);
        if (res.code === 200) {
            spuAttrList.value = res.data.records;
            total.value = res.data.total
            ElMessage.success('获取spu列表成功');
        }
    } catch (error) {
        console.error("获取spu列表失败:", error);
    }
};
// **监听一级分类变化**
watch(() => selectedCategories.C1value, () => {
    selectedCategories.C2value = '';
    selectedCategories.C3value = '';
    spuAttrList.value = [];
});
let spuFormRef = ref()
let skuFormRef = ref()
const handleStatus = (status: number) => {
    changeStatus.value = status
}
const handelSpu = (row: SpuData) => {
    changeStatus.value = 1
    spuFormRef.value.initTrademarkList(row)
}
const addSpu = () => {
    changeStatus.value = 1
    spuFormRef.value.initaddspu(selectedCategories.C3value)
}
const addSku = (row: SpuData) => {
    changeStatus.value = 2
    skuFormRef.value.initSkuForm(selectedCategories.C1value, selectedCategories.C2value, row)
}
let skuarr = ref<SkuData[]>([])
let dialogshow = ref<boolean>(false)
const findSku = async (row: SpuData) => {
    dialogshow.value = !dialogshow.value
    let res: SkuInfoData = await reqSkuList((row.id as number))
    if (res.code === 200) {
        skuarr.value = res.data
    }
}
const confirmDelete = async (row: SpuData) => {
    let res = await reqDeleteSpu(row.id as number)
    if (res.code === 200) {
        ElMessage.success('删除成功')
        handleCategoryList(selectedCategories.C3value)
    }
}
onMounted(() => {
    getC1();
})
</script>

<template>
    <SelectTag :labels="labels" :disabled="changeStatus" @updateCategory1Id="handleCategory1IdChange"
        @updateCategory2Id="handleCategory2IdChange" @updateCategory3Id="handleCategoryList" />

    <el-card>
        <div v-show="changeStatus === 0">
            <el-button type="primary" icon="Plus" @click="addSpu">添加spu</el-button>
            <el-table :data="spuAttrList" border style="margin: 20px 0;">
                <el-table-column prop="categoryId" label="序号" width="80" type="index" align="center" />
                <el-table-column prop="spuName" label="SPU名称" width="170" />
                <el-table-column prop="description" label="SPU描述" />
                <el-table-column label="SPU操作" width="280">
                    <template #default="{ row }">
                        <el-button type="primary" icon="Plus" size="small" title="添加SKU"
                            @click="addSku(row)"></el-button>
                        <el-button type="success" icon="Edit" size="small" title="修改SPU"
                            @click="handelSpu(row)"></el-button>
                        <el-button type="info" icon="View" size="small" title="查看SKU列表"
                            @click="findSku(row)"></el-button>
                        <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" width="200"
                            icon-color="#626AEF" title="你确认删除该spu嘛?" @confirm="confirmDelete(row)">
                            <template #reference>
                                <el-button type="danger" icon="Delete" size="small"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper,-> ,total, sizes, " :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <spuForm v-show="changeStatus === 1" ref="spuFormRef" @updateStatus="handleStatus"></spuForm>

        <skuForm v-show="changeStatus === 2" ref="skuFormRef" @updateStatus="handleStatus"></skuForm>

        <el-dialog v-model="dialogshow" title="SKU列表">
            <el-table border :data="skuarr">
                <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                <el-table-column label="SKU价格" prop="price"></el-table-column>
                <el-table-column label="SKU重量" prop="weight"></el-table-column>
                <el-table-column label="SKU图片">
                    <template #default="{ row }">
                        <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;" />
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>