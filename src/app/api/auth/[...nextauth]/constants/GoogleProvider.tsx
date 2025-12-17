import {doStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'
import GoogleProvider from 'next-auth/providers/google'
export const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  profile: async (profile, tokens) => {
    const {result: user} = await doStandardPrisma(`user`, `findUnique`, {
      where: {email: profile.email},
    })

    const userInfoSpread = user ?? {}

    return {id: profile.sub, ...userInfoSpread}
  },
})
