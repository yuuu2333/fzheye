<template>
  <!-- 点网站标志跳转默认页面，点登录注册显示login界面 -->
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <RouterLink class="navbar-brand" to="/">者也专栏</RouterLink>
    <ul v-if="!isLogin" class="list-inline mb-0">
      <!-- 为什么需要token和islogin的双重判定，直接看有没有token不就行了 -->

      <li class="list-inline-item ">
        <RouterLink to="/login" class="btn btn-outline-light my-2">登陆</RouterLink>
      </li>
      <li class="list-inline-item">
        <RouterLink to="/signup" class="btn btn-outline-light my-2">注册</RouterLink>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <DropDown :title="`欢迎你 ${user.nickName}`">
          <DropDownItem disabled>
            <RouterLink class="dropdown-item" to="/create">新建文章</RouterLink>
          </DropDownItem>
          <DropDownItem>
            <RouterLink class="dropdown-item" :to="`/column/${user.column}`">我的专栏</RouterLink>
          </DropDownItem>
          <DropDownItem><a class="dropdown-item" href="#">管理账户 </a></DropDownItem>
          <DropDownItem><a class="dropdown-item" href="#">退出登录</a></DropDownItem>
        </DropDown>
      </li>

    </ul>


  </nav>
</template>
<script setup lang="ts" name="GlobalHeader">
import { ref, reactive } from "vue"
import type { PropType } from "vue"
import type { UserProps, } from '@/store/user'
import DropDown from '@/components/DropDown.vue'
import DropDownItem from "@/components/DropDownItem.vue"

const props = defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true
  },
  isLogin: {
    type: Boolean,
    required: true
  }
})

</script>
<style scoped></style>
