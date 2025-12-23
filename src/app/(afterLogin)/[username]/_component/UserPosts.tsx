'use client'

import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getUserPosts } from '../_lib/getUserPosts'
import type { Post as IPost } from '@/model/Post'
import Post from '../../_component/Post'
import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
  username: string
}

export default function UserPosts({ username }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string, _3: string],
    number
  >({
    queryKey: ['posts', 'users', username],
    queryFn: getUserPosts,
    initialPageParam: 0,
    getNextPageParam: lastId => {
      return lastId.at(-1)?.postId
    },
    staleTime: 60 * 1000,
    gcTime: 60 * 5000,
  })

  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['users', username])

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  })

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage()
    }
  }, [inView])

  if (!data) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <>
      {data.pages.map((page, i) => (
        <Fragment key={i}>
          {page.map(post => (
            <Post key={post.postId} post={post} />
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }}></div>
    </>
  )
}
