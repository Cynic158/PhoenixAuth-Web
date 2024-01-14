<template>
  <div class="list-iframe-div">
    <iframe
      class="list-iframe-container"
      id="listIframe"
      src="https://liliya233.uk/openapi/swagger/index.html"
      frameborder="0"
      @load="iframeLoadedFunc"
    ></iframe>
    <p v-if="!iframeLoaded" class="iframe-null">加载页面中</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useSettingStore from "@/store/modules/setting";
let settingStore = useSettingStore();

let iframeLoaded = ref(false);
let iframeLoadedFunc = () => {
  // iframe加载完成后触发的回调
  iframeLoaded.value = true;
  var myIframe = document.getElementById("listIframe");
  // @ts-ignore
  var iframeContentWindow = myIframe.contentWindow || myIframe.contentDocument;
  iframeContentWindow.addEventListener("click", () => {
    if (settingStore.mmenuFlag == true && settingStore.isCollapse == false) {
      settingStore.reqCollapse++;
    }
  });
};
</script>

<style lang="scss">
.list-iframe-div {
  width: 100%;
  height: 100%;
  position: relative;
  @supports (-webkit-touch-callout: none) {
    // 检测是否支持 -webkit-fill-available
    height: -webkit-fill-available; // 设置 Safari 专有的 height 属性
  }
}
.list-iframe-container {
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  position: absolute;
  left: -20px;
  top: -20px;
}
.iframe-null {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
