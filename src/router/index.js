import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Orders from '../views/Orders.vue'
import Circles from '../views/Circles.vue'
import Products from '../views/Products.vue'
import Vendors from '../views/Vendors.vue'
import PriceList from '../views/PriceList.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/orders',
    component: Orders
  },
  {
    path: '/circles',
    component: Circles
  },
  {
    path: '/products',
    component: Products
  },
  {
    path: '/vendors',
    component: Vendors
  },
  {
    path: '/plist',
    component: PriceList
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
