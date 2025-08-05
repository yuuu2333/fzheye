<template>
  <div class="validate-input-container pb-3">
    <!-- 绑定邮箱值的数据，方便对邮箱值进行操作
        绑定取消焦点事件，用于表单内容验证 -->
    <input v-if="tag === 'input'" class="form-control" v-model="inputRef.val" @blur="validataInput"
      :class="{ 'is-invalid': inputRef.error }" v-bind="$attrs">
    <!-- `$attrs` 是 Vue 组件的一个特殊属性，它包含了父组件传递给当前组件的、但未被当前组件声明为 `props` 的所有 attribute,用于实现当前组件的父组件，向当前组件的子组件通信 -->
    <textarea v-else class="form-control" v-model="inputRef.val" @blur="validataInput"
      :class="{ 'is-invalid': inputRef.error }" v-bind="$attrs">
      <!-- 由于使用了 v-bind="$attrs"，父组件传递的 rows="10" 属性会被直接绑定到 <textarea> 元素上，因此 rows 属性可以正常生效。 -->
  </textarea>

    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>

<script setup lang="ts" name="ValidateInput">

import { ref, reactive, onMounted, computed } from "vue"
import type { PropType } from 'vue'
import { emitter } from "./ValidateForm.vue"
// 定义单个验证规则的接口 reqiured |email
defineOptions({
  inheritAttrs: false
})

export interface RuleProps {
  type: 'required' | 'email' | 'password' | 'custom'
  message: string
  validator?: () => boolean
}
export type TagProps = 'input' | 'textarea'

const props = defineProps({
  rules: Array as PropType<RuleProps[]>,
  modelValue: String,
  tag: {
    type: String as PropType<TagProps>,
    default: 'input'
  }
})

const emits = defineEmits(['update:modelValue',  'clear-input'])
const inputRef = reactive({
  //用computed替换v-model绑定
  val: computed( {
    //get依赖的数据被读取就触发get并把变化后的值返回  传过来modelValue就变，没传就是空值
    get: () => props.modelValue || '',
    set: val => {
      //计算属性的数据不用set不能直接修改，如inputRef.val=(e.target as HTMLInputElement).value
      //在给inputRef.val赋值时会自动调用 set 方法，此时 val 就是这个输入值（即 e.target.value）
      emits('update:modelValue', val)
    }
    
  }),
  error: false,
  message: ''
})
// const updateValue = (e: Event) => {
//   inputRef.val = (e.target as HTMLInputElement).value
//   emits('update:modelValue', inputRef.val)//父组件的v-model非语法糖形式默认绑了update:modelValue这个事件，触发就更新v-model值
// }
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const validataInput = () => {
  if (props.rules) {
    const allPassed = props.rules.every(rule => {
      let passed = true
      inputRef.message = rule.message
      switch (rule.type) {
        case 'required':
          passed = (inputRef.val.trim() !== '')
          console.log('required');
          console.log(inputRef.val);

          break
        case "email":
          passed = emailReg.test(inputRef.val)
          console.log('email');

          break
        case "custom":
          passed = rule.validator ? rule.validator() : true//rule是遍历的rules里的每一项
        break
        default:
          break;
      }
      return passed
    })
    inputRef.error = !allPassed
    return allPassed//props.rules存在时，使用 return allPassed 返回验证结果，函数执行结束，不会执行后续的 return true
  }
  return true//props.rules不存在时，意味着没有提供任何验证规则。在这种情况下，函数默认认为输入内容验证通过，因此返回 true。
}
const clearInput = () => {
  inputRef.val = ''
}
//表单挂载之后才能获取inputRef，所以在mounted里面执行
//每个 ValidateInput 组件挂载时，都会触发该事件并传递自身的引用
onMounted(() => {
  emitter.emit('form-item-created', {validataInput, clearInput})
})
defineExpose({
  validataInput,
  clearInput
})

</script>
<style scoped></style>