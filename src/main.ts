import { createApp } from "vue";
import App from "./App.vue";
import "element-plus/dist/index.css";
// 全局样式
import "@/styles/index.scss";
// 暗黑模式样式
import "element-plus/theme-chalk/dark/css-vars.css";
// 配置svg
import "virtual:svg-icons-register";
// 注册全局组件
import gloablComponent from "./components/index";
// 注册路由
import router from "./router";
// 注册仓库
import store from "./store";
// 注册指令
import { hasBtn } from "./directive/has";

const app = createApp(App);
app.use(gloablComponent);
app.use(store);
app.use(router);
hasBtn(app);
app.mount("#app");
// createApp(App).mount('#app')
