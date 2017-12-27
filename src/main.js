// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import '@/sass/app.scss'
import '../node_modules/vue2-animate/dist/vue2-animate.min.css'
import locale from 'element-ui/lib/locale/lang/en'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
require('./filters')

Vue.prototype.$bus = new Vue() // Global event bus
Vue.config.productionTip = false

Vue.filter('formatDate', (date) => {
  return date.toTimeString()
})

Vue.use(ElementUI, {locale})
Vue.use(BootstrapVue)
Vue.use(VueMomentJS, moment)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
