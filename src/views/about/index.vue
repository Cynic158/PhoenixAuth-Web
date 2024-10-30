<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">Community</div>
      </template>
      <div>
        <span>您可以通过下方入口加入我们的社区与其他用户交流：</span><br /><br />
        <span>
          QQ 交流群: 795799925 (
          <a 
            href="https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=mJ6Bz2WYE0V696MO8mHG8M6xYw1m6Ley&authKey=dC3XmQCUJ1dTLdZC7Ms1y0D%2FRJvgXUMjFZCpudvlH%2BcHWeN%2B4%2FEzcgFid3jma4EN&noverify=0&group_code=795799925"
            target="_blank"
            >
            点击加入
          </a>
          )
        </span>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">Web</div>
      </template>
      <div>
        <span>Powered by Vue3, Element Plus, etc.</span><br /><br />
        <div style="display: flex; align-items: center">
          <img
            class="avatar"
            src="../../assets/images/avatar.webp"
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
            src="../../assets/images/avatar2.webp"
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
