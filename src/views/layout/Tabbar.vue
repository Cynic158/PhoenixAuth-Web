<template>
  <div class="tabbar-container">
    <!-- 折叠按钮以及面包屑 -->
    <div class="tabbar-left">
      <!-- 折叠按钮 -->
      <el-icon
        v-if="!settingStore.isCollapse"
        style="cursor: pointer"
        size="24"
        @click="menuFold"
        ><Fold
      /></el-icon>
      <!-- 展开按钮 -->
      <el-icon
        v-if="settingStore.isCollapse"
        style="cursor: pointer"
        size="24"
        @click="menuFold"
        ><Expand
      /></el-icon>
      <!-- 面包屑 -->
      <BreadCrumb v-if="settingStore.useBreadCrumb"></BreadCrumb>
      <!-- 标签页 -->
      <Tabs v-if="settingStore.useTabs"></Tabs>
    </div>
    <!-- 功能按钮组以及头像 -->
    <div class="tabbar-right">
      <!-- 全屏按钮 -->
      <el-button circle size="large" class="funcBtn" @click="screenFunc">
        <el-icon size="18"><FullScreen /></el-icon>
      </el-button>
      <!-- 设置按钮 -->
      <el-button circle size="large" class="funcBtn" @click="showSetting">
        <el-icon size="18"><Setting /></el-icon>
      </el-button>
      <!-- 风格切换按钮 -->
      <el-button
        circle
        size="large"
        :icon="dark ? 'Moon' : 'Sunny'"
        @click="switchDark"
      ></el-button>
      <!-- 刷新按钮 -->
      <el-button circle size="large" @click="refreshFunc">
        <el-icon size="18"><Refresh /></el-icon>
      </el-button>
      <!-- 用户名以及退出登录 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.uname }}
          <el-icon><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="confirmLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-drawer v-model="drawer" title="页面设置">
      <div class="setting-container">
        <el-row class="setting-theme">
          <el-col :span="12">主题切换</el-col>
          <el-col :span="12">
            <el-color-picker
              v-model="themeColor"
              :predefine="predefineColors"
              @change="setTheme"
            />
          </el-col>
        </el-row>
        <el-row class="setting-tabbar">
          <el-col :span="12">导航切换</el-col>
          <el-col :span="12">
            <el-select v-model="selectTabbar" @change="setTabbar">
              <el-option label="面包屑" value="0" />
              <el-option label="标签页" value="1" />
              <el-option label="禁用" value="2" />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <el-dialog
      :width="settingStore.createDialogWidth"
      v-model="dialogVisible"
      title="退出登录"
      align-center
      append-to-body
    >
      <span>确定要退出登录吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="logoutFunc">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入参数仓库
import useSettingStore from "@/store/modules/setting";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入路由
import { useRouter } from "vue-router";
// 导入面包屑
import BreadCrumb from "./BreadCrumb.vue";
// 导入标签页
import Tabs from "./Tabs.vue";
// element的消息通知组件
import { ElNotification } from "element-plus";
import { nextTick, ref } from "vue";

// 使用用户仓库的用户名
let userStore = useUserStore();
// 使用参数仓库的折叠状态以及导航切换
let settingStore = useSettingStore();
// 使用路由
let $router = useRouter();

// 设置部分
// 设置抽屉展开
let drawer = ref(false);
let showSetting = () => {
  drawer.value = true;
};
// 设置暗黑模式
let dark = ref(localStorage.getItem("DARKMODE") === "true");
let switchDark = () => {
  dark.value = !dark.value;
  setDark();
};
let setDark = () => {
  document.documentElement.className = dark.value ? "dark" : "";
  localStorage.setItem("DARKMODE", dark.value.toString());
};
// if (window.innerWidth <= 768 || (window.matchMedia('(hover: none) and (pointer: coarse)').matches)) {
//   // 移动端暗黑模式设置函数
//   let setupMobileDarkmode = function () {
//     dark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     setDark();
//   };
//   // 监听移动端系统主题变化
//   window
//     .matchMedia("(prefers-color-scheme: dark)")
//     .addEventListener("change", setupMobileDarkmode);
//   // 移动端首次触发
//   setupMobileDarkmode();
// } else {
//   // PC端首次触发
//   setDark();
// }
setDark();
// 设置主题
let themeColor = ref(localStorage.getItem("THEMECOLOR") || "#409EFF");
// 颜色预设
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "#409EFF",
]);
let setTheme = () => {
  let el = document.documentElement;
  if (!themeColor.value) {
    themeColor.value = "#409EFF";
  }
  el.style.setProperty("--el-color-primary", themeColor.value);
  localStorage.setItem("THEMECOLOR", themeColor.value);
};
// 首次触发
setTheme();
// 设置导航
let selectTabbar = ref("面包屑");
let setTabbar = (val: number) => {
  if (val == 0) {
    // 切换成面包屑
    settingStore.switchBreadCrumb();
  } else if (val == 1) {
    // 切换成标签页
    settingStore.switchTabs();
  } else if (val == 2) {
    // 禁用
    settingStore.banTabbar();
  }
  localStorage.setItem("TABBAR", val.toString());
};
// 首次触发
switch (Number(localStorage.getItem("TABBAR")) || 0) {
  case 0: {
    setTabbar(0);
    selectTabbar = ref("面包屑");
    break;
  }
  case 1: {
    setTabbar(1);
    selectTabbar = ref("标签页");
    break;
  }
  case 2: {
    setTabbar(2);
    selectTabbar = ref("禁用");
    break;
  }
}

// 退出登录部分
let dialogVisible = ref(false);
let confirmLogout = () => {
  dialogVisible.value = true;
};

// 折叠部分
// 向参数仓库发起折叠请求
let menuFold = () => {
  settingStore.reqCollapse++;
};

// 按钮组部分
// 刷新部分
let refreshFunc = () => {
  settingStore.refresh = true;
  nextTick(() => {
    settingStore.refresh = false;
  });
};
// 全屏部分
let screenFunc = () => {
  // 判断当前是否全屏
  let fullFlag = document.fullscreenElement;
  if (!fullFlag) {
    // 切换全屏
    document.documentElement.requestFullscreen();
  } else {
    // 退出全屏
    document.exitFullscreen();
  }
};
// 登出部分
let logoutFunc = async () => {
  dialogVisible.value = false;
  try {
    // 由仓库发起请求
    let result = await userStore.userLogout();
    if (result.success) {
      // 请求成功，登出
      $router.push("/login");
      // 消息提示
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {}
};
</script>

<style scoped lang="scss">
@media only screen and (max-width: 768px), (hover: none) and (pointer: coarse) {
  .funcBtn {
    display: none;
  }
  :deep(.el-drawer) {
    display: none;
  }
}
.tabbar-container {
  //   background-color: blueviolet;
  user-select: none;
  -webkit-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  border-bottom: 1px solid var(--el-menu-border-color);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbar-left {
    margin-left: 20px;
    display: flex;
    align-items: center;
    width: calc(100% - 450px);
  }
  .tabbar-right {
    display: flex;
    align-items: center;
    .el-avatar {
      margin-left: 28px;
      border: 2px solid var(--el-color-primary);
    }
    .el-dropdown {
      margin-left: 12px;
      margin-right: 10px;
      .el-dropdown-link {
        display: flex;
        align-items: center;
        .el-icon {
          margin-left: 6px;
        }
      }
    }
  }
  .setting-container {
    padding: 0 10px;
    .setting-theme,
    .setting-tabbar {
      height: 50px;
      line-height: 50px;
      .el-col:nth-of-type(2) {
        display: flex;
        justify-content: right;
        align-items: center;
      }
    }
  }
}
</style>
