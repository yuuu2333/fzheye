<template>
  <ValidateForm @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <ValidateInput type="text" :rules="emailRules" v-model="formData.email" placeholder="请输入邮箱地址">
      </ValidateInput>
    </div>

    <div class="mb-3">
      <label class="form-label">昵称</label>
      <ValidateInput type="text" :rules="nameRules" v-model="formData.nickName" placeholder="请输入昵称">
      </ValidateInput>
    </div>

    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">密码</label>
      <ValidateInput type="password" :rules="passwordRules" v-model="formData.password" placeholder="请输入密码">
      </ValidateInput>
    </div>

    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">重复密码</label>
      <ValidateInput type="password" :rules="repeatPassword" v-model="formData.repeatPassword" placeholder="请再次输入密码">
      </ValidateInput>
    </div>

    <template #submit>
      <button type="submit" class="btn btn-primary">注册新用户</button>
    </template>
  </ValidateForm>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput from '@/components/ValidateInput.vue'
import type { RuleProps } from '@/components/ValidateInput.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { createMessage } from '@/components/createMessage'
import axios from 'axios'

const formData = reactive({
  email: '',
  password: '',
  nickName: '',
  repeatPassword: ''
})
const router = useRouter()
const userStore = useUserStore()
const onFormSubmit = async (result: boolean) => {
  console.log('验证结果是', result);
  if (result) {
    //表单校验通过后发起登录请求，接口请求成功则跳转首页
    const payload = {
      email: formData.email,
      password: formData.password,
      nickName: formData.nickName
    }
    axios.post('/users', payload).then(data => {
      createMessage('注册成功,2s后跳转页面', 'success', 2000)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }).catch(error => {
      console.log(error);
    })

    // userStore.login()
  }
}

const emailRules: RuleProps[] = [
  { type: "required", message: "电子邮箱地址不能为空" },
  { type: "email", message: "请输入正确的电子邮箱地址" },
]
const nameRules: RuleProps[] = [
  { type: "required", message: "昵称不能为空" }
]
const passwordRules: RuleProps[] = [
  { type: "required", message: "密码不能为空" }
]
const repeatPassword: RuleProps[] = [
  { type: "required", message: "重复密码不能为空" },
  {
    type: "custom",
    validator: () => {
      return formData.password === formData.repeatPassword
    },
    message: "两次输入的密码不一致"
  }
]
</script>
<style scoped></style>
