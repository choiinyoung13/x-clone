import { Message } from '@/model/Message'
import { QueryFunction } from '@tanstack/react-query'

export const getMessages: QueryFunction<
  Message[],
  [string, { senderId: string; receiverId: string }, string],
  number
> = async ({ pageParam, queryKey }) => {
  const [_, userInfo] = queryKey
  const res = await fetch(
    `/api/users/${userInfo.senderId}/rooms/${userInfo.receiverId}?cursor=${pageParam}`,
    {
      next: {
        tags: ['rooms'],
      },
      credentials: 'include',
      cache: 'no-store',
    }
  )
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
