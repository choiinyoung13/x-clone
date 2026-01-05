'use server'

import { signIn } from '@/auth'
import { redirect } from 'next/navigation'

export const signupAction = async (
  prevFormState: {
    enteredValue: {
      id: string | null
      password: string | null
      name: string | null
    }
    message: string | null
  },
  formData
) => {
  let message

  const id = formData.get('id')
  const password = formData.get('password')
  const name = formData.get('nickname')
  const image = formData.get('image')

  if (!(image instanceof File) || image.size === 0) {
    message = 'no_image'
  }
  if (!password || !(password as string)?.trim()) {
    message = 'no_password'
  }
  if (!name || !(name as string)?.trim()) {
    message = 'no_name'
  }
  if (!id || !(id as string)?.trim()) {
    message = 'no_id'
  }
  if (message) {
    return { enteredValue: { id, password, name }, message }
  }

  let shouldRedirect = false
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
      {
        method: 'post',
        body: formData,
        credentials: 'include',
      }
    )
    console.log(response.status)
    if (response.status === 403) {
      return { enteredValue: { id, password, name }, message: 'user_exists' }
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({ data: ['알 수 없는 오류가 발생했습니다.'] }))
      return { enteredValue: { id, password, name }, message: errorData.data[0] }
    }
    console.log(await response.json())
    shouldRedirect = true
    await signIn('credentials', {
      username: id,
      password: password,
      redirect: false,
    })
  } catch (err) {
    console.error('회원가입 오류:', err)
    return { enteredValue: { id, password, name }, message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' }
  }

  if (shouldRedirect) {
    redirect('/home') // try/catch문 안에서 X
  }
}
