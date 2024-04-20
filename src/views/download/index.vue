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
        <div v-for="cmd in fbBuildCmds">
          <Precode :code="cmd" :type="'bash'"></Precode>
        </div>
        <span style="display: inline-block; margin-top: 16px">
          安卓 / Linux / macOS 可尝试在终端输入以下内容使用官方提供的安装脚本, 并根据提示使用对应的命令来启动程序
        </span>
        <Precode :code="fbMainInstaller" :type="'bash'"></Precode>
        <Precode :code="fbLibreInstaller" :type="'bash'"></Precode>
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
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">ToolDelta</div>
      </template>
      <div>
        <span style="display: inline-block">
          点击以下链接前往 ToolDelta Wiki 查看使用教程
        </span>
        <p style="margin-top: 16px">
          <a
            style="white-space: normal; word-wrap: break-word"
            href="https://tooldelta-wiki.tblstudio.cn"
            target="_blank"
            >https://tooldelta-wiki.tblstudio.cn
          </a>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入代码显示

let fbBuildCmds = [
  "git clone git@github.com:LNSSPsd/PhoenixBuilder.git",
  "cd PhoenixBuilder",
  "make current",
  "# 初次使用在执行完一次 make 后执行下面的命令\n"+
  `sed "s/currentProtocol byte = */currentProtocol byte = 8/g" ~/go/pkg/mod/github.com/sandertv/go-raknet@v1.12.0/conn.go`,
  "make current",
  "./build/phoenixbuilder",
]

let fbMainInstaller = "# 主分支\n"+
  `export LOCAL=1 && export PB_USE_GH_REPO=1 && curl -o install.sh https://raw.githubusercontent.com/LNSSPsd/PhoenixBuilder/main/install.sh && bash install.sh && rm install.sh`;

let fbLibreInstaller = "# Libre 分支\n"+
  `export LOCAL=1 && export PB_USE_GH_REPO=1 && curl -o install.sh https://raw.githubusercontent.com/LNSSPsd/PhoenixBuilder/libre/install.sh && bash install.sh && rm install.sh`;

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
