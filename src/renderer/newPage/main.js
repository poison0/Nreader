import Vue from 'vue'
import App from './App'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '../assets/styles/global.scss'
import '../newPage/icon/iconfont.js'

Vue.config.productionTip = false
Vue.use(Antd)
/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
}).$mount('#app')