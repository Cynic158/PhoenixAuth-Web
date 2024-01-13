// owner api
import request from "@/utils/request";

// 统一管理url
enum API {
  GET_STATUS = "/owner/get_status",
  BIND_EMAIL_ACCOUNT = "/owner/bind_email_account",
  UNBIND = "/owner/unbind",
  DAILY_SIGN = "/owner/daily_sign",
  BIND_MOBILE_ACCOUNT = "/owner/bind_mobile_account",
  GET_LOGIN_SMSCODE = "/owner/get_login_smscode",
}

// 数据类型声明
interface emailInfo {
  username: string;
  password: string;
}

interface phoneInfo {
  mobile: string;
  smscode: string;
}

interface codeInfo {
  mobile: string;
  captcha_token: string;
}

// 导出api
// 请求机器人游戏信息
export const reqGetStatus = () => request.get(API.GET_STATUS);
// 请求以网易邮箱账号登录的形式创建机器人
export const reqBindEmailAccount = (emailInfo: emailInfo) =>
  request.post(API.BIND_EMAIL_ACCOUNT, emailInfo);
// 请求以手机账号登录的形式创建机器人
export const reqBindMobileAccount = (phoneInfo: phoneInfo) =>
  request.post(API.BIND_MOBILE_ACCOUNT, phoneInfo);
// 请求解绑机器人
export const reqUnbind = () => request.get(API.UNBIND);
// 请求签到
export const reqSignIn = () => request.get(API.DAILY_SIGN);
// 获取验证码
export const reqGetLoginSmscode = (codeInfo: codeInfo) =>
  request.post(API.GET_LOGIN_SMSCODE, codeInfo);
