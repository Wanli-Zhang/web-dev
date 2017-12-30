import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Modules
import message from './message'

export default new Vuex.Store({
  modules: {
    message
  }
})
