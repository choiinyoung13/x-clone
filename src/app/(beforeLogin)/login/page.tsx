'use client'

import { useRouter } from 'next/navigation'
import Main from '../_component/Main'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      router.replace('/home')
    } else {
      router.replace('i/flow/login')
    }
  }, [session, router])

  if (session?.user) {
    return null
  }

  return <Main />
}
