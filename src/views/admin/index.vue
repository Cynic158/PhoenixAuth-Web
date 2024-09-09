<template>
  <div>
    <el-card
      shadow="hover"
      v-loading="generateRedeemCodeLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">生成兑换码</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用管理权限生成兑换码</span
          >
        </div>
        <el-divider border-style="dashed"/>

        <el-form
          @submit.prevent
          class="form-container"
          :model="generateRedeemCodeData"
          :rules="generateRedeemCodeFormRule"
          ref="codeform"
        >
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="generateRedeemCodeData.type"
              class="m-2"
              placeholder="一个月账户有效期(1)"
            >
              <el-option label="一个月账户有效期(1)" value="1" />
              <el-option label="三个月账户有效期(2)" value="2" />
              <el-option label="一个月 slot 有效期(3)" value="3" />
              <el-option label="三个月 slot 有效期(4)" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="count">
            <el-input
              type="number"
              v-model="generateRedeemCodeData.count"
              placeholder="请输入生成数量"
            />
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input
              v-model="generateRedeemCodeData.note"
              placeholder="请输入备注"
            />
          </el-form-item>

          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" native-type="submit" @click="generateCode"
              >生成</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="unlimitedServerLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">无限制服务器</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >所有有效用户可无限制地登录到这些服务器</span
          >
        </div>
        <el-divider border-style="dashed"/>
        <el-table
          :data="unlimitedServerList"
          class="form-container"
          max-height="250"
        >
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="server_code" label="服务器号" width="120" />
          <el-table-column prop="create_at" label="创建时间" min-width="200" >
            <template  #default="scope">
              {{ getTimeStr2(scope.row.create_at) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="60">
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click.prevent="deleteUnlimitedServer(scope?.row?.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          style="width: 100%; margin-top: 10px"
          class="form-container"
          @click.prevent="popAddUnlimitedServerDialog"
        >
          添加
        </el-button>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="queryUserLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">用户查询</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >通过用户名查询用户详细信息</span
          >
        </div>
        <el-divider border-style="dashed"/>

        <el-form
          @submit.prevent
          :model="queryUserData"
          :rules="queryUserFormRule"
          ref="queryUserForm"
        >
          <el-form-item style="max-width: 400px" label="用户名" prop="username">
            <el-input
              v-model="queryUserData.username"
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
                    用户权限
                  </div>
                </template>
                {{ queryUserInfo.permission }}
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
                      <Promotion />
                    </el-icon>
                    无限制至
                  </div>
                </template>
                {{ queryUserInfo.unlimited_until }}
              </el-descriptions-item>
              <el-descriptions-item v-if="queryUserInfo.ban_until">
                <template #label>
                  <div class="userinfo-cell-item">
                    <el-icon class="userinfo-cell-item-icon">
                      <CircleCloseFilled />
                    </el-icon>
                    封禁时间
                  </div>
                </template>
                {{ queryUserInfo.ban_until }}
              </el-descriptions-item>
              <el-descriptions-item v-if="queryUserInfo.ban_reason">
                <template #label>
                  <div class="userinfo-cell-item">
                    <el-icon class="userinfo-cell-item-icon">
                      <CircleCloseFilled />
                    </el-icon>
                    封禁原因
                  </div>
                </template>
                {{ queryUserInfo.ban_reason }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" native-type="submit" @click="queryUser"
              >查询</el-button
            >
            <el-button
              type="danger"
              @click="unBanUserDialog"
              v-if="queryUserInfo.ban_until"
              >解封
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card shadow="hover" v-loading="banLoading" style="margin-top: 12px">
      <template #header>
        <div class="card-header">用户封禁</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >禁止用户进行登录, 封禁用户可在用户查询卡片解封</span
          >
        </div>
        <el-divider border-style="dashed"/>
        <el-form
          @submit.prevent
          class="form-container"
          :model="banData"
          :rules="banFormRule"
          ref="banform"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="banData.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="封禁时长" prop="hours">
            <el-input
              v-model="banData.hours"
              type="number"
              placeholder="请输入时长(小时)"
              min="1"
              max="86400"
            />
            <span>{{ banTimeStr }}</span>
          </el-form-item>
          <el-form-item label="封禁原因" prop="reason">
            <el-input v-model="banData.reason" placeholder="请输入封禁原因" />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="danger" native-type="submit" @click="banUser"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="setUserPermissionLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">设置用户权限</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >通过用户名设置用户权限</span
          >
        </div>
        <el-divider border-style="dashed"/>

        <el-form
          @submit.prevent
          class="form-container"
          :model="setUserPermissionData"
          :rules="setUserPermissionRule"
          ref="setUserPermissionForm"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="setUserPermissionData.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="用户权限" prop="permission">
            <el-select
              v-model="setUserPermissionData.permission"
              class="m-2"
              placeholder="游客(0)"
            >
              <el-option label="游客(0)" value="0" />
              <el-option label="激活用户(1)" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button
              type="danger"
              native-type="submit"
              @click="setUserPermission"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="extendUserExipreLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">设置用户有效期</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >延长或缩短用户的有效期</span
          >
        </div>
        <el-divider border-style="dashed"/>

        <el-form
          @submit.prevent
          class="form-container"
          :model="extendUserExipreData"
          :rules="extendRule"
          ref="extendUserExipreForm"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="extendUserExipreData.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="设置时长" prop="hours">
            <el-input
              v-model="extendUserExipreData.hours"
              type="number"
              placeholder="请输入时长(小时)"
              min="-86400"
              max="86400"
            />
            <span>{{ extendUserExipreTimeStr }}</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button
              type="danger"
              native-type="submit"
              @click="extendUserExipre"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="extendUserUnlimitedLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">设置用户无限制权限有效期</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >延长或缩短用户的无限制权限 (开发者/商用许可) 有效期</span
          >
        </div>
        <el-divider border-style="dashed"/>
        <el-form
          @submit.prevent
          class="form-container"
          :model="extendUserUnlimitedData"
          :rules="extendRule"
          ref="extendUserUnlimitedForm"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="extendUserUnlimitedData.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="设置时长" prop="hours">
            <el-input
              v-model="extendUserUnlimitedData.hours"
              type="number"
              placeholder="请输入时长(小时)"
              min="-86400"
              max="86400"
            />
            <span>{{ extendUserUnlimitedTimeStr }}</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button
              type="danger"
              native-type="submit"
              @click="extendUserUnlimited"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-dialog
      :width="settingStore.createDialogWidth"
      v-model="addUnlimitedServerDialogVisible"
      title="添加无限制服务器"
      align-center
    >
      <el-form
        @submit.prevent
        :model="addUnlimitedServerData"
        :rules="addUnlimitedServerRule"
        ref="addUnlimitedServerForm"
      >
        <el-form-item label="服务器号" prop="server_code">
          <el-input v-model="addUnlimitedServerData.server_code" placeholder="请输入服务器号"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addUnlimitedServerDialogVisible = false">取消</el-button>
          <el-button
            :loading="unlimitedServerLoading"
            type="warning"
            @click="addUnlimitedServer"
            >提交</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :width="settingStore.createDialogWidth"
      v-model="unBanUserDialogVisible"
      title="解封用户"
      align-center
    >
      确定解封 {{ queryUserData.username }} 吗？
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unBanUserDialogVisible = false">取消</el-button>
          <el-button type="danger" native-type="submit" @click="unBanUser"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入管理仓库
import useAdminStore from "@/store/modules/admin";
// 导入消息通知组件
import { ElNotification } from "element-plus";
import { reactive, ref, computed } from "vue";
// 导入时间转换函数
import { getTimeStr2, getTimeStr3 } from "@/utils";
// 导入设置仓库
import useSettingStore from "@/store/modules/setting";
import {
  onMounted,
} from "vue";

// 使用设置仓库的移动端适配
let settingStore = useSettingStore();

// 使用管理仓库
let adminStore = useAdminStore();

// 数据校验规则
let validateUserName = (_: any, value: any, callback: any) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(value)) {
    callback(new Error("用户名只能是大小英文以及数字"));
  } else {
    callback();
  }
};
let validateRedeemCodeCount = (_: any, value: any, callback: any) => {
  const intValue = parseInt(value, 10);
  if (isNaN(intValue) || intValue <= 0 || intValue !== parseFloat(value)) {
    callback(new Error("请输入正整数"));
  } else if (intValue > 999) {
    callback(new Error("超出最大生成数量"));
  } else {
    callback();
  }
};
let validateValidNumber = (_: any, value: any, callback: any) => {
  const intValue = parseInt(value, 10);
  if (intValue < -86400 || intValue > 86400) {
    callback(new Error("数字超出允许范围"));
  } else {
    callback();
  }
};

// 表单校验规则
// 生成兑换码
const generateRedeemCodeFormRule = {
  type: [
    {
      required: true,
      message: "请选择兑换码类型",
      trigger: "blur",
    },
  ],
  count: [
    { required: true, message: "请输入生成数量", trigger: "blur" },
    { validator: validateRedeemCodeCount, trigger: "blur" },
  ],
  note: [{ required: true, message: "请输入备注", trigger: "blur" }],
};
// 添加无限制服务器
const addUnlimitedServerRule = {
  server_code: [
    { required: true, message: "请输入服务器号", trigger: "blur" },
    { min: 1, message: "服务器号不能为空", trigger: "blur" },
  ],
};

// 查询用户
const queryUserFormRule = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
};
// 封禁用户
const banFormRule = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  hours: [
    { required: true, message: "请输入封禁时长", trigger: "blur" },
    { min: 1, message: "封禁时长至少为 1 小时", trigger: "blur" },
    { validator: validateValidNumber, trigger: "blur" },
  ],
  reason: [
    { required: true, message: "请输入封禁原因", trigger: "blur" },
    { min: 1, message: "封禁原因不能为空", trigger: "blur" },
  ],
};
// 设置用户权限
const setUserPermissionRule = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  permission: [
    { required: true, message: "请选择用户权限", trigger: "blur" },
    { min: 0, max: 1, message: "用户权限不在可设置范围内", trigger: "blur" },
  ],
};
// 续期用户
const extendRule = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  hours: [
    { required: true, message: "请输入时长", trigger: "blur" },
    { validator: validateValidNumber, trigger: "blur" },
  ],
};

// 生成兑换码
// 表单元素
let codeform: EleFormRef = ref(null);
// 新建信息表单
let generateRedeemCodeData = reactive({
  type: "1",
  count: "",
  note: "",
});
// 清空表单
let clearGenerateRedeemCodeForm = () => {
  generateRedeemCodeData.type = "1";
  generateRedeemCodeData.count = "";
  generateRedeemCodeData.note = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (codeform.value) {
        codeform.value.clearValidate(["type", "count"]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 生成卡片loading
let generateRedeemCodeLoading = ref(false);
// 生成兑换码
let generateCode = async () => {
  try {
    await codeform.value!.validate();
    // 显示加载
    generateRedeemCodeLoading.value = true;
    let codeInfo = {
      type: Number(generateRedeemCodeData.type),
      count: Number(generateRedeemCodeData.count),
      note: generateRedeemCodeData.note,
    };
    // 仓库发起请求
    let result = await adminStore.genCode(codeInfo);
    if (result.message) {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    } else {
      ElNotification({
        type: "success",
        title: "Success",
        message: "请及时下载兑换码",
        duration: 3000,
      });
      clearGenerateRedeemCodeForm();
    }
  } catch (error) {
    //console.log(error);
  } finally {
    generateRedeemCodeLoading.value = false;
  }
};

// 无限制服务器
// 无限制服务器loading
let unlimitedServerLoading = ref(false);
let unlimitedServerList = ref<UnlimitedRentalServer[]>([]);
// 弹窗
let addUnlimitedServerDialogVisible = ref(false);
// 表单元素
let addUnlimitedServerForm: EleFormRef = ref(null);
// 表单数据
let addUnlimitedServerData = reactive({
  server_code: "",
});
// 清空表单
let clearAddUnlimitedServerForm = () => {
  addUnlimitedServerData.server_code = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (addUnlimitedServerForm.value) {
        addUnlimitedServerForm.value.clearValidate(["server_code"]);
      }
    }, 200);
  } catch (error) {}
};
// 获取无限制服务器列表
let getUnlimitedServerList = async () => {
  let res = await adminStore.getUnlimitedRentalServerList();
  unlimitedServerList.value = res.unlimited_rental_servers;
};
// 调用添加无限制服务器弹窗
let popAddUnlimitedServerDialog = () => {
  addUnlimitedServerDialogVisible.value = true;
  clearAddUnlimitedServerForm();
};
// 添加无限制服务器
let addUnlimitedServer = async () => {
  try {
    await addUnlimitedServerForm.value!.validate();
    // 显示加载
    unlimitedServerLoading.value = true;
    let addServerInfo = {
      server_code: addUnlimitedServerData.server_code,
    };
    // 仓库发起请求
    let result = await adminStore.addUnlimitedRentalServer(addServerInfo);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      clearAddUnlimitedServerForm();
      // 查询无限制服务器
      getUnlimitedServerList();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
    addUnlimitedServerDialogVisible.value = false;
  } catch (error) {} finally {
    unlimitedServerLoading.value = false;
  }
};
// 删除无限制服务器
let deleteUnlimitedServer = async (id: number) => {
  try {
    // 显示加载
    unlimitedServerLoading.value = true;
    let removeServerInfo = {
      rental_server_id: id,
    };
    // 仓库发起请求
    let result = await adminStore.deleteUnlimitedRentalServer(removeServerInfo);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      // 查询无限制服务器
      getUnlimitedServerList();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
    unlimitedServerLoading.value = false;
  } catch (error) {} finally {
    unlimitedServerLoading.value = false;
  }
};

// 用户操作
// 用户操作loading
let queryUserLoading = ref(false);
// 表单元素
let queryUserForm: EleFormRef = ref(null);
// 表单数据
let queryUserData = reactive({
  username: "",
});
// 查询用户信息
// 用户信息
let queryUserInfo = reactive({
  username: "暂无信息",
  permission: "暂无信息",
  expire_at: "暂无信息",
  unlimited_until: "暂无信息",
  game_id: "暂无信息",
  create_at: "暂无信息",
  ban_until: "",
  ban_reason: "",
});
// 设置用户信息
let setUserInfo = (userInfo: UserQueryDetail) => {
  queryUserInfo.username = userInfo.username;
  if (userInfo.permission == 0) {
    queryUserInfo.permission = "游客";
  } else if (userInfo.permission == 1) {
    queryUserInfo.permission = "激活用户";
  } else if (userInfo.permission == 2) {
    queryUserInfo.permission = "系统管理员";
  } else {
    queryUserInfo.permission = "未知";
  }
  queryUserInfo.permission += `(${userInfo.permission})`;
  queryUserInfo.expire_at = getTimeStr2(userInfo.expire_at);
  queryUserInfo.create_at = getTimeStr2(userInfo.create_at);
  queryUserInfo.unlimited_until = getTimeStr2(userInfo.unlimited_until);
  queryUserInfo.ban_until = getTimeStr2(userInfo.ban_until);
  if (queryUserInfo.ban_until.startsWith("1970")) {
    queryUserInfo.ban_until = "";
  }
  queryUserInfo.ban_reason = userInfo.ban_reason;

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
  queryUserInfo.unlimited_until = "暂无信息";
  queryUserInfo.create_at = "暂无信息";
  queryUserInfo.ban_until = "";
  queryUserInfo.ban_reason = "";
};
// 查询用户信息
let queryUser = async () => {
  try {
    await queryUserForm.value!.validate();
    // 显示加载
    queryUserLoading.value = true;
    let queryUserInfo = {
      username: queryUserData.username,
    };
    // 仓库发起请求
    let result = await adminStore.userQuery(queryUserInfo);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      setUserInfo(result.user);
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
      clearUserInfo();
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    queryUserLoading.value = false;
  }
};

// 用户封禁
// 表单元素
let banform: EleFormRef = ref(null);
// 表单数据
let banData = reactive({
  username: "",
  hours: 0,
  reason: "",
});
// 时长显示
let banTimeStr = computed(() => {
  return getTimeStr3(banData.hours);
});
// 清空表单
let clearBanForm = () => {
  banData.username = "";
  banData.hours = 0;
  banData.reason = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (banform.value) {
        banform.value.clearValidate(["username", "hours", "reason"]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 封禁卡片loading
let banLoading = ref(false);
// 用户封禁
let banUser = async () => {
  try {
    await banform.value!.validate();
    // 显示加载
    banLoading.value = true;
    let banInfo = {
      username: banData.username,
      seconds: banData.hours * 3600,
      reason: banData.reason,
    };
    // 仓库发起请求
    let result = await adminStore.userBan(banInfo);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      clearBanForm();
      // 查询该用户
      queryUserData.username = banInfo.username;
      queryUser();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    banLoading.value = false;
  }
};

// 解封用户
// 解封dialog
let unBanUserDialogVisible = ref(false);
// 显示dialog
let unBanUserDialog = async () => {
  // 校验表单
  try {
    await queryUserForm.value!.validate();
    unBanUserDialogVisible.value = true;
  } catch (error) {}
};
// 解封用户
let unBanUser = async () => {
  // 关掉对话框
  unBanUserDialogVisible.value = false;
  try {
    // 显示加载
    queryUserLoading.value = true;
    let queryUserInfo = {
      username: queryUserData.username,
    };
    // 仓库发起请求
    let result = await adminStore.userUnBan(queryUserInfo);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      // 查询该用户
      queryUser();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    queryUserLoading.value = false;
  }
};

// 设置用户权限
// 表单元素
let setUserPermissionForm: EleFormRef = ref(null);
// 新建信息表单
let setUserPermissionData = reactive({
  username: "",
  permission: "0",
});
// 清空表单
let clearSetUserPermissionForm = () => {
  setUserPermissionData.username = "";
  setUserPermissionData.permission = "0";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (setUserPermissionForm.value) {
        setUserPermissionForm.value.clearValidate(["username", "permission"]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 设置权限卡片loading
let setUserPermissionLoading = ref(false);
// 设置用户权限
let setUserPermission = async () => {
  try {
    await setUserPermissionForm.value!.validate();
    // 显示加载
    setUserPermissionLoading.value = true;
    let setUserPermissionInfo = {
      username: setUserPermissionData.username,
      // 转换为数字
      permission: Number(setUserPermissionData.permission),
    };
    // 仓库发起请求
    let result = await adminStore.userSetPermission(setUserPermissionInfo);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      // 查询该用户
      queryUserData.username = setUserPermissionInfo.username;
      queryUser();
      // 清除表单
      clearSetUserPermissionForm();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    setUserPermissionLoading.value = false;
  }
};

// 用户续费
// 表单元素
let extendUserExipreForm: EleFormRef = ref(null);
// 表单数据
let extendUserExipreData = reactive({
  username: "",
  hours: 0,
});
// 时长显示
let extendUserExipreTimeStr = computed(() => {
  return getTimeStr3(extendUserExipreData.hours);
});
// 清空表单
let clearExtendUserExipreForm = () => {
  extendUserExipreData.username = "";
  extendUserExipreData.hours = 0;
  // 清空校验提示
  try {
    setTimeout(() => {
      if (extendUserExipreForm.value) {
        extendUserExipreForm.value.clearValidate(["username", "hours"]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 续期卡片loading
let extendUserExipreLoading = ref(false);
// 用户续期
let extendUserExipre = async () => {
  try {
    await extendUserExipreForm.value!.validate();
    // 显示加载
    extendUserExipreLoading.value = true;
    let extendUserExipreInfo = {
      username: extendUserExipreData.username,
      seconds: extendUserExipreData.hours * 3600,
    };
    // 仓库发起请求
    let result = await adminStore.userExtendExpireTime(extendUserExipreInfo);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      // 查询该用户
      queryUserData.username = extendUserExipreData.username;
      queryUser();
      // 清除表单
      clearExtendUserExipreForm();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    extendUserExipreLoading.value = false;
  }
};

// 无限制权限续期
// 表单元素
let extendUserUnlimitedForm: EleFormRef = ref(null);
// 表单数据
let extendUserUnlimitedData = reactive({
  username: "",
  hours: 0,
});
// 时长显示
let extendUserUnlimitedTimeStr = computed(() => {
  return getTimeStr3(extendUserUnlimitedData.hours);
});
// 清空表单
let clearExtendUserUnlimitedForm = () => {
  extendUserUnlimitedData.username = "";
  extendUserUnlimitedData.hours = 0;
  // 清空校验提示
  try {
    setTimeout(() => {
      if (extendUserUnlimitedForm.value) {
        extendUserUnlimitedForm.value.clearValidate(["username", "hours"]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 无限制权限续期卡片loading
let extendUserUnlimitedLoading = ref(false);
// 无限制权限续期
let extendUserUnlimited = async () => {
  try {
    await extendUserUnlimitedForm.value!.validate();
    // 显示加载
    extendUserUnlimitedLoading.value = true;
    let extendUserUnlimitedInfo = {
      username: extendUserUnlimitedData.username,
      seconds: extendUserUnlimitedData.hours * 3600,
    };
    // 仓库发起请求
    let result = await adminStore.userExtendUnlimitedTime(
      extendUserUnlimitedInfo
    );
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
      });
      // 查询该用户
      queryUserData.username = extendUserUnlimitedData.username;
      queryUser();
      // 清除表单
      clearExtendUserUnlimitedForm();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    extendUserUnlimitedLoading.value = false;
  }
};

onMounted(() => {
  // 查询无限制服务器
  getUnlimitedServerList();
});
</script>

<style scoped lang="scss">
.card-header,
.card-footer {
  display: flex;
  align-items: center;
}
.form-container {
  max-width: 600px;
}
.userinfo-cell-item {
  display: flex;
  align-items: center;
  .userinfo-cell-item-icon {
    margin-right: 8px;
  }
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: #000000 !important;
}
</style>
