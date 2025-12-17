'use server'

import prisma from 'src/lib/prisma'
import {StSchedule} from '@prisma/generated/prisma/client'

// Types
export type StScheduleInput = {
  id?: number
  date: Date
  stVehicleId?: number | null
  stCustomerId?: number | null
  stContactId?: number | null
  organizationName?: string | null
  organizationContact?: string | null
  destination?: string | null
  hasGuide?: boolean
  departureTime?: string | null
  returnTime?: string | null
  remarks?: string | null
  pdfFileName?: string | null
  pdfFileUrl?: string | null
  batchId?: string | null
  driverIds?: number[] // 乗務員IDリスト
  sortOrder?: number
}

export type StScheduleWithRelations = Awaited<ReturnType<typeof getStSchedules>>[number]

// ========== CREATE ==========

export const createStSchedule = async (data: Omit<StScheduleInput, 'id'>) => {
  const {date, driverIds, ...rest} = data
  // クライアントから送られるDateは既にUTC形式（日本時間00:00:00 = UTC前日15:00:00）
  // なのでそのまま使用する
  const utcDate = new Date(date)

  const result = await prisma.stSchedule.create({
    data: {
      date: utcDate,
      stVehicleId: rest.stVehicleId,
      stCustomerId: rest.stCustomerId,
      stContactId: rest.stContactId,
      organizationName: rest.organizationName,
      organizationContact: rest.organizationContact,
      destination: rest.destination,
      hasGuide: rest.hasGuide ?? false,
      departureTime: rest.departureTime,
      returnTime: rest.returnTime,
      remarks: rest.remarks,
      pdfFileName: rest.pdfFileName,
      pdfFileUrl: rest.pdfFileUrl,
      batchId: rest.batchId,
      sortOrder: rest.sortOrder ?? 0,
    },
  })

  // 乗務員追加
  if (driverIds && driverIds.length > 0) {
    await prisma.stScheduleDriver.createMany({
      data: driverIds.map((userId, index) => ({
        stScheduleId: result.id,
        userId,
        sortOrder: index,
      })),
    })
  }

  return result
}

// 一括作成 (コピー機能用)
export const createStSchedulesBatch = async (schedules: Omit<StScheduleInput, 'id'>[]) => {
  const results: StSchedule[] = []

  for (const schedule of schedules) {
    const result = await createStSchedule(schedule)
    results.push(result)
  }

  return results
}

// ========== READ ==========

// 一覧取得
export const getStSchedules = async (params?: {
  where?: {
    dateFrom?: Date
    dateTo?: Date
    stVehicleId?: number
    deleted?: boolean
  }
  orderBy?: {[key: string]: 'asc' | 'desc'}
  isSystemAdmin?: boolean
  publishEndDate?: Date | null
}) => {
  const {where, orderBy, isSystemAdmin, publishEndDate} = params ?? {}

  // 公開範囲の終了日を考慮したdateTo
  let effectiveDateTo = where?.dateTo ? new Date(where.dateTo) : undefined

  // 管理者でない場合、公開範囲で制限
  if (!isSystemAdmin && publishEndDate) {
    const publishEnd = new Date(publishEndDate)

    if (!effectiveDateTo || publishEnd < effectiveDateTo) {
      effectiveDateTo = publishEnd
    }
  }

  return await prisma.stSchedule.findMany({
    where: {
      // クライアントから送られるDateは既にUTC形式なのでそのまま使用
      ...(where?.dateFrom && {date: {gte: new Date(where.dateFrom)}}),
      ...(effectiveDateTo && {date: {lte: effectiveDateTo}}),
      ...(where?.stVehicleId && {stVehicleId: where.stVehicleId}),
      deleted: where?.deleted ?? false,
    },
    include: {
      StVehicle: true,
      StCustomer: true,
      StContact: true,
      StScheduleDriver: {
        orderBy: {sortOrder: 'asc'},
      },
    },
    orderBy: orderBy ?? [{date: 'asc'}, {departureTime: 'asc'}],
  })
}

// 乗務員のスケジュール取得
export const getStSchedulesByDriver = async (params: {
  userId: number
  dateFrom?: Date
  dateTo?: Date
  isSystemAdmin?: boolean
  publishEndDate?: Date | null
}) => {
  const {userId, dateFrom, dateTo, isSystemAdmin, publishEndDate} = params

  // 公開範囲の終了日を考慮したdateTo
  let effectiveDateTo = dateTo ? new Date(dateTo) : undefined

  // 管理者でない場合、公開範囲で制限
  if (!isSystemAdmin && publishEndDate) {
    const publishEnd = new Date(publishEndDate)
    if (!effectiveDateTo || publishEnd < effectiveDateTo) {
      effectiveDateTo = publishEnd
    }
  }

  return await prisma.stSchedule.findMany({
    where: {
      StScheduleDriver: {
        some: {userId},
      },
      // クライアントから送られるDateは既にUTC形式なのでそのまま使用
      ...(dateFrom && {date: {gte: new Date(dateFrom)}}),
      ...(effectiveDateTo && {date: {lte: effectiveDateTo}}),
      deleted: false,
    },
    include: {
      StVehicle: true,
      StCustomer: true,
      StContact: true,
      StScheduleDriver: {
        orderBy: {sortOrder: 'asc'},
      },
    },
    orderBy: [{date: 'asc'}, {departureTime: 'asc'}],
  })
}

// 単一取得
export const getStSchedule = async (id: number) => {
  return await prisma.stSchedule.findUnique({
    where: {id},
    include: {
      StVehicle: true,
      StCustomer: true,
      StContact: true,
      StScheduleDriver: {
        orderBy: {sortOrder: 'asc'},
      },
    },
  })
}

// ========== UPDATE ==========

export const updateStSchedule = async (id: number, data: Partial<StScheduleInput>) => {
  const {date, driverIds, ...rest} = data

  const updateData: any = {...rest}
  // クライアントから送られるDateは既にUTC形式（日本時間00:00:00 = UTC前日15:00:00）
  if (date) {
    updateData.date = new Date(date)
  }

  const result = await prisma.stSchedule.update({
    where: {id},
    data: updateData,
  })

  // 乗務員更新
  if (driverIds !== undefined) {
    // 既存の乗務員を削除
    await prisma.stScheduleDriver.deleteMany({
      where: {stScheduleId: id},
    })

    // 新しい乗務員を追加
    if (driverIds.length > 0) {
      await prisma.stScheduleDriver.createMany({
        data: driverIds.map((userId, index) => ({
          stScheduleId: id,
          userId,
          sortOrder: index,
        })),
      })
    }
  }

  return result
}

// Upsert (Create or Update)
export const upsertStSchedule = async (data: StScheduleInput) => {
  const {id, ...rest} = data

  if (id) {
    // 更新時は既存データを取得して、編集できないフィールドは既存値を保持
    const existing = await getStSchedule(id)
    if (existing) {
      // 編集者が編集できないフィールドは既存値を保持
      const updateData: Partial<StScheduleInput> = {
        ...rest,
        // 編集者が編集できないフィールドが含まれていない場合、既存値を保持
        ...(rest.date === undefined && {date: existing.date}),
        ...(rest.stVehicleId === undefined && {stVehicleId: existing.stVehicleId}),
        ...(rest.stCustomerId === undefined && {stCustomerId: existing.stCustomerId}),
        ...(rest.stContactId === undefined && {stContactId: existing.stContactId}),
        ...(rest.departureTime === undefined && {departureTime: existing.departureTime}),
        ...(rest.returnTime === undefined && {returnTime: existing.returnTime}),
        ...(rest.driverIds === undefined && {
          driverIds: existing.StScheduleDriver?.map(sd => sd.userId) || [],
        }),
      }
      return await updateStSchedule(id, updateData)
    }
    return await updateStSchedule(id, rest)
  } else {
    return await createStSchedule(rest)
  }
}

// ========== DELETE ==========

// 論理削除
export const deleteStSchedule = async (id: number) => {
  return await prisma.stSchedule.update({
    where: {id},
    data: {
      deleted: true,
      deletedAt: new Date(),
    },
  })
}

// 物理削除
export const hardDeleteStSchedule = async (id: number) => {
  // 乗務員も削除 (Cascadeで自動削除)
  return await prisma.stSchedule.delete({
    where: {id},
  })
}

// 一括削除 (batchIdで削除)
export const deleteStSchedulesByBatchId = async (batchId: string) => {
  return await prisma.stSchedule.updateMany({
    where: {batchId},
    data: {
      deleted: true,
      deletedAt: new Date(),
    },
  })
}
