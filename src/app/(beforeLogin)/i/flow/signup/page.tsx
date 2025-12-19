import SignupModal from '@/app/(beforeLogin)/_component/SignupModal'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  if (session?.user) {
    redirect('/home')
  }

  return <SignupModal />
}
