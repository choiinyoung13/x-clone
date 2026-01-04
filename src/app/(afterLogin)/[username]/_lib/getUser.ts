import { User } from '@/model/User'
import { QueryFunction } from '@tanstack/react-query'

export const getUser: QueryFunction<User, [_1: string, _2: string]> = async ({
  queryKey,
}) => {
  const [_1, username] = queryKey

  const res = await fetch(
    `/api/users/${username}`,
    {
      next: { tags: ['user', username] },
      credentials: 'include',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
