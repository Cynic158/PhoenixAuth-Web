// bot 仓库
import { defineStore } from "pinia";
// 导入md5
// @ts-ignore
import md5 from "crypto-js/md5";

// bot 请求api
import {
  reqBindEmailAccount,
  reqChangeName,
  reqCreate,
  reqGetStatus,
  reqUnbind,
} from "@/api/helper";

interface emailInfo {
  username: string;
  password: string;
}

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

  // 解绑
  let botUnbind = async () => {
    try {
      let result = await reqUnbind();
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
  };
});

export default useHelperStore;
