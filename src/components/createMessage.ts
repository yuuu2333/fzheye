import { createApp, h,render} from 'vue'
import Message from '@/components/Message.vue'
import {type MessageType} from '@/components/Message.vue'


export const createMessage = (message: string, type: MessageType, timeout?: number) => {
  const messageVnode = h(Message,{
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  render(messageVnode, mountNode)
  //有的时候不想到点清除组件，可能通过别的方式清除，需要把清除包成一个方法并return出去，就可以外部调用清除
  const destory = () => {
    render(null, mountNode) // 清除组件
    document.body.removeChild(mountNode)
  }
  setTimeout(() => {
    destory()
  }, timeout)
  return destory
}