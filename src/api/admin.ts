// 管理 api
import request from "@/utils/request";

// 统一管理url
enum API {
  CREATE_USER = "/admin/create_user",
  BAN_USER = "/admin/ban_user",
  QUERY_USER = "/admin/query_user",
  ACTIVATE_USER = "/admin/activate_user",
  RENEW_USER = "/admin/renew_user",
}

// 数据类型声明
interface adminInfo {
  username: string;
  password: string;
  permission: number;
}
interface renewInfo {
  username: string;
  renew_time: number;
}

// 导出api
// 请求使用管理权限新建用户
export const reqCreateUser = (adminInfo: adminInfo) =>
  request.post(API.CREATE_USER, adminInfo);
// 请求使用管理权限封禁用户
export const reqBanUser = (username: { username: string }) =>
  request.post(API.BAN_USER, username);
// 请求使用管理权限查询用户
export const reqQueryUser = (username: { username: string }) =>
  request.post(API.QUERY_USER, username);
// 请求使用管理权限解封或者激活一位用户
export const reqActivateUser = (username: { username: string }) =>
  request.post(API.ACTIVATE_USER, username);
// 请求使用管理权限增加一位用户的有效期
export const reqRenewUser = (renewInfo: renewInfo) =>
  request.post(API.RENEW_USER, renewInfo);
