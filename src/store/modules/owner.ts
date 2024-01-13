// bot 仓库
import { defineStore } from "pinia";
// 导入md5
// @ts-ignore
import md5 from "crypto-js/md5";

// bot 请求api
import {
  reqBindEmailAccount,
  reqGetStatus,
  reqUnbind,
  reqSignIn,
  reqBindMobileAccount,
  reqGetLoginSmscode,
} from "@/api/owner";

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

// 创建仓库
let useOwnerStore = defineStore("owner", () => {
  // 获取机器人游戏信息
  let getBot = async () => {
    try {
      let result = await reqGetStatus();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 邮箱创建
  let botCreateByEmail = async (emailInfo: emailInfo) => {
    try {
      // 对密码进行加密
      const hashpassword = md5(emailInfo.password).toString();
      emailInfo.password = hashpassword;
      let result = await reqBindEmailAccount(emailInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 手机创建
  let botCreateByPhone = async (phoneInfo: phoneInfo) => {
    try {
      let result = await reqBindMobileAccount(phoneInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 获取验证码
  let botPhoneCode = async (codeInfo: codeInfo) => {
    try {
      let result = await reqGetLoginSmscode(codeInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 解绑
  let botUnbind = async () => {
    try {
      let result = await reqUnbind();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 签到
  let botSignIn = async () => {
    try {
      let result = await reqSignIn();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    getBot,
    botCreateByEmail,
    botUnbind,
    botSignIn,
    botCreateByPhone,
    botPhoneCode,
  };
});

export default useOwnerStore;
