'use client'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import style from './post.module.css'
import cx from 'classnames'
import { MouseEventHandler } from 'react'
import { addHeart } from '../_lib/addHeart'
import { Post } from '@/model/Post'
import { deleteHeart } from '../_lib/deleteHeart'
import { useSession } from 'next-auth/react'
import { produce } from 'immer'
import { addRepost } from '../_lib/addRepost'
import { deleteRepost } from '../_lib/deleteRepost'
import { useRouter } from 'next/navigation'
import { useModalStore } from '@/store/modal'

type Props = {
  white?: boolean
  post: Post
  noAction?: boolean
}

export default function ActionButtons({ white, post, noAction }: Props) {
  const { data: session } = useSession()
  const modalStore = useModalStore()
  const router = useRouter()

  const reposted = !!post.Reposts?.find(
    heart => heart.userId === session?.user?.email
  )

  const liked = !!post.Hearts?.find(
    heart => heart.userId === session?.user?.email
  )

  const queryClient = useQueryClient()
  const { postId } = post
  const userEmail = session?.user?.email

  const updatePostInCache = (
    option: 'heart' | 'unheart' | 'repost' | 'unrepost',
    queryKey: readonly unknown[],
    value: Post | InfiniteData<Post[]> | undefined
  ) => {
    if (!value) return

    const newValue = produce(value, draft => {
      if ('pages' in draft) {
        // InfiniteData인 경우
        const post = draft.pages.flat().find(p => p.postId === postId)
        if (post) {
          if (option === 'heart') {
            // 이미 좋아요가 있는지 확인
            if (!post.Hearts.some(h => h.userId === userEmail)) {
              post.Hearts.push({ userId: userEmail as string })
            }
          } else if (option === 'unheart') {
            post.Hearts = post.Hearts.filter(h => h.userId !== userEmail)
          }

          if (option === 'repost') {
            // 이미 재게시글이 있는지 확인
            if (!post.Reposts.some(h => h.userId === userEmail)) {
              post.Reposts.push({ userId: userEmail as string })
            }
          } else if (option === 'unrepost') {
            post.Reposts = post.Reposts.filter(h => h.userId !== userEmail)
          }
        }
      } else if ('postId' in draft && draft.postId === postId) {
        // 단일 Post인 경우
        if (option === 'heart') {
          // 좋아요
          if (!draft.Hearts.some(h => h.userId === userEmail)) {
            draft.Hearts.push({ userId: userEmail as string })
          }
        } else if (option === 'unheart') {
          draft.Hearts = draft.Hearts.filter(h => h.userId !== userEmail)
        }

        if (option === 'repost') {
          // 재게시글
          if (!draft.Reposts.some(h => h.userId === userEmail)) {
            draft.Reposts.push({ userId: userEmail as string })
          }
        } else if (option === 'unrepost') {
          draft.Reposts = draft.Reposts.filter(h => h.userId !== userEmail)
        }
      }
    })

    queryClient.setQueryData(queryKey, newValue)
  }

  const heart = useMutation({
    mutationFn: () => addHeart(postId),
    onMutate() {
      if (modalStore.data) {
        modalStore.setData({
          ...post,
          heartCount: post.heartCount + 1,
          Hearts: [...post.Hearts, { userId: session.user.email }],
        })
      }

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('heart', queryKey, value)
        }
      })
    },
    onError(error) {
      console.error('좋아요 처리 실패:', error)
      alert(
        error instanceof Error
          ? error.message
          : '좋아요 처리 중 오류가 발생했습니다.'
      )

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('unheart', queryKey, value)
        }
      })
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      })
    },
  })

  const unheart = useMutation({
    mutationFn: () => deleteHeart(postId),
    onMutate() {
      if (modalStore.data) {
        modalStore.setData({
          ...post,
          heartCount: post.heartCount - 1,
          Hearts: post.Hearts.filter(v => v.userId !== session.user.email),
        })
      }

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('unheart', queryKey, value)
        }
      })
    },
    onError(error) {
      console.error('좋아요 취소 처리 실패:', error)
      alert(
        error instanceof Error
          ? error.message
          : '좋아요 취소 처리 중 오류가 발생했습니다.'
      )

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('heart', queryKey, value)
        }
      })
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      })
    },
  })

  const repost = useMutation({
    mutationFn: () => addRepost(postId),
    onMutate() {
      if (modalStore.data) {
        modalStore.setData({
          ...post,
          repostCount: post.repostCount + 1,
          Reposts: [...post.Reposts, { userId: session.user.email }],
        })
      }

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('repost', queryKey, value)
        }
      })
    },
    onError(error) {
      console.error('재게시 처리 실패:', error)
      alert(
        error instanceof Error
          ? error.message
          : '재게시 처리 중 오류가 발생했습니다.'
      )

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('unrepost', queryKey, value)
        }
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const unrepost = useMutation({
    mutationFn: () => deleteRepost(postId),
    onMutate() {
      if (modalStore.data) {
        modalStore.setData({
          ...post,
          repostCount: post.repostCount - 1,
          Reposts: post.Reposts.filter(v => v.userId !== session.user.email),
        })
      }

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('unrepost', queryKey, value)
        }
      })
    },
    onError(error) {
      console.error('재게시 취소 처리 실패:', error)
      alert(
        error instanceof Error
          ? error.message
          : '재게시 취소 처리 중 오류가 발생했습니다.'
      )

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey)

      queryKeys.forEach(queryKey => {
        if (queryKey[0] === 'posts') {
          const value = queryClient.getQueryData<Post | InfiniteData<Post[]>>(
            queryKey
          )
          updatePostInCache('repost', queryKey, value)
        }
      })
    },
    onSettled: () => {
      console.log(post.Reposts.length)

      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const onClickComment: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation()
    modalStore.setMode('comment')
    modalStore.setData(post)
    router.push('/compose/tweet')
  }
  const onClickRepost: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation()
    if (post?.User?.id === session?.user?.email) {
      alert('본인 글을 재게시 할 수 없습니다.')
      return
    } else if (post.content === 'repost') {
      alert('원본 글만 재게시 할 수 있습니다.')
      return
    }
    reposted ? unrepost.mutate() : repost.mutate()
  }
  const onClickHeart: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation()
    liked ? unheart.mutate() : heart.mutate()
  }

  if (noAction) {
    return null
  }

  return (
    <div className={style.actionButtons}>
      <div className={cx(style.commentButton, white && style.white)}>
        <button onClick={onClickComment}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
            </g>
          </svg>
        </button>
        <div className={style.count}>{post.commentCount || ''}</div>
      </div>

      <div
        className={cx(
          style.repostButton,
          reposted && style.reposted,
          white && style.white
        )}
      >
        <button onClick={onClickRepost}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
            </g>
          </svg>
        </button>
        <div className={style.count}>{post.repostCount || ''}</div>
      </div>

      <div
        className={cx([
          style.heartButton,
          liked && style.liked,
          white && style.white,
        ])}
      >
        <button onClick={onClickHeart}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
            </g>
          </svg>
        </button>
        <div className={style.count}>{post.heartCount || ''}</div>
      </div>
    </div>
  )
}
