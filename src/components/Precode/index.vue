<template>
  <pre
    class="code-container"
  ><code :class="'language-'+ type" v-html="Prism.highlight(code, Prism.languages[type], type)"></code></pre>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
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
  margin-top: 12px;
  code {
    line-height: 1.2;
  }
}
</style>
