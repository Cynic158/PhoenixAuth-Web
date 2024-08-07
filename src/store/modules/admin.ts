// 管理仓库
import { defineStore } from "pinia";

// 管理请求api
import {
  reqQueryUser,
  reqBanUser,
  reqUnBanUser,
  reqSetUserPermission,
  reqExtendUserExpireTime,
  reqExtendUserUnlimitedTime,
  reqGenerateRedeemCode,
  reqGetUnlimitedRentalServerList,
  reqAddUnlimitedRentalServer,
  reqDeleteUnlimitedRentalServer,
} from "@/api/admin";

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
  let userBan = async (banInfo: AdminBanInfo) => {
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
  };

  // 设置用户权限
  let userSetPermission = async (permissionInfo: AdminPermissionInfo) => {
    try {
      let result = await reqSetUserPermission(permissionInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 更新用户有效期
  let userExtendExpireTime = async (
    extendUserExpireTimeInfo: AdminExtendUserExpireTimeInfo
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
    extendUserUnlimitedTimeInfo: AdminExtendUserUnlimitedTimeInfo
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
  let genCode = async (codeInfo: AdminCodeInfo) => {
    try {
      let result = await reqGenerateRedeemCode(codeInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 查询无限制服务器列表
  let getUnlimitedRentalServerList = async () => {
    try {
      let result = await reqGetUnlimitedRentalServerList();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 添加无限制服务器
  let addUnlimitedRentalServer = async (info: { server_code: string }) => {
    try {
      let result = await reqAddUnlimitedRentalServer(info);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 删除无限制服务器
  let deleteUnlimitedRentalServer = async (info: { rental_server_id: number }) => {
    try {
      let result = await reqDeleteUnlimitedRentalServer(info);
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
    getUnlimitedRentalServerList,
    addUnlimitedRentalServer,
    deleteUnlimitedRentalServer,
  };
});

export default useAdminStore;
