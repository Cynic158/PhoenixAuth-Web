// 参数仓库
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

// 创建仓库
let useSettingStore = defineStore("setting", () => {
  // 菜单部分
  // 折叠状态
  let isCollapse = ref(false);
  // 请求折叠
  let reqCollapse = ref(1);

  // 顶部导航部分
  // 是否使用面包屑组件
  let useBreadCrumb = ref(true);
  // 是否使用标签组件
  let useTabs = ref(false);
  // 标签对象数组
  let tabArr = reactive([]);
  // 切换面包屑
  let switchBreadCrumb = () => {
    useBreadCrumb.value = true;
    useTabs.value = false;
  };
  // 切换标签页
  let switchTabs = () => {
    useBreadCrumb.value = false;
    useTabs.value = true;
  };
  // 关闭tabbar
  let banTabbar = () => {
    useBreadCrumb.value = false;
    useTabs.value = false;
  };
  // 刷新按钮刷新状态
  let refresh = ref(false);

  return {
    isCollapse,
    reqCollapse,
    useTabs,
    useBreadCrumb,
    tabArr,
    switchBreadCrumb,
    switchTabs,
    banTabbar,
    refresh,
  };
});

export default useSettingStore;
