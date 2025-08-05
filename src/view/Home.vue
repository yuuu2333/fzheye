<template>
  <div class="home-page container-md">
    <section class="text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list" />
    <button to="/create" class="btn btn-primary my-2 mx-auto d-block" @click="loadMorePage" v-if="!isLastPage">加载更多</button>
    <!-- button 默认是 inline 的，你可以添加一个 display:block 就可以看到居中的效果 -->
    <!-- <button v-if="!isLastPage" @click="loadMorePage"
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more">
      加载更多
    </button> -->
  </div>
</template>
<script setup lang="ts" name="Home">
import { ref, reactive, onMounted, computed } from "vue"
import ColumnList from '@/components/ColumnList.vue'
import { useColumnStore } from "@/store/column"
import useLoadMore from "@/hooks/useLoadMore"

const ColumnStore = useColumnStore()

const currentPage = computed(() => ColumnStore.currentPage)
const total = computed(() => ColumnStore.total)
const { LoadMorePage, isLastPage } = useLoadMore(ColumnStore, 'fetchColumns', { currentPage, total })
const loadMorePage = () => LoadMorePage()

onMounted(() => {
  ColumnStore.fetchColumns({pageSize:3})//在 <script setup> 中直接调用 ColumnStore.fetchColumns() 时，组件还未完全挂载到 DOM 上，所以需要在onmounted 中调用
})
const list = computed(() => ColumnStore.getColumns)
</script>
<style scoped></style>
