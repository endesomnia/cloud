'use client'

import { Box, Dialog, DialogContent, DialogHeader, DialogTitle, Button, Loader } from '@shared/ui'
import { UserProfilePreview, useUserStore } from '@entities/user'
import { LogoutBtn } from '@features/user'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Page = async () => {
  const { back } = useRouter()
  const user = useUserStore((state) => state.user)
  console.log(user)
  if (!user) return <Loader />

  return (
    <Dialog open={true}>
      <DialogContent className="h-[700px] w-screen">
        <DialogHeader>
          <DialogTitle>
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">Profile</h1>
          </DialogTitle>
        </DialogHeader>
        <Box className="flex flex-col h-full">
          <Box className="min-h-[600px]  flex flex-col items-center">
            <header className=" w-full p-4 shadow-md flex items-center justify-between">
              <UserProfilePreview user={user} />
              <LogoutBtn />
            </header>
            <Button className="flex items-center justify-center" onClick={() => back()}>
              <ChevronLeft size={20} />
              Back
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default Page
