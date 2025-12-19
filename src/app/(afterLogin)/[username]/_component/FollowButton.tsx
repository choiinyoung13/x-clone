'use client'
import { useSession } from 'next-auth/react'
import style from '../profile.module.css'
import { redirect } from 'next/navigation'

export default function FollowButton() {
  const { data } = useSession()

  const onFollow = () => {
    if (!data) {
      redirect('/login')
    }
  }

  return (
    <button className={style.followButton} onClick={onFollow}>
      {'팔로우'}
    </button>
  )
}
