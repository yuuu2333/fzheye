<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, toValue, watch } from "vue"
import EasyMDE, { type Options } from 'easymde'

interface EditorProps {
  modelValue?: string,
  options?: Options
}
interface EditorEmits {
  (type: 'update:modelValue', value: string): void,
  (type: 'change', value: string): void,
  (type: 'blur'): void,

}
const props = defineProps<EditorProps>()
const emits = defineEmits<EditorEmits>()

const textArea = ref<null | HTMLElement>(null)
const innerValue = ref(props.modelValue || '')
let easyMDEInstance: null | EasyMDE = null

watch(() => props.modelValue, (newVal) => {
  if (easyMDEInstance ) {
    if (newVal !== innerValue.value) {
      easyMDEInstance.value(newVal || '')//输入内容为空时newVal是undefined
} 
  }
})
onMounted(() => {
  if (textArea.value) {
    const config: Options = {
      ...(props.options || {}),
      element: textArea.value,
      initialValue: innerValue.value,//初始内容
      autoDownloadFontAwesome: false,// 禁止自动下载Font Awesome 
      spellChecker: false,

    }
    easyMDEInstance = new EasyMDE(config)
    //监控输入框内容变化
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        innerValue.value = easyMDEInstance.value()
        emits('update:modelValue', innerValue.value)
        emits('change', innerValue.value)
      }
    })
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emits('blur')
      }
    })
  }
})
onUnmounted(() => {
  if (easyMDEInstance) {
    easyMDEInstance.cleanup()
  }
  easyMDEInstance = null
})
const clear = () => {
  if (easyMDEInstance) {
    easyMDEInstance.value('')
  }
}
const getMDEInstance = () => {
  return easyMDEInstance
}
defineExpose({
  clear,
  getMDEInstance
})
</script>
<style scoped>
/* 俩中间不能空格 */
.vue-easymde-editor.is-invalid {
  border: 1px solid #dc3545;
}
</style>
