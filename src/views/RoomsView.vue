<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { get } from '@/services/api'
import type { Room, RoomDetail, RoomList } from '@/services/types'

const rooms = ref<Room[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 20
const loading = ref(false)
const drawerOpen = ref(false)
const detailLoading = ref(false)
const detail = ref<RoomDetail | null>(null)

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function load() {
  loading.value = true
  try {
    const data = await get<RoomList>(`/rooms?page=${page.value}&page_size=${pageSize}`)
    rooms.value = data.list
    total.value = data.total
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取房间失败')
  } finally {
    loading.value = false
  }
}

async function openDetail(row: Room) {
  drawerOpen.value = true
  detail.value = null
  detailLoading.value = true
  try {
    detail.value = await get<RoomDetail>(`/rooms/${row.id}`)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取房间详情失败')
  } finally {
    detailLoading.value = false
  }
}

function changePage(nextPage: number) {
  page.value = nextPage
  load()
}

onMounted(load)
</script>

<template>
  <main class="page">
    <header class="page-header"><div><h1>当前房间</h1><p>只读查看目前仍存在的房间和成员情况。</p></div><el-button :icon="Refresh" :loading="loading" @click="load">刷新</el-button></header>
    <section class="panel">
      <el-table v-loading="loading" :data="rooms" style="width: 100%" @row-click="openDetail">
        <el-table-column prop="id" label="ID" width="86" />
        <el-table-column prop="name" label="房间名称" min-width="175" />
        <el-table-column label="创建者" min-width="190"><template #default="{ row }"><div class="owner-cell"><b>{{ row.owner_nickname }}</b><span>{{ row.owner_email }}</span></div></template></el-table-column>
        <el-table-column label="成员" width="105"><template #default="{ row }">{{ row.current_members }} / {{ row.max_members }}</template></el-table-column>
        <el-table-column label="创建时间" min-width="175"><template #default="{ row }">{{ formatTime(row.created_at) }}</template></el-table-column>
        <el-table-column label="最后变动" min-width="175"><template #default="{ row }">{{ formatTime(row.updated_at) }}</template></el-table-column>
        <el-table-column label="" width="90"><template #default><el-button link type="primary">详情</el-button></template></el-table-column>
      </el-table>
      <div class="pagination"><el-pagination v-model:current-page="page" background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="changePage" /></div>
    </section>

    <el-drawer v-model="drawerOpen" size="min(520px, 100%)" title="房间详情">
      <div v-loading="detailLoading" class="room-detail">
        <template v-if="detail">
          <h2>{{ detail.room.name }}</h2>
          <div class="room-detail-meta">ID：{{ detail.room.id }}<br>创建者：{{ detail.room.owner_nickname }}（{{ detail.room.owner_email }}）<br>成员：{{ detail.room.current_members }} / {{ detail.room.max_members }}<br>创建时间：{{ formatTime(detail.room.created_at) }}</div>
          <el-table :data="detail.members" size="small"><el-table-column label="成员" min-width="170"><template #default="{ row }"><div class="member-name"><img :src="row.avatar_url" alt="" /><span>{{ row.nickname }}</span></div></template></el-table-column><el-table-column label="身份" width="80"><template #default="{ row }">{{ row.is_owner ? '房主' : '成员' }}</template></el-table-column><el-table-column label="麦克风" width="90"><template #default="{ row }">{{ row.mic_status === 'on' ? '开启' : '关闭' }}</template></el-table-column><el-table-column label="加入时间" min-width="150"><template #default="{ row }">{{ formatTime(row.joined_at) }}</template></el-table-column></el-table>
        </template>
      </div>
    </el-drawer>
  </main>
</template>
