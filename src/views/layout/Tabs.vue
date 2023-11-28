<template>
  <div class="tags-container">
    <el-scrollbar>
      <div class="tag-container">
        <el-tag
          v-for="item in tabArr"
          :key="item.path"
          size="large"
          closable
          @close="closeTab(item.path)"
          @click="routertab(item.path)"
          >{{ item.title }}</el-tag
        >
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
// 导入参数仓库
import useSettingStore from "@/store/modules/setting";
// 导入路由
import { useRoute, useRouter } from "vue-router";
// 导入缓动函数
import { horizontalScroll } from "@/utils";
import { onMounted, watch } from "vue";

interface tabType {
  path: string;
  title: string;
}

// 使用参数仓库的标签对象数组
let settingStore = useSettingStore();
let tabArr = settingStore.tabArr as Array<tabType>;
// 获取当前路由路径
let $route = useRoute();
// 获取路由
let $router = useRouter();

// 关闭标签函数
let closeTab = (path: string) => {
  tabArr.forEach((item, index) => {
    if (path == item.path) {
      settingStore.tabArr.splice(index, 1);
    }
  });
};

// 标签跳转函数
let routertab = (path: string) => {
  $router.push(path);
};

onMounted(() => {
  // 获取滚动条以及标签组
  // @ts-ignore
  let scrollEl = document.querySelector(".tags-container .el-scrollbar")
    .children[0];
  let tagContainer = document.querySelector(".tag-container");
  watch(
    () => $route.path,
    () => {
      let addFlag = false;

      tabArr.forEach((item) => {
        if ($route.path == item.path) {
          addFlag = true;
        }
      });
      if (addFlag == false) {
        tabArr.push({
          path: $route.path,
          title: $route.meta.title as string,
        });
        setTimeout(() => {
          horizontalScroll(scrollEl as Element, tagContainer as Element);
        }, 400);
      }
    },
    {
      immediate: true,
    }
  );
});
</script>

<style scoped lang="scss">
.el-tag {
  margin-right: 12px;
  user-select: none;
  cursor: pointer;
}
.el-scrollbar {
  width: 100%;
}
.tags-container {
  margin-left: 20px;
  width: calc(100% - 60px);
}
.tag-container {
  height: $size-tabbar-height;
  display: flex;
  align-items: center;
  width: fit-content;
}
</style>
