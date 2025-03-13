import { getSessionUser } from '@entities/session/user'
import { routes } from '@shared/constant'
import { ToggleTheme } from '@features/toggle-theme'
import { Box, Button } from '@shared/ui'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const Page = async () => {
  const user = await getSessionUser()
  if (user) redirect(routes.buckets)

  return (
    <main className="flex  flex-col  justify-between">
      <Box className="self-end m-20">
        <ToggleTheme />
      </Box>
      <Box className="flex flex-col justify-center items-center mt-16">
        <h1 className="mt-10 scroll-m-20  text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Your Welcome
        </h1>
        <Box className="m-5 p-2">
          <p className="p-2 my-2 rounded-lg cursor-pointer">
            <Button variant={'link'}>
              <Link href={routes.login} className="text-xl">
                Login
              </Link>
            </Button>
            <Button variant={'link'}>
              <Link href={routes.registr} className="text-xl">
                Registration
              </Link>
            </Button>
          </p>
        </Box>
      </Box>
    </main>
  )
}

export default Page
