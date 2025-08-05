import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/view/Home.vue'
import Login from '@/view/Login.vue'
import ColumnDetail from '@/view/ColumnDetail.vue'
import CreatePost from "@/view/CreatePost.vue"
import { useUserStore } from '@/store/user'
import Signup from '@/view/Signup.vue'
import axios from 'axios'
import { createMessage } from './components/createMessage'
import PostDetail from '@/view/PostDetail.vue'


// const userStore = useUserStore()不能放这，会报错pinia还没加载
// const { isLogin } = userStore.user//不能直接解构，失去响应性


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }//已登录后不能进
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requireLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,

    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail,

    },
  ]
})
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()//beforeEach是路由导航触发时才执行的，此时 Vue 应用已完成初始化,这时候再调pinia不会报错
  const { isLogin } = userStore
  const { token } = userStore
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      userStore.fetchCurrentUser().then(() => {
        to.meta.redirectAlreadyLogin ? next('/') : next()
      }).catch((e) => {
        console.log(e);
        // localStorage.removeItem('token')//token登不上说明有问题了，删掉，但是islogin里还留着，这里包装；了一个函数来解决问题
        userStore.logout()
        next('/login')
        createMessage('请重新登录', 'error', 2000)
      })
    } else {
      to.meta.requireLogin ? next('/login') : next()
    }

  } else {
    to.meta.redirectAlreadyLogin ? next('/') : next()
  }
})
// router.beforeEach(async(to, from, next) => {
//   const userStore = useUserStore()
//   if (to.meta.requireLogin && !userStore.user.isLogin) {
//     // next({ name: 'login' })
//   } else if (to.meta.redirectAlreadyLogin && userStore.user.isLogin) {
//     next('/')
//   } else {
//     next()
//   }
// })

export default router