// 公告api
import request from "@/utils/request";

// 统一管理url
enum API {
  QUERY = "/notice/query",
  CREATE = "/notice/create",
  EDIT = "/notice/edit",
  DELETE = "/notice/delete",
}

// 导出api
// 请求公告数据
export const reqQueryByPage = (pageInfo: AnnPageInfo) =>
  request.post(API.QUERY, pageInfo);
// 创建公告
export const reqCreate = (noticeInfo: NoticeInfo) =>
  request.post(API.CREATE, noticeInfo);
// 编辑公告
export const reqEdit = (noticeInfo: NoticeInfo) =>
  request.post(API.EDIT, noticeInfo);
// 删除公告
export const reqDelete = (id: { id: number }) => request.post(API.DELETE, id);
