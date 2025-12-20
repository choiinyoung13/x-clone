'use client'

import { useQuery } from '@tanstack/react-query'
import Post from '../../_component/Post'
import type { Post as IPost } from '@/model/Post'
import { getSearchResult } from '../_lib/getSearchResult'

type Props = {
  searchParams: { q: string; f?: string; pf?: string }
}

export default function SearchResult({ searchParams }) {
  const { data } = useQuery<
    IPost[],
    Object,
    IPost[],
    [_1: string, _2: string, Props['searchParams']]
  >({
    queryKey: ['posts', 'search', searchParams],
    queryFn: getSearchResult,
    staleTime: 60 * 1000, // 1분
    gcTime: 60 * 5000,
  })

  return data?.map(post => <Post key={post.postId} post={post} />)
}
