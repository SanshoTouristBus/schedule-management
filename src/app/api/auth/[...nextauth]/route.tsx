import NextAuth from 'next-auth'
import {authOptions} from '@app/api/auth/[...nextauth]/constants/authOptions'
const handler = await NextAuth(authOptions)

export {handler as GET, handler as POST}
