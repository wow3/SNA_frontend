// 插件模块

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 基础地址
  axios.defaults.baseURL = 'https://localhost:8000/'
  Vue.prototype.$http = axios
}

export default MyHttpServer
