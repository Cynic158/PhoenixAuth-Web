// neomega api
import request from "@/utils/request";

// 统一管理url
enum API {
  CREATE_LICENSE = "/neomega/license/create",
  DELETE_LICENSE = "/neomega/license/delete",
  QUERY_LICENSE = "/neomega/license/query",
  QUERY_RECORD = "/neomega/record/query",
}

// 导出api
// 请求创建License
export const reqCreateLicense = (createInfo: CreateLicenseInfo) =>
  request.post(API.CREATE_LICENSE, createInfo);
// 请求删除License
export const reqDeleteLicense = (deleteInfo: DeleteLicenseInfo) =>
  request.post(API.DELETE_LICENSE, deleteInfo);
// 请求查询License
export const reqQueryLicense = (queryInfo: QueryLicenseInfo) =>
  request.post(API.QUERY_LICENSE, queryInfo);
// 请求查询记录
export const reqQueryRecord = (queryInfo: QueryRecordInfo) =>
  request.post(API.QUERY_RECORD, queryInfo);
