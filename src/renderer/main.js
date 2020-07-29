import Vue from 'vue'
import App from './App'
import Antd from 'ant-design-vue'
import VueRouter from 'vue-router'
import 'ant-design-vue/dist/antd.css'
import './assets/styles/global.scss'
import './components/icon/iconfont.js'
import Routes from './components/route/routes'
const router = new VueRouter({
  routes: Routes,
})
Vue.config.productionTip = false;
// 全局注册 <router-view>   和 <router-link>
Vue.use(VueRouter)
Vue.use(Antd)
/* eslint-disable no-new */

new Vue({
  components: { App },
  template: '<App/>',
  router
}).$mount('#app')
