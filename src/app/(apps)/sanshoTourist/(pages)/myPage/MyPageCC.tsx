'use client'

import React, { useState } from 'react'
import { List, CalendarDays } from 'lucide-react'
import { StVehicle, StHoliday, StUserHoliday } from '@prisma/generated/prisma/client'
import useSWR from 'swr'

import { WeeklyView } from '../../(components)/MyPageViews/WeeklyView'
import { MonthlyView } from '../../(components)/MyPageViews/MonthlyView'
import { getStSchedulesByDriver } from '../../(server-actions)/schedule-actions'
import { UserSwitchForm } from '../../(components)/UserSwitchForm'

type Props = {
  userId: number
  userName: string
  vehicles: StVehicle[]
  isSystemAdmin: boolean
  publishEndDate: Date | null
  holidays: StHoliday[]
  userHolidays: StUserHoliday[]
  users: { id: number; name: string }[]
  realLoginUserId: number
}

// 日付操作ユーティリティ
const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

const getStartOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getEndOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export const MyPageCC = ({ userId, userName, vehicles, isSystemAdmin, publishEndDate, holidays, userHolidays, users, realLoginUserId }: Props) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  // スケジュールデータ取得
  const { data: schedulesData } = useSWR(
    ['mySchedules', userId, currentDate.toISOString(), viewMode, isSystemAdmin],
    async () => {
      let dateFrom: Date
      let dateTo: Date

      if (viewMode === 'weekly') {
        // 今日から2週間
        dateFrom = currentDate
        dateTo = addDays(currentDate, 14)
      } else {
        // 月の初日から末日
        dateFrom = getStartOfMonth(currentDate)
        dateTo = getEndOfMonth(currentDate)
      }

      const schedules = await getStSchedulesByDriver({
        userId,
        dateFrom,
        dateTo,
        isSystemAdmin,
        publishEndDate,
      })
      return schedules
    }
  )

  const schedules = schedulesData || []

  return (
    <div className={`mx-auto w-fit`}>
      <h2 className="text-2xl font-bold mb-4">マイページ ({userName}さん)</h2>

      {/* ユーザー切り替えフォーム（管理者のみ） */}
      <UserSwitchForm users={users} currentUserId={realLoginUserId} isSystemAdmin={isSystemAdmin} />

      {/* ビュー切り替え */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'weekly' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <List className="w-4 h-4 mr-1" />
            週間ビュー
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'monthly' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <CalendarDays className="w-4 h-4 mr-1" />
            月間ビュー
          </button>
        </div>
      </div>

      {/* ビューコンポーネント */}
      {viewMode === 'weekly' ? (
        <WeeklyView schedules={schedules} vehicles={vehicles} holidays={holidays} userHolidays={userHolidays} />
      ) : (
        <MonthlyView
          schedules={schedules}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          holidays={holidays}
          userHolidays={userHolidays}
          userId={userId}
        />
      )}
    </div>
  )
}

