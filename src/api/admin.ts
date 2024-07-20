// 管理 api
import request from "@/utils/request";

// 统一管理url
enum API {
  QUERY_USER = "/admin/query_user",
  BAN_USER = "/admin/ban_user",
  UNBAN_USER = "/admin/unban_user",
  SET_USER_PERMISSION = "/admin/set_user_permission",
  EXTEND_USER_EXPIRE_TIME = "/admin/extend_user_expire_time",
  EXTEND_USER_UNLIMITED_TIME = "/admin/extend_user_unlimited_time",
  GENERATE_REDEEM_CODE = "/admin/generate_redeem_code",
  GET_UNLIMITED_RENTAL_SERVER_LIST = "/admin/get_unlimited_rental_server_list",
  ADD_UNLIMITED_RENTAL_SERVER = "/admin/add_unlimited_rental_server",
  DELETE_UNLIMITED_RENTAL_SERVER = "/admin/delete_unlimited_rental_server",
}

// 导出api
// 请求使用管理权限查询用户
export const reqQueryUser = (username: { username: string }) =>
  request.post(API.QUERY_USER, username);
// 请求使用管理权限封禁用户
export const reqBanUser = (banInfo: AdminBanInfo) =>
  request.post(API.BAN_USER, banInfo);
// 请求使用管理权限解封用户
export const reqUnBanUser = (username: { username: string }) =>
  request.post(API.UNBAN_USER, username);
// 请求使用管理权限设置一位用户的权限
export const reqSetUserPermission = (permissionInfo: AdminPermissionInfo) =>
  request.post(API.SET_USER_PERMISSION, permissionInfo);
// 请求使用管理权限更新一位用户的有效期
export const reqExtendUserExpireTime = (
  extendUserExpireTimeInfo: AdminExtendUserExpireTimeInfo
) => request.post(API.EXTEND_USER_EXPIRE_TIME, extendUserExpireTimeInfo);
// 请求使用管理权限更新一位用户的无限制权限有效期
export const reqExtendUserUnlimitedTime = (
  extendUserUnlimitedTimeInfo: AdminExtendUserUnlimitedTimeInfo
) => request.post(API.EXTEND_USER_UNLIMITED_TIME, extendUserUnlimitedTimeInfo);
// 请求生成兑换码
export const reqGenerateRedeemCode = (codeInfo: AdminCodeInfo) =>
  request.post(API.GENERATE_REDEEM_CODE, codeInfo);
// 请求获取无限制服务器列表
export const reqGetUnlimitedRentalServerList = () =>
  request.get(API.GET_UNLIMITED_RENTAL_SERVER_LIST);
// 请求添加无限制服务器
export const reqAddUnlimitedRentalServer = (info: { server_code: string }) =>
  request.post(API.ADD_UNLIMITED_RENTAL_SERVER, info);
// 请求删除无限制服务器
export const reqDeleteUnlimitedRentalServer = (info: { rental_server_id: number }) =>
  request.post(API.DELETE_UNLIMITED_RENTAL_SERVER, info);
