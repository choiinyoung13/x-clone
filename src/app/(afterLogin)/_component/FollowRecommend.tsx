'use client'

import { useSession } from 'next-auth/react'
import style from './followRecommend.module.css'
import { redirect } from 'next/navigation'
import { User } from '@/model/User'

interface Props {
  user: User
}

export default function FollowRecommend({ user }: Props) {
  const { data: session } = useSession()

  const onFollow = () => {
    if (!session) {
      redirect('/login')
    }
  }

  return (
    <div className={style.container}>
      <div className={style.userLogoSection}>
        <div className={style.userLogo}>
          <img src={user.image} alt={user.id} />
        </div>
      </div>
      <div className={style.userInfo}>
        <div className={style.title}>{user.nickname}</div>
        <div className={style.count}>@{user.id}</div>
      </div>
      <div className={style.followButtonSection}>
        <button onClick={onFollow}>팔로우</button>
      </div>
    </div>
  )
}
