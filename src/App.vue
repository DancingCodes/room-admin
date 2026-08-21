<script setup lang="ts">
import { DataBoard, Files, House, SwitchButton } from '@element-plus/icons-vue'
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
        <RouterLink to="/versions"><el-icon><Files /></el-icon>App 版本</RouterLink>
      </nav>
      <button class="logout" type="button" @click="logout"><el-icon><SwitchButton /></el-icon>退出登录</button>
    </aside>
    <el-container class="main-area"><RouterView /></el-container>
  </el-container>
</template>

<style lang="scss">
:root { color: #172121; background: #f5f6f5; font-synthesis: none; }
* { box-sizing: border-box; }
body { min-width: 320px; margin: 0; background: #f5f6f5; }
button, input, textarea { font: inherit; }

.admin-shell { min-height: 100vh; }

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 224px;
  display: flex;
  flex-direction: column;
  padding: 24px 14px;
  color: #d8e3dc;
  background: #182321;

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 10px 28px;
    color: #f7fbf8;
    font-size: 17px;
    text-decoration: none;

    span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 7px; color: #172121; background: #a8dbc8; font-weight: 800; }
  }

  nav {
    display: grid;
    gap: 4px;

    a {
      height: 42px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 10px;
      border-radius: 5px;
      color: #b9c9c0;
      font-size: 14px;
      text-decoration: none;

      &:hover, &.router-link-active { color: #fff; background: #2e403b; }
    }
  }

  .logout {
    width: 100%;
    height: 42px;
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    border: 0;
    border-radius: 5px;
    color: #b9c9c0;
    background: transparent;
    font-size: 14px;
    cursor: pointer;

    &:hover { color: #fff; background: #2e403b; }
  }
}

.main-area { min-height: 100vh; margin-left: 224px; padding: 38px 44px 60px; }

@media (max-width: 760px) {
  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
    padding: 14px;

    .brand { padding: 0 8px; }
    nav { display: flex; margin-top: 16px; }
    nav a { flex: 1; justify-content: center; }
    .logout { display: none; }
  }

  .main-area { margin: 0; padding: 24px 16px 40px; }
}
</style>
