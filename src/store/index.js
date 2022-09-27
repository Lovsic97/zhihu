import { createStore, createLogger } from 'vuex'
const env = process.env.NODE_ENV
export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  plugins:env==='production' ? [] : [createLogger()]
})
