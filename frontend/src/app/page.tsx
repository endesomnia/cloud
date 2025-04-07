import { getSessionUser } from '@entities/session/user'
import { routes } from '@shared/constant'
import { redirect } from 'next/navigation'
import { HomeClient } from '@src/features/home/ui'

const Page = async () => {
  const user = await getSessionUser()
  if (user) redirect(routes.buckets)
  
  return <HomeClient />
}

export default Page
