<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">Web</div>
      </template>
      <div>
        <span>Powered by Vue3, Element Plus, etc.</span><br /><br />
        <div style="display: flex; align-items: center">
          <img
            class="avatar"
            src="../../assets/images/avatar.png"
            alt=""
          /><span class="author">Cynic158</span>
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">Backend</div>
      </template>
      <div>
        <span>Powered by Gin, Gorm, etc.</span><br /><br />
        <div style="display: flex; align-items: center">
          <img
            class="avatar"
            src="../../assets/images/avatar2.png"
            alt=""
          /><span class="author">Liliya233</span>
        </div>
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
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}
.author {
  margin-left: 12px;
  font-size: 18px;
}
</style>
