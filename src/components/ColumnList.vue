<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body  text-center ">
          <img :src="column.avatar && column.avatar.url" class="rounded-circle border border-light my-3"
            :alt="column.title">
          <!-- 感觉border border-light加不加都一样 -->
          <h5 class="card-title "> {{ column.title }} </h5>
          <p class="card-text text-start">{{ column.description }}</p>
          <!-- 根据list里带的id，不同专栏跳转不同界面 -->
          <RouterLink :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="ColumnList">
import { ref, reactive, computed } from "vue"
import type { PropType } from "vue";
import type { ColumnProps } from '@/store/column'
import { addColumnAvatar } from '@/helper'
const props = defineProps({
  list: {
    type: Array as PropType<ColumnProps[]>,//定义 prop 的类型需要用as PropType<T>,正常数据可以用xx as T,例如column: [] as ColumnProps[],
    required: true,
  }
})
//专栏作者头像图标的默认显示 用计算属性判断
const columnList = computed(() => {
  return props.list.map(column => {
    // if (!column.avatar) {
    //   column.avatar = {
    //     url: ('@/assets/column.jpg')
    //   }
    // } else {
    //   column.avatar.url = column.avatar.url + '?x-oss-process=image/resize,m_pad,h_50,w_50'
    //   //oss对象存储-图片缩放
    // }
    //以上会导致再次回到home页面时，多次拼接导致 URL 格式不正确，
    addColumnAvatar(column, 50, 50)//设置的是 fitUrl 属性，而不是直接修改 url原始的 url 属性保持不变，避免了重复拼接的问题
    return column
  }
  )
})
</script>
<style scoped>
.card-body img {
  width: 50px;
}
</style>
