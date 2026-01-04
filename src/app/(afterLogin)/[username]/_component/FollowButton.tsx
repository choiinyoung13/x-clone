'use client'
import { useSession } from 'next-auth/react'
import style from '../profile.module.css'
import { redirect } from 'next/navigation'
import type { User } from '@/model/User'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MouseEventHandler } from 'react'

type Props = {
  user: User
}

export default function FollowButton({ user }: Props) {
  const { data } = useSession()
  const isFollowing = user.Followers.some(f => f.id === data?.user?.email)
  const qeueyClient = useQueryClient()

  const follow = useMutation({
    mutationFn: async () =>
      await fetch(
        `/api/users/${user.id}/follow`,
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
              Followers: [...v.Followers, { id: data?.user.email }], // 배열도 새로 만들기
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
            Followers: [...old.Followers, { id: data?.user.email }], // 새 배열!
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
                v => v.id !== data?.user.email
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
              v => v.id !== data?.user.email
            ),
          }
          return updated
        })
      }
    },
    onSuccess: () => {
      qeueyClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const unfollow = useMutation({
    mutationFn: async () =>
      await fetch(
        `/api/users/${user.id}/follow`,
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
                v => v.id !== data?.user.email
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
              v => v.id !== data?.user.email
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
                  v => v.id !== data?.user.email
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
            Followers: [...old.Followers, { id: data?.user.email }], // 새 배열!
          }
          return updated
        })
      }
    },
    onSuccess: () => {
      qeueyClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const onFollow: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    e.stopPropagation()

    if (!data) {
      redirect('/login')
    }

    follow.mutate()
  }
  const onUnFollow: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    e.stopPropagation()

    if (!data) {
      redirect('/login')
    }

    const res = confirm('팔로우를 취소하시겠습니까?')
    if (res) {
      unfollow.mutate()
    }
  }

  return (
    <div>
      {isFollowing ? (
        <button className={style.following} onClick={onUnFollow}></button>
      ) : (
        <button className={style.follow} onClick={onFollow}>
          팔로우
        </button>
      )}
    </div>
  )
}
