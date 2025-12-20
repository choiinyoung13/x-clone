'use client'

import BackButton from '@/app/(afterLogin)/_component/BackButton'
import style from './profile.module.css'
import Post from '../_component/Post'
import FollowButton from './_component/FollowButton'
import { useQuery } from '@tanstack/react-query'
import { User } from '@/model/User'
import { getUser } from './_lib/getUser'
import { useParams } from 'next/navigation'
import { getUserPosts } from './_lib/getUserPosts'
import type { Post as IPost } from '@/model/Post'

type Props = {
  username: string
}

export default function Profile() {
  const { username } = useParams()
  const { data: user } = useQuery<
    User,
    Object,
    User,
    [_1: string, Props['username']]
  >({
    queryKey: ['user', username as string],
    queryFn: getUser,
    staleTime: 60 * 1000,
    gcTime: 60 * 5000,
  })

  const { data: userPosts } = useQuery<
    IPost[],
    Object,
    IPost[],
    [_1: string, _2: string, Props['username']]
  >({
    queryKey: ['posts', 'user', username as string],
    queryFn: getUserPosts,
    staleTime: 60 * 1000,
    gcTime: 60 * 5000,
    enabled: !!user,
  })

  return (
    <main className={style.main}>
      <div className={style.header}>
        <BackButton />
        <h3 className={style.headerTitle}>{user?.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userRow}>
          <div className={style.userImage}>
            <img src={user?.image} alt={user?.id} />
          </div>
          <div className={style.userName}>
            <div>{user?.nickname}</div>
            <div>@{user?.id}</div>
          </div>

          <FollowButton />
        </div>
      </div>
      <div>
        {userPosts?.map(post => (
          <Post key={post.postId} post={post} />
        ))}
      </div>
    </main>
  )
}
