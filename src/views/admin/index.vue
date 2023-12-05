<template>
  <div>
    <el-card shadow="hover" v-loading="adminCreateLoading">
      <template #header>
        <div class="card-header">新建用户</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用管理权限新建用户</span
          >
        </div>
        <el-divider />

        <el-form
          class="admin-create-form-container"
          :model="createData"
          :rules="rules"
          ref="createform"
        >
          <el-form-item prop="username">
            <el-input
              prefix-icon="User"
              v-model="createData.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="Lock"
              type="password"
              show-password
              v-model="createData.password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              prefix-icon="Lock"
              type="password"
              show-password
              v-model="createData.repassword"
              placeholder="请确认密码"
            />
          </el-form-item>
          <el-form-item prop="permission">
            <el-select
              v-model="createData.permission"
              class="m-2"
              placeholder="游客"
            >
              <el-option label="封禁" value="0" />
              <el-option label="游客" value="1" />
              <el-option label="普通" value="2" />
              <el-option label="开发者" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="createUser">新建</el-button>
            <el-button @click="clearCreateForm">清空表单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="adminOptionLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">用户操作</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >查询、封禁或激活用户，激活会将用户提升为普通权限</span
          >
        </div>
        <el-divider />

        <el-form
          @submit.prevent
          class="admin-option-form-container"
          :model="optionData"
          :rules="rules2"
          ref="optionform"
        >
          <el-form-item style="max-width: 400px" label="用户名" prop="username">
            <el-input
              v-model="optionData.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item>
            <el-descriptions
              style="width: 100%"
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
                {{ queryUserInfo.username }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="userinfo-cell-item">
                    <el-icon class="userinfo-cell-item-icon">
                      <Coordinate />
                    </el-icon>
                    游戏 ID
                  </div>
                </template>
                {{ queryUserInfo.game_id }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="userinfo-cell-item">
                    <el-icon class="userinfo-cell-item-icon">
                      <Tools />
                    </el-icon>
                    权限
                  </div>
                </template>
                {{ queryUserInfo.permission }}
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
                {{ queryUserInfo.expire_at }}
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
                {{ queryUserInfo.create_at }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="userinfo-cell-item">
                    <el-icon class="userinfo-cell-item-icon">
                      <Refresh />
                    </el-icon>
                    更新时间
                  </div>
                </template>
                {{ queryUserInfo.update_at }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="queryUser">查询</el-button>
            <el-button
              type="success"
              @click="activateUser"
              v-if="['封禁(0)', '游客(1)'].includes(queryUserInfo.permission)"
              >激活
            </el-button>
            <el-button
              type="danger"
              @click="banUserDialog"
              v-if="
                ['游客(1)', '普通(2)', '开发者(3)'].includes(
                  queryUserInfo.permission
                )
              "
              >封禁
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="adminRenewLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">用户续期</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >延长用户的有效期，以小时为单位</span
          >
        </div>
        <el-divider />

        <el-form
          class="admin-renew-form-container"
          :model="renewData"
          :rules="rules3"
          ref="renewform"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="renewData.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="续期时长" prop="renew_time">
            <el-input
              v-model="renewData.renew_time"
              type="number"
              placeholder="请输入时长(小时)"
              min="1"
              max="86400"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <span style="margin-right: 12px">{{ renewStr }}</span>
            <el-button type="primary" @click="renewUser">续期</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-dialog
      width="300px"
      v-model="banUserDialogVisible"
      title="封禁"
      align-center
    >
      确定封禁 {{ optionData.username }} 吗？
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="banUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="banUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入管理仓库
import useAdminStore from "@/store/modules/admin";
// 导入消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
import { reactive, ref, computed } from "vue";
// 导入时间转换函数
import { getTimeStr2, getTimeStr3 } from "@/utils";
// 导入设置仓库
import useSettingStore from "@/store/modules/setting";

// 使用设置仓库的移动端适配
let settingStore = useSettingStore();

// 新建用户部分
// 使用管理仓库
let adminStore = useAdminStore();
// 表单元素
let createform = ref(null);
// 新建信息表单
let createData = reactive({
  username: "",
  password: "",
  repassword: "",
  permission: "1",
});
// 清空表单
let clearCreateForm = () => {
  createData.username = "";
  createData.password = "";
  createData.repassword = "";
  createData.permission = "1";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (createform.value) {
        // @ts-ignore
        createform.value.clearValidate([
          "username",
          "password",
          "repassword",
          "permission",
        ]);
      }
    }, 200);
  } catch (error) {
    console.log(error);
  }
};
// @ts-ignore
let validateUserName = (rule: any, value: any, callback: any) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(value)) {
    callback(new Error("用户名只能是大小英文以及数字"));
  } else {
    callback();
  }
};
// @ts-ignore
let validateRePassword = (rule: any, value: any, callback: any) => {
  if (value !== createData.password) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};
// 表单校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
  repassword: [
    {
      required: true,
      message: "请确认密码",
      trigger: "blur",
    },
    { validator: validateRePassword, trigger: "blur" },
  ],
  permission: [
    {
      required: true,
      message: "请选择权限",
      trigger: "blur",
    },
  ],
};
// 创建卡片loading
let adminCreateLoading = ref(false);
// 创建用户
let createUser = async () => {
  // 校验表单
  if (createform.value) {
    // @ts-ignore
    await createform.value.validate();
  }

  try {
    // 显示加载
    adminCreateLoading.value = true;
    let createInfo = {
      username: "",
      password: "",
      permission: 1,
    };
    createInfo.username = createData.username;
    createInfo.password = createData.password;
    createInfo.permission = Number(createData.permission);
    // 仓库发起请求
    let result = await adminStore.userCreate(createInfo);
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      clearCreateForm();
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
    adminCreateLoading.value = false;
  }
};

// 用户操作
// 用户操作loading
let adminOptionLoading = ref(false);
// 表单元素
let optionform = ref(null);
// 表单数据
let optionData = reactive({
  username: "",
});
// 表单校验规则
const rules2 = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
};
// 查询用户信息
// 用户信息
let queryUserInfo = reactive({
  username: "暂无信息",
  permission: "暂无信息",
  expire_at: "暂无信息",
  game_id: "暂无信息",
  create_at: "暂无信息",
  update_at: "暂无信息",
});
interface userInfo {
  username: string;
  permission: number;
  expire_at: number;
  game_id: number;
  create_at: number;
  update_at: number;
}
// 设置用户信息
let setUserInfo = (userInfo: userInfo) => {
  queryUserInfo.username = userInfo.username;
  if (userInfo.permission == 0) {
    queryUserInfo.permission = "封禁";
  } else if (userInfo.permission == 1) {
    queryUserInfo.permission = "游客";
  } else if (userInfo.permission == 2) {
    queryUserInfo.permission = "普通";
  } else if (userInfo.permission == 3) {
    queryUserInfo.permission = "开发者";
  } else if (userInfo.permission == 4) {
    queryUserInfo.permission = "管理员";
  } else {
    queryUserInfo.permission = "未知";
  }
  queryUserInfo.permission += `(${userInfo.permission})`;
  let expireTime = getTimeStr2(userInfo.expire_at.toString());
  let createTime = getTimeStr2(userInfo.create_at.toString());
  let updateTime = getTimeStr2(userInfo.update_at.toString());
  queryUserInfo.expire_at = expireTime;
  queryUserInfo.create_at = createTime;
  queryUserInfo.update_at = updateTime;
  if (userInfo.game_id == 0) {
    queryUserInfo.game_id = "暂未获取";
  } else {
    queryUserInfo.game_id = userInfo.game_id.toString();
  }
};
// 清空用户信息
let clearUserInfo = () => {
  queryUserInfo.username = "暂无信息";
  queryUserInfo.game_id = "暂无信息";
  queryUserInfo.permission = "暂无信息";
  queryUserInfo.expire_at = "暂无信息";
  queryUserInfo.create_at = "暂无信息";
  queryUserInfo.update_at = "暂无信息";
};
// 查询用户信息
let queryUser = async () => {
  // 校验表单
  if (optionform.value) {
    // @ts-ignore
    await optionform.value.validate();
  }

  try {
    // 显示加载
    adminOptionLoading.value = true;
    let optionInfo = {
      username: "",
    };
    optionInfo.username = optionData.username;
    // 仓库发起请求
    let result = await adminStore.userQuery(optionInfo);
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // @ts-ignore
      setUserInfo(result.user);
    } else {
      ElNotification({
        type: "error",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      clearUserInfo();
    }
  } catch (error: any) {
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      message: error.message,
      duration: 3000,
    });
  } finally {
    adminOptionLoading.value = false;
  }
};
// 激活用户
let activateUser = async () => {
  // 校验表单
  if (optionform.value) {
    // @ts-ignore
    await optionform.value.validate();
  }

  try {
    // 显示加载
    adminOptionLoading.value = true;
    let optionInfo = {
      username: "",
    };
    optionInfo.username = optionData.username;
    // 仓库发起请求
    let result = await adminStore.userActivate(optionInfo);
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      queryUser();
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
    adminOptionLoading.value = false;
  }
};
// 封禁用户
// 封禁dialog
let banUserDialogVisible = ref(false);
// 显示dialog
let banUserDialog = async () => {
  // 校验表单
  if (optionform.value) {
    // @ts-ignore
    await optionform.value.validate();
  }
  banUserDialogVisible.value = true;
};
// 封禁用户
let banUser = async () => {
  // 关掉对话框
  banUserDialogVisible.value = false;

  try {
    // 显示加载
    adminOptionLoading.value = true;
    let optionInfo = {
      username: "",
    };
    optionInfo.username = optionData.username;
    // 仓库发起请求
    let result = await adminStore.userBan(optionInfo);
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      queryUser();
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
    adminOptionLoading.value = false;
  }
};

// 用户续费
// 表单元素
let renewform = ref(null);
// 表单数据
let renewData = reactive({
  username: "",
  renew_time: "",
});
// 时长显示
let renewStr = computed(() => {
  return getTimeStr3(renewData.renew_time);
});
// 清空表单
let clearRenewForm = () => {
  renewData.renew_time = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (renewform.value) {
        // @ts-ignore
        renewform.value.clearValidate(["renew_time"]);
      }
    }, 200);
  } catch (error) {
    console.log(error);
  }
};
// @ts-ignore
let validateRenew = (rule: any, value: any, callback: any) => {
  const intValue = parseInt(value, 10);
  if (isNaN(intValue) || intValue <= 0 || intValue !== parseFloat(value)) {
    callback(new Error("请输入正整数"));
  } else if (intValue > 86400) {
    callback(new Error("超出最大续期时长"));
  } else {
    callback();
  }
};
const rules3 = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  renew_time: [
    { required: true, message: "请输入续期时长", trigger: "blur" },
    { validator: validateRenew, trigger: "blur" },
  ],
};
// 续期卡片loading
let adminRenewLoading = ref(false);
// 用户续期
let renewUser = async () => {
  // 校验表单
  if (renewform.value) {
    // @ts-ignore
    await renewform.value.validate();
  }

  try {
    // 显示加载
    adminRenewLoading.value = true;
    let renewInfo = {
      username: "",
      renew_time: 0,
    };
    renewInfo.username = renewData.username;
    renewInfo.renew_time = Number(renewData.renew_time) * 3600;
    // 仓库发起请求
    let result = await adminStore.userRenew(renewInfo);
    // @ts-ignore
    if (result.success) {
      ElNotification({
        type: "success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      clearRenewForm();
      // 查询该用户
      optionData.username = renewInfo.username;
      queryUser();
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
    adminRenewLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.card-header,
.card-footer {
  display: flex;
  align-items: center;
}
.admin-create-form-container,
.admin-renew-form-container {
  max-width: 600px;
}
.userinfo-cell-item {
  display: flex;
  align-items: center;
  .userinfo-cell-item-icon {
    margin-right: 8px;
  }
}
</style>
