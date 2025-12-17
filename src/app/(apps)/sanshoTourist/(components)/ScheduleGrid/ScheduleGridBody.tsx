'use client'

import React, { useMemo } from 'react'
import { Check } from 'lucide-react'
import { StVehicle } from '@prisma/generated/prisma/client'
import { ScheduleBar } from './ScheduleBar'
import { StScheduleWithRelations } from '../../(server-actions)/schedule-actions'

type Props = {
  vehicles: StVehicle[]
  schedules: StScheduleWithRelations[]
  startDate: Date
  numDays: number
  onEditSchedule: (schedule: StScheduleWithRelations) => void
  onNewSchedule: (date: Date, vehicleId: number) => void
  getDriverNames: (driverIds: number[]) => string
  copySource: StScheduleWithRelations | null
  selectedTargets: Set<string>
  onCopyTargetClick: (vehicleId: number, dateStr: string) => void
  onCopyStart: (schedule: StScheduleWithRelations) => void
  canEdit: boolean
  isSystemAdmin: boolean
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

// YYYY-MM-DD文字列からローカルDateオブジェクトを作成
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0)
}

export const ScheduleGridBody = ({
  vehicles,
  schedules,
  startDate,
  numDays,
  onEditSchedule,
  onNewSchedule,
  getDriverNames,
  copySource,
  selectedTargets,
  onCopyTargetClick,
  onCopyStart,
  canEdit,
  isSystemAdmin,
}: Props) => {
  const isCopyMode = !!copySource

  // スケジュールをvehicleId + dateでマップ化
  const scheduleMap = useMemo(() => {
    const map = new Map<string, StScheduleWithRelations[]>()
    for (const v of vehicles) {
      for (let i = 0; i < numDays; i++) {
        const dateStr = getLocalDateString(addDays(startDate, i))
        const key = `${v.id}:${dateStr}`
        map.set(key, [])
      }
    }
    for (const s of schedules) {
      // DBのUTC日付をJST文字列に変換
      const dateStr = toJstDateString(s.date)
      const key = `${s.stVehicleId}:${dateStr}`
      const existing = map.get(key) || []
      existing.push(s)
      map.set(key, existing)
    }
    return map
  }, [schedules, vehicles, startDate, numDays])

  const days = Array.from({ length: numDays }).map((_, i) => getLocalDateString(addDays(startDate, i)))

  // グリッドカラムのスタイルを動的に生成
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `180px repeat(${numDays}, minmax(140px, 1fr))`,
  }

  return (
    <div style={gridStyle} className={`relative `}>
      {vehicles.map(v => (
        <React.Fragment key={v.id}>
          {/* 車両情報 (縦軸) */}
          <div
            className={`sticky left-0 p-2 border-r border-b border-gray-300 bg-white shadow-sm min-h-[90px] z-10 `}
          >
            <div className="text-sm font-semibold text-gray-800">{v.plateNumber}</div>
            <div className="text-xs text-gray-600">
              {v.type} (正{v.seats}/補{v.subSeats})
            </div>
          </div>

          {/* スケジュールセル (日付ごと) */}
          {days.map(dateStr => {
            const cellKey = `${v.id}:${dateStr}`
            const daySchedules = scheduleMap.get(cellKey) || []
            const isSelectedTarget = selectedTargets.has(cellKey)

            // コピーモード時のセルスタイル
            let cellClass = 'bg-white hover:bg-gray-50'
            if (isCopyMode) {
              if (isSelectedTarget) {
                cellClass = 'bg-yellow-100 ring-2 ring-inset ring-yellow-400 z-20 cursor-pointer opacity-100'
              } else {
                cellClass = 'bg-white  cursor-pointer hover:opacity-40'
              }
            }

            return (
              <div
                key={cellKey}
                className={`p-1 border-r border-b  border-gray-300 min-h-[90px] transition-all relative ${cellClass}`}
                onClick={e => {
                  if (isCopyMode) {
                    onCopyTargetClick(v.id, dateStr)
                  } else {
                    const target = e.target as HTMLElement
                    if (target.classList.contains('border-r') || target === e.currentTarget) {
                      // ローカル日付からDateオブジェクトを作成
                      if (isSystemAdmin) {
                        onNewSchedule(parseLocalDate(dateStr), v.id)
                      }
                    }
                  }
                }}
              >
                {/* スケジュールバーを表示 */}
                <div className={`space-y-0.5 ${isCopyMode ? 'pointer-events-none' : ''}`}>
                  {daySchedules.map(s => (
                    <div key={s.id}>

                      <ScheduleBar
                        schedule={s}
                        onClick={() => !isCopyMode && onEditSchedule(s)}
                        onCopyStart={() => !isCopyMode && canEdit && onCopyStart(s)}
                        getDriverNames={getDriverNames}
                        isCopyMode={isCopyMode}
                        canEdit={canEdit}
                      />
                    </div>
                  ))}
                </div>

                {/* コピーモード時の選択済みマーク */}
                {isCopyMode && isSelectedTarget && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Check className="w-8 h-8 text-yellow-600 opacity-80" />
                  </div>
                )}
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

