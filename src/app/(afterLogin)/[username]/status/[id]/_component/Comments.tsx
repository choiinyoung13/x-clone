'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Post as IPost } from '@/model/Post'
import { getCommentsById } from '../_lib/getCommentsById'
import Post from '@/app/(afterLogin)/_component/Post'
import { useEffect } from 'react'

interface Props {
  id: string
  username: string
}

export default function Comments({ id, username }: Props) {
  const queryClient = useQueryClient()
  const post = queryClient.getQueryData(['users', username, 'posts', id])

  const { data } = useQuery<
    IPost[],
    Object,
    IPost[],
    [_1: string, string, _3: string, string, _5: string]
  >({
    queryKey: ['users', username, 'posts', id, 'comments'],
    queryFn: getCommentsById,
    staleTime: 60 * 1000, // 1분
    gcTime: 60 * 5000,
  })

  if (!post || !data) {
    return null
  }

  return data.map(post => <Post key={post.postId} post={post} />)
}
