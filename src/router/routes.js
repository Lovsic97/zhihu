import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/detail/:id',
    component: () => import(/* webpackChunkName: "other" */'@/views/Detail.vue')
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "other" */'@/views/Login.vue')
  },
  {
    path: '/person',
    component: () => import(/* webpackChunkName: "other" */'@/views/Person.vue')
  },
  {
    path: '/store',
    component: () => import(/* webpackChunkName: "other" */'@/views/Store.vue')
  },
  {
    path: '/updateperson',
    component: () => import(/* webpackChunkName: "other" */'@/views/UpdatePerson.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes


// 一级路由
// 首页 /
// 详情 /detail
// 登录 /login
// 个人信息 /person
// 收藏 /store
// 修改个人信息 /updateperson