<template>
  <div>
    <el-popover
      trigger="click"
      placement="top"
      :width="326"
      :virtual-ref="dynamicTurnstileVirtualRef"
      :visible="robotVisible && dynamicTurnstileVirtualRef?.value" 
      virtual-triggering
    >
      <div class="cf-turnstile"
        data-sitekey="0x4AAAAAAAQhC3f_WRwvJ19O"
        data-callback="onRobotSuccess"
        data-error-callback="onRobotError"
        data-expired-callback="onRobotError"
        data-before-interactive-callback="onRobotBeforeInteractive"
        data-after-interactive-callback="onRobotAfterInteractive"
        data-size="normal"
        :data-theme="exportedLocalStorage.getItem('DARKMODE') === 'true' ? 'dark' : 'light'">
      </div>
    </el-popover>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">我的信息</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray">
            游戏ID在第一次成功登录时自动获取，之后您只能登录至此ID的租赁服
          </span>
        </div>
        <el-divider />
        <el-descriptions
          class="margin-top"
          :direction="settingStore.infoDirection"
          :column="settingStore.infoCol"
          size="default"
          border
        >
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <UserFilled />
                </el-icon>
                用户名
              </div>
            </template>
            {{ userStore.uname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <Coordinate />
                </el-icon>
                游戏ID
              </div>
            </template>
            {{ userStore.uid }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon"> <Tools /> </el-icon>
                用户权限
              </div>
            </template>
            {{ userPermissionStr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <Connection />
                </el-icon>
                创建时间
              </div>
            </template>
            {{ createTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <SwitchButton />
                </el-icon>
                有效期至
              </div>
            </template>
            {{ expireTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <Promotion />
                </el-icon>
                无限制至
              </div>
            </template>
            {{ unlimitedTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card v-loading="codeLoading" style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">兑换码</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用兑换码更新您的用户中心账户</span
          >
        </div>
        <el-divider />

        <el-form
          @submit.prevent
          class="limited-form-container"
          :model="codeData"
          :rules="redeemRules"
          ref="codeform"
        >
          <el-form-item label="兑换码" prop="redeem_code">
            <el-input
              v-model="codeData.redeem_code"
              placeholder="请输入兑换码"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="codeUse">兑换</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card v-loading="tokenLoading" style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">FBToken</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >为 PhoenixBuilder 或者其他程序提供的登录凭证</span
          >
        </div>
        <el-divider />
        <el-button type="primary" round @click="tokenDownload">获取</el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">上传黑名单</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >在进入服务器时获取黑名单并上传至验证服务器, 不会影响进服速度</span
          >
        </div>
        <el-divider />
        <el-switch
          v-model="userStore.banlistFlag"
          :loading="banloading"
          :before-change="beforeChange"
        />
      </div>
    </el-card>

    <el-card
      style="margin-top: 12px"
      shadow="hover"
      v-if="userStore.uhasEmail" 
    >
      <template #header>
        <div class="card-header">修改密码</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >更新您的登录密码</span
          >
        </div>
        <el-divider />

        <el-form
          class="password-form-container"
          :model="passwordData"
          :rules="changePasswordRules"
          ref="passwordform"
        >
          <el-form-item label="邮箱验证码" prop="emailVerifyCode">
            <el-row class="row-bg" justify="center" style="width: 100%;">
              <el-col :span="16" style="padding-right: 10px;">
                <el-input
                  v-model="passwordData.emailVerifyCode"
                  placeholder="输入邮箱验证码"
                />
              </el-col>
              <el-col :span="8">
                <el-button
                  ref="changePasswordEmailCodeBtnRef"
                  type="primary"
                  style="width: 100%"
                  @click="sendEmailCode('changePassword')"
                  :disabled="codeTimes > 0"
                  :loading="emailCodeLoadingFlag"
                >
                  {{ codeTimes > 0 ? `重新发送(${codeTimes}s)` : "发送验证码" }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="输入新密码" prop="newPassword">
            <el-input
              type="password"
              show-password
              v-model="passwordData.newPassword"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="repassword">
            <el-input
              type="password"
              show-password
              v-model="passwordData.repassword"
              placeholder="请确认新密码"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button
              :loading="passwordloadingflag"
              type="primary"
              @click="changePassword"
              >修改密码</el-button
            >
            <el-button @click="clearForm">清空表单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      style="margin-top: 12px"
      shadow="hover"
      v-if="!userStore.uhasEmail" 
    >
      <template #header>
        <div class="card-header">绑定邮箱</div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray"
          >为您的账户绑定安全邮箱, 绑定后可进行修改密码等操作</span
        >
      </div>
      <el-divider />
      <el-form
        class="limited-form-container"
        :model="emailBindData"
        :rules="bindEmailRules"
        ref="emailbindform"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="emailBindData.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailVerifyCode">
          <el-row class="row-bg" justify="center" style="width: 100%;">
            <el-col :span="16" style="padding-right: 10px;">
              <el-input
                v-model="emailBindData.emailVerifyCode"
                placeholder="输入邮箱验证码"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                ref="emailBindEmailCodeBtnRef"
                type="primary"
                style="width: 100%"
                @click="sendEmailCode('emailBind')"
                :disabled="codeTimes > 0"
                :loading="emailCodeLoadingFlag"
              >
                {{ codeTimes > 0 ? `重新发送(${codeTimes}s)` : "发送验证码" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            :loading="emailbindloadingflag"
            type="primary"
            @click="bindEmail"
          >
            绑定
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card
      style="margin-top: 12px"
      shadow="hover"
      v-if="userStore.uhasEmail" 
    >
      <template #header>
        <div class="card-header">解绑邮箱</div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray"
          >解绑您的账户的安全邮箱, 解绑后无法进行修改密码等操作</span
        >
      </div>
      <el-divider />
      <el-form
        class="limited-form-container"
        :model="emailUnbindData"
        :rules="unbindEmailRules"
        ref="emailunbindform"
      >
        <el-form-item label="邮箱验证码" prop="emailVerifyCode">
          <el-row class="row-bg" justify="center" style="width: 100%;">
            <el-col :span="16" style="padding-right: 10px;">
              <el-input
                v-model="emailUnbindData.emailVerifyCode"
                placeholder="输入邮箱验证码"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                ref="emailUnbindEmailCodeBtnRef"
                type="primary"
                style="width: 100%"
                @click="sendEmailCode('emailUnbind')"
                :disabled="codeTimes > 0"
                :loading="emailCodeLoadingFlag"
              >
                {{ codeTimes > 0 ? `重新发送(${codeTimes}s)` : "发送验证码" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            :loading="emailunbindloadingflag"
            type="danger"
            @click="unbindEmail"
          >
            解绑
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="apikeyLoading" style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">API Key</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >为 API 调用提供的用户凭证, API Key 会给予调用者控制您账户的权限, 请勿随意泄露</span
          >
        </div>
        <el-divider />
        <Precode :code="userStore.uapi" :type="'bash'"></Precode>
        <el-button
          style="margin-top: 12px"
          type="primary"
          round
          @click="apikeyGen"
          v-if="userStore.uapi === '' || userStore.uapi === '暂未获取'"
          >生成</el-button
        >
        <el-button
          style="margin-top: 12px"
          type="danger"
          round
          @click="apikeyDis"
          v-if="userStore.uapi !== '' && userStore.uapi !== '暂未获取'"
          >删除</el-button
        >
      </div>
    </el-card>

    <el-card
      style="margin-top: 12px"
      shadow="hover"
      v-if="userStore.uhasEmail" 
    >
      <template #header>
        <div class="card-header">删除账户</div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray"
          >立即删除账户的所有信息且无法恢复, 请谨慎操作</span
        >
      </div>
      <el-divider />
      <el-form
        class="limited-form-container"
        :model="deleteAccountData"
        :rules="deleteAccountRules"
        ref="deleteaccountform"
      >
        <el-form-item label="邮箱验证码" prop="emailVerifyCode">
          <el-row class="row-bg" justify="center" style="width: 100%;">
            <el-col :span="16" style="padding-right: 10px;">
              <el-input
                v-model="deleteAccountData.emailVerifyCode"
                placeholder="输入邮箱验证码"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                ref="deleteAccountEmailCodeBtnRef"
                type="primary"
                style="width: 100%"
                @click="sendEmailCode('deleteAccount')"
                :disabled="codeTimes > 0"
                :loading="emailCodeLoadingFlag"
              >
                {{ codeTimes > 0 ? `重新发送(${codeTimes}s)` : "发送验证码" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            :loading="deleteaccountloadingflag"
            type="danger"
            @click="deleteAccount"
          >
            删除
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入设置仓库
import useSettingStore from "@/store/modules/setting";
import { computed, onActivated, onMounted, onUnmounted, reactive, ref } from "vue";
// 导入时间转换函数
import { getTimeStr2 } from "@/utils";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
// 导入路由
import { useRouter } from "vue-router";
// 导出本地仓库给HTML使用
let exportedLocalStorage = localStorage
// 使用设置仓库的移动端适配
let settingStore = useSettingStore();
// 使用用户仓库
let userStore = useUserStore();
// 使用路由
let $router = useRouter();
// 人机验证动态虚拟ref
const dynamicTurnstileVirtualRef = ref();
// 人机验证显示
const robotVisible = ref(false);
// 人机验证
let captchaExecutingFlag = ref(true);
// 修改密码发送验证码按钮ref
const changePasswordEmailCodeBtnRef = ref();
// 绑定邮箱发送验证码按钮ref
const emailBindEmailCodeBtnRef = ref();
// 解绑邮箱发送验证码按钮ref
const emailUnbindEmailCodeBtnRef = ref();
// 删除账户发送验证码按钮ref
const deleteAccountEmailCodeBtnRef = ref();

// 刷新验证码
let refreshCaptcha = () => {
  captchaExecutingFlag.value = true;
  // @ts-ignore
  turnstile.reset();
  // @ts-ignore
  turnstile.execute();
};

// 人机验证成功回调
var onRobotSuccess = async () => {
  captchaExecutingFlag.value = false
};
// 人机验证交互前回调
var onRobotBeforeInteractive = async () => {
  robotVisible.value = true
}
// 人机验证交互后回调
var onRobotAfterInteractive = async () => {
  robotVisible.value = false
}
// 人机验证错误回调
var onRobotError = async () => {
  refreshCaptcha()
};

let banloading = ref(false);
let beforeChange = async () => {
  banloading.value = true;
  try {
    let result = await userStore.userBanList({
      enable: !userStore.banlistFlag,
    });
    // @ts-ignore
    if (result.success) {
      // userStore.banlistFlag = !userStore.banlistFlag;
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      return true;
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      return false;
    }
  } catch (error) {
    //console.log(error);
    return false;
  } finally {
    banloading.value = false;
  }
};

let apikeyLoading = ref(false);
let apikeyGen = async () => {
  apikeyLoading.value = true;
  try {
    let result = await userStore.userGenApi();
    // @ts-ignore
    if (result.success) {
      // @ts-ignore
      userStore.uapi = result.api_key;
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
      // 获取失败
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    apikeyLoading.value = false;
  }
};
let apikeyDis = async () => {
  apikeyLoading.value = true;
  try {
    let result = await userStore.userDisApi();
    // @ts-ignore
    if (result.success) {
      userStore.uapi = "暂未获取";
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
      // 获取失败
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    apikeyLoading.value = false;
  }
};

// 用户信息部分
let getInfo = async () => {
  // 获取用户信息
  await userStore.userInfo();
};
// 用户的创建时间以及过期时间
const createTime = computed(() => {
  let timestr = getTimeStr2(Number(userStore.ucreate));
  return timestr;
});
const expireTime = computed(() => {
  let timestr = getTimeStr2(Number(userStore.uexpire));
  return timestr;
});
const unlimitedTime = computed(() => {
  let timestr = getTimeStr2(Number(userStore.uunlimited));
  return timestr;
});
const userPermissionStr = computed(() => {
  if (userStore.upermission === "") {
    return "未知";
  }
  let permission = Number(userStore.upermission)
  switch (permission) {
    case 0:
      return `游客(${permission})`;
    case 1:
      return `激活用户(${permission})`;
    case 2:
      return `系统管理员(${permission})`;
    default:
      return `未知(${permission})`;
  }
});

// token部分
// token获取loading
let tokenLoading = ref(false);
// 请求phoenixtoken
let tokenDownload = async () => {
  tokenLoading.value = true;
  ElNotification({
    type: "info",
    title: "Info",
    message: "正在获取FBToken, 请稍后",
    duration: 3000,
  });
  try {
    let result = await userStore.userDownload();
    ElNotification({
      type: "success",
      title: "Success",
      message: "请留意浏览器下载内容",
      duration: 3000,
    });
    // @ts-ignore
    if (result.success === false) {
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    tokenLoading.value = false;
  }
};

// 修改密码部分
// 表单元素
let passwordform = ref(null);
// 表单数据
let passwordData = reactive({
  emailVerifyCode: "",
  newPassword: "",
  repassword: "",
});
// 清空表单
let clearForm = () => {
  passwordData.emailVerifyCode = "";
  passwordData.newPassword = "";
  passwordData.repassword = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (passwordform.value) {
        // @ts-ignore
        passwordform.value.clearValidate([
          "emailVerifyCode",
          "newPassword",
          "repassword",
        ]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 每次进入子页面就清空表单
onActivated(() => {
  clearForm();
});
// 修改按钮加载状态
let passwordloadingflag = ref(false);
// @ts-ignore
let validateRePassword = (rule: any, value: any, callback: any) => {
  if (value !== passwordData.newPassword) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};
// @ts-ignore
let validateRedeemCode = (rule: any, value: any, callback: any) => {
  // uuid正则
  const codeReg =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!codeReg.test(value)) {
    callback(new Error("兑换码格式不正确"));
  } else {
    callback();
  }
};
// 表单校验规则
const bindEmailRules = {
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      type: "email",
      message: "请输入正确的邮箱",
      trigger: ["blur", "change"],
    },
  ],
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur",
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" },
  ],
};
const unbindEmailRules = {
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur",
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" },
  ],
};
const changePasswordRules = {
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur",
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" },
  ],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur",
    },
  ],
  repassword: [
    {
      required: true,
      message: "请确认新密码",
      trigger: "blur",
    },
    { validator: validateRePassword, trigger: "blur" },
  ],
};
const redeemRules = {
  redeem_code: [
    {
      required: true,
      message: "兑换码不能为空",
      trigger: "blur",
    },
    { validator: validateRedeemCode, trigger: "blur" },
  ],
};
const deleteAccountRules = {
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur",
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" },
  ],
};

let emailCodeLoadingFlag = ref(false);
let codeTimes = ref(0)
// 发送邮箱验证码
let sendEmailCode = async (type: String) => {
  emailCodeLoadingFlag.value = true;
  // 切换动态虚拟ref
  switch (type) {
    case "emailBind":
      dynamicTurnstileVirtualRef.value = emailBindEmailCodeBtnRef.value;
      break;
    case "emailUnbind":
      dynamicTurnstileVirtualRef.value = emailUnbindEmailCodeBtnRef.value;
      break;
    case "changePassword":
      dynamicTurnstileVirtualRef.value = changePasswordEmailCodeBtnRef.value;
      break;
    case "deleteAccount":
      dynamicTurnstileVirtualRef.value = deleteAccountEmailCodeBtnRef.value;
      break;
    default:
      break;
  }
  // 如果人机验证正在执行
  if (captchaExecutingFlag.value) {
    // 等待完成
    let result = await new Promise((resolve) => {
      let timer = setInterval(() => {
        // 如果人机验证完成
        if (!captchaExecutingFlag.value) {
          clearInterval(timer);
          resolve(true);
        }
        // 如果人机需要人工交互
        if (robotVisible.value) {
          clearInterval(timer);
          resolve(false);
        }
      }, 200);
    });
    // 检查结果
    if (!result) {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: "需要完成人机验证交互",
        duration: 3000,
      });
      emailCodeLoadingFlag.value = false;
      return;
    }else{
      // 解绑动态虚拟ref
      dynamicTurnstileVirtualRef.value = null;
    }
  }
  // 尝试获取验证码
  // @ts-ignore
  let captchaToken = turnstile.getResponse();
  if (!captchaToken) {
    // 消息提示
    ElNotification({
      type: "warning",
      title: "Warning",
      message: "人机验证未通过",
      duration: 3000,
    });
    // 重置人机验证
    refreshCaptcha()
    return;
  }
  // 根据类型组装请求参数
  let requestEmailVerifyCodeInfo = {
    email: "",
    action_type: 0,
    captcha_token: captchaToken,
  };
  switch (type) {
    case "emailBind":
      requestEmailVerifyCodeInfo.action_type = 0;
      requestEmailVerifyCodeInfo.email = emailBindData.email;
      break;
    case "emailUnbind":
      requestEmailVerifyCodeInfo.action_type = 1;
      break;
    case "changePassword":
      requestEmailVerifyCodeInfo.action_type = 2;
      break;
    case "deleteAccount":
      requestEmailVerifyCodeInfo.action_type = 4;
      break;
    default:
      break;
  }
  // 发送验证码
  try {
    // 仓库发起邮箱验证码请求
    let result = await userStore.userRequestEmailVerifyCode(requestEmailVerifyCodeInfo);
    // @ts-ignore
    if (result.success) {
      // 请求成功，清空表单
      clearForm();
      // 消息提示
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 开始倒计时
      codeTimes.value = 60
      let timer = setInterval(() => {
        codeTimes.value--;
        if (codeTimes.value < 1) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    emailCodeLoadingFlag.value = false;
    refreshCaptcha()
  }
};

// 绑定邮箱
let emailbindform = ref(null);
let emailbindloadingflag = ref(false);
let emailBindData = reactive({
  email: "",
  emailVerifyCode: "",
});
let bindEmail = async () => {
  try {
    // @ts-ignore
    await emailbindform.value.validate();
    // 显示加载
    emailbindloadingflag.value = true;
    // 仓库发起绑定邮箱请求
    let result = await userStore.userEmailBind({
      email: emailBindData.email,
      email_verify_code: emailBindData.emailVerifyCode,
    });
    // @ts-ignore
    if (result.success) {
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 刷新信息
      getInfo();
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    emailbindloadingflag.value = false;
  }
};

// 解绑邮箱
let emailunbindform = ref(null);
let emailunbindloadingflag = ref(false);
let emailUnbindData = reactive({
  emailVerifyCode: "",
});
let unbindEmail = async () => {
  try {
    // @ts-ignore
    await emailunbindform.value.validate();
    // 显示加载
    emailunbindloadingflag.value = true;
    // 仓库发起解绑邮箱请求
    let result = await userStore.userEmailUnbind({
      email_verify_code: emailUnbindData.emailVerifyCode,
    });
    // @ts-ignore
    if (result.success) {
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 刷新信息
      getInfo();
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    emailunbindloadingflag.value = false;
  }
};

// 修改密码
let changePassword = async () => {
  try {
    // @ts-ignore
    await passwordform.value.validate();
    // 显示加载
    passwordloadingflag.value = true;
    let passwordInfo = {
      email_verify_code: "",
      new_password: "",
    };
    passwordInfo.email_verify_code = passwordData.emailVerifyCode;
    passwordInfo.new_password = passwordData.newPassword;
    // 仓库发起修改密码请求
    let result = await userStore.userPassword(passwordInfo);
    // @ts-ignore
    if (result.success) {
      // 请求成功，清空表单
      clearForm();
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    ////console.log(error);
  } finally {
    // 请求完成，关闭加载
    passwordloadingflag.value = false;
  }
};

// 兑换码
// 兑换码卡片loading
let codeLoading = ref(false);
// 表单元素
let codeform = ref(null);
// 表单数据
let codeData = reactive({
  redeem_code: "",
});
// 清空表单
let clearCodeForm = () => {
  codeData.redeem_code = "";
  try {
    setTimeout(() => {
      if (codeform.value) {
        // @ts-ignore
        codeform.value.clearValidate(["redeem_code"]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 每次进入子页面就清空表单
onActivated(() => {
  clearCodeForm();
});
// 使用兑换码
let codeUse = async () => {
  try {
    // @ts-ignore
    await codeform.value.validate();
    // 显示加载
    codeLoading.value = true;
    let codeInfo = {
      redeem_code: "",
    };
    codeInfo.redeem_code = codeData.redeem_code;
    // 仓库发起请求
    let result = await userStore.userCode(codeInfo);
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
        dangerouslyUseHTMLString: true,
      });
      // 刷新信息
      getInfo();
      // 清空表单
      clearCodeForm();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error) {
    ////console.log(error);
  } finally {
    codeLoading.value = false;
  }
};

// 删除账户
let deleteaccountform = ref(null);
let deleteaccountloadingflag = ref(false);
let deleteAccountData = reactive({
  emailVerifyCode: "",
});
let deleteAccount = async () => {
  try {
    // @ts-ignore
    await deleteaccountform.value.validate();
    // 显示加载
    deleteaccountloadingflag.value = true;
    // 仓库发起解绑邮箱请求
    let result = await userStore.userDeleteAccount({
      email_verify_code: deleteAccountData.emailVerifyCode,
    });
    // @ts-ignore
    if (result.success) {
      // 请求成功，登出
      $router.push("/login");
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    deleteaccountloadingflag.value = false;
  }
};

onUnmounted(() => {
  // @ts-ignore
  turnstile.remove();
  // @ts-ignore
  window.onRobotBeforeInteractive = null;
  // @ts-ignore
  window.onRobotAfterInteractive = null;
  // @ts-ignore
  window.onRobotSuccess = null;
  // @ts-ignore
  window.onRobotError = null;
});
onMounted(() => {
  // @ts-ignore
  window.onRobotBeforeInteractive = onRobotBeforeInteractive;
  // @ts-ignore
  window.onRobotAfterInteractive = onRobotAfterInteractive;
  // @ts-ignore
  window.onRobotSuccess = onRobotSuccess;
  // @ts-ignore
  window.onRobotError = onRobotError;
  // @ts-ignore
  turnstile.render('.cf-turnstile');
  getInfo();
});
</script>

<style scoped lang="scss">
.card-header,
.card-footer {
  display: flex;
  align-items: center;
}
.userinfo-cell-item {
  display: flex;
  align-items: center;
  .userinfo-cell-item-icon {
    margin-right: 8px;
  }
}
.password-form-container,
.limited-form-container {
  max-width: 600px;
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: #000000 !important;
}
</style>
