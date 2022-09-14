import axios from 'axios'
import {MessageBox} from "element-ui"

// 每次请求都是这样
const service = axios.create({
  // 请求地址的公共前缀
  baseURL: "http://localhost:8080",
  timeout: 1000 * 120,
  headers: {
    'Content-type': 'application/json;charset=utf-8'
  },
});

// 请求拦截器
service.interceptors.request.use(function(config) {
  let token = localStorage.getItem('Authorization');
  if (token) config.headers['Authorization'] = token;
  // 在发送前干什么
  return config;
}, function(error) {
  // 对请求错误做什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 对响应数据做什么
  if (response.data.code === 0 && response.data.msg === 'notLogin') {
    MessageBox.alert("请先登录", "登录失效", {
      confirmButtonText: "跳转登录页面",
      callback: () => {
        window.location.href = "/"
      }
    }).then();
    window.location.href = "/";
  } else {
    return response.data;
  }
}, function(error) {
  // 对响应错误做什么
  return Promise.reject(error);
});

export default service;
