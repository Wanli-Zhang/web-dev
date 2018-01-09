import Vue from 'vue'
import * as actionTypes from './action-types'
import * as mutationTypes from './mutation-types'
export default {
  state: {
    merchants: [],
    customers: []
  },
  getters: {
    getMerchants: (state) => {
      return state.merchants
    },
    getCustomers: (state) => {
      return state.customers
    },
    getCustomer: (state) => (cUsername) => {
      return state.customers.find(customer => customer.username === cUsername)
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
    [mutationTypes.ADD_CUSTOMER]: (state, customer) => {
      state.customers.push(customer)
    },
    [mutationTypes.DELETE_MERCHANT]: (state, username) => {
      let index = state.merchants.findIndex(merchant => merchant.username === username)
      state.merchants.splice(index, 1)
    },
    [mutationTypes.DELETE_CUSTOMER]: (state, username) => {
      let index = state.customers.findIndex(customer => customer.username === username)
      state.customers.splice(index, 1)
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
    },
    [mutationTypes.UPDATE_CUSTOMER]: (state, newCustomer) => {
      let index = state.customers.findIndex(customer => customer.username === newCustomer.username)
      if (newCustomer.password) {
        state.customers[index].password = newCustomer.password
      }
      if (newCustomer.name) {
        state.customers[index].name = newCustomer.name
      }
      if (newCustomer.level != null) {
        state.customers[index].level = newCustomer.level
      }
      if (newCustomer.phone) {
        state.customers[index].phone = newCustomer.phone
      }
      if (newCustomer.address) {
        state.customers[index].address = newCustomer.address
      }
    }
  },
  actions: {
    [actionTypes.FETCH_MERCHANTS]: ({commit}) => {
      return new Promise((resolve, reject) => {
        Vue.axios.get('/webapi/v1/merchants').then(res => {
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
        Vue.axios.get('/webapi/v1/customers').then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.SET_CUSTOMERS, res.data.data)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.FETCH_CUSTOMERS_OF_MERCHANT]: ({commit}, mUsername) => {
      return new Promise((resolve, reject) => {
        Vue.axios.get(`/webapi/v1/merchant/${mUsername}/customers`).then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.SET_CUSTOMERS, res.data.data)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.ADD_MERCHANT]: ({commit}, merchant) => {
      return new Promise((resolve, reject) => {
        Vue.axios.post('/webapi/v1/merchants', merchant).then(res => {
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
    [actionTypes.ADD_CUSTOMER]: ({commit}, customer) => {
      return new Promise((resolve, reject) => {
        Vue.axios.post('/webapi/v1/customers', customer).then(res => {
          if (res.data.err_code === 0) {
            customer.create_time = new Date().getTime()
            commit(mutationTypes.ADD_CUSTOMER, customer)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.DELETE_MERCHANT]: ({commit}, mUsername) => {
      return new Promise((resolve, reject) => {
        Vue.axios.delete(`/webapi/v1/merchant/${mUsername}`).then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.DELETE_MERCHANT, mUsername)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.DELETE_CUSTOMER]: ({commit}, mUsername) => {
      return new Promise((resolve, reject) => {
        Vue.axios.delete(`/webapi/v1/customer/${mUsername}`).then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.DELETE_CUSTOMER, mUsername)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.UPDATE_MERCHANT]: ({commit}, merchant) => {
      return new Promise((resolve, reject) => {
        Vue.axios.put(`/webapi/v1/merchant/${merchant.username}`).then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.UPDATE_MERCHANT, merchant)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    },
    [actionTypes.UPDATE_CUSTOMER]: ({commit}, customer) => {
      return new Promise((resolve, reject) => {
        Vue.axios.put(`/webapi/v1/customer/${customer.username}`).then(res => {
          if (res.data.err_code === 0) {
            commit(mutationTypes.UPDATE_CUSTOMER, customer)
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    }
  }
}
