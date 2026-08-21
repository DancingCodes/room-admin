const tokenKey = 'room_admin_token'

export function getToken() {
  return localStorage.getItem(tokenKey) ?? ''
}

export function hasToken() {
  return Boolean(getToken())
}

export function setToken(token: string) {
  localStorage.setItem(tokenKey, token)
}

export function clearToken() {
  localStorage.removeItem(tokenKey)
}
