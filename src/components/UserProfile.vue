<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img :src='fitUrl' alt="user.nickName" class="rounded-circle img-thumbnail">
      <!-- img-thumbnail图片响应式变化大小 -->
      <div class="detail ml-2">
        <!-- d-block干嘛的 -->
        <h6 class="d-block mb-0">{{ user.nickName }}</h6>
        <span class="text-truncate text-muted d-block">{{ user.description }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="UserProfile">
import { ref, reactive, computed, type PropType } from "vue"
import { useUserStore, type UserProps } from '@/store/user';
import { addColumnAvatar } from '@/helper';

const props = defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true,
  },
})

//组件内好像不管user数据，要从外面传
const fitUrl = computed(() => {
  addColumnAvatar(props.user, 50, 50)
  const { avatar } = props.user
  return avatar?.fitUrl
})

</script>
<style scoped>
.user-profile-component img {
  width: 50px;
  height: 50px;
  /* border: 1px solid #ccc;
  border-radius: 50px; */
}
</style>
