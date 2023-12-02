<template>
  <pre class="code-container">
    <code :class="'language-'+ type" v-html="Prism.highlight(code, Prism.languages[type], type)"></code>
  </pre>
</template>
<script setup lang="ts">
import { onMounted, defineProps } from "vue";
// @ts-ignore
import Prism from "prismjs";
defineProps({
  code: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "html",
  },
});
onMounted(() => {
  Prism.highlightAll(); //切换菜单重新渲染
});
</script>

<style scoped lang="scss">
.code-container {
  background-color: var(--el-fill-color-light);
  margin-top: 8px;
  height: 320px;
  position: relative;
  code {
    // text-shadow: none;
    margin: 0;
    //   padding-top: 0;
    position: absolute;
    left: 16px;
    top: -8px;
  }
}
</style>
