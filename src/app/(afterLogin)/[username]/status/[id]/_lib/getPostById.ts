import { Post } from '@/model/Post'
import { QueryFunction } from '@tanstack/react-query'

export const getPostById: QueryFunction<
  Post,
  [_1: string, string, _3: string, string]
> = async ({ queryKey }) => {
  const [_1, username, _3, postId] = queryKey

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/posts/${postId}`,
    {
      next: { tags: ['users', username, 'posts', postId] },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
