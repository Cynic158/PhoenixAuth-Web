import pinia from "@/store";
import useUserStore from "@/store/modules/user";
let userStore = useUserStore(pinia);
export const hasBtn = (app: any) => {
  app.directive("has", {
    mounted(el: any, options: any) {
      // options.value的值即v-has的值
      // 判断权限按钮数组是否有对应按钮，没有就移除掉
      // @ts-ignore
      if (!userStore.btns.includes(options.value)) {
        el.parentNode.removeChild(el);
        // el.setAttribute("disabled", "true");
      }
    },
  });
};
