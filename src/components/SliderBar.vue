<script lang="ts" setup>
import treemenu from './TreeMenu.vue'
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const menuList = userStore.menuRoutes
defineProps(['isCollapse'])

</script>

<template>
    <el-scrollbar class="scrollbar">
        <el-menu class="menu" background-color="#001529" text-color="#fff">
            <treemenu :menuList="menuList" :isCollapse="isCollapse"/>
        </el-menu>
    </el-scrollbar>
</template>

<style lang="scss" scoped>
.scrollbar {
    height: calc(100% - 50px);
    margin-top: 10px;
    .el-menu{
        border-right: none;
    }

    .menu .el-menu-item:hover{
        background-color: #0c2135;
    }

    .menu .el-menu-item span,
    .menu .el-sub-menu span{
        margin-left: 5px;
        font-size: 16px;
    }
}
</style>