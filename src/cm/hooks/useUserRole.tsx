import {RoleMaster} from '@prisma/generated/prisma/client'
import {fetchUserRole} from 'src/non-common/serverSideFunction'
import useSWR from 'swr'

export type userRoleType = RoleMaster & {name: string; color: string | null}[]
export default function useUserRole({session}) {
  const {data, isLoading} = useSWR(JSON.stringify(session), async () => {
    const result = await fetchUserRole({session})

    return result
  })

  const roles = data?.roles as userRoleType[]

  return {roles, roleIsLoading: isLoading}
}
