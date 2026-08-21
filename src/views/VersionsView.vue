<script setup lang="ts">
import { Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { get, post, put } from '@/services/api'
import type { AppVersion } from '@/services/types'

const versions = ref<AppVersion[]>([])
const loading = ref(false)
const dialogOpen = ref(false)
const saving = ref(false)
const editing = ref<AppVersion | null>(null)
const form = reactive({ version_code: undefined as number | undefined, apk_url: '', release_notes: '' })

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function load() {
  loading.value = true
  try {
    const data = await get<{ list: AppVersion[] }>('/app-versions')
    versions.value = data.list
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取版本失败')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  form.version_code = undefined
  form.apk_url = ''
  form.release_notes = ''
  dialogOpen.value = true
}

function openEdit(version: AppVersion) {
  editing.value = version
  form.version_code = version.version_code
  form.apk_url = version.apk_url
  form.release_notes = version.release_notes
  dialogOpen.value = true
}

async function save() {
  if (!form.version_code || !form.apk_url.trim() || !form.release_notes.trim()) {
    ElMessage.warning('请填写版本号、APK 地址和更新说明')
    return
  }
  saving.value = true
  try {
    const data = { version_code: form.version_code, apk_url: form.apk_url, release_notes: form.release_notes }
    if (editing.value) await put(`/app-versions/${editing.value.id}`, data)
    else await post('/app-versions', data)
    ElMessage.success(editing.value ? '版本已保存' : '草稿已创建')
    dialogOpen.value = false
    await load()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存失败')
  } finally {
    saving.value = false
  }
}

async function publish(version: AppVersion) {
  try {
    await ElMessageBox.confirm(`发布 v${version.version_code} 会下架当前已发布版本，是否继续？`, '确认发布', { type: 'warning', confirmButtonText: '发布', cancelButtonText: '取消' })
    await post(`/app-versions/${version.id}/publish`)
    ElMessage.success(`v${version.version_code} 已发布`)
    await load()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error instanceof Error ? error.message : '发布失败')
  }
}

async function unpublish(version: AppVersion) {
  try {
    await ElMessageBox.confirm(`下架 v${version.version_code} 后，App 将无法获取已发布版本。是否继续？`, '确认下架', { type: 'warning', confirmButtonText: '下架', cancelButtonText: '取消' })
    await post(`/app-versions/${version.id}/unpublish`)
    ElMessage.success('版本已下架')
    await load()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error instanceof Error ? error.message : '下架失败')
  }
}

onMounted(load)
</script>

<template>
  <main class="page">
    <header class="page-header"><div><h1>App 版本</h1><p>创建草稿，确认 APK 地址和更新说明后发布。</p></div><div class="table-actions"><el-button :icon="Refresh" :loading="loading" @click="load">刷新</el-button><el-button type="primary" :icon="Plus" @click="openCreate">新增版本</el-button></div></header>
    <section class="panel">
      <el-table v-loading="loading" :data="versions" style="width: 100%">
        <el-table-column label="版本" width="110"><template #default="{ row }">v{{ row.version_code }}</template></el-table-column>
        <el-table-column label="状态" width="108"><template #default="{ row }"><el-tag :type="row.is_published ? 'success' : 'info'">{{ row.is_published ? '已发布' : '草稿' }}</el-tag></template></el-table-column>
        <el-table-column prop="apk_url" label="APK 地址" min-width="290" show-overflow-tooltip />
        <el-table-column label="更新时间" min-width="175"><template #default="{ row }">{{ formatTime(row.updated_at) }}</template></el-table-column>
        <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button v-if="!row.is_published" link type="primary" @click="openEdit(row)">编辑</el-button><el-button v-if="!row.is_published" link type="success" @click="publish(row)">发布</el-button><el-button v-else link type="danger" @click="unpublish(row)">下架</el-button></template></el-table-column>
      </el-table>
    </section>

    <el-dialog v-model="dialogOpen" :title="editing ? `编辑 v${editing.version_code}` : '新增版本'" width="min(640px, 92vw)" destroy-on-close>
      <el-form label-position="top">
        <el-form-item label="版本号"><el-input-number v-model="form.version_code" :min="1" :precision="0" controls-position="right" /></el-form-item>
        <el-form-item label="APK 下载地址"><el-input v-model="form.apk_url" placeholder="https://cdn.example.com/xxx.apk" /></el-form-item>
        <el-form-item label="更新说明"><el-input v-model="form.release_notes" type="textarea" :rows="6" placeholder="每行一项更新内容" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogOpen = false">取消</el-button><el-button type="primary" :loading="saving" @click="save">保存草稿</el-button></template>
    </el-dialog>
  </main>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  max-width: 1320px;

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 30px;

    h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.2; }
    p { margin: 0; color: #6c7873; font-size: 14px; }
    .table-actions { display: flex; align-items: center; gap: 10px; }
  }

  .panel { overflow: hidden; border: 1px solid #dce3de; border-radius: 6px; background: #fff; }
}

@media (max-width: 760px) {
  .page .page-header { align-items: stretch; flex-direction: column; }
  .table-actions { flex-wrap: wrap; }
}
</style>
