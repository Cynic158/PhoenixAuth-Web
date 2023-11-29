// 用户仓库
import { defineStore } from "pinia";

// 用户请求api
import {
  reqLogout,
  reqNewToken,
  reqRegister,
  reqLogin,
  reqGetStatus,
} from "@/api/user";
// 导入路由创建动态菜单
import { defaultRoutes, permissionRoutes, anyRoute } from "@/router/routes";
import { ref } from "vue";
import router from "@/router";
// @ts-ignore
import cloneDeep from "lodash/cloneDeep";
// @ts-ignore
import sha256 from "crypto-js/sha256";

interface userInfo {
  username: string;
  password: string;
  captcha_token: string;
}

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

  // 获取会话token
  let getToken = async () => {
    let result = await reqNewToken();
    if (result) {
      // @ts-ignore
      token.value = result;
      localStorage.setItem("TOKEN", token.value);
      return "success";
    } else {
      return Promise.reject("fail");
    }
  };

  // 请求登录或者注册
  let userRegLog = async (userInfo: userInfo, type: "login" | "reg") => {
    // 先对密码进行加密
    const hashpassword = sha256(userInfo.password).toString();
    userInfo.password = hashpassword;
    // 发起请求
    try {
      let result = null;
      if (type == "reg") {
        result = await reqRegister(userInfo);
      } else if (type == "login") {
        result = await reqLogin(userInfo);
      }
      console.log(result);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 获取用户信息
  let userInfo = async () => {
    // 发起请求
    let result = await reqGetStatus();
    // @ts-ignore
    if (result.success) {
      // 获取成功，存储用户用户名
      // @ts-ignore
      uname.value = result.username;
      // @ts-ignore
      localStorage.setItem("UNAME", result.username);
      // 根据得到的用户路由权限来渲染动态路由
      let userRoutes = filterRoute(cloneDeep(permissionRoutes), []);
      let removePermission = removeFilter(cloneDeep(permissionRoutes), []);
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
    } else {
      // 获取失败，返回一个失败的promise
      return Promise.reject(result);
    }
  };

  // 请求登出
  // 清空用户信息函数
  let clearUser = () => {
    token.value = "";
    uname.value = "";
    localStorage.setItem("TOKEN", "");
    localStorage.setItem("UNAME", "");
  };
  let userLogout = async () => {
    // 发起请求
    let result = await reqLogout();
    // @ts-ignore
    if (result.success) {
      // 清空用户信息
      clearUser();
      // 重置flag，使得重新登录会再次动态添加路由
      refreshFlag.value = false;
      return "登出成功";
    } else {
      // 登出失败，返回一个失败的promise
      return Promise.reject(result);
    }
  };

  return {
    token,
    uname,
    avatar,
    userInfo,
    userLogout,
    menuRoutes,
    clearUser,
    refreshFlag,
    btns,
    getToken,
    robotToken,
    userRegLog,
  };
});

export default useUserStore;
