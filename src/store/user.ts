import { defineStore } from 'pinia'
import type { ImageProps, ListDictType } from './utils'
// import Login from '@/view/Login.vue'
import axios from 'axios'
import { objToArr, arrToObj } from '@/helper'


// 先用测试数据充数，负责存一下专栏信息，做好识别专栏的方法
export interface UserProps {
  nickName?: string;
  _id: string;
  column?: string;
  avatar?: ImageProps;
  email?: string;
  description?: string;

}
export const useUserStore = defineStore('user', {
  state() {
    return {
      // user: { isLogin: false } as UserProps,//先用true测试功能
      token: localStorage.getItem('token') || '',
      // isLoading: false,
      data: {} as UserProps,
      isLogin: false
    }
  },
  getters: {
    getPosts: (state) => {
      // testData.find(item => item.id === currentId)
    }

  },
  actions: {
    // login() {
    //   this.user = { ...this.user, isLogin: true, name: 'viking' }
    // },
    //已注册账号发起登录请求，账号密码发给后端，通过接口获取 Token 并配置全局认证，存到本地里，下次登还有
    async login(email: string, password: string) {
      //payload是 请求体
      const payload = { email, password }
      const { data } = await axios.post('/user/login', payload)
      console.log('Login success', data);
      const { token } = data.data


      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`//每次发的config的header里默认带上token
      console.log(token);

    },
    logout() {
      localStorage.removeItem('token')
      this.token = ''
      delete axios.defaults.headers.common['Authorization']
    },
    async fetchCurrentUser() {
      const { data } = await axios.get('/user/current')
      this.isLogin = true,
        this.data = { ...data.data }
      // this.$patch({//用 $patch 批量更新（Pinia 推荐方式，确保响应式追踪）

      //   });

    }

  }
})