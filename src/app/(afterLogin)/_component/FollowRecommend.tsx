'use client'

import { useSession } from 'next-auth/react'
import style from './followRecommend.module.css'
import { redirect } from 'next/navigation'
import { User } from '@/model/User'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { MouseEventHandler } from 'react'

interface Props {
  user: User
}

export default function FollowRecommend({ user }: Props) {
  const { data: session } = useSession()
  const isFollowing = user.Followers.some(f => f.id === session?.user?.email)
  const qeueyClient = useQueryClient()

  const follow = useMutation({
    mutationFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}/follow`,
        {
          method: 'post',
          credentials: 'include',
        }
      ),
    onMutate: () => {
      qeueyClient.setQueryData(['users', 'followRecommends'], (old: User[]) => {
        const updated = old.map(v => {
          if (v.id === user.id) {
            return {
              ...v, // v 객체도 새로 만들기
              Followers: [...v.Followers, { id: session?.user.email }], // 배열도 새로 만들기
            }
          }
          return v
        })

        return updated
      })

      const value = qeueyClient.getQueryData(['users', user.id])

      if (value) {
        qeueyClient.setQueryData(['users', user.id], (old: User) => {
          const updated = {
            ...old,
            Followers: [...old.Followers, { id: session?.user.email }], // 새 배열!
          }
          return updated
        })
      }
    },
    onError: () => {
      qeueyClient.setQueryData(['users', 'followRecommends'], (old: User[]) => {
        const updated = old.map(v => {
          if (v.id === user.id) {
            return {
              ...v, // v 객체도 새로 만들기
              Followers: [...v.Followers].filter(
                v => v.id !== session?.user.email
              ),
            }
          }
          return v
        })

        return updated
      })
      const value = qeueyClient.getQueryData(['users', user.id])

      if (value) {
        qeueyClient.setQueryData(['users', user.id], (old: User) => {
          const updated = {
            ...old,
            Followers: [...old.Followers].filter(
              v => v.id !== session?.user.email
            ),
          }
          return updated
        })
      }
    },
  })

  const unfollow = useMutation({
    mutationFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}/follow`,
        {
          method: 'delete',
          credentials: 'include',
        }
      ),
    onMutate: () => {
      qeueyClient.setQueryData(['users', 'followRecommends'], (old: User[]) => {
        const updated = old.map(v => {
          if (v.id === user.id) {
            return {
              ...v, // v 객체도 새로 만들기
              Followers: [...v.Followers].filter(
                v => v.id !== session?.user.email
              ),
            }
          }
          return v
        })

        return updated
      })

      const value = qeueyClient.getQueryData(['users', user.id])

      if (value) {
        qeueyClient.setQueryData(['users', user.id], (old: User) => {
          const updated = {
            ...old,
            Followers: [...old.Followers].filter(
              v => v.id !== session?.user.email
            ),
          }
          return updated
        })
      }
    },
    onError: () => {
      qeueyClient.setQueryData(['users', 'followRecommends'], (old: User[]) =>
        old?.map(v =>
          v.id === user.id
            ? {
                ...v,
                Followers: [...v.Followers].filter(
                  v => v.id !== session?.user.email
                ),
              } // push 대신 새 배열 생성
            : v
        )
      )

      const value = qeueyClient.getQueryData(['users', user.id])

      if (value) {
        qeueyClient.setQueryData(['users', user.id], (old: User) => {
          const updated = {
            ...old,
            Followers: [...old.Followers, { id: session?.user.email }], // 새 배열!
          }
          return updated
        })
      }
    },
  })

  const onFollow: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      redirect('/login')
    }

    follow.mutate()
  }
  const onUnFollow: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      redirect('/login')
    }

    const res = confirm('팔로우를 취소하시겠습니까?')
    if (res) {
      unfollow.mutate()
    }
  }

  if (user.id === session?.user.email) {
    return null
  }

  return (
    <Link href={`/${user.id}`} className={style.container}>
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
        {isFollowing ? (
          <button className={style.following} onClick={onUnFollow}></button>
        ) : (
          <button className={style.follow} onClick={onFollow}>
            팔로우
          </button>
        )}
      </div>
    </Link>
  )
}
