import { ElMessage } from 'element-plus'
import router from '@/router'
import { clearToken, getToken } from './auth'

const apiBase = import.meta.env.VITE_API_BASE ?? 'https://room.moonc.love/api/v1/admin'

type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${apiBase}${path}`, { ...options, headers })
  } catch {
    throw new Error('无法连接管理服务')
  }

  const body = await response.json() as ApiResponse<T>
  if (body.code === 401) {
    clearToken()
    if (router.currentRoute.value.path !== '/login') {
      ElMessage.error('登录已失效，请重新登录')
      await router.replace('/login')
    }
    throw new Error(body.message)
  }
  if (body.code !== 200) throw new Error(body.message || '请求失败')
  return body.data
}

export function get<T>(path: string) {
  return request<T>(path)
}

export function post<T>(path: string, data?: unknown) {
  return request<T>(path, { method: 'POST', body: data === undefined ? undefined : JSON.stringify(data) })
}

export function put<T>(path: string, data: unknown) {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(data) })
}
