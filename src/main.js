import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* 导入vant */
import Vant, { Lazyload } from 'vant'
import './assets/reset.min.css'
import 'amfe-flexible'
import 'vant/lib/index.css'
/* 处理最大宽度 */
import { handleMaxWidth } from './assets/utils'
handleMaxWidth()
window.addEventListener('resize', handleMaxWidth)

const app = createApp(App)
app.use(Vant)
app.use(Lazyload, {
  lazyComponent: true
})
app.use(store).use(router).mount('#app')
