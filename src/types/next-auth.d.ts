import {userClData} from '@cm/class/UserCl'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: userClData
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
    error?: string
    email: string
    name: string
    emailVerified?: boolean
    sub?: string
    userStatus?: string
    type: 'parent' | 'child'
    familyId: string
    familyName: string
    avatar?: string | null
    children?: {
      id: string
      name: string
      avatar: string | null
    }[]
  }
}
