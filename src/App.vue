<template>
  <div>
    <!-- <svg-icon name="test"></svg-icon> -->
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
// 使用中文的element组件
// @ts-ignore
import { ElConfigProvider } from "element-plus";
// @ts-ignore
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const locale = zhCn;
</script>

<style lang="scss">
#nprogress .bar {
  background: #29d;
}
</style>
