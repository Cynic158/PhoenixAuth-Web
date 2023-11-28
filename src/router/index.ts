// 路由，hash为哈希路由，可以用createWebHistory换成history路由
import { createRouter, createWebHashHistory } from "vue-router";
// 导入通用路由
import { defaultRoutes } from "./routes";
// 引入进度条
// @ts-ignore
import NProgress from "nprogress";
// nprogress样式文件
import "nprogress/nprogress.css";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
import pinia from "@/store/index";
// 导入通知组件
// @ts-ignore
import { ElNotification } from "element-plus";

NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

let router = createRouter({
  history: createWebHashHistory(),
  routes: defaultRoutes,
  // 切换路由即将页面重置
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

// 使用用户仓库的token
let userStore = useUserStore(pinia);

//当路由开始跳转时
// @ts-ignore
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start();
  // 判断是否已经登录，否则不给跳转
  if (to.path != "/login" && userStore.token == "") {
    userStore.clearUser();
    ElNotification({
      type: "warning",
      title: "未登录",
      message: "请先进行用户登录",
      duration: 3000,
    });
    // 回到登录页
    next({ path: "/login" });
  } else if (to.path == "/login") {
    // 如果前往的是登录页，直接跳转
    next();
  } else if (userStore.refreshFlag == true) {
    // 已经获取到用户信息，直接跳转
    next();
  } else {
    try {
      // 没获取用户信息则直到获取到之前都去获取
      // 获取用户信息
      await userStore.userInfo();
      // 已获取
      userStore.refreshFlag = true;
      // 跳转
      next({ ...to, replace: true });
    } catch (error) {
      // 获取不到用户信息，转回登录页
      next({ path: "/login" });
    }
  }
});
//当路由跳转结束后
router.afterEach((to) => {
  // 关闭进度条
  NProgress.done();
  // 修改页面标题
  document.title = import.meta.env.VITE_APP_TITLE + "-" + to.meta.title;
});

// 路由跳转
export function routerPush(routePath: string): void {
  router.push(routePath);
}

export default router;
