<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">从源码构建</div>
      </template>
      <div>
        <span>您可以从源码构建 PhoenixBuilder 以使用。</span><br><br>
        <span>git clone git@github.com:LNSSPsd/PhoenixBuilder.git</span><br><br>
        <span>cd PhoenixBuilder</span><br><br>
        <span>make current</span><br><br>
        <span># 初次使用在执行完一次 make 后执行下面的命令</span><br><br>
        <span>sed "s/urrentProtocol byte = 10/urrentProtocol byte = 8/g" ~/go/pkg/mod/github.com/sandertv/go-raknet@v1.9.1/conn.go</span><br><br>
        <span>make current</span><br><br>
        <span>./build/phoenixbuilder</span><br>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">下载预构建版本</div>
      </template>
      <div>
        <span>我们也为每个稳定版本提供了预先构建好的二进制文件供您使用，点击以下链接以查看。</span><br><br>
        <span><a href="https://github.com/LNSSPsd/PhoenixBuilder/releases/latest" target="_blank">https://github.com/LNSSPsd/PhoenixBuilder/releases/latest</a></span><br>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">更改验证服务器</div>
      </template>
      <div>
        <span>您可能需要在启动客户端程序时添加额外参数来要使用我们的服务</span><br><br>
        <span>./phoenixbuilder -A https://liliya233.uk</span><br><br>
        <span>./windows-amd64.exe -A https://liliya233.uk</span><br><br>
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
