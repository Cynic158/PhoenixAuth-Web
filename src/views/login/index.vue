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
        <button
          class="g-recaptcha"
          data-sitekey="6LdATh8pAAAAAI8oKdlrCK9nt1FG1MTdSuE2ZhI5"
          data-callback="robotCallback"
          data-expired-callback="robotExpiredCallback"
          data-error-callback="robotErrorCallback"
          hidden
        >
          click
        </button>
        <div class="login-form">
          <h1>Welcome</h1>
          <el-form
            :model="loginData"
            :rules="rules"
            ref="loginform"
            class="login-page login-loginpage"
          >
            <h2>验证您的账号密码以登录到用户中心</h2>
            <div class="input-container">
              <el-form-item prop="username">
                <el-input
                  class="up-input"
                  v-model="loginData.username"
                  prefix-icon="User"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  class="down-input"
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
                <el-button
                  type="primary"
                  class="login-reg"
                  @click="switchpage('reg')"
                  >注册</el-button
                >
              </el-form-item>
            </div>
          </el-form>
          <el-form
            :model="regData"
            :rules="regrules"
            ref="regform"
            class="login-page login-regpage"
          >
            <h2>创建一个新的账户来使用我们的服务</h2>
            <div class="input-container">
              <el-form-item prop="username">
                <el-input
                  class="top-input"
                  v-model="regData.username"
                  prefix-icon="User"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  class="center-input"
                  v-model="regData.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  prefix-icon="Lock"
                />
              </el-form-item>
              <el-form-item prop="repassword">
                <el-input
                  class="bottom-input"
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
                  :loading="regloadingflag"
                  >注册</el-button
                >
                <el-button
                  type="primary"
                  class="login-reg"
                  @click="switchpage('login')"
                  >登录</el-button
                >
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, onActivated } from "vue";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 使用路由
import { useRouter } from "vue-router";
// element的消息通知组件
// @ts-ignore
import { ElNotification } from "element-plus";
// 获取时间字符串函数
import { getTimeStr } from "@/utils/index";
import bgdark from "../../assets/images/bg_dark.png";

// 使用user仓库
let userStore = useUserStore();
// 使用路由
let $router = useRouter();

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
let validateRePassword = (rule: any, value: any, callback: any) => {
  if (value !== regData.password) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};

// 表单校验规则
const rules = {
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
const regrules = {
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
    { validator: validateRePassword, trigger: "blur" },
  ],
};

//登录部分
// 表单元素
let loginform = ref(null);
let regform = ref(null);
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
// 清空表单
let clearForm = () => {
  regData.username = "";
  regData.password = "";
  regData.repassword = "";
  loginData.username = "";
  loginData.password = "";
};
// 切换注册
let switchpage = (type: "login" | "reg") => {
  if (type == "reg") {
    currentForm.value = "reg";
    // 清空校验提示
    if (loginform.value) {
      // @ts-ignore
      loginform.value.clearValidate(["username", "password"]);
    }
    if (regform.value) {
      // @ts-ignore
      regform.value.clearValidate(["username", "password", "repassword"]);
    }

    // @ts-ignore
    document.querySelector(".login-form").style.height = "344px";
    // @ts-ignore
    document.querySelector(".login-loginpage").style.left = "-100%";
    // @ts-ignore
    document.querySelector(".login-regpage").style.left = "32px";

    // 清空表单内容
    clearForm();
  } else if (type == "login") {
    currentForm.value = "login";
    // 清空校验提示
    if (loginform.value) {
      // @ts-ignore
      loginform.value.clearValidate(["username", "password"]);
    }
    if (regform.value) {
      // @ts-ignore
      regform.value.clearValidate(["username", "password", "repassword"]);
    }

    // @ts-ignore
    document.querySelector(".login-form").style.height = "294px";
    // @ts-ignore
    document.querySelector(".login-loginpage").style.left = "32px";
    // @ts-ignore
    document.querySelector(".login-regpage").style.left = "100%";

    // 清空表单内容
    clearForm();
  }
};
// 登录按钮加载状态
let loadingflag = ref(false);
let regloadingflag = ref(false);
// 人机验证成功回调
var robotCallback = async (args: any) => {
  // console.log(args);
  // console.log("验证成功");
  // 存储人机token
  userStore.robotToken = args;
  // 判断当前是注册还是登录
  if (currentForm.value == "login") {
    // 进行登录
    if (userStore.robotToken) {
      try {
        // 显示加载
        loadingflag.value = true;
        // 已通过人机验证，进行登录
        let loginInfo = {
          username: "",
          password: "",
          captcha_token: userStore.robotToken,
        };
        loginInfo.username = loginData.username;
        loginInfo.password = loginData.password;
        // 仓库发起登录请求
        let result = await userStore.userRegLog(loginInfo, currentForm.value);
        // @ts-ignore
        if (result.success) {
          // 获取当前时段字符串
          let timestr: string = getTimeStr();
          // 消息提示
          ElNotification({
            type: "success",
            title: timestr,
            message: "登录成功",
            duration: 3000,
          });
          // 请求成功，进入首页
          $router.push("/");
        } else {
          // 请求失败，消息提示
          ElNotification({
            type: "error",
            // @ts-ignore
            message: result.message,
            duration: 3000,
          });
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        // 请求完成，关闭加载
        loadingflag.value = false;
      }
    }
  } else if (currentForm.value == "reg") {
    // 进行注册
    if (userStore.robotToken) {
      try {
        // 显示加载
        regloadingflag.value = true;
        // 已通过人机验证，进行注册
        let regInfo = {
          username: "",
          password: "",
          captcha_token: userStore.robotToken,
        };
        regInfo.username = regData.username;
        regInfo.password = regData.password;
        // 仓库发起注册请求
        let result = await userStore.userRegLog(regInfo, currentForm.value);
        // @ts-ignore
        if (result.success) {
          // 注册成功，返回登录
          switchpage("login");
          // 消息提示
          ElNotification({
            type: "success",
            message: "注册成功",
            duration: 3000,
          });
        } else {
          // 请求失败，消息提示
          ElNotification({
            type: "error",
            // @ts-ignore
            message: result.message,
            duration: 3000,
          });
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        // 请求完成，关闭加载
        regloadingflag.value = false;
      }
    }
  }
};
// 人机验证过期回调
var robotExpiredCallback = () => {
  console.log("验证过期");
  userStore.robotToken = "";
};
// 人机验证失败回调
var robotErrorCallback = () => {
  console.log("验证失败");
  userStore.robotToken = "";
};
// 人机验证过期回调
// 登录事件
let login = async () => {
  // 校验表单
  if (loginform.value) {
    // @ts-ignore
    await loginform.value.validate();
  }
  // 直接请求登录
  // 显示加载
  loadingflag.value = true;
  // 已通过人机验证，进行登录
  let loginInfo = {
    username: "",
    password: "",
    captcha_token: "",
  };
  loginInfo.username = loginData.username;
  loginInfo.password = loginData.password;
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
      message: "登录成功",
      duration: 3000,
    });
    // 请求成功，进入首页
    $router.push("/");
  } else {
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      // @ts-ignore
      message: result.message,
      duration: 3000,
    });
  }
  // 请求完成，关闭加载
  regloadingflag.value = false;
};
let register = async () => {
  // 校验表单
  if (regform.value) {
    // @ts-ignore
    await regform.value.validate();
  }

  userStore.robotToken = "";
  // @ts-ignore
  grecaptcha.reset();
  // @ts-ignore
  document.querySelector(".g-recaptcha").click();
};

// 获取token
let reqNewTokenFunc = async () => {
  try {
    await userStore.getToken();
  } catch (error) {
    // 请求失败，消息提示
    ElNotification({
      type: "error",
      message: "获取token失败",
      duration: 3000,
    });
  }
};

onMounted(() => {
  // 添加人机验证
  const script = document.createElement("script");
  script.src = "https://recaptcha.net/recaptcha/api.js";
  script.async = true;
  document.head.appendChild(script);

  // @ts-ignore
  window.robotCallback = robotCallback;
  // @ts-ignore
  window.robotExpiredCallback = robotExpiredCallback;
  // @ts-ignore
  window.robotErrorCallback = robotErrorCallback;

  // 登录表单输入键盘快捷键代码块
  // 用户名输入框
  // @ts-ignore
  let upInput = document.querySelector(".up-input").children[0].children[1];
  // 密码输入框
  // @ts-ignore
  let downInput = document.querySelector(".down-input").children[0].children[1];
  // 注册表单用户名输入框
  // @ts-ignore
  let topInput = document.querySelector(".top-input").children[0].children[1];
  // 注册表单密码输入框
  let centerInput =
    // @ts-ignore
    document.querySelector(".center-input").children[0].children[1];
  // 注册表单确认密码输入框
  let bottomInput =
    // @ts-ignore
    document.querySelector(".bottom-input").children[0].children[1];

  // 判断用户名输入框是否聚焦flag
  let upFocus = false;
  // 判断密码输入框是否聚焦flag
  let downFocus = false;
  // 判断注册表单用户名输入框是否聚焦flag
  let topFocus = false;
  // 判断注册表单密码输入框是否聚焦flag
  let centerFocus = false;
  // 判断注册表单确认密码输入框是否聚焦flag
  let bottomFocus = false;

  // 判断用户名输入框是否聚焦
  upInput.addEventListener("focus", () => {
    upFocus = true;
  });
  // 判断用户名输入框是否失去聚焦
  upInput.addEventListener("blur", () => {
    upFocus = false;
  });
  // 判断密码输入框是否聚焦
  downInput.addEventListener("focus", () => {
    downFocus = true;
  });
  // 判断密码输入框是否失去聚焦
  downInput.addEventListener("blur", () => {
    downFocus = false;
  });
  // 判断注册表单用户名输入框是否聚焦
  topInput.addEventListener("focus", () => {
    topFocus = true;
  });
  // 判断注册表单用户名输入框是否失去聚焦
  topInput.addEventListener("blur", () => {
    topFocus = false;
  });
  // 判断注册表单密码输入框是否聚焦
  centerInput.addEventListener("focus", () => {
    centerFocus = true;
  });
  // 判断注册表单密码输入框是否失去聚焦
  centerInput.addEventListener("blur", () => {
    centerFocus = false;
  });
  // 判断注册表单确认密码输入框是否聚焦
  bottomInput.addEventListener("focus", () => {
    bottomFocus = true;
  });
  // 判断注册表单确认密码输入框是否失去聚焦
  bottomInput.addEventListener("blur", () => {
    bottomFocus = false;
  });

  // 监听表单并对快捷键进行回应
  // @ts-ignore
  document
    .querySelector(".login-loginpage")
    .addEventListener("keyup", function (e: any) {
      if ((e.key == "ArrowDown" || e.key == "ArrowUp") && upFocus == true) {
        // 用户名输入框按上下箭头，跳转聚焦到密码输入框
        // @ts-ignore
        downInput.focus();
      } else if (
        (e.key == "ArrowDown" || e.key == "ArrowUp") &&
        downFocus == true
      ) {
        // 密码输入框按上下箭头，跳转聚焦到用户名输入框
        // @ts-ignore
        upInput.focus();
      } else if (e.key == "Enter" && currentForm.value == "login") {
        // 回车键则点击登录
        login();
      }
    });
  // 监听注册表单并对快捷键进行回应
  // @ts-ignore
  document
    .querySelector(".login-regpage")
    .addEventListener("keyup", function (e: any) {
      if (e.key == "ArrowDown") {
        // 按下箭头的情况
        if (topFocus == true) {
          // 如果当前用户名输入框有聚焦，那就跳转到密码输入框
          // @ts-ignore
          centerInput.focus();
        } else if (centerFocus == true) {
          // 如果当前密码输入框有聚焦，那就跳转到确认密码输入框
          // @ts-ignore
          bottomInput.focus();
        } else if (bottomFocus == true) {
          // 如果当前确认密码输入框有聚焦，那就跳转到用户名输入框
          // @ts-ignore
          topInput.focus();
        }
      } else if (e.key == "ArrowUp") {
        // 按上箭头的情况
        if (topFocus == true) {
          // 如果当前用户名输入框有聚焦，那就跳转到确认密码输入框
          // @ts-ignore
          bottomInput.focus();
        } else if (centerFocus == true) {
          // 如果当前密码输入框有聚焦，那就跳转到用户名输入框
          // @ts-ignore
          topInput.focus();
        } else if (bottomFocus == true) {
          // 如果当前确认密码输入框有聚焦，那就跳转到密码输入框
          // @ts-ignore
          centerInput.focus();
        }
      } else if (e.key == "Enter" && currentForm.value == "reg") {
        // 回车键则点击注册
        register();
      }
    });

  // 自动聚焦
  // @ts-ignore
  upInput.focus();

  // 清空校验提示，防止登出时回到登录页还有校验提示
  // @ts-ignore
  loginform.value.clearValidate(["username", "password"]);
  // @ts-ignore
  regform.value.clearValidate(["username", "password", "repassword"]);

  // 进入页面即获取token
  reqNewTokenFunc();
});
// 销毁全局变量
onUnmounted(() => {
  // @ts-ignore
  window.robotCallback = null;
  // @ts-ignore
  window.robotExpiredCallback = null;
  // @ts-ignore
  window.robotErrorCallback = null;
});
onActivated(() => {
  let darkbg = localStorage.getItem("DARKMODE") === "true";
  if (darkbg) {
    let changebg = () => {
      const element = document.querySelector(".login-container");
      if (element) {
        // @ts-ignore
        element.style.backgroundImage =
          "url('../../assets/images/bg_dark.png')";
        // 转为黑夜模式
        document.documentElement.className = "dark";

        clearInterval(checkElementInterval2);
      }
    };
    // 设置定时器，每隔100毫秒检查元素是否存在
    const checkElementInterval2 = setInterval(changebg, 100);
  }
});
onMounted(() => {
  let darkbg = localStorage.getItem("DARKMODE") === "true";
  if (darkbg) {
    let changebg = () => {
      const element = document.querySelector(".login-container");
      if (element) {
        // @ts-ignore
        element.style.backgroundImage = `url(${bgdark})`;
        // 转为黑夜模式
        document.documentElement.className = "dark";

        clearInterval(checkElementInterval2);
      }
    };
    // 设置定时器，每隔100毫秒检查元素是否存在
    const checkElementInterval2 = setInterval(changebg, 100);
  }
});
</script>

<style scoped lang="scss">
@media (max-width: 768px) {
  .login-container {
    background-image: url("../../assets/images/bg_m.png") !important;
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
  background-image: url("../../assets/images/bg.png");
  // background-image: url("../../../public/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  .login-form {
    width: 80%;
    height: 294px;
    // height: 344px;
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
    }
    .login-page.login-loginpage {
      left: 32px;
      top: 85px;
    }
    .login-page.login-regpage {
      left: 100%;
      top: 85px;
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
      margin-left: 8px;
      width: 80px !important;
    }
    .login-btn {
      width: calc(100% - 88px);
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
