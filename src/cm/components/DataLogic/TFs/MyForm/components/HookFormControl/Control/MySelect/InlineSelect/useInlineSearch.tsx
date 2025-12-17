'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { contextsType } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import { updateOptionsOrigin } from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Search/updateOptionsOrigin'

export const useInlineSearch = (contexts: contextsType, searchInput: string) => {
  const { MySelectContextValue, controlContextValue } = contexts
  const { options, setFilteredOptions } = MySelectContextValue
  const { col } = controlContextValue

  const [isSearching, setIsSearching] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const prevSearchInputRef = useRef<string>('')

  const isStaticOptions = Array.isArray(col?.forSelect?.optionsOrOptionFetcher)

  const performSearch = useCallback(
    async (input: string) => {
      if (!input.trim()) {
        setFilteredOptions(options ?? [])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        await updateOptionsOrigin({
          input,
          options,
          isStaticOptions,
          contexts,
        })
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    },
    [options, isStaticOptions, contexts, setFilteredOptions]
  )

  // 検索値が変更された時のみデバウンスで検索
  useEffect(() => {
    // 前回と同じ値なら何もしない
    if (prevSearchInputRef.current === searchInput) {
      return
    }
    prevSearchInputRef.current = searchInput

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchInput)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchInput, performSearch])

  return {
    isSearching,
  }
}

