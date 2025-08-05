<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent='submitForm'>
      <slot name="submit">
        <!-- 下面是如果父组件为空的默认内容 -->
        <button type="submit" class="btn btn-primary">Submit123</button>
      </slot>
    </div>
  </form>
</template>
<script lang="ts">
export const emitter: Emitter<any> = mitt()
</script>
<script setup lang="ts" name="ValidateForm">
import { ref, reactive, onUnmounted } from "vue"
import mitt, { type Emitter } from 'mitt'
type ValidateFunc = () => boolean//ValidateFunc 是一个具体的函数类型，它明确指定了函数没有参数（()）且返回值为 boolean。
type ClearFunc = () => void
const emit = defineEmits(['form-submit'])
let funcArr: ValidateFunc[] = []
let clearFuncArr: ClearFunc[] = []
interface CallbackProps {
  validator: ValidateFunc;
  clearInput: ClearFunc;

}
const submitForm = () => {
  try {
    const result = funcArr.map(item => {
      if (typeof item !== 'function') {
        console.error('Invalid item in funcArr:', item);
      }
      return item()
    }).every(result => result)
    //把funcArr里的每个函数取过来（形参），再运行一遍，func()，运行完有一个func()执行完的返回值(改成item了，好理解)
    //every的时候已经都是返回的布尔值数组了，把值取过来，再返回这个值，因为直接调用就行了，但是遍历得写下要遍历什么内容
    emit('form-submit', result)
    //想让app获得<ValidateInput>里输入框的内容，并能对他进行更改，需要绑定v-model，用到了emit，子向父传值并动态改变
    //点击后触发submitForm，把form-submit这个事件传给app文件，app文件接收到后就会触发@form-submit事件，<ValidateForm @form-submit="onFormSubmit">，触发onFormSubmit事件，app在事件触发时调用相应的处理函数onFormSubmit，同时接收传递过来的数据
    //但是有个问题，想要得到整个表单验证结果，需要得到包含的每个<ValidateInput>的验证结果，需要从ValidateInput组件内拿到validataInput方法，所以需要form和input的父子间通信，即用mitt从input里传过来validataInput方法，为什么这里不能直接用emit传呢，因为emit只能传给父组件，而ValidateInput组件是app的子组件，和form文件不是严格父子关系，所以需要用mitt
    //validataInput组件把validataInput方法传给了form组件，为啥app里还要通过ref获取到inputRef.value.validataInput()（原来那个视频是试错的，想引出非直接父子关系怎么传数据）
    //拿到之后呢，怎么让每个<ValidateInput>都返回一个验证结果呢？
    //emitter.emit('form-item-created', validataInput )每个 ValidateInput 组件挂载时，都会触发该事件并传递自身的引用
  } catch (error) {
    console.error('Submit form error:', error)
    emit('form-submit', false)
  }
}

//每个 ValidateInput 组件挂载时，都通过form-item-created触发callback，只需要把每次触发的validataInput返回值都放到一个数组里，再遍历整个数组，然后呢，我需要在点击submit后直接对所有表单选项进行验证，所以在点击后触发submitForm，在里面进行验证，并将验证结果返回给app。我需要在点击submit之后才验证，而不是'每个 ValidateInput 组件挂载时，都通过form-item-created触发callback'，怎么样才能点击submit就触发验证呢
//在 ValidateForm.vue 中定义一个数组 funcArr 来存储每个 ValidateInput 组件的 validataInput 方法。    使用 mitt 监听 form - item - created 事件，并将每次传递过来的 validataInput 方法添加到 funcArr 中。
//每个 ValidateInput 组件都有自己的 validataInput 方法。在每一个 ValidateInput 组件挂载时被添加到 funcArr 中
const callback = (callback: CallbackProps) => {
  if (typeof callback.validator !== 'function') {
    console.error('Invalid validator:', callback.validator);
    return;
  }
  if (typeof callback.clearInput !== 'function') {
    console.error('Invalid clearInput:', callback.clearInput);
    return;
  }
  funcArr.push(callback.validator)
  clearFuncArr.push(callback.clearInput)
}
//当使用 emitter.on('form-item-created', callback) 时，mitt 库的类型定义会期望 callback 接收到的参数类型与事件发送的数据类型相匹配。因此不能简单的func: Function这样，需要定义一下具体的参数类型，即ValidateFunc 是一个具体的函数类型，它明确指定了函数没有参数（()）且返回值为 boolean。
const clearInputs = () => {
  clearFuncArr.forEach(clear => {
    try {
      clear()
    } catch (error) {
      console.log(error)
    }
  })
}
emitter.on('form-item-created', callback)

onUnmounted(() => {
  emitter.off('form-item-created', callback)
  funcArr = []
  clearFuncArr = []
})


</script>
<style scoped></style>
