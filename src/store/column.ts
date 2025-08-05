import { defineStore } from 'pinia'
import axios from 'axios'
import type { ImageProps, ListDictType, ListResType, ResponseType, ColumnsRequset } from './utils'
import { objToArr, arrToObj } from '@/helper'
// 先用测试数据充数，负责存一下专栏信息，做好识别专栏的方法
export interface ColumnProps {
  _id: string,
  title: string,
  avatar?: ImageProps,
  description: string
}
export interface GlobalColumnsProps {
  currentPage: number,
  total: number,
  data: ListDictType<ColumnProps>
}
export const useColumnStore = defineStore('column', {
  state() {
    return {
      //data是已经转过的对象，已经变成了 **具体id**:{该id包含的属性}
      data: {} as ListDictType<ColumnProps>,
      isLoaded: false,
      currentPage: 0,
      total: 0
      //专栏列表是否加载过
    }
  },

  actions: {
    //发送请求，获取数据，展示页面
    async fetchColumns(Params: ColumnsRequset = {}) {//这个是获取好多专栏信息 home页面用
      const { currentPage = 1, pageSize = 6 } = Params//默认值
      // 属性在被解构的对象中不存在，或值为 undefined 时，才会使用默认值
      //提出来的currentPage比this.currentPage大，说明还没调过useLoadMore？？？？？
      if (this.currentPage < currentPage) {
        const { data } = await axios.get<ListResType<ColumnProps>>(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
        const { count, list } = data.data
        console.log(this.total);
        // this.column.isLoaded = true //加载完毕
        console.log(currentPage);
        this.$patch({//pinia修改数据的方式
          data: { ...this.data, ...arrToObj(list) },
          total: count,
          currentPage//currentPage :currentPage的简写
        })
      }
    },
    async fetchColumn(cid: string) {//这个是获取指定某一个专栏信息,cid是专栏编码，columndetail页面用
      // const cidArr = Object.keys(this.data)
      // if (!cidArr.includes(cid)) {
      // }感觉直接写下面也挺好，看data里有没有id是cid的对象
      if (!this.data[cid]) {
        // const { data } = await axios.get<ResponseType<ColumnProps>>(`/columns/${cid}`)
        // this.data[cid] = data.data//因为column 是一个数组（ColumnProps[]），虽然这就有一个数据但也要这么搞
        const { data: rawData } = await axios.get<ResponseType<ColumnProps>>(`/columns/${cid}`)
        const { data } = rawData
        this.data[data._id] = data;
      }
    }
  },
  getters: {
    //getter 本质上是一个计算属性，它会自动执行并返回结果，除非要传参，否则不需要手动加 () 调用。
    getColumns: (state) => {
      return objToArr(state.data)
    },
    getColumnById: (state) => (Id: string) => {
      return state.data[Id]
    }

  },
})
