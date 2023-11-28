<template>
  <div class="layout-container">
    <el-container style="height: 100vh">
      <el-aside width="auto" style="overflow: hidden">
        <Menu></Menu>
      </el-aside>
      <el-container class="right-container">
        <el-header style="padding: 0">
          <Tabbar></Tabbar>
        </el-header>
        <el-main>
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
import { nextTick, onMounted, ref, watch } from "vue";
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

onMounted(() => {
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
