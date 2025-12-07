'use client'

import { ReactNode } from 'react'
import style from './post.module.css'
import { useRouter } from 'next/navigation'

type props = {
  children: ReactNode
  post: {
    postId: number
    User: {
      id: string
      nickname: string
      image: string
    }
    content: string
    createdAt: Date
    Images: any[]
  }
}

export default function PostArticle({ children, post }: props) {
  const router = useRouter()

  const handelClick = () => {
    router.push(`/${post.User.id}/status/${post.postId}`)
  }

  return (
    <article onClickCapture={handelClick} className={style.post}>
      {children}
    </article>
  )
}
