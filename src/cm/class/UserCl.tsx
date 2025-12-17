import {userRoleType} from '@cm/hooks/useUserRole'
import {User} from '@prisma/generated/prisma/client'

import {getScopes} from 'src/non-common/scope-lib/getScopes'

export type userClData = User & {
  avatar?: string | null
  roles: userRoleType[]
  scopes: ReturnType<typeof getScopes>
}

export class UserCl {
  data: userClData
  constructor(props: {user: User; roles: userRoleType[]; scopes: ReturnType<typeof getScopes>}) {
    this.data = {
      ...props.user,
      scopes: props.scopes,
      roles: props.roles,
    }
  }
}
