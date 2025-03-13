import { Box, Button } from '@shared/ui'

import { ReactNode } from 'react'
import { SideBarItemNavigate } from '../lib'
import { useParams } from 'next/navigation'
import { cn } from '@shared/lib'

interface Props {
  Icon: ReactNode
  title: string
  className?: string
  route: string
}

interface Params {
  [todosType: string]: string
}

export const SidebarItem = ({ title, Icon, className, route }: Props) => {
  const params = useParams<Params>()
  if (!params) return null

  //prettier-ignore
  const FinalClassName = {
    'title': 'bg-selected-btn-bg',
  }[params.todosType]

  return (
    <Box className={className}>
      <form action={() => SideBarItemNavigate(route)}>
        <Button className={cn('flex items-center justify-between p-2 w-64', FinalClassName)}>
          <Box className="bg-transparent flex justify-center items-center">
            {Icon}
            <Box className="bg-transparent p-2">{title}</Box>
          </Box>
        </Button>
      </form>
    </Box>
  )
}
