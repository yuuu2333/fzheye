import { computed, ref, type ComputedRef } from "vue"
import { usePostStore } from "@/store/post"
import { useColumnStore } from "@/store/column"
import { type Store } from "pinia";


interface LoadOptions {
  currentPage: ComputedRef<number>;
  pageSize?: number;
  total: ComputedRef<number>;
  [key: string]: any; // 允许其他属性
}
const useLoadMore = (store: Store<string, any>, actionName: string, options: LoadOptions) => {
  const { currentPage, pageSize = 5, total, ...restOptions } = options
  const requestParams = computed(() => {
    return {
      ...restOptions,
      currentPage: currentPage.value + 1,
      pageSize: pageSize
    }
  })

  //根据传入的actionName//点一下就执行一下对应的函数
  const LoadMorePage = () => {
    //触发fetchpost/column
    store[actionName](requestParams.value)
    //每次调LoadMorePage，currentPage就加1

  }
  const isLastPage = computed(() => { return Math.ceil(total.value / pageSize) === currentPage.value })
  //当currentPage.value===isLastPage时,让该页面的加载按钮消失
  return { LoadMorePage, isLastPage, currentPage }
}
export default useLoadMore