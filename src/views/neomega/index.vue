<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">Record</div>
      </template>
      <div>
        <p>查看 NeOmega 服务的累计使用记录</p>
        <el-divider border-style="dashed" />
        <div style="height: 300px">
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2
                :columns="recordColumns"
                :data="recordData"
                :width="width"
                :height="height"
                @end-reached="loadRecord"
                fixed
              />
            </template>
          </el-auto-resizer>
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">License</div>
      </template>
      <div>
        <p>查看与管理 NeOmega 许可证</p>
        <el-divider border-style="dashed" />
        <div style="height: 300px">
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2
                :columns="licenseColumns"
                :data="licenseData"
                :width="width"
                :height="height"
                :footer-height="40"
                @end-reached="loadLicense"
                fixed
              >
                <template #footer>
                  <el-button
                    style="width: 100%; height: 100%"
                    @click="createLicenseFormVisible = true"
                  >
                    添加
                  </el-button>
                </template>
              </el-table-v2>
            </template>
          </el-auto-resizer>
        </div>
      </div>
    </el-card>
    <el-dialog
      :width="settingStore.createDialogWidth"
      v-model="deleteLicenseDialogVisible"
      title="删除 License"
      align-center
    >
      确定要删除该 license 吗?
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteLicenseDialogVisible = false"
            >取消</el-button
          >
          <el-button type="danger" @click="deleteLicense">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :width="settingStore.createDialogWidth"
      v-model="createLicenseFormVisible"
      title="创建 License"
      align-center
    >
      <el-form
        @submit.prevent
        :model="createLicenseFormData"
        :rules="createLicenseFormRule"
        ref="createLicenseFormRef"
        label-width="110px"
      >
        <el-form-item label="License 类型" prop="license_type">
          <el-select
            v-model="createLicenseFormData.license_type"
            placeholder="请选择 License 类型"
          >
            <el-option label="Launcher" :value="1" />
            <el-option label="Builder" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="凭证类型" prop="identity_type">
          <el-select
            v-model="createLicenseFormData.identity_type"
            placeholder="请选择凭证类型"
          >
            <el-option label="UID" :value="1" />
            <el-option label="IP" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="凭证内容" prop="identity">
          <el-input
            v-model="createLicenseFormData.identity"
            placeholder="请输入凭证内容"
          />
        </el-form-item>
        <el-form-item label="服务器号" prop="server_id">
          <el-input
            v-model="createLicenseFormData.server_id"
            placeholder="请输入服务器ID (可选)"
          />
        </el-form-item>
        <el-form-item label="备注" prop="grant_reason">
          <el-input
            v-model="createLicenseFormData.grant_reason"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createLicenseFormVisible = false">取消</el-button>
          <el-button
            :loading="createLicenseFormLoading"
            type="primary"
            @click="createLicense"
            >提交</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import useSettingStore from "@/store/modules/setting";
import useNeomegaStore from "@/store/modules/neomega";
import { onMounted, ref } from "vue";
import { getTimeStr2 } from "@/utils";
import { ElButton } from "element-plus";
import { ElNotification } from "element-plus";

// 使用设置仓库的移动端适配
let settingStore = useSettingStore();

// 删除 Slot Dialog
let deleteLicenseDialogVisible = ref(false);
let deleteLicenseDialogId = ref(0);

// 记录
interface Record {
  uid: string;
  server_id: string;
  product_type: number;
  days: number;
}

let recordPageNum = 1;
let recordPageSize = 50;
let reachRecordBottom = false;
let recordData = ref<Record[]>([]);

// 累计使用记录表格列
let recordColumns = [
  {
    key: "index",
    dataKey: "index",
    title: "Index",
    width: 60,
    cellRenderer: (data: any) => {
      return data.rowIndex + 1;
    }
  },
  { key: "uid", dataKey: "uid", title: "UID", width: 100 },
  { key: "server_id", dataKey: "server_id", title: "服务器号", width: 80 },
  {
    key: "product_type",
    dataKey: "product_type",
    title: "产品类型",
    width: 80,
    cellRenderer: (data: any) => {
      switch (data.rowData.product_type) {
        case 1:
          return "Launcher";
        case 2:
          return "Builder";
        default:
          return "未知";
      }
    }
  },
  {
    key: "days",
    dataKey: "days",
    title: "累计天数",
    width: 80,
    align: "center"
  }
];

// 获取累计使用记录
let loadRecord = async () => {
  // 如果已经加载完所有记录则不再请求
  if (reachRecordBottom) {
    return;
  }
  // 请求记录
  try {
    let result = await useNeomegaStore().queryRecord({
      page_num: recordPageNum,
      page_size: recordPageSize
    });
    if (result.data.records) {
      recordData.value.push(...result.data.records);
      recordPageNum++;
    } else {
      reachRecordBottom = true;
    }
  } catch (error: any) {}
};

// 许可证
interface License {
  id: number;
  license_type: number;
  identity: string;
  identity_type: number;
  server_id: string;
  grant_reason: string;
  create_at: number;
}

let licensePageNum = 1;
let licensePageSize = 50;
let reachLicenseBottom = false;
let licenseData = ref<License[]>([]);

// 许可证表格列
let licenseColumns = [
  { key: "id", dataKey: "id", title: "ID", width: 40 },
  {
    key: "license_type",
    dataKey: "license_type",
    title: "类型",
    width: 100,
    cellRenderer: (data: any) => {
      switch (data.rowData.license_type) {
        case 1:
          return "Launcher";
        case 2:
          return "Builder";
        default:
          return "未知";
      }
    }
  },
  {
    key: "server_id",
    dataKey: "server_id",
    title: "服务器号",
    width: 100,
    cellRenderer: (data: any) => {
      return data.rowData.server_id ? data.rowData.server_id : "无限制";
    }
  },
  {
    key: "create_at",
    dataKey: "create_at",
    title: "创建时间",
    width: 200,
    cellRenderer: (data: any) => {
      return getTimeStr2(data.rowData.create_at);
    }
  },
  {
    key: "identity_type",
    dataKey: "identity_type",
    title: "凭证",
    width: 200,
    cellRenderer: (data: any) => {
      let identity = data.rowData.identity;
      switch (data.rowData.identity_type) {
        case 1:
          return identity + " (UID)";
        case 2:
          return identity + " (IP)";
        default:
          return "未知";
      }
    }
  },
  {
    key: "grant_reason",
    dataKey: "grant_reason",
    title: "授权原因",
    width: 300
  },
  {
    key: "operations",
    title: "操作",
    cellRenderer: (data: any) => (
      <>
        <ElButton
          size="small"
          type="danger"
          onClick={() => {
            deleteLicenseDialogId.value = data.rowData.id;
            deleteLicenseDialogVisible.value = true;
          }}
        >
          Delete
        </ElButton>
      </>
    ),
    width: 100,
    align: "center",
    fixed: "right"
  }
];

// 获取许可证列表
let loadLicense = async () => {
  // 如果已经加载完所有记录则不再请求
  if (reachLicenseBottom) {
    return;
  }
  // 请求记录
  try {
    let result = await useNeomegaStore().queryLicense({
      page_num: licensePageNum,
      page_size: licensePageSize
    });
    if (result.data.licenses) {
      licenseData.value.push(...result.data.licenses);
      licensePageNum++;
    } else {
      reachLicenseBottom = true;
    }
  } catch (error: any) {}
};

// 删除许可证
let deleteLicense = async () => {
  console.log(deleteLicenseDialogId.value);
  try {
    await useNeomegaStore().deleteLicense({
      id: deleteLicenseDialogId.value
    });
    // 删除成功后刷新许可证列表
    licenseData.value = [];
    licensePageNum = 1;
    reachLicenseBottom = false;
    loadLicense();
  } catch (error: any) {
  } finally {
    deleteLicenseDialogVisible.value = false;
  }
};

// 创建许可证
let createLicenseFormRef: EleFormRef = ref(null);
let createLicenseFormVisible = ref(false);
let createLicenseFormLoading = ref(false);
let createLicenseFormData = ref({
  license_type: 1,
  identity: "",
  identity_type: 1,
  server_id: "",
  grant_reason: ""
});

const createLicenseFormRule = {
  license_type: [
    { required: true, message: "请选择 License 类型", trigger: "blur" }
  ],
  identity: [{ required: true, message: "请输入凭证内容", trigger: "blur" }],
  identity_type: [
    { required: true, message: "请选择凭证类型", trigger: "blur" }
  ],
  grant_reason: [{ required: true, message: "请输入备注", trigger: "blur" }]
};

let clearCreateLicenseForm = () => {
  createLicenseFormData.value = {
    license_type: 1,
    identity: "",
    identity_type: 1,
    server_id: "",
    grant_reason: ""
  };
};

let createLicense = async () => {
  try {
    if (createLicenseFormRef.value) {
      await createLicenseFormRef.value.validate();
    }
  } catch (error: any) {
    return;
  }
  try {
    let result = await useNeomegaStore().createLicense(
      createLicenseFormData.value
    );
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
      // 创建成功后刷新许可证列表
      licenseData.value = [];
      licensePageNum = 1;
      reachLicenseBottom = false;
      loadLicense();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
    clearCreateLicenseForm();
  } catch (error: any) {
  } finally {
    createLicenseFormLoading.value = false;
    createLicenseFormVisible.value = false;
  }
};

onMounted(() => {
  loadRecord();
  loadLicense();
});
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
}
a {
  color: inherit;
}
.limited-form-container {
  max-width: 600px;
}
:deep(.el-table-v2__body) > div:nth-child(1) {
  overflow: auto !important;
}
</style>
