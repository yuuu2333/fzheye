import { defineStore } from 'pinia';
import axios from 'axios'
import { nanoid } from "nanoid";
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useTalkStore = defineStore('talk', {//命名最好用hooks那种动作，以 `use` 开头
  actions: {
    async getLoveTalk() {
      let { data: { content: title } } = await axios.get('https://api.uomg.com/api/rand.qinghua')
      let obj = { id: nanoid(), title }
      console.log(title);


      this.TalkList.unshift(obj)
    }
  },
  //真正存储数据的地方
  state() {
    return {
      TalkList: [
        { id: 'ftrfasdf01', title: '今天你有点怪，哪里怪？怪好看的！' },
        { id: 'ftrfasdf02', title: '草莓、蓝莓、蔓越莓，今天想我了没？' },
        { id: 'ftrfasdf03', title: '心里给你留了一块地，我的死心塌地' }]
    }
  },
})