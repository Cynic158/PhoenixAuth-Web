<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span style="margin-right: 16px">账户信息</span>
        </div>
      </template>

      <div>
        <el-alert
          :title="alertTitle"
          :type="alertType"
          show-icon
          :closable="false"
        />
        <el-divider />
        <div style="display: inline-flex; align-items: center; flex-wrap: wrap">
          <el-button
            @click="getBotStatus"
            type="primary"
            round
            :loading="queryLoading"
            >刷新</el-button
          >
          <el-button
            :disabled="banUnbind"
            v-if="showUnbind && botInfo.set"
            @click="unbindDialog"
            type="danger"
            round
            >解绑</el-button
          >
        </div>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="botInfo.set == false"
      v-loading="createDefaultLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">手机登录</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用您提供的手机账号作为Bot</span
          >
        </div>
        <el-divider />
        <el-alert
          v-if="phoneAlertTitle"
          style="margin-bottom: 16px"
          :title="phoneAlertTitle"
          :type="phoneAlertType"
          show-icon
          :closable="false"
        />

        <el-form
          class="phone-form-container"
          :model="phoneData"
          :rules="phoneRules"
          ref="phoneform"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="phoneData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="phoneData.code" placeholder="请输入验证码" />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="createBotByPhone">绑定</el-button>
            <el-button
              v-if="!codeTimeShow"
              type="primary"
              @click="robotCheck"
              :loading="codeloadingflag"
              :disabled="codedisabled"
              >获取验证码</el-button
            >
            <el-button v-if="codeTimeShow" type="primary" disabled>{{
              codeTimes
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="botInfo.set == false"
      v-loading="createDefaultLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">邮箱登录</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用您提供的邮箱账号作为Bot</span
          >
        </div>
        <el-divider />
        <el-alert
          v-if="emailAlertTitle"
          style="margin-bottom: 16px"
          :title="emailAlertTitle"
          :type="emailAlertType"
          show-icon
          :closable="false"
        />

        <el-form
          class="email-form-container"
          :model="emailData"
          :rules="rules"
          ref="emailform"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="emailData.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              show-password
              v-model="emailData.password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="createBotByEmail">创建</el-button>
            <el-button @click="clearForm">清空表单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="botInfo.username"
      v-loading="signLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">每日签到</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >每日首次签到可以给 Bot 加经验值</span
          >
        </div>
        <el-divider />

        <el-button type="success" @click="signinBot">签到</el-button>
      </div>
    </el-card>

    <el-dialog
      width="300px"
      v-model="unbindDialogVisible"
      title="解绑"
      align-center
    >
      确定解绑游戏账号吗？当前保存的游戏账号信息将会被彻底清空。
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unbindDialogVisible = false">取消</el-button>
          <el-button :loading="unbindLoading" type="primary" @click="unbindBot"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <button
      class="g-recaptcha"
      data-sitekey="6LdATh8pAAAAAI8oKdlrCK9nt1FG1MTdSuE2ZhI5"
      data-callback="ownerRobotCallback"
      data-expired-callback="ownerRobotExpiredCallback"
      data-error-callback="ownerRobotErrorCallback"
      hidden
    >
      click
    </button>
  </div>
</template>

<script setup lang="ts">
// 导入bot仓库
import useOwnerStore from "@/store/modules/owner";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";

// bot信息部分
// 使用bot仓库
let ownerStore = useOwnerStore();
// bot信息
let botInfo = reactive({
  set: true,
  username: "",
});
// 设置bot信息
interface robotInfo {
  success: boolean;
  message: string;
  set: boolean;
  username: string;
}
let setBotInfo = (info: robotInfo) => {
  botInfo.set = info.set;
  botInfo.username = info.username;
};
// 查询loading
let queryLoading = ref(false);
// 解绑按钮禁止
let banUnbind = ref(false);
// 首次不显示解绑按钮
let showUnbind = ref(false);
// 提示类型
let alertType = ref("warning");
// 提示消息
let alertTitle = ref("查询中");
// 获取bot信息
let getBotStatus = async () => {
  try {
    queryLoading.value = true;
    banUnbind.value = true;
    let result = await ownerStore.getBot();
    // @ts-ignore
    if (result.success) {
      // 获取成功
      // @ts-ignore
      setBotInfo(result);
      // @ts-ignore
      if (result.username) {
        alertType.value = "success";

        alertTitle.value =
          // @ts-ignore
          result.username +
          // @ts-ignore
          ` [Lv.${result.lv} (${result.exp}/${result.total_exp})]`;
      } else {
        alertType.value = "warning";
        // @ts-ignore
        alertTitle.value = result.message;
      }
      if (showUnbind.value == false) {
        // 任意一次获取信息成功都会导致解绑按钮允许显示
        showUnbind.value = true;
      }
      // 清空表单
      clearForm();
      clearPhoneForm();
    } else {
      // 获取失败
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    console.log(error);
  } finally {
    queryLoading.value = false;
    banUnbind.value = false;
  }
};

// 创建bot部分
// 创建loading
let createDefaultLoading = ref(false);

// 邮箱创建
// 表单元素
let emailform = ref(null);
// 表单数据
let emailData = reactive({
  username: "",
  password: "",
});
// 清空表单
let clearForm = () => {
  emailData.username = "";
  emailData.password = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (emailform.value) {
        // @ts-ignore
        emailform.value.clearValidate(["username", "password"]);
      }
    }, 200);
  } catch (error) {
    console.log(error);
  }
};
// @ts-ignore
let validateEmail = (rule: any, value: any, callback: any) => {
  // 邮箱正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    callback(new Error("邮箱格式不正确"));
  } else {
    callback();
  }
};
// 表单校验规则
const rules = {
  username: [
    {
      required: true,
      message: "账号不能为空",
      trigger: "blur",
    },
    { validator: validateEmail, trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
  ],
};
// 邮箱卡片提示
// 提示类型
let emailAlertType = ref("warning");
// 提示消息
let emailAlertTitle = ref("");
// 邮箱登录
let createBotByEmail = async () => {
  // 校验表单
  if (emailform.value) {
    // @ts-ignore
    await emailform.value.validate();
  }
  try {
    // 显示加载
    createDefaultLoading.value = true;
    let emailInfo = {
      username: "",
      password: "",
    };
    emailInfo.username = emailData.username;
    emailInfo.password = emailData.password;
    // 仓库发起邮箱登录请求
    let result = await ownerStore.botCreateByEmail(emailInfo);
    // @ts-ignore
    if (result.success) {
      // 获取成功
      // @ts-ignore
      if (result.need_verify) {
        emailAlertType.value = "warning";
      } else {
        emailAlertType.value = "success";
      }
      // @ts-ignore
      emailAlertTitle.value = result.message;
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    console.log(error);
  } finally {
    createDefaultLoading.value = false;
  }
};

// 手机创建
// 表单元素
let phoneform = ref(null);
// 表单数据
let phoneData = reactive({
  phone: "",
  code: "",
});
// 清空表单
let clearPhoneForm = () => {
  phoneData.phone = "";
  phoneData.code = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (phoneform.value) {
        // @ts-ignore
        phoneform.value.clearValidate(["phone"]);
      }
    }, 200);
  } catch (error) {
    console.log(error);
  }
};
// @ts-ignore
let validatePhone = (rule: any, value: any, callback: any) => {
  // 手机正则表达式
  const phoneRegex = /^1[3456789]\d{9}$/;

  if (!phoneRegex.test(value)) {
    callback(new Error("手机格式不正确"));
  } else {
    callback();
  }
};
// 表单校验规则
const phoneRules = {
  phone: [
    {
      required: true,
      message: "手机号不能为空",
      trigger: "blur",
    },
    { validator: validatePhone, trigger: "blur" },
  ],
};
// 手机卡片提示
// 提示类型
let phoneAlertType = ref("warning");
// 提示消息
let phoneAlertTitle = ref("");
// 获取验证码加载
let codeloadingflag = ref(false);
// 验证码允许点击
let codedisabled = ref(false);
// 验证码倒计时
let codeTimes = ref(60);
// 显示倒计时
let codeTimeShow = ref(false);
// 使用user仓库
let userStore = useUserStore();
// 人机验证成功回调
var ownerRobotCallback = async (args: any) => {
  userStore.robotToken = args;
  if (userStore.robotToken) {
    getCode();
  }
};
// 人机验证过期回调
var ownerRobotExpiredCallback = () => {
  console.log("验证过期");
  userStore.robotToken = "";
};
// 人机验证失败回调
var ownerRobotErrorCallback = () => {
  console.log("验证失败");
  userStore.robotToken = "";
};
// recaptcha验证
let robotCheck = async () => {
  // 校验表单
  if (phoneform.value) {
    // @ts-ignore
    await phoneform.value.validate();
  }

  userStore.robotToken = "";
  // @ts-ignore
  grecaptcha.reset();
  // @ts-ignore
  document.querySelector(".g-recaptcha").click();
};
// 添加人机验证
onMounted(() => {
  // 添加人机验证
  const script = document.createElement("script");
  script.src = "https://recaptcha.net/recaptcha/api.js";
  script.async = true;
  document.head.appendChild(script);

  // @ts-ignore
  window.ownerRobotCallback = ownerRobotCallback;
  // @ts-ignore
  window.ownerRobotExpiredCallback = ownerRobotExpiredCallback;
  // @ts-ignore
  window.ownerRobotErrorCallback = ownerRobotErrorCallback;
});
// 销毁全局变量
onUnmounted(() => {
  // @ts-ignore
  window.ownerRobotCallback = null;
  // @ts-ignore
  window.ownerRobotExpiredCallback = null;
  // @ts-ignore
  window.ownerRobotErrorCallback = null;
});
// 获取验证码
let getCode = async () => {
  try {
    // 显示加载
    codeloadingflag.value = true;
    codedisabled.value = true;
    let codeInfo = {
      mobile: "",
      captcha_token: "",
    };
    codeInfo.mobile = phoneData.phone;
    codeInfo.captcha_token = userStore.robotToken;
    // 仓库发起验证码请求
    let result = await ownerStore.botPhoneCode(codeInfo);
    // @ts-ignore
    if (result.success) {
      // 获取成功
      // @ts-ignore
      if (result.need_verify) {
        phoneAlertType.value = "warning";
        codedisabled.value = false;
      } else {
        phoneAlertType.value = "success";
        // 成功，开始倒计时
        codedisabled.value = true;
        codeTimeShow.value = true;
        const timer = setInterval(() => {
          if (codeTimes.value > 0) {
            codeTimes.value--;
          } else {
            codeTimes.value = 60;
            codedisabled.value = false;
            codeTimeShow.value = false;
            clearInterval(timer);
          }
        }, 1000);
      }
      // @ts-ignore
      phoneAlertTitle.value = result.message;
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      codedisabled.value = false;
    }
  } catch (error: any) {
    console.log(error);
    codedisabled.value = false;
  } finally {
    codeloadingflag.value = false;
  }
};
// 手机登录
let createBotByPhone = async () => {
  // 校验表单
  if (phoneform.value) {
    // @ts-ignore
    await phoneform.value.validate();
  }
  try {
    // 显示加载
    createDefaultLoading.value = true;
    let phoneInfo = {
      mobile: "",
      smscode: "",
    };
    phoneInfo.mobile = phoneData.phone;
    phoneInfo.smscode = phoneData.code;
    // 仓库发起手机登录请求
    let result = await ownerStore.botCreateByPhone(phoneInfo);
    // @ts-ignore
    if (result.success) {
      // 获取成功
      // @ts-ignore
      if (result.need_verify) {
        phoneAlertType.value = "warning";
      } else {
        phoneAlertType.value = "success";
      }
      // @ts-ignore
      phoneAlertTitle.value = result.message;
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    console.log(error);
  } finally {
    createDefaultLoading.value = false;
  }
};

// bot解绑
// 解绑对话框dialog
let unbindDialogVisible = ref(false);
// 解绑确认按钮loading
let unbindLoading = ref(false);
// 显示dialog
let unbindDialog = () => {
  unbindDialogVisible.value = true;
};
let unbindBot = async () => {
  try {
    unbindLoading.value = true;
    let result = await ownerStore.botUnbind();
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    console.log(error);
  } finally {
    unbindLoading.value = false;
    unbindDialogVisible.value = false;
    getBotStatus();
  }
};

// bot签到
let signLoading = ref(false);
let signinBot = async () => {
  try {
    signLoading.value = true;
    let result = await ownerStore.botSignIn();
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    console.log(error);
  } finally {
    signLoading.value = false;
  }
};
</script>

<style scoped>
.card-header,
.card-footer {
  display: flex;
  align-items: center;
}
.el-alert__title,
.el-alert__content,
.el-alert {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
.email-form-container,
.botname-form-container,
.phone-form-container {
  max-width: 600px;
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: #000000 !important;
}
</style>
