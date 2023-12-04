// 管理仓库
import { defineStore } from "pinia";
// 导入加密
// @ts-ignore
import sha256 from "crypto-js/sha256";

// 管理请求api
import {
  reqActivateUser,
  reqBanUser,
  reqCreateUser,
  reqQueryUser,
  reqRenewUser,
} from "@/api/admin";

interface createInfo {
  username: string;
  password: string;
  permission: number;
}
interface renewInfo {
  username: string;
  renew_time: number;
}

// 创建仓库
let useAdminStore = defineStore("admin", () => {
  // 新建用户
  let userCreate = async (createInfo: createInfo) => {
    try {
      // 对密码进行加密
      const hashpassword = sha256(createInfo.password).toString();
      createInfo.password = hashpassword;
      let result = await reqCreateUser(createInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 封禁用户
  let userBan = async (username: { username: string }) => {
    try {
      let result = await reqBanUser(username);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 查询用户
  let userQuery = async (username: { username: string }) => {
    try {
      let result = await reqQueryUser(username);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 激活用户
  let userActivate = async (username: { username: string }) => {
    try {
      let result = await reqActivateUser(username);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 续费用户
  let userRenew = async (renewInfo: renewInfo) => {
    try {
      let result = await reqRenewUser(renewInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    userCreate,
    userBan,
    userQuery,
    userActivate,
    userRenew,
  };
});

export default useAdminStore;
