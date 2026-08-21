<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/services/api'
import { setToken } from '@/services/auth'

const router = useRouter()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

async function login() {
  if (!form.username.trim() || !form.password) return
  loading.value = true
  try {
    const data = await post<{ token: string }>('/auth/login', form)
    setToken(data.token)
    await router.replace('/dashboard')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-brand"><span>星</span>星闪管理台</div>
      <el-form label-position="top" @submit.prevent="login">
        <el-form-item label="账号">
          <el-input v-model="form.username" :prefix-icon="User" autocomplete="username" placeholder="管理员账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" :prefix-icon="Lock" type="password" show-password autocomplete="current-password" placeholder="管理员密码" @keyup.enter="login" />
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="login">登录</el-button>
      </el-form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #edf1ed;

  .login-card {
    width: min(100%, 390px);
    padding: 34px;
    border: 1px solid #dce3de;
    border-radius: 7px;
    background: #fff;
    box-shadow: 0 12px 30px rgb(23 33 33 / 8%);

    .login-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
      font-size: 21px;
      font-weight: 700;

      span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 7px; background: #a8dbc8; }
    }

    :deep(.el-button) { width: 100%; }
  }
}
</style>
