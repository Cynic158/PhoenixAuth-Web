<template>
  <div style="height: 100%">
    <!-- <svg-icon name="test"></svg-icon> -->
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
// 使用中文的element组件
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
const locale = zhCn;
</script>

<style lang="scss">
#nprogress .bar {
  background: #29d;
}
html,
body,
#app {
  height: 100%;
}
</style>
