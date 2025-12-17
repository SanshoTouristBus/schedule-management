'use client'

import {GoogleSheet_Append} from '@app/api/google/actions/sheetAPI'

import {formatDate} from '@cm/class/Days/date-utils/formatters'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import {atomTypes, useJotaiByKey} from '@cm/hooks/useJotai'
import {isDev} from '@cm/lib/methods/common'

import {useEffect} from 'react'

export const usePageTracking = () => {
  const waitSec = 1.5
  const [lastLoggedTime, setLastLoggedTime] = useJotaiByKey<atomTypes[`lastLoggedTime`]>(`lastLoggedTime`, null)

  const {pathname, query, asPath, session, rootPath} = useGlobal()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LOG_SHEET_ID && !isDev) {
      const trackPageView = async () => {
        try {
          await GoogleSheet_Append({
            spreadsheetId: process.env.NEXT_PUBLIC_LOG_SHEET_ID ?? '',
            range: rootPath,
            values: [
              [
                rootPath,
                session?.id,
                session?.name,
                session?.email,
                formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                pathname,
                asPath,
                ...Object.keys(query).map(key => {
                  return `${key}=${query[key]}`
                }),
              ],
            ],
          })

          // toastByResult(res)
        } catch (error) {
          console.error('トラッキングエラー:', error)
        }
      }

      const now = new Date()
      if (lastLoggedTime === null || now.getTime() - lastLoggedTime.getTime() > waitSec * 1000) {
        trackPageView()
        setLastLoggedTime(now)
      }
    }
  }, [pathname, query])
}
