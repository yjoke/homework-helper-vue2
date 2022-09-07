import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false


let vue = new Vue({
  render: h => h(App),
});
vue.$mount('#app')
