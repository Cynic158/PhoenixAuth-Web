<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span style="margin-right: 16px">Bot 信息</span>
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
            v-if="botInfo.realname_url"
            @click="realNameLink"
            type="warning"
            round
            >实名</el-button
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
      v-if="botInfo.set == false"
      v-loading="createDefaultLoading || queryLoading"
      style="margin-top: 12px"
      shadow="hover"
    >
      <template #header>
        <div class="card-header">游客登录</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >新建一个游客账号作为Bot</span
          >
        </div>
        <el-divider />
        <el-alert
          v-if="createAlertTitle"
          style="margin-bottom: 16px"
          :title="createAlertTitle"
          :type="createAlertType"
          show-icon
          :closable="false"
        />
        <el-button type="primary" round @click="createBotByDefault"
          >创建</el-button
        >
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
          <el-form-item>
            <el-button type="primary" @click="createBotByEmail">创建</el-button>
            <el-button @click="clearForm">清空表单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="botInfo.username"
      v-loading="queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">更改游戏昵称</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >更改机器人的游戏昵称</span
          >
        </div>
        <el-divider />

        <el-form
          class="botname-form-container"
          :model="botnameData"
          :rules="rules2"
          ref="botnameform"
        >
          <el-form-item label="新昵称" prop="username">
            <el-input
              v-model="botnameData.username"
              placeholder="请输入新昵称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changeDialog">更改</el-button>
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
      确定解绑Bot吗？当前保存的游戏账号信息将会被彻底清空。
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unbindDialogVisible = false">取消</el-button>
          <el-button :loading="unbindLoading" type="primary" @click="unbindBot"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog
      width="300px"
      v-model="changeDialogVisible"
      title="更改游戏昵称"
      align-center
    >
      确定更改Bot游戏昵称吗？更改成功后会进入30天冷却期。
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changeDialogVisible = false">取消</el-button>
          <el-button
            :loading="changeLoading"
            type="primary"
            @click="changeBotName"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useHelperStore from "@/store/modules/helper";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
import { onMounted, reactive, ref } from "vue";

// bot信息部分
// 使用bot仓库
let helperStore = useHelperStore();
// bot信息
let botInfo = reactive({
  set: true,
  realname_url: "",
  username: "",
});
// 设置bot信息
interface robotInfo {
  success: boolean;
  message: string;
  set: boolean;
  realname_url: string;
  username: string;
}
let setBotInfo = (info: robotInfo) => {
  botInfo.set = info.set;
  botInfo.realname_url = info.realname_url;
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
// 实名链接函数
let realNameLink = () => {
  window.open(botInfo.realname_url, "_blank");
};
// 获取bot信息
let getBotStatus = async () => {
  try {
    queryLoading.value = true;
    banUnbind.value = true;
    let result = await helperStore.getBot();
    // @ts-ignore
    if (result.success) {
      // 获取成功
      // @ts-ignore
      setBotInfo(result);
      // @ts-ignore
      if (result.username) {
        alertType.value = "success";
        // @ts-ignore
        alertTitle.value = result.username;
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
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      message: error.message,
      duration: 3000,
    });
  } finally {
    queryLoading.value = false;
    banUnbind.value = false;
  }
};
// 初次进入就查询一次
onMounted(() => {
  getBotStatus();
});

// 创建bot部分
// 游客创建
// 游客创建loading
let createDefaultLoading = ref(false);
// 游客卡片提示
// 提示类型
let createAlertType = ref("success");
// 提示消息
let createAlertTitle = ref("");
let createBotByDefault = async () => {
  try {
    createDefaultLoading.value = true;
    let result = await helperStore.botCreate();
    // @ts-ignore
    if (result.success) {
      // 获取成功
      // @ts-ignore
      if (result.need_verify) {
        createAlertType.value = "warning";
      } else {
        createAlertType.value = "success";
      }
      // @ts-ignore
      createAlertTitle.value = result.message;
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
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      message: error.message,
      duration: 3000,
    });
  } finally {
    createDefaultLoading.value = false;
    getBotStatus();
  }
};

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
    let result = await helperStore.botCreateByEmail(emailInfo);
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
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      message: error.message,
      duration: 3000,
    });
  } finally {
    createDefaultLoading.value = false;
    getBotStatus();
  }
};

// bot解绑
// 解绑对话框dialog
let unbindDialogVisible = ref(false);
// 解绑确认按钮loading
let unbindLoading = ref(false);
// 显示dialog
let unbindDialog = async () => {
  unbindDialogVisible.value = true;
};
let unbindBot = async () => {
  try {
    unbindLoading.value = true;
    let result = await helperStore.botUnbind();
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
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      message: error.message,
      duration: 3000,
    });
  } finally {
    unbindLoading.value = false;
    unbindDialogVisible.value = false;
    getBotStatus();
  }
};

// 更改游戏昵称
// 更改对话框dialog
let changeDialogVisible = ref(false);
// 更改确认按钮loading
let changeLoading = ref(false);
// 显示dialog
let changeDialog = async () => {
  changeDialogVisible.value = true;
};
// 表单元素
let botnameform = ref(null);
// 表单数据
let botnameData = reactive({
  username: "",
});
// 清空表单
let clearChangeForm = () => {
  botnameData.username = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (botnameform.value) {
        // @ts-ignore
        botnameform.value.clearValidate(["username"]);
      }
    }, 200);
  } catch (error) {
    console.log(error);
  }
};
// 表单校验规则
const rules2 = {
  username: [
    {
      required: true,
      message: "新昵称不能为空",
      trigger: "blur",
    },
  ],
};
let changeBotName = async () => {
  // 校验表单
  if (botnameform.value) {
    // @ts-ignore
    await botnameform.value.validate();
  }
  try {
    changeLoading.value = true;
    let botname = {
      username: "",
    };
    botname.username = botnameData.username;
    let result = await helperStore.botChangeName(botname);
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      clearChangeForm();
    } else {
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      message: error.message,
      duration: 3000,
    });
  } finally {
    changeLoading.value = false;
    changeDialogVisible.value = false;
    getBotStatus();
  }
};
</script>

<style scoped>
.card-header,
.card-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.el-alert__title,
.el-alert__content,
.el-alert {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
.email-form-container,
.botname-form-container {
  max-width: 600px;
}
</style>
