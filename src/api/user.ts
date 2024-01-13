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
  CHANGE_PASSWORD = "/user/change_password",
  USE_REDEEM_CODE = "/user/use_redeem_code",
  GEN_API_KEY = "/user/gen_api_key",
  DISABLE_API_KEY = "/user/disable_api_key",
  SET_BAN_LIST_UPLOAD = "/user/set_ban_list_upload",
}

// 数据类型声明
interface userInfo {
  username: string;
  password: string;
  captcha_token: string;
}
interface passwordInfo {
  original_password: string;
  new_password: string;
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
    responseType: "blob",
  });
// 请求更改密码
export const reqChangePassword = (passwordInfo: passwordInfo) =>
  request.post(API.CHANGE_PASSWORD, passwordInfo);
// 请求使用兑换码
export const reqUseRedeemCode = (code: { redeem_code: string }) =>
  request.post(API.USE_REDEEM_CODE, code);
// 请求生成api
export const reqGenApiKey = () => request.get(API.GEN_API_KEY);
// 禁用生成api
export const reqDisableApiKey = () => request.get(API.DISABLE_API_KEY);
// 黑名单
export const reqSetBanListUpload = (enable: { enable: boolean }) =>
  request.post(API.SET_BAN_LIST_UPLOAD, enable);
