import { createRouter, createWebHistory } from 'vue-router'
import WelcomeScreen from '../components/Chat/welcome-screen/welcome-screen.vue'
import ProductList from '../components/products/product-list/product-list.vue'
import ProductDetail from '../components/products/product-detail/product-detail.vue'
import QuestionView from '../views/QuestionView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: WelcomeScreen
  },
  {
    path: '/products',
    name: 'products',
    component: ProductList
  },
  {
    path: '/products/:productId',
    name: 'product-detail',
    component: ProductDetail
  },
  {
    path: '/products/:productId/question',
    name: 'question',
    component: QuestionView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
