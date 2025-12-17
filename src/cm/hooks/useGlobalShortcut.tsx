import {useEffect} from 'react'

type ShortcutKey = {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

type ShortcutHandler = (event: KeyboardEvent) => void

export const useGlobalShortcut = (shortcut: ShortcutKey, handler: ShortcutHandler) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const {key, ctrlKey, shiftKey, altKey, metaKey} = event

      if (
        key === shortcut.key &&
        !!ctrlKey === !!shortcut.ctrlKey &&
        !!shiftKey === !!shortcut.shiftKey &&
        !!altKey === !!shortcut.altKey &&
        !!metaKey === !!shortcut.metaKey
      ) {
        event.preventDefault()
        handler(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcut, handler])
}
