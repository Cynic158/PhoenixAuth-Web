<template>
  <div>
    <template v-for="item in menuList" :key="item.path">
      <!-- 无子节点 -->
      <el-menu-item
        v-if="!item.children && !item.meta.hidden"
        :index="item.path"
      >
        <!-- <el-icon><document /></el-icon> -->
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
      <!-- 节点为layout时直接进行递归，渲染出根菜单项 -->
      <MenuItem
        v-if="item.name == 'layout'"
        :menuList="item.children"
      ></MenuItem>
      <!-- 有子节点 -->
      <el-sub-menu v-if="item.children && !item.meta.hidden" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <MenuItem :menuList="item.children"></MenuItem>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps(["menuList"]);
</script>
<script lang="ts">
export default {
  name: "MenuItem",
};
</script>

<style scoped lang="scss"></style>
