<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">我的信息</div>
      </template>

      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >
            游戏ID在第一次成功登录时自动获取，之后您只能登录至此ID的租赁服
            </span
          >
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
          <span style="margin-left: 12px; color: dimgray">使用兑换码更新您的账号</span>
        </div>
        <el-divider />

        <el-form
          @submit.prevent
          class="code-form-container"
          :model="codeData"
          :rules="rules2"
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
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入设置仓库
import useSettingStore from "@/store/modules/setting";
import { computed, onActivated, onMounted, reactive, ref } from "vue";
// 导入时间转换函数
import { getTimeStr2 } from "@/utils";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";

// 使用设置仓库的移动端适配
let settingStore = useSettingStore();

// 用户信息部分
// 使用用户仓库
let userStore = useUserStore();
let getInfo = async () => {
  // 获取用户信息
  await userStore.userInfo();
};
onMounted(() => {
  getInfo();
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
    title: "获取 FBToken",
    message: "获取中",
    duration: 3000,
  });
  try {
    let result = await userStore.userDownload();
    ElNotification({
      type: "success",
      title: "获取 FBToken",
      message: "获取成功",
      duration: 3000,
    });
    // @ts-ignore
    if (result.success === false) {
      ElNotification({
        type: "error",
        title: "获取 FBToken",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    tokenLoading.value = false;
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
  try {
    setTimeout(() => {
      if (passwordform.value) {
        // @ts-ignore
        passwordform.value.clearValidate([
          "oldPassword",
          "newPassword",
          "repassword",
        ]);
      }
    }, 200);
  } catch (error) {
    console.log(error);
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
      message: "请确认新密码",
      trigger: "blur",
    },
    { validator: validateRePassword, trigger: "blur" },
  ],
};
// 修改密码
let changePassword = async () => {
  // 校验表单
  if (passwordform.value) {
    // @ts-ignore
    await passwordform.value.validate();
  }

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
    console.log(error);
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
    console.log(error);
  }
};
// 每次进入子页面就清空表单
onActivated(() => {
  clearCodeForm();
});
// @ts-ignore
let validateReCode = (rule: any, value: any, callback: any) => {
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
const rules2 = {
  redeem_code: [
    {
      required: true,
      message: "兑换码不能为空",
      trigger: "blur",
    },
    { validator: validateReCode, trigger: "blur" },
  ],
};
// 使用兑换码
let codeUse = async () => {
  // 校验表单
  if (codeform.value) {
    // @ts-ignore
    await codeform.value.validate();
  }
  try {
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
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 刷新信息
      getInfo();
      // 清空表单
      clearCodeForm();
    } else {
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    codeLoading.value = false;
  }
};
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
.code-form-container {
  max-width: 600px;
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: #000000 !important;
}
</style>
