import style from './photoModal.module.css'
import CommentForm from '../../../../../../[username]/status/[id]/_component/CommentForm'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getCommentsById } from '@/app/(afterLogin)/[username]/status/[id]/_lib/getCommentsById'
import Comments from '@/app/(afterLogin)/[username]/status/[id]/_component/Comments'
import SinglePost from '@/app/(afterLogin)/[username]/status/[id]/_component/Post'
import ImageZone from './_component/ImageZone'
import { getPostByIdServer } from '@/app/(afterLogin)/[username]/status/[id]/_lib/getPostByIdServer'

type Props = {
  params: Promise<{ id: string; username: string }>
}

export default async function photoModal({ params }: Props) {
  const { username, id } = await params

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['posts', id],
    queryFn: getPostByIdServer,
  })
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', id, 'comments'],
    queryFn: getCommentsById,
    initialPageParam: 0,
  })
  const dehydrateState = dehydrate(queryClient)

  return (
    <div className={style.container}>
      <HydrationBoundary state={dehydrateState}>
        <ImageZone id={id} username={username} />
        <div className={style.commentZone}>
          <SinglePost noImage id={id} />
          <CommentForm id={id} username={username} />
          <Comments id={id} username={username} />
        </div>
      </HydrationBoundary>
    </div>
  )
}
