// webauthn api
import request from "@/utils/request";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/types";

// 统一管理url
enum API {
  REGISTER_OPTIONS = "/webauthn/register_options",
  REGISTER_VERIFICATION = "/webauthn/register_verification",
  LOGIN_OPTIONS = "/webauthn/login_options",
  LOGIN_VERIFICATION = "/webauthn/login_verification",
  QUERY_BY_USER = "/webauthn/query_by_user",
  REMOVE_BY_ID = "/webauthn/remove_by_id",
}

// 导出api
// 请求通行密钥注册Options
export const reqRegisterOptions = () => request.get(API.REGISTER_OPTIONS);
// 请求通行密钥注册验证
export const reqRegisterVerification = (data: RegistrationResponseJSON) =>
  request.post(API.REGISTER_VERIFICATION, data);
// 请求通行密钥登录Options
export const reqGetLoginOptions = () => request.get(API.LOGIN_OPTIONS);
// 请求通行密钥登录验证
export const reqLoginVerification = (data: AuthenticationResponseJSON) =>
  request.post(API.LOGIN_VERIFICATION, data);
// 请求通行密钥查询
export const reqQueryByUser = () => request.get(API.QUERY_BY_USER);
// 请求通行密钥删除
export const reqRemoveById = (info: WebauthnRemoveInfo) =>
  request.post(API.REMOVE_BY_ID, info);
