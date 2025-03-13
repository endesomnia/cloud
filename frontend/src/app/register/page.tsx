import { getSessionUser } from '@entities/session/user'
import { redirect } from 'next/navigation'
import { routes } from '@shared/constant'
import { RegisterForm } from '@src/features/user/register'

const Page = async () => {
  const user = await getSessionUser()
  if (user) redirect(routes.buckets)

  return <RegisterForm />
}

export default Page
