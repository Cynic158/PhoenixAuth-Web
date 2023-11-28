// 用户api
import request from "@/utils/request";

// 统一管理url
enum API {
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info",
  LOGOUT_URL = "/user/logout",
  NEWTOKEN = "/new",
}

// 导出api
// 请求登录
// @ts-ignore
export const reqLogin = (data) => request.post(API.LOGIN_URL, data);
// 请求用户信息
export const reqUserInfo = () => request.get(API.USERINFO_URL);
// 请求登出
export const reqLogout = () => request.post(API.LOGOUT_URL);

// 获取token
export const reqNewToken = () => request.get(API.NEWTOKEN);
