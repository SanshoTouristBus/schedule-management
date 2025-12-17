'use client'
import {useCallback, useEffect, useState} from 'react'
type propsType = {preventBack?: boolean; preventReload?: boolean; callback?: () => void}
export default function usePreventBrowserAction(props?: propsType) {
  const [ready, setready] = useState(false)
  const {
    preventBack = true,
    preventReload = true,
    callback = e => {
      return
    },
  } = props ?? {}

  const blockBrowserBack = useCallback(e => {
    if (preventBack) {
      e.preventDefault()
      e.returnValue = ''
    }
  }, [])

  const blockReload = useCallback(e => {
    if (preventReload) {
      e.preventDefault()
      e.returnValue = ''
    }
  }, [])

  const removeEvents = () => {
    window.removeEventListener('popstate', blockBrowserBack)
    window.removeEventListener('beforeunload', blockReload)
  }

  useEffect(() => {
    window.addEventListener('popstate', blockBrowserBack)
    window.addEventListener('beforeunload', blockReload)

    setready(true)
    console.warn(`preventing browser action...`)

    // クリーンアップは忘れない
    return () => {
      window.removeEventListener('popstate', blockBrowserBack)
      window.removeEventListener('beforeunload', blockReload)
    }
  }, [blockBrowserBack, blockReload])

  return {
    ready,
    removeEvents,
  }
}
