'use client'

import { ReactNode, useEffect } from 'react'

import { getSessionUser } from '@entities/session/user'
import { User } from '@entities/user'
import { useUserStore } from '@entities/user'
import { ById } from '@src/shared/api'
import Cookies from 'js-cookie'
import { Header } from '@src/widgets/header'
import { ViewModeProvider } from '@src/shared/context/viewModeContext'
import { useTheme } from '@src/shared/context/themeContext'

interface Props {
  children: ReactNode
}

const MainLayout = ({ children }: Props) => {
  const { user, addUser } = useUserStore()
  const userID = Cookies.get('userId')
  const token = Cookies.get('token')
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
    <ViewModeProvider>
      <div className={`flex flex-col h-screen ${isDark 
        ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827]' 
        : 'bg-gradient-to-b from-gray-50 to-white'
      } w-full overflow-hidden theme-transition`}>
        <div className="sticky top-0 z-30 w-full">
          <Header />
        </div>
        <main className={`flex-1 overflow-y-auto ${isDark 
          ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827]' 
          : 'bg-gradient-to-b from-gray-50 to-white'
        } w-full theme-transition`}>
          {children}
        </main>
      </div>
    </ViewModeProvider>
  )
}

export default MainLayout
