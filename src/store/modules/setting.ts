// 参数仓库
import { defineStore } from "pinia";
import { onMounted, onUnmounted, reactive, ref } from "vue";

// 创建仓库
let useSettingStore = defineStore("setting", () => {
  // 菜单部分
  // 折叠状态
  let isCollapse = ref(true);
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

  // 移动端适配
  // 创建公告弹窗宽度
  let createDialogWidth = ref("50%");
  // 页码最大数
  let pageCount = ref(7);
  // 分页器大小
  let pageSmall = ref(false);
  // 信息列数
  let infoCol = ref(2);
  // 信息排列方式
  let infoDirection = ref("horizontal");
  // 点击了菜单之后立马折叠
  let mmenuFlag = ref(false);
  // 适配处理函数
  const handleResize = () => {
    // 获取当前窗口宽度
    const screenWidth = window.innerWidth;
    // 根据窗口宽度进行判断
    if (screenWidth <= 768) {
      createDialogWidth.value = "100%";
      pageCount.value = 4;
      pageSmall.value = true;
      infoCol.value = 1;
      infoDirection.value = "vertical";
      mmenuFlag.value = true;
    } else {
      createDialogWidth.value = "50%";
      pageCount.value = 7;
      pageSmall.value = false;
      infoCol.value = 2;
      infoDirection.value = "horizontal";
      mmenuFlag.value = false;
    }
  };

  onMounted(() => {
    handleResize(); // 初始加载时进行一次判断
    if (!mmenuFlag.value) {
      // 一进入页面不是移动端的话就先收起菜单
      reqCollapse.value = 2;
    }
    window.addEventListener("resize", handleResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

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
    createDialogWidth,
    pageCount,
    pageSmall,
    infoCol,
    infoDirection,
    mmenuFlag,
  };
});

export default useSettingStore;
