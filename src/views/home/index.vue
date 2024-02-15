<template>
  <div>
    <div class="notice-list-container">
      <div style="margin-bottom: 8px; display: flex; justify-content: right">
        <el-button
          v-if="userStore.adminFlag == '是'"
          type="primary"
          round
          @click="createdialog"
        >
          创建公告
        </el-button>
      </div>
      <el-empty
        v-if="annList.length == 0"
        v-loading="loading"
        description="暂无公告"
      />
      <el-card
        v-loading="loading"
        v-for="item in annList"
        :key="item.ID"
        shadow="hover"
        class="notice-container"
      >
        <template #header>
          <div class="card-header">
            <span>{{ item.title }}</span>
          </div>
        </template>
        <div class="notice-content" v-html="item.content"></div>
        <el-divider />
        <div class="notice-author">
          <span>{{ item.formatted_create_time }}</span>
          <div
            class="notice-option"
            :style="{ width: settingStore.pageSmall ? '100%' : 'auto' }"
          >
            <span>Author: {{ item.author_name }}</span>
            <div style="display: inline-flex; align-items: center; flex-wrap: wrap">
              <el-button
                style="margin-left: 8px"
                @click="editDialog(item.ID, item.title, item.content)"
                v-if="userStore.adminFlag == '是'"
                type="primary"
                round
              >
                <el-icon class="userinfo-cell-item-icon">
                  <Edit />
                </el-icon>
              </el-button>
              <el-button
                style="margin-left: 8px"
                @click="deletedialog(item.ID)"
                v-if="userStore.adminFlag == '是'"
                type="danger"
                round
              >
                <el-icon class="userinfo-cell-item-icon">
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
      <el-dialog
        :width="settingStore.createDialogWidth"
        v-model="dialogVisible"
        title="公告内容编辑"
        align-center
      >
        <el-form
          class="notice-form-container"
          :model="noticeData"
          :rules="rules"
          ref="noticeform"
        >
          <el-form-item label="公告ID" v-if="noticeData.ID != 0">
            <el-input 
              v-model="noticeData.ID"
              disabled
            />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input 
              v-model="noticeData.title"
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input
              v-model="noticeData.content"
              :autosize="{ minRows: 4 }"
              type="textarea"
              placeholder="请输入内容, 支持HTML渲染"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              type="warning"
              @click="previewNotice"
              >预览</el-button
            >
            <el-button
              :loading="noticeloadingflag"
              type="primary"
              @click="submitNotice"
              >提交</el-button
            >
          </span>
        </template>
      </el-dialog>

      <el-dialog
        width="300px"
        v-model="deleteDialogVisible"
        title="删除公告"
        align-center
      >
        确定要删除该公告吗
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button
              :loading="deleteloadingflag"
              type="primary"
              @click="deleteNotice"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>

    <div class="notice-footer">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="5"
        :pager-count="5"
        :small="settingStore.pageSmall"
        background
        layout="total, prev, pager, next"
        :total="annTotal"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入设置仓库
import useSettingStore from "@/store/modules/setting";
// 导入公告仓库
import useAnnouncementStore from "@/store/modules/announcement";
import { onMounted, reactive, ref } from "vue";
// 导入通知
import { ElNotification, ElMessageBox } from "element-plus";
// 导入缓动函数
import { verticalScroll } from "@/utils";

// 使用用户仓库的管理员信息
let userStore = useUserStore();
// 使用设置仓库的移动端适配
let settingStore = useSettingStore();
// 使用公告仓库的请求
let annStore = useAnnouncementStore();

// 查看公告
// 列表加载flag
let loading = ref(false);
// 公告列表数组
interface annObj {
  ID: number;
  title: string;
  content: string;
  author_name: string;
  formatted_create_time: string;
}
let annList = ref<annObj[]>([]);
// 公告总数
let annTotal = ref(0);
// 当前页码
let currentPage = ref(1);
// 获取公告数组函数
let getAnnList = async (page_num: number) => {
  // 显示开始加载
  loading.value = true;
  try{
    // 发起请求
    let result = await annStore.getAnn({ page_num, page_size: 5 });
    // @ts-ignore
    if (result.success) {
      // 获取成功
      // 更新列表
      // @ts-ignore
      annList.value = result.announcements;
      // 更新总数
      // @ts-ignore
      annTotal.value = result.total;
      // 回滚到顶部
      let scrollEl = document.querySelector(".el-main");
      await verticalScroll(scrollEl as Element);
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  }catch(err){
  }finally{
    loading.value = false;
  }
};
// 页码发生变化就获取新的列表
let handleCurrentChange = (val: number) => {
  getAnnList(val);
};

// 页面初始化时就获取一次列表
onMounted(() => {
  getAnnList(1);
});

// 添加公告
// 弹窗
let dialogVisible = ref(false);
let createdialog = () => {
  // 在此处获取当前暗黑主题
  let darkflag = localStorage.getItem("DARKMODE") === "true";
  let element = document.documentElement;
  element.style.setProperty("--w-e-textarea-bg-color", "transparent");
  element.style.setProperty(
    "--w-e-toolbar-bg-color",
    "var(--el-fill-color-light)"
  );
  element.style.setProperty("--w-e-toolbar-border-color", "transparent");
  element.style.setProperty(
    "--w-e-toolbar-active-color",
    "var(--el-text-color-regular)"
  );
  element.style.setProperty(
    "--w-e-toolbar-color",
    "var(--el-text-color-regular)"
  );
  if (darkflag) {
    // 更改为黑色
    element.style.setProperty("--w-e-textarea-color", "#f5f5f5");
  } else {
    // 更改为白色
    element.style.setProperty("--w-e-textarea-color", "#333");
  }
  dialogVisible.value = true;
  clearForm();
};
// 表单元素
let noticeform = ref(null);
// 表单数据
let noticeData = reactive({
  ID: 0,
  title: "",
  content: "",
});
// 清空表单
let clearForm = () => {
  noticeData.ID = 0;
  noticeData.title = "";
  noticeData.content = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (noticeform.value) {
        // @ts-ignore
        noticeform.value.clearValidate(["title"]);
      }
    }, 100);
  } catch (error) {
    console.log(error);
  }
};
// 创建按钮加载状态
let noticeloadingflag = ref(false);
// 表单校验规则
const rules = {
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入内容",
      trigger: "blur",
    },
  ],
};
// 预览公告
let previewNotice = async () => {
  try{
    // @ts-ignore
    await noticeform.value.validate();
    ElMessageBox.alert(
      noticeData.content,
      noticeData.title,
      {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        closeOnClickModal: true,
        showClose: false,
        callback: () => { /* Do nothing */ },
      }
    )
  }catch(error: any){}
};
// 创建公告
let submitNotice = async () => {
  try {
    // 校验表单
    // @ts-ignore
    await noticeform.value.validate();
    // 显示加载
    noticeloadingflag.value = true;
    let noticeInfo = {
      ID: 0,
      title: "",
      content: "",
    };
    noticeInfo.ID = noticeData.ID;
    noticeInfo.title = noticeData.title;
    noticeInfo.content = noticeData.content;
    // 如果id为0，说明是新公告，将调用创建接口，否则调用编辑接口
    if (noticeData.ID == 0){
      // 仓库发起请求
      let result = await annStore.annCreate(noticeInfo);
      // @ts-ignore
      if (result.success) {
        dialogVisible.value = false;
        // 刷新列表
        getAnnList(1);
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
    }else{
      // 仓库发起请求
      let result = await annStore.annEdit(noticeInfo);
      // @ts-ignore
      if (result.success) {
        dialogVisible.value = false;
        // 刷新列表
        getAnnList(1);
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
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    noticeloadingflag.value = false;
  }
};
// 编辑公告
let editDialog = (id: number, title: string, content: string) => {
  noticeData.ID = id;
  noticeData.title = title;
  noticeData.content = content;
  dialogVisible.value = true;
};

// 删除公告
// 弹窗
let deleteDialogVisible = ref(false);
let deletedialog = (id: number) => {
  deleteid.value = id;
  deleteDialogVisible.value = true;
};
// 删除按钮加载状态
let deleteloadingflag = ref(false);
// 删除的id
let deleteid = ref(0);
let deleteNotice = async () => {
  try {
    // 显示加载
    deleteloadingflag.value = true;
    // 仓库发起请求
    let result = await annStore.annDelete(deleteid.value);
    // @ts-ignore
    if (result.success) {
      deleteDialogVisible.value = false;
      //  刷新列表
      // 留在当前页刷新，如果本身当前页的数据少为1就额外扣1页
      if (annList.value.length == 1 && currentPage.value != 1) {
        currentPage.value = currentPage.value - 1;
        getAnnList(currentPage.value);
      } else {
        getAnnList(currentPage.value);
      }
      ElNotification({
        type: "success",
        title: "Success",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    } else {
      deleteDialogVisible.value = false;
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
    console.log(error);
  } finally {
    // 请求完成，关闭加载
    deleteloadingflag.value = false;
  }
};
</script>

<style scoped lang="scss">
.notice-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.notice-list-container {
  min-height: 600px;
  margin-bottom: 20px;
}
.notice-container {
  margin-bottom: 12px;
  .notice-content {
    line-height: 24px;
  }
  .notice-author {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
.notice-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
