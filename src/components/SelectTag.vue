<script setup lang="ts">
import { reactive, watch } from 'vue';

// 定义 emits 事件
const emit = defineEmits(['updateCategory1Id', 'updateCategory2Id','updateCategory3Id']);

// 分类数据
let categoryValues = reactive({
    C1value: '',
    C2value: '',
    C3value: ''
});

// 监听一级分类的变化
watch(() => categoryValues.C1value, (newValue) => {
    emit('updateCategory1Id', newValue);
});

// 监听二级分类的变化
watch(() => categoryValues.C2value, (newValue) => {
    emit('updateCategory2Id', newValue);
});

watch(() =>categoryValues.C3value, (newValue) => {
    emit('updateCategory3Id', newValue);
    
})
defineProps(['labels','disabled']);
</script>

<template>
    <div>
        <el-card class="header-card">
            <el-form :inline="true" :model="categoryValues" class="demo-form-inline">
                <el-form-item label="一级分类" class="form-item">
                    <el-select v-model="categoryValues.C1value" 
                    placeholder="请选择一级分类" 
                    :disabled="disabled"
                    clearable>
                        <el-option 
                         v-for="item in labels.FirstLabel"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="二级分类" class="form-item">
                    <el-select v-model="categoryValues.C2value"
                    :disabled="disabled"
                    placeholder="请选择二级分类" clearable>
                        <el-option
                        v-for="item in labels.SecondLabel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="三级分类" class="form-item">
                    <el-select v-model="categoryValues.C3value" 
                    :disabled="disabled"
                    placeholder="请选择三级分类" clearable>
                        <el-option
                        v-for="item in labels.ThirdLabel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style lang="scss" scoped>
.demo-form-inline {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    .form-item {
        flex: 1;
        .el-select {
            width: 100%;
        }
    }
}
</style>
