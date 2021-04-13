// 插件模块

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 基础地址
  axios.defaults.baseURL = 'http://localhost:5000/'
  Vue.prototype.$http = axios
}

export default MyHttpServer
