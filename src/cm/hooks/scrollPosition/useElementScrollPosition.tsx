'use client'

import {useEffect, useLayoutEffect, useCallback, useRef} from 'react'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import {isServer} from '@cm/lib/methods/common'

interface UseElementScrollPositionProps {
  elementRef: any
  scrollKey?: string // オプションで特定のキーを指定可能
}

interface ScrollPositionData {
  top: number
  left: number
}

// SSR対応: useLayoutEffectをクライアントのみで使用
const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect

export const useElementScrollPosition = ({elementRef, scrollKey}: UseElementScrollPositionProps) => {
  const {pathname, searchParams} = useGlobal()
  const storageKey = `elementScroll_${scrollKey || ''}${pathname}${searchParams}`

  // 最新のスクロール位置をrefで保持（再レンダリング間で維持）
  const scrollPositionRef = useRef<ScrollPositionData>({top: 0, left: 0})

  const getScrollPosition = useCallback((): ScrollPositionData | null => {
    if (isServer) return null
    try {
      const saved = sessionStorage.getItem(storageKey)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // 旧形式（数値のみ）の場合
      const saved = sessionStorage.getItem(storageKey)
      if (saved) {
        return {top: parseInt(saved), left: 0}
      }
    }
    return null
  }, [storageKey])

  const setScrollPosition = useCallback(
    (position: ScrollPositionData) => {
      if (isServer) return
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(position))
      } catch (error) {
        console.warn('Failed to save scroll position:', error)
      }
    },
    [storageKey]
  )

  const saveScrollPosition = useCallback(() => {
    if (isServer || !elementRef.current) return

    const top = elementRef.current.scrollTop
    const left = elementRef.current.scrollLeft

    // refとsessionStorageの両方に保存
    scrollPositionRef.current = {top, left}

    if (top !== 0 || left !== 0) {
      setScrollPosition({top, left})
    }
  }, [elementRef, setScrollPosition])

  const restoreScrollPosition = useCallback(() => {
    if (isServer || !elementRef.current) return

    // まずrefから復元（最新の値）
    const refPosition = scrollPositionRef.current
    // sessionStorageからも取得（ページリロード対応）
    const savedPosition = getScrollPosition()

    // refに値があればそれを優先、なければsessionStorageから
    const position = refPosition.top !== 0 || refPosition.left !== 0 ? refPosition : savedPosition

    if (position && (position.top !== 0 || position.left !== 0)) {
      elementRef.current.scrollTop = position.top
      elementRef.current.scrollLeft = position.left
    }
  }, [elementRef, getScrollPosition])

  // 再レンダリング毎にスクロール位置を即座に復元（ペイント前）
  useIsomorphicLayoutEffect(() => {
    restoreScrollPosition()
  })

  // スクロールイベントリスナーの設定
  useEffect(() => {
    if (isServer || !elementRef.current) return

    const element = elementRef.current
    const handleScroll = () => requestAnimationFrame(saveScrollPosition)

    // 初回マウント時にsessionStorageから復元
    const savedPosition = getScrollPosition()
    if (savedPosition) {
      scrollPositionRef.current = savedPosition
    }

    element.addEventListener('scroll', handleScroll, {passive: true})

    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [elementRef, saveScrollPosition, getScrollPosition])
}
