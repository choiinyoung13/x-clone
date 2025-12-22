'use client'

import { ReactNode } from 'react'
import style from './post.module.css'
import { useRouter } from 'next/navigation'
import { Post } from '@/model/Post'

type props = {
  children: ReactNode
  post: Post
}

export default function PostArticle({ children, post }: props) {
  const router = useRouter()

  const handelClick = () => {
    router.push(`/${post.User.id}/status/${post.postId}`)
  }

  return (
    <article onClick={handelClick} className={style.post}>
      {children}
    </article>
  )
}
