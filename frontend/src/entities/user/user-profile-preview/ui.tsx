import { User } from '@entities/user'
import { Box } from '@shared/ui'
import { UserAuth } from '@src/shared/api'
import { DefaultProfilePicture } from '@src/shared/assets'
import { isUserAuth } from '@src/shared/lib'
import Image from 'next/image'

export const UI = ({ user }: { user: User | UserAuth }) => {
  const imageSrc = isUserAuth(user) ? DefaultProfilePicture : user.image || DefaultProfilePicture

  return (
    <Box className="flex items-center space-x-4">
      <Image src={imageSrc} alt="User" className="rounded-full" width={64} height={64} />
      <Box>
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </Box>
    </Box>
  )
}
