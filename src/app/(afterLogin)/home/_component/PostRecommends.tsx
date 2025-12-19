'use client'

import { useQuery } from '@tanstack/react-query'
import { getPostRecommends } from '../_lib/getPostRecommends'
import Post from '../../_component/Post'
import type { Post as IPost } from '@/model/Post'

export default function PostRecommends() {
  const { data } = useQuery<IPost[]>({
    queryKey: ['posts', 'recommends'],
    queryFn: getPostRecommends,
    staleTime: 60 * 1000, // 1분
    gcTime: 60 * 5000,
  })

  return data?.map(post => <Post key={post.postId} post={post} />)
}
