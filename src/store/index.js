import { createStore, createLogger } from 'vuex'
import api from '@/api/index.js'

const env = process.env.NODE_ENV
export default createStore({
  state: {
    isLogin: null,   // 是否登录
    info: null   // 当前用户基本信息
  },
  mutations: {
    changeIsLogin(state, bool) {
      state.isLogin = bool
    },
    changeInfo(state, payload) {
      state.info = payload
    }
  },
  actions: {
    async changeIsLoginAsync({commit}) {
      let bool = false
      let {code} = await api.checkLogin()
      if(+code === 0) bool = true
      commit('changeIsLogin', bool)
    },
    async changeInfoAsync({commit}) {
      let {code, data} = await api.userInfo()
      if(+code === 0) {
        commit('changeInfo', data)
      }

    }
  },
  plugins:env==='production' ? [] : [createLogger()]
})
