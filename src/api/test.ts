// 测试api
import request from "@/utils/request";

// 统一管理url
enum API {
  ADDFILE_URL = "/test/addfileitem",
  GETLIST_URL = "/test/getfilelist",
  DELFILE_URL = "/test/deletefileitem",
  EDITFILE_URL = "/test/editfileitem",
}

interface listType {
  page: number;
  pagesize: number;
}

// 导出api
// 请求上传
// @ts-ignore
export const reqAddFile = (data) => request.post(API.ADDFILE_URL, data);
// 获取列表
export const reqFileList = (params: listType) =>
  request.get(API.GETLIST_URL, { params: params });
// 删除图片项
export const reqDelFile = (data: any) => request.post(API.DELFILE_URL, data);
// 编辑图片项
// @ts-ignore
export const reqEditFile = (data) => request.post(API.EDITFILE_URL, data);
