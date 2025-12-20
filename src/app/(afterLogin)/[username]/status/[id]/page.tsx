import style from './profile.module.css'
import BackButton from '@/app/(afterLogin)/_component/BackButton'
import CommentForm from './_component/CommentForm'
import SinglePost from './_component/Post'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getPostById } from './_lib/getPostById'
import { getCommentsById } from './_lib/getCommentsById'
import Comments from './_component/Comments'

type Props = {
  params: Promise<{ id: string; username: string }>
}

export default async function Page({ params }: Props) {
  const { username, id } = await params

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['users', username, 'posts', id],
    queryFn: getPostById,
  })
  await queryClient.prefetchQuery({
    queryKey: ['users', username, 'posts', id, 'comments'],
    queryFn: getCommentsById,
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
          <SinglePost id={id} username={username} />
          <CommentForm id={id} username={username} />
          <Comments id={id} username={username} />
        </HydrationBoundary>
      </div>
    </div>
  )
}
