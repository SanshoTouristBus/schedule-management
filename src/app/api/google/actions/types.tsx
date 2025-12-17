export type sheetApiType = {
  spreadsheetId: string
  range?: string
  values?: (string | number | null | undefined | Date)[][]
  mode?: 'read' | 'append' | 'update'
}

export type read_append_resultType = {
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

export type sheetApiResultType = {
  success: boolean
  result: {
    append?: read_append_resultType
    read?: read_append_resultType
    update?: read_append_resultType
  }
  message: string
}
