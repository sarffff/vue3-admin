<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue'
import SelectTag from '@/components/SelectTag.vue';
import { reqGetCfirst, reqGetCsecond, reqGetCthird, reqGetInfoList, reqAddAttr,reqDeleteAttr } from '@/api/product/attr';
import type { CategoryResponseData, CategoryObj, AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';

// 分类数据
const labels = reactive<{ FirstLabel: CategoryObj[]; SecondLabel: CategoryObj[]; ThirdLabel: CategoryObj[] }>({
    FirstLabel: [],
    SecondLabel: [],
    ThirdLabel: []
});

// 选中的分类
const selectedCategories = reactive({ C1value: '', C2value: '', C3value: '' });

// 属性列表
const categoryList = ref<Attr[]>([]);

// 获取随机 `type`
const tagTypes = ['success', 'warning', 'danger', 'info', 'primary'];
const getRandomTypeByIndex = (index: number): string => tagTypes[index % tagTypes.length];

// **获取一级分类**
const getC1 = async () => {
    try {
        const res: CategoryResponseData = await reqGetCfirst();
        if (res.code === 200) labels.FirstLabel = res.data;
    } catch (error) {
        console.error("获取一级分类失败:", error);
    }
};

// **获取二级分类**
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

// **获取属性列表**
const handleCategoryList = async (category3Id: string) => {
    selectedCategories.C3value = category3Id;
    categoryList.value = [];

    if (!category3Id) return;

    try {
        const res: AttrResponseData = await reqGetInfoList(selectedCategories.C1value, selectedCategories.C2value, selectedCategories.C3value);
        if (res.code === 200) categoryList.value = res.data;
    } catch (error) {
        console.error("获取属性列表失败:", error);
    }
};

// **监听一级分类变化**
watch(() => selectedCategories.C1value, () => {
    selectedCategories.C2value = '';
    selectedCategories.C3value = '';
    categoryList.value = [];
});

// **管理添加属性的状态**
const addStatus = ref(false);
const attrParams = reactive<Attr>({
    attrName: '',
    categoryId: '',
    categoryLevel: 3,
    attrValueList: []
});

// **编辑属性**
const handleEdit = (row: any) => {
    addStatus.value = true;
    Object.assign(attrParams, { attrName: '', categoryId: selectedCategories.C3value, categoryLevel: 3, attrValueList: [] });

    if (row.id) {
        Object.assign(attrParams, JSON.parse(JSON.stringify(row))); // 避免 `reactive` 对象直接修改
    }
};
// **删除属性**
const handleDelete = async (attrId: number) => {
    console.log(attrId);
    try {
        const res = await reqDeleteAttr(attrId);
        console.log(res);
        if (res.code === 200) {
            ElMessage.success('删除成功');
            handleCategoryList(selectedCategories.C3value);
        } else {
            throw new Error(res.message);
        }
    } catch (error: any) {
        ElMessage.error(error.message || '操作失败');
    }
}
// **新增属性值**
const addAttr = () => {
    attrParams.attrValueList.push({ valueName: '', flag: true });
};

// **保存属性**
const saveAttr = async () => {
    try {
        const res = await reqAddAttr(attrParams);
        if (res.code === 200) {
            ElMessage.success(attrParams.id ? '编辑成功' : '添加成功');
            addStatus.value = false;
            handleCategoryList(selectedCategories.C3value);
        } else {
            throw new Error(res.message);
        }
    } catch (error: any) {
        ElMessage.error(error.message || '操作失败');
    }
};

// **属性值去重 & 失焦校验**
const loseBlur = (row: AttrValue) => {
    if (!row.valueName.trim()) {
        ElMessage.warning('属性值不能为空');
        return;
    }

    const repeat = attrParams.attrValueList.some((item) => item !== row && item.valueName === row.valueName);
    if (repeat) {
        ElMessage.warning('属性值不能重复');
        return;
    }

    row.flag = !row.flag;
};

// **组件挂载时获取一级分类**
onMounted(() => getC1());
</script>

<template>
    <div>
        <!-- 分类选择组件 -->
        <SelectTag 
            :labels="labels" 
            :disabled="addStatus"
            @updateCategory1Id="handleCategory1IdChange"
            @updateCategory2Id="handleCategory2IdChange" 
            @updateCategory3Id="handleCategoryList" 
        />

        <!-- 属性表格 -->
        <el-card style="margin-top: 10px;">
            <div v-show="!addStatus">
                <el-button type="primary" icon="Plus" @click="handleEdit({})" :disabled="!selectedCategories.C3value">添加属性</el-button>
                <el-table :data="categoryList" border>
                    <el-table-column prop="categoryId" label="序号" width="120" />
                    <el-table-column prop="attrName" label="属性名称" width="150" />
                    <el-table-column prop="attrValueList" label="属性值名称">
                        <template #default="{ row }">
                            <el-tag v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                                :type="getRandomTypeByIndex(index)" style="margin-right: 10px;">
                                {{ attrValue.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template #default="{ row }">
                            <el-button type="warning" icon="Edit" size="small" @click="handleEdit(row)">编辑</el-button>
                            <el-button type="danger" icon="Delete" size="small" @click="handleDelete(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="addStatus" class="add-attr-box">
                <div class="input-attr">
                    <span>属性名称</span>
                    <el-input v-model="attrParams.attrName" placeholder="请输入属性名称" />
                </div>
                <el-button type="primary" icon="Plus" :disabled="!attrParams.attrName" @click="addAttr">添加属性值</el-button>
                <el-table :data="attrParams.attrValueList" border>
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column label="属性值名称">
                        <template #default="{ row }">
                            <el-input v-if="row.flag" v-model="row.valueName" @blur="loseBlur(row)" />
                            <div v-else @click="row.flag = !row.flag">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template #default="{ $index }">
                            <el-button type="danger" icon="Delete" size="small" @click="attrParams.attrValueList.splice($index, 1)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="saveAttr">保存</el-button>
                <el-button @click="addStatus = false">取消</el-button>
            </div>
        </el-card>
    </div>
</template>


<style lang="scss" scoped>
.add-attr-box {
    width: 100%;

    .input-attr {
        display: flex;
        align-items: center;
        margin-bottom: 3vh;

        .el-input {
            margin-left: 2vh;
            width: 15%;
        }
    }
}
</style>
