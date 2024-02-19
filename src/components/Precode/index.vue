<template>
  <pre :class="'code-container language-'+type"><code>{{ code }}</code></pre>
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
    default: "none",
  },
});
onMounted(() => {
  Prism.highlightAll(false);
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
