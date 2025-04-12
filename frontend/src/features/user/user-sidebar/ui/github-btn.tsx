import { Button } from '@shared/ui'
import { GoToGitHub } from '../lib'
import { useLanguage } from '@src/shared/context/languageContext'

interface Props {
  userName: string
}

export const GithubBtn = ({ userName }: Props) => {
  const { t } = useLanguage()
  return (
    <form action={() => GoToGitHub(userName)} className="cursor-pointer">
      <Button type="submit" className="w-full justify-start">
        <span>{t('attach_github')}</span>
      </Button>
    </form>
  )
}
