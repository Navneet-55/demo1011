'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface OnlineOfflineContextType {
  isOnlineMode: boolean
  setIsOnlineMode: (mode: boolean) => void
  isConnected: boolean
  effectiveMode: 'online' | 'offline'
}

const OnlineOfflineContext = createContext<OnlineOfflineContextType | undefined>(undefined)

export function OnlineOfflineProvider({ children }: { children: ReactNode }) {
  const [isOnlineMode, setIsOnlineMode] = useState(true)
  const [isConnected, setIsConnected] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Detect internet connectivity
  useEffect(() => {
    setMounted(true)
    
    // Set initial state
    setIsConnected(navigator.onLine)

    const handleOnline = () => {
      setIsConnected(true)
    }

    const handleOffline = () => {
      setIsConnected(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Determine effective mode: if user chose online but no connection, use offline
  const effectiveMode = mounted && isOnlineMode && isConnected ? 'online' : 'offline'

  return (
    <OnlineOfflineContext.Provider
      value={{
        isOnlineMode,
        setIsOnlineMode,
        isConnected,
        effectiveMode
      }}
    >
      {children}
    </OnlineOfflineContext.Provider>
  )
}

export function useOnlineOffline() {
  const context = useContext(OnlineOfflineContext)
  if (!context) {
    throw new Error('useOnlineOffline must be used within OnlineOfflineProvider')
  }
  return context
}
