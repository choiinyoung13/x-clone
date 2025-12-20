'use client'

import { useQuery } from '@tanstack/react-query'
import { getFollowingRecommends } from '../_lib/getFollowingRecommends'
import type { User } from '@/model/User'
import FollowRecommend from './FollowRecommend'

export default function FollowRecommendSection() {
  const { data } = useQuery<User[]>({
    queryKey: ['users', 'followRecommends'],
    queryFn: getFollowingRecommends,
    staleTime: 60 * 1000,
    gcTime: 60 * 5000,
  })

  return data?.map(user => <FollowRecommend key={user.id} user={user} />)
}
