<template>
  <div>
    <!-- 菜单项 -->
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      :collapse="settingStore.isCollapse"
      :router="true"
    >
      <!-- logo -->
      <el-sub-menu index="0" class="logo" popper-class="banpopper">
        <template #title>
          <Logo></Logo>
        </template>
      </el-sub-menu>

      <!-- 让菜单可以滚动容纳更多的菜单项 -->
      <el-scrollbar style="position: relative">
        <!-- 折叠菜单按钮 -->
        <el-sub-menu
          index="0"
          @click="foldMenu"
          class="fold-btn"
          popper-class="banpopper"
          style="
            position: sticky;
            top: 0px;
            z-index: 2;
            background-color: var(--el-bg-color);
          "
        >
          <template #title>
            <el-icon size="18" v-if="!settingStore.isCollapse"
              ><Back
            /></el-icon>
            <el-icon size="18" v-if="settingStore.isCollapse"
              ><Right
            /></el-icon>
            <span>折叠菜单</span>
          </template>
        </el-sub-menu>
        <MenuItem
          :menuList="userStore.menuRoutes"
          @click="mmenuFold"
        ></MenuItem>
      </el-scrollbar>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
// 导入logo
import Logo from "./Logo.vue";
// 导入动态菜单项组件
import MenuItem from "./MenuItem.vue";
// 导入icon
import { Back, Right } from "@element-plus/icons-vue";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入参数仓库
import useSettingStore from "@/store/modules/setting";
// 导入路由
import { useRoute } from "vue-router";
// 导入缓动函数
import { verticalScroll } from "@/utils";
import { onMounted, watch } from "vue";

// 动态菜单项部分
// 使用用户仓库的动态路由列表
let userStore = useUserStore();
// 使用参数仓库的折叠状态
let settingStore = useSettingStore();
// 获取当前路由路径
let $route = useRoute();

// 折叠部分
// 折叠节流阀
let foldFlag = false;
// 折叠透明度函数
let closeOpacity = () => {
  // 将所有菜单项的标题隐藏
  (
    document.querySelectorAll(
      ".el-menu-vertical-demo span"
    ) as NodeListOf<HTMLSpanElement>
  ).forEach((item) => {
    item.style.opacity = "0";
  });
  // 关闭节流阀
  setTimeout(() => {
    foldFlag = false;
    if (settingStore.mmenuFlag == true) {
      (document.querySelector(".el-aside") as HTMLDivElement).style.left =
        "-64px";
    }
    // 禁止横向滚动事件
    function addScrollListener() {
      // 尝试获取元素
      const element = document.querySelector(".el-menu .el-scrollbar__wrap");

      // 如果元素存在
      if (element) {
        // 添加滚动事件监听器
        element.addEventListener("scroll", function () {
          element.scrollLeft = 0;
        });

        // 停止定时器
        clearInterval(checkElementInterval);
      }
    }

    // 设置定时器，每隔100毫秒检查元素是否存在
    const checkElementInterval = setInterval(addScrollListener, 100);
  }, 400);
  // 折叠
  settingStore.isCollapse = true;
};
// 打开透明度函数
let openOpacity = () => {
  if (settingStore.mmenuFlag == true) {
    (document.querySelector(".el-aside") as HTMLDivElement).style.left = "0";
  }
  // 将所有菜单项的标题显示
  (
    document.querySelectorAll(
      ".el-menu-vertical-demo span"
    ) as NodeListOf<HTMLSpanElement>
  ).forEach((item) => {
    item.style.opacity = "1";
  });
  // 关闭节流阀
  setTimeout(() => {
    foldFlag = false;
    // 禁止横向滚动事件
    function addScrollListener() {
      // 尝试获取元素
      const element = document.querySelector(".el-menu .el-scrollbar__wrap");

      // 如果元素存在
      if (element) {
        // 添加滚动事件监听器
        element.addEventListener("scroll", function () {
          element.scrollLeft = 0;
        });

        // 停止定时器
        clearInterval(checkElementInterval);
      }
    }

    // 设置定时器，每隔100毫秒检查元素是否存在
    const checkElementInterval = setInterval(addScrollListener, 100);
  }, 400);
  // 打开
  settingStore.isCollapse = false;
};

// 折叠菜单函数
let foldMenu = async () => {
  // 节流阀
  if (foldFlag == true) {
    return;
  }
  // 当前如果菜单打开
  if (settingStore.isCollapse == false) {
    // 打开节流阀
    foldFlag = true;
    // 判断当前是否有子节点被展开
    let activeItemArr = document.querySelectorAll(".is-opened");
    let flag = false;
    activeItemArr.forEach((item: any) => {
      if (
        !item.classList.contains("logo") &&
        !item.classList.contains("fold-btn")
      ) {
        // 存在非logo和折叠的展开子节点
        flag = true;
      }
    });
    // 回滚到顶部
    let scrollEl = document.querySelector(".el-menu .el-scrollbar")!
      .children[0];
    await verticalScroll(scrollEl as Element);
    if (flag) {
      // 如果有，就关上然后延时500毫秒来触发透明度函数
      activeItemArr.forEach((item) => {
        (item.firstElementChild as HTMLDivElement).click();
      });
      setTimeout(() => {
        closeOpacity();
      }, 500);
    } else {
      // 如果没有，直接触发透明度函数
      closeOpacity();
    }
  } else {
    // 打开节流阀
    foldFlag = true;
    // 触发透明度函数
    openOpacity();
  }
};

// 适配移动端，点击了菜单之后立马折叠
let mmenuFold = () => {
  if (settingStore.mmenuFlag == true && settingStore.isCollapse == false) {
    foldMenu();
  }
};
onMounted(() => {
  // 监听仓库发起的折叠请求
  watch(
    () => settingStore.reqCollapse,
    () => {
      foldMenu();
    }
  );
  //添加移动端点击其他地方菜单也会收起
  window.addEventListener("touchstart", function (event: TouchEvent) {
    if (settingStore.mmenuFlag == true) {
      let menu = document.querySelector(".el-aside");

      // Check if the click is outside the modal
      if (
        !menu!.contains(event.target as Node | null) &&
        settingStore.isCollapse == false
      ) {
        // Clicked outside the modal, close it
        foldMenu();
      }
    }
  });
  // 禁止横向滚动事件
  function addScrollListener() {
    // 尝试获取元素
    const element = document.querySelector(".el-menu .el-scrollbar__wrap");

    // 如果元素存在
    if (element) {
      // 添加滚动事件监听器
      element.addEventListener("scroll", function () {
        element.scrollLeft = 0;
      });

      // 停止定时器
      clearInterval(checkElementInterval);
    }
  }

  // 设置定时器，每隔100毫秒检查元素是否存在
  const checkElementInterval = setInterval(addScrollListener, 100);
});
</script>

<style scoped lang="scss">
:deep(.el-scrollbar__bar.is-horizontal) {
  display: none !important;
}
:deep(.el-scrollbar__bar) {
  z-index: 4;
}
.logo {
  height: 60px;
  :deep(.el-sub-menu__title) {
    padding: 0 !important;
    height: 60px;
    cursor: default;
  }
  :deep(.el-sub-menu__icon-arrow) {
    display: none !important;
  }
}
.fold-btn {
  :deep(.el-sub-menu__icon-arrow) {
    display: none !important;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: $size-menu-width;
  :deep(.el-sub-menu__icon-arrow) {
    display: block;
  }
  :deep(span) {
    opacity: 1;
    transition: $ani-opacity;
  }
}
.el-menu-vertical-demo {
  background-color: var(--el-bg-color);
  :deep(.el-sub-menu__icon-arrow) {
    display: none;
  }
  :deep(span) {
    opacity: 0;
    transition: $ani-opacity;
  }
}
.el-scrollbar {
  height: calc(100vh - $size-logo-container-height);
}
// .el-menu-item,
// .el-sub-menu {
//   user-select: none;
//   background-color: var(--el-bg-color);
// }
:deep(.el-menu-item),
:deep(.el-sub-menu) {
  user-select: none;
  // background-color: var(--el-bg-color);
}
:deep(.el-menu-item):hover,
:deep(.el-sub-menu):hover {
  background-color: var(--el-menu-hover-bg-color);
}
// :deep(.el-menu-item *),
// :deep(.el-sub-menu__title *) {
//   vertical-align: top;
// }
.logo:deep(.el-submenu__title *) {
  vertical-align: top;
}
</style>
