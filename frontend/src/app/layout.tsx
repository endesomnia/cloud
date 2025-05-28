import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { SessionProvider } from 'next-auth/react' // Added import
import { cn } from '@shared/lib'
import './globals.css'
import { Toaster } from '@src/shared/ui'
import { ThemeProvider } from '@src/shared/context/themeContext'
import { LanguageProvider } from '@src/shared/context/languageContext'

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <SessionProvider> {/* Added SessionProvider wrapper */}
          <ThemeProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
            <Toaster />
          </ThemeProvider>
        </SessionProvider> {/* Closed SessionProvider wrapper */}
      </body>
    </html>
  )
}
