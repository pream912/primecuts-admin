import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    circles: []
  },
  mutations: {
    ADD_CIRCLE (state, payload) {
      state.circles.push(payload)
    }
  },
  actions: {
    addCircle ({commit}, payload) {
      firebase.database().ref('circles').push(payload)
      .then((data) => {
        commit('ADD_CIRCLE', data.val())
      })
    }
  },
  getters: {
    loadedCircles(state) {
      return state.circles
    }
  },
  modules: {
  }
})
