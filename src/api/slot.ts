// slot api
import request from "@/utils/request";

// 统一管理url
enum API {
  DELETE = "/slot/delete",
  SET_GAME_ID = "/slot/set_game_id",
  BIND_GUEST_ACCOUNT = "/slot/extend_expire_time",
}

// 导出api
// 请求删除slot
export const reqDeleteSlot = (info: DeleteSlotInfo) =>
    request.post(API.DELETE, info);

// 请求设置slot游戏ID
export const reqSetSlotGameId = (info: SetSlotGameIdInfo) =>
    request.post(API.SET_GAME_ID, info);

// 请求延长slot有效期
export const reqExtendSlotExpireTime = (info: ExtendSlotExpireTime) =>
    request.post(API.BIND_GUEST_ACCOUNT, info);
