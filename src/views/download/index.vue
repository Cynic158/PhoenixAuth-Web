<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">PhoenixBuilder</div>
      </template>
      <div>
        <span>
          您可以从源码构建 PhoenixBuilder 以使用
        </span>
        <Precode :code="fbbuild" :type="'bash'"></Precode>
        <span style="display: inline-block; margin-top: 16px">
          您也可以点击以下链接下载预先构建好的二进制文件来使用
        </span>
        <p style="margin-top: 16px">
          <a
            style="white-space: normal; word-wrap: break-word"
            href="https://github.com/LNSSPsd/PhoenixBuilder/releases/latest"
            target="_blank"
            >https://github.com/LNSSPsd/PhoenixBuilder/releases/latest
          </a>
        </p>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">neOmega</div>
      </template>
      <div>
        <span>
          安卓 / Linux / macOS 在终端输入以下内容自动下载
        </span>
        <Precode :code="neo" :type="'bash'"></Precode>
        <span style="display: inline-block; margin-top: 16px">
          Windows 用户点击以下链接下载并运行
        </span>
        <p style="margin-top: 16px">
          <a
            style="white-space: normal; word-wrap: break-word"
            href="https://omega-1259160345.cos.ap-nanjing.myqcloud.com/fastbuilder_launcher/windows-amd64.exe"
            target="_blank"
            >https://omega-1259160345.cos.ap-nanjing.myqcloud.com/fastbuilder_launcher/windows-amd64.exe
          </a>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入代码显示

let fbbuild = `git clone git@github.com:LNSSPsd/PhoenixBuilder.git

cd PhoenixBuilder

make current

# 初次使用在执行完一次 make 后执行下面的命令
sed "s/currentProtocol byte = */currentProtocol byte = 8/g" ~/go/pkg/mod/github.com/sandertv/go-raknet@v1.12.0/conn.go

make current

./build/phoenixbuilder`;

let neo = `curl -o install.sh https://omega-1259160345.cos.ap-nanjing.myqcloud.com/fastbuilder_launcher/install.sh && bash install.sh && rm install.sh`;
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
}
a {
  color: inherit;
}
</style>
