import style from './post.module.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import Image from 'next/image'
import Link from 'next/link'
import ActionButtons from './ActionButtons'
import PostArticle from './PostArticle'
import { faker } from '@faker-js/faker'
import PostImages from './PostImages'
import type { Post } from '@/model/Post'

dayjs.locale('ko')
dayjs.extend(relativeTime)

type Props = {
  noImage?: boolean
  post: Post
}

export default function Post({ noImage, post }: Props) {
  const target = post
  if (Math.random() > 0.5 && !noImage) {
    target.Images.push(
      { imageId: 1, link: faker.image.url() },
      { imageId: 2, link: faker.image.url() },
      { imageId: 4, link: faker.image.url() },
      { imageId: 5, link: faker.image.url() }
    )
  }

  return (
    <PostArticle post={target}>
      <div className={style.postWrapper}>
        <div className={style.postUserSection}>
          <Link href={`/${target.User.id}`} className={style.postUserImage}>
            <Image
              src={target.User.image}
              alt={target.User.nickname}
              width={40}
              height={40}
            />
            <div className={style.postShade} />
          </Link>
        </div>
        <div className={style.postBody}>
          <div className={style.postMeta}>
            <Link href={`/${target.User.id}`}>
              <span className={style.postUserName}>{target.User.nickname}</span>
              &nbsp;
              <span className={style.postUserId}>@{target.User.id}</span>
              &nbsp; · &nbsp;
            </Link>
            <span className={style.postDate}>
              {dayjs(target.createdAt).fromNow(true)}
            </span>
          </div>

          <div>{target.content}</div>
          <div className={style.postImageSection}>
            {!noImage && (
              <div>
                <PostImages post={target} />
              </div>
            )}
          </div>
          <ActionButtons />
        </div>
      </div>
    </PostArticle>
  )
}
