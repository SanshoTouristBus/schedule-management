'use server'

import prisma from 'src/lib/prisma'
import {toUtc} from '@cm/class/Days/date-utils/calculations'

// Types
export type StPublishSettingInput = {
  publishEndDate?: Date | null
}

// Get - 公開範囲設定取得
export const getStPublishSetting = async () => {
  // 最新の1件を取得
  const setting = await prisma.stPublishSetting.findFirst({
    orderBy: {id: 'desc'},
  })

  return setting
}

// Update - 公開範囲設定更新
export const updateStPublishSetting = async (data: StPublishSettingInput) => {
  const {publishEndDate} = data

  // 既存設定を取得
  const existing = await prisma.stPublishSetting.findFirst({
    orderBy: {id: 'desc'},
  })

  const utcDate = publishEndDate ? toUtc(publishEndDate) : null

  if (existing) {
    return await prisma.stPublishSetting.update({
      where: {id: existing.id},
      data: {publishEndDate: utcDate},
    })
  } else {
    return await prisma.stPublishSetting.create({
      data: {publishEndDate: utcDate},
    })
  }
}

// 公開範囲チェック (管理者以外用)
export const isScheduleVisible = async (scheduleDate: Date, userRole: string) => {
  // 管理者は常に閲覧可能
  if (userRole === 'admin') return true

  const setting = await getStPublishSetting()

  // 設定がない場合は全て表示
  if (!setting?.publishEndDate) return true

  const utcDate = toUtc(scheduleDate)
  return utcDate <= setting.publishEndDate
}

