<template>
  <!-- 下拉菜单里的具体选项 -->
  <li class="dropdown-option" :class="{ 'is-disabled': disabled }">
    <slot></slot>
  </li>
</template>
<script setup lang="ts" name="DropDownItem">
import { ref, reactive } from "vue"
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
<style scoped>
.dropdown-option.is-disabled *{
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}
</style>
