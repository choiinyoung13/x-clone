import Post from '@/app/(afterLogin)/_component/Post'
import style from './profile.module.css'
import BackButton from '@/app/(afterLogin)/_component/BackButton'
import CommentForm from './_component/CommentForm'

type Props = {
  params: { id: string; username: string }
}

export default async function SinglePost({ params }: Props) {
  const { id } = await params

  return (
    <div className={style.main}>
      <div className={style.statusFixed}>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>게시하기</h3>
        </div>
      </div>
      <div style={{ marginTop: 53 }}>
        <Post />
        <CommentForm id={id} />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  )
}
