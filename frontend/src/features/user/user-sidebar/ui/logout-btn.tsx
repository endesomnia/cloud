import { DoLogout } from '@src/actions'
import { Button } from '@shared/ui'
import Cookies from 'js-cookie'

export const LogoutBtn = () => {
  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('userId')

    DoLogout()
  }
  return (
    <form action={handleLogout}>
      <Button type="submit" className="w-full justify-start">
        <span>Log out </span>
      </Button>
    </form>
  )
}
