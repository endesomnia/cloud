'use client'

import { ReactNode, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@shared/ui'

import { getSessionUser } from '@entities/session/user'
import { User } from '@entities/user'
import { SideBar } from '@widgets/sidebar'
import { useUserStore } from '@entities/user'
import { ById } from '@src/shared/api'
import Cookies from 'js-cookie'
import { Header } from '@src/widgets/header'

interface Props {
  children: ReactNode
}

const MainLayout = ({ children }: Props) => {
  const { user, addUser } = useUserStore()
  const userID = Cookies.get('userId')
  const token = Cookies.get('token')

  useEffect(() => {
    const fetchUser = async () => {
      const sessionUser = await getSessionUser()
      if (!sessionUser) {
        if (userID && token) {
          const user = await ById({ id: userID })
          //@ts-ignore
          addUser(user.user)
        }
      } else if (sessionUser) {
        addUser(sessionUser as User)
      }
    }

    fetchUser()
  }, [addUser])

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen rounded-lg border w-full">
      <ResizablePanel defaultSize={15}>{user ? <SideBar user={user} /> : null}</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={7} className="flex justify-start">
            <Header className="text-7xl font-bold text-center shadow-lg ml-5" />
          </ResizablePanel>
          <ResizablePanel defaultSize={93}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default MainLayout
