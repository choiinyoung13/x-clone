import style from './profile.module.css'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getUser } from './_lib/getUser'
import { getUserPosts } from './_lib/getUserPosts'
import UserPosts from './_component/UserPosts'
import User from './_component/UserInfo'

type Props = {
  params: Promise<{ username: string }>
}

export default async function Profile({ params }: Props) {
  const { username } = await params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['users', username],
    queryFn: getUser,
  })
  await queryClient.prefetchQuery({
    queryKey: ['posts', 'users', username],
    queryFn: getUserPosts,
  })

  const dehydrateState = dehydrate(queryClient)

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydrateState}>
        <User username={username} />
        <UserPosts username={username} />
      </HydrationBoundary>
    </main>
  )
}
