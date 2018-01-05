// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VSnackbar,
  VDivider,
  VAvatar,
  VCard,
  VSubheader,
  VTextField,
  VDataTable,
  VCheckbox,
  VMenu,
  VTabs,
  VToolTip,
  VForm,
  VSelect,
  VDialog
} from 'vuetify'
import './stylus/main.styl'

import App from './App.vue'
import router from './router'
import {} from './config'
import store from './store'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VSnackbar,
    VDivider,
    VAvatar,
    VCard,
    VSubheader,
    VTextField,
    VDataTable,
    VCheckbox,
    VMenu,
    VTabs,
    VToolTip,
    VForm,
    VSelect,
    VDialog
  }
})
Vue.use(Vuex)
Vue.use(VueCookie)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
