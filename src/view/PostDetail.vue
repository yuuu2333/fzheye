<template>
  <div class="post-detail-page ">
    <Modal :visible="modalIsVisible" title="删除文章" @modal-on-confirm="hideAndDelete"
      @modal-on-close="modalIsVisible = false">
      <p>确定要删除文章吗</p>
    </Modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <UserProfile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></UserProfile>
          <!-- <UserProfile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></UserProfile> -->
        </div>
        <span class="text-muted col text-right font-italic">发表于：{{ currentPost.createdAt }}</span>
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea()" class="btn-group mt-5">
        <router-link type="button" class="btn btn-success"
          :to="{ name: 'create', query: { id: currentPost._id } }">编辑</router-link>
        <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
        <!-- <button type="button" class="btn btn-danger" @click="modalIsVisible = true">删除</button> -->
      </div>

    </article>
  </div>
  <!-- <div v-html="currentHTML"></div>
    <div v-if="showEditArea" class="btn-group mt-5">
      <router-link type="button" class="btn btn-success"
        :to="{ name: 'create', query: { id: currentPost._id } }">编辑</router-link>
      <button type="button" class="btn btn-danger" @click="modalIsVisible = true">删除</button>
    </div> -->

</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { usePostStore, type PostProps } from '@/store/post'
import { useRoute, useRouter } from 'vue-router'
import type { ImageProps } from '@/store/utils'
import UserProfile from '@/components/UserProfile.vue'
import { useUserStore, type UserProps } from '@/store/user'
import Modal from '@/components/Modal.vue'
import { createMessage } from '@/components/createMessage.ts'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const currentId = route.params.id as string
let modalIsVisible = ref(false)
const userStore = useUserStore()

const postStore = usePostStore()
onMounted(() => {
  postStore.fetchPost(currentId)
})
const currentPost = computed(() => postStore.getPost(currentId))
const currentImageUrl = computed(() => {
  if (currentPost.value?.image) {
    const { image } = currentPost.value
    return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
  } else {
    return null
  }

})
const currentHTML = computed(() => {
  if (currentPost.value?.content) {
    const { content } = currentPost.value
    return marked.parse(content)
  }
})
const showEditArea = () => {
  const { isLogin } = userStore
  const { _id } = userStore.data
  if (isLogin && currentPost.value && currentPost.value.author) {
    const postAuthor = currentPost.value.author as UserProps
    return _id === postAuthor._id
  } else {
    return false
  }
}
const hideAndDelete = () => {
  modalIsVisible.value = false
  postStore.deletePost(currentId).then(result => {
    createMessage('文章删除成功，跳转到专栏首页', 'success', 2000)
    router.push('/column/' + result.column)
  }
  )
}

</script>
<style scoped></style>
