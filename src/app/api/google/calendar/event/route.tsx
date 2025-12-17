import {google} from 'googleapis'
import {NextRequest, NextResponse} from 'next/server'
import {getClientConfig} from '@app/api/google/lib/server-actions'
import {requestResultType} from '@cm/types/types'

import {getValidToken} from '@app/api/google/lib/middleware'
import {Days} from '@cm/class/Days/Days'

const defaultEvent = {
  calendarId: 'primary',
  requestBody: {
    summary: 'Sample Event',
    description: 'This is a sample event created using Google Calendar API.',
    start: {dateTime: new Date().toISOString()},
    end: {dateTime: Days.hour.add(new Date(), 2).toISOString()},
  },
}

export async function POST(req: NextRequest) {
  let result: requestResultType = {success: false, message: ``, result: null}

  const {tokenId, email, eventCreateObjectProps = defaultEvent} = await req.json()

  try {
    // トークンの有効性を確認し、必要に応じて更新
    const validToken = await getValidToken(email)

    const clientConfig = await getClientConfig()

    if (clientConfig === undefined) {
      result = {success: false, message: `Invalid client_id`, result: null}
      return NextResponse.json(result, {status: 400})
    }

    const oAuth2Client = new google.auth.OAuth2(clientConfig.clientId, clientConfig.clientSecret)
    oAuth2Client.setCredentials(validToken.result)

    const calendar = google.calendar({version: 'v3', auth: oAuth2Client})

    const response = await calendar.events.insert(eventCreateObjectProps)

    return NextResponse.json({success: true, message: `予定を作成しました。`, result: response.data})
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}
