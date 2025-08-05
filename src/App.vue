<template>

  <div class="container">
    <Loader v-if="isloading" text="正在努力获取信号"></Loader>
    <GlobalHeader :user="currentUser" :isLogin="isLogin"></GlobalHeader>
    <Message type="error" :message="error.message" v-if="error.status"></Message>

    <router-view></router-view>

    <footer class="text-center py-4 text-secondary bg-light mt-auto">
      <small>
        <li class="list-inline-item">© 2020 者也专栏</li>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
  <!-- <div class="container">
    <ColumnList :list="list" />
  </div> -->
</template>

<script lang="ts" setup>

import GlobalHeader from '@/components/GlobalHeader.vue';
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore, type UserProps } from '@/store/user';
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useGlobalStore } from '@/store/global'
import Loader from '@/components/Loader.vue';
import { type PropType } from 'vue';
import axios from 'axios'
import Message from '@/components/Message.vue'
import { createMessage } from '@/components/createMessage'
import Modal from '@/components/Modal.vue'

const UserStore = useUserStore()
const token = computed(() => UserStore.token)
const currentUser = computed(() => UserStore.data as UserProps)
const isLogin = computed(() => UserStore.isLogin)
//页面标签挂载完毕后才能开始接收数据=>用onMounted
// onMounted(() => {
//   //用户之前登录过（本地存了 Token），但当前会话未标记为「已登录」（如页面刷新后，currentUser 状态重置）。此时需要 自动验证 Token 有效性，避免用户重复登录。
//     if (!currentUser.value.isLogin && token.value) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
//       UserStore.fetchCurrentUser()
//     }
// })

const GlobalStore = useGlobalStore()
const isloading = computed(() => GlobalStore.loading)
const error = computed(() => GlobalStore.error)
watch(() => error.value.status, () => {
  const { status, message } = error.value
  if (status && message) {
    createMessage(message, 'error', 2000)

  }
})
</script>

<style scoped></style>