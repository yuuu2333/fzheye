<template>
  <!-- 以下slot中都是默认内容，父组件直接在标签间对应slot的位置写就可以实现自定义 -->
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <!-- 点击区域内都能触发triggerUpload，triggerUpload会触发点击隐藏的实际input按钮 -->
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary">上传中...</button>
        <!-- 这里的button都是父组件没设定的话的默认样式，想要一片区域的那种直接在父组件slot标签下写内容就能替代这里 -->
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
    <!-- 为什么隐藏见笔记 -->
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, type PropType, watch } from "vue"
import axios from 'axios'
import type { ImageProps } from "@/store/global.ts"
import type { ResponseType } from '@/store/utils';

defineOptions({
  inheritAttrs: false
})

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean

const props = defineProps({
  actions: { type: String, required: true },//props.action 是 后端接口的 URL 地址
  beforeUpload: {//接收并使用 父组件定义条件的beforeUpload 函数
    type: Function as PropType<CheckFunction>
  },
  uploaded: { type: Object }
})
//beforeUpload是父组件往子组件传判定结果，直接接收函数就行
//fileUploaded是子组件往父组件传上传结果，传个图片ID过去，要用emit组间通信(不是mitt)

const fileInput = ref<HTMLInputElement | null>(null)//在 DOM 渲染前，fileInput.value 始终是 null,ref 在创建时默认值为 null，DOM 渲染完成前不会赋值。
const fileStatus = ref<UploadStatus>( 'ready')
const uploadedData = ref(props.uploaded)//在外面声明就是全局的了，标签上可以收到
watch(() => props.uploaded, (newVal) => {
  //监视它变化后还有值的话直接把fileStatus变成success，因为前面的fileStatus只能执行一次
  if (newVal) {
    fileStatus.value = 'success'
    uploadedData.value = { data: newVal.image }//对象字面量的属性定义
  }
})
//直接初始化就等于编辑文章时的图片，如果没uploaded就等着后面正常传图片流程
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()//点击自定义按钮时，调用 `triggerUpload`，间接触发原生输入框的 `click()`，从而弹出文件选择框。
  }
}
const emit = defineEmits(['file-uploaded', 'file-error'])
const handleFileChange = (e: Event) => {
  const currentTarget = e.target as HTMLInputElement
  // document.querySelector(currentTarget)
  if (currentTarget.files) {
    const files = Array.from(currentTarget.files)
    if (props.beforeUpload) {//判断传的文件是否符合父组件要求
      const result = props.beforeUpload(files[0])
      if (!result) {//如果返回 false，则不执行上传操作
        fileStatus.value = 'ready'
        return//只返回，这样就不会执行后续的文件上传逻辑。
      }
    }
    fileStatus.value = 'loading'
    const formData = new FormData()

    formData.append('file', files[0])
    axios.post(props.actions, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(resl => {
      fileStatus.value = 'success'
      uploadedData.value = resl.data
      console.log(resl.data);
      emit('file-uploaded', resl.data)
    }).catch((e) => {
      fileStatus.value = 'error'
      emit('file-error', e)
    }).finally(() => {
      if (fileInput.value) {
        fileInput.value.value = ''
        // fileStatus.value = 'ready'
      }
    })
  }

}

</script>
<style scoped></style>
