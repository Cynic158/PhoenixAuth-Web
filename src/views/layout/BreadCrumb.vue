<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="item in $route.matched"
        :key="item.path"
        :to="{ path: item.path }"
        v-show="item.path != '/'"
      >
        <el-icon size="18" style="vertical-align: sub">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span style="margin: 0 4px">{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
// 导入路由
import { useRoute } from "vue-router";

// 面包屑部分
// 使用路由
let $route = useRoute();
</script>

<style scoped lang="scss">
@media only screen and (max-width: 992px) {
  .breadcrumb-container {
    display: none;
  }
}
.el-breadcrumb {
  margin-left: 12px;
}
</style>
