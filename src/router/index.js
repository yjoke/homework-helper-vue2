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
}, {  // 加入的课程
  path: '/added-course',
  name: 'addedCoursePage',
  redirect: '/added-course/homework',
  component: () => import("@/components/AddedCoursePage"),
  children: [{
    path: '/added-course/homework',
    name: 'homework-student',
    viewName: '作业',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/added/HomeworkInfo")
  }, {
    path: '/added-course/material',
    name: 'material-student',
    viewName: '资料',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/added/MaterialInfo")
  }]
}, {  // 创建的课程
  path: '/created-course',
  name: 'createdCoursePage',
  redirect: '/created-course/homework',
  component: () => import("@/components/CreatedCoursePage"),
  children: [{
    path: '/created-course/homework',
    name: 'homeworkTeacher',
    viewName: '作业',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/created/HomeworkInfo")
  }, {
    path: '/created-course/material',
    name: 'materialTeacher',
    viewName: '资料',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/created/MaterialInfo")
  }, {
    path: '/created-course/student',
    name: 'student',
    viewName: '学生',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/created/StudentInfo")
  }, {
    path: '/created-course/course',
    name: 'course',
    viewName: '信息',
    iconClass: 'fa fa-list',
    component: () => import("@/components/course/created/CourseInfo")
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
