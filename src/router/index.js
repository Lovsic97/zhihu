import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes.js'
import store from '@/store/index'
import api from '@/api/index'
import { Toast } from 'vant'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  // 以下三个路径必须登录后才能访问
  let arr = ['/person', '/updateperson', '/store']
  if(arr.includes(to.path)) {
    // 校验是否登录
    let isLogin = store.state.isLogin
    // isLogin为true说明登录了，直接放行
    if(isLogin === true) {
      next()
      return
      // isLogin为false，说明没登录，跳转到登录页面
    } else if(isLogin === false) {
      Toast("请您先登录！")
      next('/login')
      return
      // isLogin为null，说明刚刚初始化，不知道有没有登录
      // 给服务器发送请求确认是否登录，如果登录了则修改vuex中的内容
    } else if(isLogin === null) {
      try{
        let {code, data} = await api.checkLogin()
        if(+code !== 0) {
          Toast("请您先登录！")
          next(('/login'))
          return 
        }
        store.commit("changeInfo", data)
        next()
      } catch(err) {}
      return
    }
  }
  next()
})

export default router

