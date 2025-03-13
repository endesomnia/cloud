'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import { Button, Box, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/ui'

export const ToggleTheme = ({ ...props }) => {
  const { setTheme } = useTheme()

  return (
    <Box {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  )
}
