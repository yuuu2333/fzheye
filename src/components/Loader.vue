<template>
  <teleport to='#back'>
    <div class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
      :style="{ backgroundColor: background || '' }">
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
        </div>
        <p v-if="text" class="text-primary small">{{ text }}</p>
      </div>
      <!-- <h3>正在努力获取信号</h3> -->
    </div>
  </teleport>
</template>
<script setup lang="ts" name="Loader">
import {ref,reactive,onUnmounted} from "vue"
import { useDOMCreate } from '@/hooks/useDOMCreate';

const props = defineProps({
  text: String,
  background: String
})
useDOMCreate('back')

// //在各种组件标签挂载前新建一个#back标签挂在index.html中
// const node = document.createElement('div')
// node.id = "back"
// document.body.appendChild(node)
// //这里会有一个问题，每个页面调用Loader组件时都创建一个node，所以需要生成后删除节点
// //在onUnmounted中删除节点
// onUnmounted(() => {
//   node.remove()
// })
</script>
<style scoped>
.loading-container{
  background-color: rgba(255, 255, 255, .5);
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  margin: 0;
  top: 0;
}
.loading-container{
  text-align: center;
}
</style>
