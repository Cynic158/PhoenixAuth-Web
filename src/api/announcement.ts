// 公告api
import request from "@/utils/request";

// 统一管理url
enum API {
  QUERY_BY_PAGE = "/announcement/query_by_page",
  CREATE = "/announcement/create",
  EDIT = "/announcement/edit",
  DELETE = "/announcement/delete",
}

// 导出api
// 请求公告数据
export const reqQueryByPage = (pageInfo: AnnPageInfo) =>
  request.post(API.QUERY_BY_PAGE, pageInfo);
// 创建公告
export const reqCreate = (announcementInfo: AnnouncementInfo) =>
  request.post(API.CREATE, announcementInfo);
// 编辑公告
export const reqEdit = (announcementInfo: AnnouncementInfo) =>
  request.post(API.EDIT, announcementInfo);
// 删除公告
export const reqDelete = (id: { id: number }) => request.post(API.DELETE, id);
