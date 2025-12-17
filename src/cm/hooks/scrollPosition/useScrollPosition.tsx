'use client'

import {useEffect, useCallback} from 'react'

import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import {isServer} from '@cm/lib/methods/common'

export const useScrollPosition = () => {
  const {pathname, searchParams} = useGlobal()
  const scrollPositionKey = `scrollPosition_${pathname}${searchParams}`

  const getScrollPosition = useCallback(() => {
    if (isServer) return null
    const scrollPosition = sessionStorage.getItem(scrollPositionKey)
    return scrollPosition
  }, [scrollPositionKey])

  const setScrollPosition = useCallback(
    (scrollPosition: string) => {
      if (isServer) return
      sessionStorage.setItem(scrollPositionKey, scrollPosition)
    },
    [scrollPositionKey]
  )

  // スクロール位置を保存
  const saveScrollPosition = useCallback(() => {
    if (isServer) return

    const start = performance.now()
    const current = String(window.scrollY)

    if (current !== '0') {
      setScrollPosition(current)
    }

    const end = performance.now()
    if (end - start > 16.67) {
      // 1フレーム（約16.67ms）以上かかった場合
      console.warn('Scroll position save took too long:', end - start)
    }
  }, [setScrollPosition])

  // スクロール位置を復元
  const restoreScrollPosition = useCallback(() => {
    if (isServer) return

    const tryRestore = (attempts = 0) => {
      const current = String(window.scrollY)
      const savedPosition = getScrollPosition()

      if (current !== savedPosition && savedPosition) {
        window.scrollTo(0, parseInt(savedPosition))

        // 最大3回まで試行
        if (attempts < 2) {
          setTimeout(() => tryRestore(attempts + 1), 200)
        }
      }
    }

    tryRestore()
  }, [getScrollPosition])

  const cleanupOldPositions = () => {
    const maxEntries = 50 // 保持する最大エントリー数
    const keys = Object.keys(sessionStorage).filter(key => key.startsWith('scrollPosition_'))

    if (keys.length > maxEntries) {
      keys.slice(0, keys.length - maxEntries).forEach(key => sessionStorage.removeItem(key))
    }
  }

  useEffect(() => {
    if (isServer) return
    cleanupOldPositions()

    const handlePopState = () => restoreScrollPosition()
    const handleScroll = () => requestAnimationFrame(saveScrollPosition)

    // 初期スクロール位置の保存と復元
    saveScrollPosition()
    restoreScrollPosition()

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('scroll', handleScroll, {passive: true})

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname, searchParams, saveScrollPosition, restoreScrollPosition])
}
