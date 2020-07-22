import Vue from 'vue'
import App from './App'
import Antd from 'ant-design-vue'
import VueRouter from 'vue-router'
import 'ant-design-vue/dist/antd.css'
import './assets/styles/global.scss'
import './components/icon/iconfont.js'
import Routes from './components/route/routes'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Antd)
/* eslint-disable no-new */
const router = new VueRouter({
  routes:Routes,
})
new Vue({
  components: { App },
  template: '<App/>',
  router:router
}).$mount('#app')
