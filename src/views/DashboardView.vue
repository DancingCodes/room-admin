<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { get } from '@/services/api'
import type { Dashboard } from '@/services/types'

const dashboard = ref<Dashboard | null>(null)
const loading = ref(false)

function formatTime(value?: string) {
  return value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '-'
}

async function load() {
  loading.value = true
  try {
    dashboard.value = await get<Dashboard>('/dashboard')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取概览失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <main class="page">
    <header class="page-header">
      <div><h1>概览</h1><p>查看当前房间状态与最新发布版本。</p></div>
      <el-button :icon="Refresh" :loading="loading" @click="load">刷新</el-button>
    </header>

    <section class="metrics">
      <article class="metric"><div class="metric-label">当前房间</div><div class="metric-value">{{ dashboard?.active_rooms ?? '-' }}</div></article>
      <article class="metric"><div class="metric-label">房间内人数</div><div class="metric-value">{{ dashboard?.current_members ?? '-' }}</div></article>
      <article class="metric"><div class="metric-label">当前发布版本</div><div class="metric-value small">{{ dashboard?.current_version ? `v${dashboard.current_version.version_code}` : '暂无' }}</div></article>
    </section>

    <section class="panel">
      <div class="panel-header"><h2>最近创建的房间</h2><RouterLink to="/rooms"><el-button link type="primary">查看全部</el-button></RouterLink></div>
      <el-table v-if="dashboard?.recent_rooms?.length" :data="dashboard.recent_rooms" style="width: 100%">
        <el-table-column prop="name" label="房间名称" min-width="180" />
        <el-table-column label="创建者" min-width="180"><template #default="{ row }"><div class="owner-cell"><b>{{ row.owner_nickname }}</b><span>{{ row.owner_email }}</span></div></template></el-table-column>
        <el-table-column label="成员" width="100"><template #default="{ row }">{{ row.current_members }} / {{ row.max_members }}</template></el-table-column>
        <el-table-column label="创建时间" min-width="180"><template #default="{ row }">{{ formatTime(row.created_at) }}</template></el-table-column>
      </el-table>
      <p v-else class="empty-hint">当前没有进行中的房间。</p>
    </section>
  </main>
</template>
