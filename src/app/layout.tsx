import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { EnvChecker } from '../components/debug/EnvChecker'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BMad Visual Platform',
  description: 'Transform your development workflow with AI-powered agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <EnvChecker />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}