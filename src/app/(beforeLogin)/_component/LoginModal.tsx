'use client'

import style from '@/app/(beforeLogin)/_component/login.module.css'
import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from './BackButton'
import { signIn } from 'next-auth/react'
export { GET, POST } from '@/auth'

export default function LoginModal() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const onSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    setMessage('')

    try {
      const result = await signIn('credentials', {
        username: id,
        password,
        redirect: false,
      })

      if (result?.code === 'no_user') {
        setMessage('가입하지 않은 유저입니다.')
      } else if (result?.code === 'wrong_password') {
        setMessage('비밀번호가 틀렸습니다.')
      }

      router.replace('/home')
    } catch (e) {
      console.error(e)
      setMessage('아이디와 비밀번호가 일치하지 않습니다.')
    }
  }

  const onChangeId: ChangeEventHandler<HTMLInputElement> = e => {
    setId(e.target.value)
  }

  const onChangePassword: ChangeEventHandler<HTMLInputElement> = e => {
    setPassword(e.target.value)
  }

  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          <BackButton />
          <div>로그인하세요.</div>
        </div>
        <form onSubmit={onSubmit}>
          <div className={style.modalBody}>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="id">
                아이디
              </label>
              <input
                id="id"
                className={style.input}
                value={id}
                onChange={onChangeId}
                type="text"
                placeholder=""
              />
            </div>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                className={style.input}
                value={password}
                onChange={onChangePassword}
                type="password"
                placeholder=""
              />
            </div>
          </div>
          <div className={style.message}>{message}</div>
          <div className={style.modalFooter}>
            <button className={style.actionButton} disabled={!id && !password}>
              로그인하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
