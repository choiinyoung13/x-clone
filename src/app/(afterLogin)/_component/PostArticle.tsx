'use client'

import { EventHandler, ReactNode } from 'react'
import style from './post.module.css'
import { useRouter } from 'next/navigation'
import { Post } from '@/model/Post'
import { useModalStore } from '@/store/modal'

type props = {
  children: ReactNode
  post: Post
}

export default function PostArticle({ children, post }: props) {
  const router = useRouter()
  const modalStore = useModalStore()

  const handleClick = () => {
    modalStore.setData(post)
    router.push(`/${post.User.id}/status/${post.postId}`)
  }

  return (
    <article onClick={handleClick} className={style.post}>
      {children}
    </article>
  )
}
