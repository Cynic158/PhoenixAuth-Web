import axios from "axios";
// @ts-ignore
import { ElMessage, ElNotification } from "element-plus";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入路由函数
import { routerPush } from "@/router";

//创建axios实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
});
//请求拦截器
request.interceptors.request.use(
  (config) => {
    // 使用用户仓库的token
    let userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = "Bearer " + userStore.token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
//响应拦截器
request.interceptors.response.use(
  (response) => {
    // console.log(response);
    if (response.status == 401) {
      // token过期提示
      ElNotification({
        type: "warning",
        title: "登录过期",
        message: "跳转到登录页",
        duration: 3000,
      });
      // 使用用户仓库的清空信息函数
      let userStore = useUserStore();
      // 清空用户信息
      userStore.clearUser();
      // 跳转到登录页
      routerPush("/login");
    }
    return response.data;
  },
  (error) => {
    console.log(error);
    if (error.response.status == 401) {
      // token过期提示
      ElNotification({
        type: "warning",
        title: "登录过期",
        message: "跳转到登录页",
        duration: 3000,
      });
      // 使用用户仓库的清空信息函数
      let userStore = useUserStore();
      // 清空用户信息
      userStore.clearUser();
      // 跳转到登录页
      routerPush("/login");
    }
    // ElMessage({
    //   type: "error",
    //   message: "网络错误",
    //   duration: 3000,
    // });
    return Promise.reject(error);
  }
);
export default request;
