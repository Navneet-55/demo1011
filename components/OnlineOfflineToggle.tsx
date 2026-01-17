'use client'

import { useOnlineOffline } from '@/contexts/OnlineOfflineContext'

export function OnlineOfflineToggle() {
  const { isOnlineMode, setIsOnlineMode, isConnected, effectiveMode } = useOnlineOffline()

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full transition-all ${
            effectiveMode === 'online'
              ? 'bg-green-500 animate-pulse'
              : 'bg-orange-500'
          }`}
          title={
            effectiveMode === 'online'
              ? 'Using Groq API'
              : 'Using Offline Mode'
          }
        />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {effectiveMode === 'online' ? '🌐 Online' : '📱 Offline'}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />

      {/* Toggle Button */}
      <button
        onClick={() => setIsOnlineMode(!isOnlineMode)}
        disabled={!isConnected && isOnlineMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isOnlineMode
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-400 hover:bg-gray-500'
        } ${
          !isConnected && isOnlineMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title={
          !isConnected && isOnlineMode
            ? 'No internet connection'
            : isOnlineMode
            ? 'Click to switch to Offline'
            : 'Click to switch to Online'
        }
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOnlineMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>

      {/* Connection status */}
      {!isConnected && (
        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
          No connection
        </span>
      )}
    </div>
  )
}
