<template>
  <div>
    <!-- <el-card shadow="hover" v-loading="adminCreateLoading">
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
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="createUser">新建</el-button>
            <el-button @click="clearCreateForm">清空表单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card> -->
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.card-header,
.card-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.admin-create-form-container,
.botname-form-container {
  max-width: 600px;
}
</style>
