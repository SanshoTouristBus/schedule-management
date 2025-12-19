import useMyNavigation from 'src/cm/hooks/globalHooks/useMyNavigation'
import {useSession} from 'next-auth/react'
import {anyObject} from '@cm/types/utility-types'
import useUserRole from '@cm/hooks/useUserRole'
import {FakeOrKeepSession} from 'src/non-common/scope-lib/FakeOrKeepSession'
import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {judgeIsAdmin} from 'src/non-common/scope-lib/judgeIsAdmin'
import {UserCl} from '@cm/class/UserCl'
import {User} from '@prisma/generated/prisma/client'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {Session} from 'next-auth'

export type customeSessionType = anyObject
export default function useCustomSession(props?: {session?: Session | null}) {
  const {query} = useMyNavigation()
  const [fakeSession, setfakeSession] = useState<any>(undefined)

  // next auth sessionの取得
  const {data: getSessoin, status} = useSession()
  const realSession = (status === 'loading' ? props?.session?.user : getSessoin?.user) as unknown as User

  // fakeSessionの取得
  const {globalUserId} = judgeIsAdmin(realSession, query)

  useEffect(() => {
    FakeOrKeepSession({query, realSession}).then(res => {
      setfakeSession(res ?? null)
    })
  }, [globalUserId, realSession, query])

  const fakeSessionLoading = fakeSession === undefined

  //fakeSession || realSession
  const userData = useMemo(
    () => ({
      ...realSession,
      ...fakeSession,
      role: realSession?.role,
    }),
    [fakeSession, realSession, globalUserId]
  )

  const {roles, roleIsLoading} = useUserRole({session: userData})

  const sessionLoading = fakeSessionLoading || status === 'loading' || roleIsLoading

  const accessScopes = useCallback(() => getScopes(userData, {query, roles}), [userData, query, roles])

  const User = new UserCl({
    user: userData,
    roles,
    scopes: getScopes(userData, {query, roles}),
  })

  return {
    sessionLoading,
    status,
    accessScopes,
    fakeSession,
    session: User.data,
    roles,
    useMySessionDependencies: [JSON.stringify(roles), sessionLoading, status],
  }
}
