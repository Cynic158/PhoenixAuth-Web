<template>
  <div class="logo-container">
    <!-- <img :src="setting.logoImage" alt=""> -->
    <svg-icon
      name="vite"
      width="40px"
      height="40px"
      class="logo-img"
    ></svg-icon>
    <p class="logo-title">{{ setting.logoTitle }}</p>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import setting from "@/setting.ts";
</script>

<style scoped lang="scss">
.logo-container {
  width: 100%;
  height: $size-logo-container-height;
  box-sizing: border-box;
  overflow: hidden;
  .logo-img {
    margin: 10px;
    margin-right: 14px;
    position: relative;
    :deep(svg) {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .logo-title {
    width: calc(100% - 66px);
    overflow: hidden;
    display: inline-block;
    line-height: $size-logo-container-height;
    vertical-align: top;
    font-size: 20px;
  }
}
</style>
