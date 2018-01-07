import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main.vue'
import Login from '../components/Login.vue'
import MyInfo from '../components/MyInfo'
import Merchants from '../components/Merchants.vue'
import Customers from '../components/Customers'
import TransHistory from '../components/TransHistory'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        {
          path: 'myInfo',
          name: 'MyInfo',
          component: MyInfo
        },
        {
          path: 'merchants',
          name: 'Merchants',
          component: Merchants
        },
        {
          path: 'customers',
          name: 'Customers',
          component: Customers
        },
        {
          path: 'customers/:cUsername/transHistory',
          name: 'TransHistory',
          component: TransHistory
        }
      ]
    }
  ]
})
