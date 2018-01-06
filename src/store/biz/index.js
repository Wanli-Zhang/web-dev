import Vue from 'vuex'
import * as actionTypes from './action-types'
import * as mutationTypes from './mutation-types'
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
    customers: [
      {
        username: 'abcd',
        name: 'customer1',
        level: 1,
        phone: '123456',
        address: 'heihei',
        create_time: new Date()
      },
      {
        username: 'xyz',
        name: 'customer2',
        level: 2,
        phone: '654321',
        address: 'haha',
        create_time: new Date()
      }
    ]
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
    [mutationTypes.SET_MERCHANTS]: (state, merchants) => {
      state.merchants = merchants
    },
    [mutationTypes.SET_CUSTOMERS]: (state, customers) => {
      state.customers = customers
    },
    [mutationTypes.ADD_MERCHANT]: (state, merchant) => {
      state.merchants.push(merchant)
    },
    [mutationTypes.DELETE_MERCHANT]: (state, username) => {
      let index = state.merchants.findIndex(merchant => merchant.username === username)
      state.merchants.splice(index, 1)
    },
    [mutationTypes.UPDATE_MERCHANT]: (state, newMerchant) => {
      let index = state.merchants.findIndex(merchant => merchant.username === newMerchant.username)
      if (newMerchant.password) {
        state.merchants[index].password = newMerchant.password
      }
      if (newMerchant.name) {
        state.merchants[index].name = newMerchant.name
      }
      if (newMerchant.level != null) {
        state.merchants[index].level = newMerchant.level
      }
      if (newMerchant.phone) {
        state.merchants[index].phone = newMerchant.phone
      }
      if (newMerchant.kind) {
        state.merchants[index].kind = newMerchant.kind
      }
    }
  },
  actions: {
    [actionTypes.FETCH_MERCHANTS]: ({commit}) => {
      return new Promise((resolve, reject) => {
        Vue.axios.get('/merchants').then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.SET_MERCHANTS, res.data.data)
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
            commit(mutationTypes.SET_CUSTOMERS, res.data.data)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.ADD_MERCHANT]: ({commit}, merchant) => {
      merchant.create_time = new Date().getTime()// 合代码时删掉
      commit(mutationTypes.ADD_MERCHANT, merchant) // 合代码时删掉
      return new Promise((resolve, reject) => {
        Vue.axios.post('/merchants', merchant).then(res => {
          if (res.data.err_code === 0) {
            merchant.create_time = new Date().getTime()
            commit(mutationTypes.ADD_MERCHANT, merchant)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.DELETE_MERCHANT]: ({commit}, mUsername) => {
      commit(mutationTypes.DELETE_MERCHANT, mUsername)// 合代码时删掉
      return new Promise((resolve, reject) => {
        Vue.axios.delete(`/merchant/${mUsername}`).then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.DELETE_MERCHANT, mUsername)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.UPDATE_MERCHANT]: ({commit}, merchant) => {
      commit(mutationTypes.UPDATE_MERCHANT, merchant)// 合代码时删掉
      return new Promise((resolve, reject) => {
        Vue.axios.put(`/merchant/${merchant.username}`).then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.UPDATE_MERCHANT, merchant)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    }
  }
}
