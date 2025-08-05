<template>
  <!-- 专栏信息 -->
  <!-- <div class="column-detail-page w-690"> -->
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100" />
        <!-- 给column添加没有图片时默认的url -->
        <!-- <img :src="column.avatar && (column.avatar as ImageProps).fitUrl" :alt="column.title"
          class="rounded-circle border w-100" /> -->
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <PostList :postsList="postList"></PostList>
    <!-- <button v-if="!isLastPage" @click="loadMorePage"
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more">
      加载更多
    </button> -->
  </div>
  <!-- 专栏包含文章 -->
</template>
<script setup lang="ts" name="ColumnDetail">
import { ref, reactive, computed, onMounted, watch } from "vue"
import { useRoute } from 'vue-router'
import PostList from '@/components/PostList.vue'
import { usePostStore } from "@/store/post"
import { useColumnStore } from "@/store/column"
import { useUserStore } from "@/store/user"
import { addColumnAvatar } from '@/helper'


const route = useRoute()
const currentId = ref(route.params.id as string)

const ColumnStore = useColumnStore()
const userStore = useUserStore()
let column = computed(() => {
  const selectColumn = ColumnStore.getColumnById(currentId.value)
  if (selectColumn) {
    addColumnAvatar(selectColumn, 100, 100)
  }
  return selectColumn
})
// const column = ColumnStore.column.find(item => item.id === currentId)

const PostStore = usePostStore()
const postList = computed(() => PostStore.getPosts(currentId.value))//filter是数组方法
// const postList = PostStore.posts.filter(item => item.columnId === currentId)
onMounted(() => {
  ColumnStore.fetchColumn(currentId.value)//确保组件在完成挂载后再进行数据请求和状态更新
  PostStore.fetchPosts(currentId.value)

  watch(()=>route.params, (newPArams) => {
    const jumpId = newPArams.id as string
    const userColumn = userStore.data.column
    if (jumpId && userColumn && (jumpId === userColumn)) {
      //当前id是当前用户时
      currentId.value = jumpId
      ColumnStore.fetchColumn(currentId.value)
      PostStore.fetchPosts(currentId.value)

    }
  })


})

// item.id是数字，currentId是字符串，不一样会报错，所以加个运算符让currentId变成数字
// const column = testData.find(item => item.id === currentId)
//find查找唯一元素，找到一个就结束了，filter查找所有元素
// const postList = testPosts.filter(item => item.columnId === currentId)
</script>
<style scoped></style>
