import style from './profile.module.css'
import BackButton from '@/app/(afterLogin)/_component/BackButton'
import CommentForm from './_component/CommentForm'
import SinglePost from './_component/Post'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getCommentsById } from './_lib/getCommentsById'
import Comments from './_component/Comments'

import { User } from '@/model/User'
import { Post } from '@/model/Post'
import { getUserServer } from '@/app/(afterLogin)/[username]/_lib/getUserServer'
import { Metadata } from 'next'
import { getPostByIdServer } from './_lib/getPostByIdServer'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, id } = await params
  const [user, post]: [User, Post] = await Promise.all([
    getUserServer({ queryKey: ['users', username] }),
    getPostByIdServer({ queryKey: ['posts', id] }),
  ])
  return {
    title: `Z에서 ${user.nickname} 님 : ${post.content}`,
    description: post.content,
  }
}

type Props = {
  params: Promise<{ id: string; username: string }>
}

export default async function Page({ params }: Props) {
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
    <div className={style.main}>
      <div className={style.statusFixed}>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>게시하기</h3>
        </div>
      </div>
      <div style={{ marginTop: 53 }}>
        <HydrationBoundary state={dehydrateState}>
          <SinglePost id={id} />
          <CommentForm id={id} username={username} />
          <Comments id={id} username={username} />
        </HydrationBoundary>
      </div>
    </div>
  )
}
