'use client'

import {useState, useCallback, useMemo} from 'react'
import useSWR from 'swr'
import {
  getStSchedules,
  upsertStSchedule,
  createStSchedulesBatch,
} from '../(server-actions)/schedule-actions'
import {getStRollCallers, upsertStRollCaller} from '../(server-actions)/rollcaller-actions'

// 日付操作ユーティリティ
const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

type UseScheduleGridParams = {
  numDays?: number
}

export const useScheduleGrid = ({numDays = 14}: UseScheduleGridParams = {}) => {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const endDate = useMemo(() => addDays(startDate, numDays), [startDate, numDays])

  // スケジュールデータ取得
  const {
    data: schedules = [],
    mutate: mutateSchedules,
    isLoading: isLoadingSchedules,
  } = useSWR(['stSchedules', startDate.toISOString(), endDate.toISOString()], async () => {
    return await getStSchedules({
      where: {
        dateFrom: startDate,
        dateTo: endDate,
        deleted: false,
      },
    })
  })

  // 点呼者データ取得
  const {
    data: rollCallers = [],
    mutate: mutateRollCallers,
    isLoading: isLoadingRollCallers,
  } = useSWR(['stRollCallers', startDate.toISOString(), endDate.toISOString()], async () => {
    return await getStRollCallers({
      where: {
        dateFrom: startDate,
        dateTo: endDate,
      },
    })
  })

  // 日付移動
  const goToPreviousWeek = useCallback(() => {
    setStartDate(prev => addDays(prev, -7))
  }, [])

  const goToNextWeek = useCallback(() => {
    setStartDate(prev => addDays(prev, 7))
  }, [])

  const goToPreviousDay = useCallback(() => {
    setStartDate(prev => addDays(prev, -1))
  }, [])

  const goToNextDay = useCallback(() => {
    setStartDate(prev => addDays(prev, 1))
  }, [])

  const goToToday = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setStartDate(today)
  }, [])

  // スケジュール保存
  const saveSchedule = useCallback(
    async (data: Parameters<typeof upsertStSchedule>[0]) => {
      await upsertStSchedule(data)
      await mutateSchedules()
    },
    [mutateSchedules]
  )

  // スケジュール一括作成
  const createSchedulesBatch = useCallback(
    async (schedules: Parameters<typeof createStSchedulesBatch>[0]) => {
      await createStSchedulesBatch(schedules)
      await mutateSchedules()
    },
    [mutateSchedules]
  )

  // 点呼者更新
  const updateRollCaller = useCallback(
    async (date: Date, userId: number) => {
      await upsertStRollCaller({date, userId})
      await mutateRollCallers()
    },
    [mutateRollCallers]
  )

  return {
    startDate,
    endDate,
    numDays,
    schedules,
    rollCallers,
    isLoading: isLoadingSchedules || isLoadingRollCallers,
    goToPreviousWeek,
    goToNextWeek,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    saveSchedule,
    createSchedulesBatch,
    updateRollCaller,
    mutateSchedules,
    mutateRollCallers,
  }
}

