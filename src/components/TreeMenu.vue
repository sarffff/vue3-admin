<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";


const props = defineProps<{ menuList: any[], isCollapse: boolean }>();

// Vue Router 实例
const route = useRoute();
const router = useRouter();

// 计算当前激活的菜单项
const activeMenu = computed(() => route.path);
const openKeys = computed(() => {
  const matched = route.matched.map((item) => item.path);
  return matched.slice(0, matched.length - 1); // 不包含最后一个（当前页面），只保留父级
});

// 处理菜单点击事件，确保高亮
const handleMenuClick = (path: string) => {
  router.push(path);
};
</script>

<template>
  <!-- 绑定 default-active 确保点击高亮 -->
  <el-menu :default-active="activeMenu" :default-openeds="openKeys" :collapse="props.isCollapse" router>
    <template v-for="item in props.menuList" :key="item.path">
      <template v-if="!item.meta.hidden">
        <!-- 一级菜单项 -->
        <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.path"
          @click="handleMenuClick(item.path)">
          <component v-if="item.meta.icon" :is="item.meta.icon" class="menu-icon" />
          <span v-if="!props.isCollapse" class="menu-title">{{ item.meta?.title }}</span>
        </el-menu-item>

        <!-- 只有一个子菜单 -->
        <template v-if="item.children && item.children.length === 1">
          <el-menu-item :index="item.children[0].path" @click="handleMenuClick(item.children[0].path)">
            <component v-if="item.children[0].meta.icon" :is="item.children[0].meta.icon" class="menu-icon" />
            <span v-if="!props.isCollapse" class="menu-title">{{ item.children[0].meta?.title }}</span>
          </el-menu-item>
        </template>

        <!-- 多个子菜单 -->
        <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
          <template #title>
            <!-- 确保图标始终渲染 -->
            <component :is="item.meta.icon" v-if="item.meta.icon" class="menu-icon sub_icon" />
            <span v-if="!props.isCollapse" class="menu-title">
              {{ item.meta?.title }}
            </span>
          </template>
          <TreeMenu :menu-list="item.children" class="child-icon" :isCollapse="props.isCollapse" />
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">
.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}
.el-menu--collapse {
  :deep(.el-sub-menu__title) {
    min-width: 60px;
    padding: 0 10px !important;
    overflow: visible;
  }
  
  .sub_icon {
    margin-right: 0;
    transform: translateX(8px);
  }
}
.menu-title {
  font-size: 16px;
}

.child-icon {
  margin-left: 10px;
}
</style>
