<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
    <!-- 标题和文章详情输入框也用验证组件 -->
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <!-- file-uploaded是从uploader给父组件传emit的回调函数 -->
        <Uploader actions="/upload" :beforeUpload="uploadCheck" @file-uploaded="handleFileUploaded"
          @file-error="uploadedError" :uploaded="uploadedData"
          class="d-flex justify-content-center align-items-center bg-light text-secondary w-100 mb-4">
          <!-- 虽然这里就一个框，但是使用 Flexbox 是实现“真正居中”的一种最简单、稳定的方式。 -->
          <!-- 中间的内容传到相应的slot中，就可以实现组件的自定义功能 -->
          <h2>点击上传头图</h2>
          <template #loading>
            <div class="d-flex">
              <div class="spinner-border"></div>
              <h2>正在上传</h2>
            </div>
          </template>
          <template #uploaded="{ uploadedData }">
            <img :src="uploadedData && uploadedData.data.url" width="500">
          </template>

        </Uploader>
      </div>
      <div class="mb-3">
        <label class="form-label">文章标题</label>
        <ValidateInput type="text" :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题">
        </ValidateInput>
      </div>
      <div class="mb-3">
        <!-- 文章详情这里用textarea更好，因此在ValidateInput加一个类型判断 -->
        <label class="form-label">文章详情</label>
        <!-- :class="{ 'is-invalid':默认直接挂在子组件的根标签上，可以在子组件写样式 -->
        <Editor v-model="contentVal" :class="{ 'is-invalid': !editorStatus.isValid }" @blur="checkEditor"></Editor>
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary">{{ isEditMode ? '更新文章' : '发表文章' }}</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script setup lang="ts" name="CreatePost">
import { ref, reactive, onMounted } from "vue"
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput from '@/components/ValidateInput.vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import type { RuleProps } from '@/components/ValidateInput.vue'
import { usePostStore, type PostProps } from '@/store/post'
import Uploader from '@/components/Uploader.vue'
import { createMessage } from '@/components/createMessage.ts'
import type { ImageProps } from "@/store/global.ts"
import { beforeUploadCheck } from '@/helper'
import type { ResponseType } from '@/store/utils'
import Editor from '@/components/Editor.vue'


const router = useRouter()
const route = useRoute()
const postStore = usePostStore()
const userStore = useUserStore()
const uploadedData = ref()//这个是编辑已有文章的图片用的，把这个传到uploaded的uploadedData上，再由<template #uploaded="{ uploadedData }">标签传过来展示
let titleVal = ref('')
let imageId = ref('')//这个是图片传上之后才从uploader里获取图片id
let contentVal = ref('')
const editorStatus = reactive({
  isValid: true,
  message: ''
})

const isEditMode = !!route.query.id //两个！！把query.id转成boolean，因为就取正向的，如果要取反的boolean，可以就用！
const postId = route.query.id as string


onMounted(() => {
  if (isEditMode) {
    postStore.fetchPost(postId as string).then(result => {
      const currentPost = result
      console.log('currentPost', currentPost);

      if (!currentPost) {
        createMessage('没有找到该文章', 'error')
        return
      }
      titleVal.value = currentPost.title
      contentVal.value = currentPost.content || ''
      if (currentPost.image) {
        uploadedData.value = currentPost
      }
    }
    )
  }
})
const titleRules: RuleProps[] = [
  { type: "required", message: "标题不能为空" }
]

const contentRules: RuleProps[] = [
  { type: "required", message: "内容不能为空" }
]
const checkEditor = () => {
  if (contentVal.value.trim() === '') {
    editorStatus.isValid = false
    editorStatus.message = '内容不能为空'
  } else {
    editorStatus.isValid = true
  }
}
const onFormSubmit = async (result: boolean) => {//提交文章触发，把文章加到posts里
  checkEditor()
  if (result && editorStatus.isValid) {

    const { column, _id } = userStore.data
    console.log('ssssss', imageId)

    if (column) {
      const newPost: PostProps = {
        title: titleVal.value,
        content: contentVal.value,
        column,
        author: _id
      }
      if (imageId.value) {
        newPost.image = imageId.value
      }
      if (isEditMode) {
        await postStore.updatePost(postId, newPost)
      } else {
        await postStore.createPost(newPost)
      }
      createMessage('发表成功', 'success', 2000)
      setTimeout(() => {
        router.push('/column/' + column)
      }, 2000)
      //触发时往post列表里加文章  
    }
  }
}
const uploadCheck = (file: File) => {
  const { passed, error } = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 5 })
  if (error === 'format') {
    createMessage('只能上传jpg/png格式的图片', 'error', 2000)
  }
  if (error === 'size') {
    createMessage(`图片大小不能超过 5 Mb`, 'error', 2000)
  }
  return passed
}
const handleFileUploaded = (result: ResponseType<ImageProps>) => {
  if (result.data._id) {
    createMessage(`上传成功 图片ID${result.data._id}`, 'success', 2000)
    imageId.value = result.data._id
  }
}
const uploadedError = (result: ResponseType<ImageProps>) => {
  createMessage('上传失败', 'error', 2000)
}
</script>
<style>
/* 全局下的样式可以调子组件的类 */
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}

.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  /* 不加height: 100%;就不能和父盒子一样高了，多出来的地方会盖住页面元素 */
  /* width: 100%;height: 100%;都是相对父盒子的比例，不加cover会变的和原框一样瘪 */
  object-fit: cover;
  /* 图片比例不变，但被父盒子裁剪 */
}
</style>
