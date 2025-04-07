import { getSessionUser } from '@entities/session/user'
import { redirect } from 'next/navigation'
import { routes } from '@shared/constant'
import { LoginForm } from '@src/features/user/login'
import { ToggleGroup } from '@shared/ui'

const Page = async () => {
  const user = await getSessionUser()
  if (user) redirect(routes.buckets)

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-40">
        <ToggleGroup />
      </div>
      <LoginForm />
    </div>
  )
}

export default Page
