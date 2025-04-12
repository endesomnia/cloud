import { routes } from '@shared/constant'
import { Button } from '@shared/ui'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@src/shared/context/languageContext'

export const ProfileBtn = () => {
  const { push } = useRouter()
  const { t } = useLanguage()

  const navHandler = () => {
    push(routes.user)
  }
  return (
    <Button type="submit" className="w-full justify-start" onClick={navHandler}>
      <span>{t('profile')}</span>
    </Button>
  )
}
