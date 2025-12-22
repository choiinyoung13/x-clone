import { PostImage } from './PostImage'
import { User } from './User'

export interface Post {
  postId: number
  content: string
  userId: string
  createdAt: string
  deletedAt: string
  User: User
  Images: PostImage[]
  Hearts: { userId: string }[]
  Reports: { userId: string }[]
  Comments: { userId: string }[]
  _count: { Followers: number; Followings: number }
  Parent: string
  Original: string
}
