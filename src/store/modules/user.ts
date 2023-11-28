// 用户仓库
import { defineStore } from "pinia";

// 用户请求api
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
// 导入路由创建动态菜单
import { defaultRoutes, permissionRoutes, anyRoute } from "@/router/routes";
import { ref } from "vue";
import router from "@/router";
// @ts-ignore
import cloneDeep from "lodash/cloneDeep";

// 过滤权限路由，传入权限路由以及用户所拥有的的路由权限数组
function filterRoute(asyncRoutes: any, permission: any) {
  // 循环权限路由，返回一个过滤完成的路由列表
  return asyncRoutes.filter((item: any) => {
    // 如果用户的权限路由数组内有对应权限路由
    if (permission.includes(item.name)) {
      // 检查此路由是否有子路由，如果有就再循环一遍
      if (item.children && item.children.length > 0) {
        item.children = filterRoute(item.children, permission);
      }
      // 将对应路由添加到要返回的路由中
      return true;
    }
  });
}
// 过滤没有权限的，由下述移除
function removeFilter(asyncRoutes: any, permission: any) {
  // 循环权限路由，返回一个过滤完成的路由列表
  return asyncRoutes.filter((item: any) => {
    // 如果用户的权限路由数组内有对应权限路由
    if (!permission.includes(item.name)) {
      // 检查此路由是否有子路由，如果有就再循环一遍
      if (item.children && item.children.length > 0) {
        item.children = removeFilter(item.children, permission);
      }
      // 将对应路由添加到要返回的路由中
      return true;
    }
  });
}

// 创建仓库
let useUserStore = defineStore("user", () => {
  // 用户信息部分
  // 用户token，先从本地获取，没有就空字符串
  let token = ref(localStorage.getItem("TOKEN") || "");
  // 用户名
  let uname = ref(localStorage.getItem("UNAME") || "");
  // 头像
  let avatar = ref(localStorage.getItem("AVATAR") || "");
  // 动态路由菜单项
  let menuRoutes = ref([...defaultRoutes]);
  // 动态路由刷新flag
  let refreshFlag = ref(false);
  // 权限按钮组
  let btns = ref([]);
  // 人机token
  let robotToken = ref("");

  // 存储token
  let setToken = (str: string) => {
    token.value = str;
    localStorage.setItem("TOKEN", token.value);
  };

  // 请求登录函数
  // @ts-ignore
  let userLogin = async (loginData) => {
    refreshFlag.value = false;
    // 发起请求
    let result = await reqLogin(loginData);
    // @ts-ignore
    if (result.code == 200) {
      // 登录成功，赋值给token
      token.value = result.data.token;
      // 本地存储token
      localStorage.setItem("TOKEN", token.value);
      // 返回一个成功的promise
      return "success";
    } else {
      // 登录失败，返回一个失败的promise
      return Promise.reject(result.data);
    }
  };

  // 获取用户信息
  let userInfo = async () => {
    // 发起请求
    let result = await reqUserInfo();
    // @ts-ignore
    if (result.code == 200) {
      // 传入以及存储用户名和头像和按钮权限
      uname.value = result.data.userInfo.username;
      avatar.value = result.data.userInfo.avatar;
      btns.value = result.data.userInfo.buttons;
      localStorage.setItem("UNAME", uname.value);
      localStorage.setItem("AVATAR", avatar.value);
      // 根据得到的用户路由权限来渲染动态路由
      let userRoutes = filterRoute(
        cloneDeep(permissionRoutes),
        result.data.userInfo.routes
      );
      let removePermission = removeFilter(
        cloneDeep(permissionRoutes),
        result.data.userInfo.routes
      );
      menuRoutes.value = [...defaultRoutes, ...userRoutes];
      // 动态添加路由
      userRoutes.forEach((route: any) => {
        router.addRoute("layout", route);
      });
      // 移除没有权限的路由
      removePermission.forEach((route: any) => {
        router.removeRoute(route.name);
      });
      // 通配路由放在最后
      router.addRoute(anyRoute);
      // 返回一个成功的promise
      return "success";
    } else {
      // 获取失败，返回一个失败的promise
      return Promise.reject(result.data);
    }
  };

  // 请求登出
  // 清空用户信息函数
  let clearUser = () => {
    token.value = "";
    uname.value = "";
    avatar.value = "";
    localStorage.setItem("TOKEN", "");
    localStorage.setItem("UNAME", "");
    localStorage.setItem("AVATAR", "");
  };
  let userLogout = async () => {
    // 发起请求
    let result = await reqLogout();
    // @ts-ignore
    if (result.code == 200) {
      // 清空用户信息
      clearUser();
      // 重置flag，使得重新登录会再次动态添加路由
      refreshFlag.value = false;
      return "登出成功";
    } else {
      // 登出失败，返回一个失败的promise
      return Promise.reject(result.data);
    }
  };

  return {
    token,
    uname,
    avatar,
    userLogin,
    userInfo,
    userLogout,
    menuRoutes,
    clearUser,
    refreshFlag,
    btns,
    setToken,
    robotToken,
  };
});

export default useUserStore;
