// 用户api
import request from "@/utils/request";

// 统一管理url
enum API {
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info",
  LOGOUT_URL = "/user/logout",
  NEWTOKEN = "/new",
  REGISTER = "/user/register",
  LOGIN = "/user/login",
}

// 数据类型声明
interface userInfo {
  username: string;
  password: string;
  captcha_token: string;
}

// 导出api

// 请求用户信息
export const reqUserInfo = () => request.get(API.USERINFO_URL);
// 请求登出
export const reqLogout = () => request.post(API.LOGOUT_URL);

// 获取token
export const reqNewToken = () => request.get(API.NEWTOKEN);
// 请求注册
export const reqRegister = (regInfo: userInfo) =>
  request.post(API.REGISTER, regInfo);
// 请求登录
export const reqLogin = (loginInfo: userInfo) =>
  request.post(API.LOGIN, loginInfo);
