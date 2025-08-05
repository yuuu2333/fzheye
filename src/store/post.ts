import { defineStore } from 'pinia'
// import { testPosts, } from '@/testData'
import axios from 'axios'
import type { ResponseType, ListDictType, ImageProps } from './utils'
import type { UserProps } from "./user"
import { objToArr, arrToObj } from '@/helper'

// 先用测试数据充数，负责存一下专栏信息，做好识别专栏的方法
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string | ImageProps;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  //获取专栏列表时是string，
}
export const usePostStore = defineStore('post', {
  state() {
    return {
      posts: {
        data: {} as ListDictType<PostProps>,
        loadedColumns: [] as string[],
      },
    }
  },

  actions: {
    async createPost(newPost: PostProps) {
      //  this.posts.push(newPost)
      const { data: rawData } = await axios.post('/posts', newPost)
      const data = (rawData.data)
      this.posts.data[data._id] = data

    },
    async fetchPosts(cid: string) {//这个是获取指定某一个专栏的文章信息,cid是专栏编码
      // this.posts = []
      if (!this.posts.loadedColumns.includes(cid)) {
        const { data } = await axios.get(`/columns/${cid}/posts`)
        this.posts.data = { ...this.posts.data, ...arrToObj(data.data.list) }//不展开的话点别的专栏再回来点过的专栏就没内容了，每次获取都直接替换而不是加上去
        this.posts.loadedColumns.push(cid)
      }

    },
    async fetchPost(id: string) {//这个是获取指定某一个专栏的文章信息,cid是专栏编码
      const currentPost = this.posts.data[id]
      if (!currentPost||!currentPost.content) {
        const { data: rawData } = await axios.get<ResponseType<PostProps>>(`/posts/${id}`)
        this.posts.data[id] = rawData.data
        return rawData.data
      } else {
        return currentPost
        //不加else就有undefined的情况了，别忘了有数据情况下也要返回
      }
    },
    async updatePost(id: string, payload: PostProps) {
      const { data: rawData } = await axios.patch<ResponseType<PostProps>>(`/posts/${id}`, payload)
      this.posts.data[id] = rawData.data
    },
    async deletePost(id: string) {
      //调用接口，删完之后更新一下posts
      const { data: rawData } = await axios.delete(`/posts/${id}`)
      const data = rawData.data
      // this.posts = this.posts.filter(post => post._id !== id)
      delete this.posts.data[data._id] //删除posts里对应的文章
      return data
      //删除后调删掉的这篇文章所属的column
    }
  },
  getters: {
    getPosts: (state) => (currentId: string) => {
      // return state.posts.filter(item => item.column === currentId)
      return objToArr(state.posts.data).filter(item => item.column === currentId)

    },
    getPost: (state) => (currentId: string) => {
      // return state.posts.find(post => post._id === currentId)
      return state.posts.data[currentId]

    },
  },
})