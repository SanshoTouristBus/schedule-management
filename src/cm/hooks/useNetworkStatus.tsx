'use client'

import {isServer} from 'src/cm/lib/methods/common'
import {useEffect, useState} from 'react'
import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const {router, query} = useGlobal()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }, [isServer, typeof window, router, query])

  useEffect(() => {
    const isOnline = window?.navigator.onLine
    setIsOnline(isOnline)
  }, [isServer])

  const onlyIsOnline = async cb => {
    if (isOnline) {
      return cb()
    }
  }

  return {isOnline, onlyIsOnline}
}
