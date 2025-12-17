import {basePath} from '@cm/lib/methods/common'
import {NextRequest} from 'next/server'
import {anyObject} from '@cm/types/utility-types'

export const isRouteAccessAllowed = async (req: NextRequest) => {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')

  const authorization = req.headers.get('authorization')

  const secretKey = process.env.NEXTAUTH_SECRET
  const accessFromApp = basePath?.includes(host ?? '')

  const accessWithAuth = authorization === secretKey
  const isAllowed = accessFromApp || accessWithAuth

  return isAllowed
}

export const logObject = (obj: anyObject) => {
  let stringified = JSON.stringify(obj)
  stringified = stringified.replace(/\s+/g, ' ')
  return stringified
}
