import Vue from 'vue'

export default{
  state: {
    Authenticated: false,
    role: 'administrator',
    username: 'myusername',
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
    }
  },
  actions: {
    login: ({commit}, payload) => {
      return new Promise((resolve, reject) => {
        Vue.axios.post(`/login`, payload).then(res => {
          if (res.data.err_code === 0) {
            commit('setRole', {role: payload.role})
            commit('setUsername', {username: payload.username})
            commit('setAuthenticated', {Authenticated: true})
            commit('setProfile', {profile: res.data.data})
            resolve(res.data.data)
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
