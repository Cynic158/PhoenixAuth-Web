// WebAuthn 仓库
import { defineStore } from "pinia";

// WebAuthn 请求api
import {
  reqRegisterOptions,
  reqRegisterVerification,
  reqGetLoginOptions,
  reqLoginVerification,
  reqQueryByUser,
  reqRemoveById
} from "@/api/webauthn";

interface removeWebAuthnInfo{
    credential_id: number;
}

// 创建仓库
let useWebAuthnStore = defineStore("webauthn", ()=>{
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
  let registerVerification = async (data: any) => {
    try {
      let result = await reqRegisterVerification(data);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

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
  let loginVerification = async (data: any) => {
    try {
      let result = await reqLoginVerification(data);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 请求通行密钥查询
  let queryByUser = async () => {
    try {
      let result = await reqQueryByUser();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 请求通行密钥删除
  let removeById = async (info: removeWebAuthnInfo) => {
    try {
      let result = await reqRemoveById(info);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
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
