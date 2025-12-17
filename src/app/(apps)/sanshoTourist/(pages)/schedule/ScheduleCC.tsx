'use client'

import React, { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { StVehicle, StCustomer, StContact, StHoliday } from '@prisma/generated/prisma/client'
import useSWR from 'swr'

import useModal from '@cm/components/utils/modal/useModal'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'

import { ScheduleGrid } from '../../(components)/ScheduleGrid/ScheduleGrid'
import { ScheduleForm, ScheduleFormData } from '../../(components)/ScheduleForm'
import { CopyModeController } from '../../(components)/CopyModeController'
import {
  getStSchedules,
  upsertStSchedule,
  createStSchedulesBatch,
  StScheduleWithRelations,
} from '../../(server-actions)/schedule-actions'
import { getStRollCallers, upsertStRollCaller } from '../../(server-actions)/rollcaller-actions'

type Props = {
  vehicles: StVehicle[]
  customers: (StCustomer & { StContact: StContact[] })[]
  drivers: { id: number; name: string }[]
  holidays: StHoliday[]
  allUsers: { id: number; name: string }[]
  initialMonth: Date
  numDays: number
  canEdit: boolean
  isSystemAdmin: boolean
  isEditor: boolean
  isViewer: boolean
  publishEndDate: Date | null
}

// 日付操作ユーティリティ
const addMonths = (date: Date, months: number) => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

const formatYearMonth = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const formatYearMonthDisplay = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}年${month}月`
}

// YYYY-MM-DD文字列からローカルDateオブジェクトを作成
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0)
}

export const ScheduleCC = ({ vehicles, customers, drivers, holidays, allUsers, initialMonth, numDays, canEdit, isSystemAdmin, isEditor, isViewer, publishEndDate }: Props) => {
  const { toggleLoad, addQuery } = useGlobal()

  // 表示期間 (URLから初期値を取得)
  const startDate = initialMonth

  // コピー機能用ステート
  const [copySource, setCopySource] = useState<StScheduleWithRelations | null>(null)
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set())

  // モーダル
  const ScheduleModalReturn = useModal<{ schedule?: Partial<StScheduleWithRelations> } | null>()

  // 月変更 (URLクエリパラメータで管理)
  const changeMonth = (newDate: Date) => {
    addQuery({ month: formatYearMonth(newDate) })
  }

  // スケジュールデータ取得
  const endDate = addDays(startDate, numDays - 1)
  const { data: scheduleData, mutate: mutateSchedules } = useSWR(
    ['stSchedules', startDate.toISOString(), endDate.toISOString(), isSystemAdmin],
    async () => {
      const schedules = await getStSchedules({
        where: {
          dateFrom: startDate,
          dateTo: endDate,
          deleted: false,
        },
        isSystemAdmin,
        publishEndDate,
      })
      return schedules
    }
  )

  // 点呼者データ取得
  const { data: rollCallersData, mutate: mutateRollCallers } = useSWR(
    ['stRollCallers', startDate.toISOString(), endDate.toISOString()],
    async () => {
      const rollCallers = await getStRollCallers({
        where: {
          dateFrom: startDate,
          dateTo: endDate,
        },
      })
      return rollCallers
    }
  )

  const schedules = scheduleData || []
  const rollCallers = rollCallersData || []

  // 乗務員名取得
  const getDriverNames = useCallback(
    (driverIds: number[]) => {
      return driverIds
        .map(id => drivers.find(d => d.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    },
    [drivers]
  )

  // スケジュール編集（編集権限がある場合のみ）
  const handleEditSchedule = (schedule: StScheduleWithRelations) => {
    if (!canEdit) return
    ScheduleModalReturn.handleOpen({ schedule })
  }

  // 新規スケジュール（管理者のみ、編集者は既存データの編集のみ）
  const handleNewSchedule = (date: Date, vehicleId: number) => {
    if (!isSystemAdmin) return // 管理者のみ新規作成可能
    ScheduleModalReturn.handleOpen({
      schedule: {
        date,
        stVehicleId: vehicleId,
      },
    })
  }

  // スケジュール保存
  const handleSaveSchedule = async (data: ScheduleFormData) => {
    await toggleLoad(async () => {
      // 編集者の場合、編集可能なフィールドのみを送信
      if (isEditor && !isSystemAdmin) {
        // 編集者が編集可能なフィールド: 顧客選択、団体名、担当者、行き先、ガイドの有無、備考
        // 編集者は既存データの編集のみ（新規作成は管理者のみ）
        if (!data.id) {
          throw new Error('編集者は新規作成できません')
        }
        await upsertStSchedule({
          id: data.id,
          date: data.date,
          stCustomerId: data.stCustomerId,
          stContactId: data.stContactId,
          organizationName: data.organizationName,
          organizationContact: data.organizationContact,
          destination: data.destination,
          hasGuide: data.hasGuide,
          remarks: data.remarks,
        })
      } else {
        // 管理者は全てのフィールドを送信
        await upsertStSchedule({
          id: data.id,
          date: data.date,
          stVehicleId: data.stVehicleId,
          stCustomerId: data.stCustomerId,
          stContactId: data.stContactId,
          organizationName: data.organizationName,
          organizationContact: data.organizationContact,
          destination: data.destination,
          hasGuide: data.hasGuide,
          departureTime: data.departureTime,
          returnTime: data.returnTime,
          remarks: data.remarks,
          driverIds: data.driverIds,
        })
      }
      await mutateSchedules()
    })
    ScheduleModalReturn.handleClose()
  }

  // 点呼者更新（編集権限がある場合のみ）
  const handleUpdateRollCaller = async (date: Date, userId: number) => {
    if (!canEdit) return
    await toggleLoad(async () => {
      await upsertStRollCaller({ date, userId })
      await mutateRollCallers()
    })
  }

  // コピー機能（編集権限がある場合のみ）
  const handleCopyStart = (schedule: StScheduleWithRelations) => {
    if (!canEdit) return
    setCopySource(schedule)
    setSelectedTargets(new Set())
  }

  const handleCopyCancel = () => {
    setCopySource(null)
    setSelectedTargets(new Set())
  }

  const handleCopyTargetClick = (vehicleId: number, dateStr: string) => {
    if (!copySource) return

    const key = `${vehicleId}:${dateStr}`
    setSelectedTargets(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handleCopyExecute = async () => {
    if (!copySource || selectedTargets.size === 0) return

    if (!window.confirm(`${selectedTargets.size}件のセルにスケジュールをコピーしますか？`)) {
      return
    }

    const newSchedules: Parameters<typeof createStSchedulesBatch>[0] = []
    selectedTargets.forEach(key => {
      const [vehicleIdStr, dateStr] = key.split(':')
      const vehicleId = parseInt(vehicleIdStr)

      newSchedules.push({
        // ローカル日付からDateオブジェクトを作成（Server Actions側でUTCに変換される）
        date: parseLocalDate(dateStr),
        stVehicleId: vehicleId,
        stCustomerId: copySource.stCustomerId,
        stContactId: copySource.stContactId,
        organizationName: copySource.organizationName,
        organizationContact: copySource.organizationContact,
        destination: copySource.destination,
        hasGuide: copySource.hasGuide,
        departureTime: copySource.departureTime,
        returnTime: copySource.returnTime,
        remarks: copySource.remarks,
        driverIds: copySource.StScheduleDriver?.map(sd => sd.userId) || [],
      })
    })

    await toggleLoad(async () => {
      await createStSchedulesBatch(newSchedules)
      await mutateSchedules()
    })

    handleCopyCancel()
  }

  return (
    <div>
      {/* ヘッダー (月切り替え) */}
      <div className="flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => changeMonth(addMonths(startDate, -1))}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center"
            disabled={!!copySource}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">前月</span>
          </button>
          <button
            onClick={() => {
              const today = new Date()
              const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
              changeMonth(firstDayOfCurrentMonth)
            }}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-sm font-medium"
            disabled={!!copySource}
          >
            今月
          </button>
          <button
            onClick={() => changeMonth(addMonths(startDate, 1))}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center"
            disabled={!!copySource}
          >
            <span className="text-sm">翌月</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-lg font-bold text-gray-800">{formatYearMonthDisplay(startDate)}</div>
        <div className="flex space-x-2">
          {isSystemAdmin ? (
            <button
              onClick={() => ScheduleModalReturn.handleOpen({ schedule: undefined })}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
              disabled={!!copySource}
            >
              <Plus className="w-5 h-5 mr-1" /> 新規作成
            </button>
          ) : isEditor ? (
            <span className="px-4 py-2 rounded-lg bg-blue-200 text-blue-700 text-sm">
              編集モード（一部フィールドのみ編集可能）
            </span>
          ) : (
            <span className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm">
              閲覧モード
            </span>
          )}
        </div>
      </div>

      {/* ガントチャート */}
      <ScheduleGrid
        vehicles={vehicles}
        schedules={schedules}
        holidays={holidays}
        users={allUsers}
        rollCallers={rollCallers}
        startDate={startDate}
        numDays={numDays}
        onEditSchedule={handleEditSchedule}
        onNewSchedule={handleNewSchedule}
        onUpdateRollCaller={handleUpdateRollCaller}
        getDriverNames={getDriverNames}
        copySource={copySource}
        selectedTargets={selectedTargets}
        onCopyTargetClick={handleCopyTargetClick}
        onCopyStart={handleCopyStart}
        canEdit={canEdit}
        isSystemAdmin={isSystemAdmin}
      />

      {/* コピーモードコントローラー */}
      <CopyModeController
        copySource={copySource}
        selectedTargetsCount={selectedTargets.size}
        onCancel={handleCopyCancel}
        onExecute={handleCopyExecute}
      />

      {/* スケジュール編集モーダル */}
      <ScheduleModalReturn.Modal>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">
            {ScheduleModalReturn.open?.schedule?.id ? '運行データの編集' : '運行データの新規作成'}
          </h2>
          <ScheduleForm
            initialData={ScheduleModalReturn.open?.schedule}
            vehicles={vehicles}
            customers={customers}
            drivers={drivers}
            onSave={handleSaveSchedule}
            onClose={() => ScheduleModalReturn.handleClose()}
            isSystemAdmin={isSystemAdmin}
            isEditor={isEditor}
            isViewer={isViewer}
          />
        </div>
      </ScheduleModalReturn.Modal>
    </div>
  )
}
