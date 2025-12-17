'use server'

import prisma from 'src/lib/prisma'

// 乗務員はUserテーブルのapps配列に'sanshoTourist'を持つユーザーとして扱う

// Types
export type DriverUser = {
  id: number
  name: string
  email: string | null
  phone: string | null
}

// ========== READ ==========

// 乗務員一覧取得 (sanshoTouristアプリを持つユーザー)
export const getDrivers = async (params?: {orderBy?: {[key: string]: 'asc' | 'desc'}}) => {
  const {orderBy} = params ?? {}

  const drivers = await prisma.user.findMany({
    where: {
      apps: {has: 'sanshoTourist'},
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
    orderBy: orderBy ?? {name: 'asc'},
  })

  return drivers
}

// 乗務員単一取得
export const getDriver = async (id: number) => {
  return await prisma.user.findUnique({
    where: {id},
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  })
}
