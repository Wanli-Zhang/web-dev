import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main.vue'
import Login from '../components/Login.vue'
import MyInfo from '../components/MyInfo'
import Merchants from '../components/Merchants.vue'
import Customers from '../components/Customers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        {
          path: 'myInfo',
          name: 'myInfo',
          component: MyInfo
        },
        {
          path: 'merchants',
          name: 'merchants',
          component: Merchants
        },
        {
          path: 'customers',
          name: 'customers',
          component: Customers
        }
      ]
    }
  ]
})
