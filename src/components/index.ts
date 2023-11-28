// 循环注册全局组件
// 导入svg组件
import SvgIcon from "./SvgIcon/index.vue";
// 导入element所有icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import type { App, Component } from "vue";
const components: { [name: string]: Component } = { SvgIcon };
export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key]);
    });
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
