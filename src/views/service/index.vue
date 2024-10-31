<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">获取服务</div>
      </template>
      <div>
        <p>
          通过授权代理商购买指定商品来赞助我们的服务, 同时您会获得相应的兑换码作为回报
        </p>
        <p style="display: inline-block; margin-top: 16px">
          如果您在使用过程中遇到问题, 可以向您的代理商寻求帮助
        </p>
        <el-divider border-style="dashed"/>
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray"
          >您应该可以在 FastBuilder 授权代理商处找到这些商品</span
        >
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">使用服务</div>
      </template>
      <div>
        <span>您可能需要在启动程序时添加额外参数来切换验证服务器: </span>
        <Precode :code="fbCmd" :type="'bash'"></Precode>
        <Precode :code="neoCmd" :type="'bash'"></Precode>
        <span>如果您使用的程序支持选择验证服务器, 请选择类似选项: </span>
        <Precode :code="neoSelection" :type="'bash'"></Precode>
        <span>如果您需要切换 fastbuilder 账号, 请参考以下命令: </span>
        <Precode :code="clearTokenCmd1" :type="'bash'"></Precode>
        <Precode :code="clearTokenCmd2" :type="'bash'"></Precode>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
let fbCmd = `# 启动通过安装脚本下载的 fastbuilder 并指定验证服务器\nfastbuilder -A https://liliya233.uk`;

let neoCmd = `# 启动当前目录下的程序并指定验证服务器, 例如 neOmega 启动器 \n./windows-amd64.exe -A https://liliya233.uk`;

let neoSelection = `咕咕酱验证服务器`;

let clearTokenCmd1 = `# 添加 -T 参数指定要使用的 fbtoken (推荐使用这种方式)\nfastbuilder -A https://liliya233.uk -T [您的 fbtoken]`;

let clearTokenCmd2 = `# 删除 fastbuilder 默认保存目录下的 fbtoken 文件 \nrm ~/.config/fastbuilder/fbtoken`;
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
