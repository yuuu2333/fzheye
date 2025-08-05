<template>

  <ValidateForm @form-submit="onFormSubmit" ref="loginForm">
    <div class="mb-3">
      <label class="form-label">电子邮箱</label>
      <ValidateInput type="text" :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱">
      </ValidateInput>

    </div>

    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">密码</label>

      <ValidateInput type="password" :rules="passwordRules" v-model="passwordVal" placeholder="请输入密码"></ValidateInput>
    </div>
    <div class="mb-3 form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">同意用户协议</label>
    </div>
    <template #submit>
      <button type="submit" class="btn btn-primary">登录</button>
    </template>
  </ValidateForm>
</template>
<script setup lang="ts">
//登录过程 1.访问/login获取登录token2.设置通用的header,每次都把token传过去3.访问/current获取登录信息=>更新store
import { ref, reactive } from "vue"
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput from '@/components/ValidateInput.vue'
import type { RuleProps } from '@/components/ValidateInput.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { createMessage } from '@/components/createMessage'

const router = useRouter()
const userStore = useUserStore()
const loginForm = ref()
const onFormSubmit = async (result: boolean) => {
  console.log('验证结果是', result);
  if (result) {
    //表单校验通过后发起登录请求，接口请求成功则跳转首页
    try {
      await userStore.login(emailVal.value, passwordVal.value)
      await userStore.fetchCurrentUser()
      createMessage('登录成功,2s后跳转页面', 'success', 2000)
      setTimeout(() => {
        router.push('/')
      },2000)
    } catch (error) {
      console.log(error);
    }
    // userStore.login()
  } else {
    createMessage('登录失败,请检查邮箱和密码', 'error', 2000)
    loginForm.value.clearInputs()
  }
}
const emailVal = ref('')
const passwordVal = ref('')
const emailRules: RuleProps[] = [
  { type: "required", message: "电子邮箱地址不能为空" },
  { type: "email", message: "请输入正确的电子邮箱地址" },
]
const passwordRules: RuleProps[] = [
  { type: "required", message: "密码不能为空" }
]
</script>
<style scoped></style>
