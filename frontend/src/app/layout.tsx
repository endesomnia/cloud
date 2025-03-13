import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@shared/lib'
import './globals.css'
import { ThemeProvider } from './_providers'
import { Toaster } from '@src/shared/ui'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Cloud Storage',
  icons: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(' bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
