'use server'

import prisma from 'src/lib/prisma'
import {toUtc} from '@cm/class/Days/date-utils/calculations'

// Types
export type StHolidayInput = {
  id?: number
  date: Date
  name: string
  sortOrder?: number
}

// ========== CREATE ==========

export const createStHoliday = async (data: Omit<StHolidayInput, 'id'>) => {
  const utcDate = toUtc(data.date)

  // 同じ日付が存在するか確認
  const existing = await prisma.stHoliday.findFirst({
    where: {date: utcDate},
  })

  if (existing) {
    // 既存レコードを更新
    return await prisma.stHoliday.update({
      where: {id: existing.id},
      data: {
        name: data.name,
        sortOrder: data.sortOrder ?? 0,
      },
    })
  } else {
    return await prisma.stHoliday.create({
      data: {
        date: utcDate,
        name: data.name,
        sortOrder: data.sortOrder ?? 0,
      },
    })
  }
}

// ========== READ ==========

// 一覧取得
export const getStHolidays = async (params?: {
  where?: {
    dateFrom?: Date
    dateTo?: Date
  }
  orderBy?: {[key: string]: 'asc' | 'desc'}
}) => {
  const {where, orderBy} = params ?? {}

  return await prisma.stHoliday.findMany({
    where: {
      ...(where?.dateFrom && {date: {gte: toUtc(where.dateFrom)}}),
      ...(where?.dateTo && {date: {lte: toUtc(where.dateTo)}}),
    },
    orderBy: orderBy ?? {date: 'asc'},
  })
}

// 単一取得
export const getStHoliday = async (id: number) => {
  return await prisma.stHoliday.findUnique({
    where: {id},
  })
}

// 日付で取得
export const getStHolidayByDate = async (date: Date) => {
  return await prisma.stHoliday.findFirst({
    where: {date: toUtc(date)},
  })
}

// ========== UPDATE ==========

export const updateStHoliday = async (id: number, data: Partial<StHolidayInput>) => {
  const updateData: any = {...data}
  if (data.date) {
    updateData.date = toUtc(data.date)
  }
  return await prisma.stHoliday.update({
    where: {id},
    data: updateData,
  })
}

// Upsert (Create or Update)
export const upsertStHoliday = async (data: StHolidayInput) => {
  const {id, ...rest} = data

  if (id) {
    return await updateStHoliday(id, rest)
  } else {
    return await createStHoliday(rest)
  }
}

// ========== DELETE ==========

export const deleteStHoliday = async (id: number) => {
  return await prisma.stHoliday.delete({
    where: {id},
  })
}
