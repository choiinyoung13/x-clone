'use client'

import BackButton from '../../_component/BackButton'
import style from '../profile.module.css'
import FollowButton from './FollowButton'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@/model/User'
import { getUser } from '../_lib/getUser'
import { useSession } from 'next-auth/react'

type Props = {
  username: string
}

export default function UserInfo({ username }: Props) {
  const { data } = useSession()
  const { data: user, error } = useQuery<
    User,
    Object,
    User,
    [_1: string, _2: string]
  >({
    queryKey: ['users', username],
    queryFn: getUser,
    staleTime: 60 * 1000,
    gcTime: 60 * 5000,
  })

  if (error) {
    return (
      <>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>프로필</h3>
        </div>
        <div className={style.userZone}>
          <div className={style.userRow}>
            <div className={style.userImage}></div>
            <div className={style.userName}>
              <div>@{username}</div>
            </div>
          </div>
          <div className={style.empty}>계정이 존재하지 않습니다.</div>
        </div>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className={style.header}>
        <BackButton />
        <h3 className={style.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userRow}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={style.userImage}>
              <img src={user.image} alt={user.id} />
            </div>
            <div className={style.userName}>
              <div>{user.nickname}</div>
              <div>@{user.id}</div>
            </div>
          </div>
          {data?.user?.email !== user.id && <FollowButton user={user} />}
        </div>
        <div className={style.followInfo}>
          <div>
            <span>{user._count.Followers}</span>
            <span>팔로워</span>
          </div>
          <div>
            <span>{user._count.Followings}</span>
            <span>팔로잉</span>
          </div>
        </div>
      </div>
    </>
  )
}
