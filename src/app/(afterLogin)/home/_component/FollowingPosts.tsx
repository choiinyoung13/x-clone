'use client'

import { useQuery } from '@tanstack/react-query'
import Post from '../../_component/Post'
import type { Post as IPost } from '@/model/Post'
import { getFollowingPost } from '../_lib/getFollowingPost'

export default function FollowingPosts() {
  const { data } = useQuery<IPost[]>({
    queryKey: ['posts', 'followings'],
    queryFn: getFollowingPost,
    staleTime: 60 * 1000, // 1분
    gcTime: 60 * 5000,
  })

  return data?.map(post => <Post key={post.postId} post={post} />)
}
