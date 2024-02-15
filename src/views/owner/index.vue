<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span style="margin-right: 16px">游戏账号</span>
        </div>
      </template>

      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >游戏账号是调用部分功能所使用的账号 (不包括进服), 且只能与绑定的游戏ID一致</span
          >
        </div>
        <el-divider />
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
      v-show="!botInfo.set"
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
            >绑定您的手机账号 (*人机验证)</span
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
            <el-button type="primary" native-type="submit" @click="createBotByPhone">绑定</el-button>
            <el-popover
              :width="326"
              :visible="!botInfo.set && robotVisible"
              placement="right-end"
            >
              <template #reference>
                <el-button
                  v-if="!codeTimeShow"
                  type="primary"
                  @click="getCode"
                  :loading="codeloadingflag || captchaExecutingFlag"
                  :disabled="codedisabled"
                  >获取验证码</el-button
                >
              </template>
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
            >绑定您的邮箱账号</span
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
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" native-type="submit" @click="createBotByEmail">创建</el-button>
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
            >可以获得游戏内道具以及经验值奖励</span
          >
        </div>
        <el-divider />

        <el-button type="success" round @click="signinBot">签到</el-button>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="botInfo.username"
      v-loading="autoRestartLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">自动重启</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >在请求进服时, 如果短时间遇到多次错误则尝试向服务器发送重启指令</span
          >
        </div>
        <el-divider />
        <el-switch
          v-model="userStore.autoRestartFlag"
          :loading="autoRestartLoading"
          :before-change="beforeAutoRestartChange"
        />
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="botInfo.username"
      v-loading="getMailRewardLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">邮件领取</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >将所有邮件状态变为已读, 且领取邮件奖励</span
          >
        </div>
        <el-divider />

        <el-button type="success" round @click="getMailReward">领取</el-button>
      </div>
    </el-card>

    <el-card 
      v-loading="giftCodeLoading || queryLoading"
      style="margin-top: 12px"
      shadow="hover"
      v-if="botInfo.username"
    >
      <template #header>
        <div class="card-header">礼包兑换码</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用游戏内礼包兑换码</span
          >
        </div>
        <el-divider />
        <el-alert
          v-if="giftCodeAlertTitle"
          style="margin-bottom: 16px"
          :title="giftCodeAlertTitle"
          :type="giftCodeAlertType"
          show-icon
          :closable="false"
        />

        <el-form
          @submit.prevent
          class="limited-form-container"
          :model="giftCodeData"
          :rules="giftCodeRules"
          ref="giftCodeform"
        >
          <el-form-item label="礼包兑换码" prop="code">
            <el-input
              v-model="giftCodeData.code"
              placeholder="请输入礼包兑换码"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" native-type="submit" @click="useGiftCode">兑换</el-button>
          </el-form-item>
        </el-form>
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
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入bot仓库
import useOwnerStore from "@/store/modules/owner";
// 导入消息通知组件
import { ElNotification } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";
// 人机验证显示
const robotVisible = ref(false)
// 导出本地仓库给HTML使用
let exportedLocalStorage = localStorage
// 使用用户仓库
let userStore = useUserStore();
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
let alertTitle = ref("点击刷新来查询");
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
    //console.log(error);
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
// @ts-ignore
let validateGiftCode = (rule: any, value: any, callback: any) => {
  // uuid正则
  const codeReg =
    /^[0-9a-z]{10}$/;

  if (!codeReg.test(value)) {
    callback(new Error("礼包兑换码格式不正确"));
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
const giftCodeRules = {
  code: [
    { required: true, validator: validateGiftCode, trigger: "blur" },
  ],
};
// 邮箱卡片提示
// 提示类型
let emailAlertType = ref("warning");
// 提示消息
let emailAlertTitle = ref("");
// 邮箱登录
let createBotByEmail = async () => {
  try {
    // @ts-ignore
    await emailform.value.validate();
    // 显示加载
    createDefaultLoading.value = true;
    let emailInfo = {
      username: "",
      password: "",
      password_level: -1,
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
        getBotStatus();
      }
      // @ts-ignore
      emailAlertTitle.value = result.message;
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
    //console.log(error);
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
// 人机验证
let captchaExecutingFlag = ref(true);
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
// 添加人机验证
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
});
// 销毁全局变量
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
// 获取验证码
let getCode = async () => {
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
  // 校验表单
  try {
    // @ts-ignore
    await phoneform.value.validate();
  }catch (error: any) {
    return;
  }
  // 显示加载
  codeloadingflag.value = true;
  codedisabled.value = true;
  let codeInfo = {
    mobile: phoneData.phone,
    captcha_token: captchaToken,
  };
  try {
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
          codeTimes.value--;
          if (codeTimes.value < 1){
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
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      codedisabled.value = false;
    }
  } catch (error: any) {
    //console.log(error);
    codedisabled.value = false;
  } finally {
    refreshCaptcha()
    codeloadingflag.value = false;
  }
};
// 手机登录
let createBotByPhone = async () => {
  try {
    // @ts-ignore
    await phoneform.value.validate();
    // 显示加载
    createDefaultLoading.value = true;
    let phoneInfo = {
      mobile: phoneData.phone,
      smscode: phoneData.code,
    };
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
        getBotStatus();
      }
      // @ts-ignore
      phoneAlertTitle.value = result.message;
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
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
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
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
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
    signLoading.value = false;
  }
};

// 自动重启
let autoRestartLoading = ref(false);
let beforeAutoRestartChange = async () => {
  try {
    autoRestartLoading.value = true;
    let result = await userStore.userAutoRestart({
      enable: !userStore.autoRestartFlag,
    });
    // @ts-ignore
    if (result.success) {
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
  } catch (error: any) {
    //console.log(error);
  } finally {
    autoRestartLoading.value = false;
  }
};

// 领取邮件奖励
let getMailRewardLoading = ref(false);
let getMailReward = async () => {
  try {
    getMailRewardLoading.value = true;
    let result = await ownerStore.botGetMailReward();
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
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
    getMailRewardLoading.value = false;
  }
};

// 礼包码
let giftCodeAlertType = ref("success");
// 提示消息
let giftCodeAlertTitle = ref("");
// 礼包码卡片loading
let giftCodeLoading = ref(false);
// 表单元素
let giftCodeform = ref(null);
// 表单数据
let giftCodeData = reactive({
  code: "",
});
// 清空表单
let clearGiftCodeForm = () => {
  giftCodeData.code = "";
  try {
    setTimeout(() => {
      if (giftCodeform.value) {
        // @ts-ignore
        codeform.value.clearValidate(["code"]);
      }
    }, 200);
  } catch (error) {}
};
// 使用兑换码
let useGiftCode = async () => {
  try {
    // @ts-ignore
    await giftCodeform.value.validate();
    // 显示加载
    giftCodeLoading.value = true;
    // 仓库发起请求
    let result = await ownerStore.botUseGiftCode({
      code: giftCodeData.code,
    });
    // @ts-ignore
    if (result.success) {
      giftCodeAlertType.value = "success";
      // 清空表单
      clearGiftCodeForm();
    } else {
      giftCodeAlertType.value = "warning";
    }
    // @ts-ignore
    giftCodeAlertTitle.value = result.message;
  } catch (error) {
    //console.log(error);
  } finally {
    giftCodeLoading.value = false;
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
.limited-form-container {
  max-width: 600px;
}
</style>
