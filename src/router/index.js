import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{  // 根目录
  path: '/',
  redirect: '/login',
}, {
  path: '/test',
  name: 'testPage',
  component: () => import("@/components/TestPage")
}, {  // 登录界面
  path: '/login',
  name: 'loginPage',
  component: () => import("@/components/LoginPage")
}, {  // 登录进去的页面, 显示课程
  path: '/user-home',
  name: 'userHomePage',
  redirect: '/user-home/course',
  component: () => import("@/components/UserHomePage"),
  children: [{
    path: '/user-home/course',
    name: 'coursePage',
    viewName: "课程信息",
    iconClass: 'fa fa-list',
    component: () => import("@/components/user/CourseInfo")
  }, {
    path: '/user-home/info',
    name: 'infoPage',
    viewName: "个人信息",
    iconClass: 'fa fa-list',
    component: () => import("@/components/user/UserInfo")
  }]
}, {
  path: '/course-home',
  name: 'courseHomePage',
  redirect: '/course-home/homework',
  component: () => import("@/components/CourseHomePage"),
  children: [{
    path: '/course-home/homework',
    name: 'homework',
    viewName: '作业',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/HomeworkInfo")
  }, {
    path: '/course-home/material',
    name: 'material',
    viewName: '资料',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/MaterialInfo")
  }]
}, {  // 404 页面
  path: '/:pathMarch(.*)',
  name: 'notFound',
  component: () => import("@/components/NotFound")
}];

const router = new Router({
  routes,
  mode: 'history',
});

export default router;
