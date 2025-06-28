import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-Commerce Platform',
  description: 'Modern e-ticaret platformu - Ürün satışı, müzayedeler ve daha fazlası',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
