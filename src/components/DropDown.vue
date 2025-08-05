<template>
  <!-- 下拉菜单 -->
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
      {{ title }}
    </a>

    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>

    </ul>
  </div>
</template>
<script setup lang="ts" name="DropDown">
import { ref, reactive, defineProps, onMounted, onUnmounted, watch } from "vue"
import DropDownItem from '@/components/DropDownItem.vue'
import useClickOutsides from "@/hooks/useClickOutsides.ts"

const dropdownRef = ref<null | HTMLElement>(null)//挂载后就变成dom元素了，挂载前是null
const isOpen = ref(false)
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
//点击交互
const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const isClickOutside = useClickOutsides(dropdownRef)
watch(isClickOutside, () => {
  if (isClickOutside.value && isOpen.value) {//这是在setup里面，还没挂载就执行了，需要让他响应式执行
    isOpen.value = false
  }
})

//点界面外关闭窗口
//1.mount收集点击事件对象 删除
//2.判断点击对象是否在列表外
//
</script>
<style scoped></style>
