// bot 仓库
import { defineStore } from "pinia";

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

  return {
    getBot,
    botCreate,
  };
});

export default useHelperStore;
