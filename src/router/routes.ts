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
        path: "/imgfile",
        component: () => import("@/views/imgfile/index.vue"),
        name: "imgfile",
        meta: {
          title: "图片上传",
          hidden: false,
          icon: "Picture",
        },
      },
      {
        path: "/test2",
        component: () => import("@/views/test/index.vue"),
        name: "test2",
        redirect: "/test2/test21",
        meta: {
          title: "测试菜单项2",
          hidden: false,
          icon: "Tools",
        },
        children: [
          {
            path: "/test2/test21",
            component: () => import("@/views/test/index.vue"),
            name: "test21",
            meta: {
              title: "测试菜单项2-1",
              hidden: false,
              icon: "Tools",
            },
          },
          {
            path: "/test2/test22",
            component: () => import("@/views/test/index.vue"),
            name: "test22",
            meta: {
              title: "测试菜单项2-2",
              hidden: false,
              icon: "Tools",
            },
          },
          {
            path: "/test2/test23",
            component: () => import("@/views/test/index.vue"),
            name: "test23",
            meta: {
              title: "测试菜单项2-3",
              hidden: false,
              icon: "Tools",
            },
          },
        ],
      },
      {
        path: "/test3",
        component: () => import("@/views/test/index.vue"),
        name: "test3",
        meta: {
          title: "测试菜单项3",
          hidden: false,
          icon: "Tools",
        },
      },
      {
        path: "/test4",
        component: () => import("@/views/test/index.vue"),
        name: "test4",
        meta: {
          title: "测试菜单项4",
          hidden: false,
          icon: "Tools",
        },
      },
      {
        path: "/test5",
        component: () => import("@/views/test/index.vue"),
        name: "test5",
        meta: {
          title: "测试菜单项5",
          hidden: false,
          icon: "Tools",
        },
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
    path: "/permissions1",
    component: () => import("@/views/test/index.vue"),
    name: "permissions1",
    meta: {
      title: "admin权限1",
      hidden: false,
      icon: "Key",
    },
  },
  {
    path: "/permissions2",
    component: () => import("@/views/test/index.vue"),
    name: "permissions2",
    meta: {
      title: "admin权限2",
      hidden: false,
      icon: "Key",
    },
  },
  {
    path: "/permissions3",
    component: () => import("@/views/test/index.vue"),
    name: "permissions3",
    meta: {
      title: "admin权限3",
      hidden: false,
      icon: "Key",
    },
  },
  {
    path: "/permissions4",
    component: () => import("@/views/test/index.vue"),
    name: "permissions4",
    meta: {
      title: "user权限1",
      hidden: false,
      icon: "Key",
    },
  },
  {
    path: "/permissions5",
    component: () => import("@/views/test/index.vue"),
    name: "permissions5",
    meta: {
      title: "user权限2",
      hidden: false,
      icon: "Key",
    },
  },
  {
    path: "/permissions6",
    component: () => import("@/views/test/index.vue"),
    name: "permissions6",
    meta: {
      title: "user权限3",
      hidden: false,
      icon: "Key",
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
