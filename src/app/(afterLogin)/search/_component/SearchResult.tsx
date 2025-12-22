'use client'

import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import Post from '../../_component/Post'
import type { Post as IPost } from '@/model/Post'
import { getSearchResult } from '../_lib/getSearchResult'
import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
  searchParams: { q: string; f?: string; pf?: string }
}

export default function SearchResult({ searchParams }) {
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      IPost[],
      Object,
      InfiniteData<IPost[]>,
      [_1: string, _2: string, Props['searchParams']],
      number
    >({
      queryKey: ['posts', 'search', searchParams],
      queryFn: getSearchResult,
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
