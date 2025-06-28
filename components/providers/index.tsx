'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      {children}
      <Toaster position="top-right" richColors />
    </ClerkProvider>
  )
}
