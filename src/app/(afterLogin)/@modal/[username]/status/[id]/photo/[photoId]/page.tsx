import PhotoModalCloseButton from './_component/PhotoModalCloseButton'
import style from './photoModal.module.css'

import { faker } from '@faker-js/faker'
import ActionButtons from '../../../../../../_component/ActionButtons'
import CommentForm from '../../../../../../[username]/status/[id]/_component/CommentForm'
import Post from '../../../../../../_component/Post'
import PhotoSlider from './_component/PhotoSlider'

export default function photoModal() {
  const photo = {
    imageId: 1,
    links: [faker.image.url(), faker.image.url(), faker.image.url()],
    Post: {
      content: faker.lorem.text(),
    },
  }

  return (
    <div className={style.container}>
      <div className={style.imageZone}>
        <PhotoSlider post={photo} />
        <div className={style.buttonZone}>
          <PhotoModalCloseButton />
          <div className={style.buttonInner}>
            <ActionButtons white />
          </div>
        </div>
      </div>
      <div className={style.commentZone}>
        <Post noImage />
        <CommentForm id={photo.imageId} />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  )
}
