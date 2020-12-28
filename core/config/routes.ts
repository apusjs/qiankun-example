export default [
  {
    path: '/login',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/full',
    component: '../layout/fullScreenLayout',
    layout: false,
    routes: [
      {
        path: '/full/process/design',
        name: '流程设计',
        component: './process/design',
      },
      {
        component: './404',
      },
    ]
  },
  {
    path: '/',
    component: '../layout/BaseLayout',
    routes: [
      {
        path: '/',
        redirect: '/welcome',
      },
      {
        path: '/welcome',
        name: 'welcome',
        component: './Welcome',
      },
      {
        path: '/user/list',
        name: '用户列表',
        component: './user/list',
      },
      {
        path: '/manager/menu',
        name: 'manager.config.menu',
        component: './manager/menu',
      },
      {
        component: './404',
      },
    ]
  },
  {
    component: './404',
  },
];
