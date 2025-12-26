'use client'

import style from '../photoModal.module.css'
import ActionButtons from '@/app/(afterLogin)/_component/ActionButtons'

import type { Post } from '@/model/Post'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PhotoSlider from './PhotoSlider'
import PhotoModalCloseButton from './PhotoModalCloseButton'
import { getPostById } from '@/app/(afterLogin)/[username]/status/[id]/_lib/getPostById'

type Props = {
  id: string
  username: string
}
export default function ImageZone({ id }: Props) {
  const { data: post } = useQuery<Post>({
    queryKey: ['posts', id],
    queryFn: getPostById,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  })

  if (!post?.Images[0]) {
    return null
  }
  return (
    <div className={style.imageZone}>
      <PhotoSlider post={post} />
      <div className={style.buttonZone}>
        <PhotoModalCloseButton />
        <div className={style.buttonInner}>
          <ActionButtons
            white
            post={post}
            noAction={post.Parent ? true : false}
          />
        </div>
      </div>
    </div>
  )
}
