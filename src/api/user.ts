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
  BIND_GAME_ID = "/user/bind_game_id",
  USE_REDEEM_CODE = "/user/use_redeem_code",
  GEN_API_KEY = "/user/gen_api_key",
  DISABLE_API_KEY = "/user/disable_api_key",
  SET_BAN_LIST_UPLOAD = "/user/set_ban_list_upload",
  SET_AUTO_RESTART_SERVER = "/user/set_auto_restart_server",
  REQUEST_EMAIL_VERIFY_CODE = "/user/request_email_verify_code",
  RESET_PASSWORD = "/user/reset_password",
  EMAIL_BIND = "/user/email_bind",
  EMAIL_UNBIND = "/user/email_unbind",
  REMOVE_ACCOUNT = "/user/remove_account",
}

// 导出api
// 请求token
export const reqNewToken = () => request.get(API.NEWTOKEN);
// 请求注册
export const reqRegister = (regInfo: UserInfo) =>
  request.post(API.REGISTER, regInfo);
// 请求登录
export const reqLogin = (loginInfo: UserInfo) =>
  request.post(API.LOGIN, loginInfo);
// 请求用户信息
export const reqGetStatus = () => request.get(API.GET_STATUS);
// 请求登出
export const reqLogout = () => request.get(API.LOGOUT);
// 请求phoenixtoken
export const reqGetPhoenixToken = (fbtokenInfo: UserFbtokenInfo) =>
  request.post(API.GET_PHOENIX_TOKEN, fbtokenInfo);
// 请求更改密码
export const reqChangePassword = (passwordInfo: UserPasswordInfo) =>
  request.post(API.CHANGE_PASSWORD, passwordInfo);
// 请求绑定游戏ID
export const reqBindGameId = (bindInfo: { server_code: string }) =>
  request.post(API.BIND_GAME_ID, bindInfo);
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
// 自动重启
export const reqSetAutoRestartServer = (enable: { enable: boolean }) =>
  request.post(API.SET_AUTO_RESTART_SERVER, enable);
// 请求邮箱验证码
export const reqRequestEmailVerifyCode = (info: UserEmailVerifyCodeInfo) =>
  request.post(API.REQUEST_EMAIL_VERIFY_CODE, info);
// 重置密码
export const reqResetPassword = (info: UserResetPasswordInfo) =>
  request.post(API.RESET_PASSWORD, info);
// 绑定邮箱
export const reqEmailBind = (info: UserEmailBindInfo) =>
  request.post(API.EMAIL_BIND, info);
// 解绑邮箱
export const reqEmailUnbind = (info: UserEmailUnbindInfo) =>
  request.post(API.EMAIL_UNBIND, info);
// 删除账户
export const reqRemoveAccount = (info: UserRemoveAccountInfo) =>
  request.post(API.REMOVE_ACCOUNT, info);
