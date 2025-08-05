<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb-3 shdow-sm">
      <div class="card-body">
        <h4>
          <RouterLink :to="`/posts/${post._id}`">
            {{ post.title }}
          </RouterLink>
        </h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image && typeof post.image !== 'string'" class="col-4">
            <img :src="post.image.fitUrl" :alt="post.title" class="rounded-lg w-100">
          </div>
          <p :class="{ 'col-8': post.image }" class="text-muted">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
  <!-- 从数据库引数据后再用下面的，测试数据用上面的 -->
  <!-- <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb-3 shdow-sm">
      <div class="card-body">
        <h4>
          <router-link :to="`/posts/${post._id}`">{{ post.title }}</router-link>
        </h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <img :src="post.image && (post.image as ImageProps).fitUrl" :alt="post.title" class="rounded-lg w-100" />
          </div>
          <p :class="{ 'col-8': post.image }" class="text-muted">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div> -->
</template>
<script setup lang="ts">
import { ref, reactive, type PropType, computed } from "vue"
import { type PostProps } from '@/store/post'
import { generateFitUrl } from '@/helper'
import type { ImageProps } from "@/store/utils";

const props = defineProps({
  postsList: {
    required: true,
    type: Array as PropType<PostProps[]>
  }
})
const posts = computed(() => {
  return props.postsList.map(post => {
    generateFitUrl(post.image as ImageProps, 200, 110)
    return post
  })
})
</script>
<style scoped>
.post-list h4 a {
  text-decoration: none;
  color: #1a1a1a;
}
.post-list h4 a:hover {
  color: #0d6efd;
}
</style>
