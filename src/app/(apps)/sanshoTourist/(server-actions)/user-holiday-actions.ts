'use server'

import prisma from 'src/lib/prisma'
import { toUtc } from '@cm/class/Days/date-utils/calculations'

// Types
export type StUserHolidayInput = {
  id?: number
  date: Date
  userId: number
}

// ========== CREATE ==========

export const createStUserHoliday = async (data: Omit<StUserHolidayInput, 'id'>) => {
  const utcDate = toUtc(data.date)

  // 同じ日付が存在するか確認
  const existing = await prisma.stUserHoliday.findFirst({
    where: {
      userId: data.userId,
      date: utcDate,
    },
  })

  if (existing) {
    return existing
  }

  return await prisma.stUserHoliday.create({
    data: {
      date: utcDate,
      userId: data.userId,
    },
  })
}

// ========== READ ==========

// 一覧取得
export const getStUserHolidays = async (params?: {
  userId?: number
  where?: {
    dateFrom?: Date
    dateTo?: Date
  }
  orderBy?: { [key: string]: 'asc' | 'desc' }
}) => {
  const { userId, where, orderBy } = params ?? {}

  return await prisma.stUserHoliday.findMany({
    where: {
      ...(userId && { userId }),
      ...(where?.dateFrom && { date: { gte: toUtc(where.dateFrom) } }),
      ...(where?.dateTo && { date: { lte: toUtc(where.dateTo) } }),
    },
    orderBy: orderBy ?? { date: 'asc' },
  })
}

// 単一取得
export const getStUserHoliday = async (id: number) => {
  return await prisma.stUserHoliday.findUnique({
    where: { id },
  })
}

// 日付とユーザーIDで取得
export const getStUserHolidayByDateAndUserId = async (date: Date, userId: number) => {
  return await prisma.stUserHoliday.findFirst({
    where: {
      userId,
      date: toUtc(date),
    },
  })
}

// ========== DELETE ==========

export const deleteStUserHoliday = async (id: number) => {
  return await prisma.stUserHoliday.delete({
    where: { id },
  })
}

// 日付とユーザーIDで削除
export const deleteStUserHolidayByDateAndUserId = async (date: Date, userId: number) => {
  const existing = await getStUserHolidayByDateAndUserId(date, userId)
  if (existing) {
    return await deleteStUserHoliday(existing.id)
  }
  return null
}

// ========== TOGGLE ==========

// 日付をクリックして休日をtoggle
export const toggleStUserHoliday = async (date: Date, userId: number) => {
  const existing = await getStUserHolidayByDateAndUserId(date, userId)
  if (existing) {
    // 存在する場合は削除
    await deleteStUserHoliday(existing.id)
    return { action: 'deleted', id: existing.id }
  } else {
    // 存在しない場合は作成
    const created = await createStUserHoliday({ date, userId })
    return { action: 'created', id: created.id }
  }
}

