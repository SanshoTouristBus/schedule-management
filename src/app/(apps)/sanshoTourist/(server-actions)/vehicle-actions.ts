'use server'

import prisma from 'src/lib/prisma'

// Types
export type StVehicleInput = {
  id?: number
  plateNumber: string
  type?: string | null
  seats?: number
  subSeats?: number
  phone?: string | null
  active?: boolean
  sortOrder?: number
}

// ========== CREATE ==========

export const createStVehicle = async (data: Omit<StVehicleInput, 'id'>) => {
  return await prisma.stVehicle.create({
    data: {
      plateNumber: data.plateNumber,
      type: data.type,
      seats: data.seats ?? 0,
      subSeats: data.subSeats ?? 0,
      phone: data.phone,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  })
}

// ========== READ ==========

// 一覧取得
export const getStVehicles = async (params?: {where?: {active?: boolean}; orderBy?: {[key: string]: 'asc' | 'desc'}}) => {
  const {where, orderBy} = params ?? {}

  return await prisma.stVehicle.findMany({
    where: {
      active: where?.active ?? true,
    },
    orderBy: orderBy ?? {plateNumber: 'asc'},
  })
}

// 単一取得
export const getStVehicle = async (id: number) => {
  return await prisma.stVehicle.findUnique({
    where: {id},
  })
}

// ========== UPDATE ==========

export const updateStVehicle = async (id: number, data: Partial<StVehicleInput>) => {
  return await prisma.stVehicle.update({
    where: {id},
    data,
  })
}

// Upsert (Create or Update)
export const upsertStVehicle = async (data: StVehicleInput) => {
  const {id, ...rest} = data

  if (id) {
    return await updateStVehicle(id, rest)
  } else {
    return await createStVehicle(rest as Omit<StVehicleInput, 'id'>)
  }
}

// ========== DELETE ==========

// 論理削除
export const deleteStVehicle = async (id: number) => {
  return await prisma.stVehicle.update({
    where: {id},
    data: {active: false},
  })
}

// 物理削除
export const hardDeleteStVehicle = async (id: number) => {
  return await prisma.stVehicle.delete({
    where: {id},
  })
}
