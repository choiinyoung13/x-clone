import style from './profile.module.css'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import { getUserPosts } from './_lib/getUserPosts'
import UserPosts from './_component/UserPosts'
import UserInfo from './_component/UserInfo'
import { getUserServer } from './_lib/getUserServer'
import { Metadata } from 'next'
import { User } from '@/model/User'

type Props = {
  params?: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { username } = await params
    const user: User = await getUserServer({
      queryKey: ['users', username],
    })

    return {
      title: `${user.nickname} (${user.id}) / Z`,
      description: `${user.nickname} (${user.id}) 프로필 / Z`,
    }
  } catch {
    return {
      title: '프로필 / Z',
      description: '프로필 / Z',
    }
  }
}

export default async function Profile({ params }: Props) {
  const { username } = await params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['users', username],
    queryFn: getUserServer,
  })
  await queryClient.prefetchQuery({
    queryKey: ['posts', 'users', username],
    queryFn: getUserPosts,
  })

  const dehydrateState = dehydrate(queryClient)

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydrateState}>
        <UserInfo username={username} />
        <UserPosts username={username} />
      </HydrationBoundary>
    </main>
  )
}
