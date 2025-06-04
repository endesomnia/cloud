import { DoLogout } from '@src/actions'
import { Button } from '@shared/ui'
import Cookies from 'js-cookie'
import { useLanguage } from '@src/shared/context/languageContext'
import { useRouter } from 'next/navigation'
import { routes } from '@shared/constant'

export const LogoutBtn = () => {
  const { t } = useLanguage()
  const { push } = useRouter()

  const handleLogout = async () => {
    Cookies.remove('token')
    Cookies.remove('userId')

    await DoLogout()
    // push(routes.startUp)
  }
  return (
    <form action={handleLogout}>
      <Button type="submit" className="w-full justify-start">
        <span>{t('sign_out')}</span>
      </Button>
    </form>
  )
}
