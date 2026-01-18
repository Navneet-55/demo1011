import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GyaanForge - Learn',
  description: 'AI-powered learning workspace',
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
