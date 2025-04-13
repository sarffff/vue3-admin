<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
let status = ref<number>(0)
const emit = defineEmits(['updateStatus'])
const changestatus = () => {
    emit('updateStatus', status.value)
}
import { reqGetTrademarkList, reqGetSpuImageList, reqGetSpuSaleAttrList, reqGetAllSaleAttrList, reqUpdateSpu } from '@/api/product/spu';
import type {
    SpuData, Trademark,
    SpuImage, SpuSaleAttr, HasSaleAttr,
    SaleAttr,
} from '@/api/product/spu/type';
let allTrademarkList = ref<Trademark[]>([])
let ImageList = ref<SpuImage[]>([])
let saleAttrList = ref<SpuSaleAttr[]>([])
let allSaleAttrList = ref<HasSaleAttr[]>([])
let selectedSaleAttrVaule = ref<string>('')
let unSelectSaleAttr = computed(() => {
    return allSaleAttrList.value.filter(item => {
        return saleAttrList.value.every(item1 => {
            return item.name !== item1.saleAttrName
        })
    })
})
const addSaleAttrValue = () => {
    let [baseSaleAttrId, saleAttrName] = selectedSaleAttrVaule.value.split(':')
    let newsaleAttr: SpuSaleAttr = {
        baseSaleAttrId: Number(baseSaleAttrId),
        saleAttrName,
        spuSaleAttrValueList: []
    }
    saleAttrList.value.push(newsaleAttr)
    selectedSaleAttrVaule.value = ''
}
// 表单数据初始化
const spuFormData = reactive<SpuData>({
    spuName: '',
    description: '',
    category3Id: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
});
const initspuFormData = reactive<SpuData>({
    spuName: '',
    description: '',
    category3Id: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
})
const initTrademarkList = async (spu: SpuData) => {
    try {
        // 先同步赋值基础数据
        Object.assign(spuFormData, {
            tmId: spu.tmId,
            spuName: spu.spuName,
            description: spu.description,
            category3Id: spu.category3Id
        });

        // 并发请求，使用 Promise.allSettled 接收所有结果
        const results = await Promise.allSettled([
            reqGetTrademarkList(),
            reqGetSpuImageList(spu.id as number),
            reqGetSpuSaleAttrList(spu.id as number),
            reqGetAllSaleAttrList()
        ]);

        // 分别处理每个结果
        if (results[0].status === 'fulfilled') {
            allTrademarkList.value = results[0].value.data;
        } else {
            ElMessage.warning('获取品牌列表失败');
        }

        if (results[1].status === 'fulfilled') {
            ImageList.value = results[1].value.data.map(item => {
                return {
                    name: item.imgName,
                    url: item.imgUrl
                }
            });
        } else {
            ElMessage.warning('获取图片列表失败');
        }

        if (results[2].status === 'fulfilled') {
            saleAttrList.value = results[2].value.data;
        } else {
            ElMessage.warning('获取销售属性失败');
        }

        if (results[3].status === 'fulfilled') {
            allSaleAttrList.value = results[3].value.data;
        } else {
            ElMessage.warning('获取所有销售属性失败');
        }

    } catch (error) {
        // 一般不会触发，只有代码本身写错才会进这里
        ElMessage.error('数据加载异常');
    }
};
const toEdit = (row: SpuSaleAttr) => {
    row.flag = true
    row.saleAttrInputValue = ''
}
const loseBlur = (row: SpuSaleAttr) => {
    const { baseSaleAttrId, saleAttrInputValue } = row
    let newVale: SaleAttr = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrInputValue
    }
    if (!(saleAttrInputValue as string).trim()) {
        ElMessage.warning('属性值不能为空');
        return;
    }
    const repeat = row.spuSaleAttrValueList.find((item) => item.saleAttrValueName === saleAttrInputValue);
    if (repeat) {
        ElMessage.warning('属性值不能重复');
        return;
    }
    row.spuSaleAttrValueList.push(newVale)
    row.flag = false
}
const save = async () => {
    spuFormData.spuImageList = ImageList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    spuFormData.spuSaleAttrList = saleAttrList.value
    try {
        let res = await reqUpdateSpu(spuFormData)
        console.log(res)
        if (res.code === 200) {
            ElMessage.success('保存成功')
            changestatus()
        }
    } catch (error) {
        ElMessage.error('保存失败')
    }
    ImageList.value = []
    saleAttrList.value = []
}

const initaddspu = async (category3Id: string) => {
    Object.assign(spuFormData, initspuFormData)
    spuFormData.category3Id = category3Id
    const results = await Promise.allSettled([
        reqGetTrademarkList(),
        reqGetAllSaleAttrList()
    ]);

    if (results[0].status === 'fulfilled') {
        allTrademarkList.value = results[0].value.data;
    } else {
        ElMessage.warning('获取品牌列表失败');
    }

    if (results[1].status === 'fulfilled') {
        allSaleAttrList.value = results[1].value.data;
    } else {    
        ElMessage.warning('获取所有销售属性失败');  
    }
}
defineExpose({
    initTrademarkList, initaddspu
})


let dialogImageUrl = ref('')
let dialogVisible = ref(false)
const handleRemove = () => {
    ElMessage.success('删除成功')
}

const handlePictureCardPreview = (uploadFile: any) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
</script>

<template>
    <el-form width="100px" :model="spuFormData">
        <el-form-item label="SPU名称" prop="spuName">
            <el-input v-model="spuFormData.spuName" placeholder="请输入SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select placeholder="请选择品牌" v-model="spuFormData.tmId">
                <el-option :label="tm.tmName" :value="tm.id" v-for="tm in allTrademarkList" :key="tm.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
            <el-input type="textarea" v-model="spuFormData.description" placeholder="请输入SPU描述"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <el-upload action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" v-model:file-list="ImageList">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select placeholder="请选择销售属性" v-model="selectedSaleAttrVaule">
                <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr"
                    :key="item.id"></el-option>
            </el-select>
            <el-button type="primary" icon="Plus" style="margin-left: 10px;" :disabled="!selectedSaleAttrVaule"
                @click="addSaleAttrValue">添加销售属性</el-button>
            <el-table :data="saleAttrList" style="margin: 10px 0;" border>
                <el-table-column type="index" label="序号" width="180" />
                <el-table-column prop="saleAttrName" label="属性名" width="180" />
                <el-table-column label="属性值">
                    <template #default="{ row }">
                        <el-tag type="success" v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable
                            @close="row.spuSaleAttrValueList.splice(index, 1)">{{ item.saleAttrValueName }}</el-tag>
                        <el-input v-if="row.flag" v-model="row.saleAttrInputValue" placeholder="请输入属性值"
                            @blur="loseBlur(row)" />
                        <el-button v-else type="primary" icon="Plus" size="small" @click="toEdit(row)"></el-button />
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="180">
                    <template #default="{ row, $index }">
                        <el-button type="danger" size="small" icon="Delete"
                            @click="saleAttrList.splice($index, 1)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="changestatus">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped lang="scss">
:deep(.el-select) {
    width: 20vh;
}

:deep(.el-table__row .el-input) {
    width: 15vh;
    height: 25px;
    margin-left: 10px;
}
</style>