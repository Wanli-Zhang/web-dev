import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Modules
import message from './message'
import userInfo from './userInfo'
import biz from './biz'

export default new Vuex.Store({
  modules: {
    biz,
    message,
    userInfo
  }
})
