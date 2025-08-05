<template>
  <teleport to='#modal'>
    <div class="modal d-block" tabindex="-1" v-if="props.visible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ props.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="onClose"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click.prevent="onConfirm">确认</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup lang="ts" name="Modal">
import { ref, reactive } from "vue"
import { useDOMCreate } from "@/hooks/useDOMCreate"
const props = defineProps({
  title: String,
  visible: {
    type: Boolean,
    default: false
  }
  
})
const emits = defineEmits(['modal-on-close', 'modal-on-confirm'])
useDOMCreate('modal')
const onClose = () => {
  emits('modal-on-close')
}
const onConfirm = () => {
  emits('modal-on-confirm')
}


</script>
<style scoped>

</style>
