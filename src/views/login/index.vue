<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0" :sm="4" :md="8" :lg="12" style="height: 100vh">
      </el-col>
      <el-col
        :span="12"
        :xs="24"
        :sm="20"
        :md="16"
        :lg="12"
        style="height: 100vh; position: relative"
      >
        <el-popover
          :width="326"
          :visible="robotVisible && currentForm !== 'login'"
        >
          <template #reference>
            <div class="login-form">
              <h1>Welcome</h1>
              <el-form
                :model="forgetData"
                :rules="forgetRules"
                ref="forgetform"
                class="login-page login-forgetpage"
              >
                <h2>通过验证您绑定的邮箱来重置密码 (*人机验证)</h2>
                <div class="input-container">
                  <el-form-item prop="username">
                    <el-input
                      v-model="forgetData.username"
                      prefix-icon="User"
                      placeholder="请输入用户名"
                    />
                  </el-form-item>
                  <el-form-item prop="email_verify_code">
                    <el-row class="row-bg" justify="center" style="width: 100%;">
                      <el-col :span="16"  style="padding-right: 10px;">
                        <el-input
                          v-model="forgetData.email_verify_code"
                          prefix-icon="Lock"
                          placeholder="请输入邮箱验证码"
                        />
                      </el-col>
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          style="width: 100%"
                          :disabled="codeTimes > 0"
                          :loading="loadingflag || captchaExecutingFlag"
                          @click="requestEmailVerifyCode"
                        >
                          {{ codeTimes > 0 ? `重新发送(${codeTimes}s)` : "发送验证码" }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="forgetData.password"
                      type="password"
                      placeholder="请输入新密码"
                      show-password
                      prefix-icon="Lock"
                    />
                  </el-form-item>
                  <el-form-item prop="repassword">
                    <el-input
                      v-model="forgetData.repassword"
                      type="password"
                      placeholder="请确认新密码"
                      show-password
                      prefix-icon="Lock"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      class="login-btn"
                      @click="requestResetPassword"
                      :loading="loadingflag"
                      >提交</el-button
                    >
                  </el-form-item>
                  <el-form-item>
                    <el-row class="row-bg" justify="center" style="width: 100%;">
                      <el-col :span="16"></el-col>
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          class="login-reg"
                          @click="switchpage('login')"
                          >返回登录
                          <el-icon><ArrowRight /></el-icon>
                          </el-button
                        >
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-form>

              <el-form
                :model="loginData"
                :rules="loginRules"
                ref="loginform"
                class="login-page login-loginpage"
              >
                <h2>验证您的账号密码以登录到用户中心</h2>
                <div class="input-container">
                  <el-form-item prop="username">
                    <el-input
                      v-model="loginData.username"
                      prefix-icon="User"
                      placeholder="请输入用户名"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="loginData.password"
                      type="password"
                      placeholder="请输入密码"
                      show-password
                      prefix-icon="Lock"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      class="login-btn"
                      @click="login"
                      :loading="loadingflag"
                      >登录</el-button
                    >
                  </el-form-item>
                  <el-form-item>
                    <el-row class="row-bg" justify="center" style="width: 100%;">
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          class="login-reg"
                          @click="switchpage('forget')"
                          ><el-icon><ArrowLeft /></el-icon>
                          忘记密码
                          </el-button
                        >
                      </el-col>
                      <el-col :span="8"></el-col>
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          class="login-reg"
                          @click="switchpage('reg')"
                          >注册账号
                          <el-icon><ArrowRight /></el-icon>
                          </el-button
                        >
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-form>
              <el-form
                :model="regData"
                :rules="regRules"
                ref="regform"
                class="login-page login-regpage"
              >
                <h2>创建一个新的账号来使用我们的服务 (*人机验证)</h2>
                <div class="input-container">
                  <el-form-item prop="username">
                    <el-input
                      v-model="regData.username"
                      prefix-icon="User"
                      placeholder="请输入用户名"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="regData.password"
                      type="password"
                      placeholder="请输入密码"
                      show-password
                      prefix-icon="Lock"
                    />
                  </el-form-item>
                  <el-form-item prop="repassword">
                    <el-input
                      v-model="regData.repassword"
                      type="password"
                      placeholder="请确认密码"
                      show-password
                      prefix-icon="Lock"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      class="login-btn"
                      @click="register"
                      :loading="loadingflag || captchaExecutingFlag"
                      >注册</el-button
                    >
                  </el-form-item>
                  <el-form-item>
                    <el-row class="row-bg" justify="center" style="width: 100%;">
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          class="login-reg"
                          @click="switchpage('login')"
                          ><el-icon><ArrowLeft /></el-icon>
                          返回登录
                          </el-button
                        >
                      </el-col>
                      <el-col :span="16"></el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </template>
          <div class="cf-turnstile"
            data-sitekey="0x4AAAAAAAQhC3f_WRwvJ19O"
            data-callback="onRobotSuccess"
            data-error-callback="onRobotError"
            data-expired-callback="onRobotError"
            data-before-interactive-callback="onRobotBeforeInteractive"
            data-after-interactive-callback="onRobotAfterInteractive"
            data-size="normal"
            :data-theme="exportedLocalStorage.getItem('DARKMODE') === 'true' ? 'dark' : 'light'">
          </div>
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 使用路由
import { useRouter } from "vue-router";
// element的消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
// 获取时间字符串函数
import { getTimeStr } from "@/utils/index";
// 导入暗黑模式背景图
//import darkimg from "../../assets/images/bg_dark.webp";

// 使用user仓库
let userStore = useUserStore();
// 使用路由
let $router = useRouter();
// 人机验证显示
const robotVisible = ref(false)
// 导出本地仓库给HTML使用
let exportedLocalStorage = localStorage

// @ts-ignore
let validateUserName = (rule: any, value: any, callback: any) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(value)) {
    callback(new Error("用户名只能是大小英文以及数字"));
  } else {
    callback();
  }
};
// @ts-ignore
let validateRegRePassword = (rule: any, value: any, callback: any) => {
  if (value !== regData.password) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};
// @ts-ignore
let validateForgetRePassword = (rule: any, value: any, callback: any) => {
  if (value !== forgetData.password) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};
// 表单校验规则
const forgetRules ={
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  email_verify_code: [
    { required: true, message: "请输入邮箱验证码", trigger: "blur" },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur",
    },
  ],
  repassword: [
    {
      required: true,
      message: "请确认新密码",
      trigger: "blur",
    },
    { validator: validateForgetRePassword, trigger: "blur" },
  ],
};
const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
};
const regRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
  repassword: [
    {
      required: true,
      message: "请确认密码",
      trigger: "blur",
    },
    { validator: validateRegRePassword, trigger: "blur" },
  ],
};


//登录部分
// 表单元素
let loginform = ref(null);
let regform = ref(null);
let forgetform = ref(null);
// 当前表单
let currentForm = ref("login");
// 表单数据
let loginData = reactive({
  username: "",
  password: "",
});
let regData = reactive({
  username: "",
  password: "",
  repassword: "",
});
let forgetData = reactive({
  username: "",
  email_verify_code: "",
  password: "",
  repassword: "",
});
// 清空表单
let clearForm = () => {
  regData.username = "";
  regData.password = "";
  regData.repassword = "";
  loginData.username = "";
  loginData.password = "";
  forgetData.username = "";
  forgetData.email_verify_code = "";
  forgetData.password = "";
  forgetData.repassword = "";
};
// 切换注册
let switchpage = (type: "login" | "reg" | "forget") => {
  currentForm.value = type;
  // 清空校验提示
  if (loginform.value) {
    // @ts-ignore
    loginform.value.clearValidate(["username", "password"]);
  }
  if (regform.value) {
    // @ts-ignore
    regform.value.clearValidate(["username", "password", "repassword"]);
  }
  if (forgetform.value) {
    // @ts-ignore
    forgetform.value.clearValidate(["username", "email_verify_code", "password", "repassword"]);
  }
  // 清空表单内容
  clearForm();
  // 切换页面
  switch(type){
    case "reg":
      // @ts-ignore
      document.querySelector(".login-form").style.height = "394px";
      // @ts-ignore
      document.querySelector(".login-forgetpage").style.left = "-200%";
      // @ts-ignore
      document.querySelector(".login-loginpage").style.left = "-100%";
      // @ts-ignore
      document.querySelector(".login-regpage").style.left = "32px";
      break;
    case "login":
      // @ts-ignore
      document.querySelector(".login-form").style.height = "344px";
      // @ts-ignore
      document.querySelector(".login-forgetpage").style.left = "-100%";
      // @ts-ignore
      document.querySelector(".login-loginpage").style.left = "32px";
      // @ts-ignore
      document.querySelector(".login-regpage").style.left = "100%";
      break;
    case "forget":
      // @ts-ignore
      document.querySelector(".login-form").style.height = "444px";
      // @ts-ignore
      document.querySelector(".login-forgetpage").style.left = "32px";
      // @ts-ignore
      document.querySelector(".login-loginpage").style.left = "100%";
      // @ts-ignore
      document.querySelector(".login-regpage").style.left = "200%";
      break;
  }
};
// 登录按钮加载状态
let loadingflag = ref(false);
let captchaExecutingFlag = ref(true);

// 刷新验证码
let refreshCaptcha = () => {
  captchaExecutingFlag.value = true;
  // @ts-ignore
  turnstile.reset();
  // @ts-ignore
  turnstile.execute();
};

// 人机验证交互前回调
var onRobotBeforeInteractive = async () => {
  robotVisible.value = true
}

// 人机验证交互后回调
var onRobotAfterInteractive = async () => {
  robotVisible.value = false
}

// 人机验证成功回调
var onRobotSuccess = async () => {
  captchaExecutingFlag.value = false
};

// 人机验证错误回调
var onRobotError = async () => {
  refreshCaptcha()
};

let codeTimes = ref(0)
// 请求邮箱验证码
let requestEmailVerifyCode = async () => {
  // 尝试获取验证码
  // @ts-ignore
  let captchaToken = turnstile.getResponse();
  if (!captchaToken) {
    // 消息提示
    ElNotification({
      type: "error",
      title: "发送失败",
      message: "人机验证未通过",
      duration: 3000,
    });
    // 重置人机验证
    refreshCaptcha()
    return;
  }
  // 校验表单
  if (!forgetData.username) {
    // 消息提示
    ElNotification({
      type: "error",
      title: "发送失败",
      message: "请先输入用户名",
      duration: 3000,
    });
  }
  loadingflag.value = true
  try{
    // 发起请求前获取token
    let tokenResult = await reqNewTokenFunc();
    // @ts-ignore
    if (!tokenResult.success) {
      loadingflag.value = false;
      return;
    }
    // 发起请求
    let result = await userStore.userRequestEmailVerifyCode({
      username: forgetData.username,
      action_type: 3,
      captcha_token: captchaToken,
    });
    // @ts-ignore
    if (result.success) {
      // 消息提示
      ElNotification({
        type: "success",
        title: "发送成功",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 开始倒计时
      codeTimes.value = 60
      let timer = setInterval(() => {
        codeTimes.value--;
        if (codeTimes.value < 1) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        title: "发送失败",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  }catch (error: any) {
    //console.log(error);
  }finally{
    // 重置人机验证
    refreshCaptcha()
    loadingflag.value = false
  }
};

// 请求重置密码
let requestResetPassword = async () => {
  // 校验表单
  try {
    // @ts-ignore
    await forgetform.value.validate();
  }catch (error: any) {
    return
  }
  // 显示加载
  loadingflag.value = true;
  try {
    // 发起请求前获取token
    let tokenResult = await reqNewTokenFunc();
    // @ts-ignore
    if (!tokenResult.success) {
      loadingflag.value = false;
      return;
    }
    // 发起请求
    let result = await userStore.userResetPassword({
      username: forgetData.username,
      email_verify_code: forgetData.email_verify_code,
      new_password: forgetData.password,
    });
    // @ts-ignore
    if (result.success) {
      // 消息提示
      ElNotification({
        type: "success",
        title: "重置成功",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 重置成功，返回登录
      switchpage("login");
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        title: "重置失败",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  }catch (error: any) {
    //console.log(error);
  }finally{
    loadingflag.value = false;
  }
};

// 登录事件, 登录不需要人机验证
let login = async () => {
  // 校验表单
  try {
    // @ts-ignore
    await loginform.value.validate();
  }catch (error: any) {
    return
  }
  // 直接请求登录
  // 显示加载
  loadingflag.value = true;
  // 已通过人机验证，进行登录
  let loginInfo = {
    username: loginData.username,
    password: loginData.password,
    captcha_token: "",
  }
  try {
    // 发起请求前获取token
    let tokenResult = await reqNewTokenFunc();
    // @ts-ignore
    if (!tokenResult.success) {
      loadingflag.value = false;
      return;
    }
    // 仓库发起登录请求
    let result = await userStore.userRegLog(loginInfo, "login");
    // @ts-ignore
    if (result.success) {
      // 获取当前时段字符串
      let timestr: string = getTimeStr();
      // 消息提示
      ElNotification({
        type: "success",
        title: timestr,
        message: "登录成功, 即将跳转至主页",
        duration: 3000,
      });
      // 请求成功，进入首页，且无需解锁登录按钮
      $router.push("/");
      return
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        title: "登录失败",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  }catch (error: any) {
    //console.log(error);
  }
  // 未请求成功，关闭加载
  loadingflag.value = false;
};

let register = async () => {
  // 尝试获取验证码
  // @ts-ignore
  let captchaToken = turnstile.getResponse();
  if (!captchaToken) {
    // 消息提示
    ElNotification({
      type: "error",
      title: "注册失败",
      message: "人机验证未通过",
      duration: 3000,
    });
    // 重置人机验证
    refreshCaptcha()
    return;
  }
  // 校验表单
  try {
    // @ts-ignore
    await regform.value.validate();
  }catch (error: any) {
    return
  }
  // 显示加载
  loadingflag.value = true;
  // 已通过人机验证，进行注册
  let regInfo = {
    username: regData.username,
    password: regData.password,
    captcha_token: captchaToken,
  };
  try {
    // 发起请求前获取token
    let tokenResult = await reqNewTokenFunc();
    // @ts-ignore
    if (!tokenResult.success) {
      return;
    }
    // 仓库发起注册请求
    let result = await userStore.userRegLog(regInfo, "reg");
    // @ts-ignore
    if (result.success) {
      // 消息提示
      ElNotification({
        type: "success",
        title: "注册成功",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
      // 注册成功，返回登录
      switchpage("login");
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        title: "注册失败",
        // @ts-ignore
        message: result.message,
        duration: 3000,
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 重置人机验证
    refreshCaptcha()
    // 请求完成，关闭加载
    loadingflag.value = false;
  }
};

// 获取token
let reqNewTokenFunc = async () => {
  // 如果存在token则直接使用
  if (!userStore.token) {
    try {
      await userStore.getToken();
    } catch (error) {
      // 请求失败，消息提示
      ElNotification({
        type: "error",
        title: "错误",
        message: "无法连接到服务器, 请检查网络连接",
        duration: 3000,
      });
      return Promise.reject(error);
    }
  }
  return Promise.resolve({ success: true });
};

onMounted(() => {
  // @ts-ignore
  window.onRobotBeforeInteractive = onRobotBeforeInteractive;
  // @ts-ignore
  window.onRobotAfterInteractive = onRobotAfterInteractive;
  // @ts-ignore
  window.onRobotSuccess = onRobotSuccess;
  // @ts-ignore
  window.onRobotError = onRobotError;
  // @ts-ignore
  turnstile.render('.cf-turnstile');

  // 清空校验提示，防止登出时回到登录页还有校验提示
  // @ts-ignore
  loginform.value.clearValidate(["username", "password"]);
  // @ts-ignore
  regform.value.clearValidate(["username", "password", "repassword"]);
  // @ts-ignore
  forgetform.value.clearValidate(["username", "email_verify_code", "password", "repassword"]);
});
// 销毁全局变量
onUnmounted(() => {
  // @ts-ignore
  turnstile.remove();
  // @ts-ignore
  window.onRobotBeforeInteractive = null;
  // @ts-ignore
  window.onRobotAfterInteractive = null;
  // @ts-ignore
  window.onRobotSuccess = null;
  // @ts-ignore
  window.onRobotError = null;
});
onMounted(() => {
  let darkbg = localStorage.getItem("DARKMODE") === "true";
  if (darkbg) {
      const element = document.querySelector(".login-container");
      if (element) {
        // @ts-ignore
        element.style.backgroundImage = `url("https://img.picgo.net/2024/01/24/bg_dark76c3ac9b1eee892b.webp")`;
        // 转为黑夜模式
        document.documentElement.className = "dark";
      }
  }
});
</script>

<style scoped lang="scss">
@media (max-width: 768px) {
  .login-container {
    // background-image: url("../../assets/images/bg_m.webp") !important;
    background-image: url("https://img.picgo.net/2024/01/24/bg_m747b3a845541b9e0.webp") !important;
  }
  .login-form {
    width: 100% !important;
    border-radius: 0 !important;
    padding: 20px 16px !important;
    h1 {
      font-size: 30px !important;
    }
    h2 {
      font-size: 16px !important;
    }
    .input-container {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
  }
}
:deep(.el-input__wrapper) {
  background-color: var(--el-mask-color-extra-light) !important;
  --el-input-placeholder-color: var(--el-text-color-primary) !important;
  // color: black !important;
  // border-color: white !important;
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: #000000 !important;
}
// :deep(.el-input__inner) {
//   background-color: transparent !important;
// }
// :deep(.el-input) {
//   border-color: white !important;
// }
.tip {
  font-size: 16px;
  float: right;
  margin-top: 10px;
  margin-right: 10px;
}
.login-container {
  width: 100%;
  height: 100vh;
  // background-image: url("../../assets/images/bg.webp");
  background-image: url("https://img.picgo.net/2024/01/24/bge445a85cdac49114.webp");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  .login-form {
    width: 80%;
    //height: 294px;
    height: 344px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s;
    border-radius: 10px;
    background-color: $login-form-bgcolor;
    padding: 20px 32px;
    backdrop-filter: blur(5px);
    box-shadow: $login-form-shadow;
    overflow: hidden;
    white-space: nowrap;
    .login-page {
      transition: all 0.3s;
      width: calc(100% - 64px);
      display: inline-block;
      position: absolute;
      top: 85px;
    }
    .login-page.login-forgetpage {
      left: -100%;
    }
    .login-page.login-loginpage {
      left: 32px;
    }
    .login-page.login-regpage {
      left: 100%;
    }
    h1 {
      color: $color-blue;
      font-size: 40px;
      margin-bottom: 12px;
      user-select: none;
    }
    h2 {
      color: $login-form-h2;
      font-size: 16px;
      margin-bottom: 12px;
      display: inline-block;
      user-select: none;
    }
    .input-container {
      width: 100%;
      padding-left: 40px;
      padding-right: 40px;
    }
    .login-reg {
      width: 100% !important;
    }
    .login-btn {
      width: 100%;
      background-color: $login-form-btn;
      border: 0;
      transition: all 0.3s;
      &:hover {
        background-color: $login-form-btn-hover;
      }
      &:focus {
        background-color: $login-form-btn-hover;
      }
      &:active {
        background-color: $login-form-btn-active;
      }
    }
  }
}
</style>
