import * as actionTypes from './action-types'

export default {
  namespaced: false,
  state: {
    snackBar: {
      show: false,
      context: 'success',
      text: ''
    }
  },
  actions: {
    [actionTypes.SHOW_SNACK_BAR] ({state}, option) {
      state.snackBar = option
    }
  },
  getters: {
    snackBar: (state) => {
      return state.snackBar
    }
  }
}
