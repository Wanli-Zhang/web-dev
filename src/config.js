import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'

export default class Config {
  static SERVER_URL = 'http://172.20.10.2:9898'
}

Vue.use(VueAxios, Axios)

Axios.defaults.baseURL = Config.SERVER_URL
Axios.defaults.withCredentials = true
