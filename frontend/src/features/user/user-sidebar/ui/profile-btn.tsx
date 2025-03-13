import { routes } from '@shared/constant'
import { Button } from '@shared/ui'
import { useRouter } from 'next/navigation'

export const ProfileBtn = () => {
  const { push } = useRouter()

  const navHandler = () => {
    push(routes.user)
  }
  return (
    <Button type="submit" className="w-full justify-start" onClick={navHandler}>
      <span>Profile</span>
    </Button>
  )
}
