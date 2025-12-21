'use client'

import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { getPostRecommends } from '../_lib/getPostRecommends'
import Post from '../../_component/Post'
import type { Post as IPost } from '@/model/Post'
import { Fragment } from 'react/jsx-runtime'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

export default function PostRecommends() {
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      IPost[],
      Object,
      InfiniteData<IPost[]>,
      [_1: string, _2: string],
      number
    >({
      queryKey: ['posts', 'recommends'],
      queryFn: getPostRecommends,
      initialPageParam: 0,
      getNextPageParam: lastId => {
        return lastId.at(-1)?.postId
      },
      staleTime: 60 * 1000, // 1분
      gcTime: 60 * 5000,
    })

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
            <Post key={post.postId} post={post} />
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }}></div>
    </>
  )
}
