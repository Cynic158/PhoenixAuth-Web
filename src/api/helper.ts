// bot api
import request from "@/utils/request";

// 统一管理url
enum API {
  GET_STATUS = "/helper/get_status",
  CHANGE_NAME = "/helper/change_name",
  BIND_GUEST_ACCOUNT = "/helper/bind_guest_account",
  BIND_EMAIL_ACCOUNT = "/helper/bind_email_account",
  UNBIND = "/helper/unbind",
  BIND_MOBILE_ACCOUNT = "/helper/bind_mobile_account/verify",
  GET_LOGIN_SMSCODE = "/helper/bind_mobile_account/get_sms",
}

// 导出api
// 请求机器人游戏信息
export const reqGetStatus = () => request.get(API.GET_STATUS);
// 请求更改机器人的游戏昵称
export const reqChangeName = (username: { username: string }) =>
  request.post(API.CHANGE_NAME, username);
// 请求以游客登录的形式创建机器人
export const reqCreate = () => request.get(API.BIND_GUEST_ACCOUNT);
// 请求以网易邮箱账号登录的形式创建机器人
export const reqBindEmailAccount = (emailInfo: HelperEmailInfo) =>
  request.post(API.BIND_EMAIL_ACCOUNT, emailInfo);
// 请求以手机账号登录的形式创建机器人
export const reqBindMobileAccount = (phoneInfo: HelperPhoneInfo) =>
  request.post(API.BIND_MOBILE_ACCOUNT, phoneInfo);
// 请求解绑机器人
export const reqUnbind = () => request.get(API.UNBIND);
// 获取验证码
export const reqGetLoginSmscode = (codeInfo: HelperCodeInfo) =>
  request.post(API.GET_LOGIN_SMSCODE, codeInfo);
