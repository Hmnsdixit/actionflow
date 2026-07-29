'use client'

import { useState, useEffect } from 'react'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    setIsOffline(!navigator.onLine)

    function handleOffline() {
      setIsOffline(true)
    }
    function handleOnline() {
      setIsOffline(false)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div role="status" className="bg-amber-500 text-white text-sm text-center py-2 px-4">
      You&apos;re offline. Some features like AI processing won&apos;t work until your connection is restored.
    </div>
  )
}