import Vue from 'vue'
import * as actionTypes from './action-types'
export default {
  state: {
    merchants: [
      {
        username: 'abcd',
        name: 'merchant1',
        level: 1,
        phone: '123456',
        kind: 'heihei',
        create_time: new Date()
      },
      {
        username: 'xyz',
        name: 'merchant2',
        level: 2,
        phone: '654321',
        kind: 'haha',
        create_time: new Date()
      }],
    customers: []
  },
  getters: {
    getMerchants: (state) => {
      return state.merchants
    },
    getCustomers: (state) => {
      return state.customers
    }
  },
  mutations: {
    setMerchants: (state, merchants) => {
      state.merchants = merchants
    },
    setCustomers: (state, customers) => {
      state.customers = customers
    },
    addMerchant: (state, merchant) => {
      state.merchants.push(merchant)
    }
  },
  actions: {
    [actionTypes.FETCH_MERCHANTS]: ({commit}) => {
      return new Promise((resolve, reject) => {
        Vue.axios.get('/merchants').then(res => {
          if (res.data.err_code === 0) {
            commit('setMerchants', res.data.data)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.FETCH_CUSTOMERS]: ({commit}) => {
      return new Promise((resolve, reject) => {
        Vue.axios.get('/customers').then(res => {
          if (res.data.err_code === 0) {
            commit('setCustomer', res.data.data)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.ADD_MERCHANT]: ({commit}, merchant) => {
      return new Promise((resolve, reject) => {
        Vue.axios.post('/merchants', merchant).then(res => {
          if (res.data.err_code === 0) {
            commit('addMerchant', merchant)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.DELETE_MERCHANT]: ({commit}, mUsername) => {
      return new Promise((resole, reject) => {
        Vue.axios.delete(`/merchant/${mUsername}`).then(res => {
          if (res.data.err_code === 0) {
            commit('deleteMerchant', mUsername)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.UPDATE_MERCHANT]: ({commit}, mUsername, merchant) => {
      return new Promise((resolve, reject) => {
        Vue.axios.put(`/merchant/${mUsername}`).then(res => {
          if (res.data.err_code === 0) {
            commit('updateMerchant', mUsername, merchant)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    }
  }
}
