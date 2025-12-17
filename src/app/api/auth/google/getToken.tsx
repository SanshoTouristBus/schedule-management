'use server'

import {getOauthClient} from '@app/api/auth/google/getAuth'

// トークンの取得
export async function getToken(code: string) {
  const oauth2Client = await getOauthClient()
  const {tokens} = await oauth2Client.getToken(code)
  return tokens
}
