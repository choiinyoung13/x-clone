import { Post } from '@/model/Post'
import { QueryFunction } from '@tanstack/react-query'

export const getPostById: QueryFunction<Post, [_1: string, string]> = async ({
  queryKey,
}) => {
  const [_1, id] = queryKey

  const res = await fetch(
    `/api/posts/${id}`,
    {
      next: { tags: ['posts', id] },
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
