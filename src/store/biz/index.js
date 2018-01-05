import Vue from 'vuex'
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
    }
  },
  actions: {
    fetchMerchants: ({commit}) => {
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
    fetchCustomers: ({commit}) => {
      return new Promise((resolve, reject) => {
        Vue.axios.get('/customers').then(res => {
          if (res.data.err_code === 0) {
            commit('setCustomer', res.data.data)
          } else {
            reject(res.data.err_msg)
          }
        })
      })
    }
  }
}
