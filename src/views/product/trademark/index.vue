<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { reqTradeMarkList, reqAddOrUpdateTradeMark, reqDeleteTradeMark } from '@/api/product/trademark'
import type { records, trademark } from '@/api/product/trademark/type'

// 当前页和分页大小
const currentPage = ref(1)
const pageSize = ref(3)

// 品牌数据
const tableForm = reactive<{ tableData: records, total: number }>({
    tableData: [],
    total: 0
})

// 获取品牌列表
const getTrademarkList = async () => {
    const res = await reqTradeMarkList(currentPage.value, pageSize.value)
    if (res.code === 200) {
        tableForm.tableData = res.data.records
        tableForm.total = res.data.total
    } else {
        ElMessage.error(res.message)
    }
}

// 组件挂载时获取品牌列表
onMounted(getTrademarkList)

// 品牌表单
const tradeMarkForm = reactive<trademark>({ tmName: '', logoUrl: '' })
const imageUrl = ref<string>('')

// 对话框控制
const dialogVisible = ref(false)
const isEdit = ref(false)

// 计算对话框标题
const dialogTitle = computed(() => (isEdit.value ? '编辑品牌' : '添加品牌'))

// 表单验证规则
const rules = {
    tmName: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
    logoUrl: [{ required: true, message: '请上传品牌LOGO', trigger: 'blur' }]
}

// 上传相关逻辑
import type { UploadProps } from 'element-plus'
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    imageUrl.value = response // 直接使用后端返回的 URL
    tradeMarkForm.logoUrl = response
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(rawFile.type)
    if (!isImage) {
        ElMessage.error('上传图片必须是 JPG/PNG/GIF 格式!')
        return false
    }
    if (rawFile.size / 1024 / 1024 > 4) {
        ElMessage.error('图片大小不能超过 4MB!')
        return false
    }
    return true
}

// 表单引用
const tradeFormRef = ref()

// 重置表单
const resetForm = () => {
    tradeMarkForm.tmName = ''
    tradeMarkForm.logoUrl = ''
    imageUrl.value = ''
}

// 处理添加/编辑品牌
const handleTradeMark = (row?: trademark) => {
    dialogVisible.value = true
    isEdit.value = !!row?.id

    if (isEdit.value) {
        Object.assign(tradeMarkForm, row)
        imageUrl.value = row.logoUrl
    } else {
        resetForm()
    }
}

const confirmDelete = async (id: number) => {
    console.log(id)
    const res: any = await reqDeleteTradeMark(id)
    if (res.code === 200) {
        ElMessage.success('删除成功')
        getTrademarkList()
    }
    else {
        ElMessage.error(res.message)
    }
}
// 提交表单
const confirmAction = async () => {
    await tradeFormRef.value?.validate()
    const res: any = await reqAddOrUpdateTradeMark(tradeMarkForm)
    if (res.code === 200) {
        ElMessage.success('操作成功')
        dialogVisible.value = false
        getTrademarkList()
    } else {
        ElMessage.error(res.message)
    }
}
</script>

<template>
    <div>
        <el-card class="box-card">
            <div class="content">
                <el-button type="primary" icon="Plus" @click="handleTradeMark()">添加品牌</el-button>
                <el-table :data="tableForm.tableData" border class="table">
                    <el-table-column prop="id" label="序号" width="120" />
                    <el-table-column prop="tmName" label="品牌名称" />
                    <el-table-column prop="logoUrl" label="品牌LOGO">
                        <template #default="{ row }">
                            <el-image :src="row.logoUrl" style="width: 100px; height: 100px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <el-button type="warning" icon="Edit" @click="handleTradeMark(row)">编辑</el-button>
                            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" 
                                title="您确定要删除嘛?" @confirm="confirmDelete(row.id)">
                                <template #reference>
                                    <el-button type="danger" icon="Delete" >删除</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 7, 9]" layout="prev, pager, next, jumper, sizes, total" :total="tableForm.total"
                    @current-change="getTrademarkList" @size-change="getTrademarkList" />
            </div>
        </el-card>

        <!-- 对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500">
            <el-form :model="tradeMarkForm" :rules="rules" ref="tradeFormRef">
                <el-form-item label="品牌名称" prop="tmName">
                    <el-input v-model="tradeMarkForm.tmName" style="width: 95%; margin-left: 1.5vh;" />
                </el-form-item>
                <el-form-item label="品牌LOGO" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmAction">
                    {{ isEdit ? '确定修改' : '确定添加' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.box-card {
    .content {
        padding: 20px;
    }
}

.table {
    margin: 20px 0;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

/* 统一上传样式 */
:deep(.avatar-uploader .el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
