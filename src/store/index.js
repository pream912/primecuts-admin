import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import alerts from './modules/alerts'
import vendors from './modules/vendors'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  },
  modules: {
    products,
    alerts,
    vendors
  }
})
