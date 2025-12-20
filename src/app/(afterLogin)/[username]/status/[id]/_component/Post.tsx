'use client'

import Post from '@/app/(afterLogin)/_component/Post'
import type { Post as IPost } from '@/model/Post'
import { useQuery } from '@tanstack/react-query'
import { getPostById } from '../_lib/getPostById'

interface Props {
  id: string
  username: string
  noImage?: boolean
}

export default function SinglePost({ noImage, id, username }: Props) {
  const { data: post, error } = useQuery<
    IPost,
    Object,
    IPost,
    [_1: string, string, _3: string, string]
  >({
    queryKey: ['users', username, 'posts', id],
    queryFn: getPostById,
    staleTime: 60 * 1000, // 1분
    gcTime: 60 * 5000,
  })

  if (error) {
    return (
      <div style={{ fontSize: 26, fontWeight: 'bold', padding: 18 }}>
        계정이 존재하지 않습니다.
      </div>
    )
  }

  if (!post) {
    return null
  }

  return <Post noImage={noImage} post={post} />
}
