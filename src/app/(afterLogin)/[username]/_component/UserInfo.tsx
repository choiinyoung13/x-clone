'use client'

import BackButton from '../../_component/BackButton'
import style from '../profile.module.css'
import FollowButton from './FollowButton'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@/model/User'
import { getUser } from '../_lib/getUser'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Props = {
  username: string
}

export default function UserInfo({ username }: Props) {
  const { data } = useSession()
  const router = useRouter()
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

  const onMessage = () => {
    const ids = [data?.user?.email, user.id]
    ids.sort()
    router.push(`/messages/${ids.join('-')}`)
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
          {data?.user?.email !== user.id && (
            <div className={style.rightSection}>
              <button onClick={onMessage} className={style.messageButton}>
                <svg
                  viewBox="0 0 24 24"
                  width={18}
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                  </g>
                </svg>
              </button>
              <FollowButton user={user} />
            </div>
          )}
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
