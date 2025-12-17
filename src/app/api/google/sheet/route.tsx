import {NextRequest, NextResponse} from 'next/server'

import {google} from 'googleapis'
export async function POST(req: NextRequest) {
  const body: sheetApiType = await req.json()

  const {spreadsheetId, mode = 'read'} = body
  let credential = process.env.GOOGLE_SHEET_API_SERVICE_ACCOUNT_CREDENTIALS ?? ''
  credential = credential.replace(/: |\n/g, ':')
  const credentials = JSON.parse(credential)
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({version: 'v4', auth})
    if (mode === 'write') {
      //書き込み===============================
      const {values, range} = body
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {values},
      })

      return NextResponse.json({success: true, result: res, message: `データを書き込みました`})
    } else {
      //読み込み===============================
      const {range} = body
      const res = await sheets.spreadsheets.values.get({spreadsheetId, range})
      return NextResponse.json({
        success: true,
        result: res,
        message: `データを取得しました`,
      })
    }
  } catch (error) {
    console.error(error.stack)
    return NextResponse.json({success: false, result: [], message: `認証に失敗しました`})
  }
}

export type sheetApiType = {
  spreadsheetId: string
  range?: string
  values?: (string | number | null | undefined | Date)[][]
  mode?: 'read' | 'write'
}

export type sheetApiResultType = {
  success: boolean
  result: {
    config?: {
      url: string
      method: string
      headers: {
        'x-goog-api-client': string
        'Accept-Encoding': string
        'User-Agent': string
        Authorization: string
        'Content-Type': string
      }
      params: {
        valueInputOption?: string
        insertDataOption?: string
      }
      data?: {
        values: (string | number)[][]
      }
    }
    data: {
      spreadsheetId: string
      tableRange?: string
      updates?: {
        spreadsheetId: string
        updatedRange: string
        updatedRows: number
        updatedColumns: number
        updatedCells: number
      }
      values?: any[][]
    }
    headers: {
      'content-type': string
      date: string
      server: string
      [key: string]: string
    }
    status: number
    statusText: string
  }
  message: string
}
