import { getSessionUser } from '@entities/session/user'
import { redirect } from 'next/navigation'
import { routes } from '@shared/constant'
import { LoginForm } from '@src/features/user/login'

const Page = async () => {
  const user = await getSessionUser()
  if (user) redirect(routes.buckets)

  return <LoginForm />
}

export default Page
