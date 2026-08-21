export type AppVersion = {
  id: number
  version_code: number
  apk_url: string
  release_notes: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Room = {
  id: number
  name: string
  owner_id: number
  owner_nickname: string
  owner_email: string
  current_members: number
  max_members: number
  created_at: string
  updated_at: string
}

export type RoomMember = {
  user_id: number
  nickname: string
  avatar_url: string
  is_owner: boolean
  mic_status: string
  joined_at: string
}

export type RoomDetail = { room: Room; members: RoomMember[] }
export type RoomList = { list: Room[]; total: number; page: number; page_size: number }
export type Dashboard = { active_rooms: number; current_members: number; current_version: AppVersion | null; recent_rooms: Room[] }
