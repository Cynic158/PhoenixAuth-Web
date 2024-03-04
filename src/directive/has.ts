import pinia from "@/store";
import useUserStore from "@/store/modules/user";
import type { App } from "vue";
let userStore = useUserStore(pinia);
export const hasBtn = (app: App<Element>) => {
  app.directive("has", {
    mounted(el, options) {
      // options.value的值即v-has的值
      // 判断权限按钮数组是否有对应按钮，没有就移除掉
      if (!userStore.btns.includes(options.value as never)) {
        el.parentNode.removeChild(el);
        // el.setAttribute("disabled", "true");
      }
    },
  });
};
