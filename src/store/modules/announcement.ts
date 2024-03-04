// 公告仓库
import { defineStore } from "pinia";

// 公告请求api
import {
  reqQueryByPage,
  reqCreate,
  reqDelete,
  reqEdit,
} from "@/api/announcement";

// 创建仓库
let useAnnouncementStore = defineStore("announcement", () => {
  // 获取公告数组
  let getAnn = async (pageInfo: AnnPageInfo) => {
    try {
      let result = await reqQueryByPage(pageInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 创建公告
  let annCreate = async (announcementInfo: AnnouncementInfo) => {
    try {
      let result = await reqCreate(announcementInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 编辑公告
  let annEdit = async (announcementInfo: AnnouncementInfo) => {
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
