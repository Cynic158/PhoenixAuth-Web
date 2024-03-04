// WebAuthn 仓库
import { defineStore } from "pinia";
// 导入用户仓库
import useUserStore from "@/store/modules/user";

// WebAuthn 请求api
import {
  reqRegisterOptions,
  reqRegisterVerification,
  reqGetLoginOptions,
  reqLoginVerification,
  reqQueryByUser,
  reqRemoveById,
} from "@/api/webauthn";

import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/types";

// 创建仓库
let useWebAuthnStore = defineStore("webauthn", () => {
  // 请求通行密钥注册Options
  let registerOptions = async () => {
    try {
      let result = await reqRegisterOptions();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求通行密钥注册验证
  let registerVerification = async (data: RegistrationResponseJSON) => {
    try {
      let result = await reqRegisterVerification(data);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求通行密钥登录Options
  let loginOptions = async () => {
    try {
      let result = await reqGetLoginOptions();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求通行密钥登录验证
  let loginVerification = async (data: AuthenticationResponseJSON) => {
    try {
      let result = await reqLoginVerification(data);
      localStorage.setItem("TOKEN", useUserStore().token.valueOf());
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求通行密钥查询
  let queryByUser = async () => {
    try {
      let result = await reqQueryByUser();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求通行密钥删除
  let removeById = async (info: WebauthnRemoveInfo) => {
    try {
      let result = await reqRemoveById(info);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 导出
  return {
    registerOptions,
    registerVerification,
    loginOptions,
    loginVerification,
    queryByUser,
    removeById,
  };
});

export default useWebAuthnStore;
