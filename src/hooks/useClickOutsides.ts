//需要在这个封装函数里确定所选元素elementRef是不是包含点击对象e.target,即 点的是不是外面
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
//这里的Ref代表一个类型
const useClickOutsides = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {//选的不是下拉选项，并且下拉选项是打开的
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true

      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)

  })
  return isClickOutside
}

export default useClickOutsides