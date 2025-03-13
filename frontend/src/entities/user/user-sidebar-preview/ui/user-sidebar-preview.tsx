'use client'

import { Avatar, AvatarImage } from '@shared/ui/avatar'

import { ArrowDown } from 'lucide-react'
import { UserSideBarPreviewSkeleton } from './user-sidebar-preview-skeleton'
import { User } from '@entities/user'
import { UserAuth } from '@src/shared/api'
import { isUserAuth } from '@src/shared/lib'

interface Props {
  user: User | UserAuth
}

export const UserSideBarPreview = ({ user }: Props) => {
  const fallBackName = user.name.substring(0, 2)

  if (!user) return <UserSideBarPreviewSkeleton />

  const imageSrc = isUserAuth(user) ? fallBackName : user.image || fallBackName

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <Avatar className="w-8 h-8 mr-1">
          <AvatarImage src={imageSrc} alt="userImage" />
        </Avatar>
        <span className="flex-1 text-foreground">{user.name}</span>
        <ArrowDown size={20} />
      </div>
    </div>
  )
}
