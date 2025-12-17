'use server'

import { basePath } from '../cm/lib/methods/common'
import { fileTypeFromBuffer } from 'file-type'
import { getServerSession } from 'next-auth'
import { getScopes } from 'src/non-common/scope-lib/getScopes'
import { anyObject } from '@cm/types/utility-types'
import { doStandardPrisma } from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'
import { Prisma } from '@prisma/generated/prisma/client'
import { authOptions } from '@app/api/auth/[...nextauth]/constants/authOptions'
import { FakeOrKeepSession } from 'src/non-common/scope-lib/FakeOrKeepSession'
import { headers } from 'next/headers'

export const getUrlInfoInServer = async pathname => {
  const rootPath = pathname?.replace(basePath ?? '', '').split('/')[1] ?? ''
  return { pathname, rootPath }
}
export const getFileInfo = async fileOrPath => {
  const file = fileOrPath
  const { fieldname, originalname, encoding, mimetype, buffer, size } = file
  const fileType: any = await fileTypeFromBuffer(file.buffer)
  const { ext, mime } = fileType

  return {
    ext,
    fieldname,
    originalname,
    encoding,
    mimetype: mime,
    buffer,
    size,
  }
}

export const fetchUserRole = async ({ session }) => {
  const args: Prisma.UserRoleFindManyArgs = {
    select: {
      RoleMaster: {
        select: {
          name: true,
          description: true,
          color: true,
          apps: true,
        },
      },
    },
    where: { userId: typeof session?.id === `string` ? 0 : (session?.id ?? 0) },
  }
  let { result: roles } = await doStandardPrisma(`userRole`, `findMany`, args)
  roles = roles?.map(v => ({ ...v, name: v.RoleMaster.name, color: v.RoleMaster.color }))

  return { roles }
}

// 現在のリクエストのヘッダーからpathnameを取得
export const server_getPathname = async () => {
  try {
    const headersList = await headers()
    const referer = headersList.get('referer') || ''
    const url = new URL(referer)

    const pathName = url.pathname
    const rootPath = pathName.split('/')[1]
    return { rootPath, pathName }
  } catch (error) {
    return { rootPath: '/', pathName: '/' }
  }
}

/**server component関係 */

export const sessionOnServer = async () => {
  const data: any = await getServerSession(authOptions)
  const session: anyObject = data?.user
  return { session }
}

export const initServerComopnent = async ({ query }) => {
  const { session: realSession } = await sessionOnServer()

  const session = await FakeOrKeepSession({ query, realSession: realSession })





  const { roles } = await fetchUserRole({ session })

  const scopes = getScopes(session, { query, roles })

  // const userClData = new UserCl({user: session, roles, scopes})

  return {
    session,
    query,
    scopes,
  }
}

export const getItem = async () => {
  return
}

export const isApiAccessAllowed = async props => {
  const { req, res } = props

  const body = req?.body ?? {}
  const { rawHeaders } = req

  const headerObject = {}
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const key = rawHeaders[i]
    const value = rawHeaders[i + 1]
    headerObject[key] = value
  }

  const host = req.headers['x-forwarded-host'] ?? req.headers['host']
  const { referer, authorization } = req?.headers ?? {}

  const secretKey = process.env.NEXTAUTH_SECRET
  const accessFromApp = basePath?.includes(host)
  const accessWithAuth = authorization === secretKey
  const isAllowed = accessFromApp || accessWithAuth

  if (!isAllowed) {
    const message = 'APIへのアクセスが禁止されています。'
    console.error({ host, basePath, referer, secretKey, authorization, message, body })
    console.error(message)
    return true
    return res.status(500).json({ succes: false, message: 'APIへのアクセスが禁止されています。' })
  }
  return true
}

export const isCron = async ({ req }) => {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const accessFromApp = basePath?.includes(host ?? '')
  const byCronJob = req.headers.get('Authorization') === `Bearer ${process.env.CRON_SECRET}`
  if (accessFromApp || byCronJob) return true

  console.log(`cron job unauthorized`)
  return false
}
