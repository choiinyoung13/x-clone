'use client'

import style from '../photoModal.module.css'
import { useState } from 'react'
import cx from 'classnames'

export default function PhotoSlider({ post }: { post: any }) {
  const [index, setIndex] = useState(0)

  const handleNext = () => {
    if (index === post.links.length - 1) return
    setIndex(prev => prev + 1)
  }
  const handlePrev = () => {
    if (index === 0) return
    setIndex(prev => prev - 1)
  }


  return (
    <>
      <img src={post.links[index]} alt={post.content} />
      <div className={style.image} style={{ backgroundImage: `url(${post.links[index]})` }} >

        <div className={style.btnWrapper}>
          <span onClick={handlePrev} className={cx(style.prevBtn, index === 0 && style.hidden)} />
          <span onClick={handleNext} className={cx(style.nextBtn, index === post.links.length - 1 && style.hidden)} />
        </div>
      </div>
    </>
  )
}