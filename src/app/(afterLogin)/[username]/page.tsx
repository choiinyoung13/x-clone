import BackButton from '@/app/(afterLogin)/_component/BackButton'
import style from './profile.module.css'
import Post from '../_component/Post'
import FollowButton from './_component/FollowButton'

export default async function Profile() {
  const user = {
    id: 'elonmusk',
    nickname: 'Elon Musk',
    image: '/yRsRRjGO.jpg',
  }

  return (
    <main className={style.main}>
      <div className={style.header}>
        <BackButton />
        <h3 className={style.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userRow}>
          <div className={style.userImage}>
            <img src={user.image} alt={user.id} />
          </div>
          <div className={style.userName}>
            <div>{user.nickname}</div>
            <div>@{user.id}</div>
          </div>

          <FollowButton />
        </div>
      </div>
      <div>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </main>
  )
}
