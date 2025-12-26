import { Post } from '@/model/Post'
import { QueryFunction } from '@tanstack/react-query'

export const getCommentsById: QueryFunction<
  Post[],
  [_1: string, string, _3: string]
> = async ({ queryKey, pageParam }) => {
  const [_1, id, _3] = queryKey

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments?cursor=${pageParam}`,
    {
      next: { tags: ['posts', id, 'comments'] },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
