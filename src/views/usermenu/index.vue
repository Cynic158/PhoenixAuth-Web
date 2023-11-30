<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">我的信息</div>
      </template>
      <div class="userinfo-container">
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px">描述</span>
        </div>
      </div>
      <el-divider />

      <el-descriptions class="margin-top" :column="2" size="default" border>
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
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">获取 Phoenix Token</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px">描述</span>
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
          <span style="margin-left: 12px">描述</span>
        </div>
        <el-divider />

        <div>表单</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useUserStore from "@/store/modules/user";
import { computed } from "vue";
// 使用用户仓库
let userStore = useUserStore();

// 用户的创建时间以及过期时间
const createTime = computed(() => {
  const date = new Date(Number(userStore.ucreate) * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 注意月份是从0开始计数，所以要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 使用模板字符串构建时间字符串
  const formattedDate = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  return formattedDate;
});
const expireTime = computed(() => {
  const date = new Date(Number(userStore.uexpire) * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 注意月份是从0开始计数，所以要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 使用模板字符串构建时间字符串
  const formattedDate = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  return formattedDate;
});

// 请求phoenixtoken
let tokenDownload = async () => {
  await userStore.userDownload();
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
</style>
