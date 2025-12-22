import type { Post } from './Post'

export interface User {
  id: string
  nickname: string
  password: string
  image: string
  posts: Post[]
  Followers: { id: string }[]
  _count: { Followers: number; Followings: number }
}
