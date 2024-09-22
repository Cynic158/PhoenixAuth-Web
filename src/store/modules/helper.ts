// bot 仓库
import { defineStore } from "pinia";
// 导入md5
import md5 from "crypto-js/md5";
// 导入工具函数
import { getPasswordLevel } from "@/utils";

// bot 请求api
import {
  reqBindEmailAccount,
  reqChangeName,
  reqCreate,
  reqGetStatus,
  reqUnbind,
  reqBindMobileAccount,
  reqGetLoginSmscode,
} from "@/api/helper";

// 创建仓库
let useHelperStore = defineStore("helper", () => {
  // 获取机器人游戏信息
  let getBot = async () => {
    try {
      let result = await reqGetStatus();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 游客创建
  let botCreate = async () => {
    try {
      let result = await reqCreate();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 邮箱创建
  let botCreateByEmail = async (emailInfo: HelperEmailInfo) => {
    try {
      // 计算密码强度
      emailInfo.password_level = getPasswordLevel(emailInfo.password);
      // 对密码进行加密
      emailInfo.password = md5(emailInfo.password).toString();
      let result = await reqBindEmailAccount(emailInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 手机创建
  let botCreateByPhone = async (phoneInfo: HelperPhoneInfo) => {
    try {
      let result = await reqBindMobileAccount(phoneInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 获取验证码
  let botPhoneCode = async (codeInfo: HelperCodeInfo) => {
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

  // 更名
  let botChangeName = async (username: { username: string }) => {
    try {
      let result = await reqChangeName(username);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    getBot,
    botCreate,
    botCreateByEmail,
    botUnbind,
    botChangeName,
    botCreateByPhone,
    botPhoneCode,
  };
});

export default useHelperStore;
