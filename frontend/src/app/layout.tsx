import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
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
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
