<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">我的信息</div>
      </template>

      <el-descriptions
        class="margin-top"
        :direction="infoDirection"
        :column="infoCol"
        size="default"
        border
      >
        <el-descriptions-item :span="2">
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
                <Tools />
              </el-icon>
              系统管理权限
            </div>
          </template>
          {{ userStore.adminFlag }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="userinfo-cell-item">
              <el-icon class="userinfo-cell-item-icon">
                <Platform />
              </el-icon>
              开发者权限
            </div>
          </template>
          {{ userStore.devFlag }}
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
      </el-descriptions>
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
          <span style="margin-left: 12px; color:dimgray;">PhoenixBuilder 用于登录您账户的凭证</span>
        </div>
        <el-divider />
        <el-button type="primary" round @click="tokenDownload">获取</el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">修改密码</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray;">更新您的登录密码</span>
        </div>
        <el-divider />

        <el-form
          class="password-form-container"
          :model="passwordData"
          :rules="rules"
          ref="passwordform"
        >
          <el-form-item label="输入旧密码" prop="oldPassword">
            <el-input
              type="password"
              show-password
              v-model="passwordData.oldPassword"
              placeholder="请输入旧密码"
            />
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
          <el-form-item>
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
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useUserStore from "@/store/modules/user";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
// 导入时间转换函数
import { getTimeStr2 } from "@/utils";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";

// 用户信息部分
// 使用用户仓库
let userStore = useUserStore();
// 用户信息列数
let infoCol = ref(1);
// 用户信息排列方式vertical
let infoDirection = ref("horizontal");
// 适配移动端
const handleResize = () => {
  // 获取当前窗口宽度
  const screenWidth = window.innerWidth;

  // 根据窗口宽度进行判断
  if (screenWidth <= 768) {
    infoCol.value = 1;
    infoDirection.value = "vertical";
  } else {
    infoCol.value = 2;
    infoDirection.value = "horizontal";
  }
};
onMounted(() => {
  handleResize(); // 初始加载时进行一次判断
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
// 用户的创建时间以及过期时间
const createTime = computed(() => {
  let timestr = getTimeStr2(userStore.ucreate);
  return timestr;
});
const expireTime = computed(() => {
  let timestr = getTimeStr2(userStore.uexpire);
  return timestr;
});

// token部分
// token获取loading
let tokenLoading = ref(false);
// 请求phoenixtoken
let tokenDownload = async () => {
  tokenLoading.value = true;
  ElNotification({
    type: "info",
    title: "获取 Phoenix Token",
    message: "获取中",
    duration: 3000,
  });
  try {
    await userStore.userDownload();
  } catch (error) {
    console.log(error);
  } finally {
    tokenLoading.value = false;
    ElNotification({
      type: "success",
      title: "获取 Phoenix Token",
      message: "获取成功",
      duration: 3000,
    });
  }
};

// 修改密码部分
// 表单元素
let passwordform = ref(null);
// 表单数据
let passwordData = reactive({
  oldPassword: "",
  newPassword: "",
  repassword: "",
});
// 清空表单
let clearForm = () => {
  passwordData.oldPassword = "";
  passwordData.newPassword = "";
  passwordData.repassword = "";
  // 清空校验提示
  // @ts-ignore
  passwordform.value.clearValidate([
    "oldPassword",
    "newPassword",
    "repassword",
  ]);
};
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
// 表单校验规则
const rules = {
  oldPassword: [
    {
      required: true,
      message: "请输入旧密码",
      trigger: "blur",
    },
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
      message: "请输入确认密码",
      trigger: "blur",
    },
    { validator: validateRePassword, trigger: "blur" },
  ],
};
// 修改密码
let changePassword = async () => {
  // 校验表单
  // @ts-ignore
  await passwordform.value.validate();
  try {
    // 显示加载
    passwordloadingflag.value = true;
    let passwordInfo = {
      original_password: "",
      new_password: "",
    };
    passwordInfo.original_password = passwordData.oldPassword;
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
        message: "修改成功",
        duration: 3000,
      });
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
    // 请求完成，关闭加载
    passwordloadingflag.value = false;
  }
};
</script>

<style scoped lang="scss">
.card-header,
.card-footer {
  display: flex;
  align-items: center;
}
.userinfo-container {
  .userinfo-cell-item {
    display: flex;
    align-items: center;
    .userinfo-cell-item-icon {
      margin-right: 8px;
    }
  }
}
.password-form-container {
  max-width: 600px;
}
</style>
