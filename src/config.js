import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'

export default class Config {
  static SERVER_URL = 'http://localhost:8081'
}

Vue.use(VueAxios, Axios)

Axios.defaults.baseURL = Config.SERVER_URL
Axios.defaults.withCredentials = true
