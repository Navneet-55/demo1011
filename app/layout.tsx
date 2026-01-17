import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ModeProvider } from '@/components/ModeProvider'
import { OnlineOfflineProvider } from '@/contexts/OnlineOfflineContext'
import { KnowledgeGraphProvider } from '@/contexts/KnowledgeGraphContext'
import { ErrorDebuggerProvider } from '@/contexts/ErrorDebuggerContext'
import { LearningSessionProvider } from '@/contexts/LearningSessionContext'

export const metadata: Metadata = {
  title: 'GyaanForge - AI-Powered Learning Platform',
  description: 'Understand code, concepts, and errors with adaptive AI explanations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ModeProvider>
            <OnlineOfflineProvider>
              <KnowledgeGraphProvider>
                <ErrorDebuggerProvider>
                  <LearningSessionProvider>
                    {children}
                  </LearningSessionProvider>
                </ErrorDebuggerProvider>
              </KnowledgeGraphProvider>
            </OnlineOfflineProvider>
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
