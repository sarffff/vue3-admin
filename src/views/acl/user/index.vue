<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import {
    reqAllUser, reqHandleUser, reqAllRoles,
    reqSetRole, reqDeleteUser, reqDeleteBatchUser
} from '@/api/acl/user'
import type {
    UserData, UserResponseData,
    RoleData, SetRoleData
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
const userList = ref<UserData[]>([])
const getAllUser = async () => {
    const res: UserResponseData = await reqAllUser(currentPage.value, pageSize.value, '')
    if (res.code === 200) {
        userList.value = res.data.records
        total.value = res.data.total
    } else {
        ElMessage.error(res.message)
    }
}
onMounted(() => {
    getAllUser()
})
//添加和编辑用户
let drawer = ref<boolean>(false)
let handleStatus = ref<number>(0) // 0: 添加用户 1: 编辑用户
let userForm = ref<UserData>({
    id: 0,
    name: '',
    username: '',
    password: ''
})
const rules = {
    name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
    username: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }, { min: 3, max: 10, message: '用户名长度在3-10个字符之间', trigger: 'blur' }],
    password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }, { min: 6, max: 20, message: '密码长度在6-16个字符之间', trigger: 'blur' }]
}

const userFormRef = ref()
const handelAddUser = () => {
    drawer.value = true
    handleStatus.value = 0
    Object.assign(userForm.value, {
        id: 0,
        name: '',
        username: '',
        password: ''
    })
}
const handelEditUser = async (row: UserData) => {
    drawer.value = true
    handleStatus.value = 1
    Object.assign(userForm.value, {
        id: row.id,
        name: row.name,
        username: row.username,
        password: ''
    })
}
let loading = ref<boolean>(false)
const handelUserInfo = async () => {
    const valid = await userFormRef.value.validate()
    if (!valid) return
    try {
        loading.value = true

        const res: UserResponseData = await reqHandleUser(userForm.value)
        if (res.code === 200) {
            ElMessage.success(handleStatus.value === 0 ? '添加成功' : '修改成功')
            getAllUser()
            drawer.value = false
        } else {
            ElMessage.error(res.message)
        }
    } catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    } finally {
        loading.value = false
    }
}
//分配角色
let drawer1 = ref<boolean>(false)
let checkAllRoles = ref<boolean>(false)
let isIndeterminate = ref<boolean>(false)
let checkedRoles = ref<RoleData[]>([])
let AllRoles = ref<RoleData[]>([])
const handleCheckAllRoles = (value: boolean) => {
    checkedRoles.value = value ? AllRoles.value : []
    isIndeterminate.value = false
}
const handleCheckedRoles = (value: string[]) => {
    const checkedCount = value.length
    checkAllRoles.value = checkedCount === AllRoles.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < AllRoles.value.length
}
const handleRole = async (row: UserData) => {
    drawer1.value = true
    userForm.value = row
    let id = Number(row.id)
    let res = await reqAllRoles(id)
    if (res.code === 200) {
        AllRoles.value = res.data.allRolesList
        checkedRoles.value = res.data.assignRoles
    }
    else {
        ElMessage.error(res.message)
    }
}
let assignRoles = reactive<SetRoleData>({
    userId: 0,
    roleIdList: []
})
const handelAssignRole = async () => {
    assignRoles.userId = userForm.value.id as number
    assignRoles.roleIdList = checkedRoles.value.map(role => role.id) as number[]
    loading.value = true
    try {
        let res = await reqSetRole(assignRoles)
        if (res.code === 200) {
            ElMessage.success('分配角色成功')
            getAllUser()
            drawer1.value = false
        }
        else {
            ElMessage.error(res.message)
        }
    }
    catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    }
    finally {
        loading.value = false
        Object.assign(assignRoles, { userId: 0, roleIdList: [] })
    }
}
//批量删除和删除
//批量删除用户id列表
let selectedUser = ref<number[]>([])
const handleChange = (selection: UserData[]) => {
    selectedUser.value = selection.map(user => user.id) as number[]
}
//删除单个用户
const confirmDelete = async (row: UserData) => {
    let id = Number(row.id)
    try {
        let res = await reqDeleteUser(id)
        if (res.code === 200) {
            ElMessage.success('删除成功')
            getAllUser()
        }
        else {
            ElMessage.error(res.message)
        }
    }
    catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    }
}
//批量删除用户
const confirmDeleteBatch = async () => {
    try {
        let res = await reqDeleteBatchUser(selectedUser.value)
        if (res.code === 200) {
            ElMessage.success('批量删除成功')
            getAllUser()
        }
        else {
            ElMessage.error(res.message)
        }
    }
    catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    }
}
//查询和重置
let searchName = ref<string>('')
const searchUsers = async () => {
    try {
        let res = await reqAllUser(currentPage.value, pageSize.value, searchName.value)
        if (res.code === 200) {
            userList.value = res.data.records
            total.value = res.data.total
        }
        else {
            ElMessage.error(res.message)
        }
    }
    catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    }
    finally {
        searchName.value = ''
    }
}
const handleReset = () => {
    searchName.value = ''
    currentPage.value = 1
    pageSize.value = 3
    getAllUser()
}
</script>

<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名">
                <el-input v-model="searchName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="searchUsers"
                    :disabled="searchName === ''">查询</el-button>
                <el-button type="info" icon="RefreshRight" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card>
        <el-button type="primary" icon="Plus" @click="handelAddUser">添加</el-button>
        <el-button type="danger" icon="Delete" :disabled="selectedUser.length === 0"
            @click="confirmDeleteBatch">批量删除</el-button>
        <el-table :data="userList" style="margin: 20px 0" border @selection-change="handleChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="#" type="index" width="80" align="center" />
            <el-table-column label="id" prop="id" width="80" align="center" />
            <el-table-column label="用户名字" prop="name" width="150" align="center" />
            <el-table-column label="用户昵称" prop="username" width="150" align="center" />
            <el-table-column label="用户角色" prop="roleName" align="center" show-overflow-tooltip />
            <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip />
            <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip />
            <el-table-column label="操作" align="center" width="350">
                <template #default="{ row }">
                    <el-button type="primary" icon="User" size="small" @click="handleRole(row)">分配角色</el-button>
                    <el-button type="success" icon="Edit" size="small" @click="handelEditUser(row)">编辑</el-button>
                    <el-popconfirm width="220" icon="InfoFilled" icon-color="#626AEF" title="你确认删除该用户嘛?"
                        @confirm="confirmDelete(row)">
                        <template #reference>
                            <el-button type="danger" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @size-change="getAllUser"
        @current-change="getAllUser" />
    <el-drawer v-model="drawer" :title="handleStatus === 0 ? '添加用户' : '编辑用户'">
        <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
            <el-form-item label="用户姓名" prop="name">
                <el-input v-model="userForm.name" placeholder="请输入用户姓名" />
            </el-form-item>
            <el-form-item label="用户昵称" prop="username">
                <el-input v-model="userForm.username" placeholder="请输入用户昵称" />
            </el-form-item>
            <el-form-item v-if="handleStatus === 0" label="用户密码" prop="password">
                <el-input v-model="userForm.password" placeholder="请输入用户密码" type="password" />
            </el-form-item>
        </el-form>

        <div class="footer">
            <el-button :loading="loading" type="primary" size="large" @click="handelUserInfo">
                {{ handleStatus === 0 ? '确认添加' : '确认修改' }}
            </el-button>

            <el-button type="info" size="large" @click="drawer = false">取消</el-button>
        </div>
    </el-drawer>
    <!-- 分配角色 -->
    <el-drawer v-model="drawer1" title="分配角色">
        <el-descriptions :column="1" border>
            <el-descriptions-item label="用户姓名" label-width="100px">
                <span>{{ userForm.name }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="角色列表">
                <el-checkbox v-model="checkAllRoles" :indeterminate="isIndeterminate" @change="handleCheckAllRoles">
                    全选
                </el-checkbox>
                <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRoles">
                    <el-checkbox v-for="role in AllRoles" :label="role">
                        {{ role.roleName }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-descriptions-item>
        </el-descriptions>
        <div class="footer">
            <el-button :loading="loading" type="success" size="large" @click="handelAssignRole">
                确认分配
            </el-button>
            <el-button type="info" size="large" @click="drawer = false">取消</el-button>
        </div>
    </el-drawer>
</template>

<style lang="scss" scoped>
.form {
    display: flex;
    justify-content: space-between;
}

.footer {
    display: flex;
    justify-content: flex-end;
    margin: 30px 30px 0 0;
}
</style>