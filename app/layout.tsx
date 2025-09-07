import { Inter } from 'next/font/google'
import { Providers } from './components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FinBoard - Finance Dashboard',
  description: 'Customizable real-time finance dashboard with drag-and-drop widgets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}