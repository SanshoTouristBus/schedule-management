'use client'

import React from 'react'
import { Copy, MapPin, Users, UserCheck, Building, User, FileText } from 'lucide-react'
import { StScheduleWithRelations } from '../../(server-actions)/schedule-actions'

type Props = {
  schedule: StScheduleWithRelations
  onClick: () => void
  onCopyStart: (e: React.MouseEvent) => void
  getDriverNames: (driverIds: number[]) => string
  isCopyMode?: boolean
  canEdit?: boolean
}

export const ScheduleBar = ({ schedule, onClick, onCopyStart, getDriverNames, isCopyMode = false, canEdit = true }: Props) => {
  const driverIds = schedule.StScheduleDriver?.map(sd => sd.userId) || []
  const driverNames = getDriverNames(driverIds)

  // ツールチップ用の詳細情報を構築
  const tooltipLines = [
    schedule.organizationName || '(団体名未設定)',
    `時間: ${schedule.departureTime} → ${schedule.returnTime}`,
    schedule.destination ? `行き先: ${schedule.destination}` : '',
    schedule.StVehicle ? `車両: ${schedule.StVehicle.plateNumber} (${schedule.StVehicle.type})` : '',
    schedule.StCustomer ? `顧客: ${schedule.StCustomer.name}` : '',
    schedule.StContact ? `担当者: ${schedule.StContact.name}${schedule.StContact.phone ? ` (${schedule.StContact.phone})` : ''}` : schedule.organizationContact ? `担当者: ${schedule.organizationContact}` : '',
    driverNames ? `乗務員: ${driverNames}` : '',
    schedule.hasGuide ? 'ガイド有' : '',
    schedule.pdfFileName ? `運行指示書: ${schedule.pdfFileName}` : '',
    schedule.remarks ? `備考: ${schedule.remarks}` : '',
  ].filter(Boolean)

  const tooltipText = tooltipLines.join('\n')

  return (
    <div className="mx-0.5 group relative">
      <button
        onClick={onClick}
        className="w-full h-full p-1 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 focus:outline-none overflow-hidden text-left relative leading-tight"
        title={tooltipText}
      >
        {/* 1行目: 時間と団体名、PDFアイコン */}
        <div className="text-[10px] font-semibold truncate leading-tight flex items-center gap-1">
          <span className="opacity-90">{schedule.departureTime}</span>
          {schedule.returnTime && <span className="opacity-70">→{schedule.returnTime}</span>}
          <span className="opacity-100 truncate flex-1">{schedule.organizationName || '(未設定)'}</span>
          {schedule.pdfFileName && (
            <FileText className="w-2.5 h-2.5 flex-shrink-0 opacity-80" />
          )}
        </div>

        {/* 2行目: 行き先とガイド */}
        <div className="text-[9px] truncate opacity-85 leading-tight flex items-center gap-1">
          {schedule.destination && (
            <>
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{schedule.destination}</span>
            </>
          )}
          {schedule.hasGuide && (
            <UserCheck className="w-2.5 h-2.5 flex-shrink-0 ml-auto opacity-90" />
          )}
        </div>

        {/* 3行目: 車両情報 */}
        {schedule.StVehicle && (
          <div className="text-[8px] truncate opacity-70 leading-tight">
            {schedule.StVehicle.plateNumber}
            {schedule.StVehicle.type && ` (${schedule.StVehicle.type})`}
          </div>
        )}

        {/* 4行目: 乗務員または顧客情報 */}
        {driverNames ? (
          <div className="text-[9px] truncate opacity-75 leading-tight flex items-center gap-1">
            <Users className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate">{driverNames}</span>
          </div>
        ) : schedule.StCustomer ? (
          <div className="text-[8px] truncate opacity-70 leading-tight flex items-center gap-1">
            <Building className="w-2 h-2 flex-shrink-0" />
            <span className="truncate">{schedule.StCustomer.name}</span>
          </div>
        ) : schedule.organizationContact ? (
          <div className="text-[8px] truncate opacity-70 leading-tight flex items-center gap-1">
            <User className="w-2 h-2 flex-shrink-0" />
            <span className="truncate">{schedule.organizationContact}</span>
          </div>
        ) : null}
      </button>

      {/* コピーボタン (ホバー時に表示、コピーモード中・編集不可時は非表示) */}
      {!isCopyMode && canEdit && (
        <button
          onClick={e => {
            e.stopPropagation()
            onCopyStart(e)
          }}
          className="absolute top-0.5 right-0.5 p-0.5 bg-white text-blue-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-blue-100 transition-opacity shadow-sm"
          title="このスケジュールをコピー"
        >
          <Copy className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  )
}

