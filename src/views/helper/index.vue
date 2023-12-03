<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span style="margin-right: 16px">Bot 信息</span>
          <el-button
            @click="getBotStatus"
            type="primary"
            round
            :loading="queryLoading"
            >查询状态</el-button
          >
          <el-button
            v-if="botInfo.realname_url"
            @click="realNameLink"
            type="success"
            round
            >实名认证</el-button
          >
        </div>
      </template>

      <el-alert
        :title="alertTitle"
        :type="alertType"
        show-icon
        :closable="false"
      />
    </el-card>

    <el-card
      v-if="botInfo.set == false"
      v-loading="createDefaultLoading"
      style="margin-top: 12px"
      shadow="hover"
    >
      <template #header>
        <div class="card-header">Bot 创建--游客登录</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >以游客登录的形式创建机器人</span
          >
        </div>
        <el-divider />
        <el-alert
          v-if="createAlertTitle"
          style="margin-bottom: 12px"
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
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useHelperStore from "@/store/modules/helper";
// 导入设置仓库
import useSettingStore from "@/store/modules/setting";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
import { onMounted, reactive, ref } from "vue";

// 使用设置仓库的移动端适配
let settingStore = useSettingStore();

// bot信息部分
// 使用bot仓库
let helperStore = useHelperStore();
// bot信息
let botInfo = reactive({
  set: false,
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
// 提示类型
let alertType = ref("warning");
// 提示消息
let alertTitle = ref("");
// 实名链接函数
let realNameLink = () => {
  window.open(botInfo.realname_url, "_blank");
};
// 获取bot信息
let getBotStatus = async () => {
  try {
    queryLoading.value = true;
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
        alertTitle.value = "Bot " + result.username + " 状态正常";
      } else {
        alertType.value = "error";
        // @ts-ignore
        alertTitle.value = result.message;
      }
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
        createAlertType.value = "error";
      } else {
        createAlertType.value = "success";
      }
      // @ts-ignore
      createAlertTitle.value = result.message;
      getBotStatus();
    } else {
      // 获取失败
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 额外获取一次状态
      getBotStatus();
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
</style>
