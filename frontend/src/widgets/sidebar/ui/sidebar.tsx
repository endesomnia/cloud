'use client'

import { Folder } from 'lucide-react'

import { UserSideBarPreview, UserSideBarPreviewSkeleton, User } from '@entities/user'
import { GithubBtn, LogoutBtn, ProfileBtn } from '@features/user'
import { ToggleTheme } from '@features/toggle-theme'
import {
  Box,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui'
import { SidebarItem } from './sidebar-item'
import { routes } from '@shared/constant'
import { UserAuth } from '@src/shared/api'
import { isUserAuth } from '@src/shared/lib'

export const SideBar = ({ user }: { user: User | UserAuth | null | any }) => {
  const isAuthUser = isUserAuth(user) ? 'yes' : 'no'

  const GithubUserButton = {
    yes: <></>,
    no: <GithubBtn userName={user.name} />,
  }[isAuthUser]

  return (
    <Box className="flex flex-col w-full h-full">
      <header className="flex justify-between p-3 w-full">
        <Box>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {user ? <UserSideBarPreview user={user} /> : <UserSideBarPreviewSkeleton />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ProfileBtn />
              <DropdownMenuSeparator />
              {GithubUserButton}
              <DropdownMenuSeparator />
              <LogoutBtn />
            </DropdownMenuContent>
          </DropdownMenu>
        </Box>
        <ToggleTheme />
      </header>

      <Box>
        <Box className="p-4">
          <SidebarItem Icon={<Folder size={25} className="mr-2" />} title="Folders" route={routes.buckets} />
        </Box>
      </Box>
    </Box>
  )
}
