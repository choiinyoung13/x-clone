'use client'

import style from '../photoModal.module.css'
import { useState } from 'react'
import cx from 'classnames'
import { Post } from '@/model/Post'

interface Props {
  post: Post
}

export default function PhotoSlider({ post }: Props) {
  const [index, setIndex] = useState(0)

  const handleNext = () => {
    if (index === post.Images[index].link.length - 1) return
    setIndex(prev => prev + 1)
  }
  const handlePrev = () => {
    if (index === 0) return
    setIndex(prev => prev - 1)
  }

  // const photo = {
  //   imageId: '1',
  //   links: [faker.image.url(), faker.image.url(), faker.image.url()],
  //   Post: {
  //     content: faker.lorem.text(),
  //   },
  // }

  return (
    <>
      <img src={post.Images[index].link} alt={post.content} />
      <div
        className={style.image}
        style={{ backgroundImage: `url(${post.Images[index].link})` }}
      >
        <div className={style.btnWrapper}>
          <span
            onClick={handlePrev}
            className={cx(style.prevBtn, index === 0 && style.hidden)}
          />
          <span
            onClick={handleNext}
            className={cx(
              style.nextBtn,
              index === post.Images.length - 1 && style.hidden
            )}
          />
        </div>
      </div>
    </>
  )
}
