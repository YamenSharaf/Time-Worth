import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/AppHome'
import ViewProject from '@/components/ViewProject'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:id',
      name: 'ViewProject',
      component: ViewProject
    }
  ]
})
