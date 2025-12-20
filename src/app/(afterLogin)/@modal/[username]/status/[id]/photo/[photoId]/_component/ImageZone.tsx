'use client'

import style from '../photoModal.module.css'
import ActionButtons from '@/app/(afterLogin)/_component/ActionButtons'

import type { Post as IPost } from '@/model/Post'
import { useQuery } from '@tanstack/react-query'
import PhotoSlider from './PhotoSlider'
import PhotoModalCloseButton from './PhotoModalCloseButton'
import { getPostById } from '@/app/(afterLogin)/[username]/status/[id]/_lib/getPostById'

// const photo = {
//   imageId: '1',
//   links: [faker.image.url(), faker.image.url(), faker.image.url()],
//   Post: {
//     content: faker.lorem.text(),
//   },
// }

type Props = {
  id: string
  username: string
}
export default function ImageZone({ id, username }: Props) {
  const { data: post } = useQuery<
    IPost,
    Object,
    IPost,
    [_1: string, string, _3: string, string]
  >({
    queryKey: ['users', username, 'posts', id],
    queryFn: getPostById,
    staleTime: 60 * 1000, // 1분
    gcTime: 60 * 5000,
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
          <ActionButtons white />
        </div>
      </div>
    </div>
  )
}
