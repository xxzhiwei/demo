import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const defaultRoutes = [
  {
    path: '/',
    component: () => import('@/views/index')
  },
  
]

const router = createRouter()

export function createRouter() {
  return new VueRouter({
    mode: 'hash',
    routes: defaultRoutes,
  })
}

export default router
