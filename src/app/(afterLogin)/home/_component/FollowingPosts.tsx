'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import Post from '../../_component/Post'
import type { Post as IPost } from '@/model/Post'
import { getFollowingPost } from '../_lib/getFollowingPost'
import styles from '../home.module.css'

export default function FollowingPosts() {
  const { data } = useSuspenseQuery<IPost[]>({
    queryKey: ['posts', 'followings'],
    queryFn: getFollowingPost,
    staleTime: 60 * 1000, // 1분
    gcTime: 60 * 5000,
  })

  return data?.map(post => <Post key={post.postId} post={post} />)
}
