import Vue from 'vue'
import App from './App.vue'

import router from './router/index.js'
import axios from 'axios'
import service from "@/service";

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI);
Vue.config.productionTip = false

Vue.prototype.axios = axios
Vue.prototype.service = service

new Vue({
  el: "#app",
  router,
  render: h => h(App),
});
