// 用户仓库
import { defineStore } from "pinia";

// 用户请求api
import {
  reqLogout,
  reqNewToken,
  reqRegister,
  reqLogin,
  reqGetStatus,
  reqGetPhoenixToken,
  reqChangePassword,
  reqUseRedeemCode,
  reqDisableApiKey,
  reqGenApiKey,
  reqSetBanListUpload,
  reqSetAutoRestartServer,
  reqRequestEmailVerifyCode,
  reqResetPassword,
  reqEmailBind,
  reqEmailUnbind,
  reqRemoveAccount,
} from "@/api/user";
// 导入路由创建动态菜单
import {
  defaultRoutes,
  permissionRoutes,
  defaultRoutes2,
  anyRoute,
} from "@/router/routes";
import { ref } from "vue";
import router from "@/router";
// @ts-ignore
import cloneDeep from "lodash/cloneDeep";
// 导入加密
// @ts-ignore
import sha256 from "crypto-js/sha256";

interface userInfo {
  username: string;
  password: string;
  captcha_token: string;
}
interface userDetail {
  username: string;
  game_id: number;
  unlimited_until: number;
  permission: number;
  is_admin: boolean;
  create_at: number;
  expire_at: number;
  enable_ban_list_upload: boolean;
  enable_auto_restart_server: boolean;
  api_key: string;
  has_email: boolean;
}
interface passwordInfo {
  email_verify_code: string;
  new_password: string;
}
interface requestEmailVerifyCodeInfo {
  email?: string;
  username?: string;
  action_type: number;
  captcha_token: string;
}
interface resetPasswordInfo {
  username: string;
  email_verify_code: string;
  new_password: string;
}
interface emailBindInfo {
  email: string;
  email_verify_code: string;
}
interface emailUnbindInfo {
  email_verify_code: string;
}
interface deleteAccountInfo {
  email_verify_code: string;
}

// 过滤权限路由，传入权限路由以及用户所拥有的的路由权限数组
function filterRoute(asyncRoutes: any, permission: any) {
  // 循环权限路由，返回一个过滤完成的路由列表
  return asyncRoutes.filter((item: any) => {
    // 如果用户的权限路由数组内有对应权限路由
    if (permission.includes(item.name)) {
      // 检查此路由是否有子路由，如果有就再循环一遍
      if (item.children && item.children.length > 0) {
        item.children = filterRoute(item.children, permission);
      }
      // 将对应路由添加到要返回的路由中
      return true;
    }
  });
}
// 过滤没有权限的，由下述移除
function removeFilter(asyncRoutes: any, permission: any) {
  // 循环权限路由，返回一个过滤完成的路由列表
  return asyncRoutes.filter((item: any) => {
    // 如果用户的权限路由数组内有对应权限路由
    if (!permission.includes(item.name)) {
      // 检查此路由是否有子路由，如果有就再循环一遍
      if (item.children && item.children.length > 0) {
        item.children = removeFilter(item.children, permission);
      }
      // 将对应路由添加到要返回的路由中
      return true;
    }
  });
}

// 创建仓库
let useUserStore = defineStore("user", () => {
  // 用户信息部分
  // 用户token，先从本地获取，没有就空字符串
  let token = ref(localStorage.getItem("TOKEN") || "");
  // 用户名
  let uname = ref(localStorage.getItem("UNAME") || "");
  // 游戏id
  let uid = ref(localStorage.getItem("UID") || "");
  // 无限制至
  let uunlimited = ref(localStorage.getItem("UUNLIMITEDFLAG") || "");
  // 权限
  let upermission = ref(localStorage.getItem("UPERMISSION") || "");
  // 是否管理员
  let adminFlag = ref(localStorage.getItem("ADMINFLAG") || "");
  // 用户创建时间
  let ucreate = ref(localStorage.getItem("UCREATE") || "");
  // 用户过期时间
  let uexpire = ref(localStorage.getItem("UEXPIRE") || "");
  // 黑名单
  let banlistFlag = ref(Boolean(localStorage.getItem("BANLISTFLAG")) || false);
  // 自动重启服务器
  let autoRestartFlag = ref(Boolean(localStorage.getItem("AUTORESTARTFLAG")) || false);
  // API
  let uapi = ref(localStorage.getItem("UAPI") || "");
  // 是否有邮箱
  let uhasEmail = ref(Boolean(localStorage.getItem("HAS_EMAIL")) || false);

  // 动态路由菜单项
  let menuRoutes = ref([...defaultRoutes]);
  // 动态路由刷新flag
  let refreshFlag = ref(false);
  // 权限按钮组
  let btns = ref([]);

  // 获取会话token
  let getToken = async () => {
    let result = await reqNewToken();
    if (result) {
      // @ts-ignore
      token.value = result;
      return "success";
    } else {
      return Promise.reject("fail");
    }
  };

  // 请求登录或者注册
  let userRegLog = async (userInfo: userInfo, type: "login" | "reg") => {
    // 先对密码进行加密
    const hashpassword = sha256(userInfo.password).toString();
    userInfo.password = hashpassword;
    // 发起请求
    try {
      let result = null;
      if (type == "reg") {
        result = await reqRegister(userInfo);
      } else if (type == "login") {
        result = await reqLogin(userInfo);
        localStorage.setItem("TOKEN", token.value);
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求更改密码
  let userPassword = async (passwordInfo: passwordInfo) => {
    // 先对密码进行加密
    passwordInfo.new_password = sha256(passwordInfo.new_password).toString();
    // 发起请求
    try {
      let result = await reqChangePassword(passwordInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 持久化用户信息
  let setUser = (userInfo: userDetail) => {
    uname.value = userInfo.username;
    if (userInfo.is_admin) {
      adminFlag.value = "是";
    } else {
      adminFlag.value = "否";
    }
    if (userInfo.game_id == 0) {
      uid.value = "暂未获取";
    } else {
      uid.value = userInfo.game_id.toString();
    }
    uunlimited.value = userInfo.unlimited_until.toString();
    ucreate.value = userInfo.create_at.toString();
    uexpire.value = userInfo.expire_at.toString();
    uapi.value = userInfo.api_key || "未生成";
    banlistFlag.value = userInfo.enable_ban_list_upload;
    autoRestartFlag.value = userInfo.enable_auto_restart_server;
    upermission.value = userInfo.permission.toString();
    uhasEmail.value = userInfo.has_email;

    localStorage.setItem("UNAME", userInfo.username);
    localStorage.setItem("UID", uid.value);
    localStorage.setItem("UUNLIMITED", uunlimited.value);
    localStorage.setItem("UPERMISSION", upermission.value);
    localStorage.setItem("ADMINFLAG", adminFlag.value);
    localStorage.setItem("UCREATE", ucreate.value);
    localStorage.setItem("UEXPIRE", uexpire.value);
    localStorage.setItem("BANLISTFLAG", banlistFlag.value.toString());
    localStorage.setItem("AUTORESTARTFLAG", autoRestartFlag.value.toString());
    localStorage.setItem("UAPI", uapi.value);
    localStorage.setItem("HAS_EMAIL", uhasEmail.value.toString());
  };
  // 清空用户信息函数
  let clearUser = () => {
    token.value = "";
    uname.value = "";
    uid.value = "";
    upermission.value = "";
    adminFlag.value = "";
    uunlimited.value = "";
    ucreate.value = "";
    uexpire.value = "";
    banlistFlag.value = false;
    autoRestartFlag.value = false;
    uapi.value = "";
    uhasEmail.value = false;

    localStorage.setItem("TOKEN", token.value);
    localStorage.setItem("UNAME", uname.value);
    localStorage.setItem("UID", uid.value);
    localStorage.setItem("UUNLIMITED", uunlimited.value);
    localStorage.setItem("UPERMISSION", upermission.value);
    localStorage.setItem("ADMINFLAG", adminFlag.value);
    localStorage.setItem("UCREATE", ucreate.value);
    localStorage.setItem("UEXPIRE", uexpire.value);
    localStorage.setItem("BANLISTFLAG", "");
    localStorage.setItem("UAPI", uapi.value);
    localStorage.setItem("HAS_EMAIL", "");

    // 重置flag，使得重新登录会再次动态添加路由
    refreshFlag.value = false;
  };

  // 获取用户信息
  let userInfo = async () => {
    // 发起请求
    let result = await reqGetStatus();
    // @ts-ignore
    if (result.success) {
      // 获取成功，存储用户信息
      // @ts-ignore
      setUser(result);
      // 根据得到的用户路由权限来渲染动态路由
      let filterArr: Array<string> = [];
      // @ts-ignore
      if (result.is_admin) {
        filterArr = ["admin"];
      }
      let userRoutes = filterRoute(cloneDeep(permissionRoutes), filterArr);
      let removePermission = removeFilter(
        cloneDeep(permissionRoutes),
        filterArr
      );
      menuRoutes.value = [...defaultRoutes, ...userRoutes, ...defaultRoutes2];
      // 动态添加路由
      userRoutes.forEach((route: any) => {
        router.addRoute("layout", route);
      });
      defaultRoutes2.forEach((route: any) => {
        router.addRoute("layout", route);
      });
      // 移除没有权限的路由
      removePermission.forEach((route: any) => {
        router.removeRoute(route.name);
      });
      // 通配路由放在最后
      router.addRoute(anyRoute);
    } else {
      // 获取失败，返回一个失败的promise
      return Promise.reject(result);
    }
  };

  // 请求登出
  let userLogout = async () => {
    try {
      // 发起请求
      let result = await reqLogout();
      // @ts-ignore
      if (result.success) {
        clearUser();
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求phoenixtoken
  let userDownload = async () => {
    // 发起请求
    try {
      let result = await reqGetPhoenixToken();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 黑名单
  let userBanList = async (enable: { enable: boolean }) => {
    // 发起请求
    try {
      let result = await reqSetBanListUpload(enable);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 自动重启服务器
  let userAutoRestart = async (enable: { enable: boolean }) => {
    // 发起请求
    try {
      let result = await reqSetAutoRestartServer(enable);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求使用兑换码
  let userCode = async (code: { redeem_code: string }) => {
    // 发起请求
    try {
      let result = await reqUseRedeemCode(code);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求生成api
  let userGenApi = async () => {
    // 发起请求
    try {
      let result = await reqGenApiKey();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求禁用api
  let userDisApi = async () => {
    // 发起请求
    try {
      let result = await reqDisableApiKey();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求邮箱验证码
  let userRequestEmailVerifyCode = async (info: requestEmailVerifyCodeInfo) => {
    // 发起请求
    try {
      let result = await reqRequestEmailVerifyCode(info);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求重置密码
  let userResetPassword = async (resetPasswordInfo: resetPasswordInfo) => {
    // 先对密码进行加密
    const hashpassword = sha256(resetPasswordInfo.new_password).toString();
    resetPasswordInfo.new_password = hashpassword;
    // 发起请求
    try {
      let result = await reqResetPassword(resetPasswordInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求邮箱绑定
  let userEmailBind = async (emailBindInfo: emailBindInfo) => {
    // 发起请求
    try {
      let result = await reqEmailBind(emailBindInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求邮箱解绑
  let userEmailUnbind = async (emailUnbindInfo: emailUnbindInfo) => {
    // 发起请求
    try {
      let result = await reqEmailUnbind(emailUnbindInfo);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求删除账户
  let userDeleteAccount = async (deleteAccountInfo: deleteAccountInfo) => {
    // 发起请求
    try {
      let result = await reqRemoveAccount(deleteAccountInfo);
      // @ts-ignore
      if (result.success) {
        clearUser();
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    token,
    uname,
    uid,
    userInfo,
    userLogout,
    menuRoutes,
    clearUser,
    refreshFlag,
    btns,
    getToken,
    userRegLog,
    upermission,
    adminFlag,
    uunlimited,
    ucreate,
    uexpire,
    banlistFlag,
    autoRestartFlag,
    uapi,
    uhasEmail,
    userDownload,
    userPassword,
    userCode,
    userGenApi,
    userDisApi,
    userBanList,
    userAutoRestart,
    userRequestEmailVerifyCode,
    userResetPassword,
    userEmailBind,
    userEmailUnbind,
    userDeleteAccount,
  };
});

export default useUserStore;
