'use client'

import React, { useMemo } from 'react'
import { StHoliday } from '@prisma/generated/prisma/client'

type Props = {
  startDate: Date
  numDays: number
  holidays: StHoliday[]
  users: { id: number; name: string }[]
  rollCallers: { date: Date; userId: number }[]
  onUpdateRollCaller: (date: Date, userId: number) => void
  canEdit: boolean
}

// 日付操作ユーティリティ
const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

// DBからのUTC日付をJST日付文字列に変換
const toJstDateString = (date: Date): string => {
  const dt = new Date(date)
  dt.setHours(dt.getHours() + 9)
  const year = dt.getFullYear()
  const month = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ローカル日付をYYYY-MM-DD形式に変換
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDayOfWeek = (date: Date) => {
  const day = date.getDay()
  return ['日', '月', '火', '水', '木', '金', '土'][day]
}

export const ScheduleGridHeader = ({ startDate, numDays, holidays, users, rollCallers, onUpdateRollCaller, canEdit }: Props) => {
  // DBのUTC日付をJST文字列に変換してマップ化
  const holidayMap = useMemo(() => new Map(holidays.map(h => [toJstDateString(h.date), h.name])), [holidays])
  const rollCallerMap = useMemo(() => new Map(rollCallers.map(rc => [toJstDateString(rc.date), rc.userId])), [rollCallers])

  const days = Array.from({ length: numDays }).map((_, i) => {
    const date = addDays(startDate, i)
    const dateStr = getLocalDateString(date)
    const dayOfWeek = date.getDay()
    const isSaturday = dayOfWeek === 6
    const isSunday = dayOfWeek === 0
    const isHoliday = holidayMap.has(dateStr)

    let dayClass = 'text-gray-700'
    if (isHoliday) dayClass = 'text-red-600'
    else if (isSunday) dayClass = 'text-red-500'
    else if (isSaturday) dayClass = 'text-blue-500'

    return {
      date: date,
      dateStr: dateStr,
      day: date.getDate(),
      dayOfWeek: getDayOfWeek(date),
      dayClass: dayClass,
      tooltip: holidayMap.get(dateStr) || '',
      rollCallerId: rollCallerMap.get(dateStr) || 0,
    }
  })

  // グリッドカラムのスタイルを動的に生成
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `180px repeat(${numDays}, minmax(140px, 1fr))`,
  }

  return (
    <div className="sticky top-0 z-20 bg-gray-100 shadow-md">
      {/* 1行目: 日付・曜日 */}
      <div style={gridStyle} className="border-b border-gray-300">
        <div className="p-2 text-sm font-semibold text-gray-700 border-r border-gray-300 flex items-center bg-gray-200">
          日付 / 車両
        </div>
        {days.map(d => (
          <div key={d.dateStr} className={`p-2 text-center border-r border-gray-300 ${d.dayClass}`} title={d.tooltip}>
            <div className="text-xs">{d.dayOfWeek}</div>
            <div className="text-lg font-semibold">{d.day}</div>
          </div>
        ))}
      </div>

      {/* 2行目: 点呼者選択 */}
      <div style={gridStyle} className="border-b-2 border-gray-300 bg-white">
        <div className="p-2 text-xs font-semibold text-gray-700 border-r border-gray-300 flex items-center bg-gray-100">
          点呼者
        </div>
        {days.map(d => (
          <div key={`rc-${d.dateStr}`} className="p-1 border-r border-gray-300">
            <select
              value={d.rollCallerId}
              onChange={e => onUpdateRollCaller(d.date, parseInt(e.target.value))}
              disabled={!canEdit}
              className={`w-full text-xs p-1 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value={0}>未定</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

