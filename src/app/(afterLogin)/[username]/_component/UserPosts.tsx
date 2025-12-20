'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserPosts } from '../_lib/getUserPosts'
import type { Post as IPost } from '@/model/Post'
import Post from '../../_component/Post'

type Props = {
  username: string
}

export default function UserPosts({ username }: Props) {
  const { data: userPosts } = useQuery<
    IPost[],
    Object,
    IPost[],
    [_1: string, _2: string, _3: string]
  >({
    queryKey: ['posts', 'users', username],
    queryFn: getUserPosts,
    staleTime: 60 * 1000,
    gcTime: 60 * 5000,
  })

  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['users', username])

  if (!user) {
    return null
  }

  return (
    <div>
      {userPosts?.map(post => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  )
}
