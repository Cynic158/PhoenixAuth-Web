// 管理仓库
import { defineStore } from "pinia";

// 管理请求api
import {
  reqCreateLicense,
  reqDeleteLicense,
  reqQueryLicense,
  reqQueryRecord
} from "@/api/neomega";

// 创建仓库
let useNeomegaStore = defineStore("neomega", () => {
  // 创建License
  let createLicense = async (createInfo: CreateLicenseInfo) => {
    try {
      let result = await reqCreateLicense(createInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 删除License
  let deleteLicense = async (deleteInfo: DeleteLicenseInfo) => {
    try {
      let result = await reqDeleteLicense(deleteInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 查询License
  let queryLicense = async (queryInfo: QueryLicenseInfo) => {
    try {
      let result = await reqQueryLicense(queryInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 查询记录
  let queryRecord = async (queryInfo: QueryRecordInfo) => {
    try {
      let result = await reqQueryRecord(queryInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    createLicense,
    deleteLicense,
    queryLicense,
    queryRecord
  };
});

export default useNeomegaStore;
