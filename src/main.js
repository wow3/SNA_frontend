// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import MyServerHttp from "./plugins/http.js";
import 'element-ui/lib/theme-chalk/index.css' // 引入样式文件
import '../src/assets/css/base.css'
import App from './App'
import router from './router'

// 适用vue的插件
Vue.use(ElementUI)
Vue.use(MyServerHttp)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
