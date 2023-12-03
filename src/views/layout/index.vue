<template>
  <div class="layout-container">
    <el-container style="height: 100vh">
      <el-aside
        width="auto"
        :style="{
          zIndex: indexFlag ? '2007' : 'unset',
          overflow: 'hidden',
          position: indexFlag ? 'fixed' : 'unset',
        }"
      >
        <Menu></Menu>
      </el-aside>
      <el-container class="right-container">
        <el-header style="padding: 0">
          <Tabbar></Tabbar>
        </el-header>
        <el-main :style="{ marginLeft: indexFlag ? '64px' : '0' }">
          <router-view v-slot="{ Component }">
            <Transition name="router">
              <keep-alive v-if="!refreshFlag">
                <component :is="Component"></component>
              </keep-alive>
            </Transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
// 导入左侧菜单
import Menu from "./Menu.vue";
// 导入顶部导航
import Tabbar from "./Tabbar.vue";
// 导入参数仓库
import useSettingStore from "@/store/modules/setting";
// 导入用户仓库
// import useUserStore from "@/store/modules/user";

// 使用参数仓库的刷新状态
let settingStore = useSettingStore();

// 组件销毁状态
let refreshFlag = ref(false);

// 移动端适配，菜单展开时右边隐藏
let indexFlag = ref(false);
const handleResize2 = () => {
  // 获取当前窗口宽度
  const screenWidth = window.innerWidth;

  // 根据窗口宽度进行判断
  if (screenWidth <= 768) {
    indexFlag.value = true;
  } else {
    indexFlag.value = false;
  }
};

onMounted(() => {
  handleResize2(); // 初始加载时进行一次判断
  window.addEventListener("resize", handleResize2);
  // 刷新路由
  watch(
    () => settingStore.refresh,
    () => {
      if (settingStore.refresh == true) {
        refreshFlag.value = true;
        nextTick(() => {
          refreshFlag.value = false;
        });
      }
    }
  );
  watch(
    () => settingStore.isCollapse,
    () => {
      handleResize2();
    }
  );
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize2);
});
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
  .el-main {
    padding: 20px;
  }
  .el-aside {
    overflow: hidden;
  }
  .right-container {
    transition: width 0.3s;
  }
}
</style>
