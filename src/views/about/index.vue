<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">用户中心</div>
      </template>
      <div>
        <span>Powered by Vue3, Element Plus, etc.</span><br><br>
        <span>Author: <a href="https://github.com/Cynic158" target="_blank">Cynic158</a></span><br>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">验证服务</div>
      </template>
      <div>
        <span>Powered by Gin, Gorm, etc.</span><br><br>
        <span>Author: <a href="https://github.com/Liliya233" target="_blank">Liliya233</a></span><br>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
}

a:visited {
  color: inherit;
}
</style>
