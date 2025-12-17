'use server'

import {getAuth} from '@app/api/auth/google/getAuth'
import {convert_GoogleURL_to_ID} from '@app/api/google/actions/convert_GoogleURL_to_ID'
import {google, sheets_v4} from 'googleapis'

export const GoogleSheet_Get = async (props: {spreadsheetId: string}) => {
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)

  const auth = await getAuth()
  const sheets = google.sheets({version: 'v4', auth})
  const res = await sheets.spreadsheets.get({spreadsheetId})
  const {data, config} = res

  return data
}

export const GoogleSheet_getSheetByName = async (props: {spreadsheetId: string; sheetName: string}) => {
  const data = await GoogleSheet_Get({spreadsheetId: props.spreadsheetId})
  const sheet = data.sheets?.find(item => item.properties?.title === props.sheetName)

  return sheet
}
export const GoogleSheet_getSheetByNameOrCreate = async (props: {spreadsheetId: string; sheetName: string}) => {
  const {sheetName} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)

  const data = await GoogleSheet_Get({spreadsheetId})
  const sheet = data.sheets?.find(item => item.properties?.title === sheetName)

  if (sheet) {
    return sheet
  } else {
    const auth = await getAuth()
    const sheets = google.sheets({version: 'v4', auth})
    const res = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {properties: {title: props.sheetName}},
          },
        ],
      },
    })

    return await GoogleSheet_getSheetByNameOrCreate({
      spreadsheetId,
      sheetName,
    })
  }

  return sheet
}

export const GoogleSheet_Read = async (props: {
  range: string
  spreadsheetId: string
  valueRenderOption?: 'UNFORMATTED_VALUE' | 'FORMATTED_VALUE'
}) => {
  const {range, valueRenderOption = 'FORMATTED_VALUE'} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = await getAuth()
  const sheets = google.sheets({version: 'v4', auth})

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption,
  })
  const {data, config} = res
  return data
}

export const GoogleSheet_Update = async (props: {range: string; spreadsheetId: string; values: string[][]}) => {
  const {range, values} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = await getAuth()
  const sheets = google.sheets({version: 'v4', auth})

  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {values},
  })

  return {success: true, result: {update: res}, message: `データを更新しました`}
}

export const GoogleSheet_Append = async (props: {range: string; spreadsheetId: string; values: string[][]}) => {
  const {range, values} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = await getAuth()
  const sheets = google.sheets({version: 'v4', auth})
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {values},
  })
  const {data, config} = res
  return data
}

export const GoogleSheet_BatchUpdate = async (props: {spreadsheetId: string; requests: sheets_v4.Schema$Request[]}) => {
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)

  const auth = await getAuth()
  const sheets = google.sheets({version: 'v4', auth})

  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {requests: props.requests},
  })

  const {data, config} = res
  return data
}

export const GoogleSheet_copy = async (props: {fromSSId: string; destinationFolderId: string; fileName?: string}) => {
  const fileName = props.fileName
  const fromSpreadsheetId = convert_GoogleURL_to_ID(props.fromSSId)
  const destinationFolderId = convert_GoogleURL_to_ID(props.destinationFolderId)

  const auth = await getAuth()

  const drive = google.drive({version: 'v3', auth})

  // スプレッドシートをコピー
  const copyRes = await drive.files.copy({
    fileId: fromSpreadsheetId,
    requestBody: {name: fileName ?? undefined, parents: [destinationFolderId]},
    supportsAllDrives: true,
  })

  return copyRes.data
}

export const GoogleSheet_GetSheetList = async (props: {spreadsheetId: string}) => {
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = await getAuth()
  const sheets = google.sheets({version: 'v4', auth})

  const sheetList = (await sheets.spreadsheets.get({spreadsheetId})).data.sheets

  return sheetList
}

export const getSheetIdx = async (props: {sheetList: sheets_v4.Schema$Sheet[] | undefined; sheetName: string}) => {
  const {sheetList = [], sheetName} = props
  const sheet = sheetList.find(sheet => sheet.properties?.title === sheetName)
  return sheet?.properties?.sheetId
}
