import style from './message.module.css'
import Room from '@/app/(afterLogin)/messages/_component/Room'
import { auth } from '@/auth'
import { Metadata } from 'next'
import { getRooms } from './_lib/getRooms'

export const metadata: Metadata = {
  title: '쪽지 / Z',
  description: '쪽지를 보내보세요.',
}

export default async function Page() {
  const sesstion = await auth()
  const rooms = sesstion?.user?.email
    ? await getRooms(sesstion?.user?.email)
    : []

  return (
    <main className={style.main}>
      <div className={style.header}>
        <h3>쪽지</h3>
      </div>
      {rooms.map(room => (
        <Room key={room.room} room={room} />
      ))}
    </main>
  )
}
