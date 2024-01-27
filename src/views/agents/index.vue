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
        <el-divider />
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
        <span>您可能需要在启动程序时添加额外参数来切换验证服务器</span>
        <Precode :code="fbCmd" :type="'bash'"></Precode>
        <Precode :code="neoCmd" :type="'bash'"></Precode>
        <span>如果您使用的程序支持选择验证服务器, 请选择类似选项: </span>
        <Precode :code="neoSelection" :type="'bash'"></Precode>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
let fbCmd = `./phoenixbuilder -A https://liliya233.uk`;

let neoCmd = `./windows-amd64.exe -A https://liliya233.uk`;

let neoSelection = `咕咕酱验证服务器`;
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
