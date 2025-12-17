'use client'

import React from 'react'
import { StVehicle, StHoliday } from '@prisma/generated/prisma/client'
import { ScheduleGridHeader } from './ScheduleGridHeader'
import { ScheduleGridBody } from './ScheduleGridBody'
import { StScheduleWithRelations } from '../../(server-actions)/schedule-actions'

type Props = {
  vehicles: StVehicle[]
  schedules: StScheduleWithRelations[]
  holidays: StHoliday[]
  users: { id: number; name: string }[]
  rollCallers: { date: Date; userId: number }[]
  startDate: Date
  numDays: number
  onEditSchedule: (schedule: StScheduleWithRelations) => void
  onNewSchedule: (date: Date, vehicleId: number) => void
  onUpdateRollCaller: (date: Date, userId: number) => void
  getDriverNames: (driverIds: number[]) => string
  copySource: StScheduleWithRelations | null
  selectedTargets: Set<string>
  onCopyTargetClick: (vehicleId: number, dateStr: string) => void
  onCopyStart: (schedule: StScheduleWithRelations) => void
  canEdit: boolean
  isSystemAdmin: boolean
}

export const ScheduleGrid = ({
  vehicles,
  schedules,
  holidays,
  users,
  rollCallers,
  startDate,
  numDays,
  onEditSchedule,
  onNewSchedule,
  onUpdateRollCaller,
  getDriverNames,
  copySource,
  selectedTargets,
  onCopyTargetClick,
  onCopyStart,
  canEdit,
  isSystemAdmin,
}: Props) => {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md bg-gray-50 relative">
      <ScheduleGridHeader
        startDate={startDate}
        numDays={numDays}
        holidays={holidays}
        users={users}
        rollCallers={rollCallers}
        onUpdateRollCaller={onUpdateRollCaller}
        canEdit={canEdit}
      />
      <ScheduleGridBody
        vehicles={vehicles}
        schedules={schedules}
        startDate={startDate}
        numDays={numDays}
        onEditSchedule={onEditSchedule}
        onNewSchedule={onNewSchedule}
        getDriverNames={getDriverNames}
        copySource={copySource}
        selectedTargets={selectedTargets}
        onCopyTargetClick={onCopyTargetClick}
        onCopyStart={onCopyStart}
        canEdit={canEdit}
        isSystemAdmin={isSystemAdmin}
      />
    </div>
  )
}

