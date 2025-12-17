import { SessionFaker } from 'src/non-common/SessionFaker'

type roleArray = string[] | string
type session = any
export function roleIs(roleArray: roleArray, session: session) {
  typeof roleArray === 'string' && (roleArray = [roleArray])
  return roleArray.includes(session?.role)
}

export function typeIs(roleArray: roleArray, session: session) {
  typeof roleArray === 'string' && (roleArray = [roleArray])
  return roleArray.includes(session?.type)
}

export function userIs(key, roleArray: roleArray, session: session) {
  typeof roleArray === 'string' && (roleArray = [roleArray])
  return roleArray.includes(session?.[key])
}

export const judgeIsAdmin = (session: session, query) => {
  const admin = roleIs('管理者', session)

  const getGlobalUserId = () => {
    const targetModels = SessionFaker.getTargetModels()

    const key = targetModels.find(item => item.globalId)?.globalId ?? ''

    let result: number
    if (!admin) {
      result = 0
    } else {
      result = Number(query?.[key] ?? 0)
    }

    result = Number(result)

    return result
  }

  return {
    admin,
    getGlobalUserId,
    globalUserId: getGlobalUserId(),
  }
}
