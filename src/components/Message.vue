<template>
  <teleport to='#message'>
    <div class="alert message-info fixed-top w-25 mx-auto d-flex justify-content-between mt-2" :class="classObject"
      v-if="isVisiable">
      <span>{{ message }}</span>
      <button type="button" class="btn-close" @click.prevent="hide" aria-label="Close"></button>
    </div>
  </teleport>
</template>
<script setup lang="ts" name="Message">
import { ref, reactive, onUnmounted, type PropType } from "vue"
import { useDOMCreate } from '@/hooks/useDOMCreate'


export type MessageType = 'success' | 'error' | 'default'

const props = defineProps({
  message: String,
  type: {
    type: String as PropType<MessageType>,
    default: 'default'
  }
})
const classObject = {
  'alert-success': props.type === 'success',
  'alert-danger': props.type === 'error',
  'alert-primary': props.type === 'default'
}
//在各种组件标签挂载前新建一个#message标签挂在index.html中
useDOMCreate('message')

const isVisiable = ref(true)//是为了控制叉的功能，和父组件上的v-if的值是两回事
function hide() {
  isVisiable.value = false

}
</script>
<style scoped></style>
