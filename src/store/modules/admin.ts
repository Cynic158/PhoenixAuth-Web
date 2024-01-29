// 管理仓库
import { defineStore } from "pinia";
// 导入加密
// @ts-ignore
import sha256 from "crypto-js/sha256";

// 管理请求api
import {
  reqQueryUser,
  reqBanUser,
  reqUnBanUser,
  reqSetUserPermission,
  reqExtendUserExpireTime,
  reqExtendUserUnlimitedTime,
  reqGenerateRedeemCode,
} from "@/api/admin";

interface banInfo {
  username: string;
  seconds: number;
  reason: string;
}
interface setPermissionInfo {
  username: string;
  permission: number;
}
interface extendUserExpireTimeInfo {
  username: string;
  seconds: number;
}
interface extendUserUnlimitedTimeInfo {
  username: string;
  seconds: number;
}
interface codeInfo {
  type: number;
  count: number;
  note?: string;
}

// 创建仓库
let useAdminStore = defineStore("admin", () => {
  // 查询用户
  let userQuery = async (username: { username: string }) => {
    try {
      let result = await reqQueryUser(username);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 封禁用户
  let userBan = async (banInfo: banInfo) => {
    try {
      let result = await reqBanUser(banInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 解封用户
  let userUnBan = async (username: { username: string }) => {
    try {
      let result = await reqUnBanUser(username);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 设置用户权限
  let userSetPermission = async (permissionInfo: setPermissionInfo) => {
    try {
      let result = await reqSetUserPermission(permissionInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 更新用户有效期
  let userExtendExpireTime = async (
    extendUserExpireTimeInfo: extendUserExpireTimeInfo
  ) => {
    try {
      let result = await reqExtendUserExpireTime(extendUserExpireTimeInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 更新用户无限制权限有效期
  let userExtendUnlimitedTime = async (
    extendUserUnlimitedTimeInfo: extendUserUnlimitedTimeInfo
  ) => {
    try {
      let result = await reqExtendUserUnlimitedTime(
        extendUserUnlimitedTimeInfo
      );
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 生成兑换码
  let genCode = async (codeInfo: codeInfo) => {
    try {
      let result = await reqGenerateRedeemCode(codeInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    userQuery,
    userBan,
    userUnBan,
    userSetPermission,
    userExtendExpireTime,
    userExtendUnlimitedTime,
    genCode,
  };
});

export default useAdminStore;
