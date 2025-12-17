'use server'

import prisma from 'src/lib/prisma'
import {toUtc} from '@cm/class/Days/date-utils/calculations'

// Types
export type StRollCallerInput = {
  id?: number
  date: Date
  userId: number
}

// ========== CREATE ==========

export const createStRollCaller = async (data: Omit<StRollCallerInput, 'id'>) => {
  const utcDate = toUtc(data.date)

  return await prisma.stRollCaller.create({
    data: {
      date: utcDate,
      userId: data.userId,
    },
  })
}

// ========== READ ==========

// 期間で取得
export const getStRollCallers = async (params?: {
  where?: {
    dateFrom?: Date
    dateTo?: Date
  }
}) => {
  const {where} = params ?? {}

  return await prisma.stRollCaller.findMany({
    where: {
      ...(where?.dateFrom && {date: {gte: toUtc(where.dateFrom)}}),
      ...(where?.dateTo && {date: {lte: toUtc(where.dateTo)}}),
    },
    orderBy: {date: 'asc'},
  })
}

// 日付で取得
export const getStRollCallerByDate = async (date: Date) => {
  return await prisma.stRollCaller.findFirst({
    where: {date: toUtc(date)},
  })
}

// ========== UPDATE ==========

export const updateStRollCaller = async (id: number, data: Partial<StRollCallerInput>) => {
  const updateData: any = {...data}
  if (data.date) {
    updateData.date = toUtc(data.date)
  }
  return await prisma.stRollCaller.update({
    where: {id},
    data: updateData,
  })
}

// Upsert (日付でupsert)
export const upsertStRollCaller = async (data: StRollCallerInput) => {
  const {id, date, userId} = data
  const utcDate = toUtc(date)

  // 既存レコードを検索
  const existing = await prisma.stRollCaller.findFirst({
    where: {date: utcDate},
  })

  if (existing) {
    if (userId === 0) {
      // userId が 0 の場合は削除
      return await prisma.stRollCaller.delete({
        where: {id: existing.id},
      })
    }
    return await updateStRollCaller(existing.id, {userId})
  } else {
    if (userId === 0) {
      // 追加なし
      return null
    }
    return await createStRollCaller({date, userId})
  }
}

// ========== DELETE ==========

export const deleteStRollCaller = async (id: number) => {
  return await prisma.stRollCaller.delete({
    where: {id},
  })
}
