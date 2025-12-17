'use client'
import React, {createContext, useContext, ReactNode} from 'react'
import useMySession from '@cm/hooks/globalHooks/useMySession'
import {SessionContextType} from '@cm/providers/types'
import Loader from '@cm/components/utils/loader/Loader'
import {Session} from 'next-auth'
import {fetcher} from '@cm/lib/swr'

const SessionContext = createContext<SessionContextType | null>(null)

const SessionContextProvider = ({children, session}: {children: ReactNode; session?: Session}) => {
  const swrConfig = {
    fetcher,
    revalidateOnFocus: false, // フォーカス時の再検証を無効化（必要に応じて）
    revalidateOnReconnect: true, // 再接続時の再検証
    dedupingInterval: 2000, // 重複リクエストの防止間隔
    errorRetryCount: 3, // エラー時のリトライ回数
    errorRetryInterval: 5000, // リトライ間隔
  }

  const sessionData = useMySession({session})

  if (sessionData.sessionLoading) {
    return <Loader></Loader>
  }

  return <SessionContext.Provider value={sessionData}>{children}</SessionContext.Provider>
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext must be used within SessionProvider')
  }
  return context
}

export default SessionContextProvider
