import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{  // 根目录
  path: '/',
  redirect: '/login',
  hidden: true,
}, {
  path: '/test',
  name: 'testPage',
  hidden: true,
  component: () => import("@/components/TestPage")
}, {  // 登录界面
  path: '/login',
  name: 'loginPage',
  hidden: true,
  component: () => import("@/components/LoginPage")
}, {  // 404 页面
  path: '/:pathMarch(.*)',
  name: 'notFound',
  hidden: true,
  component: () => import("@/components/NotFound")
}, ];

const router = new Router({
  routes,
  mode: 'history',
});

export default router;
