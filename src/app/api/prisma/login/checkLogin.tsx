'use server'

import {verifyPassword} from '@cm/lib/crypt'
import prisma from 'src/lib/prisma'
import {SessionFaker} from 'src/non-common/SessionFaker'

export const CheckLogin = async ({authId, authPw}) => {
  const targetModels = SessionFaker.getTargetModels()

  let foundUser

  let i = 0
  while (foundUser === undefined) {
    const targetModel = targetModels[i]
    if (!targetModel) {
      break
    }

    const {name, id_pw} = targetModel

    const authKey = {
      id: id_pw?.id ?? 'email',
      pw: id_pw?.pw ?? 'password',
    }

    const PrismaClient = prisma?.[name] as any

    const userData = await PrismaClient?.findUnique({where: {[authKey.id]: authId}})

    if (userData) {
      foundUser = {...userData, authKey}
      // continue
    }
    i++
  }

  if (foundUser) {
    const {authKey, ...userData} = foundUser

    let match = false

    match = String(userData?.[authKey.pw]) === String(authPw)

    if (!match) {
      const hasedMatch = await verifyPassword(authPw, userData?.[authKey.pw])
      match = hasedMatch
    }

    if (match) {
      const {name, email, role, type} = userData ?? {}
      console.info('user confirmed', {name, email, role, type})
      return foundUser
    }
  }

  console.info('ログイン失敗', {foundUser: null})
  return null
}
