import { Post } from '@/model/Post'
import { QueryFunction } from '@tanstack/react-query'

export const getCommentsById: QueryFunction<
  Post[],
  [_1: string, string, _3: string, string, _5: string]
> = async ({ queryKey }) => {
  const [_1, username, _3, id, _5] = queryKey

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/posts/${id}/comments`,
    {
      next: { tags: ['users', username, 'posts', id, 'comments'] },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
