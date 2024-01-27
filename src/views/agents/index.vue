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
          如果您在使用过程中遇到任何问题, 可以向您的代理商寻求帮助
        </p>
        <el-divider />
        <p>
          您可以在下方快速获得所有可用的授权代理商在线网站信息 (以随机顺序显示): 
        </p>
      </div>
    </el-card>
    <el-card
      v-for="item in agentList"
      shadow="hover"
      class="notice-container"
      style="margin-top: 12px;"
    >
      <template #header>
        <div class="card-header">{{ item.Name }}</div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray"
          >{{ item.Description }}</span
        >
      </div>
      <el-divider />
      <a :href="item.Url" target="_blank">
        <el-button type="primary" >
          <el-icon><Link /></el-icon>
        </el-button>
      </a>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface agentObj {
  Name: string;
  Description: string;
  Url: string;
}
let agentList = ref<agentObj[]>([
  {
    Name: "云裳商场",
    Description: "云裳官方一站式在线商城，提供云裳面板，云端导入，咕咕验证服务等诸多服务",
    Url: "https://store.ysmcc.cn/",
  },
  {
    Name: "逍遥小站",
    Description: "品谷为fastbuilder用户提供安全舒适的购买环境。",
    Url: "https://store.xiaoyaofe.cn/",
  },
  {
    Name: "秋月小栈",
    Description: "您可以在这里购买导入软件，用于导入你的服务器，也可以购买文件包等等",
    Url: "http://hz2333.top/",
  },
]);
// 随机排序
agentList.value = agentList.value.slice().sort(() => Math.random() - 0.5);
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
