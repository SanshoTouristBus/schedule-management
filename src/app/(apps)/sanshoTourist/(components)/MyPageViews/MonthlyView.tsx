'use client'

import React, { useMemo } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Bus, User, Users, UserCheck, Building, Clock, FileText } from 'lucide-react'
import { StScheduleWithRelations } from '../../(server-actions)/schedule-actions'
import { StHoliday, StUserHoliday } from '@prisma/generated/prisma/client'
import useModal from '@cm/components/utils/modal/useModal'
import { formatDate } from '@cm/class/Days/date-utils/formatters'
import { toggleStUserHoliday, getStUserHolidays } from '../../(server-actions)/user-holiday-actions'
import useSWR from 'swr'

type Props = {
  schedules: StScheduleWithRelations[]
  currentDate: Date
  setCurrentDate: (date: Date) => void
  holidays: StHoliday[]
  userHolidays: StUserHoliday[]
  userId: number
}



export const MonthlyView = ({ schedules, currentDate, setCurrentDate, holidays, userHolidays: initialUserHolidays, userId }: Props) => {
  const ScheduleDetailModal = useModal<{ schedules: StScheduleWithRelations[]; dateStr: string } | null>()

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // ユーザー休日データを再取得（toggle後に更新）
  const { data: userHolidaysData, mutate: mutateUserHolidays } = useSWR(
    ['userHolidays', userId, currentDate.toISOString()],
    async () => {
      const dateFrom = new Date(year, month, 1)
      const dateTo = new Date(year, month + 1, 0)
      return await getStUserHolidays({
        userId,
        where: { dateFrom, dateTo },
      })
    },
    {
      fallbackData: initialUserHolidays,
    }
  )

  const userHolidays = userHolidaysData || initialUserHolidays

  // 日付ごとにスケジュールをグループ化
  const schedulesByDate = useMemo(() => {
    const map = new Map<string, StScheduleWithRelations[]>()
    schedules.forEach(s => {
      const dateStr = formatDate(s.date)
      if (!map.has(dateStr)) {
        map.set(dateStr, [])
      }
      map.get(dateStr)!.push(s)
    })
    return map
  }, [schedules])

  // 祝日マップを作成（日付文字列 -> 祝日名）
  const holidayMap = useMemo(() => {
    const map = new Map<string, string>()
    holidays.forEach(h => {
      const dateStr = formatDate(h.date)
      map.set(dateStr, h.name)
    })
    return map
  }, [holidays])

  // ユーザー休日マップを作成（日付文字列 -> boolean）
  const userHolidayMap = useMemo(() => {
    const map = new Map<string, boolean>()
    userHolidays.forEach(uh => {
      const dateStr = formatDate(uh.date)
      map.set(dateStr, true)
    })
    return map
  }, [userHolidays])

  // 日付をクリックして休日をtoggle
  const handleDateClick = async (dateStr: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const date = new Date(dateStr)
    await toggleStUserHoliday(date, userId)
    mutateUserHolidays()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const todayStr = formatDate(new Date())

  // カレンダーのセル配列を作成
  const days: {
    key: string
    isBlank?: boolean
    dateStr?: string
    day?: number
    isToday?: boolean
    schedules?: StScheduleWithRelations[]
    isHoliday?: boolean
    holidayName?: string
    isUserHoliday?: boolean
    dayOfWeek?: number
  }[] = []

  // 前月の空白セル
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ key: `prev-${i}`, isBlank: true })
  }

  // 当月のセル
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dateStr = formatDate(date)
    const dayOfWeek = date.getDay()
    const isHoliday = holidayMap.has(dateStr)
    const holidayName = holidayMap.get(dateStr)
    const isUserHoliday = userHolidayMap.has(dateStr)
    const isSunday = dayOfWeek === 0
    const isSaturday = dayOfWeek === 6

    days.push({
      key: dateStr,
      dateStr: dateStr,
      day: d,
      isToday: dateStr === todayStr,
      schedules: schedulesByDate.get(dateStr) || [],
      isHoliday,
      holidayName,
      isUserHoliday,
      dayOfWeek,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md border">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-3 border-b">
        <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold">
          {year}年 {month + 1}月
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-100">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
          <div
            key={day}
            className={`p-2 text-center text-sm font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7">
        {days.map(d => {
          if (d.isBlank) {
            return <div key={d.key} className="h-full border-b border-r bg-gray-50"></div>
          }

          // 日付のスタイルを決定
          let dateTextClass = 'text-gray-800'
          if (d.isHoliday || d.dayOfWeek === 0) {
            dateTextClass = 'text-red-600'
          } else if (d.dayOfWeek === 6) {
            dateTextClass = 'text-blue-500'
          }

          // ユーザー休日の背景色
          const bgClass = d.isUserHoliday ? 'bg-red-50' : ''

          return (
            <div
              key={d.key}
              className={`h-28 border-b border-r p-1.5 overflow-y-auto relative ${bgClass}`}
            >
              {/* 日付部分 - クリックで休日toggle */}
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded"
                onClick={e => handleDateClick(d.dateStr!, e)}
              >
                <span
                  className={`text-sm font-medium ${d.isToday ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : dateTextClass
                    }`}
                >
                  {d.day}
                </span>
                {d.isHoliday && (
                  <span className="text-[8px] text-red-600 font-medium" title={d.holidayName}>
                    祝
                  </span>
                )}
                {d.isUserHoliday && (
                  <span className="text-[8px] text-red-700 font-bold" title="休日設定">
                    休
                  </span>
                )}
              </div>
              {/* スケジュール部分 - クリックでスケジュール詳細 */}
              <div className="mt-1 space-y-0.5">
                {d.schedules?.slice(0, 2).map(s => {
                  const title = `${s.departureTime}→${s.returnTime} ${s.organizationName || '(未設定)'}\n行き先: ${s.destination || '-'}\n車両: ${s.StVehicle?.plateNumber || '不明'}${s.hasGuide ? '\nガイド有' : ''}`
                  return (
                    <div
                      key={s.id}
                      className={`p-0.5 rounded text-[9px] truncate cursor-pointer ${s.hasGuide ? 'bg-green-500' : 'bg-blue-500'} text-white hover:opacity-80`}
                      title={title}
                      onClick={e => {
                        e.stopPropagation()
                        ScheduleDetailModal.handleOpen({ schedules: d.schedules!, dateStr: d.dateStr! })
                      }}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="truncate">{s.departureTime}</span>
                        {s.hasGuide && <UserCheck className="w-2.5 h-2.5 flex-shrink-0" />}
                      </div>
                      <div className="truncate text-[8px] opacity-90">{s.organizationName || '(未設定)'}</div>
                    </div>
                  )
                })}
                {d.schedules && d.schedules.length > 2 && (
                  <div
                    className="text-[9px] text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                    onClick={e => {
                      e.stopPropagation()
                      ScheduleDetailModal.handleOpen({ schedules: d.schedules!, dateStr: d.dateStr! })
                    }}
                  >
                    他 {d.schedules.length - 2}件
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* スケジュール詳細モーダル */}
      <ScheduleDetailModal.Modal>
        <div className="p-4 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">スケジュール詳細 ({ScheduleDetailModal.open?.dateStr})</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {ScheduleDetailModal.open?.schedules?.map(s => (
              <div key={s.id} className="p-4 border rounded-lg shadow-sm bg-white border-l-4 border-blue-500">
                {/* ヘッダー: 時間、団体名、PDF */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">
                        {s.departureTime} → {s.returnTime}
                      </span>
                      {s.hasGuide && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <UserCheck className="w-3 h-3 mr-1" />
                          ガイド有
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-gray-800">{s.organizationName || '(団体名未設定)'}</p>
                  </div>
                  {s.pdfFileName && (
                    <a
                      href={s.pdfFileUrl || '#'}
                      onClick={e => {
                        if (!s.pdfFileUrl) {
                          e.preventDefault()
                          alert(`「${s.pdfFileName}」を開きます (機能未実装)`)
                        }
                      }}
                      className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 flex-shrink-0 ml-2"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      運行指示書
                    </a>
                  )}
                </div>

                {/* 詳細情報: グリッドレイアウト */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {/* 左カラム */}
                  <div className="space-y-2">
                    <div className="flex items-start text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-600">行き先:</strong>
                        <span className="ml-1">{s.destination || '-'}</span>
                      </div>
                    </div>
                    <div className="flex items-start text-sm text-gray-700">
                      <Bus className="w-4 h-4 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-600">車両:</strong>
                        <span className="ml-1">
                          {s.StVehicle?.plateNumber || '不明'}
                          {s.StVehicle && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({s.StVehicle.type} / 正{s.StVehicle.seats}座席 / 補{s.StVehicle.subSeats}座席)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    {s.StScheduleDriver && s.StScheduleDriver.length > 0 && (
                      <div className="flex items-start text-sm text-gray-700">
                        <Users className="w-4 h-4 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-600">乗務員:</strong>
                          <span className="ml-1 text-xs">
                            {s.StScheduleDriver.map((sd, idx) => (
                              <span key={sd.userId}>
                                {idx > 0 && ', '}ID: {sd.userId}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 右カラム */}
                  <div className="space-y-2">
                    {s.StCustomer && (
                      <div className="flex items-start text-sm text-gray-700">
                        <Building className="w-4 h-4 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-600">顧客:</strong>
                          <span className="ml-1">{s.StCustomer.name || '-'}</span>
                        </div>
                      </div>
                    )}
                    {s.StContact && (
                      <div className="flex items-start text-sm text-gray-700">
                        <User className="w-4 h-4 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-600">担当者:</strong>
                          <span className="ml-1">
                            {s.StContact.name || s.organizationContact || '-'}
                            {s.StContact.phone && (
                              <span className="text-xs text-gray-500 ml-1">({s.StContact.phone})</span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {s.organizationContact && !s.StContact && (
                      <div className="flex items-start text-sm text-gray-700">
                        <User className="w-4 h-4 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-600">担当者:</strong>
                          <span className="ml-1">{s.organizationContact}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 備考 */}
                {s.remarks && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700 border border-gray-200">
                    <strong>備考:</strong> {s.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => ScheduleDetailModal.handleClose()}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              閉じる
            </button>
          </div>
        </div>
      </ScheduleDetailModal.Modal>
    </div>
  )
}

