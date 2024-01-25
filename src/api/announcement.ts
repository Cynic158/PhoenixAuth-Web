// 公告api
import request from "@/utils/request";

// 统一管理url
enum API {
  QUERY_BY_PAGE = "/announcement/query_by_page",
  CREATE = "/announcement/create",
  EDIT = "/announcement/edit",
  DELETE = "/announcement/delete",
}

// 数据类型声明
interface pageInfo {
  page_num: number;
  page_size: number;
}
interface announcementInfo {
  ID: number;
  title: string;
  content: string;
}

// 导出api
// 请求公告数据
export const reqQueryByPage = (pageInfo: pageInfo) =>
  request.post(API.QUERY_BY_PAGE, pageInfo);
// 创建公告
export const reqCreate = (announcementInfo: announcementInfo) =>
  request.post(API.CREATE, announcementInfo);
// 编辑公告
export const reqEdit = (announcementInfo: announcementInfo) =>
request.post(API.EDIT, announcementInfo);
// 删除公告
export const reqDelete = (id: { id: number }) => request.post(API.DELETE, id);
