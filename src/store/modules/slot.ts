// slot仓库
import { defineStore } from "pinia";

// Slot 请求api
import {
  reqDeleteSlot,
  reqSetSlotGameId,
  reqExtendSlotExpireTime,
} from "@/api/slot";

// 创建仓库
let useSlotStore = defineStore("slot", () => {
  // 请求删除Slot
  let deleteSlot = async (info: DeleteSlotInfo) => {
    try {
      let result = await reqDeleteSlot(info);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求设置Slot游戏ID
  let setSlotGameID = async (info: SetSlotGameIdInfo) => {
    try {
      let result = await reqSetSlotGameId(info);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求删除Slot
  let extendSlotExpireTime = async (info: ExtendSlotExpireTime) => {
    try {
      let result = await reqExtendSlotExpireTime(info);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 导出
  return {
    deleteSlot,
    setSlotGameID,
    extendSlotExpireTime,
  };
});

export default useSlotStore;
