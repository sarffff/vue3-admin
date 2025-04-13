<script lang="ts" setup>
import { ref, onMounted, nextTick, watch, reactive } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { reqAllPermissions, reqAddPermission, reqUpdatePermission,reqDeletePermission } from '@/api/acl/menu'
import type {
    PermissionData, AllPermissionResponseData,
    MenuParams
} from '@/api/acl/menu/type'
let permissionsData = ref<PermissionData[]>([])
let isFetching = ref<boolean>(false)
const getPermissions = async () => {
    if (isFetching.value) return
    isFetching.value = true
    try {
        const res: AllPermissionResponseData = await reqAllPermissions()
        if (res.code === 200) {
            ElMessage.success('获取权限数据成功')
            permissionsData.value = res.data
        } else {
            ElMessage.error(res.message)
        }
    } catch (error) {
        ElMessage.error('获取权限数据失败')
    }
    finally {
        isFetching.value = false
    }
}
onMounted(() => {
    getPermissions()
})
//添加权限和编辑权限
let dialogVisible = ref<boolean>(false)
let permissionsForm = ref<MenuParams>({
    id: 0,
    name: '',
    code: '',
    level: 0,
    pid: 0,
})
const rules = {
    name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入权限值', trigger: 'blur' }],
}
const permissionsFormRef = ref<InstanceType<typeof ElForm>>()
const resetForm = () => {
    Object.assign(permissionsForm, {
        id: 0,
        name: '',
        code: '',
        level: 0,
        pid: 0
    })
}
const addPeimission = (row: PermissionData) => {
    permissionsForm.value = { ...row, id: 0, name: '', code: '' }
    dialogVisible.value = true
}
const editPermission = (row: PermissionData) => {
    permissionsForm.value = { ...row }
    dialogVisible.value = true
}
const confirmOperate = async () => {
    if (!permissionsFormRef.value) return
    if (!isFetching) return
    isFetching.value = true
    try {
        if (permissionsForm.value.id != 0) {
            let res = await reqUpdatePermission(permissionsForm.value)
            if (res.code === 200) {
                ElMessage.success('编辑权限成功')
                dialogVisible.value = false
            }
            else {
                ElMessage.error(res.message)
            }
        }
        else {
            let res = await reqAddPermission(permissionsForm.value)
            if (res.code === 200) {
                ElMessage.success('添加权限成功')
                dialogVisible.value = false
            }
            else {
                ElMessage.error(res.message)
            }
        }
    } catch (error) {
        ElMessage.error('请求出错，请稍后重试')
    } finally {
        isFetching.value = false
        getPermissions()
    }
}
watch(dialogVisible, (newVal) => {
    if (!newVal) {
        nextTick(() => {
            resetForm()
        })
    }
})
const confirmDelete = async (row: PermissionData) => {
    let res = await reqDeletePermission(row.id as number)
    if (res.code === 200) {
        ElMessage.success('删除成功')
        getPermissions()
    }
}
</script>

<template>
    <el-table :data="permissionsData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
        <el-table-column label="名称" prop="name" />
        <el-table-column label="权限值" prop="code" />
        <el-table-column label="修改时间" prop="updateTime" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button color="#626aef" size="small" :disabled="row.level === 4" @click="addPeimission(row)">{{
                    row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
                <el-button type="info" size="small" :disabled="row.level === 1"
                    @click="editPermission(row)">编辑</el-button>
                <el-popconfirm width="220" icon="InfoFilled" icon-color="#626AEF" title="你确认删除该权限嘛?"
                        @confirm="confirmDelete(row)">
                        <template #reference>
                            <el-button type="danger" size="small" :disabled="row.level === 1">删除</el-button>
                        </template>
                    </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="permissionsForm.id ? '编辑权限' : ' 添加权限'" width="500">
        <el-form :model="permissionsForm" ref="permissionsFormRef" :rules="rules" label-width="80px">
            <el-form-item label="权限名称" prop="name">
                <el-input v-model="permissionsForm.name" placeholder="请输入权限名称" />
            </el-form-item>
            <el-form-item label="权限值" prop="code">
                <el-input v-model="permissionsForm.code" placeholder="请输入权限值" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmOperate"
                    :disabled="permissionsForm.name === '' || permissionsForm.code === ''">
                    {{ permissionsForm.id != 0 ? '确认编辑' : '确认添加' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>