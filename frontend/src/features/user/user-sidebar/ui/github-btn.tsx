import { Button } from '@shared/ui'
import { GoToGitHub } from '../lib'

interface Props {
  userName: string
}

export const GithubBtn = ({ userName }: Props) => {
  return (
    <form action={() => GoToGitHub(userName)} className="cursor-pointer">
      <Button type="submit" className="w-full justify-start">
        <span>GitHub</span>
      </Button>
    </form>
  )
}
