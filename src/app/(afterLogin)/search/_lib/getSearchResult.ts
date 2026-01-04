import { Post } from '@/model/Post'
import { QueryFunction } from '@tanstack/react-query'

export const getSearchResult: QueryFunction<
  Post[],
  [_1: string, _2: string, searchParams: { q: string; f?: string; pf?: string }]
> = async ({ queryKey, pageParam }) => {
  const [_1, _2, searchParams] = queryKey

  const params = new URLSearchParams()
  if (searchParams.q) params.set('q', searchParams.q)
  if (searchParams.f) params.set('f', searchParams.f)
  if (searchParams.pf) params.set('pf', searchParams.pf)
  params.set('cursor', String(pageParam))

  const res = await fetch(
    `/api/posts?${params.toString()}`,
    {
      next: {
        tags: ['posts', 'search', JSON.stringify(searchParams)],
      },
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
