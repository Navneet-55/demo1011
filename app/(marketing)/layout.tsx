import type { Metadata } from 'next'
import { LenisProvider } from '@/components/LenisProvider'

export const metadata: Metadata = {
  title: 'GyaanForge - AI Learning Companion',
  description: 'Enterprise-grade AI learning companion with adaptive modes, offline support, and premium UX',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LenisProvider>
      {children}
    </LenisProvider>
  )
}
