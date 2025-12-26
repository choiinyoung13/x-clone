'use client'

import {
  InfiniteData,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'
import type { Post as IPost } from '@/model/Post'
import { getCommentsById } from '../_lib/getCommentsById'
import Post from '@/app/(afterLogin)/_component/Post'
import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface Props {
  id: string
  username: string
}

export default function Comments({ id, username }: Props) {
  const queryClient = useQueryClient()
  const post = queryClient.getQueryData(['posts', id])

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      IPost[],
      Object,
      InfiniteData<IPost[]>,
      [_1: string, string, _3: string],
      number
    >({
      queryKey: ['posts', id, 'comments'],
      queryFn: getCommentsById,
      initialPageParam: 0,
      getNextPageParam: lastId => {
        return lastId.at(-1)?.postId
      },
      staleTime: 60 * 1000, // 1분
      gcTime: 60 * 5000,
    })

  if (!post || !data) {
    return null
  }

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

  return (
    <>
      {data.pages.map((page, i) => (
        <Fragment key={i}>
          {page.map(post => (
            <Post key={post.postId} post={post} noAction />
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }}></div>
    </>
  )
}
