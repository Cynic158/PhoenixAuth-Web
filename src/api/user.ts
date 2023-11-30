// 用户api
import request from "@/utils/request";

// 统一管理url
enum API {
  NEWTOKEN = "/new",
  REGISTER = "/user/register",
  LOGIN = "/user/login",
  GET_STATUS = "/user/get_status",
  LOGOUT = "/user/logout",
  GET_PHOENIX_TOKEN = "/user/get_phoenix_token",
}

// 数据类型声明
interface userInfo {
  username: string;
  password: string;
  captcha_token: string;
}

// 导出api
// 请求token
export const reqNewToken = () => request.get(API.NEWTOKEN);
// 请求注册
export const reqRegister = (regInfo: userInfo) =>
  request.post(API.REGISTER, regInfo);
// 请求登录
export const reqLogin = (loginInfo: userInfo) =>
  request.post(API.LOGIN, loginInfo);
// 请求用户信息
export const reqGetStatus = () => request.get(API.GET_STATUS);
// 请求登出
export const reqLogout = () => request.get(API.LOGOUT);
// 请求phoenixtoken
export const reqGetPhoenixToken = () =>
  request.get(API.GET_PHOENIX_TOKEN, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": "attachment; filename=fbtoken",
    },
  });
