<script setup lang="ts">
import { DataBoard, House, SwitchButton, Version } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearToken } from './services/auth'

const route = useRoute()
const router = useRouter()
const isLogin = computed(() => route.path === '/login')

function logout() {
  clearToken()
  router.replace('/login')
}
</script>

<template>
  <RouterView v-if="isLogin" />
  <el-container v-else class="admin-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/dashboard"><span>星</span><strong>星闪管理台</strong></RouterLink>
      <nav>
        <RouterLink to="/dashboard"><el-icon><DataBoard /></el-icon>概览</RouterLink>
        <RouterLink to="/rooms"><el-icon><House /></el-icon>当前房间</RouterLink>
        <RouterLink to="/versions"><el-icon><Version /></el-icon>App 版本</RouterLink>
      </nav>
      <button class="logout" type="button" @click="logout"><el-icon><SwitchButton /></el-icon>退出登录</button>
    </aside>
    <el-container class="main-area"><RouterView /></el-container>
  </el-container>
</template>
