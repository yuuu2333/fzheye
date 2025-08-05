import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia";
import 'bootstrap/dist/css/bootstrap.css'
import router from '@/router.ts'
import axios from 'axios'
import { useGlobalStore } from '@/store/global'
import 'easymde/dist/easymde.min.css'
const app = createApp(App)
const pinia = createPinia()
// axios.defaults.baseURL = 'http://localhost:3000'
// axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// axios.interceptors.request.use(config => {
//   config.params = { ...config.params, icode: '5DE0E2E9C0024429' }
//   return config
// })
// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
axios.interceptors.request.use(config => {
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: 'B0C4DD3CEBB85677' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', 'B0C4DD3CEBB85677')
} else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: 'B0C4DD3CEBB85677' }
}
return config
})
//axios全局拦截器
axios.interceptors.request.use(config => {

  useGlobalStore().setloading(true)
  useGlobalStore().setError({ status: false, message: '' })//多次重复点击提交还能触发弹窗，不然app.vue里watch(() => error.value.status,)不变化就不触发了
  return config
})
axios.interceptors.response.use(config => {
  useGlobalStore().setloading(false)
  // setTimeout(() => {
    
  // }, 200)
  return config
}, e => {
  const {msg}= e.response.data
  useGlobalStore().setError({status:true,message:msg})
  useGlobalStore().setloading(false)
  return Promise.reject(msg)

})
app.use(pinia)
app.use(router)

app.mount('#app')