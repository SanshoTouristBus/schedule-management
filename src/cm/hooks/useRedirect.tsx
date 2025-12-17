'use client'

import useMyNavigation from '@cm/hooks/globalHooks/useMyNavigation'
import {HREF} from '@cm/lib/methods/urls'
import {redirect} from 'next/navigation'

import {useEffect} from 'react'

export default function useRedirect(mustRedirect, redirectUrl = '/404', shouldRedirect = true, replace = false) {
  const {asPath, router, query} = useMyNavigation()

  const doRedirect = mustRedirect && shouldRedirect && redirectUrl

  useEffect(() => {
    if (!doRedirect) return

    const performRedirect = async () => {
      try {
        const [path, searchParams] = redirectUrl.split(`?`)

        const newQuery = searchParams
          ? Object.fromEntries(
              String(searchParams)
                .split(`&`)
                .filter(item => item.includes('='))
                .map(item => {
                  const [key, value] = item.split(`=`)
                  return [key, decodeURIComponent(value || '')]
                })
            )
          : {}

        const newPath = HREF(path, newQuery, query)

        // 現在のパスと同じ場合はリダイレクトしない
        if (asPath === newPath) return

        // より確実なリダイレクトのため、わずかな遅延を追加
        await new Promise(resolve => setTimeout(resolve, 10))

        if (replace) {
          router.replace(newPath)
        } else {
          router.push(newPath)
        }

        // server-side redirectも実行
        redirect(newPath)
      } catch (error) {
        console.error('リダイレクトエラー:', error)
        // フォールバックとして基本的なリダイレクトを試行
        router.replace(redirectUrl)
      }
    }

    performRedirect()
  }, [doRedirect, redirectUrl, mustRedirect, asPath, router, query, replace])

  return {
    isValidUser: !mustRedirect,
  }
}
