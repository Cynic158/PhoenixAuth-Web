<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <template #header>
        <el-button
          type="primary"
          round
          @click="showUpload"
          v-has="'btn-imgfile-upload'"
          >上传图片</el-button
        >
      </template>
      <!-- 列表 -->
      <div style="height: 496px" v-loading="loading">
        <el-table :data="imgList" border style="width: 100%">
          <el-table-column
            align="center"
            prop="fileId"
            label="图片id"
            width="100"
          />
          <el-table-column
            align="center"
            prop="fileName"
            label="图片名称"
            width="180"
          />
          <el-table-column align="center" label="图片文件">
            <template #default="scope">
              <div
                style="
                  width: 54px;
                  height: 54px;
                  display: inline-flex;
                  align-items: center;
                  overflow: hidden;
                "
              >
                <img :src="scope.row.fileUrl" style="width: 54px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="图片操作">
            <template #default="scope">
              <el-button
                type="primary"
                icon="Edit"
                @click="
                  editDialogShow(
                    scope.row.fileId,
                    scope.row.fileName,
                    scope.row.fileUrl
                  )
                "
              />
              <el-button
                type="danger"
                icon="Delete"
                @click="deleteDialogShow(scope.row.fileId)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="currentPage"
        :page-size="6"
        background
        layout="total, prev, pager, next"
        :total="listTotal"
        @current-change="handleCurrentChange"
        style="margin-left: 4px; margin-top: 12px"
      />
    </el-card>

    <el-dialog
      class="img-dialog"
      v-model="dialogVisible"
      width="500"
      :title="dialogTitle"
      align-center
    >
      <el-form :model="imgFileForm" ref="formRef" :rules="rules">
        <el-form-item label="图片名称" prop="imgName">
          <el-input
            v-model="imgFileForm.imgName"
            placeholder="请输入图片名称"
          />
        </el-form-item>
        <el-form-item label="图片上传" prop="imgUrl">
          <el-upload
            ref="upload"
            class="img-uploader"
            :action="preurl"
            :show-file-list="false"
            :limit="1"
            :on-success="handleUploadSuccess"
            :before-upload="beforeImgUpload"
            :on-exceed="handleExceed"
          >
            <img
              v-if="imgFileForm.imgUrl"
              :src="imgFileForm.imgUrl"
              class="img-slot"
            />
            <el-icon v-else class="img-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitImgFile()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteDialog" width="500" title="删除文件" align-center>
      <span>确定要删除该图片文件吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialog = false">取消</el-button>
          <el-button type="primary" @click="deleteFile">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
// @ts-ignore
import { genFileId } from "element-plus";
// @ts-ignore
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
// element的消息通知组件
// @ts-ignore
import { ElNotification, ElMessage } from "element-plus";
// 导入测试api
// @ts-ignore
import { reqAddFile, reqFileList, reqDelFile, reqEditFile } from "@/api/test";

// _____________________________________________________________________
// 表单部分
let formRef = ref(null);
// 图片文件表单
let imgFileForm = reactive({
  imgName: "",
  imgUrl: "",
});
// 对话框显示flag
let dialogVisible = ref(false);
// 对话框标题
let dialogTitle = ref("上传图片");
// 清除对话框的图片上传红框以及表单校验提示
let clearDialog = () => {
  // @ts-ignore
  document.querySelector(".img-uploader").style.border =
    "1px dashed var(--el-border-color)";
  // @ts-ignore
  formRef.value.clearValidate(["imgName", "imgUrl"]);
};
// 表单图片校验
// @ts-ignore
let checkImg = (rule: any, value: any, callback: any) => {
  if (imgFileForm.imgUrl == "") {
    return callback(new Error("请选择图片上传"));
  } else {
    callback();
  }
};
// 表单校验规则
const rules = reactive({
  imgName: [
    { required: true, message: "请输入图片名称", trigger: "blur" },
    {
      min: 2,
      max: 10,
      message: "图片名称至少为两个字，不多于十个字",
      trigger: "blur",
    },
  ],
  imgUrl: [
    { required: true, message: "请选择图片上传", trigger: "blur" },
    { validator: checkImg, trigger: "blur" },
  ],
});

// _____________________________________________________________________
// 图片框图片处理
// 图片上传框
let upload = ref<UploadInstance>();
// 限制只能上传一个
let handleExceed: UploadProps["onExceed"] = (files: any) => {
  // @ts-ignore
  upload.value.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  // @ts-ignore
  upload.value.handleStart(file);
  // @ts-ignore
  upload.value.submit();
};
// 上传前回调，限制为图片上传
let beforeImgUpload = (rawFile: any) => {
  if (
    rawFile.type !== "image/jpeg" &&
    rawFile.type !== "image/jpg" &&
    rawFile.type !== "image/png"
  ) {
    ElMessage.error("图片只能是jpeg、jpg或者png格式");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片不能大于5MB");
    return false;
  }
  return true;
};
// 预上传地址
let preurl = import.meta.env.VITE_APP_BASE_URL + "/test/uploadimg";
// 预上传回调
let handleUploadSuccess = (response: any) => {
  if (response.code == 200) {
    // 上传成功，显示图片
    imgFileForm.imgUrl = response.data.imgurl;
    // 清除红框
    // @ts-ignore
    document.querySelector(".img-uploader").style.border =
      "1px dashed var(--el-border-color)";
    // 清除图片框的表单校验提示
    // @ts-ignore
    formRef.value.clearValidate(["imgUrl"]);
  } else {
    // 预上传失败
    ElNotification({
      type: "error",
      message: "预上传失败",
      duration: 3000,
    });
  }
};

// _____________________________________________________________________
// 提交图片
// 提交类型，0为上传1为编辑
let submitType = ref(0);
// 编辑图片项的id
let editId = ref(0);
// 上传类型对话框显示
let showUpload = () => {
  try {
    // 设置当前提交类型为上传
    submitType.value = 0;
    // 设置当前对话框标题
    dialogTitle.value = "上传图片";
    // 每次打开对话框都清除表单数据
    imgFileForm.imgName = "";
    imgFileForm.imgUrl = "";
    // 显示对话框
    dialogVisible.value = true;
    // 清除对话框的图片上传红框以及表单校验提示
    clearDialog();
  } catch (error) {}
};
// 编辑类型对话框显示
let editDialogShow = (fileid: number, filename: string, fileurl: string) => {
  // 设置当前编辑的图片id
  editId.value = fileid;
  // 设置当前提交类型为编辑
  submitType.value = 1;
  // 设置当前对话框标题
  dialogTitle.value = "编辑图片";
  // 获取当前编辑的图片项的信息
  imgFileForm.imgName = filename;
  imgFileForm.imgUrl = fileurl;
  // 显示对话框
  dialogVisible.value = true;
  // 清除对话框的图片上传红框以及表单校验提示
  clearDialog();
};
// 对话框点击确定后提交上传或者编辑
let submitImgFile = async () => {
  // 先对表单进行校验
  try {
    // @ts-ignore
    await formRef.value.validate();
    // 校验通过，关闭对话框
    dialogVisible.value = false;
    // 提示上传
    ElNotification({
      type: "info",
      message: "图片上传中",
      duration: 3000,
    });
    // 若当前操作为编辑
    if (submitType.value == 1) {
      // 传入编辑id、url和图片名称发起编辑请求
      let result = await reqEditFile({
        fileid: editId.value,
        fileurl: imgFileForm.imgUrl,
        filename: imgFileForm.imgName,
      });
      // 编辑成功
      //@ts-ignore
      if (result.code == 200) {
        ElNotification({
          type: "success",
          message: "图片编辑成功",
          duration: 3000,
        });
        //再刷新列表，停留在当前页
        getList(currentPage.value);
      } else {
        // 编辑失败
        ElNotification({
          type: "error",
          message: "图片编辑失败",
          duration: 3000,
        });
      }
      // 若当前操作为上传
    } else if (submitType.value == 0) {
      // 传入url以及图片名称发起上传请求
      let result = await reqAddFile({
        imgUrl: imgFileForm.imgUrl,
        imgName: imgFileForm.imgName,
      });
      // 上传成功
      //@ts-ignore
      if (result.code == 200) {
        ElNotification({
          type: "success",
          message: "图片上传成功",
          duration: 3000,
        });
        //再刷新列表
        getList(1);
      } else {
        // 上传失败
        ElNotification({
          type: "error",
          message: "图片上传失败",
          duration: 3000,
        });
      }
    }
  } catch (error: any) {
    // 校验不通过
    // @ts-ignore
    document.querySelector(".img-uploader").style.border = "1px dashed red";
  }
};

// _____________________________________________________________________
// 获取列表部分
// 列表渲染数组
let imgList = ref([]);
// 图片项总数
let listTotal = ref(0);
// 当前页码
let currentPage = ref(1);
// 列表加载flag
let loading = ref(false);
// 获取列表
let getList = async (page: number, pagesize: number = 6) => {
  // 显示开始加载
  loading.value = true;
  // 传入页码和列表显示数发起请求获取列表，列表显示数默认为6个
  let result = await reqFileList({ page: page, pagesize: pagesize });
  // 获取成功
  //@ts-ignore
  if (result.code == 200) {
    // 关闭加载
    loading.value = false;
    // 更新列表渲染数组
    imgList.value = result.data.filelist;
    // 更新图片项总数
    listTotal.value = result.data.total;
    // 返回成功的promise
    return "success";
  } else {
    // 获取失败
    ElNotification({
      type: "error",
      message: "列表数据获取失败",
      duration: 3000,
    });
    // 返回失败的promise
    return Promise.reject(result.data.message);
  }
};
// 页码发生变化就获取新的列表
let handleCurrentChange = (val: number) => {
  getList(val);
};
// 页面初始化时就获取一次列表
onMounted(() => {
  getList(1);
});

// _____________________________________________________________________
// 删除列表项
// 对话框显示flag
let deleteDialog = ref(false);
// 要删除的图片项id
let deleteId = ref(0);
// 对话框显示
let deleteDialogShow = (fileid: number) => {
  // 设置当前删除图片项id
  deleteId.value = fileid;
  // 显示对话框
  deleteDialog.value = true;
};
// 确认删除
let deleteFile = async () => {
  // 关闭对话框
  deleteDialog.value = false;
  // 提示删除
  ElNotification({
    type: "info",
    message: "删除中",
    duration: 3000,
  });
  // 发起删除图片项请求
  let result = await reqDelFile({ fileid: deleteId.value });
  // 删除成功
  // @ts-ignore
  if (result.code == 200) {
    // 留在当前页刷新，如果本身当前页的数据少为1就额外扣1页
    if (imgList.value.length == 1 && currentPage.value != 1) {
      currentPage.value = currentPage.value - 1;
      getList(currentPage.value);
    } else {
      getList(currentPage.value);
    }
    ElNotification({
      type: "success",
      message: "删除成功",
      duration: 3000,
    });
  } else {
    // 删除失败
    ElNotification({
      type: "error",
      message: "删除失败",
      duration: 3000,
    });
  }
};
</script>

<style scoped lang="scss">
:deep(.cell) {
  height: 54px;
  line-height: 54px;
}
.img-uploader .img-slot {
  width: 178px;
  display: block;
}
.img-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  display: flex;
  align-items: center;
}

.img-uploader:hover {
  border-color: var(--el-color-primary);
}

.el-icon.img-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
