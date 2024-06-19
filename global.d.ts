// axios
import "axios";
declare module "axios" {
  interface DefaultRes {
    success: boolean;
    message: string;
  }
  interface AxiosResponse<T = any, D = any> extends DefaultRes {
    data: T;
    status: number;
    statusText: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    config: InternalAxiosRequestConfig<D>;
    request?: any;
    [key: string]: any;
  }
}

import type { FormContext } from "element-plus";
import type { Ref } from "vue";
import type { TurnstileObject } from "turnstile-types";

declare global {
  // 通用
  // 表单
  interface EleHTMLFormElement extends HTMLFormElement {
    value: FormContext;
  }
  type EleFormRef = Ref<EleHTMLFormElement | null>;
  // window
  interface Window {
    onRobotBeforeInteractive: Function | null;
    onRobotAfterInteractive: Function | null;
    onRobotSuccess: Function | null;
    onRobotError: Function | null;
  }
  // 人机校验
  declare var turnstile: TurnstileObject;

  // admin相关
  // 请求封禁用户
  interface AdminBanInfo {
    username: string;
    seconds: number;
    reason: string;
  }
  // 请求设置权限
  interface AdminPermissionInfo {
    username: string;
    permission: number;
  }
  // 请求更新有效期
  interface AdminExtendUserExpireTimeInfo {
    username: string;
    seconds: number;
  }
  // 请求更新无限有效期
  interface AdminExtendUserUnlimitedTimeInfo {
    username: string;
    seconds: number;
  }
  // 请求兑换码
  interface AdminCodeInfo {
    type: number;
    count: number;
    note?: string;
  }

  // announcement相关
  // 请求公告
  interface AnnPageInfo {
    page_num: number;
    page_size: number;
  }
  // 请求创建或者编辑公告
  interface AnnouncementInfo {
    ID: number;
    title: string;
    content: string;
  }
  // 公告对象
  interface AnnOnj {
    ID: number;
    title: string;
    content: string;
    author_name: string;
    formatted_create_time: string;
  }

  // helper相关
  // 请求邮箱创建bot
  interface HelperEmailInfo {
    username: string;
    password: string;
    password_level: number;
  }
  // 请求手机创建bot
  interface HelperPhoneInfo {
    mobile: string;
    smscode: string;
  }
  // 请求验证码
  interface HelperCodeInfo {
    mobile: string;
    captcha_token: string;
  }
  // bot信息
  interface HelperRobotInfo {
    success: boolean;
    message: string;
    set: boolean;
    realname_url: string;
    username: string;
  }

  // owner相关
  // 请求使用礼包码
  interface OwnerGiftCodeIndo {
    code: string;
  }
  // bot信息
  interface OwnerRobotInfo {
    set: boolean;
    username: string;
  }

  // setting相关
  interface SettingTab {
    path: string;
    title: string;
  }

  // user相关
  // 请求登录或者注册
  interface UserInfo {
    username: string;
    password: string;
    captcha_token: string;
  }
  // 请求phoenixtoken
  interface UserFbtokenInfo {
    hashed_ip: string;
  }
  // 请求设置游戏名
  interface UserSetClientUsernameInfo {
    client_username: string;
  }
  // 请求更改密码
  interface UserPasswordInfo {
    email_verify_code: string;
    new_password: string;
  }
  // 请求邮箱验证码
  interface UserEmailVerifyCodeInfo {
    email?: string;
    username?: string;
    action_type: number;
    captcha_token: string;
  }
  // 请求重置密码
  interface UserResetPasswordInfo {
    username: string;
    email_verify_code: string;
    new_password: string;
  }
  // 请求绑定邮箱
  interface UserEmailBindInfo {
    email: string;
    email_verify_code: string;
  }
  // 请求解绑邮箱
  interface UserEmailUnbindInfo {
    email_verify_code: string;
  }
  // 请求注销
  interface UserRemoveAccountInfo {
    email_verify_code: string;
  }
  // 用户信息
  interface UserDetail {
    username: string;
    game_id: number;
    client_username: string;
    unlimited_until: number;
    permission: number;
    is_admin: boolean;
    create_at: number;
    expire_at: number;
    enable_auto_restart_server: boolean;
    api_key: string;
    has_email: boolean;
  }
  interface UserQueryDetail {
    username: string;
    permission: number;
    expire_at: number;
    unlimited_until: number;
    game_id: number;
    create_at: number;
    ban_until: number;
    ban_reason: string;
  }

  // webauthn相关
  interface WebauthnRemoveInfo {
    credential_id: number;
  }
  interface WebAuthnInfo {
    id: number;
    create_at: number;
    raw_id: string;
    create_at_str: string;
  }
}
