import Vue from 'vue'

export default{
  state: {
    Authenticated: false,
    role: 'customer',
    username: 'myusername',
    password: '11111111',
    profile: {
      name: 'zwl',
      level: 1,
      phone: 12345678901,
      address: 'fffffuck',
      create_time: new Date().getTime(),
      kind: 'fffff'
    }
  },
  getters: {
    getProfile: (state) => {
      return state.profile
    },
    getAuthenticated: (state) => {
      return state.Authenticated
    },
    getRole: (state) => {
      return state.role
    },
    getUsername: (state) => {
      return state.username
    },
    getPassword: (state) => {
      return state.password
    }
  },
  mutations: {
    setProfile: (state, payload) => {
      state.profile = payload.profile
    },
    setAuthenticated: (state, payload) => {
      state.Authenticated = payload.Authenticated
    },
    setRole: (state, payload) => {
      state.role = payload.role
    },
    setUsername: (state, payload) => {
      state.username = payload.username
    },
    setPassword: (state, payload) => {
      state.password = payload.password
    }
  },
  actions: {
    login: ({commit}, payload) => {
      return new Promise((resolve, reject) => {
        Vue.axios.post(`/login`, payload).then(res => {
          if (res.data.err_code === 0) {
            commit('setRole', {role: payload.role})
            commit('setUsername', {username: payload.username})
            commit('setPassword', {password: payload.password})
            commit('setAuthenticated', {Authenticated: true})
            commit('setProfile', {profile: res.data.data})
            resolve()
          } else {
            reject(res.data.err_msg)
          }
        }, (err) => {
          console.log(err)
          reject(err)
        }).catch((e) => {
          console.log(e)
          reject(e)
        })
      })
    },
    logout: ({commit}) => {
      commit('setAuthenticated', {Authenticated: false})
    }
  }
}
