// 通用路由
export const defaultRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login",
    meta: {
      title: "用户登录",
      hidden: true,
      icon: "Tools",
    },
  },
  {
    path: "/",
    component: () => import("@/views/layout/index.vue"),
    name: "layout",
    redirect: "/home",
    meta: {
      title: "首页",
      hidden: true,
      icon: "Tools",
    },
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        name: "home",
        meta: {
          title: "首页",
          hidden: false,
          icon: "HomeFilled",
        },
      },
      {
        path: "/usermenu",
        component: () => import("@/views/usermenu/index.vue"),
        name: "usermenu",
        meta: {
          title: "用户菜单",
          hidden: false,
          icon: "UserFilled",
        },
      },
      {
        path: "/gameaccount",
        component: () => import("@/views/test/index.vue"),
        name: "gameaccount",
        redirect: "/gameaccount/useraccount",
        meta: {
          title: "游戏账户",
          hidden: false,
          icon: "SwitchFilled",
        },
        children: [
          {
            path: "/gameaccount/useraccount",
            component: () => import("@/views/test/index.vue"),
            name: "useraccount",
            meta: {
              title: "我的账号",
              hidden: false,
              icon: "Coordinate",
            },
          },
          {
            path: "/gameaccount/robotaccount",
            component: () => import("@/views/test/index.vue"),
            name: "robotaccount",
            meta: {
              title: "Bot 账号",
              hidden: false,
              icon: "Cpu",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      title: "404",
      hidden: true,
      icon: "Tools",
    },
  },
];

// 权限路由
export const permissionRoutes = [
  {
    path: "/admin",
    component: () => import("@/views/test/index.vue"),
    name: "admin",
    meta: {
      title: "管理菜单",
      hidden: false,
      icon: "Tools",
    },
  },
];

// 通用路由2
export const defaultRoutes2 = [
  {
    path: "/download",
    component: () => import("@/views/test/index.vue"),
    name: "download",
    meta: {
      title: "下载",
      hidden: false,
      icon: "Download",
    },
  },
  {
    path: "/about",
    component: () => import("@/views/test/index.vue"),
    name: "about",
    meta: {
      title: "关于",
      hidden: false,
      icon: "InfoFilled",
    },
  },
];

// 通配路由
export const anyRoute = {
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  name: "notfound",
  meta: {
    title: "404",
    hidden: true,
    icon: "Tools",
  },
};
