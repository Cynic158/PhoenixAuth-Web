<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">Robot信息</div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useHelperStore from "@/store/modules/helper";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
import { ref } from "vue";

// bot信息部分
// 使用bot仓库
let helperStore = useHelperStore();
// bot信息列数
</script>

<style scoped></style>
