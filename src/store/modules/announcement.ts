// 公告仓库
import { defineStore } from "pinia";

// 公告请求api
import { reqQueryByPage, reqCreate, reqDelete, reqEdit } from "@/api/announcement";

interface pageInfo {
  page_num: number;
  page_size: number;
}
interface announcementInfo {
  ID: number;
  title: string;
  content: string;
}

// 创建仓库
let useAnnouncementStore = defineStore("announcement", () => {
  // 获取公告数组
  let getAnn = async (pageInfo: pageInfo) => {
    try {
      let result = await reqQueryByPage(pageInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 创建公告
  let annCreate = async (announcementInfo: announcementInfo) => {
    try {
      let result = await reqCreate(announcementInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 编辑公告
  let annEdit = async (announcementInfo: announcementInfo) => {
    try {
      let result = await reqEdit(announcementInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 删除公告
  let annDelete = async (id: number) => {
    try {
      let result = await reqDelete({ id });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    getAnn,
    annCreate,
    annEdit,
    annDelete,
  };
});

export default useAnnouncementStore;
