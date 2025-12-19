'use client'

import React, { useState, useEffect } from 'react'
import { Users, X } from 'lucide-react'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import { globalIds } from 'src/non-common/searchParamStr'

type User = {
  id: number
  name: string
}

type Props = {
  users: User[]
  currentUserId: number
  isSystemAdmin: boolean
}

export const UserSwitchForm = ({ users, currentUserId, isSystemAdmin }: Props) => {
  const { query, addQuery } = useGlobal()
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  // クエリパラメータから現在の切り替えユーザーIDを取得
  useEffect(() => {
    const globalUserId = query?.[globalIds.globalUserId]
    if (globalUserId) {
      setSelectedUserId(String(globalUserId))
    } else {
      setSelectedUserId('')
    }
  }, [query])

  // 管理者以外は表示しない
  if (!isSystemAdmin) {
    return null
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value
    setSelectedUserId(userId)

    if (userId && userId !== String(currentUserId)) {
      // 他のユーザーに切り替え
      addQuery({ [globalIds.globalUserId]: userId })
    } else {
      // 自分に戻る（クエリパラメータを削除）
      addQuery({ [globalIds.globalUserId]: undefined })
    }
  }

  const handleReset = () => {
    setSelectedUserId('')
    addQuery({ [globalIds.globalUserId]: undefined })
  }

  // 現在表示中のユーザー名を取得
  const currentDisplayUserId = query?.[globalIds.globalUserId] ? Number(query[globalIds.globalUserId]) : currentUserId
  const currentDisplayUser = users.find(u => u.id === currentDisplayUserId)

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-700">ユーザー切り替え（管理者専用）</h3>
        </div>
        {selectedUserId && selectedUserId !== String(currentUserId) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="自分に戻る"
          >
            <X className="w-4 h-4" />
            自分に戻る
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label htmlFor="user-switch" className="block text-xs font-medium text-gray-600 mb-1">
            表示ユーザー
          </label>
          <select
            id="user-switch"
            value={selectedUserId || String(currentUserId)}
            onChange={handleUserChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value={String(currentUserId)}>自分 ({users.find(u => u.id === currentUserId)?.name || '不明'})</option>
            {users
              .filter(u => u.id !== currentUserId)
              .map(user => (
                <option key={user.id} value={String(user.id)}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>
        {currentDisplayUser && currentDisplayUserId !== currentUserId && (
          <div className="flex-shrink-0 pt-6">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
              現在: {currentDisplayUser.name}さんの画面を表示中
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

