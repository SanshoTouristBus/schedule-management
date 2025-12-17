'use server'

import prisma from 'src/lib/prisma'

// Types
export type StCustomerInput = {
  id?: number
  name: string
  active?: boolean
  sortOrder?: number
}

export type StContactInput = {
  id?: number
  stCustomerId: number
  name: string
  phone?: string | null
  active?: boolean
  sortOrder?: number
}

// ==================== StCustomer (会社) ====================

// ========== CREATE ==========

export const createStCustomer = async (data: Omit<StCustomerInput, 'id'>) => {
  return await prisma.stCustomer.create({
    data: {
      name: data.name,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  })
}

// ========== READ ==========

// 一覧取得 (担当者含む)
export const getStCustomers = async (params?: {
  where?: {active?: boolean}
  includeContacts?: boolean
  orderBy?: {[key: string]: 'asc' | 'desc'}
}) => {
  const {where, includeContacts = true, orderBy} = params ?? {}

  return await prisma.stCustomer.findMany({
    where: {
      active: where?.active ?? true,
    },
    include: includeContacts
      ? {
          StContact: {
            where: {active: true},
            orderBy: {name: 'asc'},
          },
        }
      : undefined,
    orderBy: orderBy ?? {name: 'asc'},
  })
}

// 単一取得
export const getStCustomer = async (id: number) => {
  return await prisma.stCustomer.findUnique({
    where: {id},
    include: {
      StContact: {
        where: {active: true},
        orderBy: {name: 'asc'},
      },
    },
  })
}

// ========== UPDATE ==========

export const updateStCustomer = async (id: number, data: Partial<StCustomerInput>) => {
  return await prisma.stCustomer.update({
    where: {id},
    data,
  })
}

// Upsert (Create or Update)
export const upsertStCustomer = async (data: StCustomerInput) => {
  const {id, ...rest} = data

  if (id) {
    return await updateStCustomer(id, rest)
  } else {
    return await createStCustomer(rest)
  }
}

// ========== DELETE ==========

// 論理削除
export const deleteStCustomer = async (id: number) => {
  return await prisma.stCustomer.update({
    where: {id},
    data: {active: false},
  })
}

// 物理削除
export const hardDeleteStCustomer = async (id: number) => {
  return await prisma.stCustomer.delete({
    where: {id},
  })
}

// ==================== StContact (担当者) ====================

// ========== CREATE ==========

export const createStContact = async (data: Omit<StContactInput, 'id'>) => {
  return await prisma.stContact.create({
    data: {
      stCustomerId: data.stCustomerId,
      name: data.name,
      phone: data.phone,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  })
}

// ========== READ ==========

// 一覧取得
export const getStContacts = async (params?: {
  where?: {stCustomerId?: number; active?: boolean}
  orderBy?: {[key: string]: 'asc' | 'desc'}
}) => {
  const {where, orderBy} = params ?? {}

  return await prisma.stContact.findMany({
    where: {
      stCustomerId: where?.stCustomerId,
      active: where?.active ?? true,
    },
    include: {
      StCustomer: true,
    },
    orderBy: orderBy ?? {name: 'asc'},
  })
}

// 単一取得
export const getStContact = async (id: number) => {
  return await prisma.stContact.findUnique({
    where: {id},
    include: {
      StCustomer: true,
    },
  })
}

// ========== UPDATE ==========

export const updateStContact = async (id: number, data: Partial<StContactInput>) => {
  return await prisma.stContact.update({
    where: {id},
    data,
  })
}

// Upsert (Create or Update)
export const upsertStContact = async (data: StContactInput) => {
  const {id, ...rest} = data

  if (id) {
    return await updateStContact(id, rest)
  } else {
    return await createStContact(rest)
  }
}

// ========== DELETE ==========

// 論理削除
export const deleteStContact = async (id: number) => {
  return await prisma.stContact.update({
    where: {id},
    data: {active: false},
  })
}

// 物理削除
export const hardDeleteStContact = async (id: number) => {
  return await prisma.stContact.delete({
    where: {id},
  })
}
