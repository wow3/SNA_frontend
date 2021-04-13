import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/users/users.vue'
import Cases from '../components/cases/cases.vue'
import Persons from '../components/persons/persons.vue'
import Phones from '../components/phones/phones.vue'
import Wechats from '../components/wechats/wechats.vue'
import Fapiaos from '../components/recognition/fapiaos.vue'
// @ -> src

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'cases',
          path: 'cases',
          component: Cases
        },
        {
          name: 'persons',
          path: 'persons',
          component: Persons
        },
        {
          name: 'phones',
          path: 'phones',
          component: Phones
        },
        {
          name: 'wechats',
          path: 'wechats',
          component: Wechats
        },
        {
          name: 'fapiaos',
          path: 'fapiaos',
          component: Fapiaos
        }
      ]

    }
  ]
})

// 在路由配置生效之前，同意判断token
// 路由守卫，在路由配置生效之前
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }

  if (to.path === '/') {
    router.push({
      name: 'cases'
    })
  }
})

export default router