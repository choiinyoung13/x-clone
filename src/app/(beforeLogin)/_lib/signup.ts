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
  const name = formData.get('name')
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
      return { message: 'user_exists' }
    }
    console.log(await response.json())
    shouldRedirect = true
    await signIn('credentials', {
      username: id,
      password: password,
      redirect: false,
    })
  } catch (err) {
    console.error(err)
    return { message: null }
  }

  if (shouldRedirect) {
    redirect('/home') // try/catch문 안에서 X
  }
}
