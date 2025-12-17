'use server'

import {basePath} from '@cm/lib/methods/common'
import {google} from 'googleapis'
export const getAuth = async () => {
  let credential = process.env.GOOGLE_SHEET_API_SERVICE_ACCOUNT_CREDENTIALS ?? ''

  credential = credential.replace(/: |\n/g, ':')
  const credentials = JSON.parse(credential)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata',
      'https://www.googleapis.com/auth/spreadsheets',
      // 'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/presentations',
    ],
  })
  return auth
}

export const getOauthClient = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    basePath + process.env.GOOGLE_REDIRECT_URI
  )

  return oauth2Client
}
