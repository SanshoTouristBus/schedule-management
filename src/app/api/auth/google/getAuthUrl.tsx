'use server'

import {getOauthClient} from '@app/api/auth/google/getAuth'
import {basePath} from '@cm/lib/methods/common'

// 認証URLの生成
export const getAuthUrl = async () => {
  const oauth2Client = await getOauthClient()
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    redirect_uri: basePath + process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: [
      //
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/presentations',
    ],
  })

  return authUrl
}
