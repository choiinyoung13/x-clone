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
  heartCount: number
  repostCount: number
  commentCount: number
  Hearts: { userId: string }[]
  Reposts: { userId: string }[]
  Comments: { userId: string }[]
  _count: { Followers: number; Followings: number }
  Parent?: Post
  Original?: Post
}
