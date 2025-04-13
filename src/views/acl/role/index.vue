<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick, watch } from 'vue'
import { ElMessage, ElTree } from 'element-plus'

import {
    reqGetAllRoles, reqAddOrUpdateRole,
    reqGetAllPermissions, reqSetPermissions,
    reqDeleteRole
} from '@/api/acl/role'
import type {
    AllRolesResponseData, RoleListData,
    AllPermissionResponseData, PermissionData
} from '@/api/acl/role/type'
import { ca } from 'element-plus/es/locales.mjs'
//获取职位列表
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let roleList = ref<RoleListData[]>([])
let isFetching = false; // 标识是否正在发送请求
const getAllRoles = async (roleName: string) => {
    if (isFetching) {
        return;
    }
    isFetching = true;
    try {
        let res: AllRolesResponseData = await reqGetAllRoles(currentPage.value, pageSize.value, roleName);
        if (res.code === 200) {
            roleList.value = res.data.records;
            total.value = res.data.total;
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        ElMessage.error('请求出错，请稍后重试');
    } finally {
        isFetching = false;
    }
};
onMounted(() => {
    getAllRoles('')
})
//分配权限
let drawer = ref<boolean>(false)
let permissionsData = ref<PermissionData[]>([])
let selectedId = ref<number>(0)
const defaultProps = {
    children: 'children',
    label: 'name',
}
// 添加 Tree 组件引用
const treeRef = ref<InstanceType<typeof ElTree>>();
// 监听抽屉状态变化
watch(drawer, (newVal) => {
    if (!newVal) { // 当抽屉关闭时
        nextTick(() => {
            // 清空所有勾选状态
            treeRef.value?.setCheckedKeys([]);
        });
    }
});
const handlePermission = async (row: RoleListData) => {
    drawer.value = true;
    selectedId.value = row.id as number;
    // 获取权限数据
    let res: AllPermissionResponseData = await reqGetAllPermissions(row.id as number);
    if (res.code === 200) {
        permissionsData.value = res.data;

        // 等待 DOM 更新后操作 Tree
        nextTick(() => {
            // 提取所有 select: true 的节点 ID
            const checkedIds = getCheckedIds(permissionsData.value);
            // 设置勾选状态
            treeRef.value?.setCheckedKeys(checkedIds);
        });
    } else {
        ElMessage.error(res.message);
    }
};

// 递归提取 select=true 的节点 ID
const getCheckedIds = (data: PermissionData[]): number[] => {
    return data.reduce((acc: number[], node) => {
        if (node.select) {
            acc.push(node.id as number);
        }
        if (node.children) {
            acc.push(...getCheckedIds(node.children));
        }
        return acc;
    }, []);
};
const confirmPermission = async () => {
    if (isFetching) {
        return
    }
    isFetching = true
    try {
        if (treeRef.value) {
            let checkArr = treeRef.value.getCheckedKeys()
            let checkArr1 = treeRef.value.getHalfCheckedKeys()
            let allChecked = checkArr1.concat(checkArr)
            console.log(allChecked)
            let res = await reqSetPermissions(selectedId.value, allChecked as number[])
            if (res.code === 200) {
                ElMessage.success('分配权限成功')
                drawer.value = false
            } else {
                ElMessage.error(res.message)
            }
        }
    }
    catch (error) {
        ElMessage.error('请求出错，请稍后重试')
    } finally {
        isFetching = false
    }
}
//添加职位
let dialogVisible = ref<boolean>(false)
let rolesForm = reactive<RoleListData>({
    id: 0,
    roleName: ''
})
let rules = {
    roleName: [
        { required: true, message: '请输入职位名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符之间', trigger: 'blur' }
    ]
}
const confirmAddRole = async () => {
    if (rolesForm.roleName === '') {
        ElMessage.warning('请输入职位名称')
        return
    }
    if (isFetching) {
        return
    }
    isFetching = true
    try {
        let res = await reqAddOrUpdateRole(rolesForm)
        if (res.code === 200) {
            ElMessage.success(rolesForm.id ? '编辑成功' : '添加成功')
            dialogVisible.value = false
        } else {
            ElMessage.error(res.message)
        }
    }
    catch (error) {
        ElMessage.error('请求出错，请稍后重试')
    } finally {
        getAllRoles('')
        isFetching = false
    }
}
const handleAddRole = () => {
    dialogVisible.value = true
    nextTick(() => {
        Object.assign(rolesForm, {
            id: 0,
            roleName: ''
        })
    })
}
//编辑职位
const handelEditRole = (row: any) => {
    dialogVisible.value = true
    Object.assign(rolesForm, {
        id: row.id,
        roleName: row.roleName
    })
}
//删除职位
const confirmDelete = async(row: any) => {
    if(isFetching) {
        return
    }
    isFetching = true
    try {
        let res = await reqDeleteRole(row.id as number)
        if (res.code === 200) {
            ElMessage.success('删除成功')
            getAllRoles('')
        } else {
            ElMessage.error(res.message)
        }
    }
    catch (error) {
        ElMessage.error('请求出错，请稍后重试')
    } finally {
        isFetching = false
    }
}
//查询和重置
let searchRole = ref<string>('')
const searchUsers = async () => {
    if (searchRole.value === '') {
        ElMessage.warning('请输入职位关键词')
        return
    }
    getAllRoles(searchRole.value)
    searchRole.value = ''
}
const handleReset = () => {
    searchRole.value = ''
    currentPage.value = 1
    pageSize.value = 10
    getAllRoles('')
}

</script>

<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索">
                <el-input v-model="searchRole" placeholder="请输入职位关键词" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="searchUsers"
                    :disabled="searchRole === ''">查询</el-button>
                <el-button type="info" icon="RefreshRight" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card>
        <el-button type="primary" icon="Plus" @click="handleAddRole">添加职位</el-button>
        <el-table :data="roleList" style="margin: 20px 0" border>
            <el-table-column label="#" type="index" width="80" align="center" />
            <el-table-column label="id" prop="id" width="80" align="center" />
            <el-table-column label="角色名称" prop="roleName" width="150" align="center" />
            <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip />
            <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip />
            <el-table-column label="操作" align="center" width="350">
                <template #default="{ row }">
                    <el-button type="primary" icon="User" size="small" @click="handlePermission(row)">分配权限</el-button>
                    <el-button type="success" icon="Edit" size="small" @click="handelEditRole(row)">编辑</el-button>
                    <el-popconfirm width="220" icon="InfoFilled" icon-color="#626AEF" title="你确认删除该用户嘛?"
                        @confirm="confirmDelete(row)">
                        <template #reference>
                            <el-button type="danger" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @size-change="getAllRoles('')" @current-change="getAllRoles('')" />
    </el-card>
    <!-- 添加职位弹窗 -->
    <el-dialog v-model="dialogVisible" :title="rolesForm.id ? '编辑职位' : '添加职位'" width="500">
        <el-form :model="rolesForm" label-width="80px" :rules="rules">
            <el-form-item label="职位名称" prop="roleName">
                <el-input v-model="rolesForm.roleName" placeholder="请输入职位名称" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmAddRole" :disabled="rolesForm.roleName === ''">
                    {{ rolesForm.id ? '确认编辑' : '确认添加' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 添加职位抽屉 -->
    <el-drawer v-model="drawer" title="分配菜单权限">
        <el-tree ref="treeRef" style="max-width: 600px" :data="permissionsData" show-checkbox node-key="id"
            highlight-current :props="defaultProps" />
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="success" @click="confirmPermission">确认分配</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<style lang="scss" scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>